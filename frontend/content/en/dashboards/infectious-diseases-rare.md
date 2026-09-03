---
title: "Infectious Diseases — Rare severe"
description: "Diphtheria, mpox, meningococcal disease, typhoid fever, Q fever, brucellosis, yellow fever, tularaemia — Czech Republic 2018–2025 (ÚZIS ISIN)."
image: "/images/cards/id-rare.svg"
tags: ["infectious diseases", "ÚZIS", "ISIN", "rare diseases"]
data_source: '<a href="https://datanzis.uzis.gov.cz" target="_blank">ÚZIS CZ — ISIN Open Data (CC BY 4.0)</a>'
build:
  list: never
  render: always
---

{{< nav-pills group="infekcni-nemoci" active="vzacne" >}}

Diseases tracked individually regardless of case counts — a single notified case of diphtheria, mpox or yellow fever is epidemiologically significant even though the numbers are orders of magnitude below the common diseases in the other groups. The Y axis therefore uses a different scale.

{{< chart id="isinRare" src="/data/charts/isin_group_rare_severe.json" type="bar" title="Rare severe diseases — annual case counts (2018–2025)" height="420" >}}

<p class="stat-source">
  Source: <a href="https://datanzis.uzis.gov.cz" target="_blank">ÚZIS CZ — ISIN Open Data</a> ·
  Licence: <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank">CC BY 4.0</a>
</p>
