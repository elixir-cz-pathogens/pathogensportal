---
title: "Infekční nemoci — Vzácné závažné"
origin: aggregated
description: "Záškrt, opičí neštovice, meningokok, břišní tyfus, Q horečka, brucelóza, žlutá zimnice, tularemie — v ČR 2018–2025 (ÚZIS ISIN)."
image: "/images/cards/id-rare.webp"
update_from: "isin_group_rare_severe.json"
update_read: "year"
tags: ["infekční nemoci", "ÚZIS", "ISIN", "vzácné nemoci"]
data_source: '<a href="https://datanzis.uzis.gov.cz" target="_blank">ÚZIS ČR — Otevřená data ISIN (volný přístup)</a>'
build:
  list: never
  render: always
---

{{< nav-pills group="infekcni-nemoci" active="vzacne" >}}

Nemoci sledované jednotlivě bez ohledu na počet případů — jeden hlášený případ záškrtu, opičích neštovic nebo žluté zimnice je epidemiologicky významný, i když je řádově nižší než počty u běžných nemocí v ostatních skupinách. Osa Y proto má jiné měřítko než u ostatních skupin.

{{< chart id="isinRare" src="/data/charts/isin_group_rare_severe.json" type="bar" title="Vzácné závažné nemoci — roční počty případů (2018–2025)" height="420"  note="Absolutní roční počty hlášených případů, celá ČR. Nepřepočteno na obyvatele." >}}

<p class="stat-source">
  Zdroj: <a href="https://datanzis.uzis.gov.cz" target="_blank">ÚZIS ČR — Otevřená data ISIN</a> ·
  Licence: <a href="https://data.gov.cz/podm%C3%ADnky-u%C5%BEit%C3%AD/voln%C3%BD-p%C5%99%C3%ADstup/" target="_blank">volný přístup</a>
</p>
