---
title: "Infectious Diseases — Other"
origin: aggregated
description: "Aggregate of residual ICD categories of infectious diseases that do not fit any specific group, Czech Republic 2018–2025 (ÚZIS ISIN)."
image: "/images/cards/id-other.svg"
update_from: "isin_group_other.json"
update_read: "year"
tags: ["infectious diseases", "ÚZIS", "ISIN"]
data_source: '<a href="https://datanzis.uzis.gov.cz" target="_blank">ÚZIS CZ — ISIN Open Data (free access)</a>'
build:
  list: never
  render: always
---

{{< nav-pills group="infekcni-nemoci" active="ostatni" >}}

Aggregate of roughly 80 residual ICD diagnoses ("other …, not elsewhere classified" and similar) that are not specific enough for a group of their own. Individual diagnoses are listed in the table under the chart on the [Top 10 diagnoses](/en/dashboards/infectious-diseases/) page.

{{< chart id="isinOther" src="/data/charts/isin_group_other.json" type="bar" title="Other infectious diseases — annual case counts (2018–2025)" height="420"  note="Absolute annual counts of notified cases, whole country. Not population-adjusted." >}}

<p class="stat-source">
  Source: <a href="https://datanzis.uzis.gov.cz" target="_blank">ÚZIS CZ — ISIN Open Data</a> ·
  Licence: <a href="https://data.gov.cz/podm%C3%ADnky-u%C5%BEit%C3%AD/voln%C3%BD-p%C5%99%C3%ADstup/" target="_blank">free access</a>
</p>
