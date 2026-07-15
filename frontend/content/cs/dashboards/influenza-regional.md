---
title: "Influenza — Regionální surveillance"
description: "Regionální distribuce laboratorních nálezů chřipky a respiračních virů v ČR 2022–2025 — data SZÚ/NRL podle krajů."
image: "/images/dashboard-placeholder.svg"
highlight: false
tags: ["chřipka", "surveillance", "kraje", "SZÚ", "ČR"]
data_source: '<a href="https://szu.gov.cz" target="_blank">SZÚ — Národní referenční laboratoř pro chřipku</a>'
update_freq: "Sezónní aktualizace (2022–2025)"
---

### Pozitivní záchyty podle krajů — meziroční srovnání

Počet pozitivních laboratorních vyšetření respiračních virů v jednotlivých krajích ČR v letech 2022–2025.
Výrazný nárůst v roce 2025 v Praze a Jihomoravském kraji odpovídá silné sezóně 2024/25.

{{< chart id="fluRegionalOverview" src="/data/charts/flu_regional_overview.json" type="bar" title="Pozitivní záchyty respiračních virů — kraje ČR (2022–2025)" height="420" >}}

---

### Týdenní trend sezóny 2024/25 — top kraje

Průběh detekce respiračních virů podle epidemiologických týdnů v sezóně 2024/25 (KT40/2024–KT36/2025).
Zobrazeno 6 krajů s nejvyšším celkovým záchytem. Vrchol sezóny byl zaznamenán v KT5–8/2025.

{{< chart id="fluRegionalWeekly" src="/data/charts/flu_regional_weekly.json" type="line" title="Pozitivní záchyty per KT — sezóna 2024/25" height="380" >}}

---

### Poznámky k datům

- Data pochází z **NRL pro chřipku a nechřipkové respirační viry** při SZÚ Praha
- Zahrnují všechny laboratorně potvrzené respirační viry (Influenza A/B, RSV, Rhinoviry, SARS-CoV-2 atd.)
- Kategorie: **Detekce viru** (PCR/imunofluorescence)
- Rok 2022–2024: kumulativní součty z posledního týdenního PDF sezóny
- Sezóna 2024/25: týdenní data ze zpráv NRL (KT40/2024–KT36/2025)
- Regiony s menším záchytem (např. Karlovarský kraj) mohou odrážet i nižší kapacitu NRL reporting

<p class="stat-source">
  Zdroj: <a href="https://szu.gov.cz" target="_blank">SZÚ Praha</a> · NRL chřipka ·
  Data extrahována z PDF zpráv 2022–2025 ·
  Kategorie: laboratorní detekce
</p>
