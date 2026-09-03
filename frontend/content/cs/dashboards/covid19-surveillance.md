---
title: "COVID-19 Surveillance"
description: "Epidemiologická situace SARS-CoV-2 v České republice — denní případy, hospitalizace, testování a vakcinace."
image: "/images/cards/covid.svg"
tags: ["SARS-CoV-2", "hospitalizace", "vakcinace", "surveillance", "MZČR", "ČR"]
data_source: '<a href="https://onemocneni-aktualne.mzcr.cz" target="_blank">MZČR — onemocnění aktuálně</a>'
update_freq: "Denně"
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
  <a href="/dashboards/infectious-diseases-other/" class="btn btn-sm btn-outline-secondary me-1 mb-1">Ostatní</a>
  <a href="/dashboards/covid19-surveillance/" class="btn btn-sm btn-outline-secondary me-1 mb-1 active">COVID-19 — Surveillance</a>
  <a href="/dashboards/covid-demographics/" class="btn btn-sm btn-outline-secondary me-1 mb-1">COVID-19 — Věk a vakcinace</a>
</div>

<a href="https://onemocneni-aktualne.mzcr.cz/covid-19" target="_blank" class="btn btn-primary mb-3 me-2">
  Oficiální COVID-19 portál MZČR →
</a>
<a href="https://virus.img.cas.cz/" target="_blank" class="btn btn-outline-secondary mb-3">
  Živé grafy SARS-CoV-2 — virus.img.cas.cz →
</a>

---

{{< stat-card src="/data/charts/covid_summary.json" >}}

{{< chart id="covidCases" src="/data/charts/covid_cases_weekly.json" title="Nové případy a úmrtí — týdenní přehled" height="380" >}}

{{< chart id="covidHosp" src="/data/charts/covid_hospitalization.json" title="Hospitalizace — stav pacientů (týdenní maximum)" height="380" >}}

{{< chart id="covidTest" src="/data/charts/covid_testing.json" title="Pozitivita PCR testů (%)" height="280" >}}

{{< chart id="covidInc" src="/data/charts/covid_incidence.json" title="7denní incidence na 100 000 obyvatel" height="280" >}}

---

### Zdroje dat a metodika

Data jsou stahována z **MZČR otevřených dat** (API v2) a zahrnují denní hlášení od začátku pandemie.

| Ukazatel | Zdroj | Aktualizace |
|---|---|---|
| Nové případy, úmrtí | [MZČR — osoby](https://onemocneni-aktualne.mzcr.cz/covid-19) | denně |
| Hospitalizace | [MZČR — hospitalizace](https://onemocneni-aktualne.mzcr.cz/covid-19) | denně |
| PCR testování | [MZČR — testy](https://onemocneni-aktualne.mzcr.cz/covid-19) | denně |
| Genomická surveillance | [COG-CZ / virus.img.cas.cz](https://virus.img.cas.cz/) | průběžně |

<p class="stat-source">Data: <a href="https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19" target="_blank">MZČR Open Data API v2</a> · Licence: otevřená data ČR</p>
