# CLAUDE.md — Pathogen Portal CZ

Technical orientation for AI coding assistants (and humans) working on this repository.
Process and conventions are in `CONTRIBUTING.md`; CI/CD is in `.github/workflows/WORKFLOWS_GUIDE.md`.

## What this is

A **static Hugo website** that publishes pathogen surveillance data for the Czech Republic
(influenza, COVID-19, notifiable infectious diseases, situational reports), plus optional FastAPI
backend services. Production: <https://pathogens.vm.cesnet.cz/> · staging: <https://pathogens-dev.vm.cesnet.cz/>.

The site works with **no backend at all**: chart data is committed as JSON and served as static files.

**Language:** site content is Czech (default) and English. Everything else — code, comments, docs,
commit messages — is English.

## Repository layout

| Path | Contents |
|---|---|
| `frontend/` | Hugo site: `hugo.toml`, `content/`, `layouts/`, `static/`, `data/`, `i18n/` |
| `frontend/themes/hugo-pathogens-portal/` | theme, **git submodule** (external repo, do not edit — override in `frontend/layouts/`) |
| `frontend/static/data/charts/*.json` | generated chart data, committed |
| `frontend/static/js/` | `pp-charts.js` (all charts), `pp-flu.js` (influenza intensity), `pp-events.js` (home-page events) |
| `frontend/static/vendor/` | Bootstrap, jQuery, DataTables, Chart.js — hosted locally, not from a CDN |
| `backend/` | FastAPI services, one directory = one container: `website-be`, `llm-agent-be`, `mcp` |
| `deploy/` | `docker-compose.yml`, `docker-compose.dev.yml` (dev override), `.env.example` |
| `pathogensportal-db/` | **git submodule** pinned to a release tag: scrapers, DB schema, `scripts/generate_json.py` |
| `incoming/` | situational report deliveries before ingest (see `incoming/README.md`) |
| `tools/ingest_report.py` | turns an `incoming/<report>/` delivery into portal pages and chart JSON |

## Commands

```bash
git clone --recurse-submodules <url>        # both the theme and the data repo are submodules
(cd frontend && hugo server)                # local preview, http://localhost:1313/
(cd frontend && hugo --minify)              # production build -> frontend/public/
(cd backend/website-be && pip install -r requirements.txt && pytest)

# full dev stack (Hugo + backend + Postgres, ports bound to 127.0.0.1)
docker compose -f deploy/docker-compose.yml -f deploy/docker-compose.dev.yml up

# regenerate chart JSON from the submodule
OUTPUT_DIR=../frontend/static/data/charts python pathogensportal-db/scripts/generate_json.py
```

CI pins Hugo **0.164.0 extended**. Always run a full `hugo` build before opening a PR into `main`.

## Site architecture

### Languages
- `content/cs/` is the default language, served at `/` (`defaultContentLanguageInSubdir = false`).
- `content/en/` is served at `/en/`.
- A new page must exist in **both** directories, otherwise the other language silently lacks it.
- Menus are defined **per language** in `hugo.toml` (`[[languages.<lang>.menus.main]]`) and use
  `pageRef`, never `url` — Hugo does not prefix a menu `url` with the language.
- Write `aliases:` **language-neutral** (the Czech path, e.g. `/dashboards/signals/`) in both files.
  Hugo prefixes aliases of a non-default language itself; writing `/en/...` produces `/en/en/...`.
- Templates switch strings with `eq .Site.Language.Lang "en"`; `i18n/cs.toml` holds shared labels.

### Dashboards
A dashboard is a page in `content/<lang>/dashboards/` rendered by `layouts/dashboards/single.html`,
which is the template that loads Chart.js and `pp-charts.js` (and `pp-flu.js` only when the page uses
the `flu` shortcode). A page outside that section that needs charts must set `type: dashboards`.

Front matter used by the templates:

| Field | Meaning |
|---|---|
| `title`, `description`, `tags`, `image` | standard; `image` is the card picture (`/images/cards/…`) |
| `origin` | closed code list: `aggregated` (public source), `own` (produced/processed by the portal), `ai-assisted` (AI-written, expert-reviewed). Drives the badge and card border (`partials/origin-meta.html`). No `origin` → no badge. |
| `data_source` | HTML citation of the data source shown on the page |
| `update_from` + `update_read` | which chart JSON holds the freshness date and how to read it (see below) |
| `update_freq` | free-text frequency, used only when the page has no `update_from` |
| `data_as_of` | fixed date, **only** for closed reports whose figures never change; build fails if combined with `update_from` |
| `highlight` | show on the home page |
| `redirect_url` | tile and page redirect to an external dashboard (Nextstrain, wastewater) |

**Never type an update date into front matter.** `partials/update-stamp.html` reads it from the data.
`update_read` is explicit on purpose — the last label of a series can be a week, an age band or a region:
`stamp` (default: `generated_at`, else `posledni_datum`), `period-end`, `week` (`KT WW/YY` → Sunday of
that ISO week), `month`, `year`. Month and year are not converted to a day.

### Charts
- Shortcode: `{{< chart id="…" src="/data/charts/<file>.json" type="line|bar|…" title="…" height="380" note="…" >}}`.
  The template emits markup only; `pp-charts.js` does everything else (rendering, data table toggle,
  origin label in the card footer).
- Chart JSON shape: `{ labels: [...], datasets: [...], meta: {...} }` (Chart.js-like) plus optional fields.
- **Data source order:** `pp-charts.js` queries `/api/charts` once per page. If the backend answers, charts
  load from `/api/charts/<key>`; otherwise from the static `src`. The payload is identical either way.
  `params.apibase` is empty in production (same origin); the dev compose sets `HUGO_PARAMS_APIBASE`.
- Colours come from CSS variables (`--pp-*`) in `static/css/dashboards.css`; colours in the JSON are
  ignored. The eight-colour palette is colour-blind safe — do not reorder it; series beyond eight are
  grouped into a grey "Other".
- Data labels inside the JSON are Czech. A finite dictionary in `pp-charts.js` translates common ones
  for the English site.

Other shortcodes: `nav-pills`, `method` / `method-part`, `region-map`, `flu`, `signals`, `signals-map`,
`stat-card`, `key-facts` / `key-fact`, `callout`, `data-files`, `data-catalogue`, `data-reuse`,
`organization`, `person`, `report-cards`. Each template starts with a usage comment.

### Structured data and catalogues
- `data/sources.yaml` is the single source catalogue; it feeds the human-readable data page,
  `/about/data/sources.json` (`layouts/_default/single.sources.json`) and the DCAT-AP-CZ catalogue
  (`partials/dcat-publish.html`, metadata in `data/dcat.yaml`, generated in the default language only).
- `partials/dataset-jsonld.html` emits schema.org `Dataset` markup per dashboard.
- Other data files: `navpills.yaml` (section navigation), `reports.yaml` (situational reports),
  `privacy.yaml` (privacy notice text).

## Where content and data come from

- **Generated chart JSON** (`frontend/static/data/charts/`) is produced by `pathogensportal-db` and
  arrives on `dev` as automated commits authored `pathogensportal datapipeline`. Do not hand-edit these
  files — the next run overwrites them. Fix the generator in `pathogensportal-db` instead.
- **Situational reports** (e.g. Ebola) arrive as content PRs from `content/…` branches that write
  `frontend/content/` and the related chart JSON directly. They are checked by
  `check-content-sanitizer.yaml`, get a preview build (`preview-content.yml`) and a subject-matter
  review. `incoming/` + `tools/ingest_report.py` is the documented path for raw HTML deliveries.
  Never put a delivery directly into `frontend/static/` — Hugo publishes it verbatim and unsanitized.
- Everything else (dashboard text, layouts, styles) is edited here by hand.

Because automated commits land on `dev` continuously, run `git fetch && git status -sb` before editing;
a local branch goes stale quickly.

## Workflow summary

- `dev` — integration branch, pushed to directly, **autodeploys to staging**.
- `main` — production, protected; changes only via PR with one approval and the required checks
  (`commit-message-check`, `hugo-build`, `backend-tests / pytest`, `content-sanitizer`). Merged by
  rebase (linear history); a push to `main` **autodeploys to production**.
- Commits: `PP-<issue>: summary` or `no-issue: summary`. Branches: `feature|bugfix|docs/PP-<n>_desc`,
  `content/…`, `no-issue/…`.
- `main` is merged back into `dev` automatically after each push; a failed sync run means `dev` needs a
  manual merge of `origin/main`.
- The `pathogensportal-db` submodule pin is bumped in a PR after each data release.

## Rules

- The repository is public: never commit secrets, credentials or non-public data. Secrets live in
  GitHub Actions secrets and in a separate private infrastructure repository.
- Do not edit the theme submodule; override templates in `frontend/layouts/`.
- Do not change user-visible Czech text unless the task is a content change.
- Keep comments and docs in English, concise, and about the *why*.
