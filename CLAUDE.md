# CLAUDE.md — pathogensportal

Public repo of **Pathogen Portal CZ** — a static Hugo website plus a data pipeline that feeds it.
Fork of `jirkavlasak/pathogensportal` (`upstream`); this fork (`origin = elixir-cz-pathogens/pathogensportal`)
is the working repo. Live site: `https://pathogens.vm.cesnet.cz`.

Docs are written in **Czech**; code and commit messages in English.

## Layout

| Path | What |
|---|---|
| `frontend/` | Hugo web (`hugo.toml`, `content/`, `layouts/`, `static/`). Theme is a **git submodule** (`frontend/themes/…`). |
| `backend/` | FastAPI služby, **jeden adresář = jeden kontejner**: `website-be`, `llm-agent-be`, `mcp`. |
| `deploy/` | `docker-compose.yml` (produkce), `docker-compose.dev.yml` (dev override), `.env.example`. |
| `pathogensportal-db/` | **git submodule** — scrapery, `db/init.sql`, generátor chart JSON. Pinnuto na tag. |
| `.github/workflows/` | CI + automations — see `WORKFLOWS_GUIDE.md`. |

Monitoring (Grafana) je v **`pathogensportal-priv`**. Do portálu patří FE + BE služby + submodule s daty.

### Jazyky obsahu (pozor)

- `frontend/content/cs/` — **česky, buduje se** (`hugo.toml` → `[languages.cs]`, běží na `/`).
- `frontend/content/en/` — **anglický překlad, ZATÍM SE NEBUDUJE**: v `hugo.toml` chybí sekce
  `[languages.en]`, takže Hugo tenhle adresář ignoruje. Pro spuštění anglické verze je potřeba
  doplnit `[languages.en]` s `contentDir = "content/en"` (a rozmyslet URL `/en/` + jazykový přepínač).

**Model dat (A):** chart JSON se **commituje** do `frontend/static/data/charts/` (web zůstává statický).
Regenerace ze submodulu:
```bash
git submodule update --init --recursive
OUTPUT_DIR=../frontend/static/data/charts python pathogensportal-db/generate_json.py
# nebo přes kontejner:
docker compose -f deploy/docker-compose.yml --profile tools run --rm datascrapper
```

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
- **Checks run ONLY on PR → `main`:** `commit-message-check` + `hugo-build` (required), `backend-tests` a
  `branch-name-check` (běží, zatím ne required). Automations: issue prefixer, branch→issue linker, PR notify.
- **Deploy workflows jsou VYPNUTÉ:** `deploy-staging.yml` (push `dev`) a `deploy-production.yml` (push `main`)
  mají gate `if: vars.DEPLOY_ENABLED == 'true'`. Zapnout až bude server + `github-deploy` a secrets
  `DEPLOY_SSH_KEY` / `DEPLOY_HOST` / `DEPLOY_USER`.
- Merge to `main` must be **squash/rebase** (main enforces linear history).
- Full workflow reference: `.github/workflows/WORKFLOWS_GUIDE.md`.

## Related repos

- `pathogensportal-priv` — **private** infra (Ansible, configs, Vault). Nothing infra/secret goes here.
- `pathogensportal-db` — scrapery + schéma DB, napojené jako **submodule** (pinnuto na tag `v0.1.0-dev`).
  ⚠️ Dočasně míří na `draessld/pathogensportal-db` (fork); kanonický repo kolegy je
  `jirkavlasak/pathogensportal-db` — až ho naplní, přepne se URL submodulu.

## Rules

- **Never commit secrets or real data** (repo is public). Data stays out of git via `.gitignore`.
- Keep the live site working — production deploys from `upstream` on the CESNET VM; don't break the build.
- When editing the site, verify it still builds (`hugo`) before opening a PR to `main`.
