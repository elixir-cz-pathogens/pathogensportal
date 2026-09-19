/* Chřipka — intenzita sezóny (MEM), trend a předpověď nad ILI a ARI.
 *
 * Všechny části stránky ({{< flu part="…" >}}) čtou JEDEN soubor flu_mem.json
 * z pathogensportal-db (compute_mem.py) a sdílejí zvolenou sezónu a týden.
 * Výpočty se tu nedělají — prahy, trend, pravděpodobnosti i vyhodnocení
 * předpovědí přicházejí hotové. Skript jen kreslí a skládá věty.
 *
 * JEDINÁ věc počítaná v prohlížeči je „vůči dnešku“ u aktuálního výhledu:
 * JSON se generuje s během pipeline, ale popisek „tento týden“ má sedět i ve
 * dnech, kdy pipeline neběží.
 *
 * BARVY jdou z tokenů v dashboards.css (--pp-band-*, --pp-fan). Pásma intenzity
 * jsou JEDEN odstín od světlé po tmavou: intenzita je velikost, ne kategorie,
 * a stavové barvy (zelená/oranžová/červená) jsou vyhrazené Signálům.
 */
(function (window, document) {
  "use strict";

  var EN = (document.documentElement.lang || "").indexOf("en") === 0;
  var LOCALE = EN ? "en-GB" : "cs-CZ";

  var CS = {
    levels: { baseline: "pod prahem", low: "nízká", medium: "střední", high: "vysoká", very_high: "velmi vysoká" },
    trend: { growing: "roste", likely_growing: "pravděpodobně roste", stable: "beze změny",
             likely_declining: "pravděpodobně klesá", declining: "klesá" },
    months: ["led", "úno", "bře", "dub", "kvě", "čvn", "čvc", "srp", "zář", "říj", "lis", "pro"],
    week: "týden", season: "sezóna", from: "od",
    intensity: "Intenzita", notStarted: "Sezóna ještě nezačala", ended: "Epidemické období skončilo",
    sEpidemic: "{n}. týden epidemického období. Týdenní ILI je {v} na 100 tis., tedy {x}× nad epidemickým prahem.",
    sBefore: "Týdenní ILI {v} na 100 tis. je pod epidemickým prahem {t}.",
    sAfter: "ILI kleslo zpět pod práh {t}. Epidemické období trvalo {n} týdnů.",
    trendNote: "{c} % týdně · růst s pravděpodobností {p}", holiday: " · pozor, sváteční týdny zkreslují hlášení",
    trendNone: "trend — potřebuje tři souvislé týdny dat",
    outlookNote: "pravděpodobnost, že ILI bude v týdnu {w} nad epidemickým prahem",
    outlookNone: "výhled — pro tento týden předpověď není (RespiCast běží od 10/2024)",
    lgSeason: "sezóna {s}", lgActual: "jak sezóna pokračovala", lgForecast: "předpověď: medián, 50% a 95% pás",
    lgPast: "ostatní sezóny použité pro prahy", lgThreshold: "epidemický práh",
    axis: "měsíc · číslo kalendářního týdne", threshold: "epidemický práh {t}",
    ttForecast: "předpověď {m} (95 %: {lo}–{hi})", ttProb: "nad epidemickým prahem s pravděpodobností {p}",
    ttActual: "skutečnost ", per: " na 100 tis.", above: "nad", below: "pod", thrShort: " epidemickým prahem",
    ariNow: "{v} na 100 tis. · {ab} epidemickým prahem {t}{tr} · z toho ILI tvoří {s}",
    fcNote: "Šedý vějíř je předpověď evropského hubu RespiCast vydaná v daném týdnu. Z {n} minulých předpovědí pro ČR zachytil 95% pás skutečnost v {c95} případů a 50% pás v {c50} — pásy jsou tedy o něco užší, než slibují.",
    origin: "statický snímek dat", table: "Tabulka", hideTable: "Skrýt tabulku",
    colWeek: "Týden", colRange: "Od–do", colRel: "Vůči dnešku", colMedian: "Nejspíš (medián)", colBand: "95% pás",
    colIli: "ILI nejspíš", colIliBand: "ILI 95% pás", colAri: "ARI nejspíš", colAriBand: "ARI 95% pás",
    colAbove: "Nad epidemickým prahem {t}", colIliAbove: "ILI nad prahem {t}", colActual: "Skutečnost", unknown: "zatím neznámá",
    colIliT: "ILI / 100 tis.", colBandName: "Pásmo ILI", colAriT: "ARI / 100 tis.",
    colSeason: "Sezóna", colPeak: "Vrchol ILI", colPeakWeek: "Vrchol v týdnu", colIntensity: "Intenzita",
    colSaid: "Portál řekl", colCases: "Případů", colUp: "Další týden vzrostla",
    colLead: "Výhled", colN: "Předpovědí", colRef: "Proti referenci", col50: "50% pás zachytil", col95: "95% pás zachytil",
    leads: ["uplynulý týden", "běžící týden", "za 1 týden", "za 2 týdny"],
    better: "o {p} lepší", worse: "o {p} horší",
    evText: "Reference je nejjednodušší možný model („bude to jako minulý týden“). Po sezónách: {list}.",
    evSeason: "{s} {rel} než reference, 95% pás {c}",
    rel: ["tento týden", "minulý týden", "před {n} týdny", "příští týden", "za {n} týdny"],
    nowLede: "Dnes je {today}. Poslední předpověď vyšla {round}; poslední týden s hlášenými daty je {w} ({range}), proto se odhadují i týdny, které už proběhly. Tahle tabulka se přehráváním nemění.",
    replayLede: "Řídí se posuvníkem u grafu: předpověď vydaná {round} a vedle ní, jak to pak doopravdy dopadlo.",
    replayNone: "Pro zvolený týden předpověď není k dispozici — evropský hub RespiCast běží od října 2024.",
    outside: " — mimo prahy", error: "Data o intenzitě chřipky se nepodařilo načíst."
  };
  var ENS = {
    levels: { baseline: "below threshold", low: "low", medium: "medium", high: "high", very_high: "very high" },
    trend: { growing: "growing", likely_growing: "likely growing", stable: "not changing",
             likely_declining: "likely declining", declining: "declining" },
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    week: "week", season: "season", from: "from",
    intensity: "Intensity", notStarted: "The season has not started", ended: "The epidemic period is over",
    sEpidemic: "Week {n} of the epidemic period. Weekly ILI is {v} per 100,000 — {x}× the epidemic threshold.",
    sBefore: "Weekly ILI of {v} per 100,000 is below the epidemic threshold of {t}.",
    sAfter: "ILI fell back below the threshold of {t}. The epidemic period lasted {n} weeks.",
    trendNote: "{c}% per week · probability of growth {p}", holiday: " · note: holiday weeks distort reporting",
    trendNone: "trend — needs three consecutive weeks of data",
    outlookNote: "probability that ILI is above the epidemic threshold in week {w}",
    outlookNone: "outlook — no forecast for this week (RespiCast started in 10/2024)",
    lgSeason: "season {s}", lgActual: "how the season continued", lgForecast: "forecast: median, 50% and 95% band",
    lgPast: "other seasons used for the thresholds", lgThreshold: "epidemic threshold",
    axis: "month · calendar week number", threshold: "epidemic threshold {t}",
    ttForecast: "forecast {m} (95%: {lo}–{hi})", ttProb: "above the epidemic threshold with probability {p}",
    ttActual: "observed ", per: " per 100,000", above: "above", below: "below", thrShort: " the epidemic threshold",
    ariNow: "{v} per 100,000 · {ab} the epidemic threshold of {t}{tr} · ILI makes up {s}",
    fcNote: "The grey fan is the forecast of the European RespiCast hub issued in the given week. Out of {n} past forecasts for Czechia, the 95% band contained the outcome in {c95} of cases and the 50% band in {c50} — the bands are somewhat narrower than they claim.",
    origin: "static data snapshot", table: "Table", hideTable: "Hide table",
    colWeek: "Week", colRange: "From–to", colRel: "Relative to today", colMedian: "Most likely (median)", colBand: "95% band",
    colIli: "ILI most likely", colIliBand: "ILI 95% band", colAri: "ARI most likely", colAriBand: "ARI 95% band",
    colAbove: "Above the epidemic threshold of {t}", colIliAbove: "ILI above threshold {t}", colActual: "Observed", unknown: "not yet known",
    colIliT: "ILI / 100,000", colBandName: "ILI band", colAriT: "ARI / 100,000",
    colSeason: "Season", colPeak: "ILI peak", colPeakWeek: "Peak week", colIntensity: "Intensity",
    colSaid: "The portal said", colCases: "Cases", colUp: "Rose the following week",
    colLead: "Horizon", colN: "Forecasts", colRef: "Against the reference", col50: "50% band contained", col95: "95% band contained",
    leads: ["week just ended", "current week", "1 week ahead", "2 weeks ahead"],
    better: "{p} better", worse: "{p} worse",
    evText: "The reference is the simplest possible model (“same as last week”). By season: {list}.",
    evSeason: "{s} {rel} than the reference, 95% band {c}",
    rel: ["this week", "last week", "{n} weeks ago", "next week", "in {n} weeks"],
    nowLede: "Today is {today}. The latest forecast was issued on {round}; the last week with reported data is {w} ({range}), so weeks that have already passed are estimated too. This table does not change with the replay.",
    replayLede: "Follows the slider next to the chart: the forecast issued on {round}, next to what actually happened.",
    replayNone: "No forecast is available for the selected week — the European RespiCast hub started in October 2024.",
    outside: " — outside thresholds", error: "Influenza intensity data could not be loaded."
  };
  var L = EN ? ENS : CS;
  var ARROWS = { growing: "↑", likely_growing: "↗", stable: "→", likely_declining: "↘", declining: "↓" };
  var BANDS = [null, "--pp-band-1", "--pp-band-2", "--pp-band-3", "--pp-band-4"];
  var LEVEL_KEYS = ["baseline", "low", "medium", "high", "very_high"];

  function fill(template, values) {
    return template.replace(/\{(\w+)\}/g, function (_, key) { return values[key]; });
  }
  function fmt(value, digits) {
    if (value === null || value === undefined) return "–";
    return value.toLocaleString(LOCALE, { maximumFractionDigits: digits === undefined ? 1 : digits });
  }
  function pct(p, digits) { return fmt(100 * p, digits || 0) + (EN ? "%" : " %"); }
  function esc(text) {
    return String(text).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }

  /* ---------------- Stav sdílený všemi částmi ---------------- */

  var D, ILI, ARI, W, T, season, k;
  var charts = {};

  function token(name, fallback) {
    var probe = document.querySelector(".pp-viz") || document.body;
    return (getComputedStyle(probe).getPropertyValue(name) || "").trim() || fallback;
  }

  function levels() {
    return [0, T.epidemic, T.medium, T.high, T.very_high].map(function (from, i) {
      return { key: LEVEL_KEYS[i], name: L.levels[LEVEL_KEYS[i]], from: from, band: BANDS[i] };
    });
  }
  function levelOf(value) {
    var hit = levels()[0];
    levels().forEach(function (l) { if (value >= l.from) hit = l; });
    return hit;
  }

  /* ---------------- Kalendářní týdny ---------------- */

  function startYear(s) { return parseInt(s.slice(0, 4), 10); }
  function weekYear(s, i) { return W[i] >= 40 ? startYear(s) : startYear(s) + 1; }
  function isoKey(s, i) { return weekYear(s, i) + "-W" + ("0" + W[i]).slice(-2); }
  /** Pondělí ISO týdne: týden 1 je ten, do kterého padne 4. leden. */
  function monday(year, week) {
    var jan4 = new Date(Date.UTC(year, 0, 4));
    return new Date(Date.UTC(year, 0, 4 - ((jan4.getUTCDay() + 6) % 7) + (week - 1) * 7));
  }
  function keyMonday(key) { return monday(+key.slice(0, 4), +key.slice(6)); }
  function rangeOf(start) {
    var end = new Date(start.getTime() + 6 * 864e5);
    function dm(x) { return x.getUTCDate() + ". " + (x.getUTCMonth() + 1) + "."; }
    var head = start.getUTCMonth() === end.getUTCMonth() ? start.getUTCDate() + "." : dm(start);
    return head + "–" + dm(end) + " " + end.getUTCFullYear();
  }
  function weekRange(s, i) { return rangeOf(monday(weekYear(s, i), W[i])); }
  function weekName(key) { return (+key.slice(6)) + "/" + key.slice(0, 4); }
  function weekFull(s, i) { return weekRange(s, i) + " (" + L.week + " " + W[i] + "/" + weekYear(s, i) + ")"; }
  function monthAt(s, i) {
    var m = monday(weekYear(s, i), W[i]).getUTCMonth();
    return (i === 0 || monday(weekYear(s, i - 1), W[i - 1]).getUTCMonth() !== m) ? L.months[m] : "";
  }
  function keyToIdx(s, key) {
    for (var i = 0; i < W.length; i++) if (isoKey(s, i) === key) return i;
    return -1;
  }
  /** Vůči dnešku podle hodin prohlížeče — viz hlavička souboru. */
  function relativeWeek(key) {
    var now = new Date();
    var today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    var n = Math.floor((today - keyMonday(key).getTime()) / (7 * 864e5));
    if (n === 0) return L.rel[0];
    if (n === 1) return L.rel[1];
    if (n > 1) return fill(L.rel[2], { n: n });
    if (n === -1) return L.rel[3];
    return fill(L.rel[4], { n: -n });
  }

  /* ---------------- Čtení dat ---------------- */

  function forecastAt(ind, s, i) {
    return (ind.forecast && ind.forecast.by_last_observed_week[isoKey(s, i)]) || null;
  }
  function trendAt(ind, s, i) { return (ind.trend.by_season[s] || [])[i] || null; }
  function peakIdx(s) { return ILI.history[s].indexOf(Math.max.apply(null, ILI.history[s])); }

  /* Výchozí pohled mimo sezónu: dva týdny před začátkem epidemie — tam je vidět
     práh, trend i předpověď najednou. Když pro ten týden předpověď není, vrchol. */
  function demoWeek(s) {
    var v = ILI.history[s], first = -1;
    v.forEach(function (x, i) { if (first < 0 && x >= T.epidemic) first = i; });
    var i = Math.max(0, first - 2);
    return forecastAt(ILI, s, i) ? i : peakIdx(s);
  }

  function phase(s, i) {
    var v = ILI.history[s], first = -1, last = -1;
    for (var j = 0; j <= i; j++) if (v[j] >= T.epidemic) { if (first < 0) first = j; last = j; }
    if (first < 0) return { phase: "before", value: v[i], level: levels()[0] };
    if (v[i] >= T.epidemic) return { phase: "epidemic", value: v[i], level: levelOf(v[i]), week: i - first + 1 };
    return { phase: "after", value: v[i], level: levels()[0], duration: last - first + 1 };
  }

  /** Poslední týden sezóny, za který jsou data (běžící sezóna končí dřív než osa). */
  function lastWeekIdx(s) {
    return ILI.history[s].reduce(function (last, x, i) { return x !== null ? i : last; }, -1);
  }

  /* Uzavřené sezóny s úplnými daty + běžící sezóna, jakmile má první týden. */
  function selectableSeasons() {
    return Object.keys(ILI.history).filter(function (s) {
      function complete(v) { return v && v.every(function (x) { return x !== null; }); }
      if (s === ILI.current.season) return lastWeekIdx(s) >= 0;
      return complete(ILI.history[s]) && complete(ARI.history[s]);
    });
  }

  /* ---------------- Graf ---------------- */

  function fanDatasets(ind) {
    var fc = forecastAt(ind, season, k), v = ind.history[season];
    if (!fc) return [];
    function series(field) {
      var a = W.map(function () { return null; });
      a[k] = v[k];                                   // vějíř vyrůstá z posledního známého bodu
      fc.weeks.forEach(function (w) { var i = keyToIdx(season, w.week); if (i > k) a[i] = w[field]; });
      return a;
    }
    function band(lo, hi) {
      var base = { borderWidth: 0, pointRadius: 0, pointHoverRadius: 0, tension: 0.25, order: 5 };
      return [Object.assign({ label: "_" + lo, data: series(lo) }, base),
              Object.assign({ label: "_" + hi, data: series(hi), fill: "-1", backgroundColor: token("--pp-fan", "rgba(11,11,11,.13)") }, base)];
    }
    return band("q025", "q975").concat(band("q250", "q750"), [{
      label: "forecast", ppForecast: true, data: series("q500"), borderColor: token("--pp-text", "#0b0b0b"),
      borderWidth: 2, borderDash: [5, 4], pointRadius: 0, pointHoverRadius: 4,
      pointBackgroundColor: token("--pp-text", "#0b0b0b"), tension: 0.25, order: 1
    }]);
  }

  function datasets(ind) {
    var v = ind.history[season], ink = token("--pp-text", "#0b0b0b"), muted = token("--pp-text-muted", "#77766f");
    var past = ind.seasons_used.filter(function (s) { return s !== season; }).map(function (s) {
      return { label: s, data: ind.history[s], borderColor: token("--pp-series-rest", "#8b8a83") + "99",
               borderWidth: 1, pointRadius: 0, pointHoverRadius: 0, tension: 0.25, order: 6 };
    });
    return [{
      label: season, ppCurrent: true, data: v.map(function (x, i) { return i <= k ? x : null; }),
      borderColor: ink, borderWidth: 2.5, tension: 0.25, order: 0,
      pointRadius: v.map(function (_, i) { return i === k ? 5 : 0; }), pointHoverRadius: 5,
      pointBackgroundColor: ink, pointBorderColor: token("--pp-surface-raised", "#fff"), pointBorderWidth: 2
    }, {
      label: "actual", ppCurrent: true, ppActual: true, data: v.map(function (x, i) { return i >= k ? x : null; }),
      borderColor: muted, borderWidth: 1.5, pointRadius: 0, pointHoverRadius: 4,
      pointBackgroundColor: muted, tension: 0.25, order: 2
    }].concat(fanDatasets(ind), past);
  }

  /* Pásma se kreslí PŘED datovými řadami vlastním pluginem — bez další knihovny.
     Kreslí se jen tam, kde to data unesou (intensity_reliable): u ARI ne. */
  function bandsPlugin(ind) {
    return {
      id: "ppFluBands",
      beforeDatasetsDraw: function (chart) {
        var ctx = chart.ctx, a = chart.chartArea, y = chart.scales.y, all = levels();
        ctx.save();
        ctx.font = '500 11px ' + getComputedStyle(document.body).fontFamily;
        ctx.textAlign = "right";
        if (ind.intensity_reliable) {
          all.forEach(function (l, i) {
            if (!l.band) return;
            var top = i + 1 < all.length ? y.getPixelForValue(all[i + 1].from) : a.top;
            var bottom = y.getPixelForValue(l.from);
            ctx.fillStyle = token(l.band, "#e6f0fd");
            ctx.fillRect(a.left, top, a.right - a.left, bottom - top);
            ctx.fillStyle = token("--pp-text", "#0b0b0b");
            ctx.textBaseline = "top";
            ctx.fillText(l.name, a.right - 8, top + 6);
          });
        }
        var ye = y.getPixelForValue(ind.thresholds.epidemic);
        ctx.strokeStyle = token("--pp-text-secondary", "#52514e");
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 4]);
        ctx.beginPath(); ctx.moveTo(a.left, ye); ctx.lineTo(a.right, ye); ctx.stroke();
        if (!ind.intensity_reliable) {
          ctx.fillStyle = token("--pp-text-secondary", "#52514e");
          ctx.textBaseline = "bottom";
          ctx.fillText(fill(L.threshold, { t: fmt(ind.thresholds.epidemic, 0) }), a.right - 8, ye - 4);
        }
        ctx.restore();
      }
    };
  }

  var crosshair = {
    id: "ppFluCrosshair",
    afterDatasetsDraw: function (chart) {
      var active = chart.tooltip && chart.tooltip.getActiveElements();
      if (!active || !active.length) return;
      var ctx = chart.ctx, a = chart.chartArea, x = active[0].element.x;
      ctx.save();
      ctx.strokeStyle = token("--pp-text-muted", "#77766f");
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x, a.top); ctx.lineTo(x, a.bottom); ctx.stroke();
      ctx.restore();
    }
  };

  function ceilTo(x, step) { return Math.ceil(x / step) * step; }

  function yMax(ind) {
    var all = [];
    selectableSeasons().forEach(function (s) { all = all.concat(ind.history[s].filter(function (x) { return x !== null; })); });
    var top = Math.max.apply(null, all);
    return ind.intensity_reliable ? ceilTo(Math.max(ind.thresholds.very_high * 1.18, top), 20) : ceilTo(top * 1.08, 100);
  }

  function drawChart(root) {
    var key = root.getAttribute("data-indicator"), ind = D.indicators[key];
    var digits = key === "ili" ? 1 : 0, name = key.toUpperCase();
    var muted = token("--pp-text-muted", "#77766f");
    var skeleton = root.querySelector(".pp-skeleton");
    if (skeleton) skeleton.remove();

    var config = {
      type: "line",
      data: { labels: W.map(String), datasets: datasets(ind) },
      plugins: [bandsPlugin(ind), crosshair],
      options: {
        responsive: true, maintainAspectRatio: false, animation: false,
        interaction: { mode: "index", intersect: false },
        layout: { padding: { top: 4, right: 4 } },
        scales: {
          x: {
            grid: { display: false }, border: { color: token("--pp-border", "#e2e1dc") },
            ticks: { color: muted, font: { size: 11 }, maxRotation: 0, autoSkip: false,
                     callback: function (_, i) { return [monthAt(season, i), i % 2 === 0 ? String(W[i]) : ""]; } },
            title: { display: true, text: L.axis, color: muted, font: { size: 11 } }
          },
          y: {
            min: 0, max: yMax(ind), grid: { color: token("--pp-grid", "#ebeae6") }, border: { display: false },
            ticks: { color: muted, font: { size: 11 }, stepSize: key === "ili" ? 100 : 500,
                     callback: function (v) { return fmt(v, 0); } }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            displayColors: false, padding: 10, cornerRadius: 6,
            backgroundColor: token("--pp-text", "#0b0b0b"),
            titleColor: token("--pp-surface", "#fcfcfb"), bodyColor: token("--pp-surface", "#fcfcfb"),
            filter: function (item) {
              var d = item.dataset;
              if (!(d.ppCurrent || d.ppForecast) || item.parsed.y === null) return false;
              return !((d.ppActual || d.ppForecast) && item.dataIndex === k);   // bod k patří plné čáře
            },
            callbacks: {
              title: function (items) { return items.length ? weekFull(season, items[0].dataIndex) : ""; },
              label: function (item) {
                if (item.dataset.ppForecast) {
                  var w = forecastAt(ind, season, k).weeks.filter(function (x) { return keyToIdx(season, x.week) === item.dataIndex; })[0];
                  return [fill(L.ttForecast, { m: fmt(w.q500, digits), lo: fmt(w.q025, digits), hi: fmt(w.q975, digits) }),
                          fill(L.ttProb, { p: pct(w.p_epidemic) })];
                }
                var y = item.parsed.y, head = (item.dataset.ppActual ? L.ttActual : "") + name + " " + fmt(y, digits) + L.per;
                return ind.intensity_reliable ? head + " · " + levelOf(y).name
                     : head + " · " + (y >= ind.thresholds.epidemic ? L.above : L.below) + L.thrShort;
              }
            }
          }
        }
      }
    };
    if (charts[key]) charts[key].destroy();
    charts[key] = new window.Chart(root.querySelector("canvas"), config);
  }

  /* ---------------- Části stránky ---------------- */

  function roots(part) { return Array.prototype.slice.call(document.querySelectorAll('[data-pp-flu="' + part + '"]')); }
  function field(root, name) { return root.querySelector('[data-f="' + name + '"]'); }
  function swatch(level) {
    return '<i class="pp-flu-swatch" style="background:' + (level.band ? "var(" + level.band + ")" : "var(--pp-surface-raised)") + '"></i>';
  }
  function probBar(p) { return '<span class="pp-flu-pbar"><i style="width:' + Math.round(100 * p) + '%"></i></span> ' + pct(p); }

  function renderStatus() {
    roots("status").forEach(function (root) {
      var st = phase(season, k), tr = trendAt(ILI, season, k), fc = forecastAt(ILI, season, k);
      var last = fc && fc.weeks[fc.weeks.length - 1];
      field(root, "eyebrow").textContent = weekFull(season, k) + " · " + L.season + " " + season;
      field(root, "level").textContent = st.phase === "epidemic" ? L.intensity + " " + st.level.name
                                       : st.phase === "before" ? L.notStarted : L.ended;
      field(root, "sentence").textContent =
        st.phase === "epidemic" ? fill(L.sEpidemic, { n: st.week, v: fmt(st.value), x: fmt(st.value / T.epidemic, 1) })
        : st.phase === "before" ? fill(L.sBefore, { v: fmt(st.value), t: fmt(T.epidemic, 0) })
        : fill(L.sAfter, { t: fmt(T.epidemic, 0), n: st.duration });
      field(root, "value").textContent = fmt(st.value);
      field(root, "trend").textContent = tr ? ARROWS[tr.category] + " " + L.trend[tr.category] : "–";
      field(root, "trendNote").textContent = tr
        ? fill(L.trendNote, { c: (tr.weekly_change >= 0 ? "+" : "−") + fmt(Math.abs(100 * tr.weekly_change), 0), p: pct(tr.p_growth) })
          + (tr.holiday_effect ? L.holiday : "")
        : L.trendNone;
      field(root, "outlook").textContent = last ? pct(last.p_epidemic) : "–";
      field(root, "outlookNote").textContent = last ? fill(L.outlookNote, { w: +last.week.slice(6) }) : L.outlookNone;

      var meter = field(root, "meter");
      if (!meter.children.length) {
        meter.innerHTML = levels().map(function (l) {
          return '<div class="pp-flu-meter__seg" data-key="' + l.key + '"><div class="pp-flu-meter__bar" style="background:'
            + (l.band ? "var(" + l.band + ")" : "var(--pp-surface-raised)") + '"></div><div class="pp-flu-meter__name">' + esc(l.name)
            + '</div><div class="pp-flu-meter__from">' + (l.from ? L.from + " " + fmt(l.from, 0) : "0") + "</div></div>";
        }).join("");
      }
      Array.prototype.forEach.call(meter.children, function (el) {
        el.setAttribute("data-on", String(el.getAttribute("data-key") === st.level.key));
      });
    });
  }

  function renderChartChrome(root) {
    var key = root.getAttribute("data-indicator"), ind = D.indicators[key];
    var legend = field(root, "legend");
    legend.innerHTML = '<span><i class="pp-flu-key"></i>' + esc(fill(L.lgSeason, { s: season })) + "</span>"
      + '<span><i class="pp-flu-key pp-flu-key--actual"></i>' + L.lgActual + "</span>"
      + '<span><i class="pp-flu-key pp-flu-key--forecast"></i>' + L.lgForecast + "</span>"
      + '<span><i class="pp-flu-key pp-flu-key--past"></i>' + L.lgPast + "</span>"
      + '<span><i class="pp-flu-key pp-flu-key--threshold"></i>' + L.lgThreshold + "</span>";

    var now = field(root, "now");
    if (now) {
      var v = ind.history[season][k], tr = trendAt(ind, season, k), thr = ind.thresholds.epidemic;
      now.innerHTML = fill(L.ariNow, {
        v: "<b>" + fmt(v, 0) + "</b>", ab: v >= thr ? L.above : L.below, t: fmt(thr, 0),
        tr: tr ? " · " + ARROWS[tr.category] + " " + L.trend[tr.category] : "",
        s: pct(ILI.history[season][k] / v, 1)
      });
    }

    /* Pozor: panel metodiky je vnořený v kartě a má vlastní [data-f="table"] —
       týdenní tabulka grafu má proto jiné jméno pole. */
    var table = field(root, "weekTable");
    if (table) {
      table.innerHTML = '<table class="pp-table"><thead><tr><th>' + L.colWeek + '</th><th class="l">' + L.colRange + "</th><th>"
        + L.colIliT + '</th><th class="l">' + L.colBandName + "</th><th>" + L.colAriT + "</th></tr></thead><tbody>"
        + ILI.history[season].map(function (x, i) {
          return "<tr><td>" + W[i] + "/" + weekYear(season, i) + '</td><td class="l">' + weekRange(season, i) + "</td><td>" + fmt(x)
            + '</td><td class="l">' + levelOf(x).name + "</td><td>" + fmt(ARI.history[season][i], 0) + "</td></tr>";
        }).join("") + "</tbody></table>";
    }
  }

  function renderOutlook() {
    roots("outlook").forEach(function (root) {
      var fi = ILI.forecast.latest, byWeek = {};
      ARI.forecast.latest.weeks.forEach(function (w) { byWeek[w.week] = w; });
      var last = ILI.current.week;
      field(root, "lede").textContent = fill(L.nowLede, {
        today: new Date().toLocaleDateString(LOCALE), round: new Date(fi.round).toLocaleDateString(LOCALE),
        w: weekName(last), range: rangeOf(keyMonday(last))
      });
      field(root, "table").innerHTML = "<thead><tr><th>" + L.colWeek + '</th><th class="l">' + L.colRange + '</th><th class="l">' + L.colRel
        + "</th><th>" + L.colIli + "</th><th>" + L.colIliBand + '</th><th class="l">' + fill(L.colIliAbove, { t: fmt(T.epidemic, 0) })
        + "</th><th>" + L.colAri + "</th><th>" + L.colAriBand + "</th></tr></thead><tbody>"
        + fi.weeks.map(function (w) {
          var a = byWeek[w.week], rel = relativeWeek(w.week);
          return "<tr" + (rel === L.rel[0] ? ' class="pp-flu-now"' : "") + "><td>" + weekName(w.week) + '</td><td class="l">'
            + rangeOf(keyMonday(w.week)) + '</td><td class="l">' + rel + "</td><td>" + fmt(w.q500) + "</td><td>" + fmt(w.q025) + "–" + fmt(w.q975)
            + '</td><td class="l">' + probBar(w.p_epidemic) + "</td><td>" + (a ? fmt(a.q500, 0) : "–") + "</td><td>"
            + (a ? fmt(a.q025, 0) + "–" + fmt(a.q975, 0) : "–") + "</td></tr>";
        }).join("") + "</tbody>";
    });
  }

  function renderReplay() {
    roots("replay").forEach(function (root) {
      var fc = forecastAt(ILI, season, k), lede = field(root, "lede"), table = field(root, "table");
      if (!fc) { lede.textContent = L.replayNone; table.innerHTML = ""; return; }
      lede.textContent = fill(L.replayLede, { round: new Date(fc.round).toLocaleDateString(LOCALE) });
      table.innerHTML = "<thead><tr><th>" + L.colWeek + '</th><th class="l">' + L.colRange + "</th><th>" + L.colMedian + "</th><th>" + L.colBand
        + '</th><th class="l">' + fill(L.colAbove, { t: fmt(T.epidemic, 0) }) + "</th><th>" + L.colActual + "</th></tr></thead><tbody>"
        + fc.weeks.map(function (w) {
          var i = keyToIdx(season, w.week), seen = i >= 0 ? ILI.history[season][i] : null;
          return "<tr><td>" + weekName(w.week) + '</td><td class="l">' + rangeOf(keyMonday(w.week)) + "</td><td>" + fmt(w.q500) + "</td><td>"
            + fmt(w.q025) + "–" + fmt(w.q975) + '</td><td class="l">' + probBar(w.p_epidemic) + "</td><td>"
            + (seen !== null && seen !== undefined ? fmt(seen) : L.unknown) + "</td></tr>";
        }).join("") + "</tbody>";
    });
  }

  function renderStatic() {
    roots("seasons").forEach(function (root) {
      field(root, "table").innerHTML = "<thead><tr><th>" + L.colSeason + "</th><th>" + L.colPeak + '</th><th class="l">' + L.colPeakWeek
        + '</th><th class="l">' + L.colIntensity + "</th></tr></thead><tbody>"
        + ILI.seasons_used.slice().reverse().map(function (s) {
          var i = peakIdx(s), peak = ILI.history[s][i], level = levelOf(peak);
          return "<tr><td>" + s + "</td><td>" + fmt(peak, 0) + '</td><td class="l">' + weekRange(s, i) + '</td><td class="l">'
            + swatch(level) + esc(level.name) + "</td></tr>";
        }).join("") + "</tbody>";
    });

    roots("backtest").forEach(function (root) {
      field(root, "table").innerHTML = "<thead><tr><th>" + L.colSaid + "</th><th>" + L.colCases + "</th><th>" + L.colUp + "</th></tr></thead><tbody>"
        + Object.keys(ILI.trend.backtest).map(function (c) {
          var b = ILI.trend.backtest[c];
          return "<tr><td>" + ARROWS[c] + " " + L.trend[c] + "</td><td>" + b.n + "</td><td>" + pct(b.next_week_up) + "</td></tr>";
        }).join("") + "</tbody>";
    });

    roots("evaluation").forEach(function (root) {
      var ev = ILI.forecast.evaluation;
      function versus(e) {
        return e.relative_wis < 1 ? fill(L.better, { p: pct(1 - e.relative_wis) }) : fill(L.worse, { p: pct(e.relative_wis - 1) });
      }
      field(root, "table").innerHTML = "<thead><tr><th>" + L.colLead + "</th><th>" + L.colN + "</th><th>" + L.colRef + "</th><th>" + L.col50
        + "</th><th>" + L.col95 + "</th></tr></thead><tbody>"
        + Object.keys(ev.by_lead).map(function (lead) {
          var e = ev.by_lead[lead];
          return "<tr><td>" + L.leads[lead] + "</td><td>" + e.n + "</td><td>" + versus(e) + "</td><td>" + pct(e.coverage_50)
            + "</td><td>" + pct(e.coverage_95) + "</td></tr>";
        }).join("") + "</tbody>";
      field(root, "lede").textContent = fill(L.evText, {
        list: Object.keys(ev.by_season).map(function (s) {
          return fill(L.evSeason, { s: s, rel: versus(ev.by_season[s]), c: pct(ev.by_season[s].coverage_95) });
        }).join("; ")
      });
    });

    roots("excluded").forEach(function (root) {
      field(root, "lede").textContent = "";
      field(root, "table").innerHTML = "<tbody>" + Object.keys(ILI.seasons_excluded).map(function (s) {
        return '<tr><td>' + s + '</td><td class="l pp-flu-wrap">' + esc(ILI.seasons_excluded[s]) + "</td></tr>";
      }).join("") + "</tbody>";
    });

    /* Čísla v textu panelů metodiky — <span data-pp-flu-val="ili.validation.sensitivity"></span>.
       Berou se z dat, ne z textu stránky: po přepočtu pipeline nesmí text tvrdit něco jiného. */
    Array.prototype.forEach.call(document.querySelectorAll("[data-pp-flu-val]"), function (el) {
      var value = el.getAttribute("data-pp-flu-val").split(".").reduce(function (o, key) { return o && o[key]; }, D.indicators);
      if (value === undefined || value === null) return;
      el.textContent = el.getAttribute("data-as") === "count" ? fmt(value, 0) : pct(value);
    });

    roots("chart").forEach(function (root) {
      var ev = ILI.forecast.evaluation.overall, note = field(root, "forecastNote");
      if (note && root.getAttribute("data-indicator") === "ili") {
        note.textContent = fill(L.fcNote, { n: ev.n, c95: pct(ev.coverage_95), c50: pct(ev.coverage_50) });
      }
      var origin = root.querySelector("[data-pp-origin]");
      if (origin) origin.textContent = L.origin + " · " + D.indicators[root.getAttribute("data-indicator")].sources.join(" + ");
    });
  }

  function renderMoving() {
    renderStatus();
    roots("chart").forEach(renderChartChrome);
    renderReplay();
  }

  function wireControls() {
    roots("chart").forEach(function (root) {
      var select = field(root, "season"), slider = field(root, "week"), toggle = field(root, "tableToggle");
      if (select) {
        select.innerHTML = selectableSeasons().reverse().map(function (s) {
          return '<option value="' + s + '">' + s + (ILI.seasons_used.indexOf(s) < 0 ? L.outside : "") + "</option>";
        }).join("");
        select.value = season;
        select.addEventListener("change", function () {
          season = select.value;
          k = season === ILI.current.season ? lastWeekIdx(season) : demoWeek(season);
          slider.max = season === ILI.current.season ? lastWeekIdx(season) : W.length - 1;
          slider.value = k;
          roots("chart").forEach(drawChart); renderMoving();
        });
      }
      if (slider) {
        slider.value = k;
        slider.addEventListener("input", function () {
          k = +slider.value;
          roots("chart").forEach(function (r) {
            var key = r.getAttribute("data-indicator");
            charts[key].data.datasets = datasets(D.indicators[key]);
            charts[key].update("none");
          });
          renderMoving();
        });
      }
      if (toggle) {
        toggle.addEventListener("click", function () {
          var wrap = root.querySelector(".pp-table-wrap"), open = wrap.getAttribute("data-open") === "true";
          wrap.setAttribute("data-open", open ? "false" : "true");
          toggle.setAttribute("aria-expanded", open ? "false" : "true");
          toggle.textContent = open ? L.table : L.hideTable;
        });
      }
    });
  }

  /* ---------------- Start ---------------- */

  function start(data) {
    D = data; ILI = D.indicators.ili; ARI = D.indicators.ari; W = D.season_weeks; T = ILI.thresholds;
    /* V sezóně se ukazuje běžící sezóna a její poslední týden. Mimo ni (léto,
       začátek podzimu) by stránka byla prázdná — proto poslední úplná sezóna. */
    var running = ILI.current.season;
    if (ILI.history[running] && lastWeekIdx(running) >= 0) {
      season = running;
      k = lastWeekIdx(running);
    } else {
      season = ILI.seasons_used[ILI.seasons_used.length - 1];
      k = demoWeek(season);
    }
    if (window.Chart) roots("chart").forEach(drawChart);
    wireControls();
    renderStatic();
    renderOutlook();
    renderMoving();
  }

  function init() {
    var first = document.querySelector("[data-pp-flu]");
    if (!first) return;
    fetch(first.getAttribute("data-src"))
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(start)
      .catch(function (error) {
        console.error("pp-flu:", error);
        Array.prototype.forEach.call(document.querySelectorAll("[data-pp-flu]"), function (root) {
          root.innerHTML = '<p class="pp-note">' + L.error + "</p>";
        });
      });
  }

  // Přebarvení při přepnutí motivu — stejný signál jako v pp-charts.js.
  new MutationObserver(function () {
    if (D && window.Chart) roots("chart").forEach(drawChart);
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-bs-theme"] });

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})(window, document);
