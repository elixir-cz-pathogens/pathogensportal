---
title: "Vydávání a nasazení"
translationKey: docs-releases
description: "Větve, automatické nasazení a kontroly."
weight: 50
---

| Větev | Kam se nasazuje | Jak se do ní dostat |
|---|---|---|
| `dev` | testovací server (staging), automaticky po každém pushi | push přímo, bez PR a kontrol |
| `main` | produkce, automaticky po sloučení | jen přes pull request s kontrolami a jedním schválením |
| `content/…` | náhled pod `/preview/pr-<číslo>/` na stagingu | obsahové PR (situační reporty) přímo do `main` |

Do produkce se změny z `dev` dostávají pull requestem do `main`. Povinné kontroly PR:
`commit-message-check`, `hugo-build`, `backend-tests / pytest`, `content-sanitizer`.
Nasazení na oba servery spouští nejdřív testy backendu; neprošlý test nasazení zastaví.

Po každém sloučení do `main` se `main` automaticky sloučí zpět do `dev`.

Podrobný popis workflow je v repozitáři v `.github/workflows/WORKFLOWS_GUIDE.md`.
