---
title: "COVID-19 — Věk a vakcinace"
description: "Analýza 12,6 milionů COVID-19 případů v ČR podle věku pacientů a vakcinačního statusu — hospitalizace, hospitalizační míra. Data MZČR."
image: "/images/dashboard-placeholder.svg"
highlight: false
tags: ["SARS-CoV-2", "hospitalizace", "vakcinace", "epidemiologie", "MZČR"]
data_source: '<a href="https://onemocneni-aktualne.mzcr.cz" target="_blank">MZČR — Otevřená data COVID-19</a>'
update_freq: "Souhrnná data (celé období pandemie)"
---

### Případy a hospitalizace podle roku narození

Distribuce COVID-19 případů a hospitalizací podle roku narození pacienta (5letá kohorta).
Pandemie zasáhla nerovnoměrně: starší věkové skupiny tvoří disproporčně velký podíl hospitalizací.

{{< chart id="covidByAge" src="/data/charts/covid_by_age.json" type="bar" title="COVID-19 případy a hospitalizace — rok narození (celé období)" height="400" >}}

---

### Hospitalizační míra podle věku

Procento hospitalizovaných z celkového počtu potvrzených případů v dané věkové kohortě.
Hospitalizační míra prudce roste s věkem — u nejstarších kohort přesahuje 15 %.

{{< chart id="covidHospAge" src="/data/charts/covid_hosp_rate_by_age.json" type="bar" title="Hospitalizační míra (%) — rok narození" height="360" >}}

---

### Případy a hospitalizace podle vakcinačního statusu

Celkový počet potvrzených případů a hospitalizací v závislosti na počtu dávek vakcíny.
Data reflektují **celé pandemické období** — nevakcinovaní tvoří největší skupinu, ale i proto, že je to nejpočetnější kohorta.

{{< chart id="covidByVax" src="/data/charts/covid_by_vaccination.json" type="bar" title="COVID-19 případy a hospitalizace — vakcinační status" height="360" >}}

---

### Hospitalizační míra podle vakcinačního statusu

Hospitalizační míra (%) vztažená na počet potvrzených případů v dané vakcinační skupině.
Opakované posilující dávky jsou spojeny s nižší hospitalizační mírou.

{{< chart id="covidHospVax" src="/data/charts/covid_hosp_rate_by_vax.json" type="bar" title="Hospitalizační míra (%) — vakcinační status" height="300" >}}

---

### Metodická poznámka

- Zdrojová databáze: **`pacienti` tabulka** z MZČR otevřených dat COVID-19 (12,6 mil. záznamů)
- Vakcinační status odvozen z dátumů 1.–4. dávky v databázi; pacienti bez záznamu = nevakcinovaní nebo nelinkovatelní
- Hospitalizační míra = počet hospitalizovaných / počet potvrzených případů × 100
- Rok narození nahrazuje věk (přesný věk v databázi není) — kohorty agregovány po 5 letech
- Smrtnost nelze z těchto dat přesně vyčíslit (sloupec `Umrti` = hospitalizační diagnóza, ne celková smrtnost)

<p class="stat-source">
  Zdroj: <a href="https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19" target="_blank">MZČR otevřená data</a> ·
  12,6 mil. pacientských záznamů · celé pandemické období ·
  Agregace: SQL GROUP BY přes subprocess sqlite3 CLI
</p>
