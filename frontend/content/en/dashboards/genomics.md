---
title: "Genomic data from Czechia"
origin: aggregated
description: "What is publicly held in the European Nucleotide Archive from Czech specimens — how much data, for which pathogens, how it accumulates and how well it is described."
image: "/images/cards/infectious-hub.svg"
tags: ["genomics", "sequencing", "ENA", "open data", "Czech Republic"]
data_source: '<a href="https://www.ebi.ac.uk/ena/browser/home" target="_blank">European Nucleotide Archive (EMBL-EBI)</a>'
update_from: "genomics_overview.json"
update_read: "stamp"
---

{{< nav-pills group="genomika" active="prehled" >}}

The other dashboards show how many cases were notified. This one shows the other side: how much
**genomic data about Czech pathogens is publicly available**. The data come from the European
Nucleotide Archive (ENA) at EMBL-EBI, where laboratories from all over the world deposit them.

{{< genomics part="overview" note="The pathogen tag in the archive is very broad: it also covers viruses of plants (plum pox virus, for example) and animals, as well as bacteriophages. The table below therefore follows only the diseases the portal writes about, not the whole archive." >}}

---

### How the data accumulate

The chart shows how many sequencing runs from Czech specimens were **published** in a given
year — not collected. Years usually pass between collection and publication; see the section
on how the records are described.

{{< genomics part="growth" >}}

---

### Pathogens the portal follows

For each disease: the number of records, when one was last added, and links to the portal
dashboard and to the archive. The list is maintained by hand and keeps to the diseases the
portal follows elsewhere.

{{< genomics part="taxa" note="Two kinds of record: a **sequencing run** is raw data from the sequencer, an **assembled sequence** is a finished genome or part of one. One specimen can yield both, but need not — so the columns are not added up. A row without records does not mean nothing is sequenced: the data may be in another archive, which is demonstrably the case for SARS-CoV-2." >}}

---

### How well the records are described

Besides the sequence, a record carries details about the specimen. How completely these are
filled in decides what can be learned from the data: without a collection date there is no
tracking over time, without an isolation source no telling a patient specimen from an
environmental one.

{{< genomics part="quality" note="Genome coverage is the number of bases read divided by the genome length of the species — an order-of-magnitude estimate, not an exact figure. Coverage around a hundredfold is the usual standard for reliably calling genes in bacteria." >}}

### Methodology and limitations

- **The number of records is not an illness count.** A record exists because someone sequenced
  a specimen and published the data. Illness is shown by the
  [infectious diseases](/en/dashboards/infectious-diseases/) and
  [influenza](/en/dashboards/influenza-surveillance/) dashboards.
- **The country of collection is filled in by the submitter** and is optional. A record from a
  Czech specimen with no country does not enter the counts, so all figures are a lower bound.
- The query asks for the country of collection `country="Czech Republic"` and the `pathogen`
  data portal. The archive does not use the newer name ("Czechia") for these records.
- Some of the data were deposited by foreign research projects working with Czech specimens,
  so a record says nothing about where the sequencing happened.
- The counts are refreshed on every run of the data pipeline; the archive itself accepts
  records continuously.

<p class="stat-source">
  Source: <a href="https://www.ebi.ac.uk/ena/browser/home" target="_blank">European Nucleotide Archive</a>, EMBL-EBI ·
  <a href="https://www.insdc.org/policy/" target="_blank">INSDC</a> policy: sequence records carry no use restrictions ·
  Modifications: the totals for Czechia, the breakdowns by year, technology and pathogen, and the field completeness are computed by the portal.
</p>
