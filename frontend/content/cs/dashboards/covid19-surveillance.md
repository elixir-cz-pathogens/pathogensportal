---
title: "COVID-19 Surveillance"
description: "Epidemiologická situace SARS-CoV-2 v České republice — denní případy, hospitalizace, testování a vakcinace."
image: "/images/dashboard-placeholder.svg"
highlight: true
tags: ["SARS-CoV-2", "hospitalizace", "vakcinace", "surveillance", "MZČR", "ČR"]
data_source: '<a href="https://onemocneni-aktualne.mzcr.cz" target="_blank">MZČR — onemocnění aktuálně</a>'
update_freq: "Denně"
---

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
