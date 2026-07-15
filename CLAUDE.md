# CLAUDE.md — pathogensportal

Public repo of **Pathogen Portal CZ** — a static Hugo website plus a data pipeline that feeds it.
Fork of `jirkavlasak/pathogensportal` (`upstream`); this fork (`origin = draessld/pathogensportal`)
is the working repo. Live site: `https://pathogens.vm.cesnet.cz`.

Docs are written in **Czech**; code and commit messages in English.

## Layout

| Path | What |
|---|---|
| `site/` | Hugo site (`hugo.toml`, `content/`, `layouts/`, `static/`). Theme is a **git submodule** (`site/themes/…`). |
| `scripts/` | Python data pipeline — scrapers + JSON generation for charts (`generate_json.py`, `run_all.py`). |
| `db/init.sql` | PostgreSQL schema. |
| `grafana/` | Grafana provisioning + dashboards. |
| `docker-compose.yml` | Local dev stack: `hugo` (dev server), `postgres`, plus `pipeline` / `nextstrain` profiles. |
| `.github/workflows/` | CI + automations — see `WORKFLOWS_GUIDE.md`. |

## Common commands

```bash
git clone --recurse-submodules <url>        # theme is a submodule — always recurse
docker compose up hugo                       # Hugo dev server on http://localhost:1313
docker compose up -d postgres                # local Postgres
(cd site && hugo --minify)                   # production build -> site/public/
```

## Conventions (styl z EFSA projektu — detail v `CONTRIBUTING.md`)

- **Commit:** `PP-<n>: message`  •  escape: `no-issue: …`  (prefix = repo variable `PROJECT_PREFIX=PP`).
- **Branch:** `feature|bugfix|docs/PP-<n>_desc`  •  escape: `no-issue/...`.
- **`dev`** = free sandbox — push directly, no PR, no checks. **`main`** = protected production.
- **Checks run ONLY on PR → `main`:** `commit-message-check` + `hugo-build` (required),
  `branch-name-check` (informational). Automations: issue prefixer, branch→issue linker, PR notify.
- Merge to `main` must be **squash/rebase** (main enforces linear history).
- Full workflow reference: `.github/workflows/WORKFLOWS_GUIDE.md`.

## Related repos

- `pathogensportal-priv` — **private** infra (Ansible, configs, Vault). Nothing infra/secret goes here.
- `pathogensportal-db` — scraper + DB management; will be wired in as a **git submodule** pinned to a release tag.

## Rules

- **Never commit secrets or real data** (repo is public). Data stays out of git via `.gitignore`.
- Keep the live site working — production deploys from `upstream` on the CESNET VM; don't break the build.
- When editing the site, verify it still builds (`hugo`) before opening a PR to `main`.
