---
title: "Přispívání do kódu"
description: "Hlášení chyb, konvence větví a commitů, licence."
weight: 60
---

## Hlášení chyb a návrhů

- k webu: [issues v pathogensportal](https://github.com/elixir-cz-pathogens/pathogensportal/issues)
- k datům a výpočtům: [issues v pathogensportal-db](https://github.com/elixir-cz-pathogens/pathogensportal-db/issues)

## Větve a commity

| | Formát | Příklad |
|---|---|---|
| Větev | `feature\|bugfix\|docs/PP-<číslo>_popis`, bez issue `no-issue/popis` | `feature/PP-42_wastewater-endpoint` |
| Commit | `PP-<číslo>: shrnutí`, bez issue `no-issue: shrnutí` | `PP-57: fix PCR positivity rounding` |

Kód, komentáře a commity se píšou anglicky; česky je jen obsah webu. Podrobnosti jsou v
`CONTRIBUTING.md` v repozitáři.

## Licence

Kód je pod licencí MIT, texty a zpracovaná data pod
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.cs).
