---
title: "Infekční nemoci — Střevní/potravinové"
origin: aggregated
description: "Salmonelózy, virové střevní infekce, shigelóza a další potravinou přenášené infekce v ČR 2018–2025 (ÚZIS ISIN)."
image: "/images/cards/id-gastro.webp"
update_from: "isin_group_gastrointestinal.json"
update_read: "year"
tags: ["infekční nemoci", "ÚZIS", "ISIN", "potravinové nákazy"]
data_source: '<a href="https://datanzis.uzis.gov.cz" target="_blank">ÚZIS ČR — Otevřená data ISIN (volný přístup)</a>'
build:
  list: never
  render: always
---

{{< nav-pills group="infekcni-nemoci" active="strevni" >}}

Nákazy přenášené potravou nebo fekálně-orální cestou: salmonelózy, virové střevní infekce, shigelóza a bakteriální otravy jídlem.

{{< chart id="isinGastro" src="/data/charts/isin_group_gastrointestinal.json" type="bar" title="Střevní/potravinové nemoci — roční počty případů (2018–2025)" height="420"  note="Absolutní roční počty hlášených případů, celá ČR. Nepřepočteno na obyvatele." >}}

<p class="stat-source">
  Zdroj: <a href="https://datanzis.uzis.gov.cz" target="_blank">ÚZIS ČR — Otevřená data ISIN</a> ·
  Licence: <a href="https://data.gov.cz/podm%C3%ADnky-u%C5%BEit%C3%AD/voln%C3%BD-p%C5%99%C3%ADstup/" target="_blank">volný přístup</a>
</p>
