---
title: "Infekční nemoci — Ostatní"
description: "Souhrn zbytkových ICD kategorií infekčních nemocí, co nezapadají do žádné konkrétní skupiny, v ČR 2018–2025 (ÚZIS ISIN)."
image: "/images/cards/id-other.svg"
tags: ["infekční nemoci", "ÚZIS", "ISIN"]
data_source: '<a href="https://datanzis.uzis.gov.cz" target="_blank">ÚZIS ČR — Otevřená data ISIN (CC BY 4.0)</a>'
build:
  list: never
  render: always
---

<div class="d-flex flex-wrap gap-1 mb-4" role="navigation" aria-label="Sekce infekčních nemocí">
  <a href="/dashboards/infectious-diseases/" class="btn btn-sm btn-outline-secondary me-1 mb-1">Přehled</a>
  <a href="/dashboards/infectious-diseases-childhood/" class="btn btn-sm btn-outline-secondary me-1 mb-1">Časté dětské/vzdušné</a>
  <a href="/dashboards/infectious-diseases-gastro/" class="btn btn-sm btn-outline-secondary me-1 mb-1">Střevní/potravinové</a>
  <a href="/dashboards/infectious-diseases-skin/" class="btn btn-sm btn-outline-secondary me-1 mb-1">Kožní/kontaktní</a>
  <a href="/dashboards/infectious-diseases-vector/" class="btn btn-sm btn-outline-secondary me-1 mb-1">Klíšťaty/zvířaty přenášené</a>
  <a href="/dashboards/infectious-diseases-hepatitis/" class="btn btn-sm btn-outline-secondary me-1 mb-1">Hepatitidy</a>
  <a href="/dashboards/infectious-diseases-sti/" class="btn btn-sm btn-outline-secondary me-1 mb-1">Pohlavně přenosné</a>
  <a href="/dashboards/infectious-diseases-rare/" class="btn btn-sm btn-outline-secondary me-1 mb-1">Vzácné závažné</a>
  <a href="/dashboards/infectious-diseases-other/" class="btn btn-sm btn-outline-secondary me-1 mb-1 active">Ostatní</a>
  <a href="/dashboards/covid19-surveillance/" class="btn btn-sm btn-outline-secondary me-1 mb-1">COVID-19 — Surveillance</a>
  <a href="/dashboards/covid-demographics/" class="btn btn-sm btn-outline-secondary me-1 mb-1">COVID-19 — Věk a vakcinace</a>
</div>

Souhrnný součet přibližně 80 zbytkových ICD diagnóz ("jiné ... nezařazené jinde" apod.), co nejsou samostatně dostatečně specifické pro vlastní skupinu. Jednotlivé diagnózy jsou v tabulce pod grafem na stránce [Top 10 diagnóz](/dashboards/infectious-diseases/).

{{< chart id="isinOther" src="/data/charts/isin_group_other.json" type="bar" title="Ostatní diagnózy (souhrn) — roční počty případů (2018–2025)" height="380" >}}

<p class="stat-source">
  Zdroj: <a href="https://datanzis.uzis.gov.cz" target="_blank">ÚZIS ČR — Otevřená data ISIN</a> ·
  Licence: <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank">CC BY 4.0</a>
</p>
