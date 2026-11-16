---
title: "Infectious diseases — other"
origin: aggregated
description: "Infectious diagnoses outside the thematic groups in the Czech Republic: the ten most frequent by year, and age (ÚZIS ISIN)."
image: "/images/cards/id-other.svg"
update_from: "isin_group_other.json"
update_read: "year"
tags: ["infectious diseases", "ÚZIS", "ISIN"]
data_source: '<a href="https://www.nzip.cz/data/2621-infekcni-nemoci-otevrena-data" target="_blank">ÚZIS CZ — ISIN open data (CC BY 4.0)</a>'
build:
  list: never
  render: always
---

{{< nav-pills group="infekcni-nemoci" active="ostatni" >}}

Diagnoses that belong to no thematic group: sepsis, enterobiasis, viral meningitis, pneumonia with an identified agent and dozens of others, mostly with few cases.

---

### Most frequent diagnoses

The ten diagnoses outside the thematic groups with the most reported cases in the chosen year. Hover over a row for the official ICD-10 name.

{{% if-data file="isin_groups.json" %}}
{{< isin part="other" note="Absolute annual counts of reported cases, whole country, open ISIN data; influenza is left out. The second colour marks records from EWS reports, in use since July 2025." >}}
{{% /if-data %}}
{{% if-data file="isin_groups.json" not="true" %}}
{{< chart id="isinOther" src="/data/charts/isin_group_other.json" type="bar" title="Other diagnoses (combined) — annual case counts" height="380"  note="Absolute annual counts of notified cases, whole country. Not population-adjusted." >}}
{{% /if-data %}}

{{% if-data file="isin_groups.json" %}}
---

### Age

How many reported cases of this group fall on 100,000 people of the same age. The age groups differ in width (the first covers one year of age, the last everyone from 75), so the count alone is not shown.

{{< isin part="group-age" group="other" note="Diagnoses of this group in the last completed year, whole country. Rates per population are computed by the portal (denominators from the Czech Statistical Office), not an official CZSO statistic." >}}
{{% /if-data %}}

---

### Methodology and limitations

- The data come from the open **ISIN** data (Infectious Diseases Information System, ÚZIS CZ), mandatory notification under Act No. 258/2000 Coll. They are updated once a year and end with December of the last completed year.
- Records from EWS reports (automated reporting from healthcare providers and laboratories) appear in the data from July 2025 and their share keeps growing; counts from then on cannot be compared with earlier years.
- The number of reported cases is not the number of people ill: it captures only those who saw a physician and were reported.
- Rates per 100,000 population are computed by the portal from Czech Statistical Office data (population on 31 December); they are not an official CZSO statistic.
- Since November 2026 whooping cough, infectious mononucleosis and other viral rash infections have been in the group Childhood/airborne; until then they made up most of this page's total.

<p class="stat-source">
  Source: <a href="https://www.nzip.cz/data/2621-infekcni-nemoci-otevrena-data" target="_blank">ÚZIS CZ — ISIN Open Data</a> ·
  Licence: <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank">CC BY 4.0</a> ·
  denominators <a href="https://csu.gov.cz" target="_blank">Czech Statistical Office</a> (<a href="https://csu.gov.cz/podminky_pro_vyuzivani_a_dalsi_zverejnovani_statistickych_udaju_csu" target="_blank">CZSO terms</a>)
</p>
