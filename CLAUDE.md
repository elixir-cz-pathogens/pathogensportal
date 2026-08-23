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
- **`dev`** = free sandbox — push directly, no PR, no checks. ⚠️ **But since 17 Aug a push to `dev`
  DEPLOYS to staging**, which reviewers look at. Still free to break; just not unobserved.
- **Checks run ONLY on PR → `main`:** `commit-message-check`, `hugo-build` **and `backend-tests`** are all
  **required** (verified against the branch-protection API, 23 Aug 2026 — this used to say `backend-tests`
  was not required yet; it is). `branch-name-check` runs but is not required. 1 approving review, stale
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
- `pathogensportal-db` — scrapers + DB schema, attached as a **submodule** (pinned to tag `v0.1.0-dev`).
  ⚠️ It temporarily points at `draessld/pathogensportal-db` (a fork); the colleague's canonical repo is
  `jirkavlasak/pathogensportal-db` — the submodule URL switches once he fills it. ⚠️ Fix the URL in
  `.gitmodules` in the same PR if the org migration has already happened.

## Rules

- **Never commit secrets or real data** (the repo is public). Data stays out of git via `.gitignore`.
- Keep the live site working — production deploys from `upstream` on the CESNET VM; don't break the build.
- When editing the site, verify it still builds (`hugo`) before opening a PR to `main`.
