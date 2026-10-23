---
title: "Stažení dat a licence"
description: "Kde si data stáhnout, jak jsou soubory uspořádané a pod jakou licencí jsou."
weight: 30
---

## Datové soubory

Každý graf na portálu se kreslí ze souboru JSON, který si můžete stáhnout. Seznam souborů je na
stránce [Data a licence](/about/data/). Soubory obsahují **zpracovaná data pro grafy**
(agregace, přepočty na obyvatele, výběr řad), ne surová data; pro vlastní analýzu použijte
původní zdroj.

- Adresy souborů se nemění, obsah se přepisuje při každé aktualizaci dat.
- **Starší verze souborů portál nearchivuje.** Pokud data použijete, uložte si soubor a uveďte
  datum stažení.
- Strukturu souborů popisuje dokumentace pro vývojáře:
  [Formát datových souborů](/docs/vyvojari/format-dat/).

## Strojově čitelné katalogy

- [`sources.json`](/about/data/sources.json): všechny zdroje dat s vydavatelem, licencí,
  pokrytím, frekvencí a omezeními.
- [Katalog podle DCAT-AP-CZ](/dcat/katalog.jsonld): datové sady, které vznikly zpracováním na
  portálu.
- Stránky panelů obsahují metadata schema.org/Dataset (JSON-LD).

## Licence

Texty a zpracovaná data portálu jsou pod licencí
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.cs). Převzatá data mají licenci
původního zdroje, uvedenou v [katalogu zdrojů](/about/data/). Kód portálu je pod licencí MIT.
