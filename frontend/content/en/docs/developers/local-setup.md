---
title: "Local setup"
translationKey: docs-local-setup
description: "How to run the website on your own computer."
weight: 20
---

## Requirements

- [Hugo](https://gohugo.io/) **0.164.0 extended** (the same version as in CI)
- git
- optionally Python 3.12 for the backend and Docker for the full stack

## Website

```bash
git clone --recurse-submodules https://github.com/elixir-cz-pathogens/pathogensportal.git
cd pathogensportal/frontend
hugo server                 # http://localhost:1313/
```

The repository has two submodules: the theme `frontend/themes/hugo-pathogens-portal` and the data
processing `pathogensportal-db`. Without the theme Hugo builds empty pages; if you cloned without
`--recurse-submodules`, run `git submodule update --init`.

Production build: `hugo --minify` (output in `frontend/public/`).

## Backend and the full stack

```bash
(cd backend/website-be && pip install -r requirements.txt && pytest)

# Hugo + backend + PostgreSQL, ports on 127.0.0.1 only
docker compose -f deploy/docker-compose.yml -f deploy/docker-compose.dev.yml up
```

## New chart data

```bash
OUTPUT_DIR=../frontend/static/data/charts python pathogensportal-db/scripts/generate_json.py
```
