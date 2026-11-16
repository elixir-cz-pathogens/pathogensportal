---
title: "Resistance genes in Czech isolates"
origin: aggregated
description: "Which antibiotic resistance genes AMRFinderPlus found in sequenced Czech isolates of Klebsiella, Staphylococcus aureus, Enterococcus faecium and Listeria."
image: "/images/cards/infectious-hub.svg"
tags: ["genomics", "resistance", "antibiotics", "NCBI", "Czech Republic"]
data_source: '<a href="https://www.ncbi.nlm.nih.gov/pathogens/" target="_blank">NCBI Pathogen Detection</a>'
update_from: "genomics_amr.json"
update_read: "stamp"
nav_hidden: true
---

{{< nav-pills group="genomika" active="rezistence" >}}

The US NCBI runs **AMRFinderPlus** over every public bacterial genome itself, looking for known
antibiotic resistance genes in the assembled genome, and publishes the results. The portal
computes nothing — it only picks out the Czech isolates and counts in how many each gene was
found.

{{< genomics part="amr" note="Finding a gene means the gene is present in the genome. That is not the same as a laboratory measurement of the strain's susceptibility: the gene may be inactive, and resistance can also have other causes. The genes followed here are those that make Europe monitor this particular species." >}}

### Methodology and limitations

- **Sequenced isolates are not a random sample.** Strains selected because of resistance and
  strains from hospital infections are sequenced preferentially, and some specimens come from
  wastewater. Percentages are therefore **deliberately not computed** — they would not say how
  common resistance is among patients.
- **A record is an isolate, not a patient.** One person can yield several isolates, and most
  patients are not sequenced at all.
- **The selection of genes is not a complete list of resistance.** These are the genes that
  make Europe monitor this species; the genomes carry others too, including genes the species
  has in itself.
- The relatedness of isolates (clusters of very similar genomes, which NCBI also computes) is
  not shown yet. A cluster reads easily as an outbreak, while it only means the genomes are
  similar.
- An isolate counts as Czech according to the "geographic location" field in the NCBI database.
  The counts may therefore differ from the ENA archive, which determines the country otherwise.
- Susceptibility testing and the choice of treatment are done by a laboratory for an individual
  patient. This page says nothing about treatment.

### Context

- [Genomic data from Czechia](/en/dashboards/genomics/) — how much is in the ENA archive
- [Infectious diseases overview](/en/dashboards/infectious-diseases/) — notified cases

<p class="stat-source">
  Source: <a href="https://www.ncbi.nlm.nih.gov/pathogens/" target="_blank">NCBI Pathogen Detection</a>,
  AMRFinderPlus results ·
  <a href="https://www.ncbi.nlm.nih.gov/home/about/policies/" target="_blank">NCBI</a> places no
  restrictions on the use of molecular data ·
  Modifications: the selection of Czech isolates, the grouping of genes and the totals are done by the portal.
</p>
