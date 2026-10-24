---
title: "Downloads and licences"
translationKey: docs-downloads
description: "Where to download the data, how the files are organised and under which licence they are."
weight: 30
---

## Data files

Every chart on the portal is drawn from a JSON file that you can download. The list of files is on
the page [Data and licences](/en/about/data/). The files contain **processed data for charts**
(aggregation, rates per population, selection of series), not raw data; for your own analysis use
the original source.

- File addresses do not change; the content is rewritten with every data update.
- **Older versions of the files are not archived.** If you use the data, keep a copy of the file
  and note the date you downloaded it.
- The structure of the files is described in the developer documentation:
  [Data file format](/en/docs/developers/data-format/).

## Machine-readable catalogues

- [`sources.json`](/en/about/data/sources.json): all data sources with publisher, licence, coverage,
  frequency and limitations.
- [DCAT-AP-CZ catalogue](/dcat/katalog.jsonld): datasets produced by processing on the portal.
- Dashboard pages carry schema.org/Dataset metadata (JSON-LD).

## Licence

The portal's texts and processed data are under the
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) licence. Data taken over from elsewhere are
under the licence of the original source, listed in the [source catalogue](/en/about/data/). The
portal's code is under the MIT licence.
