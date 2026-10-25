---
# Not a dashboard: a page with its own functionality (map + diagnosis
# selector), so it lives outside the dashboards section. `type` stays
# `dashboards` because only layouts/dashboards/single.html loads
# /js/pp-charts.js, without which the map is never coloured.
type: dashboards
# Keep the old URL working: published news items link to it.
aliases:
  - "/dashboards/signals/"
title: "Signals — anomaly detection"
origin: own
description: "Automated screening of 1,200+ notified infectious disease time series (diagnosis × region, ÚZIS ISIN) for exceedances of the expected level using the Farrington/Noufaily method."
image: "/images/cards/signals.svg"
highlight: true
tags: ["anomaly detection", "surveillance", "early warning", "ÚZIS", "statistics"]
data_source: '<a href="https://datanzis.uzis.gov.cz" target="_blank">ÚZIS CZ — ISIN Open Data (free access)</a>'
# The date of the last run comes from generated_at in this JSON, not from here.
update_from: "anomaly_signals.json"
update_read: "stamp"
---

Infectious disease data form more than **1,200 time series** (114 diagnoses × 14 regions plus
national totals). These series are evaluated automatically: for every series the **expected
endemic level** is computed from seasonality and history, and the page shows the months in which
the reported count exceeded the threshold.

{{< signals-period src="/data/charts/anomaly_signals.json" >}}

{{< signals-map src="/data/charts/anomaly_signals.json" title="Where the signal is — by region" >}}

{{< signals src="/data/charts/anomaly_signals.json" title="Series above the expected level" >}}

### How to read the table

| Column | Meaning |
|---|---|
| **Reported** | How many cases were actually reported in the given month. |
| **Of which via the new channel** | How many of the reported cases arrived through EWS notifications — a reporting route that ÚZIS introduced in July 2025 and that is absent from the history. |
| **Usually** | The model's endemic level: how many cases this disease, in this region, at this time of year, would have in an ordinary year. Computed from the 2018–present history with past epidemics down-weighted. |
| **Still normal up to** | The upper limit of what ordinary fluctuation can still explain (99th percentile of the prediction interval). A count between *Usually* and this limit is business as usual; a signal starts above it. |
| **Exceedance score** | (reported − usual) / (limit of normal − usual). A value of **1** means a count exactly at the limit of normal; a value of **2** means the deviation from the usual level is twice the deviation of the limit. The higher, the less likely it is chance. |

Example (evaluation for 12/2025): hepatitis A in the South Moravian Region. It usually has
**1** case, the limit of normal is **5**, and **80** cases were reported. The exceedance score is
(80 − 0.86) / (5.04 − 0.86) ≈ **19**; ordinary fluctuation does not explain a deviation like that.


### The new reporting channel: why some signals "cannot be decided"

Since July 2025 ÚZIS has also accepted cases through a new route, EWS notifications. For some
diseases most cases now arrive this way (as of 12/2025): 62% for herpes zoster, 59% for Lyme
borreliosis ("other spirochaetal infections"), 51% for infectious mononucleosis. The number of
reported cases has jumped as a result, **without this necessarily reflecting a higher occurrence of
the disease**.

Cases from the new channel cannot simply be subtracted. Some notifications moved to the new channel
from the old one (herpes zoster reported the old way fell from ~340 to ~175 cases a month), so the
count comparable with earlier years is not known. It lies somewhere between "reported without the
new channel" and "reported in total". The table therefore splits the signals in two:

- **at the top**, signals that hold even if the new-channel cases are left out entirely; they are
  exceedances regardless of how many notifications moved;
- **under the heading "cannot be decided"**, series that are above the limit of normal only thanks to
  new-channel cases. There may be a real rise behind them or merely a change in reporting, and the
  data cannot tell the two apart. On the map these regions are grey, not shaded by exceedance score.

Two badges replace the exceedance score where a statistical model makes no sense:

- **rare disease** — a disease with at most ~5 cases in the entire history (diphtheria, yellow
  fever…). The threshold here is "more than an isolated case": every cluster of 2 or more cases is
  flagged.
- **outside prior occurrence** — cases in a period in which the disease previously did not occur at
  all (there are none in the history for this part of the year). It may be a genuine novelty or a
  change in reporting.

Look first at series with a **high exceedance score and at the same time a high number of cases**.
A row with small counts and a score just above 1 may be chance: with a 99% limit and ~1,200 series
evaluated, around ten exceedances a month can be expected by chance alone.

{{< signals-excluded src="/data/charts/anomaly_signals.json" >}}

---

### What a signal means — and what it does not

A signal says one thing only: *the number of reported cases is statistically well above what would be
usual for this disease, in this region, at this time of year*. **It is not a confirmed outbreak.** An
exceedance may reflect a genuine outbreak, but also a change in reporting practice, late reporting of
older cases or plain chance. A signal is a prompt for further checking, not a conclusion.

The reverse also holds: **the absence of a signal does not mean that there is no rise.** Data for the
most recent months are always incomplete (notifications arrive with a delay), so a recent rise may only
become visible retrospectively.

### How the expected level is computed

We use the **Farrington/Noufaily method** — the same algorithm the UK Health Security Agency runs
weekly across thousands of laboratory reporting series:

- the expectation comes from a quasi-Poisson regression model over the full available history
  (2018–present) with seasonality and trend,
- past epidemics in the history are **down-weighted**, so that last year's wave does not raise this
  year's "normal",
- the threshold is the upper bound of the prediction interval (99th percentile); the **exceedance
  score** states how many times the deviation of the observation from the expectation is larger than
  the deviation of the threshold,
- diseases too rare for a statistical model (e.g. diphtheria) have their own rule: every cluster of
  cases is flagged.

### How well the method works

The method's performance was verified with a simulation study with a known outcome and with a
backtest against real epidemics:

- an epidemic adding **ten times** the usual monthly variation is caught with a probability of
  **~96%**, usually in its first or second month; five times the usual variation is caught in ~3 cases
  out of 5,
- the **2024 pertussis epidemic** (37,918 cases): first signal in **November 2023**, three months
  before the epidemic became a public topic; no false alarm in the calm period 2021–2023,
- real major epidemics are far stronger than these detection limits; November 2023 for pertussis was
  roughly fifteen to twenty times the usual variation.

<p class="stat-source">
  Method: Farrington et al. (1996), Noufaily et al. (2012) · implementation, backtests
  and the simulation study live in the
  <a href="https://github.com/elixir-cz-pathogens/pathogensportal-db" target="_blank">pathogensportal-db</a> repository ·
  Data source: <a href="https://datanzis.uzis.gov.cz" target="_blank">ÚZIS CZ — ISIN</a>, monthly aggregation
</p>
