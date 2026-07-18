---
title: "Infekční nemoci — ISIN dashboard"
description: "Přehled hlášených infekčních nemocí v ČR 2018–2025 dle ÚZIS — regionální mapa, top diagnózy, věková struktura a sezónní trendy."
image: "/images/dashboard-placeholder.svg"
highlight: true
tags: ["infekční nemoci", "surveillance", "ÚZIS", "kraje", "ČR"]
data_source: '<a href="https://datanzis.uzis.gov.cz" target="_blank">ÚZIS ČR — Otevřená data ISIN (CC BY 4.0)</a>'
update_freq: "Průběžná aktualizace (data 2018–2025)"
---

Tento dashboard zobrazuje hlášené infekční nemoci v České republice na základě dat z **Informačního Systému Infekčních Nemocí (ISIN)** spravovaného ÚZIS ČR a MZČR. Data pokrývají 272 000+ záznamů od roku 2018 ve všech 14 krajích.

---

### Regionální mapa — celkový počet případů

Choroplethová mapa ukazuje celkový počet hlášených infekčních nemocí v jednotlivých krajích ČR za poslední dostupný rok. Najeďte myší na kraj pro zobrazení přesného počtu.

{{< region-map id="isinMap" src="/data/charts/isin_regional_map.json" title="Hlášené infekční nemoci podle krajů ČR" >}}

---

### Top 10 diagnóz — roční počty 2018–2025

Přehled deseti nejčastěji hlášených infekčních nemocí dle počtu případů v jednotlivých letech.
Varicella (plané neštovice) dlouhodobě dominuje díky povinnosti hlášení a velké nákazlivosti v dětské populaci.

{{< chart id="isinTopDiseases" src="/data/charts/isin_top_diseases.json" type="bar" title="Top 10 infekčních nemocí — počty případů (2018–2025)" height="420" >}}

---

### Sezónní trendy vybraných nemocí (měsíční)

Měsíční průběh vybraných infekčních nemocí ilustruje sezónnost: Varicella vrcholí na jaře, salmonelózy a kampylobakteriózy v létě, lymeská borrelióza v červnu–září.

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
- Rozdíly mezi kraji mohou odrážet i kapacitu a pokrytí hlásící sítě

<p class="stat-source">
  Zdroj: <a href="https://datanzis.uzis.gov.cz/data/NR-27-ISIN/NR-27-01/Otevrena-data-NR-27-01-infekcni-nemoci.csv" target="_blank">ÚZIS ČR — Otevřená data ISIN</a> ·
  Licence: <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank">CC BY 4.0</a> ·
  Kategorie: povinné hlášení infekčních nemocí · Roky: 2018–2025
</p>
