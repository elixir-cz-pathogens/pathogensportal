---
title: "COVID-19 Surveillance"
origin: aggregated
description: "Epidemiologická situace SARS-CoV-2 v České republice — denní případy, hospitalizace, testování a vakcinace."
image: "/images/cards/covid.webp"
highlight: true
tags: ["SARS-CoV-2", "hospitalizace", "vakcinace", "surveillance", "MZČR", "ČR"]
data_source: '<a href="https://onemocneni-aktualne.mzcr.cz" target="_blank">MZČR — onemocnění aktuálně</a> · <a href="https://erviss.org/" target="_blank">ECDC ERVISS</a>'
# The date comes from posledni_datum in this JSON, not from here.
update_from: "covid_summary.json"
update_read: "stamp"
---

{{< nav-pills group="infekcni-nemoci" active="covid" >}}
<a href="https://onemocneni-aktualne.mzcr.cz/covid-19" target="_blank" class="btn btn-primary mb-3 me-2">
  Oficiální COVID-19 portál MZČR →
</a>
<a href="https://virus.img.cas.cz/" target="_blank" class="btn btn-outline-secondary mb-3">
  Živé grafy SARS-CoV-2 — virus.img.cas.cz →
</a>

---

{{< stat-card src="/data/charts/covid_summary.json" >}}

{{< chart id="covidCases" src="/data/charts/covid_cases_weekly.json" title="Nové případy a úmrtí — týdenní přehled" height="380"  note="Absolutní počty: nově potvrzené případy a úmrtí sečtené za kalendářní týden, celá ČR. Nepřepočteno na obyvatele." >}}

{{< chart id="covidHosp" src="/data/charts/covid_hospitalization.json" title="Hospitalizace — stav pacientů (týdenní maximum)" height="380"  note="Absolutní počty současně hospitalizovaných pacientů (týdenní maximum denního stavu), celá ČR." >}}

{{< chart id="covidTest" src="/data/charts/covid_testing.json" title="Pozitivita testů na covid-19 (%)" height="300"  note="Podíl pozitivních mezi provedenými testy za kalendářní týden, zvlášť pro PCR a antigenní testy — každý typ testu má vlastní jmenovatel. Od poloviny srpna 2026 se hlásí jen desítky PCR testů týdně, pozitivita PCR je proto rozkolísaná; týden s méně než 30 testy se neuvádí." >}}

Pozitivita v laboratorní surveillance respiračních virů podle ECDC — SARS-CoV-2 vedle
chřipky a RSV, každý virus s vlastním počtem vyšetřených vzorků.

{{< chart id="covidPositivityErviss" src="/data/charts/flu_positivity_weekly.json" type="line" title="Týdenní pozitivita — SARS-CoV-2, chřipka, RSV" height="320" note="Podíl pozitivních mezi vyšetřenými vzorky v procentech, celá ČR, data ECDC ERVISS. SARS-CoV-2 končí týdnem 33/2026: od dalšího týdne ERVISS uvádí jiný počet vyšetřených vzorků (stejný jako u chřipky) a čísla na řadu nenavazují." >}}

{{< chart id="covidInc" src="/data/charts/covid_incidence.json" title="7denní incidence na 100 000 obyvatel" height="280"  note="Přepočet na populaci: nové případy za posledních 7 dní na 100 000 obyvatel." >}}

---

### Zdroje dat a metodika

Data jsou stahována z **MZČR otevřených dat** (API v2) a zahrnují denní hlášení od začátku pandemie.

| Ukazatel | Zdroj | Aktualizace |
|---|---|---|
| Nové případy, úmrtí | [MZČR — osoby](https://onemocneni-aktualne.mzcr.cz/covid-19) | denně |
| Hospitalizace | [MZČR — hospitalizace](https://onemocneni-aktualne.mzcr.cz/covid-19) | denně |
| PCR a antigenní testy | [MZČR — testy](https://onemocneni-aktualne.mzcr.cz/covid-19) | denně |
| Pozitivita v laboratorní surveillance | [ECDC ERVISS](https://erviss.org/) | týdně |
| Genomická surveillance | [COG-CZ / virus.img.cas.cz](https://virus.img.cas.cz/) | průběžně |

<p class="stat-source">Data: <a href="https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19" target="_blank">MZČR Open Data API v2</a> · Licence: otevřená data ČR</p>
