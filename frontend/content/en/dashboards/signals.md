---
title: "Signals — anomaly detection"
description: "Automated screening of 1,200+ notified infectious disease time series (diagnosis × region, ÚZIS ISIN) for exceedances of the expected level using the Farrington/Noufaily method."
image: "/images/cards/signals.svg"
highlight: true
tags: ["anomaly detection", "surveillance", "early warning", "ÚZIS", "statistics"]
data_source: '<a href="https://datanzis.uzis.gov.cz" target="_blank">ÚZIS CZ — ISIN Open Data (CC BY 4.0)</a>'
update_freq: "With every data pipeline run"
---

Infectious disease notifications form more than **1,200 time series** (114 diagnoses ×
14 regions plus national totals) — far too many for anyone to watch by eye. This page
therefore screens them automatically: for every series it computes the **expected
endemic level** from seasonality and history, and shows the months where the notified
count exceeded the threshold.

{{< signals src="/data/charts/anomaly_signals.json" title="Series above the expected level" >}}

*Note: diagnosis and region names in the table come from the Czech source data.*

### What a signal means — and what it does not

A signal says one thing only: *the number of notified cases is statistically well above
what would be usual for this disease, in this region, at this time of year*. **It is not
a confirmed outbreak.** An exceedance may reflect a genuine cluster, but also a change
in reporting practice, delayed notifications catching up, or plain chance — at the
threshold used (99th percentile) we expect roughly **1% of series to exceed it by
chance alone** even in a completely calm situation. A signal is an invitation to look
closer, not a conclusion.

The reverse also holds: **silence is not evidence of calm.** Data for the most recent
months are always incomplete (notifications arrive with a delay), so a fresh rise may
only become visible retrospectively.

### How the expected level is computed

We use the **Farrington/Noufaily method** — the same algorithm the UK Health Security
Agency runs weekly across thousands of laboratory reporting series:

- the expectation comes from a quasi-Poisson regression model over the full available
  history (2018–present) with seasonality and trend,
- past epidemics in the history are **down-weighted**, so that last year's wave does
  not raise this year's "normal",
- the threshold is the upper bound of the prediction interval (99th percentile);
  the **strength** of a signal states how many times the observation exceeded the
  threshold distance from the expectation,
- diseases too rare for a statistical model (e.g. diphtheria) have their own rule:
  every cluster of cases is flagged.

### How well the method works

We measured the method's operating characteristics with a simulation study with known
ground truth, and by backtesting against real epidemics:

- an epidemic adding **ten times** the usual monthly variation is caught with
  a probability of **~96%**, usually in its first or second month; five times the
  usual variation is caught in ~3 cases out of 5,
- the **2024 pertussis epidemic** (37,918 cases): first signal in **November 2023**,
  three months before the epidemic became a public topic — with no false alarm in the
  calm period 2021–2023,
- real major epidemics are far stronger than these detection limits; November 2023
  for pertussis was roughly fifteen to twenty times the usual variation.

<p class="stat-source">
  Method: Farrington et al. (1996), Noufaily et al. (2012) · implementation, backtests
  and the simulation study live in the
  <a href="https://github.com/elixir-cz-pathogens/pathogensportal-db" target="_blank">pathogensportal-db</a> repository ·
  Data source: <a href="https://datanzis.uzis.gov.cz" target="_blank">ÚZIS CZ — ISIN</a>, monthly aggregation
</p>
