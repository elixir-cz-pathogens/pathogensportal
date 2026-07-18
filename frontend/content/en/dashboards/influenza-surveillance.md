---
title: "Influenza & Respiratory Viruses"
description: "Virological surveillance of influenza and respiratory viruses in the Czech Republic — seasonal overview 2012–2022, NIPH/NRL data."
image: "/images/dashboard-placeholder.svg"
highlight: true
tags: ["influenza", "RSV", "surveillance", "NIPH", "Czech Republic"]
data_source: '<a href="https://szu.gov.cz" target="_blank">NIPH — National Reference Laboratory for Influenza</a>'
update_freq: "Historical data (2012/13–2021/22)"
---

### Seasonal influenza overview

The number of laboratory-confirmed Influenza A and B cases across seasons.
The visible drop in the 2020/21 season reflects the effect of COVID-19 measures (masks, lockdowns).

{{< chart id="fluSeason" src="/data/charts/flu_season_overview.json" type="bar" title="Influenza A vs B — total per season" height="360" >}}

---

### Weekly trend — 2021/22 season

The distribution of influenza detections by calendar week in the most recent season available.

{{< chart id="fluWeekly" src="/data/charts/flu_weekly.json" type="line" title="Influenza A and B — weekly detections (2021/22)" height="320" >}}

---

### The respiratory virology landscape

A stacked overview of all monitored respiratory viruses (influenza, RSV, rhinoviruses, coronaviruses, adenoviruses…) across seasons.

{{< chart id="fluResp" src="/data/charts/flu_respiratory_all.json" type="bar" title="Respiratory viruses — detections per season" height="420" >}}

---

### Surveillance background

The data comes from the **National Reference Laboratory for Influenza and Non-influenza Respiratory Viruses** at NIPH Prague.
Every epidemiological week the NRL publishes a report with the virological test results for samples from patients with ARI/ILI.

Monitored viruses:
- **Influenza A** (H1N1pdm, H3N2) and **Influenza B**
- **RSV** (respiratory syncytial virus)
- **HRV** (rhinoviruses), **HAdV** (adenoviruses), **HPIV** (parainfluenza viruses)
- **HMPV** (metapneumoviruses), **CoV** (seasonal coronaviruses), **hBoV** (bocaviruses)
- *Mycoplasma pneumoniae* (atypical pneumonia)

<p class="stat-source">
  Source: <a href="https://szu.gov.cz" target="_blank">NIPH Prague</a> · NRL for Influenza ·
  Data extracted from PDF archives 2012–2022 ·
  Category: laboratory detection (PCR/IF)
</p>
