# Pravidla přispívání — Pathogenportal

Tato pravidla platí pro **všechna tři repa** projektu:
`pathogensportal` · `pathogensportal-infra` · `pathogensportal-db`.

---

## Větve

Model se dvěma větvemi:

- **`main`** — produkce. Chráněná větev, přímý push zakázán, mění se jen přes PR.
- **`dev`** — integrace. Sem míří běžná práce a feature větve.

Doporučený tok: `feature/*` → PR do `dev` → PR z `dev` do `main`.

### Názvy větví (kontroluje CI `branch-check`)

```
feat/<issue>-krátký-popis     např. feat/42-wastewater-endpoint
bug/<issue>-krátký-popis      např. bug/57-pcr-rounding
no-issue/krátký-popis         např. no-issue/update-readme
```

- Číslo issue ve větvi umožní **auto-předvyplnění** commit zprávy (viz níže).
- Nejrychlejší způsob: na stránce issue → *Development* → **Create a branch** (GitHub větev
  pojmenuje a propojí s issue).

---

## Formát commit zprávy

```
<typ>(#<issue>): krátký souhrn v rozkazovacím způsobu
```

| Typ | Význam | Issue |
|---|---|---|
| `feat` | nová funkce | **povinné** `(#číslo)` |
| `bug` | oprava chyby | **povinné** `(#číslo)` |
| `no-issue` | triviální změna (dokumentace, formátování, konfigurace) | bez issue |

Pravidla:

- Souhrn krátký (≈ do 72 znaků), bez tečky na konci.
- `feat` a `bug` **musí** odkazovat číslo issue — GitHub tím propojí commit ↔ issue.
- `no-issue` se píše **bez** závorky s issue.
- Merge commity jsou z kontroly vyňaty.

### Platné příklady

```
feat(#42): add wastewater dashboard endpoint
bug(#57): fix PCR positivity rounding in weekly overview
no-issue: reformat Ansible playbook, no logic change
```

### Odmítnuté CI

```
updated stuff            ← chybí prefix typu
feat: add new page       ← feat bez #issue
bug(42): fix thing       ← chybí # před číslem
```

---

## Jak si to nastavit lokálně

Jednorázově zapni šablonu commit zprávy (soubor `.gitmessage` je v repu):

```bash
git config commit.template .gitmessage
```

Od teď `git commit` (bez `-m`) předvyplní nápovědu s formátem.

### Auto-prefix z názvu větve (volitelný hook)

Repo obsahuje hook `.githooks/prepare-commit-msg`, který podle větve předvyplní prefix commitu.
Jednorázově ho zapneš:

```bash
git config core.hooksPath .githooks
```

Pak na větvi `feat/42-neco` se `git commit` (bez `-m`) otevře už s `feat(#42): ` — jen dopíšeš souhrn.
Na větvích `bug/7-…` obdobně `bug(#7): `. Na `no-issue/…` a `dev` hook nic nedělá (zprávu píšeš ručně).

---

## Pull requesty

- PR cílí na `dev` (nebo `dev` → `main`).
- Musí projít CI (kontrola commitů + testy dané fáze).
- U `feat`/`bug` odkaž issue i v popisu PR (`Closes #42`).
