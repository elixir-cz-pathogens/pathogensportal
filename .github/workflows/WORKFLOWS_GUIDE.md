# Workflow guide (GitHub Actions)

An overview of every workflow in `.github/workflows/` and what it does. The style is adopted from the
EFSA project.

## Repo variables

Settings → Secrets and variables → Actions → Variables

| Variable | Purpose | Value |
|---|---|---|
| `PROJECT_PREFIX` | prefix for issues/branches/commits | `PP` |
| `IGNORE_PREFIX` | the escape hatch for changes without an issue | `no-issue` |
| `UPSTREAM_URL` | the upstream whose commits are **not validated** | `https://github.com/jirkavlasak/pathogensportal.git` |
| `DEPLOY_ENABLED` | the master switch for both deploy workflows | *(unset = off)* |
| `STAGING_HOST` | FQDN of the staging machine | ⏸️ to be recorded |
| `STAGING_PATH` | DocumentRoot on staging | ⏸️ |
| `PRODUCTION_HOST` | FQDN of production | `pathogens.vm.cesnet.cz` |
| `PRODUCTION_PATH` | DocumentRoot in production | ⏸️ (changes at the cutover) |
| `DEPLOY_USER` | the account used for rsync | `github-deploy` |

> ⚠️ **Variables and secrets do not travel with a repository transfer.** When this repo moves to the
> GitHub organization, everything in this table has to be set again on the org repo. The one that matters
> most is `UPSTREAM_URL` — without it, `commit-message-check` fails on every upstream sync.

## Branch model

- **`dev`** — the sandbox. **Push straight here, no PR, no checks.**
- **`main`** — production. Protected. Changed **only through a PR from `dev`**, where the checks must pass.

The checks (`CHECK:` and `CI:`) run **only on PRs into `main`** — that is where the gate is. Commit freely
into `dev`; CI polices the commit convention at the `dev → main` PR (it checks every commit in `main..HEAD`).

## Workflow overview

| File | Category | Trigger | Blocks merge? |
|---|---|---|---|
| `check-commit-message.yaml` | Validation | PR → `main` | ✅ yes |
| `hugo-build.yml` | CI | PR → `main` | ✅ yes |
| `backend-tests.yml` | CI | PR → `main` | ✅ yes (pytest of the BE services) |
| `check-branch-name.yaml` | Validation | PR → `main` | ⚪ no (informational) |
| `auto-issue-prefix.yaml` | Automation | issue opened | — |
| `auto-branch-issue-tracking.yaml` | Automation | push to `feature/**`,`bugfix/**`,`docs/**` | — |
| `auto-pr-open-notify.yml` | Automation | PR opened | — |
| `auto-pr-merged-notify.yaml` | Automation | PR merged | — |
| `deploy-staging.yml` | Deploy | push to `dev` | ⛔ **disabled** |
| `deploy-production.yml` | Deploy | push to `main` | ⛔ **disabled** |

## Conventions

**Commit:** `PP-<number>: message`  •  escape hatch: `no-issue: …`
```
PP-42: add wastewater dashboard endpoint
no-issue: reformat readme
```

**Branch:** `(feature|bugfix|docs)/PP-<number>_description`  •  escape hatch: `no-issue/...`
```
feature/PP-42_wastewater-endpoint
bugfix/PP-57_pcr-rounding
docs/PP-60_readme
```

## Validation workflows (these block merges into `main`)

### `check-commit-message.yaml`
Walks the commits in `main..HEAD` (excluding merge commits). Every subject must be `PP-<number>: …` or
start with `no-issue`. Otherwise it fails.

**An exemption for upstream.** Commits reachable from branches of the repo in `UPSTREAM_URL` are skipped —
CI fetches upstream into `refs/remotes/upstream/*` and excludes them via `git log … --not`. Without this,
the check would fail **on every sync** with `jirkavlasak/pathogensportal` (his messages don't meet our
convention and cannot be rewritten — it would stop being a merge). When the variable is missing or the
fetch fails, the check merely prints a warning and validates the whole range as before.

⚠️ **Do the sync as a `merge`, not a `rebase`.** A rebase gives upstream commits new SHAs; CI then doesn't
recognize them as upstream and the check fails on them.

### `hugo-build.yml`
Clones the repo with its submodules (the theme), installs Hugo extended and runs `hugo --minify` in
`frontend/`. Verifies that the site builds.

### `backend-tests.yml`
For each service under `backend/*/`, installs `requirements.txt` and runs `pytest`. Verifies the BE services.

### `check-branch-name.yaml`
Checks the PR's source branch name. `dev` and `no-issue…` are skipped; otherwise it must match
`(feature|bugfix|docs)/PP-<number>_description`. (Non-blocking — for `dev → main` it passes trivially.)

## Automations (non-blocking helpers)

### `auto-issue-prefix.yaml`
After an issue is opened, renames the title to `PP-<number>: original title`.

### `auto-branch-issue-tracking.yaml`
After a push to a `feature/**`, `bugfix/**` or `docs/**` branch, posts a comment (once) into the
corresponding issue.

### `auto-pr-open-notify.yml` / `auto-pr-merged-notify.yaml`
Comment into the issue (whose number comes from the PR title) when a PR is opened / merged.

## Deploy workflows (⛔ disabled for now)

Both are gated on `if: vars.DEPLOY_ENABLED == 'true'`. As long as that variable doesn't exist, the job is
skipped — so the files can sit finished in the repo without deploying anything.

### `deploy-staging.yml` / `deploy-production.yml`
Build with Hugo → `rsync` the static output over SSH to the target machine. Staging runs from `dev`,
production from `main`.

**`baseURL` is derived from `STAGING_HOST` / `PRODUCTION_HOST`**, not hardcoded. The machine name is thus
in one place, and a DNS change (a different provider, an own domain) is a repo-variable change. The job's
first step is a guard that stops the workflow with a comprehensible message when the variable is missing —
otherwise you would get `baseURL "https:///"` and rsync to `user@`.

> ### ⚠️ Staging and production have separate hosts and separate keys — do not merge them
> Originally both workflows read the **same** `DEPLOY_HOST` and `DEPLOY_SSH_KEY`. That made sense while
> staging was just a second vhost on the production VM. With staging on its own machine, they are two
> distinct bugs:
> - **a shared host** → a push to `dev` deploys to **production**,
> - **a shared key** → compromising staging is immediate access to production.
>
> Hence `STAGING_HOST`/`PRODUCTION_HOST` (vars) and `STAGING_SSH_KEY`/`PRODUCTION_SSH_KEY` (secrets).

**Why the hostname is a `var` and not a `secret`:** it isn't a secret (it is also in `hugo.toml`), and as a
secret it would be masked in the log — breaking both the readability of `baseURL` and any debugging of
`ssh-keyscan`. The secret is **the private key alone**.

**What remains before enabling:** the `github-deploy` account on the target machine
(`SECRETS_RUNBOOK.md` §4), setting the variables from the table above, then `DEPLOY_ENABLED=true`.
Staging first; production only after a verified run.

## The typical working cycle

1. Open an issue → the title is renamed automatically to `PP-123: …`.
2. Create a branch `feature/PP-123_description` (or via *Create a branch* on the issue) → push → the linker
   comments into the issue.
3. Commit as `PP-123: …`, merge into `dev` (directly, no PR).
4. When `dev` is stable → PR `dev → main` → `commit-message` + `hugo-build` must pass → merge (squash/rebase).
