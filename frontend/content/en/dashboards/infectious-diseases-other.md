---
title: "Infectious Diseases — Other"
description: "Aggregate of residual ICD categories of infectious diseases that do not fit any specific group, Czech Republic 2018–2025 (ÚZIS ISIN)."
image: "/images/cards/id-other.svg"
tags: ["infectious diseases", "ÚZIS", "ISIN"]
data_source: '<a href="https://datanzis.uzis.gov.cz" target="_blank">ÚZIS CZ — ISIN Open Data (CC BY 4.0)</a>'
build:
  list: never
  render: always
---

{{< nav-pills group="infekcni-nemoci" active="ostatni" >}}

Aggregate of roughly 80 residual ICD diagnoses ("other …, not elsewhere classified" and similar) that are not specific enough for a group of their own. Individual diagnoses are listed in the table under the chart on the [Top 10 diagnoses](/en/dashboards/infectious-diseases/) page.

{{< chart id="isinOther" src="/data/charts/isin_group_other.json" type="bar" title="Other infectious diseases — annual case counts (2018–2025)" height="420" >}}

<p class="stat-source">
  Source: <a href="https://datanzis.uzis.gov.cz" target="_blank">ÚZIS CZ — ISIN Open Data</a> ·
  Licence: <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank">CC BY 4.0</a>
</p>
