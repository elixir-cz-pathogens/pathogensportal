---
title: "Přidání nebo úprava panelu"
description: "Front matter panelu, shortcody a katalog zdrojů."
weight: 40
---

Panel je stránka v `frontend/content/<jazyk>/dashboards/`. Musí existovat v češtině
(`content/cs/`) i v angličtině (`content/en/`), jinak druhé jazykové verzi chybí.

## Front matter

| Pole | Povinné | Význam |
|---|---|---|
| `title`, `description` | ano | název a perex (perex se zobrazuje na kartě) |
| `origin` | ano | `aggregated` (veřejný zdroj), `own` (vlastní analýza) nebo `ai-assisted`; bez něj se štítek nezobrazí |
| `data_source` | ano | HTML s odkazy na zdroje (řádek „Zdroj“) |
| `update_from` + `update_read` | ano, pokud jde o data z JSON | soubor a způsob čtení data: `stamp`, `period-end`, `week`, `month`, `year` |
| `update_freq` | jen u externích panelů | textový popis frekvence |
| `data_as_of` | jen u uzavřených reportů | nesmí se kombinovat s `update_from` (build selže) |
| `redirect_url` | ne | karta vede rovnou na externí web a stránka se přesměruje |
| `tags`, `image`, `highlight` | ne | témata, obrázek karty, zobrazení na úvodní stránce |
| `build.list: never` | ne | podstránka, která se nezobrazí v přehledu panelů |

⛔ **Datum aktualizace nikdy nepište do front matter ručně.** Čte se z dat (`update_from`), jinak
zastará.

## Shortcody

Nejčastější: `chart` (graf), `region-map` (mapa krajů), `stat-card`, `callout`, `method` /
`method-part` (rozbalovací metodika), `nav-pills` (navigace mezi panely jedné skupiny). Každá
šablona v `frontend/layouts/shortcodes/` začíná komentářem s návodem k použití.

```
{{</* chart id="fluWeekly" src="/data/charts/flu_weekly.json" type="line"
     title="Týdenní detekce" height="340" note="Absolutní počty, celá ČR." */>}}
```

Poznámka `note` u grafu má vždy říct, zda jde o absolutní počty, nebo přepočet.

## Katalog zdrojů

Nový zdroj dat se zapisuje do `frontend/data/sources.yaml` (vydavatel, licence, pokrytí,
frekvence, omezení a stránky, které ho používají). Z tohoto souboru vzniká
[katalog zdrojů](/about/data/), `sources.json` i tabulka [Aktuálnost dat](/docs/ctenari/aktualnost-dat/).
