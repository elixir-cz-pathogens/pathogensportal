---
title: "Infectious diseases — rare severe"
origin: aggregated
description: "Diphtheria, meningococcal infections, mpox, typhoid fever and other rare severe infections in the Czech Republic: annual counts and age (ÚZIS ISIN)."
image: "/images/cards/id-rare.webp"
update_from: "isin_group_rare_severe.json"
update_read: "year"
tags: ["infectious diseases", "ÚZIS", "ISIN", "rare diseases"]
data_source: '<a href="https://www.nzip.cz/data/2621-infekcni-nemoci-otevrena-data" target="_blank">ÚZIS CZ — ISIN open data (CC BY 4.0)</a>'
build:
  list: never
  render: always
---

{{< nav-pills group="infekcni-nemoci" active="vzacne" >}}

Diseases where every single case matters: diphtheria, meningococcal infections, mpox, typhoid and paratyphoid fever, Q fever, brucellosis and yellow fever. The counts are orders of magnitude lower than in the other groups; one reported case of diphtheria or yellow fever is significant in itself.

---

### Annual counts

Each diagnosis has its own chart with its own axis, because counts within the group differ by orders of magnitude. The bars are single years; hover over a bar or open the table for the exact value.

{{% if-data file="isin_groups.json" %}}
{{< isin part="group" group="rare_severe" note="Absolute annual counts of reported cases, whole country, open ISIN data. Not population-adjusted. The axes of the charts differ: bar heights can be compared only within one chart." >}}
{{% /if-data %}}
{{% if-data file="isin_groups.json" not="true" %}}
{{< chart id="isinRare" src="/data/charts/isin_group_rare_severe.json" type="bar" title="Rare severe diseases — annual case counts" height="420"  note="Absolute annual counts of notified cases, whole country. Not population-adjusted." >}}
{{% /if-data %}}

{{% if-data file="isin_groups.json" %}}
---

### Age

How many reported cases of this group fall on 100,000 people of the same age. The age groups differ in width (the first covers one year of age, the last everyone from 75), so the count alone is not shown.

{{< isin part="group-age" group="rare_severe" note="Diagnoses of this group in the last completed year, whole country. Rates per population are computed by the portal (denominators from the Czech Statistical Office), not an official CZSO statistic." >}}
{{% /if-data %}}

---

### Methodology and limitations

- The data come from the open **ISIN** data (Infectious Diseases Information System, ÚZIS CZ), mandatory notification under Act No. 258/2000 Coll. They are updated once a year and end with December of the last completed year.
- Records from EWS reports (automated reporting from healthcare providers and laboratories) appear in the data from July 2025 and their share keeps growing; counts from then on cannot be compared with earlier years.
- The number of reported cases is not the number of people ill: it captures only those who saw a physician and were reported.
- Rates per 100,000 population are computed by the portal from Czech Statistical Office data (population on 31 December); they are not an official CZSO statistic.
- Since November 2026 tularaemia has been in the group Tick- and animal-borne.

<p class="stat-source">
  Source: <a href="https://www.nzip.cz/data/2621-infekcni-nemoci-otevrena-data" target="_blank">ÚZIS CZ — ISIN Open Data</a> ·
  Licence: <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank">CC BY 4.0</a> ·
  denominators <a href="https://csu.gov.cz" target="_blank">Czech Statistical Office</a> (<a href="https://csu.gov.cz/podminky_pro_vyuzivani_a_dalsi_zverejnovani_statistickych_udaju_csu" target="_blank">CZSO terms</a>)
</p>
