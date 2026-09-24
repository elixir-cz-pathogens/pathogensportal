---
title: "Infectious Diseases — Rare severe"
origin: aggregated
description: "Diphtheria, mpox, meningococcal disease, typhoid fever, Q fever, brucellosis, yellow fever, tularaemia — Czech Republic 2018–2025 (ÚZIS ISIN)."
image: "/images/cards/id-rare.webp"
update_from: "isin_group_rare_severe.json"
update_read: "year"
tags: ["infectious diseases", "ÚZIS", "ISIN", "rare diseases"]
data_source: '<a href="https://datanzis.uzis.gov.cz" target="_blank">ÚZIS CZ — ISIN Open Data (free access)</a>'
build:
  list: never
  render: always
---

{{< nav-pills group="infekcni-nemoci" active="vzacne" >}}

Diseases tracked individually regardless of case counts — a single notified case of diphtheria, mpox or yellow fever is epidemiologically significant even though the numbers are orders of magnitude below the common diseases in the other groups. The Y axis therefore uses a different scale.

{{< chart id="isinRare" src="/data/charts/isin_group_rare_severe.json" type="bar" title="Rare severe diseases — annual case counts (2018–2025)" height="420"  note="Absolute annual counts of notified cases, whole country. Not population-adjusted." >}}

<p class="stat-source">
  Source: <a href="https://datanzis.uzis.gov.cz" target="_blank">ÚZIS CZ — ISIN Open Data</a> ·
  Licence: <a href="https://data.gov.cz/podm%C3%ADnky-u%C5%BEit%C3%AD/voln%C3%BD-p%C5%99%C3%ADstup/" target="_blank">free access</a>
</p>
