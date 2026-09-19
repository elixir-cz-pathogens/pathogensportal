---
title: "Infectious Diseases — Sexually transmitted"
origin: aggregated
description: "Syphilis and gonorrhoea since 1994 (Register of Sexually Transmitted Diseases), chlamydial infections and trichomoniasis 2018–2025 (ISIN) — trends, sex, age and regions."
image: "/images/cards/id-sti.webp"
update_from: "isin_group_sti.json"
update_read: "year"
tags: ["infectious diseases", "ÚZIS", "ISIN", "STI"]
data_source: '<a href="https://datanzis.uzis.gov.cz" target="_blank">ÚZIS CZ — ISIN Open Data (CC BY 4.0)</a>'
build:
  list: never
  render: always
---

{{< nav-pills group="infekcni-nemoci" active="sti" >}}

Sexually transmitted infections are notified in Czechia through **two routes**. Syphilis,
gonorrhoea and lymphogranuloma venereum have their own Register of Sexually Transmitted
Diseases, with a series going back to 1994; chlamydial infections, trichomoniasis and others
go through ISIN and are available from 2018. The page shows both — they cannot be added
together, as each source has its own notification rules.

### Syphilis and gonorrhoea — Register of Sexually Transmitted Diseases

{{< chart id="stiTrend" src="/data/charts/sti_registry_trend.json" type="line" title="Syphilis, gonorrhoea and lymphogranuloma venereum — notified cases 1994–2025" height="380" note="Absolute annual counts of notified cases, whole country. Syphilis is the sum of all stages (congenital, early, late, other and unspecified; ICD-10 A50–A53), gonorrhoea A54, lymphogranuloma venereum A55." >}}

{{< chart id="stiIncidence" src="/data/charts/sti_registry_incidence.json" type="line" title="Syphilis and gonorrhoea — notified cases per 100,000 population" height="340" note="Adjusted to the Czech population (Czech Statistical Office, as of 31 December). The series starts in 2000, from which denominators are available. Gonorrhoea has roughly tripled since 2010; a rise in notified cases need not mean only more infections — more frequent testing also finds more cases." >}}

{{< chart id="stiSex" src="/data/charts/sti_registry_sex.json" type="line" title="Syphilis and gonorrhoea combined — men and women per 100,000" height="340" note="Each sex adjusted with its own denominator (per 100,000 men or women). The gap between the sexes has widened since 2010; in women gonorrhoea is more often asymptomatic and therefore less often detected." >}}

{{< chart id="stiAge" src="/data/charts/sti_registry_age.json" type="bar" title="Syphilis and gonorrhoea by age — total for the last five years" height="340" note="Absolute counts of notified cases over a five-year period, whole country. Age groups differ in width (the youngest and oldest are open-ended), so the bars cannot be read as risk per person. Age-group labels come from the source data and remain in Czech." >}}

{{< region-map id="stiMap" src="/data/charts/sti_registry_map.json" unit="cases per 100,000" title="Syphilis and gonorrhoea by region of residence — per 100,000 population" note="Notified cases in the latest year per 100,000 population of the region. The region is derived from the patient's district of residence; cases without residence in Czechia are not on the map. Prague stands out partly because specialised care and testing are concentrated there." >}}

### Chlamydia, trichomoniasis and others — ISIN

{{< chart id="isinSti" src="/data/charts/isin_group_sti.json" type="bar" title="Sexually transmitted infections notified through ISIN — annual case counts (2018–2025)" height="420"  note="Absolute annual counts of notified cases, whole country. Not population-adjusted." >}}

### Points to keep in mind

- **Notified cases are not true occurrence.** Sexually transmitted infections are often asymptomatic; the numbers also rise when more testing is done.
- **HIV is not included** — it has its own register, which is not yet available as open data.
- **Annual data.** The register is published once a year and the latest year may still be completed.

<p class="stat-source">
  Source: <a href="https://www.nzip.cz/data/2639-pohlavni-nemoci-otevrena-data" target="_blank">ÚZIS CZ — Register of Sexually Transmitted Diseases (open data)</a> ·
  <a href="https://datanzis.uzis.gov.cz" target="_blank">ÚZIS CZ — ISIN Open Data</a> ·
  denominators <a href="https://csu.gov.cz" target="_blank">Czech Statistical Office</a> ·
  Licence: free access / <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank">CC BY 4.0</a>
</p>
