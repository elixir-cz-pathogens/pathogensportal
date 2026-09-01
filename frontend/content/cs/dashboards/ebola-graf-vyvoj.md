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

## Kumulativní úmrtí mezi potvrzenými případy

Osa X: stav k datu; značky po týdnech, ukotvené k pondělí. Osa Y: kumulativní úmrtí mezi potvrzenými případy v kroku 500. Rozsah os se rozšíří až po přechodu do dalšího kalendářního týdne nebo po překročení dalšího násobku 500.

Kumulativní úmrtí mezi potvrzenými případy

## Tabulka hodnot

| Stav k datu | SitRep | Kumulativně potvrzené případy | Kumulativní úmrtí mezi potvrzenými případy | Nově hlášené potvrzené případy | Nově hlášená úmrtí mezi potvrzenými případy | Zdroj |
| --- | --- | --- | --- | --- | --- | --- |

Interaktivní grafy a tabulka hodnot vyžadují JavaScript. Úplná datová řada je dostupná v souboru [CSV](https://titan.img.cas.cz/ebola/data/drc-bdbv-sitrep-timeseries.csv).

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