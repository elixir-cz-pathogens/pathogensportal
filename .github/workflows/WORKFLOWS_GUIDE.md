# Workflow guide (GitHub Actions)

An overview of every workflow in `.github/workflows/` and what it does.

## Repo variables and secrets

Settings → Secrets and variables → Actions

| Variable | Purpose | Value |
|---|---|---|
| `PROJECT_PREFIX` | prefix for issues/branches/commits | `PP` |
| `IGNORE_PREFIX` | the escape hatch for changes without an issue | `no-issue` |
| `UPSTREAM_URL` | the upstream repository whose commits are **not validated** | e.g. `https://github.com/<upstream-owner>/pathogensportal.git` |
| `DEPLOY_STAGING_ENABLED` | switch for the **staging** deploy only | `true` |
| `DEPLOY_PRODUCTION_ENABLED` | switch for the **production** deploy only | `true` — production deploys on every push to `main` |
| `STAGING_HOST` | FQDN of the staging machine | `pathogens-dev.vm.cesnet.cz` |
| `STAGING_PATH` | rsync target on staging | `/` (see "Deploy workflows") |
| `STAGING_SSH_HOST_KEY` | pinned SSH host key of staging | the server's `ssh-ed25519` line |
| `PRODUCTION_HOST` | FQDN of production | `pathogens.vm.cesnet.cz` |
| `PRODUCTION_PATH` | rsync target in production | `/` (see "Deploy workflows") |
| `PRODUCTION_SSH_HOST_KEY` | pinned SSH host key of production | the server's `ssh-ed25519` line |
| `DEPLOY_USER` | the account used for rsync | `github-deploy` |
| `CONTENT_REVIEWER` | GitHub account requested as reviewer on content PRs | optional |
| `CONTENT_AUTHOR` | if set, previews run only for content PRs opened by this account | optional |

Secrets: `STAGING_SSH_KEY` and `PRODUCTION_SSH_KEY` (separate deploy key pairs, one per machine).

**Note:** variables and secrets do not travel with a repository transfer. After moving the repository
they have to be set again; without `UPSTREAM_URL`, `commit-message-check` fails on every upstream sync.

## Branch model

- **`dev`** — the sandbox. **Push straight here, no PR, no checks.**
- **`main`** — production. Protected. Changed **only through a PR**, where the checks must pass and one
  approving review is required.

The checks (`CHECK:` and `CI:`) run **only on PRs into `main`** — that is where the gate is. Commit freely
into `dev`; CI checks the commit convention at the `dev → main` PR (every commit in `main..HEAD`).

## Workflow overview

| File | Category | Trigger | Required check? |
|---|---|---|---|
| `check-commit-message.yaml` | Validation | PR → `main` | yes (`commit-message-check`) |
| `hugo-build.yml` | CI | PR → `main` | yes (`hugo-build`) |
| `backend-tests.yml` | CI | PR → `main` | yes (`backend-tests / pytest`) |
| `check-content-sanitizer.yaml` | Validation | PR → `main` | yes (`content-sanitizer`) |
| `check-no-content-regression.yaml` | Validation | PR → `main` | no |
| `check-backend-integration.yaml` | CI | PR → `main` | no |
| `check-submodule-pin.yaml` | Validation | PR → `main` | no |
| `check-branch-name.yaml` | Validation | PR → `main` | no (informational) |
| `_test-backend.yml` | CI (reusable) | called by other workflows | — |
| `preview-content.yml` | Automation | PR from a `content/` branch | — |
| `auto-sync-main-to-dev.yaml` | Automation | push to `main` | — merges `main` back into `dev` |
| `auto-issue-prefix.yaml` | Automation | issue opened | — |
| `auto-branch-issue-tracking.yaml` | Automation | push to `feature/**`,`bugfix/**`,`docs/**` | — |
| `auto-pr-open-notify.yml` | Automation | PR opened | — |
| `auto-pr-merged-notify.yaml` | Automation | PR merged | — |
| `release-data-candidate.yml` | Automation | manual (`workflow_dispatch`) | — |
| `deploy-staging.yml` | Deploy | push to `dev` | — (`DEPLOY_STAGING_ENABLED`) |
| `deploy-production.yml` | Deploy | push to `main` | — (`DEPLOY_PRODUCTION_ENABLED`) |

**A workflow file only acts on the branch it sits on.** A workflow that must run on a push to `main`, or
on a PR from a branch cut from `main`, has to exist on `main`. This is why `auto-sync-main-to-dev.yaml`
keeps `dev` aligned with `main`.

## Conventions

**Commit:** `PP-<number>: message`  •  escape hatch: `no-issue: …`  •  generated content: `content: …`
```
PP-42: add wastewater dashboard endpoint
no-issue: reformat readme
```

**Branch:** `(feature|bugfix|docs)/PP-<number>_description`  •  `content/...`  •  escape hatch: `no-issue/...`
```
feature/PP-42_wastewater-endpoint
bugfix/PP-57_pcr-rounding
docs/PP-60_readme
```

## Validation workflows

### `check-commit-message.yaml`
Walks the commits in `main..HEAD` (excluding merge commits). Every subject must be `PP-<number>: …`,
`content: …`, or start with `no-issue`. Otherwise it fails.

**Upstream exemption.** Commits reachable from branches of the repository in `UPSTREAM_URL` are skipped —
CI fetches upstream into `refs/remotes/upstream/*` and excludes them via `git log … --not`. Upstream
messages do not follow this convention and cannot be rewritten without breaking the merge. When the
variable is missing or the fetch fails, the check prints a warning and validates the whole range.

**Sync upstream with a `merge`, not a `rebase`.** A rebase gives upstream commits new SHAs; CI then does
not recognize them as upstream and the check fails on them.

### `hugo-build.yml`
Clones the repo with its submodules (the theme), installs Hugo extended and runs `hugo --minify` in
`frontend/`. Verifies that the site builds.

### `backend-tests.yml`
For each service under `backend/*/`, installs `requirements.txt` and runs `pytest`. The steps live in the
reusable `_test-backend.yml`, which also gates both deploys, so the PR check and the deploy gate always
run the same tests. It fails if it finds no tests at all.

**Its required-check name is `backend-tests / pytest`, not `backend-tests`.** When a job uses `uses:`,
GitHub names the resulting check `<calling job> / <called job>`:

```yaml
jobs:
  backend-tests:
    uses: ./.github/workflows/_test-backend.yml   # the job inside is called `pytest`
```

Branch protection matches required checks by exact string. A required check that nothing reports stays
pending forever and blocks every PR into `main`. If you rename a job or wrap one in a reusable workflow,
compare `/branches/main/protection/required_status_checks` with the check names on a real PR.

### `check-content-sanitizer.yaml`
Scans the whole `frontend/content/` tree for executable or navigational markup (`<script>`, `<iframe>`,
event handlers, `javascript:` URLs, …). HTML in `content/` is rendered verbatim, and generated content PRs
do not pass through `tools/ingest_report.py`, so this check enforces the same allowlist in CI.

### `check-no-content-regression.yaml`
Compares the merge result with what `main` already serves and fails if a date or a version goes
backwards — the Ebola version stamp, `posledni_datum`, `generated_at`. Content can reach `main` directly
(content PRs, hotfixes) while `dev` runs ahead on everything else, so a release could otherwise revert
published pages. Series *length* is reported, never enforced: `flu_weekly` resets every autumn. The logic
is in `.github/scripts/check_no_content_regression.py` so it can be run against any two commits locally.

### `check-backend-integration.yaml`
Runs the `website-be` integration tests against a real PostgreSQL service, using the schema from the
`pathogensportal-db` submodule. Fails if no integration test actually ran.

### `check-submodule-pin.yaml`
Fails a PR that moves the `pathogensportal-db` pin to something that is not a clean release tag
(`vX.Y.Z`), or moves it backwards. An unchanged pin only produces a warning.

### `check-branch-name.yaml`
Checks the PR's source branch name. `dev` and `no-issue…` are skipped; otherwise it must match
`(feature|bugfix|docs)/PP-<number>_description` or `content/…`. Non-blocking.

## Automations

### `auto-issue-prefix.yaml`
After an issue is opened, renames the title to `PP-<number>: original title`.

### `auto-branch-issue-tracking.yaml`
After a push to a `feature/**`, `bugfix/**` or `docs/**` branch, posts a comment (once) into the
corresponding issue.

### `auto-pr-open-notify.yml` / `auto-pr-merged-notify.yaml`
Comment into the issue (whose number comes from `PP-<number>` in the PR title) when a PR is opened /
merged.

### `auto-sync-main-to-dev.yaml`
After every push to `main`, merges `main` back into `dev`. On a merge conflict it does not resolve
anything; the run fails and `dev` has to be realigned by hand (`git checkout dev && git merge origin/main`).
A red run means `dev` is behind `main`.

### `preview-content.yml`
For PRs from `content/` branches: builds the site and publishes a preview on the staging machine under
`/preview/pr-<number>/`, posts (and updates) a comment with the link, and requests `CONTENT_REVIEWER` as
reviewer. Content PRs are identified by branch name rather than by changed paths, because the
`dev → main` release PR touches the same paths.

### `release-data-candidate.yml`
Started manually (confirm by typing `cut release`). Triggers the release data build on the dev server,
which regenerates the data from the newest `pathogensportal-db` release and publishes it to the branch
`no-issue/release-data` for a PR into `main`. Requires the `DEV_SSH_KEY` secret and the `DEV_HOST`
variable (environment `release`).

## Deploy workflows

### `deploy-staging.yml` / `deploy-production.yml`
Unit tests → build with Hugo → `rsync` the static output over SSH to the target machine. Staging runs
from `dev`, production from `main`.

**Each is gated on its own variable** — `DEPLOY_STAGING_ENABLED` / `DEPLOY_PRODUCTION_ENABLED` — so
enabling staging can never arm a production deploy. While a variable is not `true`, that workflow's jobs
are skipped.

**Tests gate the deploy.** Both call `_test-backend.yml` and the deploy job `needs:` it, so a red test
never reaches a machine.

**Separate hosts and separate keys.** `STAGING_HOST`/`PRODUCTION_HOST` (vars) and
`STAGING_SSH_KEY`/`PRODUCTION_SSH_KEY` (secrets). A shared host would let a push to `dev` deploy to
production; a shared key would turn a compromised staging machine into access to production.

**`baseURL` is derived from `*_HOST`**, not hardcoded, so the machine name lives in one place and a DNS
change is a variable change. The first step stops the workflow with a clear message when a variable is
missing. The hostname is a variable, not a secret: it is public (it is also in `hugo.toml`), and a masked
value would make the build log unreadable.

**Host keys are pinned.** Each workflow writes `known_hosts` from `*_SSH_HOST_KEY` and connects with
`StrictHostKeyChecking=yes`; `ssh-keyscan` would trust whatever host answers.

**`*_PATH` is `/`.** On both machines the deploy key is restricted to a forced `rrsync` command, which
prefixes a leading-slash path with its restricted directory. `/` therefore means the deploy area on the
server. Changing the path and the server-side forced command is one change, server first; in between,
deploys fail.

**Release directories and a symlink flip.** Each deploy uploads the build into `releases/<commit-sha>/`
and then moves the `current` symlink to it, so visitors only ever see a complete tree and a rollback is a
symlink change on the server. Staging deploys are serialized (`concurrency`) so an older run cannot
finish last and win the flip.

## The typical working cycle

1. Open an issue → the title is renamed automatically to `PP-123: …`.
2. Create a branch `feature/PP-123_description` (or via *Create a branch* on the issue) → push → the linker
   comments into the issue.
3. Commit as `PP-123: …`, merge into `dev` (directly, no PR). Staging deploys automatically.
4. When `dev` is stable → PR `dev → main` → required checks and one approval → merge (rebase).
   Production deploys automatically, and `auto-sync-main-to-dev.yaml` merges `main` back into `dev`.
