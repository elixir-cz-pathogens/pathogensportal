---
title: "Infekční nemoci — Ostatní"
origin: aggregated
description: "Infekční diagnózy mimo tematické skupiny v ČR: deset nejčastějších po letech a věk (ÚZIS ISIN)."
image: "/images/cards/id-other.svg"
update_from: "isin_group_other.json"
update_read: "year"
tags: ["infekční nemoci", "ÚZIS", "ISIN"]
data_source: '<a href="https://www.nzip.cz/data/2621-infekcni-nemoci-otevrena-data" target="_blank">ÚZIS ČR — otevřená data ISIN (CC BY 4.0)</a>'
build:
  list: never
  render: always
---

{{< nav-pills group="infekcni-nemoci" active="ostatni" >}}

Diagnózy, které nepatří do žádné tematické skupiny: sepse, enterobióza, virové meningitidy, zápaly plic s určeným původcem a desítky dalších, většinou s malým počtem případů.

---

### Nejčastější diagnózy

Deset diagnóz mimo tematické skupiny s nejvyšším počtem hlášených případů ve zvoleném roce. Úřední název podle MKN-10 se zobrazí po najetí myší na řádek.

{{% if-data file="isin_groups.json" %}}
{{< isin part="other" note="Absolutní roční počty hlášených případů, celá ČR, otevřená data ISIN; chřipka je vynechána. Druhá barva jsou záznamy z hlášení EWS, které se používá od července 2025." >}}
{{% /if-data %}}
{{% if-data file="isin_groups.json" not="true" %}}
{{< chart id="isinOther" src="/data/charts/isin_group_other.json" type="bar" title="Ostatní diagnózy (souhrn) — roční počty případů" height="380"  note="Absolutní roční počty hlášených případů, celá ČR. Nepřepočteno na obyvatele." >}}
{{% /if-data %}}

{{% if-data file="isin_groups.json" %}}
---

### Věk

Kolik hlášených případů této skupiny připadá na 100 tis. lidí stejného věku. Věkové skupiny jsou různě široké (první má jeden ročník, poslední všechny od 75 let), proto se neuvádí samotný počet.

{{< isin part="group-age" group="other" note="Diagnózy této skupiny za poslední uzavřený rok, celá ČR. Přepočet na obyvatele je výpočet portálu (jmenovatele ČSÚ), ne oficiální statistika ČSÚ." >}}
{{% /if-data %}}

---

### Metodika a omezení

- Data pocházejí z otevřených dat **ISIN** (Informační systém infekčních nemocí, ÚZIS ČR), povinné hlášení dle zákona č. 258/2000 Sb. Obnovují se jednou ročně a končí prosincem posledního uzavřeného roku.
- Záznamy z hlášení EWS (automatizované hlášení od poskytovatelů zdravotních služeb a laboratoří) jsou v datech od července 2025 a jejich podíl dál roste; počty od té doby nelze srovnávat s předchozími roky.
- Počet hlášených případů není počet nemocných: zachytí jen ty, kdo vyhledali lékaře a byli nahlášeni.
- Přepočty na 100 tis. obyvatel počítá portál z dat ČSÚ (obyvatelstvo k 31. 12.); nejde o oficiální statistiku ČSÚ.
- Černý kašel, infekční mononukleóza a jiné virové vyrážkové infekce jsou od listopadu 2026 ve skupině Časté dětské/vzdušné; do té doby tvořily většinu součtu této stránky.

<p class="stat-source">
  Zdroj: <a href="https://www.nzip.cz/data/2621-infekcni-nemoci-otevrena-data" target="_blank">ÚZIS ČR — Otevřená data ISIN</a> ·
  Licence: <a href="https://creativecommons.org/licenses/by/4.0/deed.cs" target="_blank">CC BY 4.0</a> ·
  jmenovatele <a href="https://csu.gov.cz" target="_blank">ČSÚ</a> (<a href="https://csu.gov.cz/podminky_pro_vyuzivani_a_dalsi_zverejnovani_statistickych_udaju_csu" target="_blank">podmínky ČSÚ</a>)
</p>
