---
title: "Architektura"
description: "Repozitáře, tok dat a jak se web staví."
weight: 10
---

## Repozitáře

- [`elixir-cz-pathogens/pathogensportal`](https://github.com/elixir-cz-pathogens/pathogensportal)
  — tento web (Hugo) a backendové služby.
- [`elixir-cz-pathogens/pathogensportal-db`](https://github.com/elixir-cz-pathogens/pathogensportal-db)
  — scrapery zdrojů, zpracování dat a generování dat pro grafy. Do webu je zapojený jako
  git submodul připnutý na vydanou verzi.

## Jak se data dostanou na web

Web je **statický**: data pro grafy jsou soubory JSON přímo v repozitáři webu. Generuje je
`pathogensportal-db`; nová data se do webu dostávají jako změny v repozitáři a web se pak znovu
sestaví a nasadí. Pokud běží backend,
grafy si data berou z jeho API, jinak ze statických souborů — výsledek je stejný.
