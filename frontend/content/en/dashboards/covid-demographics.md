---
title: "COVID-19 — Age and vaccination"
description: "4.9 million confirmed COVID-19 cases in the Czech Republic by age and vaccination status — deaths, case fatality, hospitalisations. Czech MoH open data, updated continuously."
image: "/images/cards/covid-demographics.svg"
tags: ["SARS-CoV-2", "deaths", "vaccination", "epidemiology", "Czech MoH"]
data_source: '<a href="https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19" target="_blank">Czech MoH — COVID-19 Open Data</a>'
update_freq: "With every data pipeline run (sources updated daily)"
build:
  list: never
  render: always
---

{{< nav-pills group="infekcni-nemoci" active="covid-demografie" >}}

### Cases and deaths by age group

Distribution of confirmed cases and deaths by patient age over the whole pandemic
period (since March 2020). Cases concentrate in working-age groups; deaths
overwhelmingly in the oldest.

{{< callout >}}
**22,780 cases (0.5%) have no age recorded in the source data** — they are not in
the chart but are included in the overall totals.
{{< /callout >}}

{{< chart id="covidByAge" src="/data/charts/covid_by_age.json" type="bar" title="COVID-19 cases and deaths by age group (whole period)" height="400" note="Absolute counts over the whole pandemic period, whole country. Not adjusted for the size of each age group in the population." >}}

---

### Case fatality by age

The share of deaths among confirmed cases (case fatality ratio) in each age group.
Fatality rises by orders of magnitude with age: hundredths of a percent below 40,
over 11% above 80.

{{< chart id="covidCfrAge" src="/data/charts/covid_cfr_by_age.json" type="bar" title="Case fatality (CFR %) by age group" height="360" note="Percentage share: deaths / confirmed cases in the given age group. CFR also depends on testing intensity — it is overestimated in periods of weak testing." >}}

---

### Cases and hospitalisations by vaccination status

Daily Czech MoH reports by vaccination status, summed over the period **from
January 2021** (the categories did not exist before vaccination started).

{{< chart id="covidByVax" src="/data/charts/covid_by_vaccination.json" type="bar" title="COVID-19 cases and hospitalisations — vaccination status (since 1/2021)" height="360" note="Absolute counts since January 2021. The groups differ substantially in size and age structure — comparing bars directly is not vaccine effectiveness." >}}

---

### Hospitalisation rate by vaccination status

The share of hospitalised among those testing positive in each group. **Interpret
with care:** the booster group is much older than average (vaccination was
prioritised by age), so its higher hospitalisation rate mainly reflects age
structure, not vaccine failure. These aggregate data do not allow age adjustment.

{{< chart id="covidHospVax" src="/data/charts/covid_hosp_rate_by_vax.json" type="bar" title="Hospitalisation rate (%) — vaccination status" height="300" note="Percentage share: hospitalised / positive in the given group, since January 2021. Not age-adjusted — the groups have different age structures." >}}

---

### Methodological note

- Sources: Czech MoH open datasets
  [`osoby`](https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19) (4.9 million cases
  with age and region), [`umrti`](https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19)
  (44 thousand deaths with age) and `ockovani-pozitivni` / `ockovani-hospitalizace`
  (daily counts by vaccination status).
- All charts are generated automatically by the data pipeline and update with it —
  no manual step in between.
- Case fatality (CFR) = deaths / confirmed cases; the true infection fatality rate
  (IFR) is lower, because not every infection was captured by a test.
- The open data do not include hospitalisations by age; they do by vaccination status.

<p class="stat-source">
  Source: <a href="https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19" target="_blank">Czech MoH open data</a> ·
  period 3/2020–present (vaccination since 1/2021)
</p>
