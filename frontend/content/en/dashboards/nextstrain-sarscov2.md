---
title: "SARS-CoV-2 Phylogeny (Nextstrain)"
origin: aggregated
description: "Phylogenetic evolution of SARS-CoV-2 in Europe including Czech sequences — an interactive tree of variants and their geographic spread."
image: "/images/cards/phylo.svg"
highlight: false
tags: ["SARS-CoV-2", "genomics", "phylogeny", "Nextstrain"]
data_source: '<a href="https://nextstrain.org" target="_blank">Nextstrain</a> · sequences from <a href="https://gisaid.org" target="_blank">GISAID</a>'
update_freq: "Daily (Nextstrain server)"
redirect_url: "https://nextstrain.org/ncov/gisaid/europe"
---

This dashboard opens **Nextstrain** — the standard for real-time phylogenomic pathogen surveillance, developed by the Bedford Lab (Fred Hutch / WHO).

### What Nextstrain shows

- **Phylogenetic tree** — evolutionary relationships between SARS-CoV-2 sequences
- **Geographic spread** — an animation of how variants spread across countries
- **Timeline** — when each variant emerged and when it dominated
- **Czech sequences** — the Czech Republic contributes sequences via GISAID

### Available Nextstrain builds

| Build | Description |
|-------|-------|
| [ncov/gisaid/europe](https://nextstrain.org/ncov/gisaid/europe) | Europe — GISAID sequences (includes CZ) |
| [ncov/open/global](https://nextstrain.org/ncov/open/global) | Global open-data build |
| [ncov/open/europe](https://nextstrain.org/ncov/open/europe) | Europe — open data |

<a href="https://nextstrain.org/ncov/gisaid/europe" target="_blank" class="btn btn-primary mt-2 mb-3">
  Open Nextstrain — SARS-CoV-2 Europe
</a>

### Local Nextstrain build (for your own sequences)

To build from your own or local sequences, a Nextstrain/Augur Docker container is available in `docker-compose.yml` (profile `nextstrain`):

```bash
docker compose --profile nextstrain run augur --help
```

Required input files:
- `nextstrain/data/sequences.fasta` — FASTA sequences from GISAID/ENA
- `nextstrain/data/metadata.tsv` — metadata (date, source, location)

<p class="stat-source">Nextstrain: open source · Bedford Lab · MIT licence</p>
