---
title: "Jazykové modely (LLM)"
translationKey: docs-llm
description: "Jak je portál napojený na jazykový model, co dnes běží a jak na tom stavět."
weight: 55
---

## Stručně

- Portál má přístup k jazykovému modelu přes národní službu **e-INFRA CZ (CERIT-SC)**.
- Model se volá **jen z GitHub Actions**, ne ze serveru a ne z prohlížeče návštěvníka.
- **Nic, co model napíše, se nepublikuje samo.** Každý výstup přichází jako pull request do `main`
  a na web se dostane až po schválení člověkem.
- Dnes je hotové napojení a zkušební workflow. První skutečné použití (texty ke grafům, viz níže)
  se teprve staví.

## Jak je to zapojené

```
GitHub Actions (workflow na větvi main)
  │  1. dostane klíč z prostředí „llm“
  │  2. pošle modelu data a zadání
  ▼
e-INFRA CZ (CERIT-SC) ── jazykový model ──► vrátí text
  │
  ▼
GitHub Actions
  │  3. zapíše text do obsahu webu
  │  4. otevře pull request do main
  ▼
náhled na stagingu → schválení recenzentem → sloučení → nasazení
```

Je to stejná cesta, jakou už dnes chodí situační reporty: obsahový PR, náhled pod
`/preview/pr-<číslo>/`, schválení, nasazení (viz [Vydávání a nasazení](/docs/vyvojari/vydavani/)).

## Poskytovatel a model

| | |
|---|---|
| Služba | e-INFRA CZ, AI-as-a-service provozovaná CERIT-SC; modely běží na jejich hardwaru v ČR |
| Rozhraní | kompatibilní s OpenAI API (`/v1/models`, `/v1/chat/completions`), autorizace `Bearer` |
| Model | `mistral-medium-3.5` (Mistral AI) |
| Časový limit | 30 minut na jeden požadavek bez streamování |
| Dokumentace | [katalog modelů](https://docs.cerit-sc.cz/en/docs/ai-as-a-service/llm-models), [API](https://docs.cerit-sc.cz/en/docs/ai-as-a-service/ai-api) |

Model je zadaný **přesným názvem, ne aliasem**. Aliasy služby (`mini`, `agentic`, …) může
provozovatel kdykoli přesměrovat na jiný model; přesný název se nezmění, a když ho provozovatel
stáhne, zkušební workflow selže a hned se to pozná. Změnu modelu je potřeba domluvit se
správcem portálu.

## Klíč a nastavení

Klíč i nastavení jsou v repozitáři `elixir-cz-pathogens/pathogensportal`, v **prostředí
(environment) `llm`**:

| Název | Druh | Hodnota |
|---|---|---|
| `LLM_API_KEY` | tajemství prostředí | klíč ke službě |
| `LLM_BASE_URL` | proměnná prostředí | `https://llm.ai.e-infra.cz/v1` |
| `LLM_MODEL` | proměnná prostředí | `mistral-medium-3.5` |

Co z toho plyne:

- **Prostředí `llm` pustí klíč jen do běhů z větve `main`.** Workflow spuštěný z `dev` nebo
  z jiné větve klíč nedostane. Na `dev` může pushnout kdokoli bez kontroly; kdyby klíč byl
  dostupný tam, mohl by ho kdokoli vypsat.
- **Workflow, který model volá, musí ležet na `main`.** Workflow běží z větve, na které je
  uložený — na `main` se tedy dostane pull requestem jako každá jiná změna.
- **Klíč není v repozitáři `pathogensportal-db`.** Kód, který model volá, proto patří do
  repozitáře webu (`pathogensportal`), i když data připravuje `-db`.
- Klíč nikdy nevypisuj do logu ani do výstupu. GitHub ho v logu sice maskuje, ale ne
  v souborech, které workflow vytvoří.

## Zkušební workflow

`.github/workflows/llm-smoke.yaml` se spouští ručně: *Actions → „CHECK: LLM key smoke test“ →
Run workflow* na větvi `main`. Zeptá se služby na seznam modelů, vypíše ho a selže, pokud v něm
není `LLM_MODEL`. Modelu nic neposílá, takže nic nestojí. Hodí se spustit vždy, když se něco
změní na straně služby nebo klíče.

## Jak volat model z vlastního workflow

Workflow musí mít `environment: llm` a předat proměnné kroku:

```yaml
on:
  workflow_dispatch:
  schedule:
    - cron: "30 3 * * *"

jobs:
  generate:
    runs-on: ubuntu-latest
    environment: llm
    steps:
      - uses: actions/checkout@v5
      - run: python tools/llm_texts.py
        env:
          LLM_API_KEY: ${{ secrets.LLM_API_KEY }}
          LLM_BASE_URL: ${{ vars.LLM_BASE_URL }}
          LLM_MODEL: ${{ vars.LLM_MODEL }}
```

V Pythonu stačí knihovna `openai` s jinou adresou:

```python
import os
from openai import OpenAI

client = OpenAI(base_url=os.environ["LLM_BASE_URL"], api_key=os.environ["LLM_API_KEY"])
response = client.chat.completions.create(
    model=os.environ["LLM_MODEL"],
    messages=[
        {"role": "system", "content": "Píšeš stručné a věcné texty k epidemiologickým grafům."},
        {"role": "user", "content": "Data: ..."},
    ],
    timeout=1800,
)
print(response.model)                       # model, který skutečně odpověděl
print(response.choices[0].message.content)
```

`response.model` zapiš do popisu pull requestu, aby recenzent věděl, čím text vznikl.

## Co dnes běží

| Část | Stav |
|---|---|
| Klíč a prostředí `llm` | nastavené |
| Zkušební workflow `llm-smoke.yaml` | připravený v PR #103 do `main`; po sloučení se spouští ručně |
| Kontejnery `llm-agent-be` a `mcp` | běží na stagingu, ale jsou to jen kostry s endpointem `/health`; model zatím nevolají |
| Situační reporty (Ebola) | texty připravuje AI agent mimo infrastrukturu portálu; na portál přicházejí jako obsahové PR s náhledem a schvaluje je odborný recenzent |

## První úkol: texty ke grafům

Cíl: jednou denně vzít čerstvá data grafů a nechat model přepsat doprovodný text na stránkách
panelů (např. „Počet případů za poslední týden vzrostl o 12 %…“). Výstup je pull request do
`main` se stejným schvalováním jako situační reporty.

Postup:

1. Spustit zkušební workflow na `main` a ověřit, že je model dostupný.
2. Vybrat jeden panel a napsat skript, který z jeho dat ve `frontend/static/data/charts/`
   sestaví zadání a zapíše odpověď do stránky panelu (česky i anglicky — obsah webu je v obou
   jazycích stejný).
3. Workflow, který skript spustí a otevře pull request z větve `content/…`, aby vznikl náhled.
4. Rozšířit na další panely, až recenzent první výstupy schválí.

Pravidla pro výstup:

- Model smí pracovat **jen s čísly, která jsou v datech grafu**. Žádná čísla „z hlavy“; skript
  má ověřit, že každé číslo v textu je v datech.
- Do zadání nepatří nic, co není veřejné: žádné klíče, hesla, data z databáze ani údaje
  o lidech.
- Každý PR uvádí model (`response.model`), datum dat a které panely mění.

## Otevřené otázky před prvním nasazením

- **Pod jakou identitou PR otevírat.** Pull request otevřený s `GITHUB_TOKEN` nespustí
  kontroly ani náhled. Potřeba je GitHub App nebo samostatný účet; rozhodne se společně se
  správcem.
- **Izolace agenta.** Pokud má model víc než psát text (spouštět nástroje, číst soubory),
  potřebuje oddělené prostředí bez přístupu k síti, tajemstvím a databázi. Pro samotné texty
  ke grafům stačí běh v GitHub Actions popsaný výše.
- **Kde bude kód žít.** Jednoduchý skript ve workflow, nebo služba `llm-agent-be`. Pro první
  úkol stačí skript.
