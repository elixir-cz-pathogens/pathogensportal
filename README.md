# Pathogen Portal CZ

Český portál pro sledování dat o patogenech (COVID-19, chřipka, …). **Frontend** je statický web
v [Hugo](https://gohugo.io/), **backend** tvoří kontejnerizované FastAPI služby.

Produkčně běží na **https://pathogens.vm.cesnet.cz/** (Apache, Let's Encrypt certifikát).

## Struktura

```
frontend/            Hugo web (téma jako git submodule ve frontend/themes/)
frontend/content/    obsah stránek (dashboardy, news, …)
frontend/layouts/    přepisy šablon z tématu (viz „Přepisy šablon tématu")
frontend/static/     statika vč. frontend/static/data/charts/*.json pro grafy
frontend/static/vendor/  lokálně hostované Bootstrap, jQuery, DataTables, Chart.js
                         (viz „Proč jsou knihovny lokálně, ne z CDN")
backend/             FastAPI služby — jeden adresář = jeden kontejner
  website-be/          API brána a business logika
  llm-agent-be/        AI jádro (sémantické dotazy, reasoning)
  mcp/                 Model Context Protocol adaptér
deploy/              docker-compose (produkce + dev override) + .env.example
.github/workflows/   CI a automatizace (viz WORKFLOWS_GUIDE.md)
```

Scrapery + DB schéma jsou v samostatném repu **`pathogensportal-db`**, připojeném jako **git submodule**
(`pathogensportal-db/`, pinnutý na tag). Monitoring (Grafana) je v privátním **`pathogensportal-priv`**.

## Přepisy šablon tématu

Téma `hugo-pathogens-portal` je git submodule (cizí repo), takže se v něm needitujeme
napřímo. Hugo umí přepsat libovolnou šablonu tématu stejnojmenným souborem ve vlastním
`frontend/layouts/`. Používáme to pro:

- `frontend/layouts/partials/head.html`, `footer.html` — natažení lokálních (ne CDN)
  knihoven, viz níže
- `frontend/layouts/partials/navbar.html` — oprava odkazu na ELIXIR logo (vede na
  `elixir-europe.org`, ne zpátky na hlavní stránku)
- `frontend/layouts/dashboards/single.html` — lokální Chart.js místo CDN

Při update tématu (submodulu) zkontrolovat, jestli tyhle přepisy pořád dávají smysl.

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

## Proč jsou knihovny lokálně, ne z CDN

Šablona tématu původně natahovala Bootstrap, Bootstrap Icons, DataTables, jQuery a
Chart.js z externích CDN (`cdn.jsdelivr.net`, `cdn.datatables.net`, `code.jquery.com`).
Na sítích, které tyhle domény blokují nebo filtrují (běžné na akademických/firemních
sítích), se CSS/JS vůbec nenačetlo a stránka se zobrazila bez stylů. Řešení: všechny
tyhle knihovny jsou stažené a hostované lokálně v `frontend/static/vendor/`, šablony na ně
odkazují **relativní** cestou (`/vendor/...`), takže se vždy natáhnou ze stejné domény
a stejného protokolu (http/https) jako zbytek stránky.

**Důležité:** cokoliv v `frontend/layouts/` (přepisy šablon) musí odkazovat na vlastní
zdroje relativní cestou nebo přes Hugo `.RelPermalink`, nikdy přes `.Permalink`
(ten generuje absolutní URL podle `baseURL`, tedy natvrdo `https://`) — jinak se
při návštěvě přes `http://` prohlížeč pokusí o CORS spojení jinam a při
nedůvěryhodném certifikátu to spadne (přesně tohle se stalo s `theme.min...css`).

## Konvence a nasazení

Commit/branch konvence a workflow: viz `CONTRIBUTING.md` a `.github/workflows/WORKFLOWS_GUIDE.md`.
V produkci Apache servíruje `frontend/public/` a je reverzní proxy před BE službami (TLS: Let's Encrypt).
