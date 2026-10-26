---
title: "Contribute data"
translationKey: contribute
description: "How to contribute your own data to the portal: request, upload and file format."
menu:
  footer_about:
    name: Contribute data
    weight: 6
layout: about_navbar
# Czech and English, 1:1 (cs/about/prispet.md). Carries BOTH intake forms, the
# template description and the machine-upload instructions. Describes the
# intake built in backend/website-be/app/intake — keep steps, limits and the
# template table in line with it (app/intake/templates.py).
---

{{< intake-status >}}

Do you have aggregated data on infectious diseases or pathogens in the Czech Republic — counts of
positive specimens, reported cases, monitoring results — and would you like them to be visible on
the portal?

**How it works:** [1. Request to take part](#request) → we approve you and send a key →
[2. Upload data](#upload) in the [right format](#template).

## What we accept

- **CSV** files with **aggregated** data: one row = period × territory × indicator × value,
  optionally with summary statistics (e.g. confidence intervals). The exact format is
  [below](#template).
- **We do not accept personal or sensitive data** — nothing that could identify an individual.

## 1. Request to take part {#request}

Tell us who you are, what data you have, where they come from and how often they change. The
portal's authors assess every request in person and get back to you by e-mail. Once approved, we
send you a **one-time link** through which you take over your **personal key** for uploading. The
link is valid for 72 hours and works only once; the key is shown to you alone and cannot be shown
again. If you stated in your request that it is a one-off contribution, the key is valid for one
accepted upload. Otherwise it stays valid for further data over time.

{{< intake-request >}}

## 2. Upload data {#upload}

For approved providers.

Limits of one upload: a CSV file at most 5 MB, the whole upload at most 20 MB, at most 50 CSV
files. An archive may contain CSV files only.

{{< intake-upload >}}

Regular sending of data can also be automated with your key: [machine upload guide](#machine-upload).

### What the file must look like — template `agregace-v1` {#template}

One row = one period × one territory × one indicator. Encoding **UTF-8**, separator comma or
semicolon, decimal point or comma. Column names stay in Czech, as in the template.

| Column | Required | Content |
|---|---|---|
| `obdobi` | yes | period: `2026`, `2026-09`, `2026-09-28` or ISO week `2026-W40` |
| `uzemi` | yes | territory: `CZ` or a NUTS3 region code (`CZ010` Prague … `CZ080` Moravian-Silesian) |
| `ukazatel` | yes | indicator: what is measured, e.g. `pozitivni_vzorky` |
| `hodnota` | yes | value: a number |
| `jednotka` | no | unit, e.g. `pocet`, `procento`, `na_100000` |
| `ci_dolni`, `ci_horni` | no | limits of the confidence interval |
| `poznamka` | no | free-text note |

Example:

```
obdobi,uzemi,ukazatel,hodnota,jednotka
2026-W40,CZ010,pozitivni_vzorky,12,pocet
2026-W40,CZ,pozitivni_vzorky,140,pocet
```

Tip: in Excel save via **Save As → CSV UTF-8 (Comma delimited)**. A plain "CSV" from Czech Excel is
in a different encoding and the check rejects it.

### Machine upload {#machine-upload}

The form above is a thin layer over an interface (API) that you can call directly from a script,
for example every week after an export from your system. The same key, the same checks and the same
declaration apply.

```bash
curl --fail-with-body \
  -H "Authorization: Bearer $PP_INTAKE_KEY" \
  -F file=@regions_2026-W43.csv \
  -F file=@districts_2026-W43.csv \
  -F declaration=prohlaseni-v1 \
  {{< intake-endpoint >}}
```

You may give the `file` field several times, or send one archive (`-F file=@export.zip`). With the
value `declaration=prohlaseni-v1` you confirm, for every upload, the same as the tick box in the form
(translation; the Czech wording applies):

> I declare that I am authorised to provide these data on behalf of my institution, that they
> contain no personal data, and that I agree to their processing and publication on Pathogen Portal
> CZ under the Creative Commons Attribution 4.0 (CC BY 4.0) licence with our institution named as the
> source. I acknowledge that data published this way may be reused by anyone who names the source.
> We may ask for the data to be corrected or withdrawn at any time.

| Response | Meaning |
|---|---|
| `200`, `"status": "accepted"` | everything passed the checks and is stored |
| `200`, `"status": "duplicate"` | we have already accepted exactly these files; no new record is created |
| `422`, `"status": "rejected"` | the errors are in `report.issues` (file, row, column, description); fix them and send again |
| `422` with `detail` | the declaration is missing or the template is unknown |
| `401` | the key is missing or invalid |
| `429` | more than 50 uploads in 24 hours |

Do not put the key in code or in a repository; keep it in an environment variable or in your
secrets manager. If it leaks, let us know: we will revoke it and issue a new one.

## Contact

Any questions? Write to us.
