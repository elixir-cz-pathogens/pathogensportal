---
title: "Chřipka a respirační viry"
origin: aggregated
description: "Virologická surveillance chřipky a respiračních virů v České republice — sezónní přehledy 2012–2026, data SZÚ/NRL."
image: "/images/cards/flu.svg"
highlight: true
tags: ["chřipka", "RSV", "surveillance", "SZÚ", "ČR"]
data_source: '<a href="https://szu.gov.cz/publikace-szu/data/akutni-respiracni-infekce-chripka/" target="_blank">SZÚ — Národní referenční laboratoř pro chřipku</a>'
update_freq: "Týdně během sezóny (aktuální sezóna 2025/26)"
---

### Sezónní přehled chřipky

Počet laboratorně potvrzených případů chřipky A a B napříč sezónami 2012/13–2025/26.
Propad v sezónách 2020/21 a 2021/22 odpovídá efektu protiepidemických opatření
(roušky, omezení kontaktů). Běžící sezóna se doplňuje průběžně, její sloupec proto
během zimy roste.

{{< chart id="fluSeason" src="/data/charts/flu_season_overview.json" type="bar" title="Chřipka A vs. B — celkem za sezónu" height="360"  note="Absolutní počty laboratorně potvrzených záchytů za celou sezónu, celá ČR. Jde o vyšetřené vzorky, ne odhad celkové nemocnosti v populaci." >}}

---

### Týdenní průběh běžící sezóny

Laboratorní záchyty po kalendářních týdnech, z týdenních PDF hlášení NRL —
aktualizuje se každý týden včetně letního období.

{{< chart id="fluWeekly" src="/data/charts/flu_weekly.json" type="line" title="Týdenní detekce — sezóna 2025/26" height="340" note="Absolutní počty laboratorních záchytů za kalendářní týden, celá ČR. Influenza A zahrnuje i subtypy H1N1pdm a H3N2." >}}

---

### Respirační virologická krajina

Přehled všech sledovaných respiračních virů (chřipka, RSV, rhinoviry, koronaviry,
adenoviry…) napříč sezónami. Týdenní průběh aktuální sezóny po krajích najdeš na
stránce [Chřipka — regionální surveillance](/dashboards/influenza-regional/).

{{< chart id="fluResp" src="/data/charts/flu_respiratory_all.json" type="bar" title="Respirační viry — detekce za sezónu" height="420"  note="Absolutní počty laboratorních záchytů jednotlivých virů za sezónu, celá ČR." >}}

---

### Pozadí surveillance

Data pochází z **NRL pro chřipku a nechřipkové respirační viry** při SZÚ Praha.
Každý epidemiologický týden NRL publikuje zprávu s výsledky virologického vyšetření
vzorků od pacientů s ARI/ILI; historické sezóny jsou extrahované z archivních zpráv,
aktuální sezóna se stahuje automaticky.

Sledované viry:
- **chřipka A** (H1N1pdm, H3N2) a **chřipka B**
- **RSV** (respirační syncytiální virus)
- **HRV** (rhinoviry), **HAdV** (adenoviry), **HPIV** (parainfluenzaviry)
- **HMPV** (metapneumoviry), **CoV** (sezónní koronaviry), **hBoV** (bocaviry)
- *Mycoplasma pneumoniae* (atypická pneumonie)

### Další zdroje k chřipce

- [SZÚ — aktuální zprávy chřipka/ARI](https://szu.gov.cz/publikace-szu/data/akutni-respiracni-infekce-chripka/)
- [WHO FluNet — Evropa](https://www.who.int/europe/emergencies/surveillance/flunet)
- [ECDC — surveillance sezónní chřipky](https://www.ecdc.europa.eu/en/seasonal-influenza/surveillance-and-disease-data)
- [Fylogeneze chřipky (Nextstrain)](/dashboards/nextstrain-influenza/) — evoluce kmenů a výběr vakcinačních kmenů

<p class="stat-source">
  Zdroj: <a href="https://szu.gov.cz" target="_blank">SZÚ Praha</a> · NRL chřipka ·
  sezóny 2012/13–2025/26 · kategorie: laboratorní detekce (PCR/IF)
</p>
