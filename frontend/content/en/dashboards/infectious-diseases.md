---
title: "Infectious diseases — overview"
origin: aggregated
description: "Notified infectious diseases in the Czech Republic from ÚZIS data: selected diagnoses by week, regions, the most frequent diagnoses, seasonal course and age."
image: "/images/cards/infectious-hub.svg"
highlight: true
tags: ["infectious diseases", "surveillance", "ÚZIS", "regions", "Czech Republic"]
data_source: '<a href="https://www.nzip.cz/data/2621-infekcni-nemoci-otevrena-data" target="_blank">ÚZIS CZ — ISIN open data (CC BY 4.0)</a> · <a href="https://www.nzip.cz/data/2620-infekcni-nemoci-mezirocni-srovnani-datovy-souhrn" target="_blank">ÚZIS CZ — weekly data summary</a>'
# The weekly summary is the freshest data on the page; `posledni_datum` is the last
# day it covers. The yearly blocks state their own year in their headings.
update_from: "isin_weekly.json"
update_read: "stamp"
---

{{< nav-pills group="infekcni-nemoci" active="prehled" >}}

This dashboard summarises the infectious diseases that must be notified in the Czech Republic to
the **Infectious Diseases Information System (ISIN)**, run by the Institute of Health Information
and Statistics (ÚZIS CZ). Influenza and COVID-19 have their own dashboards; a detailed breakdown by
disease group is in the tabs above.

Most of the dashboard draws on the open ISIN data. They cover every diagnosis by month since 2018,
but are updated only once a year, so they end with December of the last completed year.
{{% if-data file="isin_weekly.json" %}}Eleven frequent diagnoses are shown up to the previous week in the section *This year by week*, from the weekly ÚZIS summary.{{% /if-data %}}

{{< callout tone="warning" >}}
**Since July 2025 part of the cases is reported in a new way.** The Early Warning System (EWS) sends reports from physicians, hospitals and laboratories to ISIN automatically. For some diagnoses the number of reported cases jumped as a result — for shingles and Lyme disease to more than double. The rise is largely a change in reporting, not more illness, so counts from mid-2025 on cannot be compared with earlier years. The charts show the part from EWS reports in a separate colour.
{{< /callout >}}

{{% if-data file="isin_weekly.json" %}}
---

### This year by week

Eleven frequently reported diagnoses by week, up to the previous week. Choose a diagnosis: the
bars show reported cases and, in a separate colour, the part created from EWS reports. Where that
part exceeds one tenth, the text does not compare the counts with previous years.

{{< isin part="weekly" note="Absolute counts of reported cases per calendar week (Monday to Sunday), whole country, from the weekly ÚZIS data summary. “From EWS reports” are records based on automated reporting; they are part of the total, not additional cases. The number of reported cases is not the number of people ill." note_age="Rates per population are computed by the portal (denominators from the Czech Statistical Office), not an official statistic. Age groups differ in width, so the rate per 100,000 population of the group is shown instead of the count." >}}
{{% /if-data %}}

---

### Regions

Reported cases of all infectious diseases in the last completed year. The map first shows the rate
per 100,000 population of the region, because counts alone mostly reflect how many people live
there. Denominators come from the Czech Statistical Office ([CC BY 4.0 under the CZSO terms](https://csu.gov.cz/podminky_pro_vyuzivani_a_dalsi_zverejnovani_statistickych_udaju_csu));
the rate is derived by the portal, not an official CZSO statistic.

{{< comment src="/data/charts/isin_overview.json" block="regions" >}}

{{< region-map id="isinMap" title="Notified infectious diseases by Czech region" src="/data/charts/isin_regional_incidence.json" label="per 100,000 population" unit="cases per 100k" note="Population-adjusted: reported cases per year per 100,000 population of the region. Differences between regions may also reflect how thoroughly a region reports, not only the true occurrence of disease. Hover over or tap a region for the exact value." alt_src="/data/charts/isin_regional_map.json" alt_label="number of cases" alt_unit="cases" alt_note="Absolute counts of reported cases per year. Not population-adjusted — the map largely mirrors the population of the regions." >}}

---

### Most frequent diagnoses

The ten diagnoses with the most reported cases in the chosen year. The names are shortened for
readers; hover over a row for the official ICD-10 name.

{{% if-data file="isin_overview.json" %}}
{{< isin part="top" note="Absolute annual counts of reported cases, whole country, open ISIN data; influenza is left out. The second colour marks records from EWS reports, in use since July 2025: for diagnoses where they make up a large part, 2025 cannot be compared with earlier years." >}}
{{% /if-data %}}
{{% if-data file="isin_overview.json" not="true" %}}
{{< chart id="isinTopDiseases" src="/data/charts/isin_top_diseases.json" type="bar" title="10 most common infectious diseases — annual case counts" height="420"  note="Absolute annual counts of notified cases, whole country. Not population-adjusted." >}}
{{% /if-data %}}

---

### Seasonal course

Monthly series of four frequent diagnoses show seasonality (varicella peaks in spring,
salmonellosis in summer) as well as exceptional events — the whooping cough epidemic of 2024 stands
out as a peak unlike any other year. The dashed line marks July 2025, since when part of the
reports arrives through EWS.

{{< period-switch default="all" sticky="false" >}}

{{< chart id="isinMonthly" src="/data/charts/isin_monthly_trend.json" type="line" period="page" breaks="true" title="Seasonal course — monthly case counts" height="380"  note="Absolute monthly counts of reported cases, whole country. Since July 2025 (dashed line) part of the reports arrives through EWS; the series “Other spirochaetal infections” (mostly Lyme disease) and “Varicella” are not comparable with earlier years from then on." >}}

---

### Age

How many reported cases fall on 100,000 people of the same age. The adjustment is needed here: the
age groups differ in width (the first covers one year of age, the last everyone from 75), so counts
alone would compare unlike with unlike.

{{% if-data file="isin_overview.json" %}}
{{< isin part="age" note="All reported diagnoses except influenza in the last completed year, whole country. Rates per population are computed by the portal (denominators from the Czech Statistical Office), not an official CZSO statistic." >}}
{{% /if-data %}}
{{% if-data file="isin_overview.json" not="true" %}}
{{< chart id="isinAge" src="/data/charts/isin_age_groups.json" type="bar" title="Number of notified cases by age group (all years)" height="360"  note="Absolute case counts over all years by age group. Not adjusted for the size of each age group in the population." >}}
{{% /if-data %}}

---

### Methodology and limitations

- The data come from **ISIN** (Infectious Diseases Information System), mandatory notification under Act No. 258/2000 Coll.
- **ISIN open data** (ÚZIS CZ, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)): every diagnosis by year, month, region, age group and sex; one row is an aggregated count, not one case. Updated once a year.
- **Weekly ÚZIS data summary** “Meziroční srovnání počtu infekčních nemocí po týdnech v ČR” (year-on-year comparison of infectious diseases by week): eleven diagnoses by week for the last five years, with records based on EWS reports counted separately. The summary states no licence, only a citation (below); the portal draws national counts only.
- **EWS** (Early Warning System) is the part of ISIN for automated reporting from healthcare providers and laboratories. Records from EWS appear in the data from July 2025 and their share keeps growing, so counts from then on are not compared with earlier years.
- The number of reported cases is not the number of people ill: it captures only those who saw a physician and were reported.
- Rates per 100,000 population are computed by the portal from Czech Statistical Office data (population on 31 December).
- Influenza is left out — it has its own, more detailed source (NIPH), see the influenza dashboards.
- The layout of this dashboard is inspired by the Swiss [Infectious Disease Dashboard](https://www.idd.bag.admin.ch/en).

<p class="stat-source">
  Source: <a href="https://datanzis.uzis.gov.cz/data/NR-27-ISIN/NR-27-01/Otevrena-data-NR-27-01-infekcni-nemoci.csv" target="_blank">ÚZIS CZ — ISIN Open Data</a> ·
  Licence: <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank">CC BY 4.0</a> ·
  Category: mandatory notification of infectious diseases
</p>
<p class="stat-source">
  Weekly data: Šanca O., Májek T., Davidová H., Rázková K., Klimeš D., Kubát J., Blaha M., Jarkovský J. Meziroční srovnání počtu infekčních nemocí po týdnech v ČR. Národní zdravotnický informační portál [online]. Praha: Ministerstvo zdravotnictví ČR a Ústav zdravotnických informací a statistiky ČR, 2026. Dostupné z: <a href="https://www.nzip.cz/data/2620-infekcni-nemoci-mezirocni-srovnani-datovy-souhrn" target="_blank">https://www.nzip.cz/data/2620-infekcni-nemoci-mezirocni-srovnani-datovy-souhrn</a>. ISSN 2695-0340. Modifications: totals for the year and the last four weeks, the share of records from EWS reports and age-group rates per 100,000 population computed by the portal.
</p>
