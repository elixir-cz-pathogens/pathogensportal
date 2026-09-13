"""Integration tests against a REAL PostgreSQL (PP-12).

Everything else in this directory mocks the database, which proves the HTTP layer
and nothing about whether our SQL is valid, whether the schema we assume matches
the one `pathogensportal-db` ships, or whether `DISTINCT ON` really returns the
freshest row. Those only break against a real server.

⛔ Skipped unless `PP_TEST_DB=1`, so a developer without a database still gets a
green `pytest`. The CI job that provides the database sets it AND asserts that
these tests actually ran — a skipped integration suite reports the same green as
a passing one, and that is the failure mode this whole file exists to avoid.

The schema comes from `pathogensportal-db/db/init.sql` — the submodule owns it.
Testing against a hand-written copy would only prove our copy agrees with itself.
"""

from __future__ import annotations

import json
import os
from datetime import datetime, timedelta, timezone
from pathlib import Path

import psycopg
import pytest
from fastapi.testclient import TestClient

from app import charts, db
from app.main import app

pytestmark = pytest.mark.skipif(
    os.getenv("PP_TEST_DB") != "1",
    reason="needs a real PostgreSQL; set PP_TEST_DB=1",
)

INIT_SQL = Path(__file__).resolve().parents[3] / "pathogensportal-db" / "db" / "init.sql"
NOW = datetime(2026, 9, 7, 12, 0, tzinfo=timezone.utc)


@pytest.fixture(scope="module")
def schema():
    """Applies the submodule's init.sql, then clears the table between runs."""
    assert INIT_SQL.is_file(), (
        f"{INIT_SQL} is missing — the pathogensportal-db submodule is not checked "
        "out. The schema must come from the submodule, not from a copy."
    )
    with db.connect() as conn:
        conn.execute(INIT_SQL.read_text())
    yield
    with db.connect() as conn:
        conn.execute("DELETE FROM dashboard_data")


@pytest.fixture
def clean(schema):
    with db.connect() as conn:
        conn.execute("DELETE FROM dashboard_data")
    yield


def _insert(key, group, payload, recorded_at):
    with db.connect() as conn:
        conn.execute(
            "INSERT INTO dashboard_data (dashboard_slug, data_key, data_value, recorded_at)"
            " VALUES (%s, %s, %s, %s)",
            (group, key, json.dumps(payload), recorded_at),
        )


@pytest.mark.integration
def test_ping_succeeds_against_a_live_database():
    db.ping()


@pytest.mark.integration
def test_health_reports_the_database_as_ok():
    r = TestClient(app).get("/health")
    assert r.status_code == 200
    assert r.json()["database"] == "ok"


@pytest.mark.integration
def test_schema_from_the_submodule_matches_what_charts_py_queries(clean):
    """The columns charts.py selects must exist in the submodule's schema.

    ⚠️ This is the test that would have caught a silent drift: `db.py` carries its
    own copy of the CREATE TABLE for standalone runs, and nothing forced the two
    to agree.
    """
    _insert("covid_cases_weekly", "covid", {"labels": ["KT 1"]}, NOW)
    rows = charts.list_charts()
    assert [c.key for c in rows] == ["covid_cases_weekly"]
    assert rows[0].group == "covid"
    assert rows[0].payload == {"labels": ["KT 1"]}
    assert rows[0].recorded_at == NOW


@pytest.mark.integration
def test_only_the_freshest_row_per_key_is_returned(clean):
    """`DISTINCT ON` + `ORDER BY` is the kind of SQL a mock cannot check."""
    _insert("flu_weekly", "flu", {"v": "old"}, NOW - timedelta(days=2))
    _insert("flu_weekly", "flu", {"v": "new"}, NOW)
    _insert("flu_weekly", "flu", {"v": "older"}, NOW - timedelta(days=9))

    assert len(charts.list_charts()) == 1
    assert charts.get_chart("flu_weekly").payload == {"v": "new"}


@pytest.mark.integration
def test_the_unique_key_keeps_history_rather_than_overwriting(clean):
    """`UNIQUE (dashboard_slug, data_key, recorded_at)` is deliberate: the same
    key at a different time is a new row, not a replacement. Losing that would
    silently turn the table from a history into a snapshot."""
    _insert("isin_monthly", "isin", {"n": 1}, NOW - timedelta(days=1))
    _insert("isin_monthly", "isin", {"n": 2}, NOW)
    with db.connect() as conn:
        total = conn.execute(
            "SELECT count(*) FROM dashboard_data WHERE data_key = 'isin_monthly'"
        ).fetchone()[0]
    assert total == 2, "the second insert replaced the first — history was lost"

    with pytest.raises(psycopg.errors.UniqueViolation):
        _insert("isin_monthly", "isin", {"n": 3}, NOW)


@pytest.mark.integration
def test_api_charts_end_to_end(clean):
    """Apache → website-be → DB, minus Apache: the whole path in one request."""
    _insert("covid_cases_weekly", "covid", {"labels": ["KT 1"], "datasets": []}, NOW)
    client = TestClient(app)

    listing = client.get("/api/charts")
    assert listing.status_code == 200
    assert [c["key"] for c in listing.json()["charts"]] == ["covid_cases_weekly"]

    one = client.get("/api/charts/covid_cases_weekly")
    assert one.status_code == 200
    assert one.json()["labels"] == ["KT 1"]

    assert client.get("/api/charts/nothing_like_this").status_code == 404


@pytest.mark.integration
def test_unreachable_database_gives_503_not_a_stack_trace(monkeypatch, clean):
    """The contract the frontend relies on: 503 → fall back to the static JSON."""
    # ⚠️ `db.settings`, not `charts.settings` — charts.py never imports settings,
    # it goes through db.connect(). Patching the wrong module silently patches
    # nothing and the test would pass for the wrong reason.
    # Port 1 is privileged and closed: a real connection attempt that really fails.
    monkeypatch.setattr(db.settings, "db_port", 1)
    r = TestClient(app).get("/api/charts")
    assert r.status_code == 503
    assert "password" not in r.text.lower()
