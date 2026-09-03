# Ebola dashboard z AI agenta — co má agent dělat

> **Note on language.** This project's internal material is English by convention; this file is
> deliberately Czech because it is operating instructions for a named colleague who will act on them.
> Same exception as the CESNET support e-mail.

Pro: **Michaela Liegertová** · Sepsáno 3. 9. 2026

---

## Co se mění

**Dnes:** agent vyrobí ZIP → ZIP se nahraje na Drive → server ho jednou za hodinu stáhne, python skript
z něj udělá Markdown stránky a grafy → čeká se, až někdo udělá release na produkci.

**Nově:** agent rovnou vytvoří **hotové stránky a data grafů**, otevře pull request, a člověk ho jen
zkontroluje a schválí. Odpadá ZIP, Drive i převod na Markdown.

⚠️ **Jedna věc se nemění a je nejdůležitější:** obsah na produkci pouští **člověk**, ne agent. Agent
připraví, člověk přečte a schválí. To je celý smysl toho postupu — kontrola halucinací.

---

## 1. Co má agent vygenerovat

### Stránky — 8 souborů, formát `.html`

Do `frontend/content/cs/dashboards/`:

| soubor | stránka |
|---|---|
| `ebola-bundibugyo-2026.html` | Aktuální stav |
| `ebola-cesko.html` | Český kontext |
| `ebola-virus.html` | Ebolaviry |
| `ebola-lecba-vakciny.html` | Léčba a vakcíny |
| `ebola-predchozi-epidemie.html` | Minulé epidemie |
| `ebola-dezinformace.html` | Dezinformace |
| `ebola-zdroje.html` | Zdroje |
| `ebola-graf-vyvoj.html` | Graf vývoje |

⛔ **Každý soubor musí začínat hlavičkou** — bez ní ho Hugo nezobrazí:

```
---
title: "Ebola BDBV 2026 — Český kontext"
description: "Sekce situačního reportu: Český kontext. Zdroj: IMG AV ČR / UJEP."
tags: ["ebola", "epidemiologie", "IMG AV ČR", "Afrika"]
data_source: 'Jan Pačes & Michaela Liegertová — <a href="https://www.img.cas.cz" target="_blank">IMG AV ČR</a> · Licence CC BY 4.0'
build:
  list: never
  render: always
---
```

Pod hlavičkou už je **normální HTML** — odstavce, tabulky, nadpisy.

### Data grafů — JSON, ne JavaScript

Do `frontend/static/data/charts/`: `ebola_timeseries.json`, `ebola_daily.json`,
`ebola_deaths_cumulative.json`, `ebola_summary.json`, `ebola_trajectories.json`.

Graf se do stránky vloží **odkazem na ta data**, ne vlastním kódem:

```
{{< chart id="ebolaDaily" src="/data/charts/ebola_daily.json" type="bar"
   title="Ebola BDBV 2026 — nově hlášené případy za den (DRC)" height="320"
   note="Vysvětlivka pod grafem." >}}
```

*(Ověřeno 3. 9. 2026, že tohle v `.html` stránkách funguje stejně jako v Markdownu.)*

---

## 2. Co agent nesmí

- ⛔ **Žádný `<script>`, `<style>` ani `<iframe>`.** Ani vlastní JavaScript ke grafům. Portál grafy
  vykresluje sám ze zaslaných dat — proto se posílá JSON, ne kód. Cizí kód na veřejném zdravotnickém
  webu je jiná kategorie rizika než chybné číslo: **chybné číslo člověk při revizi uvidí, chybný skript ne.**
- ⛔ **Nenechávat `.md` a `.html` se stejným názvem.** Když existuje `ebola-cesko.md` i
  `ebola-cesko.html`, Hugo si jeden vybere a **nikde to neohlásí** — na tomhle webu už jednou dva týdny
  visela stará stránka. **Starý `.md` soubor musí být smazaný ve stejném commitu**, kterým přibude `.html`.
- ⛔ **Neupravovat nic jiného** než těch 8 stránek a data grafů. Ostatní dashboardy (chřipka, COVID,
  infekční nemoci) mají vlastní zdroje.

---

## 3. Jak to agent odešle

```
větev:   content/ebola-2026-09-03          (vždy začíná content/)
commit:  content: aktualizace ebola dashboardu k 3. 9. 2026
PR do:   main
```

⚠️ **Ta tři jména nejsou libovolná.** Podle předpony `content/` pozná automatika, že jde o obsahový PR,
a jen u něj postaví náhled a osloví revidenta. Technické PR (uvolnění dat, změny konfigurace) míří na
stejné soubory, takže rozlišit je jinak nejde. Předpona `content:` v commitu je zase podmínka, aby PR
vůbec šel sloučit.

---

## 4. Co se stane potom — bez zásahu

1. Automatika **postaví náhled** a do PR napíše odkaz, např.
   `https://pathogens-dev.vm.cesnet.cz/preview/pr-123/`
2. **Osloví revidenta** — přijde mu e-mail od GitHubu.
3. Revident si **otevře odkaz a přečte stránky tak, jak budou publikované** — ne diff. Kontroluje
   věcnou správnost: čísla, data, tvrzení.
4. Když je to v pořádku: **Files changed → Review changes → Approve**, pak **Merge**.
5. Po sloučení se to samo nasadí na produkci, zhruba **do dvou minut**.

Když se něco pokazí, jde nasazení vrátit zpět **během vteřiny** — starší verze webu zůstávají na serveru.

---

## 5. Kontrolní seznam pro agenta

- [ ] 8 souborů `.html` v `frontend/content/cs/dashboards/`, každý s hlavičkou
- [ ] odpovídající `.md` soubory smazané **ve stejném commitu**
- [ ] data grafů jako `.json` v `frontend/static/data/charts/`
- [ ] grafy vložené přes `{{< chart … >}}`, žádný vlastní JavaScript
- [ ] nikde `<script>`, `<style>`, `<iframe>`
- [ ] větev `content/ebola-RRRR-MM-DD`, commit `content: …`, PR do `main`

---

## Co ještě není hotové (stav k 3. 9. 2026)

- ⏳ **Revident zatím není nastavený.** Náhled se postaví, ale nikoho automaticky neosloví, dokud
  nebude v repozitáři nastavená proměnná `CONTENT_REVIEWER` (a dokud daný člověk nebude mít účet na
  GitHubu s právem zápisu).
- ⏳ **Starý postup zatím běží souběžně.** Než se přejde na nový, musí se vypnout generování stránek
  ze ZIPu — jinak by hodinová automatika přepsala to, co agent vytvořil, a **nikde by to nehlásila.**
