---
title: "Lineages in phylogenetic trees"
origin: aggregated
description: "How many Czech strains are in the public Nextstrain trees, which lineages they belong to and how old the trees are — influenza, COVID-19, avian influenza, measles, RSV and mpox."
image: "/images/cards/flu.webp"
tags: ["genomics", "phylogenetics", "Nextstrain", "influenza", "SARS-CoV-2", "Czech Republic"]
data_source: '<a href="https://nextstrain.org/" target="_blank">Nextstrain</a>'
update_from: "genomics_lineages.json"
update_read: "stamp"
nav_hidden: true
---

{{< nav-pills group="genomika" active="linie" >}}

For influenza, COVID-19 and avian influenza there are **ready-made public phylogenetic trees**
that are recomputed continuously from sequences worldwide. The portal does not build them
again — it takes from them what concerns Czechia: how many strains are in them, which lineages
they belong to and when the tree was last recomputed. The link on each tree opens the view
with Czechia selected.

{{< genomics part="lineages" note="A phylogenetic tree groups viruses by how similar their genomes are. Strains close together share a recent common ancestor; this does not say who infected whom. A **lineage** (clade, subclade) is a named branch of the tree — a way of talking about a group of related viruses." >}}

### Methodology and limitations

- **A few dozen strains cannot show how common lineages are in the population.** The counts
  show what reached the tree from Czechia, not how frequent the lineages are here. For avian
  influenza the counts are an order of magnitude higher, but even there the specimens come from
  outbreaks in flocks, not from systematic sampling.
- **Each tree has its own age.** The influenza trees are recomputed daily to weekly, the
  European SARS-CoV-2 tree was last recomputed in October 2025. The date is therefore shown for
  each one separately.
- **Avian influenza is a disease of birds** and falls under veterinary supervision, not under
  the National Institute of Public Health. No Czech specimen in that tree comes from a human.
- **Zero is a finding.** The measles and RSV trees are refreshed regularly and rest on fully
  open data that anyone can contribute to.
- The underlying data of the influenza, COVID-19 and avian influenza trees come from the GISAID
  database. Its terms forbid distributing the data or making them available through a separate
  portal, so only aggregate counts and a link are used; no sequences are downloaded.
- A strain counts as Czech according to the "country of collection" field in the tree.

### Other views of the same data

- [Genomic data from Czechia](/en/dashboards/genomics/) — how much is in the ENA archive
- [Influenza and respiratory viruses](/en/dashboards/influenza-surveillance/) — laboratory
  detections and the share of positive specimens
- [Influenza](/en/dashboards/nextstrain-influenza/) and
  [SARS-CoV-2 phylogenetics](/en/dashboards/nextstrain-sarscov2/) — the trees themselves

<p class="stat-source">
  Source: public <a href="https://nextstrain.org/" target="_blank">Nextstrain</a> trees
  (Hadfield et al., <em>Bioinformatics</em> 2018) · underlying data from GISAID, USDA, GenBank
  and Pathoplexus depending on the tree ·
  Modifications: the counts of Czech strains, their lineages and the tree ages are computed by the portal.
</p>
