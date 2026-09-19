---
title: "Infekční nemoci — Tuberkulóza"
origin: aggregated
description: "Tuberkulóza v ČR 2000–2024 z Registru tuberkulózy: incidence na 100 000 obyvatel, věk, rodná země a kraje."
image: "/images/cards/id-other.svg"
update_from: "tbc_incidence.json"
update_read: "year"
tags: ["infekční nemoci", "ÚZIS", "tuberkulóza", "TBC"]
data_source: '<a href="https://www.nzip.cz/data/2671-tuberkuloza-epidemiologie-otevrena-data" target="_blank">ÚZIS ČR — Registr tuberkulózy</a> · <a href="https://csu.gov.cz" target="_blank">ČSÚ</a>'
build:
  list: never
  render: always
---

{{< nav-pills group="infekcni-nemoci" active="tbc" >}}

Tuberkulóza má v Česku vlastní povinný registr a v datech ISIN není. Za čtvrt století
klesla na méně než třetinu — a změnilo se i to, koho postihuje.

{{< chart id="tbcIncidence" src="/data/charts/tbc_incidence.json" type="line" title="Tuberkulóza — nově hlášené případy na 100 000 obyvatel (2000–2024)" height="360" note="Všechny formy tuberkulózy (MKN-10 A15–A19), rok incidence = první potvrzené datum onemocnění v registru. Přepočet na populaci ČR (ČSÚ). Země pod 10 případů na 100 000 řadí WHO mezi země s nízkou incidencí." >}}

{{< chart id="tbcOrigin" src="/data/charts/tbc_origin.json" type="bar" title="Tuberkulóza podle rodné země pacienta" height="360" note="Absolutní roční počty. Případů u lidí narozených v ČR ubylo od roku 2000 na méně než pětinu (z 1 258 na 223); podíl narozených v zahraničí proto roste, i když jejich absolutní počet se mění mnohem méně. Rodná země není totéž co státní občanství ani místo nákazy." >}}

{{< chart id="tbcAge" src="/data/charts/tbc_age.json" type="line" title="Tuberkulóza podle věku" height="340" note="Absolutní roční počty ve třech věkových skupinách, jak je dává zdroj. Skupiny jsou různě široké — 19–64 let pokrývá většinu populace, křivky proto neříkají nic o riziku na osobu." >}}

{{< region-map id="tbcMap" src="/data/charts/tbc_map.json" unit="případů na 100 tis. ročně" title="Tuberkulóza podle kraje — průměr posledních tří let na 100 000 obyvatel" note="Průměrný roční počet případů za poslední tři roky na 100 000 obyvatel kraje. Průměrujeme záměrně: na kraj připadá kolem třiceti případů ročně a jednotlivý rok by byl hlavně náhoda. Kraj je kraj dispenzarizace (kde je pacient v péči), ne nutně bydliště." >}}

### Na co si dát pozor

- **Data mají roční zpoždění.** Registr se zveřejňuje jednou ročně; poslední rok je 2024.
- **Malá čísla.** Kolem 430 případů ročně na celou republiku — rozdíly mezi kraji a meziroční výkyvy číst opatrně.
- **Rodná země u části případů chybí** („neuvedeno") a v grafu jsou tyto případy přiřazeny podle příznaku zdroje.

<p class="stat-source">
  Zdroj: <a href="https://www.nzip.cz/data/2671-tuberkuloza-epidemiologie-otevrena-data" target="_blank">ÚZIS ČR — Epidemiologie tuberkulózy (otevřená data)</a> ·
  jmenovatele <a href="https://csu.gov.cz" target="_blank">ČSÚ</a> · Licence: volný přístup
</p>
