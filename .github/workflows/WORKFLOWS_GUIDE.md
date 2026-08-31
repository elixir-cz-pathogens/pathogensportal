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
| `DEPLOY_STAGING_ENABLED` | switch for the **staging** deploy only | `true` since 17 Aug 2026 |
| `DEPLOY_PRODUCTION_ENABLED` | switch for the **production** deploy only | `true` since 17 Aug 2026 — production autodeploys on every push to `main`; rule #1 still applies to the machine |
| `STAGING_HOST` | FQDN of the staging machine | `pathogens-dev.vm.cesnet.cz` |
| `STAGING_PATH` | rsync target on staging | **`/`** — and that is correct: the deploy key is jailed to a forced `rrsync`, which prefixes a leading-slash path with its own restricted directory |
| `PRODUCTION_HOST` | FQDN of production | `pathogens.vm.cesnet.cz` |
| `PRODUCTION_PATH` | rsync target in production | `/opt/pathogensportal/frontend/public` — ⛔ **must become `/` in the same window as the next production Ansible run**, which applies the rrsync jail (armed 31 Aug 2026) |
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

> ### ⛔ Its required-check name is `backend-tests / pytest`, NOT `backend-tests`
>
> This job does not run the tests itself — it calls the reusable `_test-backend.yml`:
>
> ```yaml
> jobs:
>   backend-tests:
>     uses: ./.github/workflows/_test-backend.yml   # the job inside is called `pytest`
> ```
>
> **Whenever a job uses `uses:`, GitHub names the resulting check `<calling job> / <called job>`.**
> So the check that appears on a PR is `backend-tests / pytest`.
>
> Branch protection matches required checks by **exact string**. Listing `backend-tests` therefore
> requires a check that nothing ever reports: it stays pending (yellow) forever and **every PR into
> `main` is blocked permanently**, while the real test sits next to it, green. That is exactly what
> happened between 23 Aug and 31 Aug 2026 and it surfaced only when PR #24 would not go green.
>
> ⚠️ **The 23 Aug verification did not catch it** because it checked that `backend-tests` was *listed*
> in the protection API — not that anything *reports* it. Same circular-verification trap as the `app`
> role's setgid fix: **check the requirement (does the PR actually unblock?), not the remedy.**
>
> If you ever rename a job, or wrap one in a reusable workflow, re-check
> `/branches/main/protection/required_status_checks` against a real PR's check names.

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

## Deploy workflows

Each is gated on **its own** variable — `DEPLOY_STAGING_ENABLED` / `DEPLOY_PRODUCTION_ENABLED`. While a
variable doesn't exist, that workflow's jobs are skipped, so a finished file can sit in the repo
deploying nothing.

> ### ⚠️ One flag used to arm both — split on 17 Aug 2026
> Both workflows read the same `DEPLOY_ENABLED`. Turning staging on therefore **also armed production**,
> and the next push to `main` would have deployed to the live site with nobody having decided that.
> Production is governed by rule #1 — never touched without the administrator's approval — so it cannot
> hang off a flag flipped to test staging. This was the last thing the two environments still shared;
> hosts and keys had already been separated on 28 Jul. **Do not merge them back.**

### `deploy-staging.yml` / `deploy-production.yml`
Unit tests → build with Hugo → `rsync` the static output over SSH to the target machine. Staging runs
from `dev`, production from `main`.

**Tests gate the deploy.** Both call `_test-backend.yml` and the deploy job `needs:` it, so a red test
never reaches a machine. Staging matters here as much as production: reviewers judge the release from
that site, and it must not be able to show them a build whose backend tests are failing.

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

**Staging — done 17 Aug 2026:** the `github-deploy` account exists on `pathogens-dev.vm.cesnet.cz`
(created by the Ansible `users` role; member of `app` only, key restricted to
`no-pty,no-agent-forwarding,no-port-forwarding,no-X11-forwarding,no-user-rc`, and a single sudoers line
permitting nothing but a `website-be` container restart). `DEPLOY_USER`, `STAGING_HOST` and
`STAGING_PATH` are set. Remaining: the `STAGING_SSH_KEY` secret, then `DEPLOY_STAGING_ENABLED=true`.

**Production — live since 17 Aug 2026.** It uses a **separately generated** key pair (never staging's) and
`DEPLOY_PRODUCTION_ENABLED=true`; rule #1 still governs the machine itself.

⛔ **One coupling is still open.** `users_deploy_restrict_rsync` was armed to `true` in the prod inventory
on 31 Aug 2026 but has NOT been applied — production's deploy key currently carries no forced command, so
that key can run arbitrary commands as `github-deploy`. When the Ansible run lands, `PRODUCTION_PATH` must
become `/` in the same window, **server first**:

```bash
gh variable set PRODUCTION_PATH --body "/" -R elixir-cz-pathogens/pathogensportal
```

Between the run and the variable change, production deploys are broken — so do not open that window with a
release queued behind it.

## The typical working cycle

1. Open an issue → the title is renamed automatically to `PP-123: …`.
2. Create a branch `feature/PP-123_description` (or via *Create a branch* on the issue) → push → the linker
   comments into the issue.
3. Commit as `PP-123: …`, merge into `dev` (directly, no PR).
4. When `dev` is stable → PR `dev → main` → `commit-message` + `hugo-build` must pass → merge (squash/rebase).
