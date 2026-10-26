---
title: "A new data layer and the Signals page"
date: 2026-09-03
translationKey: "news-pipeline-v020"
description: "Version 0.2.0 of the data processing brings incidence per 100,000 population, a regional map, updated Ebola data and automated anomaly detection across 1,200 notified disease series."
highlight: true
image: "/images/cards/signals.svg"
tags: ["news", "anomaly detection", "release"]
---

Version **0.2.0** of the portal's data processing has been released. It brings these changes:

**Signals — anomaly detection.** More than 1,200 notified infectious disease time
series (diagnosis × region) are now screened at every data update by a statistical
early-warning system using the Farrington/Noufaily method, which the UK Health Security
Agency also uses. The [Signals](/en/signals/) page shows where
notified counts exceed the expected level. In a backtest, the system caught the 2024
pertussis epidemic **three months before it became a public topic**.

**Incidence instead of raw counts.** The infectious disease maps now express cases
per 100,000 population (denominators from the Czech Statistical Office). The rates allow regions to be
compared independently of their population size.

**Updated Ebola data.** The summary, charts and value table for the Bundibugyo 2026
outbreak are generated from a curated daily series and updated continuously; the
trajectory chart newly compares growth speed against six historical outbreaks on
a logarithmic scale.

Technical changes: a normalised database layer (PostgreSQL), snapshot archiving of
downloaded data and population denominators; details in the
[pathogensportal-db](https://github.com/elixir-cz-pathogens/pathogensportal-db) repository.
