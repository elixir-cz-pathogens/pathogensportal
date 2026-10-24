---
title: "Contributing code"
translationKey: docs-contributing
description: "Reporting bugs, branch and commit conventions, licence."
weight: 60
---

## Reporting bugs and suggestions

- for the website: [issues in pathogensportal](https://github.com/elixir-cz-pathogens/pathogensportal/issues)
- for data and calculations: [issues in pathogensportal-db](https://github.com/elixir-cz-pathogens/pathogensportal-db/issues)

## Branches and commits

| | Format | Example |
|---|---|---|
| Branch | `feature\|bugfix\|docs/PP-<number>_description`, without an issue `no-issue/description` | `feature/PP-42_wastewater-endpoint` |
| Commit | `PP-<number>: summary`, without an issue `no-issue: summary` | `PP-57: fix PCR positivity rounding` |

Code, comments and commits are written in English; only the website content is Czech and English.
Details are in `CONTRIBUTING.md` in the repository.

## Licence

The code is under the MIT licence, texts and processed data under
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
