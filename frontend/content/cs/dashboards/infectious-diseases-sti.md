---
title: "Infekční nemoci — Pohlavně přenosné"
origin: aggregated
description: "Syfilis a kapavka od roku 1994 (Registr pohlavních nemocí), chlamydiové infekce a trichomoniáza 2018–2025 (ISIN) — trendy, pohlaví, věk a kraje."
image: "/images/cards/id-sti.webp"
update_from: "isin_group_sti.json"
update_read: "year"
tags: ["infekční nemoci", "ÚZIS", "ISIN", "STI", "syfilis", "kapavka"]
data_source: '<a href="https://www.nzip.cz/data/2639-pohlavni-nemoci-otevrena-data" target="_blank">ÚZIS ČR — Registr pohlavních nemocí</a> · <a href="https://datanzis.uzis.gov.cz" target="_blank">ISIN</a> · <a href="https://csu.gov.cz" target="_blank">ČSÚ</a>'
build:
  list: never
  render: always
---

{{< nav-pills group="infekcni-nemoci" active="sti" >}}

Pohlavní nemoci se v Česku hlásí **dvěma cestami**. Syfilis, kapavka a venerický
lymfogranulom mají vlastní Registr pohlavních nemocí s řadou od roku 1994; chlamydiové
infekce, trichomoniáza a další jdou přes ISIN a máme je od roku 2018. Stránka ukazuje
obojí — dohromady se sečíst nedají, každý zdroj má jiná pravidla hlášení.

### Syfilis a kapavka — Registr pohlavních nemocí

{{< chart id="stiTrend" src="/data/charts/sti_registry_trend.json" type="line" title="Syfilis, kapavka a venerický lymfogranulom — hlášené případy 1994–2025" height="380" note="Absolutní roční počty hlášených případů, celá ČR. Syfilis je součet všech stadií (vrozená, časná, pozdní, jiná a nespecifikovaná; MKN-10 A50–A53), kapavka A54, venerický lymfogranulom A55." >}}

{{< chart id="stiIncidence" src="/data/charts/sti_registry_incidence.json" type="line" title="Syfilis a kapavka — hlášené případy na 100 000 obyvatel" height="340" note="Přepočet na populaci ČR (ČSÚ, stav k 31. 12.). Řada začíná rokem 2000, odkud máme jmenovatele. Kapavka se od roku 2010 zhruba ztrojnásobila. Růst hlášených případů ale nemusí znamenat jen víc nákaz — víc případů zachytí i častější testování." >}}

{{< chart id="stiSex" src="/data/charts/sti_registry_sex.json" type="line" title="Syfilis a kapavka dohromady — muži a ženy na 100 000" height="340" note="Každé pohlaví přepočtené vlastním jmenovatelem (na 100 000 mužů, resp. žen). Rozdíl mezi pohlavími se po roce 2010 rozevírá; u žen bývá kapavka častěji bez příznaků, a tedy i méně často zachycená." >}}

{{< chart id="stiAge" src="/data/charts/sti_registry_age.json" type="bar" title="Syfilis a kapavka podle věku — součet za posledních pět let" height="340" note="Absolutní počty hlášených případů za pětileté období, celá ČR. Věkové skupiny jsou různě široké (nejmladší a nejstarší jsou otevřené), sloupce proto nejde číst jako riziko na osobu." >}}

{{< region-map id="stiMap" src="/data/charts/sti_registry_map.json" unit="případů na 100 tis." title="Syfilis a kapavka podle kraje bydliště — na 100 000 obyvatel" note="Hlášené případy za poslední rok na 100 000 obyvatel kraje. Kraj je odvozený z okresu bydliště pacienta; případy bez bydliště v ČR v mapě nejsou. Praha vyčnívá i proto, že se v ní soustřeďuje specializovaná péče a testování." >}}

### Chlamydie, trichomoniáza a další — ISIN

{{< chart id="isinSti" src="/data/charts/isin_group_sti.json" type="bar" title="Pohlavně přenosné nemoci hlášené přes ISIN — roční počty případů (2018–2025)" height="420"  note="Absolutní roční počty hlášených případů, celá ČR. Nepřepočteno na obyvatele." >}}

### Na co si dát pozor

- **Hlášené případy nejsou skutečný výskyt.** Pohlavní nemoci často probíhají bez příznaků; čísla rostou i tehdy, když se víc testuje.
- **HIV tu není** — má vlastní registr, který v otevřených datech zatím není.
- **Roční data.** Registr pohlavních nemocí se zveřejňuje jednou ročně, poslední rok může být ještě doplňován.

<p class="stat-source">
  Zdroj: <a href="https://www.nzip.cz/data/2639-pohlavni-nemoci-otevrena-data" target="_blank">ÚZIS ČR — Registr pohlavních nemocí (otevřená data)</a> ·
  <a href="https://datanzis.uzis.gov.cz" target="_blank">ÚZIS ČR — Otevřená data ISIN</a> ·
  jmenovatele <a href="https://csu.gov.cz" target="_blank">ČSÚ</a> ·
  Licence: <a href="https://data.gov.cz/podm%C3%ADnky-u%C5%BEit%C3%AD/voln%C3%BD-p%C5%99%C3%ADstup/" target="_blank">volný přístup</a>
</p>
