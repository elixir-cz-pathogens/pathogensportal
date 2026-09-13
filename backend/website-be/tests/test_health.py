import psycopg
import pytest
from fastapi.testclient import TestClient

from app import db
from app.main import app

client = TestClient(app)


def test_health_reports_ok_when_the_database_answers(monkeypatch):
    monkeypatch.setattr(db, "ping", lambda: None)
    r = client.get("/health")
    assert r.status_code == 200
    body = r.json()
    assert body["status"] == "ok"
    assert body["service"] == "website-be"
    assert body["database"] == "ok"


def test_health_reports_the_database_as_unavailable(monkeypatch):
    def boom():
        raise psycopg.OperationalError("connection refused")

    monkeypatch.setattr(db, "ping", boom)
    r = client.get("/health")

    # ⛔ Still 200. The service is healthy without the database by design —
    # /api/charts answers 503 and the frontend falls back to the static JSON.
    # Returning 503 here would make an orchestrator restart a process that is
    # working as intended, and the restart would not bring the database back.
    assert r.status_code == 200
    assert r.json()["status"] == "ok"
    assert r.json()["database"] == "unavailable"


def test_health_does_not_leak_the_database_error(monkeypatch):
    """A health endpoint is usually the most public thing a service has."""
    def boom():
        raise psycopg.OperationalError(
            'connection to server at "pathogen-db" failed: password authentication '
            'failed for user "portal"'
        )

    monkeypatch.setattr(db, "ping", boom)
    body = r'{}'.format(client.get("/health").text)
    for leak in ("password", "portal", "pathogen-db"):
        assert leak not in body, f"health leaked {leak!r}"
