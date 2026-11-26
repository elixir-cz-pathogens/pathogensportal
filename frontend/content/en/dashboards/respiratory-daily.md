---
title: "Respiratory infections — daily overview and hospitals"
origin: aggregated
description: "Influenza, COVID-19, RSV and acute respiratory infections in Czechia day by day: cases reported by physicians, hospitalisations, intensive-care admissions and vaccination from the daily ÚZIS report."
image: "/images/cards/flu-regional.svg"
tags: ["influenza", "COVID-19", "RSV", "hospitalisations", "vaccination", "ÚZIS", "Czechia"]
data_source: '<a href="https://www.nzip.cz/data/2860-respiracni-infekce-denni-reporting-esurveillance-datovy-souhrn" target="_blank">ÚZIS CZ — Respiratory infections, daily e-surveillance reporting</a>'
# The date comes from posledni_datum in this JSON (state as of the previous day), not from here.
update_from: "esurv_summary.json"
update_read: "stamp"
---

This dashboard follows respiratory infections in Czechia day by day: how many cases of influenza,
COVID-19 and RSV physicians report, how many people are in hospital with them and how many
vaccine doses have been given. It is built on the daily e-surveillance report that ÚZIS CZ
publishes every morning with the state as of the previous day.

{{< callout tone="info" >}}
**These figures are not the same as the rates on the influenza dashboards.** Those are weekly
estimates from the practices of selected general practitioners, compared against an epidemic
threshold. Here are the automated reports of all connected physicians and hospitals: one to two
weeks fresher, but not comparable with the threshold or with past seasons.
{{< /callout >}}

{{% if-data file="esurv_summary.json" not="true" %}}
The data for this dashboard have not arrived yet. They will appear after the first run of the
data pipeline that downloads the daily ÚZIS report.
{{% /if-data %}}

{{% if-data file="esurv_summary.json" %}}
---

{{< stat-card src="/data/charts/esurv_summary.json" >}}

{{< period-switch >}}

### Reported cases

The chart shows the sum over the last seven days, not single days. Reporting has a strong weekly
rhythm, with only a fraction arriving at weekends, so daily figures would mostly show surgery
hours. A public holiday noticeably lowers the sum of the seven days it falls in; the comment
therefore compares whole calendar weeks and does not compare a week with a holiday. The most
recent days are still being completed at the source.

{{< comment src="/data/charts/esurv_summary.json" block="cases" >}}

{{< chart id="esurvCases" src="/data/charts/esurv_cases.json" series="0,1,2" type="line" period="page" title="Influenza, COVID-19 and RSV — reported cases in 7 days" height="340" note="Absolute counts: cases reported by physicians, sum over the 7 days ending on the given day, all of Czechia. Not per capita." >}}

All acute respiratory infections and influenza-like illness together. There are far more of them
than confirmed influenza, so they have a chart of their own.

{{< chart id="esurvCasesAri" src="/data/charts/esurv_cases.json" series="3" type="line" period="page" title="ARI/ILI in total — reported cases in 7 days" height="300" note="Absolute counts: all reports of acute respiratory infections and influenza-like illness, 7-day sum, all of Czechia." >}}

Who is ill most often: reported cases in the last seven days relative to the size of the age
group.

{{< chart id="esurvCasesAge" src="/data/charts/esurv_cases_age.json" series="0,1,2" type="bar" title="Reported cases in 7 days by age — per 100,000 population" height="340" note="The rate per 100,000 population of the age group is computed by the portal (denominators from the Czech Statistical Office), not an official statistic of the Office." >}}

---

### Regions

New cases in seven days per 100,000 inhabitants of the region, by the patient's place of
residence. The values are computed by ÚZIS; the switch in the map header selects influenza or
COVID-19.

{{< region-map id="esurvMap" title="Reported cases in 7 days per 100,000 population" src="/data/charts/esurv_map_chripka.json" label="influenza" unit="cases per 100,000" note="Influenza: new cases reported by physicians in the last 7 days per 100,000 inhabitants of the region, values from ÚZIS." alt_src="/data/charts/esurv_map_covid19.json" alt_label="COVID-19" alt_unit="cases per 100,000" alt_note="COVID-19: new cases reported by physicians in the last 7 days per 100,000 inhabitants of the region, values from ÚZIS." >}}

---

### Hospitals

Every hospital stay during which the infection was recorded is counted. That does not mean the
infection was the reason for admission. The number of connected hospitals has changed over time,
so a rising series need not be rising illness alone.

{{< comment src="/data/charts/esurv_summary.json" block="hospital" >}}

How many patients were in hospital on the same day. It is a headcount, not the number of new
admissions.

{{< chart id="esurvHosp" src="/data/charts/esurv_hosp_current.json" series="0,1,2" type="line" period="page" title="In hospital with influenza, COVID-19 and RSV — daily count" height="340" note="Absolute counts of patients in hospital at the same time, all of Czechia." >}}

{{< chart id="esurvHospAri" src="/data/charts/esurv_hosp_current.json" series="3" type="line" period="page" title="In hospital with ARI/ILI in total — daily count" height="280" note="Absolute counts of patients in hospital at the same time with a recorded acute respiratory infection, all of Czechia." >}}

New admissions over seven days show how fast patients are being added.

{{< chart id="esurvHospNew" src="/data/charts/esurv_hosp_new.json" series="0,1,2" type="line" period="page" title="New hospital admissions — 7-day sum" height="300" note="Absolute counts of new admissions, sum over the 7 days ending on the given day, all of Czechia." >}}

Admissions to an intensive care or anaesthesiology and resuscitation unit, and deaths during a
hospital stay, are small numbers that fluctuate from week to week. A longer period tells more.

{{< chart id="esurvIcu" src="/data/charts/esurv_hosp_icu.json" series="0,1,2" type="bar" period="page" title="New intensive-care admissions — 7-day sum" height="280" note="Absolute counts, sum over the 7 days ending on the given day, all of Czechia." >}}

{{< chart id="esurvDeaths" src="/data/charts/esurv_hosp_deaths.json" series="0,1,2" type="bar" period="page" title="Deaths during a hospital stay — 7-day sum" height="280" note="Absolute counts of deaths during a hospital stay in which the infection was recorded; the infection need not have been the cause of death. 7-day sum, all of Czechia." >}}

New admissions in the last four weeks relative to the size of the age group. The youngest
children and older people are admitted most often.

{{< chart id="esurvHospAge" src="/data/charts/esurv_hosp_age.json" series="0,1,2" type="bar" title="New hospital admissions in 28 days by age — per 100,000 population" height="340" note="The rate per 100,000 population of the age group is computed by the portal (denominators from the Czech Statistical Office), not an official statistic of the Office." >}}

---

### Vaccination

Doses given since the start of the season according to the Central Vaccination Register. The
season starts on 1 September for influenza and COVID-19 and on 1 October for RSV.

{{< comment src="/data/charts/esurv_summary.json" block="vaccination" >}}

{{< chart id="esurvVaxFlu" src="/data/charts/esurv_vaccination.json" series="0" type="line" title="Vaccination against influenza — doses given since the start of the season" height="280" note="Cumulative number of doses given, all of Czechia." >}}

{{< chart id="esurvVaxOther" src="/data/charts/esurv_vaccination.json" series="1,2" type="line" title="Vaccination against COVID-19 and RSV — doses given since the start of the season" height="280" note="Cumulative number of doses given, all of Czechia. For RSV this covers vaccines and the monoclonal antibody for infants." >}}

How many doses there are per hundred inhabitants of an age group. It is not the share of
vaccinated people: one person can receive more than one dose.

{{< chart id="esurvVaxAge" src="/data/charts/esurv_vaccination_age.json" type="bar" title="Doses given per 100 population by age" height="320" note="Doses since the start of the season per 100 inhabitants of the age group; computed by the portal (denominators from the Czech Statistical Office). RSV immunisation uses different age groups and is not in the chart." >}}

---

### Laboratories

Infections confirmed by the laboratories connected to the early warning system, by the day the
specimen was taken. The laboratories report positive results only, so the share of positive
tests cannot be computed from them.

{{< chart id="esurvLab" src="/data/charts/esurv_lab.json" series="0,1,2" type="line" title="Laboratory-confirmed infections — 7-day sum" height="300" note="Absolute counts of positive results, sum over the 7 days ending on the given day, all of Czechia." >}}

---

### Methods and limits

| Indicator | Where it comes from | What to watch for |
|---|---|---|
| Reported cases | automated reports of physicians to ISIN (the early warning system, EWS) | strong weekly rhythm, public holidays; the last days are still being completed |
| Hospitalisations, intensive care, deaths | reports of the connected hospitals to ISIN | in hospital with the infection, not necessarily because of it; the number of connected hospitals has changed |
| Vaccination | Central Vaccination Register | doses, not people |
| Laboratory-confirmed infections | laboratories connected to EWS | positive results only; only part of the laboratories is connected |
| Regions | rates per 100,000 computed by ÚZIS | by the patient's place of residence |

The daily series start on 26 May 2025, hospitalisations with influenza on 18 October 2025, so
there are no earlier seasons to compare with yet. The source states no licence; the portal uses
the data with the citation below and does not include them in its open data catalogue.

<p class="stat-source">Šanca O., Blaha M., Zelinková H., Jarkovský J., Klimeš D., Kundrát M., Krejčí J., Klika P., Mužík J., Komenda M., Dušek L. Respirační infekce – denní reporting e-surveillance. Národní zdravotnický informační portál [online]. Praha: Ministerstvo zdravotnictví ČR a Ústav zdravotnických informací a statistiky ČR, 2026. Dostupné z: <a href="https://www.nzip.cz/data/2860-respiracni-infekce-denni-reporting-esurveillance-datovy-souhrn" target="_blank">https://www.nzip.cz/data/2860-respiracni-infekce-denni-reporting-esurveillance-datovy-souhrn</a>. ISSN 2695-0340.</p>
<p class="stat-source">Modifications by the portal: 7-day sums from the daily figures and rates by age per population (denominators from the Czech Statistical Office). The ÚZIS reports are produced within the SCOPE IS project, co-funded by the EU4Health programme.</p>
{{% /if-data %}}
