---
title: "Chci přispět"
translationKey: contribute
description: "Jak na portál přispět vlastními daty: žádost, nahrání, formát souboru a co se s daty stane."
menu:
  footer_about:
    name: Chci přispět
    weight: 6
layout: about_navbar
# Czech and English, 1:1 (en/about/contribute.md, decided 24 Oct 2026).
# Carries BOTH intake forms, the template description and the machine-upload
# instructions (decided 22 Oct 2026:
# forms and templates belong here, not in /docs/). Describes the intake built in
# backend/website-be/app/intake (TODO D15, I34) — keep steps, limits and the
# template table in line with it (app/intake/templates.py).
---

{{< intake-status >}}

Máte agregovaná data o infekčních nemocech nebo patogenech v Česku — počty pozitivních vzorků,
hlášených případů, výsledky monitoringu — a chcete, aby byla vidět na portálu?

**Jak na to:** [1. Požádejte o zapojení](#zadost) → schválíme vás a pošleme klíč →
[2. Nahrajte data](#nahrani) ve [správném formátu](#sablona).

## Co přijímáme

- Soubory **CSV** s **agregovanými** údaji: jeden řádek = období × území × ukazatel × hodnota,
  případně se souhrnnými statistikami (např. intervaly spolehlivosti). Přesný formát je
  [níže](#sablona).
- **Nepřijímáme osobní ani citlivé údaje** — nic, podle čeho by šlo poznat konkrétního člověka.

## 1. Požádejte o zapojení {#zadost}

Napište, kdo jste, jaká data máte, odkud pocházejí a jak často se mění. Žádost osobně posoudí
autoři portálu a ozvou se vám e-mailem. Po schválení vám pošleme **jednorázový odkaz**, přes který
si převezmete **osobní klíč** pro nahrávání. Odkaz platí 72 hodin a funguje jen jednou; klíč se
zobrazí jen vám a znovu ho ukázat nejde. Pokud jste v žádosti uvedli, že jde o jednorázový
příspěvek, klíč platí pro jedno přijaté nahrání. Jinak platí i pro další data v čase.

{{< intake-request >}}

## 2. Nahrajte data {#nahrani}

Pro schválené poskytovatele.

Limity jednoho nahrání: soubor CSV nejvýše 5 MB, celé nahrání nejvýše 20 MB, nejvýše 50 souborů
CSV. Archiv smí obsahovat jen soubory CSV.

{{< intake-upload >}}

Pravidelné odesílání dat lze nastavit pomocí klíče i automatizovaně: [návod pro strojové nahrávání](#strojove-nahravani).

### Jak má soubor vypadat — šablona `agregace-v1` {#sablona}

Jeden řádek = jedno období × jedno území × jeden ukazatel. Kódování **UTF-8**, oddělovač čárka
nebo středník, desetinná tečka nebo čárka.

| Sloupec | Povinný | Co obsahuje |
|---|---|---|
| `obdobi` | ano | `2026`, `2026-09`, `2026-09-28` nebo ISO týden `2026-W40` |
| `uzemi` | ano | `CZ` nebo kód kraje NUTS3 (`CZ010` Praha … `CZ080` Moravskoslezský) |
| `ukazatel` | ano | co se měří, např. `pozitivni_vzorky` |
| `hodnota` | ano | číslo |
| `jednotka` | ne | např. `pocet`, `procento`, `na_100000` |
| `ci_dolni`, `ci_horni` | ne | meze intervalu spolehlivosti |
| `poznamka` | ne | volný text |

Ukázka:

```
obdobi,uzemi,ukazatel,hodnota,jednotka
2026-W40,CZ010,pozitivni_vzorky,12,pocet
2026-W40,CZ,pozitivni_vzorky,140,pocet
```

Tip: v Excelu ukládejte přes **Uložit jako → CSV UTF-8 (s oddělovači)**. Běžné „CSV“ z českého
Excelu je v jiném kódování a kontrola ho odmítne.

### Strojové nahrávání {#strojove-nahravani}

Formulář výše je jen tenká vrstva nad rozhraním (API), které můžete volat přímo ze skriptu,
například každý týden po exportu z vašeho systému. Platí pro něj stejný klíč, stejná kontrola
i stejné prohlášení.

```bash
curl --fail-with-body \
  -H "Authorization: Bearer $PP_INTAKE_KEY" \
  -F file=@kraje_2026-W43.csv \
  -F file=@okresy_2026-W43.csv \
  -F declaration=prohlaseni-v1 \
  {{< intake-endpoint >}}
```

Pole `file` můžete uvést vícekrát, nebo poslat jeden archiv (`-F file=@export.zip`). Hodnotou
`declaration=prohlaseni-v1` potvrzujete u každého nahrání totéž, co zaškrtávací pole ve formuláři:

> Prohlašuji, že jsem oprávněn(a) tato data za svou instituci poskytnout, že neobsahují osobní
> údaje a že souhlasím s jejich zpracováním a zveřejněním na portálu Pathogen Portal CZ pod licencí
> Creative Commons Uveďte původ 4.0 (CC BY 4.0) s uvedením naší instituce jako zdroje. Beru na
> vědomí, že takto zveřejněná data může kdokoli dál používat, pokud uvede zdroj. O opravu nebo
> stažení dat můžeme kdykoli požádat.

| Odpověď | Co znamená |
|---|---|
| `200`, `"status": "accepted"` | vše prošlo kontrolou a je uložené |
| `200`, `"status": "duplicate"` | přesně tytéž soubory jsme už přijali, nový záznam nevzniká |
| `422`, `"status": "rejected"` | chyby jsou v `report.issues` (soubor, řádek, sloupec, popis); opravte a pošlete znovu |
| `422` s `detail` | chybí prohlášení nebo je neznámá šablona |
| `401` | chybí nebo je neplatný klíč |
| `429` | víc než 50 nahrání za 24 hodin |

Klíč nedávejte do kódu ani do repozitáře; uložte ho do proměnné prostředí nebo do správce
tajných údajů. Kdyby unikl, dejte nám vědět: zneplatníme ho a vydáme nový.

<!--
## Co se s daty stane {#co-se-s-daty-stane}

1. **Okamžitá kontrola.** Každý soubor se hned po nahrání zkontroluje (formát, povinné sloupce, kódy
   území, čísla, duplicitní řádky). Když něco nesedí, uvidíte číslo řádku a sloupec k opravě —
   takový soubor do dat nepostoupí.
2. **Uložení.** Přijatý soubor uložíme na serveru portálu v datovém centru CESNET, spolu s
   protokolem kontroly a záznamem o tom, kdy a kdo potvrdil prohlášení. Stejný soubor poslaný
   znovu poznáme a podruhé neukládáme.
3. **Další postup.** Nahraná data se na portálu automaticky nezveřejňují. Jak s nimi naložíme,
   s vámi domluvíme.
4. **Oprava a smazání.** O opravu nebo smazání uložených dat můžete kdykoli požádat.

Nahrané soubory nikomu dalšímu nepředáváme. Jak
zacházíme s vašimi kontaktními údaji, popisují zásady zpracování osobních údajů (odkaz v patičce).
-->

## Kontakt

Máte dotaz? Napište nám.
