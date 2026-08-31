# Pathogen Portal CZ

The Czech portal for tracking pathogen data (COVID-19, influenza, …). The **frontend** is a static site
built with [Hugo](https://gohugo.io/); the **backend** consists of containerized FastAPI services.

Production runs at **https://pathogens.vm.cesnet.cz/** (Apache, Let's Encrypt certificate).

> **Language:** the site's content is in Czech (that is what the public reads). Everything else — docs,
> code, comments, commit messages — is in English.

## Structure

```
frontend/            Hugo site (the theme is a git submodule under frontend/themes/)
frontend/content/    page content (dashboards, news, …)
frontend/layouts/    template overrides from the theme (see "Theme template overrides")
frontend/static/     static assets incl. frontend/static/data/charts/*.json for the charts
frontend/static/vendor/  locally hosted Bootstrap, jQuery, DataTables, Chart.js
                         (see "Why the libraries are local and not from a CDN")
backend/             FastAPI services — one directory = one container
  website-be/          API gateway and business logic
  llm-agent-be/        the AI core (semantic queries, reasoning)
  mcp/                 Model Context Protocol adapter
deploy/              docker-compose (production + dev override) + .env.example
.github/workflows/   CI and automations (see WORKFLOWS_GUIDE.md)
```

The scrapers and DB schema live in a separate repo, **`pathogensportal-db`**, attached as a **git
submodule** (`pathogensportal-db/`, pinned to a tag). Monitoring (Grafana) is in the private
**`pathogensportal-priv`**.

## Theme template overrides

The `hugo-pathogens-portal` theme is a git submodule (someone else's repo), so we don't edit it directly.
Hugo can override any theme template with a file of the same name in our own `frontend/layouts/`. We use
this for:

- `frontend/layouts/partials/head.html`, `footer.html` — loading local (not CDN) libraries, see below
- `frontend/layouts/partials/navbar.html` — fixing the ELIXIR logo link (it should go to
  `elixir-europe.org`, not back to the home page)
- `frontend/layouts/dashboards/single.html` — a local Chart.js instead of the CDN one

When updating the theme (the submodule), check whether these overrides still make sense.

### Chart data

Chart JSON is **committed** into `frontend/static/data/charts/` (the site is purely static). To regenerate:
```bash
git submodule update --init --recursive
OUTPUT_DIR=../frontend/static/data/charts python pathogensportal-db/scripts/generate_json.py
# or in a container:
docker compose -f deploy/docker-compose.yml --profile tools run --rm datascrapper
```

### How data reaches the site: static first, the API as a bonus

The committed JSON is still both the **source of truth and the fallback** — the site works unchanged
without a backend. On top of that, there is a live path through `website-be`:

```
external sources ──scrapers──> CSV ──generate_json.py──> chart JSON ──┬──> committed to git ──> /data/charts/*.json
                                                                      └──> app.loader ──> Postgres ──> /api/charts/<key>
```

The frontend (`static/js/pp-charts.js`) asks `/api/charts` **once per page**. When the API answers, the
charts take their data from the database; when it doesn't, they load the static file. The payload is
byte-for-byte identical in both cases, so only the URL differs. Each card's footer shows where the data
came from ("live data from the database" / "static snapshot of the data").

Populating the database (idempotent — `recorded_at` is the file's mtime):
```bash
docker compose -f deploy/docker-compose.yml -f deploy/docker-compose.dev.yml \
  exec website-be python -m app.loader
```

The data lives in the `dashboard_data` table from the submodule's schema; `website-be` can create it
itself (`app/db.py`) so it also works against a DB without `init.sql`.

### Chart appearance

Chart colours, spacing and typography live in `frontend/static/css/dashboards.css` as CSS variables
(`--pp-*`); `pp-charts.js` reads them from there and **ignores the colours written in the chart JSON** —
otherwise the portal's appearance would be dictated by a generator in someone else's repo. The
eight-colour data palette is validated for distinguishability under colour blindness, so don't reorder the
slots; the ninth and further series collapse into a grey "Other" (they stay itemized in the table below
the chart).

Dark mode is prepared (a set of tokens under `[data-bs-theme="dark"]`) but only switches on once a theme
toggle is added across the whole site — today nobody sets that attribute on `<html>`.

## Local development

Requires Docker + Docker Compose. The theme is a submodule → clone with `--recurse-submodules`.

```bash
docker compose -f deploy/docker-compose.yml -f deploy/docker-compose.dev.yml up
```

- Hugo dev server: http://localhost:1313/ (live reload)
- website-be / llm-agent-be / mcp: `127.0.0.1:8000` / `:8001` / `:8002` (health: `/health`)
- PostgreSQL: `127.0.0.1:5432`

The dev server runs on a different port from the API, so the frontend needs an absolute URL: compose
passes `HUGO_PARAMS_APIBASE=http://localhost:8000` (in production both sit behind the same Apache and
`params.apibase` stays empty). Note the parameter name has **no underscore**, deliberately — Hugo treats
`_` in an env variable as a level separator, so `HUGO_PARAMS_API_BASE` would produce `params.api.base`.

For the charts to use live data, the loader has to be run once after startup (see above) — otherwise the
database is empty and the frontend stays on the static JSON.

Secrets: copy `deploy/.env.example` to `deploy/.env` and fill it in (it is not committed).

## Building the FE / testing the BE

```bash
(cd frontend && hugo --minify)                         # -> frontend/public/
(cd backend/website-be && pip install -r requirements.txt && pytest)
```

## Why the libraries are local and not from a CDN

The theme's template originally loaded Bootstrap, Bootstrap Icons, DataTables, jQuery and Chart.js from
external CDNs (`cdn.jsdelivr.net`, `cdn.datatables.net`, `code.jquery.com`). On networks that block or
filter those domains (common on academic and corporate networks), the CSS/JS never loaded at all and the
page rendered unstyled. The fix: all of those libraries are downloaded and hosted locally in
`frontend/static/vendor/`, and the templates reference them by a **relative** path (`/vendor/...`), so
they are always loaded from the same domain and the same protocol (http/https) as the rest of the page.

**Important:** anything in `frontend/layouts/` (the template overrides) must reference our own assets by a
relative path or through Hugo's `.RelPermalink`, never `.Permalink` (which generates an absolute URL from
`baseURL`, i.e. hardcoded `https://`) — otherwise, when visited over `http://`, the browser attempts a
CORS request elsewhere and fails on an untrusted certificate (which is exactly what happened with
`theme.min...css`).

## Conventions and deployment

Commit/branch conventions and workflows: see `CONTRIBUTING.md` and `.github/workflows/WORKFLOWS_GUIDE.md`.
In production, Apache serves `frontend/public/` and acts as a reverse proxy in front of the BE services
(TLS: Let's Encrypt).
