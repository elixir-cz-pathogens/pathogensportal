---
title: "Influenza & Respirační Viry"
description: "Virologická surveillance chřipky a respiračních virů v České republice — sezónní přehled 2012–2022, data SZÚ/NRL."
image: "/images/dashboard-placeholder.svg"
highlight: true
tags: ["chřipka", "RSV", "surveillance", "SZÚ", "ČR"]
data_source: '<a href="https://szu.gov.cz" target="_blank">SZÚ — Národní referenční laboratoř pro chřipku</a>'
update_freq: "Historická data (2012/13–2021/22)"
---

### Sezónní přehled chřipky

Počet laboratorně potvrzených případů Influenza A a B napříč sezónami.
Viditelný pokles v sezóně 2020/21 odpovídá efektu COVID-19 opatření (roušky, lockdowny).

{{< chart id="fluSeason" src="/data/charts/flu_season_overview.json" type="bar" title="Influenza A vs B — celkem per sezóna" height="360" >}}

---

### Týdenní trend — sezóna 2021/22

Distribuce detekcí chřipky podle kalendářních týdnů v poslední dostupné sezóně.

{{< chart id="fluWeekly" src="/data/charts/flu_weekly.json" type="line" title="Influenza A a B — týdenní detekce (2021/22)" height="320" >}}

---

### Respirační virologická krajina

Stacked přehled všech sledovaných respiračních virů (chřipka, RSV, rhinoviry, koronaviry, adenoviry…) napříč sezónami.

{{< chart id="fluResp" src="/data/charts/flu_respiratory_all.json" type="bar" title="Respirační viry — detekce per sezóna" height="420" >}}

---

### Pozadí surveillance

Data pochází z **NRL pro chřipku a nechřipkové respirační viry** při SZÚ Praha.
Každý epidemiologický týden NRL publikuje zprávu s výsledky virologického vyšetření vzorků od pacientů s ARI/ILI.

Sledované viry:
- **Influenza A** (H1N1pdm, H3N2) a **Influenza B**
- **RSV** (Respirační syncyciální virus)
- **HRV** (Rhinoviry), **HAdV** (Adenoviry), **HPIV** (Parainfluenzaviry)
- **HMPV** (Metapneumoviry), **CoV** (sezónní koronaviry), **hBoV** (Bocaviry)
- *Mycoplasma pneumoniae* (atypická pneumonie)

<p class="stat-source">
  Zdroj: <a href="https://szu.gov.cz" target="_blank">SZÚ Praha</a> · NRL chřipka ·
  Data extrahována z PDF archivů 2012–2022 ·
  Kategorie: laboratorní detekce (PCR/IF)
</p>
