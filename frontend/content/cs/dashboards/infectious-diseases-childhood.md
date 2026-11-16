---
title: "Infekční nemoci — Časté dětské/vzdušné"
origin: aggregated
description: "Plané neštovice, pásový opar, černý kašel, spála, mononukleóza, příušnice a spalničky v ČR: letošní týdenní počty, roční vývoj a věk (ÚZIS ISIN)."
image: "/images/cards/id-childhood.webp"
update_from: "isin_group_childhood_airborne.json"
update_read: "year"
tags: ["infekční nemoci", "ÚZIS", "ISIN", "dětské nemoci"]
data_source: '<a href="https://www.nzip.cz/data/2621-infekcni-nemoci-otevrena-data" target="_blank">ÚZIS ČR — otevřená data ISIN (CC BY 4.0)</a> · <a href="https://www.nzip.cz/data/2620-infekcni-nemoci-mezirocni-srovnani-datovy-souhrn" target="_blank">ÚZIS ČR — týdenní datový souhrn</a>'
build:
  list: never
  render: always
---

{{< nav-pills group="infekcni-nemoci" active="detske" >}}

Nemoci, které se šíří kapénkami nebo blízkým kontaktem a nejčastěji postihují děti: plané neštovice, spála, černý kašel, příušnice, spalničky, infekční mononukleóza a virové vyrážkové infekce. Patří sem i pásový opar, který vzniká u dospělých reaktivací viru planých neštovic.

{{< callout tone="warning" >}}
**Od července 2025 se část případů hlásí novým způsobem (EWS).** V této skupině se to týká hlavně pásového oparu, infekční mononukleózy a planých neštovic. Počty od poloviny roku 2025 proto nejde srovnávat s dřívějšími roky: vyšší číslo může být změnou hlášení, ne vyšší nemocností. V grafech je část z hlášení EWS odlišená barvou; podrobnosti jsou na [přehledu](/dashboards/infectious-diseases/).
{{< /callout >}}

{{% if-data file="isin_weekly.json" %}}
---

### Letos po týdnech

Diagnózy této skupiny, které ÚZIS zveřejňuje po týdnech až do minulého týdne: plané neštovice, pásový opar, černý kašel, infekční mononukleóza, příušnice a spalničky. Sloupce ukazují hlášené případy a barevně odlišenou část, která vznikla z hlášení EWS.

{{< isin part="weekly" group="childhood_airborne" note="Absolutní počty hlášených případů za kalendářní týden (pondělí až neděle), celá ČR, podle týdenního datového souhrnu ÚZIS. „Z hlášení EWS“ jsou záznamy založené na automatizovaném hlášení; jsou součástí celkového počtu, ne případy navíc. Počet hlášených případů není počet nemocných." note_age="Přepočet na obyvatele je výpočet portálu (jmenovatele ČSÚ), ne oficiální statistika. Věkové skupiny jsou různě široké, proto se neuvádí počet, ale přepočet na 100 tis. obyvatel dané skupiny." >}}
{{% /if-data %}}

---

### Roční počty

Každá diagnóza má vlastní graf s vlastní osou, protože se počty ve skupině liší i o několik řádů. Sloupce jsou jednotlivé roky; přesná hodnota se zobrazí po najetí myší na sloupec nebo v tabulce.

{{% if-data file="isin_groups.json" %}}
{{< isin part="group" group="childhood_airborne" note="Absolutní roční počty hlášených případů, celá ČR, otevřená data ISIN. Nepřepočteno na obyvatele. Osy jednotlivých grafů nejsou stejné: výšku sloupců lze srovnávat jen uvnitř jednoho grafu." >}}
{{% /if-data %}}
{{% if-data file="isin_groups.json" not="true" %}}
{{< chart id="isinChildhood" src="/data/charts/isin_group_childhood_airborne.json" type="bar" title="Časté dětské/vzdušné nemoci — roční počty případů" height="420"  note="Absolutní roční počty hlášených případů, celá ČR. Nepřepočteno na obyvatele." >}}
{{% /if-data %}}

{{% if-data file="isin_groups.json" %}}
---

### Věk

Kolik hlášených případů této skupiny připadá na 100 tis. lidí stejného věku. Věkové skupiny jsou různě široké (první má jeden ročník, poslední všechny od 75 let), proto se neuvádí samotný počet.

{{< isin part="group-age" group="childhood_airborne" note="Diagnózy této skupiny za poslední uzavřený rok, celá ČR. Přepočet na obyvatele je výpočet portálu (jmenovatele ČSÚ), ne oficiální statistika ČSÚ." >}}
{{% /if-data %}}

---

### Metodika a omezení

- Data pocházejí z otevřených dat **ISIN** (Informační systém infekčních nemocí, ÚZIS ČR), povinné hlášení dle zákona č. 258/2000 Sb. Obnovují se jednou ročně a končí prosincem posledního uzavřeného roku.
- Týdenní počty jsou z datového souhrnu ÚZIS „Meziroční srovnání počtu infekčních nemocí po týdnech v ČR“. Souhrn licenci neuvádí, uvádí citaci (níže).
- Záznamy z hlášení EWS (automatizované hlášení od poskytovatelů zdravotních služeb a laboratoří) jsou v datech od července 2025 a jejich podíl dál roste; počty od té doby nelze srovnávat s předchozími roky.
- Počet hlášených případů není počet nemocných: zachytí jen ty, kdo vyhledali lékaře a byli nahlášeni.
- Přepočty na 100 tis. obyvatel počítá portál z dat ČSÚ (obyvatelstvo k 31. 12.); nejde o oficiální statistiku ČSÚ.
- Černý kašel, infekční mononukleóza a jiné virové vyrážkové infekce jsou v této skupině od listopadu 2026; dřív byly součástí skupiny Ostatní.

<p class="stat-source">
  Zdroj: <a href="https://www.nzip.cz/data/2621-infekcni-nemoci-otevrena-data" target="_blank">ÚZIS ČR — Otevřená data ISIN</a> ·
  Licence: <a href="https://creativecommons.org/licenses/by/4.0/deed.cs" target="_blank">CC BY 4.0</a> ·
  jmenovatele <a href="https://csu.gov.cz" target="_blank">ČSÚ</a> (<a href="https://csu.gov.cz/podminky_pro_vyuzivani_a_dalsi_zverejnovani_statistickych_udaju_csu" target="_blank">podmínky ČSÚ</a>)
</p>
<p class="stat-source">
  Týdenní data: Šanca O., Májek T., Davidová H., Rázková K., Klimeš D., Kubát J., Blaha M., Jarkovský J. Meziroční srovnání počtu infekčních nemocí po týdnech v ČR. Národní zdravotnický informační portál [online]. Praha: Ministerstvo zdravotnictví ČR a Ústav zdravotnických informací a statistiky ČR, 2026. Dostupné z: <a href="https://www.nzip.cz/data/2620-infekcni-nemoci-mezirocni-srovnani-datovy-souhrn" target="_blank">https://www.nzip.cz/data/2620-infekcni-nemoci-mezirocni-srovnani-datovy-souhrn</a>. ISSN 2695-0340. Úpravy: součty za rok a poslední čtyři týdny, podíl záznamů z hlášení EWS a přepočet věkových skupin na 100 tis. obyvatel vypočítal portál.
</p>
