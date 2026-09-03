---
title: "A new data layer and the Signals page"
date: 2026-09-03
description: "Data pipeline v0.2.0 brings incidence per 100,000 population, a regional map, fresh Ebola data — and automated anomaly detection across 1,200 notified disease series."
highlight: true
image: "/images/cards/signals.svg"
tags: ["news", "anomaly detection", "release"]
---

The portal has received its biggest update since launch. The data pipeline is out in
version **0.2.0**, and several new things have appeared on the site with it:

**Signals — anomaly detection.** More than 1,200 notified infectious disease time
series (diagnosis × region) are now screened on every pipeline run by a statistical
early-warning system using the Farrington/Noufaily method — the same one used by the
UK Health Security Agency. The [Signals](/en/dashboards/signals/) page shows where
notified counts exceed the expected level. In a backtest, the system caught the 2024
pertussis epidemic **three months before it became a public topic**.

**Incidence instead of raw counts.** The infectious disease maps now express cases
per 100,000 population (denominators from the Czech Statistical Office) — regional
comparisons finally say something about the epidemiological situation rather than
population size.

**Fresh Ebola data.** The summary, charts and value table for the Bundibugyo 2026
outbreak are generated from a curated daily series and updated continuously; the
trajectory chart newly compares growth speed against six historical outbreaks on
a logarithmic scale.

Under the hood: a normalised database layer (PostgreSQL), snapshot archiving of
downloaded data and population denominators — details in the
[pathogensportal-db](https://github.com/elixir-cz-pathogens/pathogensportal-db) repository.
