---
title: "Releases and deployment"
translationKey: docs-releases
description: "Branches, automatic deployment and checks."
weight: 50
---

| Branch | Where it deploys | How to get there |
|---|---|---|
| `dev` | test server (staging), automatically after every push | push directly, no PR, no checks |
| `main` | production, automatically after a merge | only through a pull request with checks and one approval |
| `content/…` | preview under `/preview/pr-<number>/` on staging | content PRs (situation reports) straight into `main` |

Changes from `dev` reach production through a pull request into `main`. Required PR checks:
`commit-message-check`, `hugo-build`, `backend-tests / pytest`, `content-sanitizer`.
Deployment to both servers runs the backend tests first; a failing test stops the deployment.

After every merge into `main`, `main` is automatically merged back into `dev`.

A detailed description of the workflows is in the repository in `.github/workflows/WORKFLOWS_GUIDE.md`.
