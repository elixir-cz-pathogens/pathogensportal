---
title: "Genomická data z Česka"
origin: aggregated
description: "Co je z českých vzorků veřejně uloženo v evropském archivu sekvencí ENA — kolik dat, pro které patogeny, jak přibývají a jak dobře jsou popsaná."
image: "/images/cards/infectious-hub.svg"
tags: ["genomika", "sekvenování", "ENA", "otevřená data", "ČR"]
data_source: '<a href="https://www.ebi.ac.uk/ena/browser/home" target="_blank">European Nucleotide Archive (EMBL-EBI)</a>'
update_from: "genomics_overview.json"
update_read: "stamp"
---

{{< nav-pills group="genomika" active="prehled" >}}

Ostatní panely ukazují, kolik případů se nahlásilo. Tenhle ukazuje druhou stranu: kolik
**genomických dat o českých patogenech je veřejně dostupných**. Data pocházejí z Evropského
archivu nukleotidových sekvencí (ENA) při EMBL-EBI, kam je ukládají laboratoře z celého světa.

{{< genomics part="overview" note="Značka „patogen“ je v archivu velmi široká: patří do ní i viry rostlin (například virus šarky švestky) a zvířat nebo bakteriofágy. Tabulka níže proto sleduje jen nemoci, o kterých portál píše, ne celý archiv." >}}

---

### Jak data přibývají

Graf ukazuje, kolik sekvenačních běhů z českých vzorků bylo v daném roce **zveřejněno** —
ne odebráno. Mezi odběrem a zveřejněním uplynou obvykle roky, viz část o popisu dat níže.

{{< genomics part="growth" >}}

---

### Patogeny, které portál sleduje

U každé nemoci počet záznamů, kdy naposledy nějaký přibyl a odkazy na panel portálu
a do archivu. Seznam je ručně vedený a drží se nemocí, které portál sleduje jinde.

{{< genomics part="taxa" note="Dva druhy záznamů: **sekvenační běh** jsou surová data ze sekvenátoru, **sestavená sekvence** hotový genom nebo jeho část. Jeden vzorek může dát obojí, ale nemusí — proto se sloupce nesčítají. Řádek bez záznamů neznamená, že se nesekvenuje: data mohou být v jiném archivu, u SARS-CoV-2 je to prokazatelně tak." >}}

---

### Jak dobře jsou data popsaná

Záznam v archivu nese vedle sekvence i údaje o vzorku. Jejich vyplněnost rozhoduje o tom,
co z dat jde zjistit: bez data odběru nejde sledovat vývoj v čase, bez zdroje izolace
rozlišit vzorek od pacienta a z prostředí.

{{< genomics part="quality" note="Pokrytí genomu je podíl přečtených bází na délku genomu daného druhu — řádový odhad, ne přesný výpočet. Pokrytí kolem stonásobku je u bakterií běžný standard pro spolehlivé určení genů." >}}

### Metodika a omezení

- **Počet záznamů není nemocnost.** Záznam vznikne tím, že někdo vzorek sekvenoval a data
  zveřejnil. Nemocnost ukazují panely [infekčních nemocí](/dashboards/infectious-diseases/)
  a [chřipky](/dashboards/influenza-surveillance/).
- **Zemi odběru vyplňuje vkladatel** a je nepovinná. Záznam z českého vzorku bez vyplněné
  země se do počtů nedostane, všechna čísla jsou proto spodní odhad.
- Dotaz zní na zemi odběru `country="Czech Republic"` a na datový portál `pathogen`.
  Novější tvar názvu („Czechia“) archiv u těchto záznamů nepoužívá.
- Část dat vložily zahraniční výzkumné projekty, které pracovaly s českými vzorky;
  záznam tedy nevypovídá o tom, kde se sekvenovalo.
- Počty se obnovují při každém běhu datové pipeline, archiv sám přijímá záznamy průběžně.

<p class="stat-source">
  Zdroj: <a href="https://www.ebi.ac.uk/ena/browser/home" target="_blank">European Nucleotide Archive</a>, EMBL-EBI ·
  podmínky <a href="https://www.insdc.org/policy/" target="_blank">INSDC</a>: sekvenční záznamy nenesou omezení užití ·
  Úpravy: součty za Česko, rozpady po letech, technologiích a patogenech a výpočet vyplněnosti polí dělá Pathogen Portal.
</p>
