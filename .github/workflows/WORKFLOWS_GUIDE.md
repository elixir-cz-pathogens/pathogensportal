# Průvodce workflow (GitHub Actions)

Přehled všech workflow v `.github/workflows/` a co dělají. Styl převzat z EFSA projektu.

## Repo proměnné

Settings → Secrets and variables → Actions → Variables

| Proměnná | Účel | Hodnota |
|---|---|---|
| `PROJECT_PREFIX` | prefix issue/větví/commitů | `PP` |
| `IGNORE_PREFIX` | úniková cesta bez issue | `no-issue` |
| `UPSTREAM_URL` | upstream, jehož commity se **nevalidují** | `https://github.com/jirkavlasak/pathogensportal.git` |
| `DEPLOY_ENABLED` | hlavní vypínač obou deploy workflow | *(nenastaveno = vypnuto)* |
| `STAGING_HOST` | FQDN staging stroje | ⏸️ čeká na VM |
| `STAGING_PATH` | DocumentRoot na stagingu | ⏸️ |
| `PRODUCTION_HOST` | FQDN produkce | `pathogens.vm.cesnet.cz` |
| `PRODUCTION_PATH` | DocumentRoot produkce | ⏸️ (mění se při cutoveru) |
| `DEPLOY_USER` | účet pro rsync | `github-deploy` |

## Model větví

- **`dev`** — pískoviště. **Pushuje se sem rovnou, bez PR, bez kontrol.**
- **`main`** — produkce. Chráněná. Mění se **jen přes PR z `dev`**, kde musí projít kontroly.

Kontroly (`CHECK:` a `CI:`) běží **jen na PR do `main`** — tam je brána. Do `dev` si commituj volně;
konvenci commitů si CI ohlídá až u PR `dev → main` (zkontroluje všechny commity `main..HEAD`).

## Přehled workflow

| Soubor | Kategorie | Spouštěč | Blokuje merge? |
|---|---|---|---|
| `check-commit-message.yaml` | Validace | PR → `main` | ✅ ano |
| `hugo-build.yml` | CI | PR → `main` | ✅ ano |
| `backend-tests.yml` | CI | PR → `main` | ✅ ano (pytest BE služeb) |
| `check-branch-name.yaml` | Validace | PR → `main` | ⚪ ne (informativní) |
| `auto-issue-prefix.yaml` | Automatizace | issue opened | — |
| `auto-branch-issue-tracking.yaml` | Automatizace | push `feature/**`,`bugfix/**`,`docs/**` | — |
| `auto-pr-open-notify.yml` | Automatizace | PR opened | — |
| `auto-pr-merged-notify.yaml` | Automatizace | PR merged | — |
| `deploy-staging.yml` | Deploy | push `dev` | ⛔ **vypnuto** |
| `deploy-production.yml` | Deploy | push `main` | ⛔ **vypnuto** |

## Konvence

**Commit:** `PP-<číslo>: zpráva`  •  únik: `no-issue: …`
```
PP-42: add wastewater dashboard endpoint
no-issue: reformat readme
```

**Větev:** `(feature|bugfix|docs)/PP-<číslo>_popis`  •  únik: `no-issue/...`
```
feature/PP-42_wastewater-endpoint
bugfix/PP-57_pcr-rounding
docs/PP-60_readme
```

## Validační workflow (blokují merge do `main`)

### `check-commit-message.yaml`
Projde commity `main..HEAD` (bez merge commitů). Každý subjekt musí být `PP-<číslo>: …`
nebo začínat `no-issue`. Jinak fail.

**Výjimka pro upstream.** Commity dosažitelné z větví repa v `UPSTREAM_URL` se přeskočí — CI si
upstream fetchne do `refs/remotes/upstream/*` a vyjme je přes `git log … --not`. Bez toho by kontrola
padala **při každém syncu** s `jirkavlasak/pathogensportal` (jeho zprávy naši konvenci nesplňují
a přepsat je nejde — přestal by to být merge). Když proměnná chybí nebo fetch selže, kontrola jen
vypíše varování a validuje celý rozsah jako dřív.

⚠️ **Sync dělej `merge`, ne `rebase`.** Rebase dá upstream commitům nová SHA, CI je pak nepozná
jako upstream a kontrola na nich spadne.

### `hugo-build.yml`
Naklonuje repo se submoduly (téma), nainstaluje Hugo extended a spustí `hugo --minify` ve `frontend/`.
Ověří, že se web postaví.

### `backend-tests.yml`
Pro každou službu v `backend/*/` nainstaluje `requirements.txt` a spustí `pytest`. Ověří BE služby.

### `check-branch-name.yaml`
Ověří název zdrojové větve PR. `dev` a `no-issue…` se přeskočí; jinak musí sedět
`(feature|bugfix|docs)/PP-<číslo>_popis`. (Neblokující — u `dev → main` projde triviálně.)

## Automatizace (neblokující pomocníci)

### `auto-issue-prefix.yaml`
Po založení issue přejmenuje titulek na `PP-<číslo>: původní titulek`.

### `auto-branch-issue-tracking.yaml`
Po pushi větve `feature/**`,`bugfix/**`,`docs/**` napíše (jednou) komentář do odpovídajícího issue.

### `auto-pr-open-notify.yml` / `auto-pr-merged-notify.yaml`
Komentují do issue (číslo z titulku PR) při otevření / mergnutí PR.

## Deploy workflow (⛔ zatím vypnuté)

Obě mají bránu `if: vars.DEPLOY_ENABLED == 'true'`. Dokud ta proměnná neexistuje, job se přeskočí —
takže soubory můžou v repu ležet hotové, aniž by cokoliv deployovaly.

### `deploy-staging.yml` / `deploy-production.yml`
Build Huga → `rsync` statiky přes SSH na cílový stroj. Staging jede z `dev`, produkce z `main`.

**`baseURL` se odvozuje z `STAGING_HOST` / `PRODUCTION_HOST`**, není zadrátovaná v kódu. Jméno stroje
je tak na jednom místě a změna DNS (jiný poskytovatel, vlastní doména) je změna repo proměnné.
První krok jobu je pojistka, která workflow zastaví se srozumitelnou hláškou, když proměnná chybí —
jinak by vznikla `baseURL "https:///"` a rsync na `user@`.

> ### ⚠️ Staging a produkce mají oddělené hosty i klíče — neslučovat
> Původně obě workflow četly **tentýž** `DEPLOY_HOST` a `DEPLOY_SSH_KEY`. To dávalo smysl, dokud byl
> staging jen druhý vhost na produkční VM. S vlastním staging strojem jsou to dvě různé chyby:
> - **sdílený host** → push do `dev` deployuje na **produkci**,
> - **sdílený klíč** → kompromitace stagingu je rovnou přístup na produkci.
>
> Proto `STAGING_HOST`/`PRODUCTION_HOST` (vars) a `STAGING_SSH_KEY`/`PRODUCTION_SSH_KEY` (secrets).

**Proč je hostname `vars` a ne `secrets`:** není to tajemství (stojí i v `hugo.toml`) a jako secret by
se maskoval v logu — rozbil by čitelnost `baseURL` i ladění `ssh-keyscan`. Tajemství je **jen privátní klíč**.

**Co zbývá k zapnutí:** účet `github-deploy` na cílovém stroji (`SECRETS_RUNBOOK.md` §4), nastavit
proměnné z tabulky výše, pak `DEPLOY_ENABLED=true`. Nejdřív staging, produkce až po ověřeném běhu.

## Typický pracovní cyklus

1. Založ issue → titulek se automaticky přejmenuje na `PP-123: …`.
2. Vytvoř větev `feature/PP-123_popis` (nebo přes *Create a branch* na issue) → push → linker komentuje do issue.
3. Commituj `PP-123: …`, měrgni do `dev` (rovnou, bez PR).
4. Až je `dev` stabilní → PR `dev → main` → musí projít `commit-message` + `hugo-build` → merge (squash/rebase).
