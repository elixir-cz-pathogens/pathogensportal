---
title: "SARS-CoV-2 Phylogeny (Nextstrain)"
description: "Fylogenetický vývoj SARS-CoV-2 v Evropě včetně českých sekvencí — interaktivní strom variant a geografické šíření."
image: "/images/dashboard-placeholder.svg"
highlight: false
tags: ["SARS-CoV-2", "genomika", "fylogeneze", "Nextstrain"]
data_source: '<a href="https://nextstrain.org" target="_blank">Nextstrain</a> · sekvence z <a href="https://gisaid.org" target="_blank">GISAID</a>'
update_freq: "Denně (Nextstrain server)"
redirect_url: "https://nextstrain.org/ncov/gisaid/europe"
---

Tento dashboard otevírá **Nextstrain** — standard pro real-time fylogenomickou surveillance patogenů, vyvinutý Bedford Lab (Fred Hutch / WHO).

### Co Nextstrain zobrazuje

- **Fylogenetický strom** — evoluční vztahy mezi sekvencemi SARS-CoV-2
- **Geografické šíření** — animace jak se varianty šíří napříč zeměmi
- **Časová osa** — kdy které varianty vznikly a dominovaly
- **České sekvence** — ČR přispívá sekvencemi přes GISAID

### Dostupné Nextstrain buildy

| Build | Popis |
|-------|-------|
| [ncov/gisaid/europe](https://nextstrain.org/ncov/gisaid/europe) | Evropa — GISAID sekvence (obsahuje CZ) |
| [ncov/open/global](https://nextstrain.org/ncov/open/global) | Globální open-data build |
| [ncov/open/europe](https://nextstrain.org/ncov/open/europe) | Evropa — open data |

<a href="https://nextstrain.org/ncov/gisaid/europe" target="_blank" class="btn btn-primary mt-2 mb-3">
  Otevřít Nextstrain — SARS-CoV-2 Evropa
</a>

### Lokální Nextstrain build (pro vlastní sekvence)

Pro build z vlastních/lokálních sekvencí je k dispozici Nextstrain/Augur Docker kontejner v `docker-compose.yml` (profil `nextstrain`):

```bash
docker compose --profile nextstrain run augur --help
```

Potřebné vstupní soubory:
- `nextstrain/data/sequences.fasta` — FASTA sekvence z GISAID/ENA
- `nextstrain/data/metadata.tsv` — metadata (datum, zdroj, lokalita)

<p class="stat-source">Nextstrain: open source · Bedford Lab · MIT licence</p>
