---
title: "Infekční nemoci — Ostatní"
origin: aggregated
description: "Souhrn zbytkových ICD kategorií infekčních nemocí, co nezapadají do žádné konkrétní skupiny, v ČR 2018–2025 (ÚZIS ISIN)."
image: "/images/cards/id-other.svg"
update_from: "isin_group_other.json"
update_read: "year"
tags: ["infekční nemoci", "ÚZIS", "ISIN"]
data_source: '<a href="https://datanzis.uzis.gov.cz" target="_blank">ÚZIS ČR — Otevřená data ISIN (volný přístup)</a>'
build:
  list: never
  render: always
---

{{< nav-pills group="infekcni-nemoci" active="ostatni" >}}

Souhrnný součet přibližně 80 zbytkových ICD diagnóz ("jiné ... nezařazené jinde" apod.), co nejsou samostatně dostatečně specifické pro vlastní skupinu. Jednotlivé diagnózy jsou v tabulce pod grafem na stránce [Top 10 diagnóz](/dashboards/infectious-diseases/).

{{< chart id="isinOther" src="/data/charts/isin_group_other.json" type="bar" title="Ostatní diagnózy (souhrn) — roční počty případů (2018–2025)" height="380"  note="Absolutní roční počty hlášených případů, celá ČR. Nepřepočteno na obyvatele." >}}

<p class="stat-source">
  Zdroj: <a href="https://datanzis.uzis.gov.cz" target="_blank">ÚZIS ČR — Otevřená data ISIN</a> ·
  Licence: <a href="https://data.gov.cz/podm%C3%ADnky-u%C5%BEit%C3%AD/voln%C3%BD-p%C5%99%C3%ADstup/" target="_blank">volný přístup</a>
</p>
