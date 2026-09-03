---
title: "COVID-19 — Age and vaccination"
description: "Analysis of 12.6 million COVID-19 cases in the Czech Republic by patient age and vaccination status — hospitalisations and hospitalisation rate. Data from the Czech Ministry of Health."
image: "/images/cards/covid-demographics.svg"
highlight: false
tags: ["SARS-CoV-2", "hospitalisation", "vaccination", "epidemiology", "Czech MoH"]
data_source: '<a href="https://onemocneni-aktualne.mzcr.cz" target="_blank">Czech Ministry of Health — COVID-19 Open Data</a>'
update_freq: "Aggregate data (entire pandemic period)"
---

{{< nav-pills group="infekcni-nemoci" active="covid-demografie" >}}
### Cases and hospitalisations by year of birth

Distribution of COVID-19 cases and hospitalisations by the patient's year of birth (5-year cohorts).
The pandemic hit unevenly: older age groups account for a disproportionately large share of hospitalisations.

{{< callout >}}
**1,630,992 cases (12.9%) have no year of birth recorded** and are therefore not in the chart. This is not an age group but a missing value in the source records; any comparison between cohorts describes the recorded part of the data, not the entire infected population. A further 10 cases have a birth year before 1900 (obvious data-entry errors) and are excluded as well.
{{< /callout >}}

{{< chart id="covidByAge" src="/data/charts/covid_by_age.json" type="bar" title="COVID-19 cases and hospitalisations — year of birth (entire period)" height="400" >}}

---

### Hospitalisation rate by age

The percentage of hospitalised patients out of all confirmed cases in a given age cohort.
The hospitalisation rate rises sharply with age — for the oldest cohorts it exceeds 15%.

{{< chart id="covidHospAge" src="/data/charts/covid_hosp_rate_by_age.json" type="bar" title="Hospitalisation rate (%) — year of birth" height="360" >}}

---

### Cases and hospitalisations by vaccination status

The total number of confirmed cases and hospitalisations by the number of vaccine doses received.
The data reflects the **entire pandemic period** — unvaccinated people form the largest group, partly because it is also the most numerous cohort.

{{< chart id="covidByVax" src="/data/charts/covid_by_vaccination.json" type="bar" title="COVID-19 cases and hospitalisations — vaccination status" height="360" >}}

---

### Hospitalisation rate by vaccination status

Hospitalisation rate (%) relative to the number of confirmed cases in each vaccination group.
Repeated booster doses are associated with a lower hospitalisation rate.

{{< chart id="covidHospVax" src="/data/charts/covid_hosp_rate_by_vax.json" type="bar" title="Hospitalisation rate (%) — vaccination status" height="300" >}}

---

### Methodological note

- Source database: the **`pacienti` table** from the Czech Ministry of Health COVID-19 open data (12.6 million records)
- Vaccination status is derived from the dates of doses 1–4 in the database; patients with no record = unvaccinated or not linkable
- Hospitalisation rate = number hospitalised / number of confirmed cases × 100
- Year of birth stands in for age (exact age is not in the database) — cohorts aggregated in 5-year bands
- Mortality cannot be quantified precisely from this data (the `Umrti` column is a hospitalisation diagnosis, not overall mortality)

<p class="stat-source">
  Source: <a href="https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19" target="_blank">Czech Ministry of Health open data</a> ·
  12.6 million patient records · entire pandemic period ·
  Aggregation: SQL GROUP BY via the sqlite3 CLI in a subprocess
</p>
