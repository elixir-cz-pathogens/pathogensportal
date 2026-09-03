---
title: "COVID-19 — Věk a vakcinace"
description: "4,9 milionu potvrzených případů COVID-19 v ČR podle věku a stavu očkování — úmrtí, smrtnost, hospitalizace. Otevřená data MZČR, aktualizováno průběžně."
image: "/images/cards/covid-demographics.svg"
tags: ["SARS-CoV-2", "úmrtí", "vakcinace", "epidemiologie", "MZČR"]
data_source: '<a href="https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19" target="_blank">MZČR — Otevřená data COVID-19</a>'
update_freq: "S každým během datové pipeline (zdroje aktualizovány denně)"
build:
  list: never
  render: always
---

{{< nav-pills group="infekcni-nemoci" active="covid-demografie" >}}

### Případy a úmrtí podle věkové skupiny

Rozložení potvrzených případů a úmrtí podle věku pacienta za celé pandemické období
(od března 2020). Případy se soustředí do produktivního věku, úmrtí drtivě do
nejvyšších věkových skupin.

{{< callout >}}
**U 22 780 případů (0,5 %) není věk ve zdrojových datech vyplněn** — v grafu proto
nejsou, ale do celkových součtů patří.
{{< /callout >}}

{{< chart id="covidByAge" src="/data/charts/covid_by_age.json" type="bar" title="COVID-19 případy a úmrtí podle věkové skupiny (celé období)" height="400" note="Absolutní počty za celé pandemické období, celá ČR. Nepřepočteno na velikost věkové skupiny v populaci." >}}

---

### Smrtnost podle věku

Podíl zemřelých mezi potvrzenými případy (case fatality ratio) v dané věkové skupině.
Smrtnost roste s věkem o řády: do 40 let jsou to setiny procenta, u osob nad 80 let
přes 11 %.

{{< chart id="covidCfrAge" src="/data/charts/covid_cfr_by_age.json" type="bar" title="Smrtnost (CFR %) podle věkové skupiny" height="360" note="Podíl v procentech: úmrtí / potvrzené případy v dané věkové skupině. CFR závisí i na míře testování — v obdobích slabého testování je nadhodnocená." >}}

---

### Případy a hospitalizace podle stavu očkování

Denní hlášení MZČR podle stavu očkování, sečtená za období **od ledna 2021**
(před startem očkování kategorie neexistovaly).

{{< chart id="covidByVax" src="/data/charts/covid_by_vaccination.json" type="bar" title="COVID-19 případy a hospitalizace — stav očkování (od 1/2021)" height="360" note="Absolutní počty od ledna 2021. Skupiny se zásadně liší velikostí i věkovým složením — přímé srovnání sloupců není účinnost vakcíny." >}}

---

### Hospitalizační míra podle stavu očkování

Podíl hospitalizovaných mezi pozitivně testovanými v dané skupině. **Pozor na
interpretaci:** skupina s posilující dávkou je výrazně starší než průměr (očkování
se prioritizovalo podle věku), takže její vyšší hospitalizační míra odráží hlavně
věkové složení, ne selhání vakcíny. Očištění o věk tato agregovaná data neumožňují.

{{< chart id="covidHospVax" src="/data/charts/covid_hosp_rate_by_vax.json" type="bar" title="Hospitalizační míra (%) — stav očkování" height="300" note="Podíl v procentech: hospitalizovaní / pozitivní v dané skupině, od ledna 2021. Neočištěno o věk — skupiny mají různé věkové složení." >}}

---

### Metodická poznámka

- Zdroje: otevřené datasety MZČR
  [`osoby`](https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19) (4,9 mil. případů
  s věkem a krajem), [`umrti`](https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19)
  (44 tis. úmrtí s věkem) a `ockovani-pozitivni` / `ockovani-hospitalizace`
  (denní počty podle stavu očkování).
- Všechny grafy se generují automaticky datovou pipeline a aktualizují se s ní —
  žádný ruční mezikrok.
- Smrtnost (CFR) = úmrtí / potvrzené případy; skutečná smrtnost infekce (IFR) je
  nižší, protože ne každá nákaza byla zachycena testem.
- Hospitalizace podle věku otevřená data neobsahují; podle stavu očkování ano.

<p class="stat-source">
  Zdroj: <a href="https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19" target="_blank">MZČR otevřená data</a> ·
  licence dle podmínek MZČR · období 3/2020–současnost (očkování od 1/2021)
</p>
