---
title: "Infectious diseases — overview"
origin: aggregated
description: "Overview of notified infectious diseases in the Czech Republic 2018–2025 from ÚZIS — regional map, top diagnoses, age structure and thematic disease groups."
image: "/images/cards/infectious-hub.svg"
highlight: true
tags: ["infectious diseases", "surveillance", "ÚZIS", "regions", "Czech Republic"]
data_source: '<a href="https://datanzis.uzis.gov.cz" target="_blank">ÚZIS CZ — ISIN Open Data (CC BY 4.0)</a>'
update_from: "isin_monthly_trend.json"
update_read: "month"
---

{{< nav-pills group="infekcni-nemoci" active="prehled" >}}

This dashboard shows notified infectious diseases in the Czech Republic based on data from the **Infectious Diseases Information System (ISIN)**, maintained by the Institute of Health Information and Statistics (ÚZIS CZ) and the Ministry of Health. The data cover the years 2018–2025 and all 14 regions. A detailed breakdown by disease group is in the tabs above.

---

### Regional map — total number of cases

The map shows the total number of notified infectious diseases in each Czech region for the most recent year available. Hover over a region or tap it to see the exact count.

{{< region-map id="isinMap" src="/data/charts/isin_regional_map.json" title="Notified infectious diseases by Czech region — absolute counts"  note="Absolute counts of notified cases for the most recent year. Not population-adjusted — the map largely mirrors regional population size." >}}

---

### Regional map — incidence per 100,000 population

The same data adjusted for regional population size (denominators: Czech Statistical Office, [CC BY 4.0 under the ČSÚ terms](https://csu.gov.cz/podminky_pro_vyuzivani_a_dalsi_zverejnovani_statistickych_udaju_csu)). Incidence is derived by the portal, not official ČSÚ statistics. **Use the incidence map to compare regions**; absolute counts mostly reflect the size of a region's population.

For 2025: Prague has an average absolute case count, but after adjusting for population it has the **lowest incidence of all regions** (720.6 per 100k). Conversely, the Vysočina region, unremarkable in absolute counts, is the **highest** after adjustment (1,639.9). The Moravian-Silesian region has the most cases in absolute numbers, but only ranks fourth in incidence.

{{< region-map id="isinIncidence" src="/data/charts/isin_regional_incidence.json" unit="cases per 100k" title="Infectious disease incidence by Czech region — per 100,000 population"  note="Population-adjusted: notified cases per year per 100,000 regional population (denominators: Czech Statistical Office). This map is the one to use for comparing regions." >}}

Regional differences may also reflect the coverage and capacity of the notifying network, not just true occurrence — a higher incidence need not mean more disease, it may also mean more thorough reporting.

---

### 10 most common diagnoses — annual counts 2018–2025

An overview of the ten most frequently notified infectious diseases by case count in each year.
Chickenpox has long been the most frequently notified disease.

{{< chart id="isinTopDiseases" src="/data/charts/isin_top_diseases.json" type="bar" title="10 most common infectious diseases — case counts (2018–2025)" height="420"  note="Absolute annual counts of notified cases, whole country. Not population-adjusted." >}}

---

### Seasonal course — monthly case counts

Monthly time series of the most frequent diagnoses show seasonality (varicella peaks
in spring, salmonellosis in summer) as well as exceptional events — the 2024 pertussis epidemic
is visible as a pronounced peak unlike any previous year.

{{< chart id="isinMonthly" src="/data/charts/isin_monthly_trend.json" type="line" title="Seasonal course — monthly case counts" height="380"  note="Absolute monthly counts of notified cases, whole country." >}}

---

### Age structure of cases (cumulative 2018–2025)

The distribution of notified cases by age group over the whole observation period. Most notified cases are in children under 14 (mainly chickenpox and gastrointestinal infections).

{{< chart id="isinAge" src="/data/charts/isin_age_groups.json" type="bar" title="Number of notified cases by age group (2018–2025)" height="360"  note="Absolute case counts 2018–2025 by age group. Not adjusted for the size of each age group in the population." >}}

---

### Methodology and limitations

- The data comes from **ISIN** (Infectious Diseases Information System), mandatory notification under Act No. 258/2000 Coll.
- Publisher: **ÚZIS CZ / Ministry of Health** — [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) licence
- Database: `Otevrena-data-NR-27-01-infekcni-nemoci.csv` (2018–2025; one row is an aggregated count, not one case)
- Columns: year, month, region (NUTS3), diagnosis (ICD-10), age group, sex, EWS flag, case count
- Case counts are aggregated (not individual patient records)
- Influenza is left out — it has its own, more detailed source (NIPH), see the influenza dashboards
- The layout of this dashboard is inspired by the Swiss [Infectious Disease Dashboard](https://www.idd.bag.admin.ch/en)

<p class="stat-source">
  Source: <a href="https://datanzis.uzis.gov.cz/data/NR-27-ISIN/NR-27-01/Otevrena-data-NR-27-01-infekcni-nemoci.csv" target="_blank">ÚZIS CZ — ISIN Open Data</a> ·
  Licence: <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank">CC BY 4.0</a> ·
  Category: mandatory notification of infectious diseases · Years: 2018–2025
</p>
