---
title: Data and licences
description: "Where Pathogen Portal CZ gets its data, under which licence, what the data cannot tell you and how to download the data."
menu:
  footer_about:
    name: Data and licences
    weight: 4
layout: about_navbar
# Besides the human-readable page, also emit the machine-readable catalogue: /about/data/sources.json
outputs: ["html", "sources"]
---

The portal does not collect primary data. It takes **open data from public institutions** and
only processes them. This page summarises the sources used, their licences, how often they are
updated and their **known limitations**.

The original source is always authoritative. If a value on the portal differs from the source,
the source's value applies. Please [report](#report-an-error) the difference.

## Source catalogue

{{< data-catalogue >}}

## Licence

- **Texts, charts and processing on the portal:** [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) —
  they may be shared and adapted provided the author, the licence and any changes are indicated.
- **Source data:** the licence of the original source applies, as listed in the catalogue. Where
  the source states none, the catalogue says so explicitly. Terms of further use must be checked
  with the provider.
- **Code:** [MIT](https://opensource.org/license/mit) licence; all of the portal's source code is public in the
  [elixir-cz-pathogens organisation on GitHub](https://github.com/elixir-cz-pathogens).

## Machine-readable data

Every chart is drawn from a static JSON file that you can download. File addresses do not
change; the content is rewritten with every data update. The date of the last update is shown on
the dashboard. Older versions of the files are not archived.

{{< data-files >}}

The files are **processed data for charts**, not raw data — aggregation, per-population
adjustment and series selection are already applied. Labels inside the files are in Czech,
with English versions in fields ending in `_en`. For your own analysis, go to the original source.

The source catalogue is also available in machine-readable form ([`sources.json`](sources.json)),
including a `limits` field describing the limitations of the data. Dashboard pages carry
[schema.org/Dataset](https://schema.org/Dataset) metadata (JSON-LD).

### DCAT-AP-CZ catalogue

Data **produced by processing on the portal** are also described by a catalogue following the Czech
open formal standard
[Open data catalogue interfaces](https://ofn.gov.cz/rozhraní-katalogů-otevřených-dat/2021-01-11/) (in Czech):
[`/dcat/katalog.jsonld`](/dcat/katalog.jsonld).

Data taken over from elsewhere are **not** in this catalogue. Their originators (ÚZIS, SZÚ, the
Ministry of Health, the Czech Statistical Office, WHO, ECDC) publish them, and they can be found in
the [Czech National Open Data Catalogue](https://data.gov.cz); the portal links to them in the
overview above.

## Report an error {#report-an-error}

Report errors in the data, broken charts and unclear wording by e-mail to
[hpaces@img.cas.cz](mailto:hpaces@img.cas.cz), or as an issue on GitHub:
for the website in the [pathogensportal](https://github.com/elixir-cz-pathogens/pathogensportal/issues) repository,
for data and calculations in [pathogensportal-db](https://github.com/elixir-cz-pathogens/pathogensportal-db/issues).
