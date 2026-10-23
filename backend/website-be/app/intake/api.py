"""HTTP endpoints for data intake (TODO D15).

    POST /api/intake/requests   the public request form (no key)
    GET  /api/intake/templates  what a CSV must look like
    POST /api/intake/uploads    one or more CSV files, or a ZIP/TAR of them, with the provider's key
    GET  /api/intake/uploads    the provider's own uploads, with the key

Approving a request and issuing a key is NOT an endpoint: it is `cli.py`, run
by an administrator on the server. An approval API would need its own login,
and for a handful of requests a month that is attack surface for nothing.
"""

from __future__ import annotations

import hashlib
import ipaddress
import re
import time
import uuid
from collections import defaultdict, deque
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, File, Form, Header, HTTPException, Request, UploadFile
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

from ..config import settings
from pathlib import Path

from . import declaration, files, keys, notify
from .bundle import MAX_REQUEST_BYTES, BundleError, safe_names, unpack
from .store import MemoryStore, PostgresStore, Store, Upload
from .templates import TEMPLATES
from .validate import to_csv, validate_csv

router = APIRouter(prefix="/api/intake", tags=["intake"])

_store: Store | None = None


def get_store() -> Store:
    """One store per process; tests replace it through app.dependency_overrides."""
    global _store
    if _store is None:
        if settings.intake_store == "memory":
            _store = MemoryStore()
        else:
            pg = PostgresStore()
            pg.ensure_schema()
            _store = pg
    return _store


# ── Rate limit for the public form ─────────────────────────────────────────
# In memory, per process: enough to stop a script hammering the form, which is
# the realistic abuse. Not a defence against a distributed attack — Apache or a
# WAF would be the place for that.
_hits: dict[str, deque] = defaultdict(deque)


def client_ip(request: Request) -> str:
    """The real client address. Behind Apache every request comes from the proxy,
    so the forwarded header is trusted ONLY when the direct peer is a configured
    proxy (INTAKE_TRUSTED_PROXIES) — otherwise anyone could pick their own
    address and walk past the limit."""
    peer = request.client.host if request.client else ""
    try:
        addr = ipaddress.ip_address(peer)
        is_proxy = any(addr in ipaddress.ip_network(n, strict=False) for n in settings.intake_trusted_proxies)
    except ValueError:
        is_proxy = False
    forwarded = request.headers.get("x-forwarded-for", "")
    if is_proxy and forwarded:
        return forwarded.split(",")[-1].strip()
    return peer


def _rate_limited(ip: str) -> bool:
    now = time.monotonic()
    window = _hits[ip]
    while window and now - window[0] > 3600:
        window.popleft()
    if len(window) >= settings.intake_requests_per_hour:
        return True
    window.append(now)
    return False


# ── Request form ────────────────────────────────────────────────────────────
_EMAIL = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


class RequestIn(BaseModel):
    name: str = Field(min_length=2, max_length=200)
    email: str = Field(max_length=254)
    institution: str = Field(min_length=2, max_length=300)
    position: str = Field(default="", max_length=200)
    description: str = Field(min_length=5, max_length=3000)
    origin: str = Field(min_length=5, max_length=3000)
    frequency: str = Field(min_length=1, max_length=50)
    link: str = Field(default="", max_length=500)
    no_personal_data: bool
    # Acknowledged the privacy notice (not "agreed to terms" — those are deferred, TODO R24).
    privacy_ack: bool
    # Honeypot: hidden in the form, so a human leaves it empty and a bot fills it.
    website: str = Field(default="", max_length=500)


@router.post("/requests", status_code=201)
def create_request(body: RequestIn, request: Request, store: Store = Depends(get_store)) -> dict:
    if body.website:
        # Answer like a success, so the bot learns nothing.
        return {"id": str(uuid.uuid4()), "status": "pending"}
    if _rate_limited(client_ip(request)):
        raise HTTPException(status_code=429, detail="Příliš mnoho žádostí. Zkuste to prosím později.")
    if not _EMAIL.match(body.email):
        raise HTTPException(status_code=422, detail="Neplatný e-mail.")
    if not (body.no_personal_data and body.privacy_ack):
        raise HTTPException(status_code=422, detail="Je třeba potvrdit obě prohlášení.")
    if body.link and not body.link.startswith(("https://", "http://")):
        raise HTTPException(status_code=422, detail="Odkaz musí začínat https://.")

    r = store.add_request(body.model_dump())
    notify.send(
        f"Nová žádost: {r.institution}",
        f"Žádost {r.id}\n\n"
        f"Jméno:      {r.name}\nE-mail:     {r.email}\nInstituce:  {r.institution}\n"
        f"Pozice:     {r.position}\nFrekvence:  {r.frequency}\nOdkaz:      {r.link}\n\n"
        f"Popis dat:\n{r.description}\n\nPůvod dat:\n{r.origin}\n\n"
        # `pp-intake` is the server's wrapper around `python -m app.intake.cli`.
        f"Schválit:  sudo pp-intake approve {r.id} --slug <adresar-instituce>\n"
        f"Zamítnout: sudo pp-intake reject {r.id} --note \"…\"\n",
    )
    return {"id": r.id, "status": r.status}


# ── Templates ───────────────────────────────────────────────────────────────
@router.get("/templates")
def list_templates() -> dict:
    return {
        "templates": [
            {
                "key": t.key,
                "title": t.title,
                "columns": [
                    {"name": c.name, "kind": c.kind, "required": c.required, "description": c.description}
                    for c in t.columns
                ],
            }
            for t in TEMPLATES.values()
        ]
    }


# ── Uploads ─────────────────────────────────────────────────────────────────
def _provider(authorization: str, store: Store):
    scheme, _, key = authorization.partition(" ")
    if scheme.lower() != "bearer" or not keys.looks_valid(key.strip()):
        raise HTTPException(status_code=401, detail="Chybí nebo je neplatný klíč.",
                            headers={"WWW-Authenticate": "Bearer"})
    provider = store.provider_by_key_hash(keys.digest(key.strip()))
    if provider is None:
        raise HTTPException(status_code=401, detail="Chybí nebo je neplatný klíč.",
                            headers={"WWW-Authenticate": "Bearer"})
    return provider


@router.post("/uploads")
async def upload(
    # One or more files under the same field name. Each may be a CSV or a
    # ZIP/TAR of CSVs (bundle.py); one upload = everything sent in one request.
    file: list[UploadFile] = File(...),
    template: str = Form("agregace-v1"),
    # The key of the declaration the provider ticked (declaration.py). Empty =
    # not ticked. Checked BEFORE anything is stored: without consent we keep
    # nothing, not even a rejected copy.
    declaration_key: str = Form("", alias="declaration"),
    authorization: str = Header(default=""),
    store: Store = Depends(get_store),
) -> JSONResponse:
    provider = _provider(authorization, store)
    if declaration_key != declaration.CURRENT:
        raise HTTPException(
            status_code=422,
            detail="Bez potvrzení prohlášení o zpracování dat soubor nepřijmeme."
            if not declaration_key
            else "Prohlášení na stránce je zastaralé. Obnovte prosím stránku a potvrďte ho znovu.",
        )
    tpl = TEMPLATES.get(template)
    if tpl is None:
        raise HTTPException(status_code=422, detail=f"Neznámá šablona „{template}“.")

    if store.count_uploads_since(provider.id, datetime.now(timezone.utc) - timedelta(days=1)) >= settings.intake_uploads_per_day:
        raise HTTPException(
            status_code=429,
            detail=f"Za posledních 24 hodin jste nahráli {settings.intake_uploads_per_day}×, víc zatím nepřijmeme. "
            "Pokud potřebujete víc, ozvěte se nám.",
        )

    received: list[tuple[str, bytes]] = []
    total = 0
    for f in file:
        # Read no more than one byte past the request limit, IN TOTAL: the
        # moment it is exceeded, unpack() refuses the upload and the remaining
        # fields are never read into memory.
        raw = await f.read(MAX_REQUEST_BYTES + 1 - total)
        received.append(((f.filename or "")[:255], raw))
        total += len(raw)
        if total > MAX_REQUEST_BYTES:
            break
    # One file: the hash of its bytes, as before multi-file uploads existed. More:
    # the hash of the per-file hashes in the order sent.
    digests = [hashlib.sha256(raw).hexdigest() for _, raw in received]
    sha256 = digests[0] if len(digests) == 1 else hashlib.sha256("".join(digests).encode()).hexdigest()
    # A scheduled export sends the same file again when nothing changed. Answer
    # 200 and point at the first copy, store nothing: one file, one review.
    # Only ACCEPTED copies count — a rejected file sent again is checked again.
    previous = store.find_accepted(provider.id, sha256)
    if previous is not None:
        return JSONResponse(content={
            "id": previous.id, "status": "duplicate", "duplicate_of": previous.id,
            "received_at": previous.received_at.isoformat(),
        })

    upload_id = str(uuid.uuid4())
    received_at = datetime.now(timezone.utc)
    result = _check(received, tpl)
    ok = result.pop("_ok")
    normalized = result.pop("_normalized")
    # The consent travels with the file: version AND text, see declaration.py.
    result["declaration"] = {
        "version": declaration.CURRENT,
        "text": declaration.DECLARATIONS[declaration.CURRENT],
        "accepted_at": received_at.isoformat(),
        "provider": provider.name,
        "institution": provider.institution,
    }

    path = files.write_record(settings.intake_dir, provider.id, upload_id, received, result)
    export = None
    if ok and settings.intake_export_dir:
        export = files.write_export(
            Path(settings.intake_export_dir), provider.slug or provider.id, upload_id, received_at, normalized,
            {
                "upload_id": upload_id,
                "received_at": received_at.isoformat(),
                "provider": {"id": provider.id, "slug": provider.slug, "name": provider.name,
                             "institution": provider.institution},
                "template": tpl.key,
                "declaration": result["declaration"],
                "files": result["files"],
            },
        )
    filenames = ", ".join(name for name, _ in received)
    stored = store.add_upload(
        Upload(
            id=upload_id,
            provider_id=provider.id,
            received_at=received_at,
            template=tpl.key,
            # The names are only recorded, never used for a path (see files.py).
            filename=filenames[:255],
            sha256=sha256,
            rows=result["rows"],
            status="accepted" if ok else "rejected",
            report=result,
            path=str(path),
            declaration=declaration.CURRENT,
        )
    )
    notify.send(
        f"{'Přijatá' if ok else 'Odmítnutá'} data: {provider.institution}",
        f"Nahrání {stored.id} od {provider.name} ({provider.institution}, klíč {provider.key_prefix}…)\n"
        f"Soubory: {filenames}; CSV {len(result['files'])}, šablona {tpl.key}, řádků {result['rows']}\n"
        f"Chyby: {result['errors']}, upozornění: {result['warnings']}\n"
        f"Prohlášení: {declaration.CURRENT} potvrzeno\n"
        f"Záznam: {path}\n"
        + (f"Ke zpracování: {export}\n" if export else ""),
    )
    body = {"id": stored.id, "status": stored.status, "report": result}
    return JSONResponse(content=body, status_code=200 if ok else 422)


def _check(received: list[tuple[str, bytes]], tpl) -> dict:
    """Validate every CSV of an upload. The upload is accepted only when ALL of
    them pass: a provider fixes the batch and resends it, rather than us holding
    half a delivery that the pipeline could mistake for the whole one.

    The report keeps the single-file shape (rows, errors, warnings, issues) so
    a client written for one CSV still reads it; `files` lists each CSV and every
    issue carries the `file` it belongs to."""
    report: dict = {"ok": False, "template": tpl.key, "rows": 0, "errors": 0, "warnings": 0,
                    "issues": [], "truncated": False, "files": [], "_ok": False, "_normalized": []}
    try:
        parts = unpack(received)
    except BundleError as e:
        report["errors"] = 1
        report["issues"].append({"level": "error", "message": str(e)})
        return report
    ok = True
    for part, name in zip(parts, safe_names(parts)):
        r = validate_csv(part.data, tpl)
        d = r.as_dict()
        ok = ok and r.ok
        report["rows"] += d["rows"]
        report["errors"] += d["errors"]
        report["warnings"] += d["warnings"]
        report["truncated"] = report["truncated"] or d["truncated"]
        report["issues"].extend({**i, "file": part.name} for i in d["issues"])
        report["files"].append({"name": part.name, "stored_as": name, "rows": d["rows"], "ok": r.ok,
                                "errors": d["errors"], "warnings": d["warnings"],
                                "sha256": hashlib.sha256(part.data).hexdigest()})
        if r.ok:
            report["_normalized"].append((name, to_csv(r.normalized, tpl)))
    report["ok"] = report["_ok"] = ok
    return report


@router.get("/uploads")
def my_uploads(authorization: str = Header(default=""), store: Store = Depends(get_store)) -> dict:
    provider = _provider(authorization, store)
    return {
        "uploads": [
            {"id": u.id, "received_at": u.received_at.isoformat(), "filename": u.filename,
             "template": u.template, "rows": u.rows, "status": u.status}
            for u in store.list_uploads(provider.id)
        ]
    }
