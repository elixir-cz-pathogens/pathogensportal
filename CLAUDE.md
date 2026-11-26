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
| `frontend/static/js/` | `pp-charts.js` (all charts), `pp-flu.js` (influenza intensity), `pp-resp.js`, `pp-genomics.js`, `pp-isin.js` (blocks of one dashboard family each), `pp-events.js` (home-page events) |
| `frontend/static/vendor/` | Bootstrap, jQuery, DataTables, Chart.js — hosted locally, not from a CDN |
| `backend/` | FastAPI services, one directory = one container: `website-be`, `llm-agent-be`, `mcp` |
| `deploy/` | `docker-compose.yml`, `docker-compose.dev.yml` (dev override), `.env.example` |
| `pathogensportal-db/` | **git submodule** pinned to a release tag: scrapers, DB schema, `scripts/generate_json.py` |
| `incoming/` | situational report deliveries before ingest (see `incoming/README.md`) |
| `tools/ingest_report.py` | turns an `incoming/<report>/` delivery into portal pages and chart JSON |
| `tools/check_dcat_catalogue.py` | checks the built DCAT-AP-CZ catalogue (`frontend/public/dcat/`); run after `hugo`, runs in `hugo-build` |

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
| `nav_hidden` | `true` leaves the page out of the "Panely" dropdown; for sub-pages reached through the `nav-pills` of a parent dashboard |

**Never type an update date into front matter.** `partials/update-stamp.html` reads it from the data.
`update_read` is explicit on purpose — the last label of a series can be a week, an age band or a region:
`stamp` (default: `generated_at`, else `posledni_datum`), `period-end`, `week` (`KT WW/YY` → Sunday of
that ISO week), `month`, `year`. Month and year are not converted to a day.

**When the data changed and when the source was last checked are two statements.** The date above
moves only with the data. Next to it the page shows "Poslední kontrola zdroje / Source last
checked" from `static/data/charts/last_checked.json` (written by `pathogensportal-db`,
`scripts/last_checked.py`: per chart file, the UTC day on which all of its sources were last asked
successfully). The partial returns it as `.checked` (`label`, `date`, `iso`); it is optional — no
file or no entry, no label — and it is left out when the label already names the same day as the
pipeline run. `.iso`, JSON-LD `dateModified` and the tile order stay on the data date: never make
them follow the check.

### Charts
- Shortcode: `{{< chart id="…" src="/data/charts/<file>.json" type="line|bar|…" title="…" height="380" note="…" >}}`.
  The template emits markup only; `pp-charts.js` does everything else (rendering, data table toggle,
  origin label in the card footer).
- Chart JSON shape: `{ labels: [...], datasets: [...], meta: {...} }` (Chart.js-like) plus optional fields.
- Optional `chart` parameters: `series="1"` draws only the named series of the JSON (one file can feed
  several cards, each with its own Y axis); `period="page"` makes the chart follow the page's
  `period-switch` (last 12 months by default, a calendar year, or everything; needs ISO date or month
  labels); `breaks="true"` marks on the time axis where a change in reporting takes effect
  (`meta.caveats` records with action `break`).
- `region-map` can carry two measures in one card (`src` + `alt_src`, e.g. per 100,000 and counts);
  put the one that is comparable between regions in `src`.
- **Data source order:** `pp-charts.js` queries `/api/charts` once per page. If the backend answers, charts
  load from `/api/charts/<key>`; otherwise from the static `src`. The payload is identical either way.
  `params.apibase` is empty in production (same origin); the dev compose sets `HUGO_PARAMS_APIBASE`.
- Colours come from CSS variables (`--pp-*`) in `static/css/dashboards.css`; colours in the JSON are
  ignored. The eight-colour palette is colour-blind safe — do not reorder it; series beyond eight are
  grouped into a grey "Other".
- Data labels inside the JSON are Czech; pathogensportal-db (PPDB-77) adds English ones in `*_en` fields
  (`labels_en`, `datasets[].label_en`, `x_title_en`, `unit_en`, `diagnoza_nazev_en`, …), which
  `pp-charts.js`, `pp-flu.js` and `partials/signals-map.html` prefer on the English site. The
  dictionary in `pp-charts.js` is the fallback for older data and holds the script's own UI strings.

Other shortcodes: `nav-pills`, `method` / `method-part`, `region-map`, `flu`, `signals`, `signals-map`, `signals-excluded`,
`stat-card`, `period-switch`, `comment` (data comment from a facts JSON), `isin` (infectious-disease
overview blocks, drawn by `pp-isin.js`), `if-data` (content shown only when a chart JSON is in the repo), `key-facts` / `key-fact`, `callout`, `data-files`, `data-catalogue`, `data-reuse`,
`organization`, `person`, `report-cards`. Each template starts with a usage comment.

### Structured data and catalogues
- `data/sources.yaml` is the single source catalogue; it feeds the human-readable data page,
  `/about/data/sources.json` (`layouts/_default/single.sources.json`) and the DCAT-AP-CZ catalogue
  (`partials/dcat-publish.html`, metadata in `data/dcat.yaml`, generated in the default language only).
- A dataset in `data/dcat.yaml` names its sources (`zdroje`) and is published only when every one of
  them has `licence.open: true` in `data/sources.yaml`; otherwise the build leaves it out with a
  warning. The flag mirrors the one in `pathogensportal-db/sources.yaml` — never set it to make a
  record validate.
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

A page that needs a **new** chart JSON must build and read well before the file arrives: wrap the
block and the text that introduces it in `{{% if-data file="…" %}}` (and keep the chart it replaces
under `not="true"`). `update_from` must name a file that is already in the repository — the build
fails on a missing one.

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
