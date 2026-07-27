# Contribution Guidelines — Pathogensportal

Conventions. Detailed workflow description: `.github/workflows/WORKFLOWS_GUIDE.md`.

Project prefix: **`PP`** · escape hatch: **`no-issue`** (set in repo variables
`PROJECT_PREFIX` / `IGNORE_PREFIX`).

---

## Branches

- **`dev`** — sandbox. **Push directly here, no PR, no checks.**
- **`main`** — production. Protected, changed **only via PR from `dev`** (must pass checks).

Checks run **only on PRs into `main`** — that's the gate. Commit freely to `dev`.

### Branch names

```
feature/PP-<number>_description   e.g. feature/PP-42_wastewater-endpoint
bugfix/PP-<number>_description     e.g. bugfix/PP-57_pcr-rounding
docs/PP-<number>_description       e.g. docs/PP-60_readme
no-issue/description                 escape hatch without an issue
```

Fastest way: on the issue page → *Development* → **Create a branch**.

---

## Commit message format

```
PP-<number>: short summary in the imperative mood
```

- A commit related to an issue **must** start with `PP-<number>:`.
- Trivial change without an issue → start with `no-issue:`.
- Keep the summary short (≈ up to 72 characters), no trailing period.

### Valid examples
```
PP-42: add wastewater dashboard endpoint
PP-57: fix PCR positivity rounding
no-issue: reformat readme
```

### Rejected by CI (on PR → main)
```
updated stuff        ← missing prefix
PP42: add page     ← missing dash/colon
feat(#42): ...       ← old style, no longer valid
```

### Exception: commits synced from upstream

Commits that come from `jirkavlasak/pathogensportal` (repo variable `UPSTREAM_URL`) are **skipped** —
we cannot rewrite their messages without breaking the merge. Sync upstream with a real **merge**
(`git merge upstream/main`), never a rebase: a rebase gives the commits new SHAs, CI no longer
recognizes them as upstream, and the check fails on them.

---

## Automation (happens automatically)

- **Issue prefix:** after an issue is created, its title is renamed to `PP-<number>: …`.
- **Branch linker:** pushing a `feature/**`, `bugfix/**`, `docs/**` branch posts a comment on the issue.
- **PR notify:** opening/merging a PR comments on the issue.

---

## How to set it up locally

Commit message template:
```bash
git config commit.template .gitmessage
```
`git commit` (without `-m`) then pre-fills a hint with the format.

---

## Pull requests

- A PR goes from `dev` to `main` (or from a feature branch).
- Must pass `CHECK: Commit Message` + `CI: Hugo Build`.
- The PR title should contain `PP-<number>` (so automation can identify the issue).
- Merge into `main`: **squash** or **rebase** (linear history is enforced on `main`).
