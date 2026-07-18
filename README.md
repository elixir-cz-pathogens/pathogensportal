# Pathogen Portal CZ

Český portál pro sledování dat o patogenech (COVID-19, chřipka, …). **Frontend** je statický web
v [Hugo](https://gohugo.io/), **backend** tvoří kontejnerizované FastAPI služby.

Produkčně běží na **https://pathogens.vm.cesnet.cz/**.

## Struktura

```
frontend/            Hugo web (téma jako git submodule ve frontend/themes/)
frontend/content/    obsah stránek (dashboardy, news, …)
frontend/static/     statika vč. frontend/static/data/charts/*.json pro grafy
backend/             FastAPI služby — jeden adresář = jeden kontejner
  website-be/          API brána a business logika
  llm-agent-be/        AI jádro (sémantické dotazy, reasoning)
  mcp/                 Model Context Protocol adaptér
deploy/              docker-compose (produkce + dev override) + .env.example
.github/workflows/   CI a automatizace (viz WORKFLOWS_GUIDE.md)
```

Scrapery + DB schéma jsou v samostatném repu **`pathogensportal-db`**, připojeném jako **git submodule**
(`pathogensportal-db/`, pinnutý na tag). Monitoring (Grafana) je v privátním **`pathogensportal-priv`**.

### Data pro grafy

Chart JSON se **commituje** do `frontend/static/data/charts/` (web je čistě statický). Regenerace:
```bash
git submodule update --init --recursive
OUTPUT_DIR=../frontend/static/data/charts python pathogensportal-db/generate_json.py
# nebo v kontejneru:
docker compose -f deploy/docker-compose.yml --profile tools run --rm datascrapper
```

## Lokální vývoj

Vyžaduje Docker + Docker Compose. Téma je submodule → klonuj s `--recurse-submodules`.

```bash
docker compose -f deploy/docker-compose.yml -f deploy/docker-compose.dev.yml up
```

- Hugo dev server: http://localhost:1313/ (live reload)
- website-be / llm-agent-be / mcp: `127.0.0.1:8000` / `:8001` / `:8002` (health: `/health`)
- PostgreSQL: `127.0.0.1:5432`

Tajemství: zkopíruj `deploy/.env.example` na `deploy/.env` a vyplň (necommituje se).

## Build FE / testy BE

```bash
(cd frontend && hugo --minify)                         # -> frontend/public/
(cd backend/website-be && pip install -r requirements.txt && pytest)
```

## Konvence a nasazení

Commit/branch konvence a workflow: viz `CONTRIBUTING.md` a `.github/workflows/WORKFLOWS_GUIDE.md`.
V produkci Apache servíruje `frontend/public/` a je reverzní proxy před BE službami (TLS: Let's Encrypt).
