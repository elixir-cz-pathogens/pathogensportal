"""PostgreSQL access.

Connections are opened on demand and closed immediately — the portal's traffic is
on the order of a few queries per second, so a pool would only add configuration.
When the DB is down, `connect()` raises `psycopg.OperationalError`; the caller
translates that into HTTP 503 and the frontend falls back to the static JSON.
"""

from __future__ import annotations

import contextlib
from typing import Iterator

import psycopg

from .config import settings

# Mirrors `db/init.sql` from the pathogensportal-db submodule, so that website-be
# also works against a database where the init script never ran (a standalone run,
# a test DB). The submodule owns the schema — keep the two in sync.
SCHEMA_STATEMENTS = (
    """
    CREATE TABLE IF NOT EXISTS dashboard_data (
        id             SERIAL PRIMARY KEY,
        dashboard_slug VARCHAR(255) NOT NULL,
        data_key       VARCHAR(255) NOT NULL,
        data_value     JSONB,
        recorded_at    TIMESTAMPTZ NOT NULL,
        updated_at     TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE (dashboard_slug, data_key, recorded_at)
    )
    """,
    "CREATE INDEX IF NOT EXISTS idx_dashboard_data_slug ON dashboard_data (dashboard_slug)",
    "CREATE INDEX IF NOT EXISTS idx_dashboard_data_recorded ON dashboard_data (recorded_at DESC)",
)


@contextlib.contextmanager
def connect() -> Iterator[psycopg.Connection]:
    """Opens a connection; commits and closes it when the block exits."""
    with psycopg.connect(settings.dsn) as conn:
        yield conn


def ensure_schema() -> None:
    with connect() as conn:
        for statement in SCHEMA_STATEMENTS:
            conn.execute(statement)
