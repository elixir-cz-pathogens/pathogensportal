---
title: "Language models (LLM)"
translationKey: docs-llm
description: "How the portal is connected to a language model, what runs today and how to build on it."
weight: 55
---

## In short

- The portal has access to a language model through the national **e-INFRA CZ (CERIT-SC)** service.
- The model is called **only from GitHub Actions** — not from the server and not from the visitor's
  browser.
- **Nothing the model writes is published on its own.** Every output arrives as a pull request into
  `main` and reaches the site only after a person approves it.
- What exists today is the connection and a smoke-test workflow. The first real use (text for
  charts, see below) is still being built.

## How it is wired

```
GitHub Actions (a workflow on the main branch)
  │  1. receives the key from the "llm" environment
  │  2. sends the model data and instructions
  ▼
e-INFRA CZ (CERIT-SC) ── language model ──► returns text
  │
  ▼
GitHub Actions
  │  3. writes the text into the site content
  │  4. opens a pull request into main
  ▼
preview on staging → approval by a reviewer → merge → deployment
```

It is the same path the situation reports already take: a content PR, a preview under
`/preview/pr-<number>/`, approval, deployment (see [Releases and deployment](/en/docs/developers/releases/)).

## Provider and model

| | |
|---|---|
| Service | e-INFRA CZ, AI-as-a-service run by CERIT-SC; the models run on their hardware in the Czech Republic |
| Interface | compatible with the OpenAI API (`/v1/models`, `/v1/chat/completions`), `Bearer` authorisation |
| Model | `mistral-medium-3.5` (Mistral AI) |
| Time limit | 30 minutes per non-streaming request |
| Documentation | [model catalogue](https://docs.cerit-sc.cz/en/docs/ai-as-a-service/llm-models), [API](https://docs.cerit-sc.cz/en/docs/ai-as-a-service/ai-api) |

The model is given by its **exact name, not an alias**. The service's aliases (`mini`, `agentic`, …)
can be pointed at a different model by the provider at any time; an exact name does not change, and
if the provider retires it, the smoke test fails and it is noticed at once. Changing the model has to
be agreed with the portal administrator.

## Key and settings

The key and the settings are in the `elixir-cz-pathogens/pathogensportal` repository, in the
**`llm` environment**:

| Name | Kind | Value |
|---|---|---|
| `LLM_API_KEY` | environment secret | the key to the service |
| `LLM_BASE_URL` | environment variable | `https://llm.ai.e-infra.cz/v1` |
| `LLM_MODEL` | environment variable | `mistral-medium-3.5` |

What follows from this:

- **The `llm` environment releases the key only to runs from the `main` branch.** A workflow run
  from `dev` or any other branch does not get it. Anyone can push to `dev` without review; if the key
  were available there, anyone could print it.
- **A workflow that calls the model has to live on `main`.** A workflow runs from the branch it is
  stored on — so it reaches `main` through a pull request like any other change.
- **The key is not in the `pathogensportal-db` repository.** Code that calls the model therefore
  belongs in the site repository (`pathogensportal`), even when `-db` prepares the data.
- Never print the key to a log or an output. GitHub masks it in logs, but not in files the workflow
  creates.

## Smoke-test workflow

`.github/workflows/llm-smoke.yaml` is started by hand: *Actions → "CHECK: LLM key smoke test" →
Run workflow* on the `main` branch. It asks the service for its list of models, prints it, and fails
if `LLM_MODEL` is not in it. It sends the model nothing, so it costs nothing. Run it whenever
something changes on the service's side or with the key.

## How to call the model from your own workflow

The workflow needs `environment: llm` and passes the variables to the step:

```yaml
on:
  workflow_dispatch:
  schedule:
    - cron: "30 3 * * *"

jobs:
  generate:
    runs-on: ubuntu-latest
    environment: llm
    steps:
      - uses: actions/checkout@v5
      - run: python tools/llm_texts.py
        env:
          LLM_API_KEY: ${{ secrets.LLM_API_KEY }}
          LLM_BASE_URL: ${{ vars.LLM_BASE_URL }}
          LLM_MODEL: ${{ vars.LLM_MODEL }}
```

In Python, the `openai` library works with a different address:

```python
import os
from openai import OpenAI

client = OpenAI(base_url=os.environ["LLM_BASE_URL"], api_key=os.environ["LLM_API_KEY"])
response = client.chat.completions.create(
    model=os.environ["LLM_MODEL"],
    messages=[
        {"role": "system", "content": "You write short, factual text for epidemiological charts."},
        {"role": "user", "content": "Data: ..."},
    ],
    timeout=1800,
)
print(response.model)                       # the model that actually answered
print(response.choices[0].message.content)
```

Put `response.model` in the pull request description, so the reviewer knows what produced the text.

## What runs today

| Part | State |
|---|---|
| Key and the `llm` environment | set up |
| Smoke-test workflow `llm-smoke.yaml` | prepared in PR #103 into `main`; started by hand once merged |
| Containers `llm-agent-be` and `mcp` | running on staging, but only skeletons with a `/health` endpoint; they do not call the model yet |
| Situation reports (Ebola) | the text is prepared by an AI agent outside the portal's infrastructure; it reaches the portal as content PRs with a preview and is approved by a subject-matter reviewer |

## First task: text for charts

Goal: once a day, take fresh chart data and have the model rewrite the accompanying text on the
dashboard pages (e.g. "Cases rose by 12 % over the last week…"). The output is a pull request into
`main` with the same approval as the situation reports.

Steps:

1. Run the smoke-test workflow on `main` and confirm that the model is available.
2. Pick one dashboard and write a script that builds the instructions from its data in
   `frontend/static/data/charts/` and writes the answer into the dashboard page (in Czech and
   English — the site content is the same in both languages).
3. A workflow that runs the script and opens a pull request from a `content/…` branch, so that a
   preview is built.
4. Extend it to more dashboards once the reviewer has approved the first outputs.

Rules for the output:

- The model may work **only with numbers that are in the chart data**. No numbers "from memory";
  the script should check that every number in the text is in the data.
- Nothing that is not public goes into the instructions: no keys, passwords, database data or
  information about people.
- Every PR states the model (`response.model`), the date of the data and which dashboards it
  changes.

## Open questions before the first deployment

- **Which identity opens the PR.** A pull request opened with `GITHUB_TOKEN` triggers neither the
  checks nor the preview. It needs a GitHub App or a separate account; to be decided together with
  the administrator.
- **Isolating the agent.** If the model is to do more than write text (run tools, read files), it
  needs a separate environment with no access to the network, secrets or the database. For text for
  charts alone, the GitHub Actions run described above is enough.
- **Where the code lives.** A plain script in a workflow, or the `llm-agent-be` service. For the
  first task a script is enough.
