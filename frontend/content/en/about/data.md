---
title: Data and citation
description: "Where Pathogen Portal CZ gets its data, under which licence, what the data cannot tell you, how to cite the portal and how to download the data."
menu:
  footer_about:
    name: Data and citation
    weight: 4
layout: about_navbar
---

## Data and citation

The portal does not collect any primary data itself. It takes **open data from public
institutions**, processes and charts them — and states the origin of the numbers next to every
chart. This page brings it together: what we use, under which licence, how often it changes and,
above all, **what the data cannot tell you**.

The original source is always authoritative. If a number on the portal differs from the source,
the source is right — and we would be glad if you [let us know](#report-an-error).

## Source catalogue

{{< data-catalogue >}}

## How to cite

Please cite the **original data source** (given next to every chart and in the catalogue above)
and the portal as the place where you found the data or took the processing from:

<div class="pp-cite">
Pathogen Portal CZ. Institute of Molecular Genetics of the Czech Academy of Sciences, ELIXIR CZ.
https://pathogens.vm.cesnet.cz/en/ (accessed DD Month YYYY).
</div>

For results that are our own work — **Signals** (anomaly detection) and calculations on top of
the source data — please cite the method as well; its description, tests and exact code version
are in the [pathogensportal-db](https://github.com/elixir-cz-pathogens/pathogensportal-db)
repository. The Signals output carries a fingerprint of its input data and the code version, so
it can be recomputed bit for bit.

## Licence

- **Texts, charts and processing on the portal:** [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) —
  you may share and adapt them with attribution.
- **Source data:** the licence of the original source applies, as listed in the catalogue.
  Where the source states none, we say so — check the terms with the source before reusing such data.
- **Code:** both repositories are public on [GitHub](https://github.com/elixir-cz-pathogens).

## Machine-readable data

Every chart is drawn from a static JSON file that you can download. The addresses are stable;
the content is rewritten with every run of the data pipeline, and the date of the last run is
shown on each dashboard under "Updated".

{{< data-files >}}

The files are **processed data for charts**, not raw data — aggregation, per-population
adjustment and series selection are already applied. Series labels inside the files are in
Czech. For your own analysis, go to the original source.

## Report an error {#report-an-error}

Found a number that does not match the source, a broken chart or an unclear wording? Write to
[hpaces@img.cas.cz](mailto:hpaces@img.cas.cz), or open an issue: for the website in the
[pathogensportal](https://github.com/elixir-cz-pathogens/pathogensportal/issues) repository,
for data and calculations in [pathogensportal-db](https://github.com/elixir-cz-pathogens/pathogensportal-db/issues).

## What the portal does not do

- **It does not accept or provide sensitive data.** Everything here is public aggregated
  information without personal data. The portal does not yet offer controlled access to
  non-public data.
- **It is not an official source.** For public health decisions, the data and statements of the
  responsible institutions (Ministry of Health, SZÚ, ÚZIS, regional public health authorities)
  are authoritative.
