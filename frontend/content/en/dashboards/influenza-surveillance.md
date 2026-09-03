---
title: "Influenza and respiratory viruses"
description: "Virological surveillance of influenza and respiratory viruses in the Czech Republic — seasonal overviews 2012–2026, NIPH/NRL data."
image: "/images/cards/flu.svg"
highlight: true
tags: ["influenza", "RSV", "surveillance", "NIPH", "Czech Republic"]
data_source: '<a href="https://szu.gov.cz/publikace-szu/data/akutni-respiracni-infekce-chripka/" target="_blank">NIPH — National Reference Laboratory for Influenza</a>'
update_freq: "Weekly during the season (current season 2025/26)"
---

### Seasonal influenza overview

Laboratory-confirmed influenza A and B cases across the seasons 2012/13–2025/26.
The drop in the 2020/21 and 2021/22 seasons reflects the effect of COVID-19
countermeasures (masks, contact restrictions). The running season is updated
continuously, so its column keeps growing during the winter.

{{< chart id="fluSeason" src="/data/charts/flu_season_overview.json" type="bar" title="Influenza A vs. B — totals per season" height="360"  note="Absolute counts of laboratory-confirmed detections per season, whole country. These are tested samples, not an estimate of total illness in the population." >}}

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
