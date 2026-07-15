# CLAUDE.md — pathogensportal

Public repo of **Pathogen Portal CZ** — a static Hugo website plus a data pipeline that feeds it.
Fork of `jirkavlasak/pathogensportal` (`upstream`); this fork (`origin = draessld/pathogensportal`)
is the working repo. Live site: `https://pathogens.vm.cesnet.cz`.

Docs are written in **Czech**; code and commit messages in English.

## Layout

| Path | What |
|---|---|
| `frontend/` | Hugo web (`hugo.toml`, `content/`, `layouts/`, `static/`). Theme is a **git submodule** (`frontend/themes/…`). |
| `backend/` | FastAPI služby, **jeden adresář = jeden kontejner**: `website-be`, `llm-agent-be`, `mcp`. |
| `deploy/` | `docker-compose.yml` (produkce), `docker-compose.dev.yml` (dev override), `.env.example`. |
| `.github/workflows/` | CI + automations — see `WORKFLOWS_GUIDE.md`. |

Scraper + DB schéma jsou v repu **`pathogensportal-db`** (git submodule, přijde později), monitoring
(Grafana) v **`pathogensportal-priv`**. Do portálu patří jen FE + BE služby.

## Common commands

```bash
git clone --recurse-submodules <url>          # téma je submodule — vždy recurse
# dev stack (Hugo + BE + DB, porty jen na localhost):
docker compose -f deploy/docker-compose.yml -f deploy/docker-compose.dev.yml up
# produkční build FE:
(cd frontend && hugo --minify)                 # -> frontend/public/
# testy jedné BE služby:
(cd backend/website-be && pip install -r requirements.txt && pytest)
```

Každá BE služba má `GET /health`. V produkci služby neposlouchají na hostiteli — vše jde přes Apache.

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
