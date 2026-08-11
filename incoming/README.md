# `incoming/` — situational report deliveries

This is where **finished static reports from the generator** (AI with a human in the loop) land. The
portal does not write them, it only processes and publishes them. So this folder is an *input*, not site content.

> ⚠️ **Never put a delivery into `frontend/static/`.** Hugo publishes anything there verbatim as a file —
> the delivery would be public the moment it was merged, unsanitized and outside the portal's layout.
> The intermediate step through `incoming/` is the entire point of this arrangement.

## The delivery's path

```
incoming/<report>/         ──tools/ingest_report.py──>  frontend/content/cs/dashboards/*.html
                                                        frontend/static/data/charts/*.json
                                                        frontend/static/reports/<report>/
```

1. The generator creates the report folder and opens a **PR** into this repo.
2. The ingest (manually for now, eventually in CI) turns it into portal pages and commits them into the same PR.
3. A **subject-matter approver** checks the diff — for content, not technically — and merges.
4. The deploy runs after the merge into `main`. *(Currently disabled, see `WORKFLOWS_GUIDE.md`.)*

If nobody approves, the site simply stays on yesterday's version. Nothing breaks — but a forgotten PR means
silent staleness, which is why it needs a reminder.

## What a delivery should contain

```
incoming/ebola/
  index.html                 the report's main section
  cesko.html                 another section — one file = one portal page
  …
  data/*.csv, data/schema.json     downloadable attachments (optional)
  metadata/*.jsonld                machine-readable metadata (optional)
  CITATION.cff                     how to cite (optional)
```

### HTML requirements

| Requirement | Why |
|---|---|
| The page content inside `<main>` | The ingest takes only `<main>`; it discards the header, navigation and footer so the portal doesn't end up with two navigations |
| Metadata in `<head>` as Dublin Core | `<title>`, `<meta name="description">`, `<meta name="dcterms.modified">`, `<link rel="canonical">`, `<link rel="license">`. These become the front matter and the card on the index — they are not mined from the text |
| Links between sections relative (`cesko.html`) | The ingest rewrites them to portal URLs per `frontend/data/reports.yaml` |
| Attachments relative (`data/x.csv`) | They are copied into `frontend/static/reports/<report>/` and the link is rewritten. An absolute link to the generator's domain would, after ingest, lead off-site |
| Chart data as `const <name> = [ … ]` inside `<script>` | The ingest extracts it into chart JSON and replaces the chart with a portal component — see below |

### What the ingest discards

Sanitization runs against an **allowlist** (`ALLOWED_TAGS` / `ALLOWED_ATTRS` in `tools/ingest_report.py`).
It discards `<script>`, `<style>`, `<iframe>`, `<form>`, handler attributes (`onclick`…) and links to
dangerous schemes. It is not a substitute for human review — that focuses on the subject-matter accuracy of
the text and would easily miss a script appearing somewhere. This is a cheap second layer.

**Foreign JavaScript is never let onto the portal.** The report may draw its own charts; the ingest takes
only the data from them and replaces the panel with a portal component. The chart thereby gets the site's
appearance, a tabular listing, an API connection and a path into the database. Which variables and which
panels are taken is set by `CHART_SOURCES` in the ingest script — **adding a chart to the report requires
adding a rule there.**

### Appearance = class names

A delivery carries its own classes (`note ok`, `summary`, `alert`, `card`, `plain-table`, `fair-panel`…).
`frontend/static/css/reports.css` translates them into portal tokens. The generator's own stylesheet is not
used and does not belong in `incoming/`.

> **Whoever renames a class in the generator breaks that section's appearance.** The ingest reports it as
> an unknown class and exits with code 1, but the fix goes into `reports.css`. Class names are therefore
> part of the contract — change them by agreement, not in passing.

## Running it

```bash
pip install -r tools/requirements.txt

python tools/ingest_report.py ebola --check   # only prints what it would do
python tools/ingest_report.py ebola           # writes the result

# the report's data into the database (optional; the site works without it):
docker compose -f deploy/docker-compose.yml -f deploy/docker-compose.dev.yml \
  exec website-be python -m app.loader
```

The run is **idempotent** — the same input yields the same output, so `git diff` shows exactly what changed
in the report that day. That is also what the approver reviews.

## Adding a new report

1. Create `incoming/<key>/` with the HTML sections.
2. Add an entry to `frontend/data/reports.yaml`: `source_dir`, `defaults` and `sections`
   (a map of `source` → `url` → `name`/`desc`). This keeps the portal's URLs stable independently of the
   generator's file names.
3. Run the ingest and go through the report of unknown classes; add whatever is missing to `reports.css`.

## What is here now

`ebola/` is a **real delivery from 27 Jul 2026**, downloaded from `titan.img.cas.cz/ebola`
(Jan Pačes & Michaela Liegertová, IMG AV ČR, CC BY 4.0). It serves both as the reference example of the
contract and as the current input — the next delivery will replace it, and git will thereby hold a version
history of the report.
