---
title: "Influenza — regional surveillance"
description: "Weekly laboratory detections of respiratory viruses by Czech region — from SZÚ/NRL weekly PDF reports, updated every week."
image: "/images/cards/flu-regional.svg"
highlight: false
tags: ["influenza", "surveillance", "regions", "NIPH", "Czech Republic"]
data_source: '<a href="https://szu.gov.cz/publikace-szu/data/akutni-respiracni-infekce-chripka/" target="_blank">NIPH — National Reference Laboratory for Influenza</a>'
update_freq: "Weekly (running season 2025/26)"
---

### Season totals by region

Summary of laboratory tests for respiratory viruses by region for the running
season (since calendar week 40/2025). Prague and Central Bohemia share
virological laboratories and report jointly; the Zlín region has no virological
laboratory of its own in the reports.

{{< chart id="fluRegionalOverview" src="/data/charts/flu_regional_overview.json" type="bar" title="Laboratory tests by region — season 2025/26" height="420" note="Absolute counts per season: positive detections and samples tested. Regional differences mainly reflect laboratory capacity, not just disease occurrence." >}}

---

### Weekly course — regions with the highest detections

Positive detections by calendar week in the six regions with the highest totals.
Data accrue every week, including over the summer.

{{< chart id="fluRegionalWeekly" src="/data/charts/flu_regional_weekly.json" type="line" title="Positive detections by week — season 2025/26" height="380" note="Absolute counts of positive laboratory tests per calendar week. Not adjusted for population or for the number of samples tested." >}}

---

### Where the data comes from

Every week the SZÚ website publishes a PDF with laboratory results by virological
site. The pipeline downloads and parses them into a continuous time series —
published PDFs never change retroactively, so a downloaded week is final.
The extraction is validated against cumulative totals inside the PDFs.

<p class="stat-source">
  Source: <a href="https://szu.gov.cz/publikace-szu/data/akutni-respiracni-infekce-chripka/" target="_blank">SZÚ — weekly ARI/influenza reports</a> ·
  laboratory tests (PCR/IF) · season 2025/26, since week 40/2025
</p>
