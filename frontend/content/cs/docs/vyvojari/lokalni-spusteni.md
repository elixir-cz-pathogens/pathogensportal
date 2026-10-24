---
title: "Lokální spuštění"
translationKey: docs-local-setup
description: "Jak web spustit na vlastním počítači."
weight: 20
---

## Požadavky

- [Hugo](https://gohugo.io/) **0.164.0 extended** (stejná verze jako v CI)
- git
- volitelně Python 3.12 pro backend a Docker pro celý stack

## Web

```bash
git clone --recurse-submodules https://github.com/elixir-cz-pathogens/pathogensportal.git
cd pathogensportal/frontend
hugo server                 # http://localhost:1313/
```

Repozitář má dva submoduly: motiv `frontend/themes/hugo-pathogens-portal` a datové zpracování
`pathogensportal-db`. Bez motivu Hugo sestaví prázdné stránky; pokud jste klonovali bez
`--recurse-submodules`, spusťte `git submodule update --init`.

Produkční build: `hugo --minify` (výstup do `frontend/public/`).

## Backend a celý stack

```bash
(cd backend/website-be && pip install -r requirements.txt && pytest)

# Hugo + backend + PostgreSQL, porty jen na 127.0.0.1
docker compose -f deploy/docker-compose.yml -f deploy/docker-compose.dev.yml up
```

## Nová data pro grafy

```bash
OUTPUT_DIR=../frontend/static/data/charts python pathogensportal-db/scripts/generate_json.py
```
