---
title: "Influenza — season intensity"
origin: own
description: "How strong the influenza season is, where it is heading and what to expect in a month: weekly ILI and ARI rates against MEM thresholds, the growth trend and the four-week forecast of the European RespiCast hub."
image: "/images/cards/flu.webp"
highlight: true
tags: ["influenza", "ILI", "ARI", "MEM", "forecast", "surveillance", "Czech Republic"]
data_source: '<a href="https://www.who.int/tools/flunet" target="_blank">WHO FluID</a> · <a href="https://erviss.org/" target="_blank">ECDC ERVISS</a> · <a href="https://respicast.ecdc.europa.eu/" target="_blank">ECDC RespiCast</a>'
update_from: "flu_mem.json"
update_read: "stamp"
---

{{< flu part="status" />}}

{{< method title="How the trend is determined and how often it is right" >}}
{{< method-part title="Method" >}}
A weighted regression over the last three weeks gives the **growth rate** and the probability that the slope really is positive. The weight is the number of cases — a week with hundreds of cases says more than a week with tens.

```
ln( cases / population ) = a + r · week
weekly change = e^r − 1
P(growth) = P( T[n−2] < r / SE )     (Student's t)
```

Categories by P(growth): above 90 % growing · 75–90 % likely growing · 25–75 % stable · 10–25 % likely declining · below 10 % declining.

**Why not the reproduction number R.** R belongs to a single pathogen with a known generation interval. ILI and ARI are a mixture of influenza, RSV, COVID-19 and rhinoviruses — There is no single R for them; converting to R would require assumptions that do not hold for a mixture of pathogens.
{{< /method-part >}}
{{< method-part title="Studies" >}}
- CDC, Center for Forecasting and Outbreak Analytics: *Current Epidemic Trends (Based on R<sub>t</sub>)* — the source of the categories and probability cut-offs.
- Wallinga J., Lipsitch M. (2007): *How generation intervals shape the relationship between growth rates and reproductive numbers.* Proc. R. Soc. B 274 — why the growth rate carries the same information as R.
{{< /method-part >}}
{{< method-part title="How we tested it" >}}
Agreement of the trend category with the following week (backtest on past seasons):

{{< flu part="backtest" />}}

This test decided the window length (3 weeks). With 4- and 5-week windows the order of the categories breaks down and around the peak "growing" is still reported two weeks after the turn.
{{< /method-part >}}
{{< method-part title="Data limitations" >}}
- **The trend describes the last three weeks; it does not forecast.** Even after "growing", the rate fell the next week in a third of cases.
- **Holiday weeks** (52, 53, 1) make reporting drop and then jump — a trend across them carries a warning and is left out of the test.
- **Summer break.** Roughly from week 21 to week 35 nothing is reported; until three consecutive weeks are available after it, there is no trend.
- Recent weeks are still being completed; the last point can move retrospectively.
{{< /method-part >}}
{{< /method >}}

{{< flu part="chart" indicator="ili" controls="true" height="400" title="Weekly ILI rate against the intensity thresholds" subtitle="ILI per 100,000 population · October to May (calendar weeks 40–20) · Czechia" note="A **calendar week** is an ISO week: Monday to Sunday, week 1 being the one with the first Thursday of the year. The season is monitored from week 40 (turn of September and October) to week 20 (mid-May). ILI = influenza-like illness reported by general practitioners, per 100,000 of the covered population. It is a clinical diagnosis, not laboratory-confirmed influenza. The top of the page always shows the last reported week. The chart shows the running season once it has its first report within the season window; until then the last closed season, which can be replayed with the slider — the running season can be selected anyway." >}}
{{< method inside="true" title="How the thresholds are calculated, how we verified them and where the method is weak" >}}
{{< method-part title="Method" >}}
**Moving Epidemic Method (MEM)** — the ECDC and WHO standard for influenza surveillance. Three steps:

1. The epidemic period is found in every past season. For each length *r*, the *r* consecutive weeks with the largest sum are taken and their share of the whole season is computed. The epidemic lasts as long as an added week contributes at least δ = 2.8 % of the season.

```
t(r) = max  Σ x[i..i+r−1] / Σ x · 100
Δ(r) = t̃(r) − t̃(r−1)        (t̃ = smoothed curve)
epidemic length = last r with Δ(r) ≥ δ
```

2. The **epidemic threshold** from the highest weeks *before* the epidemic: a value that a quiet week exceeds in only 5 % of cases.

```
threshold = mean + 1.645 · sd
```

3. **Intensity bands** from the highest weeks *during* epidemics, on a logarithmic scale (peaks are roughly log-normal):

```
limit = exp( mean(ln x) + z · sd(ln x) )
z ∈ {−0.253; 1.282; 1.960}   (40th, 90th and 97.5th percentile)
```

Each season contributes its n highest weeks, n = 30 / number of seasons (3 weeks with ten seasons).
{{< /method-part >}}
{{< method-part title="Studies" >}}
- Vega T. et al. (2013): *Influenza surveillance in Europe: establishing epidemic thresholds by the Moving Epidemic Method.* Influenza and Other Respiratory Viruses 7(4).
- Vega T. et al. (2015): *Influenza surveillance in Europe: comparing intensity levels calculated using the MEM.* IORV 9(5).
- WHO (2017, revised 2024): *Pandemic Influenza Severity Assessment (PISA)* — the framework that recommends MEM.
- Reference implementation: the R package `mem` (J. E. Lozano).
{{< /method-part >}}
{{< method-part title="How we tested it" >}}
- **Agreement with the reference.** On Czech data and on synthetic seasons, our calculation gives the same thresholds and the same epidemic starts and ends as the R package `mem` 2.19 — to ten significant digits. An automated test checks this on every code change.
- **Season-by-season back-test.** The thresholds are computed without one season and tried on it. The epidemic threshold caught <span data-pp-flu-val="ili.validation.sensitivity"></span> of epidemic weeks this way and stayed silent outside the epidemic in <span data-pp-flu-val="ili.validation.specificity"></span> of weeks.
- **Sensitivity to δ.** We tried δ from 2.0 to 4.0 %. The differences are within noise, so the standard 2.8 stays — the thresholds are then comparable with other countries.
{{< /method-part >}}
{{< method-part title="Data limitations" >}}
- **ILI is a clinical diagnosis, not laboratory-confirmed influenza.** Other viruses with the same symptoms show up in the figure too.
- **Ten seasons are few.** The "very high" band rests on extrapolation — the data contain no season that strong.
- **Only some practices report.** The covered population changes; in FluID it jumped from 5.4 to 8.5 million in the 2025/26 season, so that season is not used for the thresholds yet.
- **Holidays.** Practices do not report over Christmas, which creates an artefact in the curve.

The estimate uses the last ten seasons in which an epidemic occurred. Left out:

{{< flu part="excluded" />}}
{{< /method-part >}}
{{< /method >}}
{{< /flu >}}

### Current four-week outlook

{{< flu part="outlook" />}}

{{< method title="Where the forecast comes from, how the probability is calculated and how far to trust it" >}}
{{< method-part title="Method" >}}
The forecast is the **ensemble of the European RespiCast hub** (ECDC, ISI Foundation, LSHTM). Dozens of teams submit their model every week — classical statistics (ARIMA, Kalman filter), epidemiological models (SEIR), machine learning (LightGBM, N-BEATS, LSTM) and foundation models for time series — and the hub combines them into one forecast with 23 quantiles. The portal takes it over unchanged.

The only thing we add is the **probability of exceeding the Czech epidemic threshold**: the quantiles are joined into a distribution function and the probability above the threshold is read off. Outside the range of the forecast we do not claim 0 or 100 %, only 1 or 99 %.

```
P( X ≥ threshold ) = 1 − F(threshold)
F = linear between neighbouring quantiles
```
{{< /method-part >}}
{{< method-part title="Studies" >}}
- ECDC: *The European Respiratory Diseases Forecasting Hub (RespiCast)*; evaluation of the 2023/24 season (medRxiv 2025).
- Bracher J. et al. (2021): *Evaluating epidemic forecasts in an interval format.* PLOS Computational Biology — the WIS score.
- CDC FluSight: ten years of evaluation show that the ensemble is more reliable than individual models.
{{< /method-part >}}
{{< method-part title="How we tested it" >}}
We compare every past forecast for Czechia with what actually happened and with the hub's reference model ("it will be like last week"), using WIS — a metric that penalises wide intervals as well as reality falling outside them.

{{< flu part="evaluation" />}}
{{< /method-part >}}
{{< method-part title="Data limitations" >}}
- **The bands are narrower than they promise.** We tried widening them; a scale from one season did not carry over to the next, so we show the original forecast and its actual track record next to it.
- **The forecast does not see the start of a wave.** Three weeks before the 2024/25 epidemic began, it gave a 1 % chance of exceeding the threshold. Early warning is the job of the epidemic threshold and the trend, not of the forecast.
- **Two seasons of history.** The hub has been running since October 2024; its track record differs between seasons.
- **Reporting delay.** Reports arrive two weeks late, so the first two "forecast" weeks are really an estimate of the present.
{{< /method-part >}}
{{< /method >}}

### What the forecast said in the replayed week

{{< flu part="replay" />}}

---

### ILI and ARI — two figures from the same practices

**ILI — influenza-like illness.** Sudden onset, fever or malaise, plus cough or sore throat. A narrow definition: it filters out the common cold, so the curve follows mostly influenza. During an influenza epidemic ILI rises roughly 15× above its autumn level.

**ARI — acute respiratory infection.** One respiratory symptom is enough. It covers infections caused by all circulating respiratory viruses: rhinoviruses, RSV, COVID-19 and influenza (ILI is a subset of ARI). During an influenza epidemic ARI rises only about twofold; it is, however, the indicator the Czech public health service traditionally uses.

{{< flu part="chart" indicator="ari" height="300" title="All acute respiratory infections (ARI)" subtitle="ARI per 100,000 population · same season and week as above · Czechia" note="ARI deliberately has no intensity bands: the influenza wave is lost in the year-round background of other viruses, and bands would pretend a precision the data do not have. The threshold is an indicative line computed by MEM — it is not the official limit public health authorities use to declare an epidemic." >}}
{{< method inside="true" title="Why ARI has no intensity bands" >}}
{{< method-part title="Method" >}}
The same MEM calculation as for ILI. ARI, however, is an almost flat series: even outside the wave every week carries about 3 % of the season, so the method can hardly tell where the epidemic starts and ends.
{{< /method-part >}}
{{< method-part title="How we tested it" >}}
Season-by-season back-test: for ARI the epidemic threshold caught only <span data-pp-flu-val="ari.validation.sensitivity"></span> of epidemic weeks (ILI <span data-pp-flu-val="ili.validation.sensitivity"></span>). Below the reliability limit we set in advance, the portal does not draw the bands — the data carry the flag `intensity_reliable`.
{{< /method-part >}}
{{< method-part title="Data limitations" >}}
- ARI includes all respiratory infections; an influenza wave lifts it only about twofold.
- The threshold in the chart is a result of MEM, **not the official limit** by which public health authorities declare an epidemic.
- Three milder seasons came out as "no epidemic" and are not used in the estimate.
{{< /method-part >}}
{{< /method >}}
{{< /flu >}}

### How past seasons turned out

{{< flu part="seasons" />}}

<p class="stat-source">
  Method: Moving Epidemic Method (Vega et al. 2013, 2015) · calculation verified against the reference R package <code>mem</code> ·
  implementation and tests in the repository
  <a href="https://github.com/elixir-cz-pathogens/pathogensportal-db" target="_blank">pathogensportal-db</a> ·
  laboratory influenza data are on the page <a href="/en/dashboards/influenza-surveillance/">Influenza and respiratory viruses</a>
</p>
