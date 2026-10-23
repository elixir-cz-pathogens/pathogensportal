"""PostgresStore against a REAL PostgreSQL (TODO D15).

The API tests run on MemoryStore, which proves the flow and nothing about the
SQL: column order in the row mappers, the CHECK constraints, UUID round-trips,
JSONB. Those only break against a real server. Skipped unless PP_TEST_DB=1,
like test_integration_db.py.
"""

from __future__ import annotations

import os
from datetime import datetime, timezone

import psycopg
import pytest

from app import db
from app.config import settings
from app.intake import keys
from app.intake.store import PostgresStore, Upload

pytestmark = pytest.mark.skipif(os.getenv("PP_TEST_DB") != "1", reason="needs a real PostgreSQL; set PP_TEST_DB=1")

FORM = {
    "name": "Jana Nováková", "email": "jana@example.org", "institution": "Zkušební ústav",
    "position": "", "description": "Týdenní počty", "origin": "Laboratoř", "frequency": "týdně", "link": "",
}


@pytest.fixture
def store():
    # The fixture DROPS the intake schema. PP_TEST_DB=1 alone is not enough of a
    # guard: inside the server's container DB_HOST is `pathogen-db`, and one
    # mistyped command there would delete real requests and provider keys. CI
    # and a local throwaway container both reach the database on loopback.
    if settings.db_host not in ("127.0.0.1", "localhost", "::1"):
        pytest.fail(f"refusing to DROP SCHEMA intake on DB_HOST={settings.db_host!r}; use a throwaway DB on loopback")
    with db.connect() as conn:
        conn.execute("DROP SCHEMA IF EXISTS intake CASCADE")
    s = PostgresStore()
    s.ensure_schema()
    s.ensure_schema()  # idempotent: a restart must not fail
    return s


def test_request_provider_upload_round_trip(store):
    r = store.add_request(FORM)
    assert store.get_request(r.id) == r
    assert [x.id for x in store.list_requests("pending")] == [r.id]

    key = keys.generate()
    p = store.add_provider(r, keys.digest(key), keys.display_prefix(key), "zkusebni-ustav")
    approved = store.decide_request(r.id, "approved", "test")
    assert approved.status == "approved" and approved.decided_by == "test"
    assert store.provider_by_key_hash(keys.digest(key)) == p

    u = store.add_upload(Upload(
        id="00000000-0000-4000-8000-000000000001", provider_id=p.id,
        received_at=datetime(2026, 10, 16, tzinfo=timezone.utc), template="agregace-v1",
        filename="data.csv", sha256="0" * 64, rows=3, status="accepted",
        report={"ok": True, "issues": [{"message": "příliš malé počty"}]}, path="/intake/x",
        declaration="prohlaseni-v1",
    ))
    assert store.list_uploads(p.id) == [u]
    assert store.find_accepted(p.id, "0" * 64) == u
    assert store.find_accepted(p.id, "1" * 64) is None
    assert store.count_uploads_since(p.id, datetime(2026, 10, 15, tzinfo=timezone.utc)) == 1
    assert store.count_uploads_since(p.id, datetime(2026, 10, 17, tzinfo=timezone.utc)) == 0

    store.revoke_provider(p.id)
    assert store.provider_by_key_hash(keys.digest(key)) is None
    assert not store.list_providers()[0].active


def test_status_check_constraint(store):
    r = store.add_request(FORM)
    with pytest.raises(psycopg.errors.CheckViolation):
        store.decide_request(r.id, "maybe", "test")


def test_unknown_ids_raise_keyerror(store):
    with pytest.raises(KeyError):
        store.decide_request("00000000-0000-4000-8000-0000000000ff", "approved", "test")
    with pytest.raises(KeyError):
        store.revoke_provider("00000000-0000-4000-8000-0000000000ff")


def test_purge_rejected_requests(store):
    from datetime import timedelta

    old = store.add_request(FORM)
    store.decide_request(old.id, "rejected", "test")
    with db.connect() as conn:
        conn.execute("UPDATE intake.requests SET decided_at = decided_at - interval '400 days' WHERE id = %s", (old.id,))
    fresh = store.add_request(FORM)
    store.decide_request(fresh.id, "rejected", "test")
    assert store.purge_rejected_requests(datetime.now(timezone.utc) - timedelta(days=365)) == 1
    assert store.get_request(old.id) is None and store.get_request(fresh.id) is not None


def test_cli_issue_creates_an_approved_provider_and_prints_the_key_once(store, capsys):
    from app.intake import cli

    assert cli.main(["issue", "--slug", "svu-praha-omb", "--name", "Alexandr Test",
                     "--email", "a@example.org", "--institution", "SVÚ Praha", "--by", "test"]) == 0
    key = capsys.readouterr().out.strip().splitlines()[-1]
    p = store.provider_by_key_hash(keys.digest(key))
    assert p is not None and p.slug == "svu-praha-omb" and p.institution == "SVÚ Praha"
    r = store.get_request(p.request_id)
    assert r.status == "approved" and r.decided_by == "test"
    # Only the hash is stored.
    with db.connect() as conn:
        assert conn.execute("SELECT count(*) FROM intake.providers WHERE key_hash = %s", (key,)).fetchone()[0] == 0


def test_cli_refuses_a_bad_slug(store):
    from app.intake import cli

    with pytest.raises(SystemExit):
        cli.main(["issue", "--slug", "../etc", "--name", "x", "--email", "x@example.org", "--institution", "x"])
