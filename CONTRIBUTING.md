# Pravidla přispívání — Pathogensportal

Konvence (styl převzatý z EFSA projektu). Detailní popis workflow: `.github/workflows/WORKFLOWS_GUIDE.md`.

Prefix projektu: **`PATH`** · úniková cesta: **`no-issue`** (nastaveno v repo proměnných
`PROJECT_PREFIX` / `IGNORE_PREFIX`).

---

## Větve

- **`dev`** — pískoviště. **Pushuje se sem rovnou, bez PR, bez kontrol.**
- **`main`** — produkce. Chráněná, mění se **jen přes PR z `dev`** (musí projít kontrolami).

Kontroly běží **jen na PR do `main`** — tam je brána. Do `dev` commituj volně.

### Názvy větví

```
feature/PATH-<číslo>_popis     např. feature/PATH-42_wastewater-endpoint
bugfix/PATH-<číslo>_popis       např. bugfix/PATH-57_pcr-rounding
docs/PATH-<číslo>_popis         např. docs/PATH-60_readme
no-issue/popis                  úniková cesta bez issue
```

Nejrychlejší způsob: na stránce issue → *Development* → **Create a branch**.

---

## Formát commit zprávy

```
PATH-<číslo>: krátký souhrn v rozkazovacím způsobu
```

- Commit související s issue **musí** začínat `PATH-<číslo>:`.
- Triviální změna bez issue → začni `no-issue:`.
- Souhrn krátký (≈ do 72 znaků), bez tečky na konci.

### Platné příklady
```
PATH-42: add wastewater dashboard endpoint
PATH-57: fix PCR positivity rounding
no-issue: reformat readme
```

### Odmítne CI (na PR → main)
```
updated stuff        ← chybí prefix
PATH42: add page     ← chybí pomlčka/dvojtečka
feat(#42): ...       ← starý styl, už neplatí
```

---

## Automatizace (dělá se sama)

- **Issue prefix:** po založení issue se titulek přejmenuje na `PATH-<číslo>: …`.
- **Branch linker:** push větve `feature/**`,`bugfix/**`,`docs/**` napíše komentář do issue.
- **PR notify:** otevření/mergnutí PR komentuje do issue.

---

## Jak si to nastavit lokálně

Šablona commit zprávy:
```bash
git config commit.template .gitmessage
```
`git commit` (bez `-m`) pak předvyplní nápovědu s formátem.

---

## Pull requesty

- PR jde z `dev` do `main` (nebo z feature větve).
- Musí projít `CHECK: Commit Message` + `CI: Hugo Build`.
- Titulek PR ať obsahuje `PATH-<číslo>` (aby automatizace poznala issue).
- Merge do `main`: **squash** nebo **rebase** (na `main` je vynucená lineární historie).
