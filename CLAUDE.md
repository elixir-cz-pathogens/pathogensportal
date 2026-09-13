# CLAUDE.md — pathogensportal

Public repo of **Pathogen Portal CZ** — a static Hugo website plus a data pipeline that feeds it.
Fork of `jirkavlasak/pathogensportal` (`upstream`); this fork
(`origin = elixir-cz-pathogens/pathogensportal`) is the working repo.
Live site: `https://pathogens.vm.cesnet.cz` · Staging: `https://pathogens-dev.vm.cesnet.cz` (`noindex`).

Docs, code and commit messages are in **English**. The only Czech is the site's own content in
`frontend/content/cs/`, which is what the public reads.

> ✅ **Transferred to the `elixir-cz-pathogens` organization on 11 Aug 2026.** The fork link to upstream,
> all issues/PRs, branch protection and the repo variables survived; old `draessld/...` URLs redirect.
> Verification record: `prep_phase/devops_intra/GITHUB_ORG_MIGRATION.md` in the workspace.

## Layout

| Path | What |
|---|---|
| `frontend/` | Hugo site (`hugo.toml`, `content/`, `layouts/`, `static/`). The theme is a **git submodule** (`frontend/themes/…`). |
| `backend/` | FastAPI services, **one directory = one container**: `website-be`, `llm-agent-be`, `mcp`. |
| `deploy/` | `docker-compose.yml` (production), `docker-compose.dev.yml` (dev override), `.env.example`. |
| `pathogensportal-db/` | a **git submodule** — scrapers, `db/init.sql`, the chart JSON generator. Pinned to a tag. |
| `incoming/` | situational report deliveries from the generator — see `incoming/README.md`. |
| `.github/workflows/` | CI + automations — see `WORKFLOWS_GUIDE.md`. |

Monitoring (Grafana) lives in **`pathogensportal-priv`**. This repo holds the FE, the BE services and the
data submodule.

### Content languages (careful)

- `frontend/content/cs/` — **Czech, built** (`hugo.toml` → `[languages.cs]`, served at `/`).
- `frontend/content/en/` — **English, built since Sep 2026** (`[languages.en]` in hugo.toml, served
  at `/en/` with the theme's language switcher). Menus are defined **per language** — a root `[menus]`
  block would leak Czech names into the English UI. Chart *data* labels stay Czech (they live inside
  the generated JSONs); a finite dictionary in `pp-charts.js` translates the common ones, the 114 ISIN
  diagnosis names remain Czech with a note on the pages (permanent fix tracked as pathogensportal-db#47).
  New content pages must be added in both languages or the EN site silently loses them.
  ⚠️ **`aliases:` must be written language-neutral.** Hugo prefixes the language onto an alias of a
  non-default language, so `/en/dashboards/signals/` in `content/en/` builds `/en/en/dashboards/signals/`
  and the real English URL 404s. Write the Czech form in both files. (Found 9 Sep 2026, live on staging.)

**Data model (A):** chart JSON is **committed** into `frontend/static/data/charts/` (the site stays static).
To regenerate from the submodule:
```bash
git submodule update --init --recursive
OUTPUT_DIR=../frontend/static/data/charts python pathogensportal-db/scripts/generate_json.py
# or through the container:
docker compose -f deploy/docker-compose.yml --profile tools run --rm datascrapper
```

⛔ **Check `git status -sb` before you edit anything in this repo.** The pipeline commits to `dev` on its
own schedule, so a checkout goes stale without anyone touching it — on 9 Sep 2026 a local `dev` was
**173 commits behind** and an edit to it looked like it had done nothing, because staging builds from
`origin/dev`. "I pulled recently" is not the same as "I am current".

⚠️ **On `dev` this is automated since 31 Aug 2026 — do not hand-edit the generated files there.**
A push to `pathogensportal-db`'s `dev` branch makes the dev server run the pipeline and **commit** the
regenerated chart JSON *and* the eight `content/cs/dashboards/ebola-*.md` straight to this branch
(author `pathogensportal datapipeline`). Anything you change in those files by hand is silently
reverted by the next run. `main`/production is **not** affected — it only moves on a `dev` → `main`
merge.

⏳ Model A itself is transitional. `pp-charts.js` already asks `/api/charts` first and falls back to
the committed JSON only when the backend is absent, so once website-be + Postgres run the data stops
needing to be committed at all.

⛔ **Never type an update date into a dashboard's front matter.** A page names a chart file and says how
to read a date out of it — `update_from: "flu_weekly.json"` + `update_read: "week"` — and
`layouts/partials/update-stamp.html` does the reading. A hand-written date rots at the next pipeline run
with nothing to correct it, because the pipeline rewrites only the `ebola-*` pages.

⛔ **`update_read` must stay explicit; do not "simplify" it into guessing from the file.** The last label
of a series is a period in `flu_weekly` (`KT 36/26`), an age band in `covid_by_age` (`80+`) and a region
in `flu_regional_overview` (`Liberecký`). Anything that takes the last label automatically prints an age
band as an update date on a third of the dashboards, and it looks like a valid figure.
Readings: `stamp` (`generated_at` = pipeline run → "Aktualizace: …", else `posledni_datum` = data extent
→ "Data k …"), `period-end`, `week` (ISO week → its Sunday), `month`, `year`. ⚠️ Month and year are not
converted to a day — ISIN by disease group is an annual series and a fabricated 31 Dec would claim daily
precision. ⚠️ Four pages have no date to read and keep a sentence about frequency: the two Nextstrain
builds and wastewater run on someone else's server, hantavirus is a closed situational report.

## Common commands

```bash
git clone --recurse-submodules <url>          # the theme is a submodule — always recurse
# dev stack (Hugo + BE + DB, ports on localhost only):
docker compose -f deploy/docker-compose.yml -f deploy/docker-compose.dev.yml up
# production FE build:
(cd frontend && hugo --minify)                 # -> frontend/public/
# tests for one BE service:
(cd backend/website-be && pip install -r requirements.txt && pytest)
```

Every BE service has `GET /health`. In production the services do not listen on the host — everything goes
through Apache.

## Conventions (EFSA project style — detail in `CONTRIBUTING.md`)

- **Commit:** `PP-<n>: message`  •  escape: `no-issue: …`  (prefix = repo variable `PROJECT_PREFIX=PP`).
- **Branch:** `feature|bugfix|docs/PP-<n>_desc`  •  escape: `no-issue/...`.
- **`dev`** = free sandbox — push directly, no PR, no checks. ⚠️ **But since 17 Aug a push to `dev`
  DEPLOYS to staging**, which reviewers look at. Still free to break; just not unobserved.
- **Checks run ONLY on PR → `main`:** `commit-message-check`, `hugo-build` and **`backend-tests / pytest`**
  are all **required**. ⚠️ **Note the exact name — it is `backend-tests / pytest`, with the suffix.** That
  job calls a reusable workflow, and GitHub names such checks `<calling job> / <called job>`. Protection
  matches on the exact string, so the plain `backend-tests` that was configured on 23 Aug matched nothing:
  it stayed pending and **blocked every PR into `main`** until 31 Aug, when PR #24 exposed it. The 23 Aug
  "verified against the API" only confirmed the name was *listed*, not that anything *reports* it.
  `branch-name-check` runs but is not required. 1 approving review, stale
  reviews dismissed, no force-push, no deletion. `enforce_admins` is **off**, so an admin can bypass.
  Automations: issue prefixer, branch→issue linker, PR notify.
- **Both deploys are LIVE since 17 Aug** (this used to say production was off).
  `deploy-staging.yml` (push to `dev`) and `deploy-production.yml` (push to `main`) both run
  tests → Hugo build → rsync. Production has been exercised **once**, verified byte-identical to the manual
  build. ⛔ **One flag per environment** (`DEPLOY_STAGING_ENABLED` / `DEPLOY_PRODUCTION_ENABLED`) — it used
  to be a single `DEPLOY_ENABLED`, so enabling staging also armed production. Do not merge them back.
- **Host keys are pinned, not scanned** (23 Aug). Both workflows write the server's key from
  `STAGING_SSH_HOST_KEY` / `PRODUCTION_SSH_HOST_KEY` and rsync with `StrictHostKeyChecking=yes`;
  `ssh-keyscan` trusted whatever answered, on every run. The keys are also in `-priv/ansible/known_hosts`.
- ⚠️ **`STAGING_PATH` is `/` and that is deliberate.** Staging's deploy key is pinned to a forced
  `rrsync -wo` command on the server, and rrsync prefixes a leading-slash client path with its restricted
  directory. `PRODUCTION_PATH` is still the absolute path because production's jail is not on yet — the
  server switch and the variable must change in the same window, server first.
- **Tests gate both deploys** via the reusable `_test-backend.yml`; it fails if it finds *no* tests.
- Staging and production have **separate** hosts and keys (`vars.STAGING_HOST`/`PRODUCTION_HOST`,
  `secrets.STAGING_SSH_KEY`/`PRODUCTION_SSH_KEY`) — do not merge them. `baseURL` is derived from `*_HOST`;
  no hostname is hardcoded.
- **Merges to `main` must be squash/rebase** (linear history) — so **realign `dev` with `main` right after
  every release**, or the two histories drift and the next release conflicts. This has bitten us twice.
- Full workflow reference: `.github/workflows/WORKFLOWS_GUIDE.md`.

## Related repos

- `pathogensportal-priv` — **private** infra (Ansible, configs, Vault). Nothing infra or secret goes here.
- `pathogensportal-db` — scrapers + DB schema, attached as a **submodule pinned to a release tag**
  (currently `v0.4.0`; URL in `.gitmodules` points at the `elixir-cz-pathogens` org). After every
  pipeline release the pin must be bumped in a PR here, or production keeps building the old
  `datascrapper` image — this was missed once and cost a debugging session.

## Rules

- **Never commit secrets or real data** (the repo is public). Data stays out of git via `.gitignore`.
- Keep the live site working — production deploys from `upstream` on the CESNET VM; don't break the build.
- When editing the site, verify it still builds (`hugo`) before opening a PR to `main`.
