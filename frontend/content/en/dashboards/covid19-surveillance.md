---
title: "COVID-19: epidemiological situation"
origin: aggregated
description: "Weekly overview of COVID-19 in the Czech Republic: new cases and deaths, hospitalisations, testing and positivity, 7-day incidence."
image: "/images/cards/covid.webp"
highlight: true
tags: ["SARS-CoV-2", "hospitalisation", "vaccination", "surveillance", "Czech MoH", "Czech Republic"]
data_source: '<a href="https://onemocneni-aktualne.mzcr.cz" target="_blank">Czech Ministry of Health — Disease Update</a> · <a href="https://erviss.org/" target="_blank">ECDC ERVISS</a>'
# The date comes from posledni_datum in this JSON, not from here.
update_from: "covid_summary.json"
update_read: "stamp"
---

{{< nav-pills group="infekcni-nemoci" active="covid" >}}

This dashboard follows COVID-19 in the Czech Republic since March 2020. It draws on the open
datasets of the Czech Ministry of Health, which are updated daily; positivity in the laboratory
surveillance of respiratory viruses comes from the European system ECDC ERVISS.

The charts show the last 12 months. The waves of 2020–2022 were orders of magnitude higher than
today's figures and would hide the current development in a single chart — use the switch above
the charts to see earlier years or the whole period.

<a href="https://onemocneni-aktualne.mzcr.cz/covid-19" target="_blank" class="btn btn-primary mb-3 me-2">
  Official COVID-19 portal of the Czech Ministry of Health →
</a>
<a href="https://virus.img.cas.cz/" target="_blank" class="btn btn-outline-secondary mb-3">
  Continuously updated SARS-CoV-2 charts (virus.img.cas.cz) →
</a>

---

{{< stat-card src="/data/charts/covid_summary.json" >}}

{{< period-switch >}}

### New cases

A confirmed case is a person with a positive test. How much testing is done has changed a great
deal over time, so the chart captures only some of the infections and counts from different years
cannot be compared directly. It does show well when a wave is rising and when it is receding.

{{< comment src="/data/charts/covid_comments.json" block="cases" >}}

{{< chart id="covidCases" src="/data/charts/covid_cases_weekly.json" series="0" type="bar" period="page" title="New cases per week" height="340" note="Absolute counts: newly confirmed cases summed per calendar week, whole country. Not population-adjusted." >}}

The same figures relative to population. The course matches the weekly counts; the unit suits
comparison with other countries.

{{< chart id="covidInc" src="/data/charts/covid_incidence.json" title="7-day incidence per 100,000 inhabitants" height="280"  note="Population-adjusted: new cases over the last 7 days per 100,000 population." period="page" >}}

---

### Deaths

Deaths follow a wave of cases with a delay of several weeks. When counts are low the figure
fluctuates from week to week; a longer period shows the development, not the difference between
two neighbouring weeks.

{{< comment src="/data/charts/covid_comments.json" block="deaths" >}}

{{< chart id="covidDeaths" src="/data/charts/covid_cases_weekly.json" series="1" type="bar" period="page" title="Deaths per week" height="300" note="Absolute counts: deaths summed per calendar week, whole country. Not population-adjusted." >}}

---

### Hospitalisations

The chart shows how many patients with COVID-19 were in hospital at the same time, not how many
were newly admitted. It depends less on how much testing is done outside hospitals than the
number of cases does. The ICU, mechanical ventilation and ECMO series are parts of the total,
not additions to it.

{{< comment src="/data/charts/covid_comments.json" block="hospitalization" >}}

{{< chart id="covidHosp" src="/data/charts/covid_hospitalization.json" title="Hospitalisations — patient status (weekly maximum)" height="380"  note="Absolute counts of patients hospitalised at the same time (weekly maximum of the daily census), whole country." period="page" >}}

---

### Testing and positivity

Positivity is the share of tests with a positive result. It depends less on the number of tests
performed than the number of cases does, so it shows better whether infections have been rising
or falling in recent weeks. Hover over or tap a point to see how many tests the percentage comes from.

{{< comment src="/data/charts/covid_comments.json" block="positivity" >}}

{{< chart id="covidTest" src="/data/charts/covid_testing.json" title="COVID-19 test positivity (%)" height="300"  note="Share of positive results among tests performed per calendar week, separately for PCR and antigen tests — each test type has its own denominator. Since mid-August 2026 only tens of PCR tests a week are reported, so PCR positivity fluctuates; weeks with fewer than 30 tests are not shown." period="page" >}}

Positivity in the laboratory surveillance of respiratory viruses according to the ECDC —
SARS-CoV-2 next to influenza and RSV, each virus with its own number of specimens tested.

{{< chart id="covidPositivityErviss" src="/data/charts/flu_positivity_weekly.json" type="line" title="Weekly positivity — SARS-CoV-2, influenza, RSV" height="320" note="Share of positive specimens among those tested, in percent, whole country, ECDC ERVISS data. SARS-CoV-2 ends in week 33/2026: from the following week ERVISS reports a different number of tested specimens (the same as for influenza) and the figures do not continue the series." >}}

---

### Methodology and limitations

The data come from the **Czech Ministry of Health open datasets** (API v2) and cover the period since March 2020.

| Indicator | Source | Update |
|---|---|---|
| New cases, deaths | [Ministry of Health — persons](https://onemocneni-aktualne.mzcr.cz/covid-19) | daily |
| Hospitalisations | [Ministry of Health — hospitalisations](https://onemocneni-aktualne.mzcr.cz/covid-19) | daily |
| PCR and antigen tests | [Ministry of Health — tests](https://onemocneni-aktualne.mzcr.cz/covid-19) | daily |
| Positivity in laboratory surveillance | [ECDC ERVISS](https://erviss.org/) | weekly |

<p class="stat-source">Data: <a href="https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19" target="_blank">Czech MoH Open Data API v2</a> · terms of use: <a href="https://data.gov.cz/zdroj/datov%C3%A9-sady/00024341/9c7c00c45a83021ea370be94fe1b4ca1" target="_blank">no copyrighted works, database not protected (NKOD)</a></p>
<p class="stat-source">ECDC ERVISS: “Dataset provided by ECDC based on data provided by public health authorities, scientific institutes or health care providers in the relevant reporting countries and/or by WHO.” · Modifications: weekly positivity computed by the portal from specimens tested and detections.</p>
