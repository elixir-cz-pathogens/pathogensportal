# website-be

The portal's API gateway and business logic.

A container (FastAPI). It listens on the internal network only — everything goes out through Apache.

- Health: `GET /health`
- Port (internal): `8000`
- Locally: `uvicorn app.main:app --reload --port 8000`
- Tests: `pytest`

## Data intake from providers (`app/intake/`, TODO D15)

A provider files a request (`POST /api/intake/requests`), an administrator approves it on the server
and hands over a key, and the provider uploads with that key (`POST /api/intake/uploads`): one or
more CSV files, or a ZIP/TAR of them (`bundle.py`). Every CSV is validated against a template
(`GET /api/intake/templates`); an upload is accepted only when all of them pass.

Two trees on disk (`files.py`):

- `INTAKE_DIR/<provider id>/<upload id>/` — the record of everything received, accepted or not
  (`original/`, `report.json`).
- `INTAKE_EXPORT_DIR/<provider slug>/<YYYY-MM-DD>/<upload id>/` — accepted uploads only, normalised
  CSVs + `manifest.json`, for the data pipeline. Appears atomically (written as `.<id>.tmp`, then
  renamed); readers skip dot-entries.

Nothing is published from here: an accepted upload still goes to human review.

Administration (inside the container):

```bash
python -m app.intake.cli requests --status pending
python -m app.intake.cli approve <request_id> --slug <dir>   # prints the key ONCE; only its hash is stored
python -m app.intake.cli issue --slug <dir> --name "…" --email … --institution "…"   # without the form
python -m app.intake.cli reject  <request_id> --note "why"
python -m app.intake.cli providers
python -m app.intake.cli revoke  <provider_id>     # a lost key is revoked, never shown again
python -m app.intake.cli uploads
```

Settings (environment): `INTAKE_DIR`, `INTAKE_EXPORT_DIR`, `INTAKE_TRUSTED_PROXIES` (CIDRs whose
`X-Forwarded-For` is believed; default loopback), `INTAKE_NOTIFY_TO` (comma-separated), `INTAKE_SMTP_HOST`,
`INTAKE_SMTP_PORT`, `INTAKE_SMTP_USER`, `INTAKE_SMTP_PASSWORD`, `INTAKE_SMTP_FROM`,
`INTAKE_SMTP_STARTTLS`, `INTAKE_REQUESTS_PER_HOUR` (default 5 per client IP),
`INTAKE_STORE=memory` (local tryout without a database). Without SMTP the notification is a WARNING
in the log. ⛔ The approver's address is configuration, never in this public repository.

Local run against a throwaway Postgres, with the site wired to it:

```bash
docker run -d --rm --name pp-testdb -e POSTGRES_USER=portal -e POSTGRES_PASSWORD=test \
  -e POSTGRES_DB=pathogens -p 127.0.0.1:55432:5432 postgres:16-alpine
DB_HOST=127.0.0.1 DB_PORT=55432 POSTGRES_PASSWORD=test INTAKE_DIR=/tmp/intake \
  uvicorn app.main:app --port 8010
# The intake page is built only in the staging environment (frontend/config/staging/).
(cd ../../frontend && HUGO_PARAMS_INTAKE_API=http://127.0.0.1:8010/api/intake hugo server --environment staging)
PP_TEST_DB=1 DB_HOST=127.0.0.1 DB_PORT=55432 POSTGRES_PASSWORD=test pytest   # incl. real-DB tests
```

The real-DB intake test drops the `intake` schema and refuses to run unless `DB_HOST` is loopback.
