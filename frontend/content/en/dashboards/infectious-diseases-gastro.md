---
title: "Infectious Diseases — Gastrointestinal/foodborne"
origin: aggregated
description: "Salmonellosis, viral intestinal infections, shigellosis and other foodborne infections in the Czech Republic 2018–2025 (ÚZIS ISIN)."
image: "/images/cards/id-gastro.webp"
update_from: "isin_group_gastrointestinal.json"
update_read: "year"
tags: ["infectious diseases", "ÚZIS", "ISIN", "foodborne"]
data_source: '<a href="https://datanzis.uzis.gov.cz" target="_blank">ÚZIS CZ — ISIN Open Data (free access)</a>'
build:
  list: never
  render: always
---

{{< nav-pills group="infekcni-nemoci" active="strevni" >}}

Infections transmitted by food or the faecal–oral route: salmonellosis, viral intestinal infections, shigellosis and bacterial food poisoning.

{{< chart id="isinGastro" src="/data/charts/isin_group_gastrointestinal.json" type="bar" title="Gastrointestinal/foodborne diseases — annual case counts (2018–2025)" height="420"  note="Absolute annual counts of notified cases, whole country. Not population-adjusted." >}}

<p class="stat-source">
  Source: <a href="https://datanzis.uzis.gov.cz" target="_blank">ÚZIS CZ — ISIN Open Data</a> ·
  Licence: <a href="https://data.gov.cz/podm%C3%ADnky-u%C5%BEit%C3%AD/voln%C3%BD-p%C5%99%C3%ADstup/" target="_blank">free access</a>
</p>
