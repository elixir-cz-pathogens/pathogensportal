---
title: "Infectious Diseases — ISIN dashboard"
origin: aggregated
description: "Overview of notified infectious diseases in the Czech Republic 2018–2025 from ÚZIS — regional map, top diagnoses, age structure and seasonal trends."
image: "/images/cards/infectious-hub.svg"
highlight: true
tags: ["infectious diseases", "surveillance", "ÚZIS", "regions", "Czech Republic"]
data_source: '<a href="https://datanzis.uzis.gov.cz" target="_blank">ÚZIS CZ — ISIN Open Data (CC BY 4.0)</a>'
update_freq: "Continuous updates (data 2018–2025)"
---

{{< nav-pills group="infekcni-nemoci" active="prehled" >}}

This dashboard shows notified infectious diseases in the Czech Republic based on data from the **Infectious Diseases Information System (ISIN)**, maintained by the Institute of Health Information and Statistics (ÚZIS CZ) and the Ministry of Health. The data covers 272,000+ records since 2018 across all 14 regions.

---

### Regional map — total number of cases

The choropleth map shows the total number of notified infectious diseases in each Czech region for the most recent year available. Hover over a region to see the exact count.

{{< region-map id="isinMap" src="/data/charts/isin_regional_map.json" title="Notified infectious diseases by Czech region"  note="Absolute counts of notified cases for the most recent year. Not population-adjusted — the map largely mirrors regional population size." >}}

---

### Regional map — incidence per 100,000 population

The same data adjusted for regional population size (denominators: Czech Statistical Office). **The two maps look completely different — and the second one is the right one for comparing regions.**

Absolute counts mostly mirror where more people live. Prague has an average absolute case count, but after adjusting for population it has the **lowest incidence of all regions** (720.6 per 100k). The Vysočina region, unremarkable in absolute counts, is the **highest** (1,639.9).

{{< region-map id="isinIncidence" src="/data/charts/isin_regional_incidence.json" unit="cases per 100k" title="Infectious disease incidence by Czech region — per 100,000 population"  note="Population-adjusted: notified cases per year per 100,000 regional population (denominators: Czech Statistical Office). This is the right map for comparing regions." >}}

Regional differences may also reflect the coverage and capacity of the notifying network, not just true occurrence.

---

### Top 10 diagnoses — annual counts 2018–2025

An overview of the ten most frequently notified infectious diseases by case count in each year.
Varicella (chickenpox) has long dominated thanks to mandatory notification and its high transmissibility in the child population.

{{< chart id="isinTopDiseases" src="/data/charts/isin_top_diseases.json" type="bar" title="Top 10 infectious diseases — case counts (2018–2025)" height="420"  note="Absolute annual counts of notified cases, whole country. Not population-adjusted." >}}

---

### Seasonal trends for selected diseases (monthly)

The monthly course of selected infectious diseases illustrates seasonality: varicella peaks in spring, salmonellosis and campylobacteriosis in summer, and Lyme borreliosis from June to September.

{{< chart id="isinMonthly" src="/data/charts/isin_monthly_trend.json" type="line" title="Seasonal course — monthly case counts" height="380"  note="Absolute monthly counts of notified cases, whole country." >}}

---

### Age structure of cases (cumulative 2018–2025)

The distribution of notified cases by age group over the whole observation period. The highest-risk groups are children under 14 (varicella, GI infections) and seniors aged 65+ (complicated courses).

{{< chart id="isinAge" src="/data/charts/isin_age_groups.json" type="bar" title="Number of notified cases by age group (2018–2025)" height="360"  note="Absolute case counts 2018–2025 by age group. Not adjusted for the size of each age group in the population." >}}

---

### Notes on the data

- The data comes from **ISIN** (Infectious Diseases Information System), mandatory notification under Act No. 258/2000 Coll.
- Publisher: **ÚZIS CZ / Ministry of Health** — licensed CC BY 4.0
- Database: `Otevrena-data-NR-27-01-infekcni-nemoci.csv` (~272,000 records, 2018–2025)
- Columns: year, month, region (NUTS3), diagnosis (ICD-10), age group, sex, EWS flag, case count
- Case counts are aggregated (not individual patient records)
- Differences between regions may also reflect the capacity and coverage of the notifying network

<p class="stat-source">
  Source: <a href="https://datanzis.uzis.gov.cz/data/NR-27-ISIN/NR-27-01/Otevrena-data-NR-27-01-infekcni-nemoci.csv" target="_blank">ÚZIS CZ — ISIN Open Data</a> ·
  Licence: <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank">CC BY 4.0</a> ·
  Category: mandatory notification of infectious diseases · Years: 2018–2025
</p>
