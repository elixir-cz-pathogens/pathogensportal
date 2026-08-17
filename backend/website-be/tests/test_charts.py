from datetime import datetime, timezone

import psycopg
import pytest
from fastapi.testclient import TestClient

from app import charts
from app.loader import group_of
from app.main import app

client = TestClient(app)

RECORDED_AT = datetime(2026, 7, 19, 15, 27, tzinfo=timezone.utc)
PAYLOAD = {"labels": ["KT 1"], "datasets": [{"label": "Influenza A", "data": [866]}]}


def _chart(key="flu_weekly"):
    return charts.Chart(key=key, group="flu", payload=PAYLOAD, recorded_at=RECORDED_AT)


def test_chart_payload_is_returned_verbatim(monkeypatch):
    """The API response must be identical to the static JSON — the FE fallback rests on it."""
    monkeypatch.setattr(charts, "get_chart", lambda key: _chart(key))
    r = client.get("/api/charts/flu_weekly")
    assert r.status_code == 200
    assert r.json() == PAYLOAD
    assert r.headers["X-Recorded-At"] == RECORDED_AT.isoformat()


def test_list_charts(monkeypatch):
    monkeypatch.setattr(charts, "list_charts", lambda: [_chart()])
    r = client.get("/api/charts")
    assert r.status_code == 200
    assert r.json()["charts"] == [
        {"key": "flu_weekly", "group": "flu", "recorded_at": RECORDED_AT.isoformat()}
    ]


def test_unknown_chart_is_404(monkeypatch):
    monkeypatch.setattr(charts, "get_chart", lambda key: None)
    assert client.get("/api/charts/neexistuje").status_code == 404


@pytest.mark.parametrize("key", ["Flu-Weekly", "flu_weekly; DROP TABLE dashboard_data", "*"])
def test_invalid_key_never_reaches_db(key, monkeypatch):
    def boom(_key):
        raise AssertionError("the DB query should never have run")

    monkeypatch.setattr(charts, "get_chart", boom)
    assert client.get(f"/api/charts/{key}").status_code == 404


def test_db_down_is_503(monkeypatch):
    """Without a DB the API returns 503, so the frontend knows to fall back to static data."""

    def unavailable(*_args):
        raise psycopg.OperationalError("connection refused")

    monkeypatch.setattr(charts, "list_charts", unavailable)
    monkeypatch.setattr(charts, "get_chart", unavailable)
    assert client.get("/api/charts").status_code == 503
    assert client.get("/api/charts/flu_weekly").status_code == 503


@pytest.mark.parametrize(
    "key, expected",
    [
        ("covid_cases_weekly", "covid"),
        ("flu_regional_weekly", "flu"),
        ("isin_age_groups", "isin"),
        ("bezpodtrzitka", "bezpodtrzitka"),
    ],
)
def test_group_of(key, expected):
    assert group_of(key) == expected
