---
title: "Data freshness"
translationKey: docs-freshness
description: "How often each data source changes and what that means for reading the dashboards."
weight: 25
---

The portal takes data from its sources at different rhythms: some sources publish daily, others
once a year. Read the label on a dashboard by its type (see
[How to read dashboards](/en/docs/readers/how-to-read-dashboards/)): "Updated" says when the portal
last processed the data, "Data through" and "Data for" say which period the data cover.

{{< sources-freshness >}}

Details on each source, including its licence and known limitations, are in the
[source catalogue](/en/about/data/).

## Things to keep in mind

- **The latest period is often incomplete.** Reports are added late, so the value for the last week
  or month may still go up. Where this applies, the note under the chart says so.
- **Annual sources** (ISIN, registries) change only when a new file is released. Between releases
  the data on the portal stay the same too.
- **Breaks in series.** A change in how cases are reported or counted can create a jump that does
  not reflect a change in occurrence. Known breaks are listed in the chart notes and in the source
  catalogue.
