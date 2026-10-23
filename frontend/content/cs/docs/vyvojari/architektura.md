---
title: "Architektura"
description: "Repozitáře, tok dat, role backendu a jak se web staví."
weight: 10
---

## Repozitáře

- [`elixir-cz-pathogens/pathogensportal`](https://github.com/elixir-cz-pathogens/pathogensportal)
  — tento web (Hugo) a backendové služby.
- [`elixir-cz-pathogens/pathogensportal-db`](https://github.com/elixir-cz-pathogens/pathogensportal-db)
  — scrapery zdrojů, zpracování dat a generování dat pro grafy. Do webu je zapojený jako
  git submodul připnutý na vydanou verzi.

## Tok dat

```
zdroje (ÚZIS, SZÚ, MZČR, WHO, ECDC, ČSÚ)
  → pathogensportal-db: stažení, kontrola, zpracování
  → soubory JSON ve frontend/static/data/charts/ (součást repozitáře webu)
  → Hugo sestaví statický web
  → nasazení na server (Apache)
```

Web je **statický**: data pro grafy jsou soubory JSON přímo v repozitáři webu a web funguje
i bez jakéhokoli backendu. Nová data se do webu dostávají jako změny v repozitáři; web se pak
znovu sestaví a nasadí.

## Backend

Backend `website-be` (FastAPI, adresář `backend/website-be/`) s databází PostgreSQL dnes běží
**jen na testovacím serveru** (staging), na produkci ne. Nabízí:

| Endpoint | K čemu slouží |
|---|---|
| `GET /api/charts`, `GET /api/charts/{klíč}` | stejná data grafů jako statické soubory, načtená z databáze |
| `GET /health` | stav služby a databáze |
| `/api/intake/…` | příjem dat od poskytovatelů (žádosti, klíče, nahrávání) |

Skript `pp-charts.js` se na každé stránce nejdřív zeptá `/api/charts`. Pokud backend odpoví,
čte data z něj, jinak ze statických souborů; výsledek je v obou případech stejný. Smyslem je
připravit přechod, kdy datové zpracování bude zapisovat do databáze místo do repozitáře.
