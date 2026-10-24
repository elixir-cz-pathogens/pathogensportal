---
title: "Infekční nemoci — Kožní/kontaktní"
origin: aggregated
description: "Svrab, erysipel, zavšivení — kontaktem přenášené kožní infekce v ČR 2018–2025 (ÚZIS ISIN)."
image: "/images/cards/id-skin.svg"
update_from: "isin_group_skin_contact.json"
update_read: "year"
tags: ["infekční nemoci", "ÚZIS", "ISIN", "kožní infekce"]
data_source: '<a href="https://datanzis.uzis.gov.cz" target="_blank">ÚZIS ČR — Otevřená data ISIN (volný přístup)</a>'
build:
  list: never
  render: always
---

{{< nav-pills group="infekcni-nemoci" active="kozni" >}}

Nákazy šířící se přímým kontaktem s kůží: svrab, erysipel (růže) a zavšivení.

{{< chart id="isinSkin" src="/data/charts/isin_group_skin_contact.json" type="bar" title="Kožní/kontaktní nemoci — roční počty případů (2018–2025)" height="420"  note="Absolutní roční počty hlášených případů, celá ČR. Nepřepočteno na obyvatele." >}}

<p class="stat-source">
  Zdroj: <a href="https://datanzis.uzis.gov.cz" target="_blank">ÚZIS ČR — Otevřená data ISIN</a> ·
  Licence: <a href="https://data.gov.cz/podm%C3%ADnky-u%C5%BEit%C3%AD/voln%C3%BD-p%C5%99%C3%ADstup/" target="_blank">volný přístup</a>
</p>
