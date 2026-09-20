---
title: Data a citace
description: "Odkud Pathogen Portal CZ bere data, pod jakou licencí, co z nich nejde vyčíst a jak si data stáhnout."
menu:
  footer_about:
    name: Data a citace
    weight: 4
layout: about_navbar
---

## Data a citace

Portál sám žádná primární data nesbírá. Přebírá **otevřená data veřejných institucí**,
zpracovává je a vykresluje — a u každého grafu říká, odkud čísla jsou. Tahle stránka to
shrnuje na jednom místě: co používáme, pod jakou licencí, jak často se to mění a hlavně
**co z těch dat vyčíst nejde**.

Závazný je vždy původní zdroj. Když se číslo na portálu liší od čísla u zdroje, platí zdroj —
a budeme rádi, když nám o tom [dáte vědět](#nahlasit-chybu).

## Katalog zdrojů

{{< data-catalogue >}}

## Licence

- **Texty, grafy a zpracování na portálu:** [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) —
  můžete je šířit a upravovat, když uvedete zdroj.
- **Převzatá data:** platí licence původního zdroje, uvedená v katalogu. Kde ji zdroj
  neuvádí, píšeme to tak — než taková data použijete dál, ověřte si podmínky u něj.
- **Kód:** oba repozitáře jsou veřejné na [GitHubu](https://github.com/elixir-cz-pathogens).

## Strojově čitelná data

Každý graf se kreslí ze statického souboru JSON, který si můžete stáhnout. Adresy jsou
stabilní; obsah se přepisuje s každým během datové pipeline a datum posledního běhu
je u dashboardu v řádku „Aktualizace".

{{< data-files >}}

Soubory jsou **zpracovaná data pro grafy**, ne surová data — agregace, přepočty na obyvatele
a výběr řad už v nich jsou. Pro vlastní analýzu sáhněte po původním zdroji.

## Nahlásit chybu {#nahlasit-chybu}

Našli jste číslo, které nesedí se zdrojem, rozbitý graf nebo nejasnou formulaci?
Napište na [hpaces@img.cas.cz](mailto:hpaces@img.cas.cz), nebo založte issue:
k webu v repozitáři [pathogensportal](https://github.com/elixir-cz-pathogens/pathogensportal/issues),
k datům a výpočtům v [pathogensportal-db](https://github.com/elixir-cz-pathogens/pathogensportal-db/issues).

## Co portál nedělá

- **Nepřijímá a nezpřístupňuje citlivá data.** Všechno, co tu je, jsou veřejné agregované
  údaje bez osobních informací. Řízený přístup k neveřejným datům portál zatím nenabízí.
- **Není úřední zdroj.** Pro rozhodování v ochraně veřejného zdraví jsou závazná data
  a stanoviska příslušných institucí (MZČR, SZÚ, ÚZIS, KHS).
