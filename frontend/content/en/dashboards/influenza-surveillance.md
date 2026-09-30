---
title: "Influenza and respiratory viruses"
origin: aggregated
description: "Virological surveillance of influenza and respiratory viruses in the Czech Republic — seasonal overviews 2012–2026, NIPH/NRL data."
image: "/images/cards/flu.webp"
highlight: true
tags: ["influenza", "RSV", "surveillance", "NIPH", "Czech Republic"]
data_source: '<a href="https://szu.gov.cz/publikace-szu/data/akutni-respiracni-infekce-chripka/" target="_blank">NIPH — National Reference Laboratory for Influenza</a> · positivity: <a href="https://www.who.int/tools/flunet" target="_blank">WHO FluNet</a>, <a href="https://erviss.org/" target="_blank">ECDC ERVISS</a>'
update_from: "flu_weekly.json"
update_read: "week"
---

### Seasonal influenza overview

Laboratory-confirmed influenza A and B cases across the seasons 2012/13–2025/26.
The drop in the 2020/21 and 2021/22 seasons reflects the effect of COVID-19
countermeasures (masks, contact restrictions). The running season is updated
continuously, so its column keeps growing during the winter.

{{< chart id="fluSeason" src="/data/charts/flu_season_overview.json" type="bar" title="Influenza A vs. B — totals per season" height="360"  note="Absolute counts of laboratory-confirmed detections per season, whole country. These are tested samples, not an estimate of total illness in the population." >}}

---

### Weekly course of the running season

Laboratory detections by calendar week, from the NRL's weekly PDF reports —
updated every week, including over the summer.

{{< chart id="fluWeekly" src="/data/charts/flu_weekly.json" type="line" title="Weekly detections — season 2025/26" height="340" note="Absolute counts of laboratory detections per calendar week, whole country. Influenza A includes the H1N1pdm and H3N2 subtypes." >}}

---

### Positivity of laboratory specimens

Detection counts grow with the amount of testing — and testing keeps growing: about
16,000 specimens in the 2021/22 season, over 65,000 in 2024/25. Counts therefore cannot
tell whether this season was stronger than the last one. **Positivity** — the share of
positive specimens among those tested — cancels the testing volume out, so seasons can be
compared.

{{< chart id="fluPositivitySeasons" src="/data/charts/flu_positivity_seasons.json" type="line" title="Influenza positivity by week of the season" height="360" note="Share of specimens positive for influenza among those tested in the laboratory (non-sentinel system), in percent; each line is one season, the X axis runs from week 40 to week 20. Seasons from 2021/22 — before that, a few hundred hand-picked specimens were tested and the percentages are not comparable. Weeks with fewer than 30 specimens are not shown." >}}

The weekly series shows the three main respiratory viruses side by side, each with its
own number of specimens tested. Hover over a point to see how many specimens the
percentage comes from.

{{< chart id="fluPositivityWeekly" src="/data/charts/flu_positivity_weekly.json" type="line" title="Weekly positivity — influenza, RSV, SARS-CoV-2" height="340" note="Share of positive specimens among those tested, in percent, whole country, ECDC ERVISS data. The series starts in week 1/2025, since when ERVISS continuously reports the number of specimens tested for RSV. SARS-CoV-2 ends in week 33/2026: from the following week a different number of tested specimens is reported and the figures do not continue the series. The last 2–3 weeks are missing until the laboratories report their results." >}}

---

### The respiratory virological landscape

All monitored respiratory viruses (influenza, RSV, rhinoviruses, coronaviruses,
adenoviruses…) across the seasons. The weekly course of the current season by region
is on the [Influenza — regional surveillance](/en/dashboards/influenza-regional/) page.

{{< chart id="fluResp" src="/data/charts/flu_respiratory_all.json" type="bar" title="Respiratory viruses — detections per season" height="420"  note="Absolute counts of laboratory detections of each virus per season, whole country." >}}

*Note: series labels in the charts come from the Czech source data.*

---

### Surveillance background

The data come from the **NRL for influenza and non-influenza respiratory viruses**
at the National Institute of Public Health (SZÚ) in Prague. Every epidemiological
week the NRL publishes a report with virological test results from ARI/ILI patients;
historical seasons are extracted from archived reports, the current season is
downloaded automatically.

Monitored viruses:
- **influenza A** (H1N1pdm, H3N2) and **influenza B**
- **RSV** (respiratory syncytial virus)
- **HRV** (rhinoviruses), **HAdV** (adenoviruses), **HPIV** (parainfluenza viruses)
- **HMPV** (metapneumoviruses), **CoV** (seasonal coronaviruses), **hBoV** (bocaviruses)
- *Mycoplasma pneumoniae* (atypical pneumonia)

### Further influenza resources

- [SZÚ — current influenza/ARI reports](https://szu.gov.cz/publikace-szu/data/akutni-respiracni-infekce-chripka/)
- [WHO FluNet — Europe](https://www.who.int/europe/emergencies/surveillance/flunet)
- [ECDC — seasonal influenza surveillance](https://www.ecdc.europa.eu/en/seasonal-influenza/surveillance-and-disease-data)
- [Influenza phylogeny (Nextstrain)](/en/dashboards/nextstrain-influenza/) — strain evolution and vaccine strain selection

<p class="stat-source">
  Source: <a href="https://szu.gov.cz" target="_blank">SZÚ Prague</a> · NRL influenza ·
  seasons 2012/13–2025/26 · category: laboratory detections (PCR/IF)
</p>
