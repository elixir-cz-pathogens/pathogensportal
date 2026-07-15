# Pravidla přispívání — Pathogenportal

Tato pravidla platí pro **všechna tři repa** projektu:
`pathogensportal` · `pathogensportal-infra` · `pathogensportal-db`.

---

## Větve

Model se dvěma větvemi:

- **`main`** — produkce. Chráněná větev, přímý push zakázán, mění se jen přes PR.
- **`dev`** — integrace. Sem míří běžná práce a feature větve.

Doporučený tok: `feature/*` → PR do `dev` → PR z `dev` do `main`.

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

---

## Pull requesty

- PR cílí na `dev` (nebo `dev` → `main`).
- Musí projít CI (kontrola commitů + testy dané fáze).
- U `feat`/`bug` odkaž issue i v popisu PR (`Closes #42`).
