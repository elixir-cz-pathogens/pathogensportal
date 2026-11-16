---
title: "Infekční nemoci — Vzácné závažné"
origin: aggregated
description: "Záškrt, meningokokové infekce, opičí neštovice, břišní tyfus a další vzácné závažné nákazy v ČR: roční počty a věk (ÚZIS ISIN)."
image: "/images/cards/id-rare.webp"
update_from: "isin_group_rare_severe.json"
update_read: "year"
tags: ["infekční nemoci", "ÚZIS", "ISIN", "vzácné nemoci"]
data_source: '<a href="https://www.nzip.cz/data/2621-infekcni-nemoci-otevrena-data" target="_blank">ÚZIS ČR — otevřená data ISIN (CC BY 4.0)</a>'
build:
  list: never
  render: always
---

{{< nav-pills group="infekcni-nemoci" active="vzacne" >}}

Nemoci, u kterých je důležitý každý jednotlivý případ: záškrt, meningokokové infekce, opičí neštovice, břišní tyfus a paratyfus, Q horečka, brucelóza a žlutá zimnice. Počty jsou řádově nižší než v ostatních skupinách; jeden hlášený případ záškrtu nebo žluté zimnice je významný sám o sobě.

---

### Roční počty

Každá diagnóza má vlastní graf s vlastní osou, protože se počty ve skupině liší i o několik řádů. Sloupce jsou jednotlivé roky; přesná hodnota se zobrazí po najetí myší na sloupec nebo v tabulce.

{{% if-data file="isin_groups.json" %}}
{{< isin part="group" group="rare_severe" note="Absolutní roční počty hlášených případů, celá ČR, otevřená data ISIN. Nepřepočteno na obyvatele. Osy jednotlivých grafů nejsou stejné: výšku sloupců lze srovnávat jen uvnitř jednoho grafu." >}}
{{% /if-data %}}
{{% if-data file="isin_groups.json" not="true" %}}
{{< chart id="isinRare" src="/data/charts/isin_group_rare_severe.json" type="bar" title="Vzácné závažné nemoci — roční počty případů" height="420"  note="Absolutní roční počty hlášených případů, celá ČR. Nepřepočteno na obyvatele." >}}
{{% /if-data %}}

{{% if-data file="isin_groups.json" %}}
---

### Věk

Kolik hlášených případů této skupiny připadá na 100 tis. lidí stejného věku. Věkové skupiny jsou různě široké (první má jeden ročník, poslední všechny od 75 let), proto se neuvádí samotný počet.

{{< isin part="group-age" group="rare_severe" note="Diagnózy této skupiny za poslední uzavřený rok, celá ČR. Přepočet na obyvatele je výpočet portálu (jmenovatele ČSÚ), ne oficiální statistika ČSÚ." >}}
{{% /if-data %}}

---

### Metodika a omezení

- Data pocházejí z otevřených dat **ISIN** (Informační systém infekčních nemocí, ÚZIS ČR), povinné hlášení dle zákona č. 258/2000 Sb. Obnovují se jednou ročně a končí prosincem posledního uzavřeného roku.
- Záznamy z hlášení EWS (automatizované hlášení od poskytovatelů zdravotních služeb a laboratoří) jsou v datech od července 2025 a jejich podíl dál roste; počty od té doby nelze srovnávat s předchozími roky.
- Počet hlášených případů není počet nemocných: zachytí jen ty, kdo vyhledali lékaře a byli nahlášeni.
- Přepočty na 100 tis. obyvatel počítá portál z dat ČSÚ (obyvatelstvo k 31. 12.); nejde o oficiální statistiku ČSÚ.
- Tularemie je od listopadu 2026 ve skupině Klíšťaty/zvířaty přenášené.

<p class="stat-source">
  Zdroj: <a href="https://www.nzip.cz/data/2621-infekcni-nemoci-otevrena-data" target="_blank">ÚZIS ČR — Otevřená data ISIN</a> ·
  Licence: <a href="https://creativecommons.org/licenses/by/4.0/deed.cs" target="_blank">CC BY 4.0</a> ·
  jmenovatele <a href="https://csu.gov.cz" target="_blank">ČSÚ</a> (<a href="https://csu.gov.cz/podminky_pro_vyuzivani_a_dalsi_zverejnovani_statistickych_udaju_csu" target="_blank">podmínky ČSÚ</a>)
</p>
