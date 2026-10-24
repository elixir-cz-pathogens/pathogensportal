---
title: "Architecture"
translationKey: docs-architecture
description: "Repositories, data flow, the role of the backend and how the site is built."
weight: 10
---

## Repositories

- [`elixir-cz-pathogens/pathogensportal`](https://github.com/elixir-cz-pathogens/pathogensportal)
  — this website (Hugo) and the backend services.
- [`elixir-cz-pathogens/pathogensportal-db`](https://github.com/elixir-cz-pathogens/pathogensportal-db)
  — scrapers of the sources, data processing and generation of chart data. It is wired into the
  website as a git submodule pinned to a released version.

## Data flow

```
sources (ÚZIS, SZÚ, Ministry of Health, WHO, ECDC, Czech Statistical Office)
  → pathogensportal-db: download, checks, processing
  → JSON files in frontend/static/data/charts/ (part of the website repository)
  → Hugo builds a static website
  → deployment to the server (Apache)
```

The website is **static**: the chart data are JSON files right in the website repository, and the
site works without any backend at all. New data reach the website as changes in the repository;
the site is then rebuilt and deployed.

## Backend

The `website-be` backend (FastAPI, directory `backend/website-be/`) with a PostgreSQL database
currently runs **only on the test server** (staging), not on production. It offers:

| Endpoint | Purpose |
|---|---|
| `GET /api/charts`, `GET /api/charts/{key}` | the same chart data as the static files, read from the database |
| `GET /health` | status of the service and the database |
| `/api/intake/…` | data intake from providers (requests, keys, uploads) |

On every page, `pp-charts.js` first asks `/api/charts`. If the backend answers, it reads the data
from there, otherwise from the static files; the result is the same either way. The point is to
prepare the switch to data processing writing into the database instead of the repository.
