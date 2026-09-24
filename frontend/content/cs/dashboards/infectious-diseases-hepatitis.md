---
title: "Infekční nemoci — Hepatitidy"
origin: aggregated
description: "Virové hepatitidy A, B a další, v ČR 2018–2025 (ÚZIS ISIN)."
image: "/images/cards/id-hepatitis.webp"
update_from: "isin_group_hepatitis.json"
update_read: "year"
tags: ["infekční nemoci", "ÚZIS", "ISIN", "hepatitida"]
data_source: '<a href="https://datanzis.uzis.gov.cz" target="_blank">ÚZIS ČR — Otevřená data ISIN (volný přístup)</a>'
build:
  list: never
  render: always
---

{{< nav-pills group="infekcni-nemoci" active="hepatitidy" >}}

Virové hepatitidy hlášené v ČR: chronická virová hepatitida, akutní hepatitida A a B, a další akutní/neurčené formy.

{{< chart id="isinHepatitis" src="/data/charts/isin_group_hepatitis.json" type="bar" title="Hepatitidy — roční počty případů (2018–2025)" height="420"  note="Absolutní roční počty hlášených případů, celá ČR. Nepřepočteno na obyvatele." >}}

<p class="stat-source">
  Zdroj: <a href="https://datanzis.uzis.gov.cz" target="_blank">ÚZIS ČR — Otevřená data ISIN</a> ·
  Licence: <a href="https://data.gov.cz/podm%C3%ADnky-u%C5%BEit%C3%AD/voln%C3%BD-p%C5%99%C3%ADstup/" target="_blank">volný přístup</a>
</p>
