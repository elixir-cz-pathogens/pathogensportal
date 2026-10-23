---
title: "Jak číst panely"
description: "Datum aktualizace, původ dat, absolutní počty a přepočty, tabulka u grafu a ikonky na kartách."
weight: 10
---

## Datum aktualizace

U každého panelu je uvedeno, jak aktuální jsou jeho data. Podle typu dat se zobrazuje jeden
z těchto údajů:

| Údaj | Význam |
|---|---|
| **Aktualizace: 16. 10. 2026, 05:56 UTC** | Kdy portál naposledy zpracoval data ze zdroje. Neříká, za jaké období data jsou. |
| **Data k 13. 9. 2026 (KT 37/26)** | Poslední den nebo kalendářní týden, který data pokrývají. |
| **Data k 12/2025** | Poslední měsíc, který data pokrývají. |
| **Data za rok 2025** | Data jsou roční; uvedený je poslední dostupný rok. |

Datum se vždy čte přímo z datového souboru, ne z data úpravy stránky.

Zpracování může proběhnout dnes a přesto obsahovat data za starší období. Například otevřený
export dat ISIN zatím končí prosincem 2025, takže [Signály](/signals/) vyhodnocují prosinec 2025,
i když je údaj „Aktualizace“ novější. Jak často se mění jednotlivé zdroje, shrnuje stránka
[Aktuálnost dat](/docs/ctenari/aktualnost-dat/).

## Původ dat

Každý panel nese štítek s původem dat: **Veřejný zdroj**, **Vlastní analýza** nebo
**Vytvořeno s pomocí AI**. Význam štítků je popsán na stránce
[O portálu](/about/#odkud-data-pocházejí).

## Absolutní počty a přepočet na obyvatele

Poznámka pod každým grafem uvádí, zda jde o **absolutní počty**, nebo o **přepočet na
100 000 obyvatel** (incidenci). Ke srovnání krajů nebo období s různou velikostí populace
používejte přepočtené hodnoty; absolutní počty odrážejí především velikost populace.
Víc o tom, jak data číst, je na stránce [Jak data interpretovat](/docs/ctenari/interpretace/).

## Tabulka a podrobné hodnoty

Tlačítko **Tabulka** pod grafem zobrazí hodnoty, ze kterých je graf vykreslen. Přesnou hodnotu
bodu nebo kraje zobrazíte najetím myší, na mobilu klepnutím. Datové soubory ke stažení popisuje
stránka [Stažení dat a licence](/docs/ctenari/citace-a-data/).

## Ikonky na kartách

| Ikonka | Kde | Význam |
|---|---|---|
| <i class="bi bi-robot"></i> | vpravo nahoře | obsah vznikl s pomocí AI a prošel odbornou revizí |
| <i class="bi bi-box-arrow-up-right"></i> | vpravo nahoře | panel se otevře na jiném webu |
| ✦ AI | vpravo dole | ilustraci vygenerovala AI (týká se obrázku, ne dat) |
