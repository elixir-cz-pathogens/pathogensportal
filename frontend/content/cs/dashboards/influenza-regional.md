---
title: "Chřipka — regionální surveillance"
origin: aggregated
description: "Týdenní laboratorní záchyty respiračních virů po krajích ČR — z týdenních PDF hlášení SZÚ/NRL, aktualizováno každý týden."
image: "/images/cards/flu-regional.svg"
highlight: false
tags: ["chřipka", "surveillance", "kraje", "SZÚ", "ČR"]
data_source: '<a href="https://szu.gov.cz/publikace-szu/data/akutni-respiracni-infekce-chripka/" target="_blank">SZÚ — Národní referenční laboratoř pro chřipku</a>'
update_freq: "Týdně (běžící sezóna 2025/26)"
---

### Sezónní součty po krajích

Souhrn laboratorních vyšetření respiračních virů po krajích za běžící sezónu
(od 40. kalendářního týdne 2025). Praha a Střední Čechy sdílejí virologické
laboratoře a vykazují se společně; Zlínský kraj vlastní virologickou laboratoř
v hlášení nemá.

{{< chart id="fluRegionalOverview" src="/data/charts/flu_regional_overview.json" type="bar" title="Laboratorní vyšetření po krajích — sezóna 2025/26" height="420" note="Absolutní počty za sezónu: pozitivní záchyty a vyšetřené vzorky. Rozdíly mezi kraji odrážejí hlavně kapacitu laboratoří, ne jen výskyt nemoci." >}}

---

### Týdenní průběh — kraje s nejvyšším záchytem

Pozitivní záchyty po kalendářních týdnech v šesti krajích s nejvyšším celkovým
počtem. Data přibývají každý týden včetně léta.

{{< chart id="fluRegionalWeekly" src="/data/charts/flu_regional_weekly.json" type="line" title="Pozitivní záchyty po týdnech — sezóna 2025/26" height="380" note="Absolutní počty pozitivních laboratorních vyšetření za kalendářní týden. Nepřepočteno na obyvatele ani na počet vyšetřených vzorků." >}}

---

### Odkud data jsou

Každý týden vychází na webu SZÚ PDF s laboratorními výsledky po virologických
pracovištích. Pipeline je stahuje, parsuje a skládá do souvislé časové řady —
publikovaná PDF se zpětně nemění, takže jednou stažený týden je definitivní.
Extrakce se validuje proti kumulativním součtům přímo v PDF.

<p class="stat-source">
  Zdroj: <a href="https://szu.gov.cz/publikace-szu/data/akutni-respiracni-infekce-chripka/" target="_blank">SZÚ — týdenní hlášení ARI/chřipka</a> ·
  laboratorní vyšetření (PCR/IF) · sezóna 2025/26, od KT 40/2025
</p>
