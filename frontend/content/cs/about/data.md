---
title: Data a licence
description: "Odkud Pathogen Portal CZ bere data, pod jakou licencí, co z nich nejde vyčíst a jak si data stáhnout."
menu:
  footer_about:
    name: Data a licence
    weight: 4
layout: about_navbar
# Besides the human-readable page, also emit the machine-readable catalogue: /about/data/sources.json
outputs: ["html", "sources"]
---

Portál nesbírá primární data. Přebírá **otevřená data veřejných institucí**, zpracovává je
a u každého grafu uvádí zdroj. Tato stránka shrnuje použité zdroje, jejich licence, frekvenci
aktualizace a **známá omezení**.

Závazný je vždy původní zdroj. Liší-li se hodnota na portálu od zdroje, platí údaj zdroje.
Rozdíl prosím [nahlaste](#nahlasit-chybu).

## Katalog zdrojů

{{< data-catalogue >}}

## Licence

- **Texty, grafy a zpracování na portálu:** [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) —
  lze je sdílet a upravovat za podmínky uvedení autora, licence a případných změn.
- **Převzatá data:** platí licence původního zdroje, uvedená v katalogu. Pokud zdroj
  licenci neuvádí, katalog to výslovně uvádí. Podmínky dalšího užití je nutné ověřit
  u poskytovatele.
- **Kód:** licence [MIT](https://opensource.org/license/mit); zdrojový kód webu (pathogensportal) i zpracování dat (pathogensportal-db) je veřejný na
  [GitHubu](https://github.com/elixir-cz-pathogens).

## Strojově čitelná data

Každý graf se kreslí ze statického souboru JSON, který si můžete stáhnout. Adresy souborů
se nemění, obsah se přepisuje při každé aktualizaci dat. Datum poslední aktualizace je uvedeno
u panelu. Starší verze souborů portál nearchivuje.

{{< data-files >}}

Soubory jsou **zpracovaná data pro grafy**, ne surová data — agregace, přepočty na obyvatele
a výběr řad už v nich jsou. Pro vlastní analýzu sáhněte po původním zdroji.

Katalog zdrojů je k dispozici i ve strojově čitelné podobě ([`sources.json`](sources.json)),
včetně pole `limits` s popisem omezení dat. Stránky panelů obsahují metadata
[schema.org/Dataset](https://schema.org/Dataset) (JSON-LD).

### Katalog podle DCAT-AP-CZ

Data, která **vznikla zpracováním na portálu**, popisuje i katalog podle otevřené formální normy
[Rozhraní katalogů otevřených dat](https://ofn.gov.cz/rozhraní-katalogů-otevřených-dat/2021-01-11/):
[`/dcat/katalog.jsonld`](/dcat/katalog.jsonld). Odkazuje na čtyři datové sady — prahy intenzity
chřipkové sezóny, signály detekce anomálií, týdenní záchyty respiračních virů a odvozené incidence
infekčních nemocí.

Přebíraná data v tomto katalogu **nejsou**. Publikovali je jejich původci (ÚZIS, SZÚ, MZČR, ČSÚ,
WHO, ECDC) a najdete je v [Národním katalogu otevřených dat](https://data.gov.cz); portál na ně
odkazuje v přehledu výš.

{{% if-intake %}}
## Poskytnout data {#poskytnout-data}

Portál přijímá i data přímo od institucí: agregované soubory CSV bez osobních údajů. Kdo chce
přispět, pošle [žádost](/about/prispet/#zadost); po schválení dostane klíč a data nahrává
[ručně](/about/prispet/#nahrani) nebo [automaticky ze svého systému](/about/prispet/#strojove-nahravani).
Každý soubor se hned po nahrání automaticky zkontroluje. Celý postup popisuje stránka
[Chci přispět](/about/prispet/).
{{% /if-intake %}}

## Nahlásit chybu {#nahlasit-chybu}

Chyby v datech, nefunkční grafy a nejasné formulace hlaste e-mailem na
[hpaces@img.cas.cz](mailto:hpaces@img.cas.cz), nebo jako issue na GitHubu:
k webu v repozitáři [pathogensportal](https://github.com/elixir-cz-pathogens/pathogensportal/issues),
k datům a výpočtům v [pathogensportal-db](https://github.com/elixir-cz-pathogens/pathogensportal-db/issues).

## Omezení portálu

- **Nepřijímá a nezpřístupňuje citlivá data.** Všechno, co tu je, jsou veřejné agregované
  údaje bez osobních informací. Řízený přístup k neveřejným datům portál zatím nenabízí.
- **Není úřední zdroj.** Pro rozhodování v ochraně veřejného zdraví jsou závazná data
  a stanoviska příslušných institucí (MZČR, SZÚ, ÚZIS, KHS).
