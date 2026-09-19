---
title: "Infectious diseases — Tuberculosis"
origin: aggregated
description: "Tuberculosis in Czechia 2000–2024 from the Tuberculosis Register: incidence per 100,000 population, age, country of birth and regions."
image: "/images/cards/id-other.svg"
update_from: "tbc_incidence.json"
update_read: "year"
tags: ["infectious diseases", "ÚZIS", "tuberculosis", "TB"]
data_source: '<a href="https://www.nzip.cz/data/2671-tuberkuloza-epidemiologie-otevrena-data" target="_blank">ÚZIS CZ — Tuberculosis Register</a> · <a href="https://csu.gov.cz" target="_blank">Czech Statistical Office</a>'
build:
  list: never
  render: always
---

{{< nav-pills group="infekcni-nemoci" active="tbc" >}}

Tuberculosis has its own mandatory register in Czechia and is not part of the ISIN data. Over
a quarter of a century it has fallen to less than a third — and who it affects has changed too.

{{< chart id="tbcIncidence" src="/data/charts/tbc_incidence.json" type="line" title="Tuberculosis — newly notified cases per 100,000 population (2000–2024)" height="360" note="All forms of tuberculosis (ICD-10 A15–A19); year of incidence = first confirmed date of disease in the register. Adjusted to the Czech population. WHO classes countries below 10 cases per 100,000 as low-incidence." >}}

{{< chart id="tbcOrigin" src="/data/charts/tbc_origin.json" type="bar" title="Tuberculosis by the patient's country of birth" height="360" note="Absolute annual counts. Cases among people born in Czechia have fallen to less than a fifth since 2000 (from 1,258 to 223); the share of those born abroad therefore grows even though their absolute number changes far less. Country of birth is not the same as citizenship or place of infection." >}}

{{< chart id="tbcAge" src="/data/charts/tbc_age.json" type="line" title="Tuberculosis by age" height="340" note="Absolute annual counts in three age groups as provided by the source. The groups differ in width — 19–64 covers most of the population — so the curves say nothing about risk per person. Age-group labels come from the source data and remain in Czech." >}}

{{< region-map id="tbcMap" src="/data/charts/tbc_map.json" unit="cases per 100,000 per year" title="Tuberculosis by region — three-year average per 100,000 population" note="Average annual number of cases over the last three years per 100,000 population of the region. Averaging is deliberate: a region has around thirty cases a year, and a single year would be mostly chance. The region is the region of dispensary care, not necessarily of residence." >}}

### Points to keep in mind

- **The data lag by a year.** The register is published annually; the latest year is 2024.
- **Small numbers.** Around 430 cases a year for the whole country — read regional differences and year-to-year swings with care.
- **Country of birth is missing for some cases** and these are assigned according to the source's flag.

<p class="stat-source">
  Source: <a href="https://www.nzip.cz/data/2671-tuberkuloza-epidemiologie-otevrena-data" target="_blank">ÚZIS CZ — Epidemiology of tuberculosis (open data)</a> ·
  denominators <a href="https://csu.gov.cz" target="_blank">Czech Statistical Office</a> · Licence: free access
</p>
