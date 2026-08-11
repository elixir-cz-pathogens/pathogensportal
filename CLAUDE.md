# CLAUDE.md — pathogensportal

Public repo of **Pathogen Portal CZ** — a static Hugo website plus a data pipeline that feeds it.
Fork of `jirkavlasak/pathogensportal` (`upstream`); this fork (`origin = draessld/pathogensportal`)
is the working repo. Live site: `https://pathogens.vm.cesnet.cz`.

Docs, code and commit messages are in **English**. The only Czech is the site's own content in
`frontend/content/cs/`, which is what the public reads.

> ⚠️ **This repo is moving to a GitHub organization** (decided 6 Aug 2026). It is transferred **second**,
> after `pathogensportal-priv`, because it is the one with consequences: the fork relationship with
> upstream, branch protection, and the repo variables. Procedure and verification:
> `prep_phase/devops_intra/GITHUB_ORG_MIGRATION.md` in the workspace.

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
- `frontend/content/en/` — **an English translation, NOT BUILT YET**: `hugo.toml` has no `[languages.en]`
  section, so Hugo ignores the directory. To bring the English version up, `[languages.en]` with
  `contentDir = "content/en"` has to be added (and the `/en/` URL plus a language switcher decided).

**Data model (A):** chart JSON is **committed** into `frontend/static/data/charts/` (the site stays static).
To regenerate from the submodule:
```bash
git submodule update --init --recursive
OUTPUT_DIR=../frontend/static/data/charts python pathogensportal-db/generate_json.py
# or through the container:
docker compose -f deploy/docker-compose.yml --profile tools run --rm datascrapper
```

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
- **`dev`** = free sandbox — push directly, no PR, no checks. **`main`** = protected production.
- **Checks run ONLY on PR → `main`:** `commit-message-check` + `hugo-build` (required), `backend-tests` and
  `branch-name-check` (they run, not required yet). Automations: issue prefixer, branch→issue linker, PR notify.
- **Deploy workflows are DISABLED:** `deploy-staging.yml` (push to `dev`) and `deploy-production.yml`
  (push to `main`) are gated on `if: vars.DEPLOY_ENABLED == 'true'`. Staging and production have
  **separate** hosts and keys (`vars.STAGING_HOST`/`PRODUCTION_HOST`,
  `secrets.STAGING_SSH_KEY`/`PRODUCTION_SSH_KEY`) — do not merge them. `baseURL` is derived from `*_HOST`;
  no hostname is hardcoded.
- Merges to `main` must be **squash/rebase** (main enforces linear history).
- Full workflow reference: `.github/workflows/WORKFLOWS_GUIDE.md`.

## Related repos

- `pathogensportal-priv` — **private** infra (Ansible, configs, Vault). Nothing infra or secret goes here.
- `pathogensportal-db` — scrapers + DB schema, attached as a **submodule** (pinned to tag `v0.1.0-dev`).
  ⚠️ It temporarily points at `draessld/pathogensportal-db` (a fork); the colleague's canonical repo is
  `jirkavlasak/pathogensportal-db` — the submodule URL switches once he fills it. ⚠️ Fix the URL in
  `.gitmodules` in the same PR if the org migration has already happened.

## Rules

- **Never commit secrets or real data** (the repo is public). Data stays out of git via `.gitignore`.
- Keep the live site working — production deploys from `upstream` on the CESNET VM; don't break the build.
- When editing the site, verify it still builds (`hugo`) before opening a PR to `main`.
