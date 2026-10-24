---
title: "Adding or changing a dashboard"
translationKey: docs-add-dashboard
description: "A dashboard's front matter, shortcodes and the source catalogue."
weight: 40
---

A dashboard is a page in `frontend/content/<language>/dashboards/`. It must exist in Czech
(`content/cs/`) and in English (`content/en/`), otherwise the other language lacks it.

## Front matter

| Field | Required | Meaning |
|---|---|---|
| `title`, `description` | yes | title and summary (the summary is shown on the card) |
| `origin` | yes | `aggregated` (public source), `own` (own analysis) or `ai-assisted`; without it no badge is shown |
| `data_source` | yes | HTML with links to the sources (the "Source" line) |
| `update_from` + `update_read` | yes, for data from JSON | the file and how to read the date: `stamp`, `period-end`, `week`, `month`, `year` |
| `update_freq` | external dashboards only | a text description of the frequency |
| `data_as_of` | closed reports only | must not be combined with `update_from` (the build fails) |
| `redirect_url` | no | the card leads straight to an external website and the page redirects |
| `tags`, `image`, `highlight` | no | topics, card picture, show on the home page |
| `build.list: never` | no | a sub-page that is not shown in the dashboard overview |

⛔ **Never type an update date into front matter by hand.** It is read from the data
(`update_from`); otherwise it goes stale.

## Shortcodes

The most common: `chart` (a chart), `region-map` (a map of regions), `stat-card`, `callout`,
`method` / `method-part` (folding methodology), `nav-pills` (navigation between the dashboards of one
group). Every template in `frontend/layouts/shortcodes/` starts with a comment on how to use it.

```
{{</* chart id="fluWeekly" src="/data/charts/flu_weekly.json" type="line"
     title="Weekly detections" height="340" note="Absolute counts, whole country." */>}}
```

A chart's `note` always says whether it shows absolute counts or a rate.

## Source catalogue

A new data source goes into `frontend/data/sources.yaml` (publisher, licence, coverage, frequency,
limitations and the pages that use it). This file feeds the [source catalogue](/en/about/data/),
`sources.json` and the [Data freshness](/en/docs/readers/data-freshness/) table.
