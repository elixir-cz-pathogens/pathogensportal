---
title: "Infectious diseases — other"
origin: aggregated
description: "Aggregate of residual ICD categories of infectious diseases that do not fit any specific group, Czech Republic 2018–2025 (ÚZIS ISIN)."
image: "/images/cards/id-other.svg"
update_from: "isin_group_other.json"
update_read: "year"
tags: ["infectious diseases", "ÚZIS", "ISIN"]
data_source: '<a href="https://datanzis.uzis.gov.cz" target="_blank">ÚZIS CZ — ISIN Open Data (CC BY 4.0)</a>'
build:
  list: never
  render: always
---

{{< nav-pills group="infekcni-nemoci" active="ostatni" >}}

Aggregate of roughly 80 residual ICD-10 diagnoses ("other…, not elsewhere classified" and similar) that are not specific enough for a group of their own.

{{< chart id="isinOther" src="/data/charts/isin_group_other.json" type="bar" title="Other diagnoses (combined) — annual case counts (2018–2025)" height="380"  note="Absolute annual counts of notified cases, whole country. Not population-adjusted." >}}

<p class="stat-source">
  Source: <a href="https://datanzis.uzis.gov.cz" target="_blank">ÚZIS CZ — ISIN Open Data</a> ·
  Licence: <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank">CC BY 4.0</a>
</p>
