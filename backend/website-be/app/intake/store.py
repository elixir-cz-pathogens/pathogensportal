"""Where requests, providers and uploads are recorded (TODO D15).

Two implementations of one interface: `PostgresStore` for the running service,
`MemoryStore` for tests and for running the API with no database at all.

The intake tables live in their own `intake` schema. They are the portal's
operational records (who asked, who may upload, what arrived), not surveillance
data, so they are owned here and not by pathogensportal-db, which owns the data
model (TODO D9). The uploaded FILES are not in the database: they go to disk,
see `files.py`.
"""

from __future__ import annotations

import json
import uuid
from dataclasses import dataclass, field, replace
from datetime import datetime, timezone
from typing import Protocol


def _now() -> datetime:
    return datetime.now(timezone.utc)


@dataclass(frozen=True)
class Request:
    id: str
    created_at: datetime
    name: str
    email: str
    institution: str
    position: str
    description: str
    origin: str
    frequency: str
    link: str
    status: str = "pending"  # pending | approved | rejected
    decided_at: datetime | None = None
    decided_by: str = ""
    note: str = ""


@dataclass(frozen=True)
class Provider:
    id: str
    request_id: str
    name: str
    institution: str
    email: str
    key_hash: str
    key_prefix: str
    created_at: datetime
    revoked_at: datetime | None = None
    # Directory name of the provider's hand-over tree (files.write_export). Not
    # unique on purpose: a replacement key for the same institution keeps the slug,
    # so its data keep landing in the same place.
    slug: str = ""

    @property
    def active(self) -> bool:
        return self.revoked_at is None


@dataclass(frozen=True)
class Upload:
    id: str
    provider_id: str
    received_at: datetime
    template: str
    filename: str
    sha256: str
    rows: int
    status: str  # accepted | rejected
    report: dict = field(default_factory=dict)
    path: str = ""
    declaration: str = ""  # key of the declaration ticked (declaration.py)


REQUEST_FIELDS = ("name", "email", "institution", "position", "description", "origin", "frequency", "link")


class Store(Protocol):
    def add_request(self, data: dict) -> Request: ...
    def get_request(self, request_id: str) -> Request | None: ...
    def list_requests(self, status: str | None = None) -> list[Request]: ...
    def decide_request(self, request_id: str, status: str, by: str, note: str = "") -> Request: ...
    def add_provider(self, request: Request, key_hash: str, key_prefix: str, slug: str = "") -> Provider: ...
    def provider_by_key_hash(self, key_hash: str) -> Provider | None: ...
    def list_providers(self) -> list[Provider]: ...
    def revoke_provider(self, provider_id: str) -> Provider: ...
    def add_upload(self, upload: Upload) -> Upload: ...
    def list_uploads(self, provider_id: str | None = None) -> list[Upload]: ...
    def find_accepted(self, provider_id: str, sha256: str) -> Upload | None: ...
    def count_uploads_since(self, provider_id: str, since: datetime) -> int: ...
    def purge_rejected_requests(self, decided_before: datetime) -> int: ...


class MemoryStore:
    def __init__(self) -> None:
        self.requests: dict[str, Request] = {}
        self.providers: dict[str, Provider] = {}
        self.uploads: dict[str, Upload] = {}

    def add_request(self, data: dict) -> Request:
        r = Request(id=str(uuid.uuid4()), created_at=_now(), **{k: data.get(k, "") for k in REQUEST_FIELDS})
        self.requests[r.id] = r
        return r

    def get_request(self, request_id: str) -> Request | None:
        return self.requests.get(request_id)

    def list_requests(self, status: str | None = None) -> list[Request]:
        rows = [r for r in self.requests.values() if status is None or r.status == status]
        return sorted(rows, key=lambda r: r.created_at)

    def decide_request(self, request_id: str, status: str, by: str, note: str = "") -> Request:
        r = replace(self.requests[request_id], status=status, decided_at=_now(), decided_by=by, note=note)
        self.requests[request_id] = r
        return r

    def add_provider(self, request: Request, key_hash: str, key_prefix: str, slug: str = "") -> Provider:
        p = Provider(
            id=str(uuid.uuid4()), request_id=request.id, name=request.name,
            institution=request.institution, email=request.email,
            key_hash=key_hash, key_prefix=key_prefix, created_at=_now(), slug=slug,
        )
        self.providers[p.id] = p
        return p

    def provider_by_key_hash(self, key_hash: str) -> Provider | None:
        return next((p for p in self.providers.values() if p.key_hash == key_hash and p.active), None)

    def list_providers(self) -> list[Provider]:
        return sorted(self.providers.values(), key=lambda p: p.created_at)

    def revoke_provider(self, provider_id: str) -> Provider:
        p = replace(self.providers[provider_id], revoked_at=_now())
        self.providers[provider_id] = p
        return p

    def add_upload(self, upload: Upload) -> Upload:
        self.uploads[upload.id] = upload
        return upload

    def list_uploads(self, provider_id: str | None = None) -> list[Upload]:
        rows = [u for u in self.uploads.values() if provider_id is None or u.provider_id == provider_id]
        return sorted(rows, key=lambda u: u.received_at)

    def find_accepted(self, provider_id: str, sha256: str) -> Upload | None:
        return next((u for u in self.list_uploads(provider_id) if u.sha256 == sha256 and u.status == "accepted"), None)

    def count_uploads_since(self, provider_id: str, since: datetime) -> int:
        return sum(1 for u in self.uploads.values() if u.provider_id == provider_id and u.received_at >= since)

    def purge_rejected_requests(self, decided_before: datetime) -> int:
        doomed = [r.id for r in self.requests.values()
                  if r.status == "rejected" and r.decided_at is not None and r.decided_at < decided_before]
        for rid in doomed:
            del self.requests[rid]
        return len(doomed)


SCHEMA = (
    "CREATE SCHEMA IF NOT EXISTS intake",
    """
    CREATE TABLE IF NOT EXISTS intake.requests (
        id          UUID PRIMARY KEY,
        created_at  TIMESTAMPTZ NOT NULL,
        name        TEXT NOT NULL,
        email       TEXT NOT NULL,
        institution TEXT NOT NULL,
        position    TEXT NOT NULL DEFAULT '',
        description TEXT NOT NULL,
        origin      TEXT NOT NULL,
        frequency   TEXT NOT NULL,
        link        TEXT NOT NULL DEFAULT '',
        status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
        decided_at  TIMESTAMPTZ,
        decided_by  TEXT NOT NULL DEFAULT '',
        note        TEXT NOT NULL DEFAULT ''
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS intake.providers (
        id          UUID PRIMARY KEY,
        request_id  UUID NOT NULL REFERENCES intake.requests (id),
        name        TEXT NOT NULL,
        institution TEXT NOT NULL,
        email       TEXT NOT NULL,
        key_hash    TEXT NOT NULL UNIQUE,
        key_prefix  TEXT NOT NULL,
        created_at  TIMESTAMPTZ NOT NULL,
        revoked_at  TIMESTAMPTZ
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS intake.uploads (
        id          UUID PRIMARY KEY,
        provider_id UUID NOT NULL REFERENCES intake.providers (id),
        received_at TIMESTAMPTZ NOT NULL,
        template    TEXT NOT NULL,
        filename    TEXT NOT NULL,
        sha256      TEXT NOT NULL,
        rows        INTEGER NOT NULL,
        status      TEXT NOT NULL CHECK (status IN ('accepted', 'rejected')),
        report      JSONB NOT NULL,
        path        TEXT NOT NULL DEFAULT '',
        declaration TEXT NOT NULL DEFAULT ''
    )
    """,
    # Added 22 Oct 2026 — for a database created before the column existed.
    "ALTER TABLE intake.uploads ADD COLUMN IF NOT EXISTS declaration TEXT NOT NULL DEFAULT ''",
    # Added 23 Oct 2026 — the hand-over directory name, see Provider.slug.
    "ALTER TABLE intake.providers ADD COLUMN IF NOT EXISTS slug TEXT NOT NULL DEFAULT ''",
    # Duplicate check and the daily limit both look up a provider's uploads.
    "CREATE INDEX IF NOT EXISTS uploads_provider_sha ON intake.uploads (provider_id, sha256)",
    "CREATE INDEX IF NOT EXISTS uploads_provider_time ON intake.uploads (provider_id, received_at)",
)

_REQ_COLS = "id, created_at, " + ", ".join(REQUEST_FIELDS) + ", status, decided_at, decided_by, note"
_PROV_COLS = "id, request_id, name, institution, email, key_hash, key_prefix, created_at, revoked_at, slug"
_UP_COLS = "id, provider_id, received_at, template, filename, sha256, rows, status, report, path, declaration"


def _req(row) -> Request:
    return Request(str(row[0]), row[1], *row[2:10], row[10], row[11], row[12], row[13])


def _prov(row) -> Provider:
    return Provider(str(row[0]), str(row[1]), *row[2:])


def _up(row) -> Upload:
    return Upload(str(row[0]), str(row[1]), *row[2:])


class PostgresStore:
    """Every method opens its own connection — the traffic is a handful of requests a day."""

    def __init__(self) -> None:
        from .. import db  # imported here so MemoryStore users need no psycopg

        self._db = db

    def ensure_schema(self) -> None:
        with self._db.connect() as conn:
            for statement in SCHEMA:
                conn.execute(statement)

    def add_request(self, data: dict) -> Request:
        r = MemoryStore().add_request(data)
        with self._db.connect() as conn:
            conn.execute(
                f"INSERT INTO intake.requests (id, created_at, {', '.join(REQUEST_FIELDS)}) "
                f"VALUES (%s, %s, {', '.join(['%s'] * len(REQUEST_FIELDS))})",
                (r.id, r.created_at, *(getattr(r, k) for k in REQUEST_FIELDS)),
            )
        return r

    def get_request(self, request_id: str) -> Request | None:
        with self._db.connect() as conn:
            row = conn.execute(f"SELECT {_REQ_COLS} FROM intake.requests WHERE id = %s", (request_id,)).fetchone()
        return _req(row) if row else None

    def list_requests(self, status: str | None = None) -> list[Request]:
        sql = f"SELECT {_REQ_COLS} FROM intake.requests"
        args: tuple = ()
        if status:
            sql += " WHERE status = %s"
            args = (status,)
        with self._db.connect() as conn:
            return [_req(r) for r in conn.execute(sql + " ORDER BY created_at", args).fetchall()]

    def decide_request(self, request_id: str, status: str, by: str, note: str = "") -> Request:
        with self._db.connect() as conn:
            row = conn.execute(
                f"UPDATE intake.requests SET status = %s, decided_at = %s, decided_by = %s, note = %s "
                f"WHERE id = %s RETURNING {_REQ_COLS}",
                (status, _now(), by, note, request_id),
            ).fetchone()
        if row is None:
            raise KeyError(request_id)
        return _req(row)

    def add_provider(self, request: Request, key_hash: str, key_prefix: str, slug: str = "") -> Provider:
        p = MemoryStore().add_provider(request, key_hash, key_prefix, slug)
        with self._db.connect() as conn:
            conn.execute(
                f"INSERT INTO intake.providers ({_PROV_COLS}) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                (p.id, p.request_id, p.name, p.institution, p.email, p.key_hash, p.key_prefix, p.created_at, None,
                 p.slug),
            )
        return p

    def provider_by_key_hash(self, key_hash: str) -> Provider | None:
        with self._db.connect() as conn:
            row = conn.execute(
                f"SELECT {_PROV_COLS} FROM intake.providers WHERE key_hash = %s AND revoked_at IS NULL",
                (key_hash,),
            ).fetchone()
        return _prov(row) if row else None

    def list_providers(self) -> list[Provider]:
        with self._db.connect() as conn:
            return [_prov(r) for r in conn.execute(f"SELECT {_PROV_COLS} FROM intake.providers ORDER BY created_at").fetchall()]

    def revoke_provider(self, provider_id: str) -> Provider:
        with self._db.connect() as conn:
            row = conn.execute(
                f"UPDATE intake.providers SET revoked_at = %s WHERE id = %s RETURNING {_PROV_COLS}",
                (_now(), provider_id),
            ).fetchone()
        if row is None:
            raise KeyError(provider_id)
        return _prov(row)

    def add_upload(self, upload: Upload) -> Upload:
        u = upload
        with self._db.connect() as conn:
            conn.execute(
                f"INSERT INTO intake.uploads ({_UP_COLS}) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                (u.id, u.provider_id, u.received_at, u.template, u.filename, u.sha256, u.rows, u.status,
                 json.dumps(u.report, ensure_ascii=False), u.path, u.declaration),
            )
        return u

    def list_uploads(self, provider_id: str | None = None) -> list[Upload]:
        sql = f"SELECT {_UP_COLS} FROM intake.uploads"
        args: tuple = ()
        if provider_id:
            sql += " WHERE provider_id = %s"
            args = (provider_id,)
        with self._db.connect() as conn:
            return [_up(r) for r in conn.execute(sql + " ORDER BY received_at", args).fetchall()]

    def find_accepted(self, provider_id: str, sha256: str) -> Upload | None:
        with self._db.connect() as conn:
            row = conn.execute(
                f"SELECT {_UP_COLS} FROM intake.uploads WHERE provider_id = %s AND sha256 = %s "
                "AND status = 'accepted' ORDER BY received_at LIMIT 1",
                (provider_id, sha256),
            ).fetchone()
        return _up(row) if row else None

    def count_uploads_since(self, provider_id: str, since: datetime) -> int:
        with self._db.connect() as conn:
            return conn.execute(
                "SELECT count(*) FROM intake.uploads WHERE provider_id = %s AND received_at >= %s",
                (provider_id, since),
            ).fetchone()[0]

    def purge_rejected_requests(self, decided_before: datetime) -> int:
        # A rejected request never got a provider row, so nothing references it.
        with self._db.connect() as conn:
            cur = conn.execute(
                "DELETE FROM intake.requests WHERE status = 'rejected' AND decided_at < %s",
                (decided_before,),
            )
            return cur.rowcount
