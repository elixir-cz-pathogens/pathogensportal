---
title: "Chřipka a respirační viry"
origin: aggregated
description: "Virologická surveillance chřipky a respiračních virů v České republice — sezónní přehledy 2012–2026, data SZÚ/NRL."
image: "/images/cards/flu.webp"
highlight: true
tags: ["chřipka", "RSV", "surveillance", "SZÚ", "ČR"]
data_source: '<a href="https://szu.gov.cz/publikace-szu/data/akutni-respiracni-infekce-chripka/" target="_blank">SZÚ — Národní referenční laboratoř pro chřipku</a> · pozitivita: <a href="https://www.who.int/tools/flunet" target="_blank">WHO FluNet</a>, <a href="https://erviss.org/" target="_blank">ECDC ERVISS</a>'
update_from: "flu_weekly.json"
update_read: "week"
---

### Sezónní přehled chřipky

Počet laboratorně potvrzených případů chřipky A a B napříč sezónami 2012/13–2025/26.
Propad v sezónách 2020/21 a 2021/22 odpovídá efektu protiepidemických opatření
(roušky, omezení kontaktů). Běžící sezóna se doplňuje průběžně, její sloupec proto
během zimy roste.

{{< chart id="fluSeason" src="/data/charts/flu_season_overview.json" type="bar" title="Chřipka A vs. B — celkem za sezónu" height="360"  note="Absolutní počty laboratorně potvrzených záchytů za celou sezónu, celá ČR. Jde o vyšetřené vzorky, ne odhad celkové nemocnosti v populaci." >}}

---

### Týdenní průběh běžící sezóny

Laboratorní záchyty po kalendářních týdnech, z týdenních PDF hlášení NRL —
aktualizuje se každý týden včetně letního období.

{{< chart id="fluWeekly" src="/data/charts/flu_weekly.json" type="line" title="Týdenní detekce — sezóna 2025/26" height="340" note="Absolutní počty laboratorních záchytů za kalendářní týden, celá ČR. Influenza A zahrnuje i subtypy H1N1pdm a H3N2." >}}

---

### Pozitivita laboratorních vzorků

Počty záchytů rostou s tím, kolik se testuje — a testuje se čím dál víc: v sezóně
2021/22 kolem 16 tisíc vzorků, v sezóně 2024/25 přes 65 tisíc. Z počtů proto nejde
poznat, jestli byla letošní sezóna silnější než loňská. **Pozitivita** — podíl pozitivních
mezi vyšetřenými vzorky — objem testování vykrátí a sezóny srovnat jde.

{{< chart id="fluPositivitySeasons" src="/data/charts/flu_positivity_seasons.json" type="line" title="Pozitivita chřipky po týdnech sezóny" height="360" note="Podíl pozitivních na chřipku mezi laboratorně vyšetřenými vzorky (nesentinelový systém), v procentech; každá čára je jedna sezóna, osa X jde od týdne 40 do týdne 20. Sezóny od 2021/22 — dřív se vyšetřovaly stovky cíleně vybraných vzorků a procenta nejsou srovnatelná. Týden s méně než 30 vzorky se neuvádí." >}}

Týdenní řada ukazuje tři hlavní respirační viry vedle sebe, každý s vlastním počtem
vyšetřených vzorků. Najetím na bod uvidíš, z kolika vzorků procento vzniklo.

{{< chart id="fluPositivityWeekly" src="/data/charts/flu_positivity_weekly.json" type="line" title="Týdenní pozitivita — chřipka, RSV, SARS-CoV-2" height="340" note="Podíl pozitivních mezi vyšetřenými vzorky v procentech, celá ČR, data ECDC ERVISS. Řada začíná 1/2025, od kdy ERVISS souvisle uvádí počet vzorků vyšetřených na RSV. SARS-CoV-2 končí týdnem 33/2026: od dalšího týdne se hlásí jiný počet vyšetřených a čísla na řadu nenavazují. Poslední 2–3 týdny chybějí, dokud laboratoře nenahlásí výsledky." >}}

---

### Respirační virologická krajina

Přehled všech sledovaných respiračních virů (chřipka, RSV, rhinoviry, koronaviry,
adenoviry…) napříč sezónami. Týdenní průběh aktuální sezóny po krajích najdeš na
stránce [Chřipka — regionální surveillance](/dashboards/influenza-regional/).

{{< chart id="fluResp" src="/data/charts/flu_respiratory_all.json" type="bar" title="Respirační viry — detekce za sezónu" height="420"  note="Absolutní počty laboratorních záchytů jednotlivých virů za sezónu, celá ČR." >}}

---

### Pozadí surveillance

Data pochází z **NRL pro chřipku a nechřipkové respirační viry** při SZÚ Praha.
Každý epidemiologický týden NRL publikuje zprávu s výsledky virologického vyšetření
vzorků od pacientů s ARI/ILI; historické sezóny jsou extrahované z archivních zpráv,
aktuální sezóna se stahuje automaticky.

Sledované viry:
- **chřipka A** (H1N1pdm, H3N2) a **chřipka B**
- **RSV** (respirační syncytiální virus)
- **HRV** (rhinoviry), **HAdV** (adenoviry), **HPIV** (parainfluenzaviry)
- **HMPV** (metapneumoviry), **CoV** (sezónní koronaviry), **hBoV** (bocaviry)
- *Mycoplasma pneumoniae* (atypická pneumonie)

### Další zdroje k chřipce

- [SZÚ — aktuální zprávy chřipka/ARI](https://szu.gov.cz/publikace-szu/data/akutni-respiracni-infekce-chripka/)
- [WHO FluNet — Evropa](https://www.who.int/europe/emergencies/surveillance/flunet)
- [ECDC — surveillance sezónní chřipky](https://www.ecdc.europa.eu/en/seasonal-influenza/surveillance-and-disease-data)
- [Fylogeneze chřipky (Nextstrain)](/dashboards/nextstrain-influenza/) — evoluce kmenů a výběr vakcinačních kmenů

<p class="stat-source">
  Zdroj: <a href="https://szu.gov.cz" target="_blank">SZÚ Praha</a> · NRL chřipka ·
  sezóny 2012/13–2025/26 · kategorie: laboratorní detekce (PCR/IF)
</p>
