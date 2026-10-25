---
title: "Infekční nemoci — Ostatní"
origin: aggregated
description: "Souhrn zbytkových ICD kategorií infekčních nemocí, co nezapadají do žádné konkrétní skupiny, v ČR 2018–2025 (ÚZIS ISIN)."
image: "/images/cards/id-other.svg"
update_from: "isin_group_other.json"
update_read: "year"
tags: ["infekční nemoci", "ÚZIS", "ISIN"]
data_source: '<a href="https://datanzis.uzis.gov.cz" target="_blank">ÚZIS ČR — Otevřená data ISIN (CC BY 4.0)</a>'
build:
  list: never
  render: always
---

{{< nav-pills group="infekcni-nemoci" active="ostatni" >}}

Souhrnný součet přibližně 80 zbytkových diagnóz MKN-10 („jiné…, nezařazené jinde“ apod.), které nejsou dostatečně specifické pro vlastní skupinu.

{{< chart id="isinOther" src="/data/charts/isin_group_other.json" type="bar" title="Ostatní diagnózy (souhrn) — roční počty případů (2018–2025)" height="380"  note="Absolutní roční počty hlášených případů, celá ČR. Nepřepočteno na obyvatele." >}}

<p class="stat-source">
  Zdroj: <a href="https://datanzis.uzis.gov.cz" target="_blank">ÚZIS ČR — Otevřená data ISIN</a> ·
  Licence: <a href="https://creativecommons.org/licenses/by/4.0/deed.cs" target="_blank">CC BY 4.0</a>
</p>
