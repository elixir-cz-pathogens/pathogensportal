---
title: "Infekční nemoci — přehled"
description: "Přehled hlášených infekčních nemocí v ČR 2018–2025 dle ÚZIS — regionální mapa, top diagnózy, věková struktura a tematické skupiny nemocí."
image: "/images/dashboard-placeholder.svg"
highlight: true
tags: ["infekční nemoci", "surveillance", "ÚZIS", "kraje", "ČR"]
data_source: '<a href="https://datanzis.uzis.gov.cz" target="_blank">ÚZIS ČR — Otevřená data ISIN (CC BY 4.0)</a>'
update_freq: "Průběžná aktualizace (data 2018–2025)"
---

<div class="d-flex flex-wrap gap-1 mb-4" role="navigation" aria-label="Sekce infekčních nemocí">
  <a href="/dashboards/infectious-diseases/" class="btn btn-sm btn-outline-secondary me-1 mb-1 active">Přehled</a>
  <a href="/dashboards/infectious-diseases-childhood/" class="btn btn-sm btn-outline-secondary me-1 mb-1">Časté dětské/vzdušné</a>
  <a href="/dashboards/infectious-diseases-gastro/" class="btn btn-sm btn-outline-secondary me-1 mb-1">Střevní/potravinové</a>
  <a href="/dashboards/infectious-diseases-skin/" class="btn btn-sm btn-outline-secondary me-1 mb-1">Kožní/kontaktní</a>
  <a href="/dashboards/infectious-diseases-vector/" class="btn btn-sm btn-outline-secondary me-1 mb-1">Klíšťaty/zvířaty přenášené</a>
  <a href="/dashboards/infectious-diseases-hepatitis/" class="btn btn-sm btn-outline-secondary me-1 mb-1">Hepatitidy</a>
  <a href="/dashboards/infectious-diseases-sti/" class="btn btn-sm btn-outline-secondary me-1 mb-1">Pohlavně přenosné</a>
  <a href="/dashboards/infectious-diseases-rare/" class="btn btn-sm btn-outline-secondary me-1 mb-1">Vzácné závažné</a>
  <a href="/dashboards/infectious-diseases-other/" class="btn btn-sm btn-outline-secondary me-1 mb-1">Ostatní</a>
  <a href="/dashboards/covid19-surveillance/" class="btn btn-sm btn-outline-secondary me-1 mb-1">COVID-19 — Surveillance</a>
  <a href="/dashboards/covid-demographics/" class="btn btn-sm btn-outline-secondary me-1 mb-1">COVID-19 — Věk a vakcinace</a>
</div>

Tento dashboard zobrazuje hlášené infekční nemoci v České republice na základě dat z **Informačního Systému Infekčních Nemocí (ISIN)** spravovaného ÚZIS ČR a MZČR. Data pokrývají 272 000+ záznamů od roku 2018 ve všech 14 krajích. Podrobný rozpad podle skupin nemocí najdete v záložkách výš — inspirováno švýcarským [Infectious Disease Dashboard](https://www.idd.bag.admin.ch/en).

---

### Regionální mapa — celkový počet případů

Choroplethová mapa ukazuje celkový počet hlášených infekčních nemocí v jednotlivých krajích ČR za poslední dostupný rok. Najeďte myší na kraj pro zobrazení přesného počtu.

{{< region-map id="isinMap" src="/data/charts/isin_regional_map.json" title="Hlášené infekční nemoci podle krajů ČR — absolutní počty" >}}

---

### Regionální mapa — incidence na 100 000 obyvatel

Stejná data přepočtená na velikost populace kraje (zdroj jmenovatelů: ČSÚ). **Obě mapy vypadají úplně jinak — a ta druhá je ta správná pro srovnávání krajů.**

Absolutní počty totiž hlavně kopírují, kde bydlí víc lidí. Praha má v absolutních číslech průměrný počet případů, ale po přepočtu na obyvatele má **nejnižší incidenci ze všech krajů** (720,6 na 100 tis.). Naopak Kraj Vysočina, který v absolutních počtech nijak nevyčnívá, je po přepočtu **nejvyšší** (1 639,9). Moravskoslezský kraj má nejvíc případů v absolutních číslech, ale v incidenci je až čtvrtý.

{{< region-map id="isinIncidence" src="/data/charts/isin_regional_incidence.json" unit="případů na 100 tis." title="Incidence infekčních nemocí podle krajů ČR — na 100 000 obyvatel" >}}

Rozdíly mezi kraji můžou odrážet i pokrytí a kapacitu hlásící sítě, ne jen skutečný výskyt — vyšší incidence nemusí znamenat víc nemocí, ale i důslednější hlášení.

---

### Top 10 diagnóz — roční počty 2018–2025

Přehled deseti nejčastěji hlášených infekčních nemocí dle počtu případů v jednotlivých letech.
Varicella (plané neštovice) dlouhodobě dominuje díky povinnosti hlášení a velké nákazlivosti v dětské populaci.

{{< chart id="isinTopDiseases" src="/data/charts/isin_top_diseases.json" type="bar" title="Top 10 infekčních nemocí — počty případů (2018–2025)" height="420" >}}

---

### Sezónní průběh — měsíční počty případů

Měsíční časové řady nejčastějších diagnóz ukazují sezónnost (plané neštovice vrcholí
na jaře, salmonelózy v létě) i mimořádné události — pertusová epidemie 2024 je vidět
jako výrazný vrchol vymykající se všem předchozím rokům.

{{< chart id="isinMonthly" src="/data/charts/isin_monthly_trend.json" type="line" title="Sezónní průběh — měsíční počty případů" height="380" >}}

---

### Věková struktura případů (kumulativně 2018–2025)

Rozložení hlášených případů dle věkových skupin za celé sledované období. Nejrizikovější skupiny jsou děti do 14 let (varicella, GI infekce) a senioři 65+ (komplikované průběhy).

{{< chart id="isinAge" src="/data/charts/isin_age_groups.json" type="bar" title="Počet hlášených případů dle věkové skupiny (2018–2025)" height="360" >}}

---

### Poznámky k datům

- Data pocházejí z **ISIN** (Informační Systém Infekčních Nemocí), povinné hlášení dle zákona č. 258/2000 Sb.
- Vydavatel: **ÚZIS ČR / MZČR** — licence CC BY 4.0
- Databáze: `Otevrena-data-NR-27-01-infekcni-nemoci.csv` (~272 000 záznamů, 2018–2025)
- Sloupce: rok, měsíc, kraj (NUTS3), diagnóza (MKN-10), věková skupina, pohlaví, EWS příznak, počet případů
- Počty případů jsou agregované (ne individuální záznamy pacientů)
- Chřipka je vynechána — má vlastní podrobnější zdroj (SZÚ), viz Influenza dashboardy

<p class="stat-source">
  Zdroj: <a href="https://datanzis.uzis.gov.cz/data/NR-27-ISIN/NR-27-01/Otevrena-data-NR-27-01-infekcni-nemoci.csv" target="_blank">ÚZIS ČR — Otevřená data ISIN</a> ·
  Licence: <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank">CC BY 4.0</a> ·
  Kategorie: povinné hlášení infekčních nemocí · Roky: 2018–2025
</p>
