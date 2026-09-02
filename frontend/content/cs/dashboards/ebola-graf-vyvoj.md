---
title: "Ebola BDBV 2026 — Graf vývoje"
description: "Sekce situačního reportu: Graf vývoje. Zdroj: IMG AV ČR / UJEP."
tags: ["ebola", "epidemiologie", "IMG AV ČR", "Afrika"]
data_source: 'Jan Pačes & Michaela Liegertová — <a href="https://www.img.cas.cz" target="_blank">IMG AV ČR</a> · Licence CC BY 4.0'
build:
  list: never
  render: always
---

<div class="d-flex flex-wrap gap-1 mb-4" role="navigation" aria-label="Sekce situačního reportu">
  <a href="/dashboards/ebola-bundibugyo-2026/" class="btn btn-sm btn-outline-secondary me-1 mb-1">Aktuální stav</a>
  <a href="/dashboards/ebola-cesko/" class="btn btn-sm btn-outline-secondary me-1 mb-1">Český kontext</a>
  <a href="/dashboards/ebola-virus/" class="btn btn-sm btn-outline-secondary me-1 mb-1">Ebolaviry</a>
  <a href="/dashboards/ebola-lecba-vakciny/" class="btn btn-sm btn-outline-secondary me-1 mb-1">Léčba a vakcíny</a>
  <a href="/dashboards/ebola-predchozi-epidemie/" class="btn btn-sm btn-outline-secondary me-1 mb-1">Minulé epidemie</a>
  <a href="/dashboards/ebola-dezinformace/" class="btn btn-sm btn-outline-secondary me-1 mb-1">Dezinformace</a>
  <a href="/dashboards/ebola-zdroje/" class="btn btn-sm btn-outline-secondary me-1 mb-1">Zdroje</a>
  <a href="/dashboards/ebola-graf-vyvoj/" class="btn btn-sm btn-outline-secondary me-1 mb-1 active">Graf vývoje</a>
</div>
**Jak graf číst:** jde o vývoj hlášených potvrzených případů a úmrtí mezi potvrzenými případy v DRK, nikoli o datum vzniku infekce. INSP opakovaně upozorňuje na čištění a harmonizaci databáze DHIS2; denní změny proto mohou zahrnovat zpětné laboratorní potvrzení nebo revidované zařazení případů.

**Stav k datu:** řada končí nejnovějším veřejným detailním SitRepem 108 s údaji k 30. 8. SitRepy 107–108 byly přidány bez dopočítávání chybějících dnů. Aktuální souhrn je na stránce [Aktuální stav](/dashboards/ebola-bundibugyo-2026/).

**6 100 potvrzených případů**Poslední kumulativní bod: INSP/COUSP SitRep 108, údaje k 30. 8. 2026.

**2 950 úmrtí mezi potvrzenými případy**Suspektní úmrtí nejsou zahrnuta.

**86 bodů kumulativní řady**Veřejně dohledané body ze SitRepů včetně SitRepů 59, 62, 64–74 a 77–108; chybějící dny nejsou dopočítané.

## Denní hlášení v dostupných SitRepech

Osa X používá kalendářní týdny ukotvené k pondělí. Sloupce případů zobrazují položku „nouveaux cas confirmés (nově potvrzené případy)“. Sloupce úmrtí uvádějí nově hlášená úmrtí mezi potvrzenými případy, pokud je SitRep takto samostatně uvádí.

Nově hlášené potvrzené případy
Nově hlášená úmrtí mezi potvrzenými případy

SitRep N°21, N°29, N°43, N°45 a N°63 nebyly při ověření dohledány jako veřejné položky aktuální řady INSP. Chybějící dny proto nedopočítáváme. U SitRepu 46 vychází denní sloupec z hodnoty 26 nově hlášených potvrzených případů uváděné ECDC oproti předchozí veřejné aktualizaci se stavem k 28. 6.; není dopočítán jako rozdíl mezi posledními dvěma vykreslenými body. U SitRepů 47–59, 60–62, 64–68 a 72–108 jsou denní hodnoty převzaty přímo ze SitRepů. U SitRepů 53–58 a 60 nevykreslujeme denní sloupec úmrtí, protože zprávy tuto metriku neoddělují srovnatelným způsobem.


---

## Denně hlášené případy

{{< chart id="ebolaDaily" src="/data/charts/ebola_daily.json" type="bar" title="Ebola BDBV 2026 — nově hlášené případy za den (DRC)" height="320" >}}

## Kumulativní úmrtí

{{< chart id="ebolaDeaths" src="/data/charts/ebola_deaths_cumulative.json" type="line" title="Ebola BDBV 2026 — kumulativní úmrtí mezi potvrzenými případy (DRC)" height="320" >}}

## Srovnání s předchozími epidemiemi

Kumulativní počty případů podle počtu dnů od začátku epidemie. Srovnání je orientační — jednotlivá ohniska se liší dostupností testování i rozsahem sledovaného území.

{{< chart id="ebolaTrajectories" src="/data/charts/ebola_trajectories.json" type="line" title="Trajektorie vybraných ebolavirových epidemií" height="360" >}}

---


## Kumulativní úmrtí mezi potvrzenými případy

Osa X: stav k datu; značky po týdnech, ukotvené k pondělí. Osa Y: kumulativní úmrtí mezi potvrzenými případy v kroku 500. Rozsah os se rozšíří až po přechodu do dalšího kalendářního týdne nebo po překročení dalšího násobku 500.

Kumulativní úmrtí mezi potvrzenými případy

## Tabulka hodnot

| Stav k datu | SitRep | Kumulativně potvrzené případy | Kumulativní úmrtí mezi potvrzenými případy | Nově hlášené potvrzené případy | Nově hlášená úmrtí mezi potvrzenými případy | Zdroj |
| --- | --- | --- | --- | --- | --- | --- |
| 2026-05-30 | 16 | 282 | 42 | 19 | — | [insp.cd](https://insp.cd/sitrep-n016-mvb_30-2026/) |
| 2026-05-31 | 17 | 321 | 48 | 12 | — | [insp.cd](https://insp.cd/sitrep-n017-mvb_31-2026/) |
| 2026-06-01 | 18 | 344 | 60 | 23 | — | [insp.cd](https://insp.cd/sitrep-n018-mvb_01-06-2026/) |
| 2026-06-02 | 19 | 363 | 62 | 19 | 2 | [insp.cd](https://insp.cd/sitrep-n019-mvb_01-06-2026/) |
| 2026-06-03 | 20 | 381 | 64 | 18 | 2 | [insp.cd](https://insp.cd/sitrep-n020-mvb_02-06-2026/) |
| 2026-06-05 | 22 | 488 | 86 | 36 | 4 | [insp.cd](https://insp.cd/sitrep-n22-mvb_05-06-2026/) |
| 2026-06-06 | 23 | 515 | 91 | 27 | 4 | [insp.cd](https://insp.cd/sitrep-n23-mvb_06-06-2026/) |
| 2026-06-07 | 24 | 550 | 101 | 35 | 10 | [insp.cd](https://insp.cd/sitrep-n24-mvb_07-06-2026/) |
| 2026-06-08 | 25 | 598 | 115 | 48 | 14 | [insp.cd](https://insp.cd/sitrep-n25-mvb_08-06-2026/) |
| 2026-06-09 | 26 | 635 | 127 | 37 | 12 | [insp.cd](https://insp.cd/sitrep-n26-mvb_09-06-2026/) |
| 2026-06-10 | 27 | 676 | 136 | 41 | 9 | [insp.cd](https://insp.cd/sitrep-n27-mvb_10-06-2026/) |
| 2026-06-11 | 28 | 689 | 139 | 17 | 5 | [insp.cd](https://insp.cd/sitrep-n28-mvb_11-06-2026/) |
| 2026-06-13 | 30 | 782 | 181 | 72 | 29 | [insp.cd](https://insp.cd/sitrep-n30-mvb_13-06-2026/) |
| 2026-06-14 | 31 | 808 | 192 | 26 | 11 | [insp.cd](https://insp.cd/sitrep-n31-mvb_14-06-2026/) |
| 2026-06-15 | 32 | 837 | 196 | 29 | 4 | [insp.cd](https://insp.cd/sitrep-n32-mvb_15-06-2026/) |
| 2026-06-16 | 33 | 875 | 202 | 40 | 4 | [insp.cd](https://insp.cd/sitrep-n33-mvb_16-06-2026/) |
| 2026-06-17 | 34 | 896 | 232 | 21 | 6 | [insp.cd](https://insp.cd/sitrep-n34-mvb_17-06-2026/) |
| 2026-06-18 | 35 | 933 | 245 | 36 | 12 | [insp.cd](https://insp.cd/sitrep-n35-mvb_18-06-2026/) |
| 2026-06-19 | 36 | 956 | 247 | 23 | 2 | [insp.cd](https://insp.cd/sitrep-n36-mvb_19-06-2026/) |
| 2026-06-20 | 37 | 1003 | 254 | 47 | 7 | [insp.cd](https://insp.cd/sitrep-n37-mvb_20-06-2026/) |
| 2026-06-21 | 38 | 1048 | 267 | 45 | 13 | [insp.cd](https://insp.cd/sitrep-n38-mvb_21-06-2026/) |
| 2026-06-22 | 39 | 1094 | 277 | 46 | 10 | [insp.cd](https://insp.cd/sitrep-n39-mvb_22-06-2026/) |
| 2026-06-23 | 40 | 1118 | 291 | 24 | 14 | [insp.cd](https://insp.cd/sitrep-n040-mvb_23-06-2026/) |
| 2026-06-24 | 41 | 1155 | 304 | 37 | 13 | [insp.cd](https://insp.cd/sitrep-n041-mvb_24-06-2026/) |
| 2026-06-25 | 42 | 1203 | 321 | 48 | 17 | [insp.cd](https://insp.cd/sitrep-n042-mvb_25-06-2026/) |
| 2026-06-27 | 44 | 1274 | 360 | 47 | 12 | [insp.cd](https://insp.cd/sitrep-n044-mvb_27-06-2026/) |
| 2026-06-29 | 46 | 1333 | 399 | 26 | 8 | [insp.cd](https://insp.cd/sitrep-n046-mvb_29-06-2026/) |
| 2026-06-30 | 47 | 1406 | 438 | 73 | 25 | [insp.cd](https://insp.cd/sitrep-n047-mvb_30-06-2026/) |
| 2026-07-01 | 48 | 1460 | 452 | 54 | 9 | [insp.cd](https://insp.cd/sitrep-n48-mvb_01-07-2026/) |
| 2026-07-02 | 49 | 1502 | 473 | 42 | 7 | [insp.cd](https://insp.cd/sitrep-n049-mvb_02-07-2026/) |
| 2026-07-03 | 50 | 1528 | 492 | 26 | 9 | [insp.cd](https://insp.cd/sitrep-n050-mvb_02-07-2026/) |
| 2026-07-04 | 51 | 1561 | 506 | 33 | 6 | [insp.cd](https://insp.cd/sitrep-n051-mvb_04-07-2026/) |
| 2026-07-05 | 52 | 1624 | 521 | 63 | 8 | [insp.cd](https://insp.cd/sitrep-n052-mvb_05-07-2026/) |
| 2026-07-06 | 53 | 1708 | 580 | 84 | — | [insp.cd](https://insp.cd/sitrep-n053-mvb_06-07-2026/) |
| 2026-07-07 | 54 | 1759 | 600 | 51 | — | [insp.cd](https://insp.cd/sitrep-n054-mvb_07-07-2026/) |
| 2026-07-08 | 55 | 1792 | 625 | 33 | — | [insp.cd](https://insp.cd/sitrep-n055-mvb_08-07-2026/) |
| 2026-07-09 | 56 | 1830 | 648 | 38 | — | [insp.cd](https://insp.cd/sitrep-n056-mvb_09-07-2026/) |
| 2026-07-10 | 57 | 1873 | 672 | 43 | — | [insp.cd](https://insp.cd/sitrep-n057-mvb_10-07-2026/) |
| 2026-07-11 | 58 | 1926 | 702 | 53 | — | [insp.cd](https://insp.cd/sitrep-n058-mvb_11-07-2026/) |
| 2026-07-12 | 59 | 1963 | 718 | 31 | 10 | [insp.cd](https://insp.cd/wp-content/uploads/2026/07/SitRep-MVE-17-No59-Analytique-final-3.pdf) |
| 2026-07-13 | 60 | 2011 | 754 | 54 | — | [insp.cd](https://insp.cd/sitrep-n060-mvb-13-07-2026/) |
| 2026-07-14 | 61 | 2073 | 796 | 62 | 42 | [insp.cd](https://insp.cd/sitrep-n061-mvb_14-07-2026/) |
| 2026-07-15 | 62 | 2124 | 828 | 51 | 32 | [insp.cd](https://insp.cd/sitrep-n062-mvb_15-07-2026/) |
| 2026-07-17 | 64 | 2267 | 893 | 86 | 29 | [insp.cd](https://insp.cd/sitrep-n064-mvb_17-07-2026/) |
| 2026-07-18 | 65 | 2344 | 930 | 83 | 40 | [insp.cd](https://insp.cd/sitrep-n065-mvb_18-07-2026/) |
| 2026-07-19 | 66 | 2423 | 967 | 79 | 37 | [insp.cd](https://insp.cd/sitrep-n066-mvb_19-07-2026/) |
| 2026-07-20 | 67 | 2473 | 999 | 50 | 32 | [insp.cd](https://insp.cd/sitrep-n067-mvb_20-07-2026/) |
| 2026-07-21 | 68 | 2536 | 1033 | 63 | 34 | [insp.cd](https://insp.cd/wp-content/uploads/2026/07/SitRep_MVE_RDC_N%C2%B0_68_21-07-2026.pdf) |
| 2026-07-22 | 69 | 2905 | 1269 | — | — | [insp.cd](https://insp.cd/sitrep-n069-mvb_22-07-2026/) |
| 2026-07-23 | 70 | 2973 | 1309 | — | — | [insp.cd](https://insp.cd/sitrep-n070-mvb_23-07-2026/) |
| 2026-07-24 | 71 | 3075 | 1354 | — | — | [insp.cd](https://insp.cd/sitrep-n071-mvb_24-07-2026/) |
| 2026-07-25 | 72 | 3200 | 1405 | 125 | 51 | [insp.cd](https://insp.cd/wp-content/uploads/2026/07/SitRep_MVE_RDC_N%C2%B0_72_25-07-2026.pdf) |
| 2026-07-26 | 73 | 3262 | 1437 | 62 | 32 | [insp.cd](https://insp.cd/wp-content/uploads/2026/07/SitRep_MVE_RDC_N%C2%B0_73_26-07-2026.pdf) |
| 2026-07-27 | 74 | 3360 | 1487 | 98 | 50 | [insp.cd](https://insp.cd/wp-content/uploads/2026/07/SitRep_MVE_RDC_N%C2%B0_74_27-07-2026_OKKK.pdf) |
| 2026-07-30 | 77 | 3605 | 1587 | 73 | 24 | [insp.cd](https://insp.cd/wp-content/uploads/2026/08/SitRep_MVE_RDC_N_077_30-07-2026.pdf) |
| 2026-07-31 | 78 | 3674 | 1621 | 69 | 34 | [insp.cd](https://insp.cd/wp-content/uploads/2026/08/SitRep_MVE_RDC_N_078_31-07-2026.pdf) |
| 2026-08-01 | 79 | 3748 | 1657 | 74 | 36 | [insp.cd](https://insp.cd/wp-content/uploads/2026/08/SitRep_MVE_RDC_N_079_01-08-2026.pdf) |
| 2026-08-02 | 80 | 3802 | 1707 | 58 | 40 | [insp.cd](https://insp.cd/wp-content/uploads/2026/08/SitRep_MVE_RDC_N_080_02-08-2026.pdf) |
| 2026-08-03 | 81 | 3874 | 1751 | 72 | 44 | [insp.cd](https://insp.cd/wp-content/uploads/2026/08/SitRep_MVE_RDC_N_081_03_08_2026_VF.pdf) |
| 2026-08-04 | 82 | 3973 | 1801 | 99 | 52 | [insp.cd](https://insp.cd/wp-content/uploads/2026/08/SitRep_MVE_RDC_N_082_04_08_2026.pdf) |
| 2026-08-05 | 83 | 4053 | 1850 | 80 | 49 | [insp.cd](https://insp.cd/wp-content/uploads/2026/08/SitRep_MVE_RDC_N_083_05-08-2026.pdf) |
| 2026-08-06 | 84 | 4120 | 1887 | 67 | 42 | [insp.cd](https://insp.cd/wp-content/uploads/2026/08/SITREP_MVEBDB_084_060826.pdf) |
| 2026-08-07 | 85 | 4209 | 1916 | 89 | 29 | [insp.cd](https://insp.cd/wp-content/uploads/2026/08/SITREP_MVEBDB_085_070826_TK-2.pdf) |
| 2026-08-08 | 86 | 4294 | 1960 | 85 | 44 | [insp.cd](https://insp.cd/wp-content/uploads/2026/08/SITREP_MVEBDB_086_080826.pdf) |
| 2026-08-09 | 87 | 4381 | 2011 | 87 | 51 | [insp.cd](https://insp.cd/wp-content/uploads/2026/08/SITREP_MVEBDB_087_09_08_2026_VF.pdf) |
| 2026-08-10 | 88 | 4449 | 2061 | 68 | 50 | [insp.cd](https://insp.cd/wp-content/uploads/2026/08/SITREP_MVEBDB_088_10_08_2026_11.pdf) |
| 2026-08-11 | 89 | 4566 | 2128 | 118 | 67 | [insp.cd](https://insp.cd/wp-content/uploads/2026/08/SITREP_MVEBDB_089_11_08_2026.pdf) |
| 2026-08-12 | 90 | 4665 | 2184 | 100 | 53 | [insp.cd](https://insp.cd/wp-content/uploads/2026/08/SITREP_MVEBDB_090_12_08_2026.pdf) |
| 2026-08-13 | 91 | 4727 | 2214 | 62 | 30 | [insp.cd](https://insp.cd/wp-content/uploads/2026/08/91.pdf) |
| 2026-08-14 | 92 | 4843 | 2272 | 116 | 58 | [insp.cd](https://insp.cd/wp-content/uploads/2026/08/SitRep_MVEBDB_092_14_08_2026.pdf) |
| 2026-08-15 | 93 | 4945 | 2325 | 101 | 53 | [insp.cd](https://insp.cd/wp-content/uploads/2026/08/SitRep_MVEBDB_093_15_08_2026.pdf) |
| 2026-08-16 | 94 | 5021 | 2378 | 76 | 53 | [insp.cd](https://insp.cd/wp-content/uploads/2026/08/94.pdf) |
| 2026-08-17 | 95 | 5105 | 2420 | 84 | 42 | [insp.cd](https://insp.cd/wp-content/uploads/2026/08/95.pdf) |
| 2026-08-18 | 96 | 5208 | 2476 | 103 | 56 | [insp.cd](https://insp.cd/wp-content/uploads/2026/08/96.pdf) |
| 2026-08-19 | 97 | 5290 | 2516 | 81 | 40 | [insp.cd](https://insp.cd/wp-content/uploads/2026/08/97-1.pdf) |
| 2026-08-20 | 98 | 5375 | 2557 | 85 | 41 | [insp.cd](https://insp.cd/wp-content/uploads/2026/08/SitRep_MVEBDB_098_20_08_2026_VF_98.pdf) |
| 2026-08-21 | 99 | 5458 | 2606 | 83 | 49 | [insp.cd](https://insp.cd/wp-content/uploads/2026/08/99.pdf) |
| 2026-08-22 | 100 | 5514 | 2642 | 55 | 36 | [insp.cd](https://insp.cd/wp-content/uploads/2026/08/100.pdf) |
| 2026-08-23 | 101 | 5584 | 2680 | 70 | 38 | [insp.cd](https://insp.cd/wp-content/uploads/2026/08/SitRep_MVEBDB_101_23_08_2026.pdf) |
| 2026-08-24 | 102 | 5656 | 2715 | 72 | 35 | [insp.cd](https://insp.cd/wp-content/uploads/2026/08/SitRep_MVEBDB_102_24_08_2026.pdf) |
| 2026-08-25 | 103 | 5713 | 2744 | 57 | 29 | [insp.cd](https://insp.cd/wp-content/uploads/2026/08/SitRep_MVEBDB_103_25_08_2026.pdf) |
| 2026-08-26 | 104 | 5794 | 2786 | 81 | 42 | [insp.cd](https://insp.cd/wp-content/uploads/2026/08/SitRep_MVEBDB_104_26_08_2026.pdf) |
| 2026-08-27 | 105 | 5863 | 2824 | 69 | 38 | [insp.cd](https://insp.cd/wp-content/uploads/2026/08/SitRep_MVEBDB_105_27_08_2026.pdf) |
| 2026-08-28 | 106 | 5945 | 2862 | 82 | 38 | [insp.cd](https://insp.cd/wp-content/uploads/2026/08/SitRep_MVEBDB_106_28_08_2026.pdf) |
| 2026-08-29 | 107 | 6041 | 2911 | 96 | 49 | [insp.cd](https://insp.cd/wp-content/uploads/2026/08/SitRep_MVEBDB_107_29_08_2026.pdf) |
| 2026-08-30 | 108 | 6100 | 2950 | 59 | 39 | [insp.cd](https://insp.cd/wp-content/uploads/2026/08/SitRep_MVEBDB_108_30_08_2026.pdf) |

## Zdroje a omezení

Řada je vytvořena z oficiálních SitRepů DRK INSP/COUSP pro aktuální 17. epidemii onemocnění ebolou v DRK (v originále MVB, maladie à virus Bundibugyo). Hodnoty pro Ugandu nejsou do denní řady zařazeny, protože veřejný ugandský přehled neposkytuje stejným způsobem dohledatelnou historickou denní řadu. Dashboard se stavem k 28. červenci uvádí pro Ugandu odděleně 20 potvrzených případů, 2 úmrtí, 18 uzdravených, 0 aktuálních hospitalizací, 0 aktivně sledovaných kontaktů a 821 kontaktů s dokončeným 21denním sledováním.

SitRepy 86–108 přímo uvádějí denní hodnoty. SitRep 89 hlásí 118 případů, zatímco kumulativní součet roste o 117 kvůli průběžné harmonizaci; SitRep 93 hlásí 101 případů, ale kumulativní součet roste o 102 kvůli dříve opomenutému případu. SitRepy 107–108 přímo hlásí 96/49 a 59/39 případů/úmrtí; u úmrtí jde o součet komunitních úmrtí a potvrzených úmrtí v léčebných centrech. Počet zasažených zón zůstává 60. Denní sloupce přebírají přímo hlášené hodnoty, nikoli rozdíly kumulativních součtů. Starší zdrojová omezení a rozpory jsou podrobně popsány v přiloženém souboru README.

Kontrolní zdroje: [DRK INSP/COUSP SitRep 108](https://insp.cd/wp-content/uploads/2026/08/SitRep_MVEBDB_108_30_08_2026.pdf), [SitRep 107](https://insp.cd/wp-content/uploads/2026/08/SitRep_MVEBDB_107_29_08_2026.pdf), [SitRep 106](https://insp.cd/wp-content/uploads/2026/08/SitRep_MVEBDB_106_28_08_2026.pdf), [ECDC stránka k ohnisku](https://www.ecdc.europa.eu/en/ebola-outbreak-democratic-republic-congo-and-uganda), [Uganda Ministry of Health dashboard](https://evd-daily.health.go.ug/) a [WHO denní epidemiologická aktualizace 20260831](https://www.who.int/emergencies/alert-and-response). Jednotlivé SitRep odkazy jsou uvedeny v tabulce.

FAIR · datová vrstva

## Data ke grafu ke stažení

Tabulka použitá v grafu je dostupná také jako samostatný soubor. Každý řádek obsahuje stav k datu, číslo SitRepu a odkaz na zdroj; chybějící hodnoty se nedopočítávají.

Stav k datu
:   30. 8. 2026

Kurace
:   86 dohledatelných bodů · revize 1. 9. 2026

Formát
:   CSV v UTF-8 + JSON Schema

Licence
:   [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) pro původní kuraci

[Stáhnout CSV](https://titan.img.cas.cz/ebola/data/drc-bdbv-sitrep-timeseries.csv)
[Datový slovník](https://titan.img.cas.cz/ebola/data/schema.json)
[Metadata datové řady](https://titan.img.cas.cz/ebola/metadata/graf-vyvoj.dataset.jsonld)
[Původ dat a omezení](https://titan.img.cas.cz/ebola/data/README.md)

CSV obsahuje stejnou řadu jako graf; automatická kontrola porovnává všech 86 řádků s daty vloženými do stránky. Licence se vztahuje na původní kuraci, nikoli na odkazované zdrojové dokumenty.