---
title: "COVID-19 Surveillance"
description: "The SARS-CoV-2 epidemiological situation in the Czech Republic — daily cases, hospitalisations, testing and vaccination."
image: "/images/cards/covid.svg"
highlight: true
tags: ["SARS-CoV-2", "hospitalisation", "vaccination", "surveillance", "Czech MoH", "Czech Republic"]
data_source: '<a href="https://onemocneni-aktualne.mzcr.cz" target="_blank">Czech Ministry of Health — Disease Update</a>'
update_freq: "Daily"
---

{{< nav-pills group="infekcni-nemoci" active="covid" >}}
<a href="https://onemocneni-aktualne.mzcr.cz/covid-19" target="_blank" class="btn btn-primary mb-3 me-2">
  Official COVID-19 portal of the Czech Ministry of Health →
</a>
<a href="https://virus.img.cas.cz/" target="_blank" class="btn btn-outline-secondary mb-3">
  Live SARS-CoV-2 charts — virus.img.cas.cz →
</a>

---

{{< stat-card src="/data/charts/covid_summary.json" >}}

{{< chart id="covidCases" src="/data/charts/covid_cases_weekly.json" title="New cases and deaths — weekly overview" height="380"  note="Absolute counts: newly confirmed cases and deaths summed per calendar week, whole country. Not population-adjusted." >}}

{{< chart id="covidHosp" src="/data/charts/covid_hospitalization.json" title="Hospitalisations — patient status (weekly maximum)" height="380"  note="Absolute counts of patients hospitalised at the same time (weekly maximum of the daily census), whole country." >}}

{{< chart id="covidTest" src="/data/charts/covid_testing.json" title="PCR test positivity (%)" height="280"  note="Percentage share: positive detections / all PCR tests performed in the given week." >}}

{{< chart id="covidInc" src="/data/charts/covid_incidence.json" title="7-day incidence per 100,000 inhabitants" height="280"  note="Population-adjusted: new cases over the last 7 days per 100,000 population." >}}

---

### Data sources and methodology

The data is downloaded from the **Czech Ministry of Health open data** (API v2) and covers daily reports from the start of the pandemic.

| Indicator | Source | Update |
|---|---|---|
| New cases, deaths | [Ministry of Health — persons](https://onemocneni-aktualne.mzcr.cz/covid-19) | daily |
| Hospitalisations | [Ministry of Health — hospitalisations](https://onemocneni-aktualne.mzcr.cz/covid-19) | daily |
| PCR testing | [Ministry of Health — tests](https://onemocneni-aktualne.mzcr.cz/covid-19) | daily |
| Genomic surveillance | [COG-CZ / virus.img.cas.cz](https://virus.img.cas.cz/) | continuous |

<p class="stat-source">Data: <a href="https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19" target="_blank">Czech MoH Open Data API v2</a> · Licence: Czech open data</p>
