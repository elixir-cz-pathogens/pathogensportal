---
title: "COVID-19 — Věk a vakcinace"
description: "Analýza 12,6 milionů COVID-19 případů v ČR podle věku pacientů a vakcinačního statusu — hospitalizace, hospitalizační míra. Data MZČR."
image: "/images/dashboard-placeholder.svg"
tags: ["SARS-CoV-2", "hospitalizace", "vakcinace", "epidemiologie", "MZČR"]
data_source: '<a href="https://onemocneni-aktualne.mzcr.cz" target="_blank">MZČR — Otevřená data COVID-19</a>'
update_freq: "Souhrnná data (celé období pandemie)"
build:
  list: never
  render: always
---

<div class="d-flex flex-wrap gap-1 mb-4" role="navigation" aria-label="Sekce infekčních nemocí">
  <a href="/dashboards/infectious-diseases/" class="btn btn-sm btn-outline-secondary me-1 mb-1">Přehled</a>
  <a href="/dashboards/infectious-diseases-childhood/" class="btn btn-sm btn-outline-secondary me-1 mb-1">Časté dětské/vzdušné</a>
  <a href="/dashboards/infectious-diseases-gastro/" class="btn btn-sm btn-outline-secondary me-1 mb-1">Střevní/potravinové</a>
  <a href="/dashboards/infectious-diseases-skin/" class="btn btn-sm btn-outline-secondary me-1 mb-1">Kožní/kontaktní</a>
  <a href="/dashboards/infectious-diseases-vector/" class="btn btn-sm btn-outline-secondary me-1 mb-1">Klíšťaty/zvířaty přenášené</a>
  <a href="/dashboards/infectious-diseases-hepatitis/" class="btn btn-sm btn-outline-secondary me-1 mb-1">Hepatitidy</a>
  <a href="/dashboards/infectious-diseases-sti/" class="btn btn-sm btn-outline-secondary me-1 mb-1">Pohlavně přenosné</a>
  <a href="/dashboards/infectious-diseases-rare/" class="btn btn-sm btn-outline-secondary me-1 mb-1">Vzácné závažné</a>
  <a href="/dashboards/infectious-diseases-other/" class="btn btn-sm btn-outline-secondary me-1 mb-1">Ostatní</a>
  <a href="/dashboards/covid19-surveillance/" class="btn btn-sm btn-outline-secondary me-1 mb-1">COVID-19 — Surveillance</a>
  <a href="/dashboards/covid-demographics/" class="btn btn-sm btn-outline-secondary me-1 mb-1 active">COVID-19 — Věk a vakcinace</a>
</div>

### Případy a hospitalizace podle roku narození

Distribuce COVID-19 případů a hospitalizací podle roku narození pacienta (5letá kohorta).
Pandemie zasáhla nerovnoměrně: starší věkové skupiny tvoří disproporčně velký podíl hospitalizací.

{{< callout >}}
**U 1 630 992 případů (12,9 %) není ročník narození vyplněn** — v grafu proto nejsou. Nejde o věkovou skupinu, ale o chybějící údaj ve zdrojové evidenci; jakékoli srovnání mezi kohortami je tedy potřeba brát jako popis vyplněné části dat, ne celé populace nakažených. Dalších 10 případů má ročník před rokem 1900 (zjevné překlepy v zadání) a v grafu také nejsou.
{{< /callout >}}

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
