---
title: "Infectious diseases — tick- and animal-borne"
origin: aggregated
description: "Lyme disease, tick-borne encephalitis, tularaemia and animal bites in the Czech Republic: Lyme disease this year by week, annual development and age (ÚZIS ISIN)."
image: "/images/cards/id-vector.svg"
update_from: "isin_group_vector_animal.json"
update_read: "year"
tags: ["infectious diseases", "ÚZIS", "ISIN", "tick-borne", "zoonoses"]
data_source: '<a href="https://www.nzip.cz/data/2621-infekcni-nemoci-otevrena-data" target="_blank">ÚZIS CZ — ISIN open data (CC BY 4.0)</a> · <a href="https://www.nzip.cz/data/2620-infekcni-nemoci-mezirocni-srovnani-datovy-souhrn" target="_blank">ÚZIS CZ — weekly data summary</a>'
build:
  list: never
  render: always
---

{{< nav-pills group="infekcni-nemoci" active="klistata" >}}

Infections transmitted by ticks or acquired from animals: Lyme disease (listed in ISIN among “other spirochaetal infections”), tick-borne encephalitis and tularaemia. ISIN also records bites by dogs and other mammals in this group.

{{< callout tone="warning" >}}
**Since July 2025 part of the cases is reported in a new way (EWS).** In this group it concerns mainly Lyme disease. Counts from mid-2025 on therefore cannot be compared with earlier years: a higher figure may be a change in reporting, not more illness. The charts show the part from EWS reports in a separate colour; see the [overview](/en/dashboards/infectious-diseases/) for details.
{{< /callout >}}

{{% if-data file="isin_weekly.json" %}}
---

### This year by week

The diagnoses of this group that ÚZIS publishes by week, up to the previous week: Lyme disease. The bars show reported cases and, in a separate colour, the part created from EWS reports.

{{< isin part="weekly" group="vector_animal" note="Absolute counts of reported cases per calendar week (Monday to Sunday), whole country, from the weekly ÚZIS data summary. “From EWS reports” are records based on automated reporting; they are part of the total, not additional cases. The number of reported cases is not the number of people ill." note_age="Rates per population are computed by the portal (denominators from the Czech Statistical Office), not an official statistic. Age groups differ in width, so the rate per 100,000 population of the group is shown instead of the count." >}}
{{% /if-data %}}

---

### Annual counts

Each diagnosis has its own chart with its own axis, because counts within the group differ by orders of magnitude. The bars are single years; hover over a bar or open the table for the exact value.

{{% if-data file="isin_groups.json" %}}
{{< isin part="group" group="vector_animal" note="Absolute annual counts of reported cases, whole country, open ISIN data. Not population-adjusted. The axes of the charts differ: bar heights can be compared only within one chart." >}}
{{% /if-data %}}
{{% if-data file="isin_groups.json" not="true" %}}
{{< chart id="isinVector" src="/data/charts/isin_group_vector_animal.json" type="bar" title="Diseases transmitted by ticks and animals — annual case counts" height="420"  note="Absolute annual counts of notified cases, whole country. Not population-adjusted." >}}
{{% /if-data %}}

{{% if-data file="isin_groups.json" %}}
---

### Age

How many reported cases of this group fall on 100,000 people of the same age. The age groups differ in width (the first covers one year of age, the last everyone from 75), so the count alone is not shown.

{{< isin part="group-age" group="vector_animal" note="Diagnoses of this group in the last completed year, whole country. Rates per population are computed by the portal (denominators from the Czech Statistical Office), not an official CZSO statistic." >}}
{{% /if-data %}}

---

### Methodology and limitations

- The data come from the open **ISIN** data (Infectious Diseases Information System, ÚZIS CZ), mandatory notification under Act No. 258/2000 Coll. They are updated once a year and end with December of the last completed year.
- Weekly counts come from the ÚZIS data summary “Meziroční srovnání počtu infekčních nemocí po týdnech v ČR” (year-on-year comparison of infectious diseases by week). The summary states no licence, only a citation (below).
- Records from EWS reports (automated reporting from healthcare providers and laboratories) appear in the data from July 2025 and their share keeps growing; counts from then on cannot be compared with earlier years.
- The number of reported cases is not the number of people ill: it captures only those who saw a physician and were reported.
- Rates per 100,000 population are computed by the portal from Czech Statistical Office data (population on 31 December); they are not an official CZSO statistic.
- Tularaemia has been in this group since November 2026; before that it was among the rare severe infections.

<p class="stat-source">
  Source: <a href="https://www.nzip.cz/data/2621-infekcni-nemoci-otevrena-data" target="_blank">ÚZIS CZ — ISIN Open Data</a> ·
  Licence: <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank">CC BY 4.0</a> ·
  denominators <a href="https://csu.gov.cz" target="_blank">Czech Statistical Office</a> (<a href="https://csu.gov.cz/podminky_pro_vyuzivani_a_dalsi_zverejnovani_statistickych_udaju_csu" target="_blank">CZSO terms</a>)
</p>
<p class="stat-source">
  Weekly data: Šanca O., Májek T., Davidová H., Rázková K., Klimeš D., Kubát J., Blaha M., Jarkovský J. Meziroční srovnání počtu infekčních nemocí po týdnech v ČR. Národní zdravotnický informační portál [online]. Praha: Ministerstvo zdravotnictví ČR a Ústav zdravotnických informací a statistiky ČR, 2026. Dostupné z: <a href="https://www.nzip.cz/data/2620-infekcni-nemoci-mezirocni-srovnani-datovy-souhrn" target="_blank">https://www.nzip.cz/data/2620-infekcni-nemoci-mezirocni-srovnani-datovy-souhrn</a>. ISSN 2695-0340. Modifications: totals for the year and the last four weeks, the share of records from EWS reports and age-group rates per 100,000 population computed by the portal.
</p>
