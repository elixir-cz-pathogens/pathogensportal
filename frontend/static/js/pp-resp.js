/* Respiratory blocks: the week at a glance, rates by age, influenza types.
 *
 * Page parts ({{< resp part="…" >}}) each read one JSON from pathogensportal-db
 * (compute_resp.py): resp_overview.json, resp_age.json, flu_types.json. Nothing
 * is computed here — values, the comment above each block and the facts it was
 * composed from arrive ready. The script draws and wires the controls.
 *
 * The comment is shown as it arrives (`comment.cs` / `comment.en`). Whether a
 * template or a language model wrote it is stated in `comment.origin` and shown
 * as a badge; the expandable list under it gives the facts behind each sentence.
 *
 * A block whose JSON is missing removes itself: the page then looks as it did
 * before the block existed, which is what an older data release must produce.
 *
 * Colours come from tokens in dashboards.css. Chips use neutral ink only — the
 * status colours (green/orange/red) are reserved for Signals.
 */
(function (window, document) {
  "use strict";

  var EN = (document.documentElement.lang || "").indexOf("en") === 0;
  var LANG = EN ? "en" : "cs";
  var LOCALE = EN ? "en-GB" : "cs-CZ";

  var L = EN ? {
    lastWeek: "Latest reported week",
    auto: "text composed automatically from the data", model: "text written by a language model from the data below",
    per: "per 100,000 population", samples: "{d} of {n} specimens", lowN: "too few specimens", vsPrev: "{c} vs the week before",
    holiday: "holiday week", provisional: "provisional",
    unitCases: "new cases per week", unitPositive: "of specimens positive",
    testing: "depends on how much is tested",
    unitAdmissions: "new admissions per week", withInfection: "with the infection, not necessarily because of it",
    dir: { higher: "higher than the week before", lower: "lower than the week before", same: "unchanged from the week before" },
    asof: "Curves: the last {n} weeks, {a} to {b}, the same time axis in every tile. ILI and ARI are not reported over the summer, so their curve starts with the first autumn reports. Hollow end point = provisional or holiday week.",
    byAge: " by age", ageSub: "week of {w} · per 100,000 population of the age group · Czechia",
    pos: { above: "more than in previous seasons", within: "similar to previous seasons", below: "less than in previous seasons" },
    rangeCap: "previous seasons, same week: {lo} to {hi}", noRange: "no comparison with previous seasons yet",
    lgNow: "this week", lgRange: "range of the previous {n} seasons in the same week",
    chartTitle: "{g}: season {s} against previous seasons",
    lgSeason: "season {s}", lgBand: "range of seasons {a}–{b}", lgHoliday: "week with a public or school holiday",
    ttNow: "{s}: {v}", ttNone: "{s}: no data yet", ttBand: "previous seasons: {lo} to {hi}", ttHoliday: "holiday week — fewer reports",
    colGroup: "Age group", colSame: "Same week, {a}–{b}",
    typesTitle: "Influenza detections by type and subtype · season {s}", lgProv: "provisional weeks (lighter)",
    total: "total", colWeek: "Week",
    subtyped: "subtype determined for {a} of {b} influenza A detections ({p})", running: " · season in progress",
    tooFew: "too few specimens — share not drawn",
    origin: "static data snapshot", table: "Table", hideTable: "Hide table",
    ariaCard: "{g}: {v} per 100,000 in the week of {w}; previous seasons in the same week {lo} to {hi}.",
    ariaCardNoBand: "{g}: {v} per 100,000 in the week of {w}.",
    ariaChart: "{i}, age group {g}: weekly rate in season {s} against the range of previous seasons. Values are in the table below.",
    ariaShare: "Season {s}: A(H1)pdm09 {a}, A(H3) {b} of {n} subtyped detections"
  } : {
    lastWeek: "Poslední hlášený týden",
    auto: "text sestavený automaticky z dat", model: "text napsal jazykový model z údajů níže",
    per: "na 100 tis. obyvatel", samples: "{d} z {n} vzorků", lowN: "málo vzorků", vsPrev: "{c} proti předchozímu týdnu",
    holiday: "sváteční týden", provisional: "předběžné",
    unitCases: "nových případů za týden", unitPositive: "vzorků pozitivních",
    testing: "závisí na tom, kolik se testuje",
    unitAdmissions: "nově přijatých za týden", withInfection: "s infekcí, ne nutně kvůli ní",
    dir: { higher: "vyšší než minulý týden", lower: "nižší než minulý týden", same: "beze změny proti minulému týdnu" },
    asof: "Křivky: posledních {n} týdnů, od {a} do {b}, ve všech dlaždicích stejná časová osa. V létě se ILI a ARI nehlásí, jejich křivka proto začíná až prvním podzimním hlášením. Prázdný koncový bod = předběžný nebo sváteční týden.",
    byAge: " podle věku", ageSub: "týden {w} · na 100 tis. obyvatel dané věkové skupiny · celá ČR",
    pos: { above: "víc než v předchozích sezónách", within: "podobně jako v předchozích sezónách", below: "méně než v předchozích sezónách" },
    rangeCap: "předchozí sezóny ve stejném týdnu: {lo} až {hi}", noRange: "srovnání s předchozími sezónami zatím není",
    lgNow: "tento týden", lgRange: "rozpětí předchozích {n} sezón ve stejném týdnu",
    chartTitle: "{g}: sezóna {s} proti předchozím sezónám",
    lgSeason: "sezóna {s}", lgBand: "rozpětí sezón {a}–{b}", lgHoliday: "týden se svátkem nebo prázdninami",
    ttNow: "{s}: {v}", ttNone: "{s}: zatím bez dat", ttBand: "předchozí sezóny: {lo} až {hi}", ttHoliday: "sváteční týden — hlásí se méně",
    colGroup: "Věková skupina", colSame: "Stejný týden {a}–{b}",
    typesTitle: "Záchyty chřipky podle typu a subtypu · sezóna {s}", lgProv: "předběžné týdny (světlejší)",
    total: "celkem", colWeek: "Týden",
    subtyped: "subtyp určen u {a} z {b} záchytů chřipky A ({p})", running: " · sezóna běží",
    tooFew: "málo vzorků — podíl se nekreslí",
    origin: "statický snímek dat", table: "Tabulka", hideTable: "Skrýt tabulku",
    ariaCard: "{g}: v týdnu {w} {v} na 100 tis.; předchozí sezóny ve stejném týdnu {lo} až {hi}.",
    ariaCardNoBand: "{g}: v týdnu {w} {v} na 100 tis.",
    ariaChart: "{i}, věková skupina {g}: týdenní nemocnost v sezóně {s} proti rozpětí předchozích sezón. Hodnoty jsou v tabulce pod grafem.",
    ariaShare: "Sezóna {s}: A(H1)pdm09 {a}, A(H3) {b} z {n} subtypovaných záchytů"
  };
  var ARROWS = { growing: "↑", likely_growing: "↗", stable: "→", likely_declining: "↘", declining: "↓" };

  function fill(template, values) {
    return template.replace(/\{(\w+)\}/g, function (_, key) { return values[key]; });
  }
  function fmt(value, digits) {
    if (value === null || value === undefined) return "–";
    var d = digits === undefined ? 1 : digits;
    return value.toLocaleString(LOCALE, { minimumFractionDigits: d, maximumFractionDigits: d });
  }
  function pct(value, digits) { return fmt(value, digits) + (EN ? "%" : " %"); }
  function esc(text) {
    return String(text).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }
  function pick(obj, key) { return (EN && obj[key + "_en"]) || obj[key]; }
  function token(name, fallback) {
    var probe = document.querySelector(".pp-viz") || document.body;
    return (getComputedStyle(probe).getPropertyValue(name) || "").trim() || fallback;
  }
  function withAlpha(hex, alpha) {
    var m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
    return m ? "rgba(" + parseInt(m[1], 16) + "," + parseInt(m[2], 16) + "," + parseInt(m[3], 16) + "," + alpha + ")" : hex;
  }
  function field(root, name) { return root.querySelector('[data-f="' + name + '"]'); }

  /* ---------------- Calendar weeks ----------------
   * Weeks are shown to the reader as dates ("2.–8. 11. 2026"), never as week
   * numbers; the ISO key ("2026-W45") stays in the data only. */

  var MONTHS = EN ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                  : ["led", "úno", "bře", "dub", "kvě", "čvn", "čvc", "srp", "zář", "říj", "lis", "pro"];

  function monday(key) {
    var year = +key.slice(0, 4), week = +key.slice(6), jan4 = new Date(Date.UTC(year, 0, 4));
    return new Date(Date.UTC(year, 0, 4 - ((jan4.getUTCDay() + 6) % 7) + (week - 1) * 7));
  }
  function sunday(key) { return new Date(monday(key).getTime() + 6 * 864e5); }
  function day(d) { return EN ? d.getUTCDate() + " " + MONTHS[d.getUTCMonth()] : d.getUTCDate() + ".\u00a0" + (d.getUTCMonth() + 1) + "."; }
  /** "2.–8. 11." / "2–8 Nov"; across months "26. 10. – 1. 11." / "26 Oct – 1 Nov". */
  function weekShort(key) {
    var a = monday(key), b = sunday(key);
    if (a.getUTCMonth() !== b.getUTCMonth()) return day(a) + " – " + day(b);
    return EN ? a.getUTCDate() + "–" + day(b) : a.getUTCDate() + ".–" + day(b);
  }
  function weekFull(key) { return weekShort(key) + (EN ? " " : "\u00a0") + sunday(key).getUTCFullYear(); }
  /** Month name on the first week that starts in it, empty otherwise — for the X axis. */
  function monthTick(weeks, i) {
    var m = monday(weeks[i]).getUTCMonth();
    return (i === 0 || monday(weeks[i - 1]).getUTCMonth() !== m) ? MONTHS[m] : "";
  }

  /* ---------------- Comment above a block ---------------- */

  function renderComment(root, block, week) {
    var c = block.comment, facts = block.facts;
    field(root, "eyebrow").textContent = L.lastWeek + ": " + weekFull(week);
    field(root, "badge").textContent = c.origin === "template" ? L.auto : L.model;
    field(root, "comment").textContent = c[LANG];
    var byId = {};
    facts.facts.forEach(function (f) { byId[f.id] = f; });
    function filled(text) {
      return text.replace(/\{(\w+)\}/g, function (_, key) { return facts.values[key] ? facts.values[key][LANG] : ""; });
    }
    field(root, "sources").innerHTML = c.sentences.map(function (s) {
      return "<li><span>" + esc(s[LANG]) + "</span><ul>" + s.facts.map(function (id) {
        return byId[id] ? "<li>" + esc(filled(byId[id][LANG])) + "</li>" : "";
      }).join("") + "</ul></li>";
    }).join("");
  }

  function wireTable(root) {
    var button = field(root, "tableToggle"), wrap = field(root, "table");
    if (!button || button.getAttribute("data-wired")) return;
    button.setAttribute("data-wired", "1");
    button.addEventListener("click", function () {
      var open = wrap.getAttribute("data-open") !== "true";
      wrap.setAttribute("data-open", String(open));
      button.setAttribute("aria-expanded", String(open));
      button.textContent = open ? L.hideTable : L.table;
    });
  }
  function setOrigin(root, sources) {
    var el = root.querySelector("[data-pp-origin]");
    if (el) el.textContent = L.origin + " · " + sources;
  }
  function segButtons(host, items, active, onPick) {
    host.innerHTML = items.map(function (it) {
      return '<button type="button" data-key="' + esc(it.key) + '" aria-pressed="' + (it.key === active) + '">' + esc(it.label) + "</button>";
    }).join("");
    Array.prototype.forEach.call(host.children, function (b) {
      b.addEventListener("click", function () { onPick(b.getAttribute("data-key")); });
    });
  }

  /* ---------------- 1. The week at a glance ---------------- */

  function spark(series, hollowLast) {
    var W = 168, H = 40, p = 6, n = series.length, max = 0.0001;
    series.forEach(function (s) { if (s.value !== null && s.value > max) max = s.value; });
    function x(i) { return p + i * (W - 2 * p) / (n - 1); }
    function y(v) { return H - p - v / max * (H - 2 * p); }
    var out = '<line x1="' + p + '" x2="' + (W - p) + '" y1="' + (H - p) + '" y2="' + (H - p) + '" class="pp-resp-spark__base"/>';
    // Only the last unbroken run of weeks is drawn. ILI and ARI are not reported
    // over the summer; a stray week before that gap would show as a detached dot
    // and make the curve look broken. All tiles keep the same time axis, so such
    // a curve simply starts later.
    var run = [], end = n - 1;
    while (end >= 0 && series[end].value === null) end--;       // latest week may not be reported yet
    var start = end + 1;
    while (start > 0 && series[start - 1].value !== null) start--;
    for (var i = start; i <= end; i++) run.push(x(i).toFixed(1) + "," + y(series[i].value).toFixed(1));
    if (run.length > 1) out += '<polyline points="' + run.join(" ") + '" class="pp-resp-spark__line"/>';
    if (end >= 0) {
      out += '<circle cx="' + x(end).toFixed(1) + '" cy="' + y(series[end].value).toFixed(1) + '" r="4" class="pp-resp-spark__end'
        + (hollowLast ? " pp-resp-spark__end--hollow" : "") + '"/>';
    }
    return '<svg class="pp-resp-spark" viewBox="0 0 ' + W + " " + H + '" aria-hidden="true">' + out + "</svg>";
  }
  function chip(text, hollow) {
    return '<span class="pp-resp-chip">' + (hollow ? '<i class="pp-resp-chip__ring"></i>' : "") + esc(text) + "</span>";
  }

  function drop(root) {
    // On the home page the heading lives in a wrapper; an empty heading must not stay behind.
    var wrap = root.closest ? root.closest("[data-pp-resp-wrap]") : null;
    (wrap || root).remove();
  }

  function renderOverview(root, D) {
    var maxAge = +root.getAttribute("data-max-age");
    if (maxAge && (Date.now() - sunday(D.week).getTime()) / 864e5 > maxAge) { drop(root); return; }
    var only = (root.getAttribute("data-tiles") || "").split(",").filter(Boolean);
    var links = {};
    try { links = JSON.parse(root.getAttribute("data-links") || "{}"); } catch (e) { links = {}; }
    renderComment(root, D, D.week);
    var values = D.facts.values;
    field(root, "tiles").innerHTML = D.tiles.filter(function (t) { return !only.length || only.indexOf(t.id) >= 0; }).map(function (t) {
      var chips = "", foot = weekShort(t.week), value, unit;
      // A week-on-week change next to a holiday week is a reporting artefact, so it is not shown.
      var comparable = !t.holiday && !t.prev_holiday;
      if (t.unit === "count") {
        value = fmt(t.value, 0); unit = L.unitCases;
        chips += chip(L.testing);
        if (t.change_pct !== null && t.prev_week) {
          foot += " · " + fill(L.vsPrev, { c: (t.change_pct >= 0 ? "+" : "−") + pct(Math.abs(t.change_pct)) });
        }
      } else if (t.unit === "admissions") {
        // Hospital admissions (daily ÚZIS e-surveillance): a count like the cases
        // tile, but with its own unit and caveat — "depends on testing" is not true here.
        value = fmt(t.value, 0); unit = L.unitAdmissions;
        chips += chip(L.withInfection);
        if (t.change_pct !== null && t.prev_week) {
          foot += " · " + fill(L.vsPrev, { c: (t.change_pct >= 0 ? "+" : "−") + pct(Math.abs(t.change_pct)) });
        }
      } else if (t.unit === "percent") {
        value = t.value === null ? "–" : pct(t.value); unit = L.unitPositive;
        if (t.value === null) chips += chip(L.lowN);
        else if (t.direction) chips += chip(L.dir[t.direction]);
        if (t.provisional) chips += chip(L.provisional, true);
        foot += " · " + fill(L.samples, { d: fmt(t.detections, 0), n: fmt(t.tests, 0) });
      } else {
        value = fmt(t.value); unit = L.per;
        if (t.level) chips += chip((values.level ? values.level[LANG] : "") + " (" + fmt(t.threshold) + ")");
        if (t.trend && values.trend) chips += chip(ARROWS[t.trend.category] + " " + values.trend[LANG]);
        if (t.holiday) chips += chip(L.holiday, true);
        if (comparable && t.change_pct !== null && t.prev_week) {
          foot += " · " + fill(L.vsPrev, { c: (t.change_pct >= 0 ? "+" : "−") + pct(Math.abs(t.change_pct)) });
        }
      }
      // A tile links to its dashboard, except on that dashboard itself.
      var href = links[t.id] && links[t.id] !== window.location.pathname ? links[t.id] : null;
      var open = href ? '<a class="pp-stat pp-resp-tile pp-resp-tile--link" href="' + esc(href) + '">' : '<div class="pp-stat pp-resp-tile">';
      return open + '<span class="pp-stat__label">' + esc(pick(t, "label")) + "</span>"
        + '<span class="pp-stat__value">' + value + ' <small>' + unit + "</small></span>"
        + '<span class="pp-resp-chips">' + chips + "</span>"
        + spark(t.series, !!(t.provisional || t.holiday))
        + '<span class="pp-stat__note">' + esc(foot) + "</span>" + (href ? "</a>" : "</div>");
    }).join("");
    var source = field(root, "source");
    if (source) {
      D.facts.facts.forEach(function (f) { if (f.id === "source") source.textContent = f[LANG]; });
    }
    field(root, "asof").textContent = fill(L.asof, { n: D.weeks.length, a: day(monday(D.weeks[0])), b: day(sunday(D.weeks[D.weeks.length - 1])) + (EN ? " " : "\u00a0") + sunday(D.weeks[D.weeks.length - 1]).getUTCFullYear() });
  }

  /* ---------------- 2. Rates by age ----------------
   * Two layers, because four small season charts next to each other could not
   * be read: (1) one card per age group answers "is this more or less than
   * usual for this week" with a dot on the range of previous seasons; (2) one
   * large chart shows the whole season for the group picked on a card. */

  var ageChart = null, ageState = null;

  function rangeBar(now) {
    var top = Math.max(now.value, now.max === null ? 0 : now.max) * 1.12 || 1;
    function at(v) { return (100 * v / top).toFixed(1) + "%"; }
    return '<div class="pp-resp-range" aria-hidden="true">'
      + (now.min === null ? "" : '<i class="pp-resp-range__band" style="left:' + at(now.min) + ";width:" + at(now.max - now.min) + '"></i>')
      + '<i class="pp-resp-range__dot" style="left:' + at(now.value) + '"></i></div>';
  }

  function renderAge(root, D) {
    if (!ageState) ageState = { key: D.indicators.ari ? "ari" : Object.keys(D.indicators)[0], group: null };
    var ind = D.indicators[ageState.key], W = D.weeks, idx = W.indexOf(D.last_week);
    var past = D.past_seasons, hasBand = past.length >= D.min_band_seasons;
    var groups = ind.groups.filter(function (g) { return g.id !== "total"; });
    if (!ageState.group || !groups.some(function (g) { return g.id === ageState.group; })) ageState.group = ind.top_group;
    var g = groups.filter(function (x) { return x.id === ageState.group; })[0];
    var muted = token("--pp-text-muted", "#77766f"), line = token("--pp-series-1", "#2a78d6");
    var surface = token("--pp-surface-raised", "#ffffff"), band = token("--pp-band-2", "#c3dcfa");

    renderComment(root, ind, D.last_week);
    field(root, "title").textContent = pick(ind, "label") + L.byAge;
    field(root, "subtitle").textContent = fill(L.ageSub, { w: weekFull(D.last_week) });
    segButtons(field(root, "switch"), Object.keys(D.indicators).sort().map(function (k) { return { key: k, label: k.toUpperCase() }; }),
      ageState.key, function (k) { ageState.key = k; renderAge(root, D); });

    var cards = field(root, "cards");
    cards.innerHTML = groups.map(function (x) {
      var n = x.now, aria = fill(n.min === null ? L.ariaCardNoBand : L.ariaCard,
        { g: pick(x, "label"), w: weekShort(D.last_week), v: fmt(n.value), lo: fmt(n.min), hi: fmt(n.max) });
      return '<button type="button" class="pp-resp-age" data-key="' + x.id + '" aria-pressed="' + (x.id === g.id) + '" aria-label="' + esc(aria) + '">'
        + '<span class="pp-resp-age__label">' + esc(pick(x, "label")) + "</span>"
        + '<span class="pp-resp-age__value">' + fmt(n.value) + " <small>" + L.per + "</small></span>"
        + '<span class="pp-resp-age__verdict">' + (n.position ? L.pos[n.position] : L.noRange) + "</span>"
        + rangeBar(n)
        + '<span class="pp-resp-age__range">' + (n.min === null ? "" : esc(fill(L.rangeCap, { lo: fmt(n.min), hi: fmt(n.max) }))) + "</span></button>";
    }).join("");
    Array.prototype.forEach.call(cards.children, function (b) {
      b.addEventListener("click", function () { ageState.group = b.getAttribute("data-key"); renderAge(root, D); });
    });
    field(root, "cardLegend").innerHTML = '<span><i class="pp-resp-key pp-resp-key--dot"></i>' + L.lgNow + "</span>"
      + (hasBand ? '<span><i class="pp-resp-key pp-resp-key--range"></i>' + esc(fill(L.lgRange, { n: past.length })) + "</span>" : "");

    field(root, "chartTitle").textContent = fill(L.chartTitle, { g: pick(g, "label"), s: D.season });
    field(root, "legend").innerHTML = '<span><i class="pp-flu-key pp-resp-key--line"></i>' + esc(fill(L.lgSeason, { s: D.season })) + "</span>"
      + (hasBand ? '<span><i class="pp-resp-key pp-resp-key--band"></i>' + esc(fill(L.lgBand, { a: past[0], b: past[past.length - 1] })) + "</span>" : "")
      + (g.current.some(function (v, i) { return v !== null && D.holiday[i]; })
          ? '<span><i class="pp-resp-key pp-resp-key--holiday"></i>' + L.lgHoliday + "</span>" : "");

    var canvas = root.querySelector(".pp-card__plot canvas");
    canvas.setAttribute("aria-label", fill(L.ariaChart, { i: ageState.key.toUpperCase(), g: pick(g, "label"), s: D.season }));
    if (ageChart) { ageChart.destroy(); ageChart = null; }
    if (window.Chart) {
      var top = 0;
      g.max.concat(g.current).forEach(function (v) { if (v !== null && v > top) top = v; });
      var radius = g.current.map(function (v, i) { return v !== null && i === idx ? 4.5 : 0; });
      // Holiday weeks are shaded behind the plot. Rings on the line made the
      // curve look interrupted; a stripe explains the dip and leaves the line whole.
      var stripe = withAlpha(token("--pp-text", "#0b0b0b"), 0.07);
      var holidayStripes = {
        id: "ppRespHolidays",
        beforeDatasetsDraw: function (chart) {
          var xs = chart.scales.x, a = chart.chartArea, half = (xs.getPixelForValue(1) - xs.getPixelForValue(0)) / 2;
          chart.ctx.save();
          chart.ctx.fillStyle = stripe;
          g.current.forEach(function (v, i) {
            if (v === null || !D.holiday[i]) return;
            var left = Math.max(a.left, xs.getPixelForValue(i) - half), right = Math.min(a.right, xs.getPixelForValue(i) + half);
            chart.ctx.fillRect(left, a.top, right - left, a.bottom - a.top);
          });
          chart.ctx.restore();
        }
      };
      ageChart = new window.Chart(canvas, {
        type: "line",
        plugins: [holidayStripes],
        data: {
          labels: W,
          datasets: [
            // The band spans the one week without a counterpart (week 53) instead of breaking.
            { data: g.max, borderWidth: 0, pointRadius: 0, pointHoverRadius: 0, fill: "+1", backgroundColor: band, spanGaps: true, tension: 0.25 },
            { data: g.min, borderWidth: 0, pointRadius: 0, pointHoverRadius: 0, fill: false, spanGaps: true, tension: 0.25 },
            { data: g.current, borderColor: line, borderWidth: 2.5, tension: 0, spanGaps: false,
              pointRadius: radius, pointHoverRadius: 6, pointBorderWidth: 2,
              pointBackgroundColor: line, pointBorderColor: surface, ppCurrent: true }
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false, animation: false,
          interaction: { mode: "index", intersect: false },
          layout: { padding: { top: 8, right: 8 } },
          scales: {
            x: { grid: { display: false }, border: { color: token("--pp-border", "#e2e1dc") },
                 ticks: { color: muted, font: { size: 11 }, maxRotation: 0, autoSkip: false,
                          callback: function (_, i) { return monthTick(W, i); } } },
            y: { min: 0, suggestedMax: top * 1.08, grid: { color: token("--pp-grid", "#ebeae6") }, border: { display: false },
                 ticks: { color: muted, font: { size: 11 }, maxTicksLimit: 6, callback: function (v) { return fmt(v, 0); } } }
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              displayColors: false, padding: 10, cornerRadius: 6,
              backgroundColor: token("--pp-text", "#0b0b0b"),
              titleColor: token("--pp-surface", "#fcfcfb"), bodyColor: token("--pp-surface", "#fcfcfb"),
              filter: function (item) { return !!item.dataset.ppCurrent; },
              callbacks: {
                title: function (items) { return items.length ? weekFull(W[items[0].dataIndex]) : ""; },
                label: function (item) {
                  var i = item.dataIndex, v = g.current[i], out = [];
                  out.push(v === null ? fill(L.ttNone, { s: D.season }) : fill(L.ttNow, { s: D.season, v: fmt(v) }));
                  if (g.min[i] !== null) out.push(fill(L.ttBand, { lo: fmt(g.min[i]), hi: fmt(g.max[i]) }));
                  if (D.holiday[i] && v !== null) out.push(L.ttHoliday);
                  return out;
                }
              }
            }
          }
        }
      });
    }

    var head = "<thead><tr><th>" + L.colGroup + "</th><th>" + weekShort(D.last_week) + "</th>"
      + (idx > 0 ? "<th>" + weekShort(W[idx - 1]) + "</th>" : "")
      + (hasBand ? "<th>" + esc(fill(L.colSame, { a: past[0], b: past[past.length - 1] })) + "</th>" : "") + "</tr></thead>";
    field(root, "table").innerHTML = '<table class="pp-table">' + head + "<tbody>" + ind.groups.map(function (x) {
      return "<tr><td>" + esc(pick(x, "label")) + "</td><td>" + fmt(x.current[idx]) + "</td>"
        + (idx > 0 ? "<td>" + fmt(x.current[idx - 1]) + "</td>" : "")
        + (hasBand ? "<td>" + (x.min[idx] === null ? "–" : fmt(x.min[idx]) + " – " + fmt(x.max[idx])) + "</td>" : "") + "</tr>";
    }).join("") + "</tbody></table>";
    wireTable(root);
    setOrigin(root, "ECDC ERVISS");
  }

  /* ---------------- 3. Influenza types and subtypes ---------------- */

  var typeChart = null, typeState = null;
  var TYPE_TOKENS = { h1: "--pp-series-1", h3: "--pp-series-2", b: "--pp-series-3", a_unk: "--pp-series-rest" };

  function renderTypes(root, D) {
    if (!typeState) typeState = { season: D.season };
    var block = D.weekly[typeState.season], weeks = block.weeks, rows = block.rows, prov = block.provisional;
    var muted = token("--pp-text-muted", "#77766f"), surface = token("--pp-surface-raised", "#ffffff");

    renderComment(root, D, D.last_week);
    field(root, "title").textContent = fill(L.typesTitle, { s: typeState.season });
    segButtons(field(root, "switch"), Object.keys(D.weekly).map(function (s) { return { key: s, label: s }; }),
      typeState.season, function (s) { typeState.season = s; renderTypes(root, D); });
    field(root, "legend").innerHTML = D.categories.map(function (c) {
      return '<span><i class="pp-resp-key" style="background:var(' + TYPE_TOKENS[c.id] + ')"></i>' + esc(pick(c, "label")) + "</span>";
    }).join("") + (prov.length ? '<span><i class="pp-resp-key pp-resp-key--prov"></i>' + L.lgProv + "</span>" : "");

    function total(i) {
      return rows[i] ? D.categories.reduce(function (a, c) { return a + rows[i][c.id]; }, 0) : null;
    }
    if (typeChart) { typeChart.destroy(); typeChart = null; }
    if (window.Chart) {
      typeChart = new window.Chart(root.querySelector(".pp-card__plot canvas"), {
        type: "bar",
        data: {
          labels: weeks,
          datasets: D.categories.map(function (c) {
            var colour = token(TYPE_TOKENS[c.id], "#8b8a83");
            return {
              label: pick(c, "label"), ppKey: c.id,
              data: rows.map(function (r) { return r ? r[c.id] : null; }),
              backgroundColor: weeks.map(function (w) { return prov.indexOf(w) >= 0 ? withAlpha(colour, 0.45) : colour; }),
              borderColor: surface, borderWidth: { top: 2 }, borderRadius: 2, maxBarThickness: 22
            };
          })
        },
        options: {
          responsive: true, maintainAspectRatio: false, animation: false,
          interaction: { mode: "index", intersect: false },
          layout: { padding: { top: 6, right: 6 } },
          scales: {
            x: { stacked: true, grid: { display: false }, border: { color: token("--pp-border", "#e2e1dc") },
                 ticks: { color: muted, font: { size: 11 }, maxRotation: 0, autoSkip: false,
                          callback: function (_, i) { return monthTick(weeks, i); } } },
            y: { stacked: true, min: 0, grid: { color: token("--pp-grid", "#ebeae6") }, border: { display: false },
                 ticks: { color: muted, font: { size: 11 }, precision: 0, maxTicksLimit: 6, callback: function (v) { return fmt(v, 0); } } }
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              padding: 10, cornerRadius: 6, boxWidth: 9, boxHeight: 9,
              backgroundColor: token("--pp-text", "#0b0b0b"),
              titleColor: token("--pp-surface", "#fcfcfb"), bodyColor: token("--pp-surface", "#fcfcfb"),
              footerColor: token("--pp-surface", "#fcfcfb"),
              filter: function (item) { return rows[item.dataIndex] !== null; },
              callbacks: {
                title: function (items) {
                  if (!items.length) return "";
                  var w = weeks[items[0].dataIndex];
                  return weekFull(w) + (prov.indexOf(w) >= 0 ? " · " + L.provisional : "");
                },
                label: function (item) { return " " + item.dataset.label + ": " + fmt(item.parsed.y, 0); },
                labelColor: function (item) {
                  var colour = token(TYPE_TOKENS[item.dataset.ppKey], "#8b8a83");
                  return { borderColor: colour, backgroundColor: colour };
                },
                footer: function (items) { return items.length ? L.total + ": " + fmt(total(items[0].dataIndex), 0) : ""; }
              }
            }
          }
        }
      });
    }

    field(root, "table").innerHTML = '<table class="pp-table"><thead><tr><th>' + L.colWeek + "</th>" + D.categories.map(function (c) {
      return "<th>" + esc(pick(c, "label")) + "</th>";
    }).join("") + "<th>" + L.total + "</th></tr></thead><tbody>" + weeks.map(function (w, i) {
      if (!rows[i]) return "";
      return "<tr><td>" + weekFull(w) + (prov.indexOf(w) >= 0 ? " *" : "") + "</td>" + D.categories.map(function (c) {
        return "<td>" + fmt(rows[i][c.id], 0) + "</td>";
      }).join("") + "<td>" + fmt(total(i), 0) + "</td></tr>";
    }).join("") + "</tbody></table>" + (prov.length ? '<p class="pp-note">* ' + L.provisional + "</p>" : "");
    wireTable(root);
    setOrigin(root, "ECDC ERVISS");

    field(root, "shareLegend").innerHTML = D.categories.filter(function (c) { return c.id === "h1" || c.id === "h3"; }).map(function (c) {
      return '<span><i class="pp-resp-key" style="background:var(' + TYPE_TOKENS[c.id] + ')"></i>' + esc(pick(c, "label")) + "</span>";
    }).join("");
    field(root, "shares").innerHTML = D.season_totals.map(function (s) {
      var info = fill(L.subtyped, { a: fmt(s.a_subtyped, 0), b: fmt(s.a_total, 0), p: s.share_subtyped === null ? "–" : pct(s.share_subtyped) })
        + (s.complete ? "" : L.running);
      var bar;
      if (s.share_h1 === null) {
        bar = '<div class="pp-resp-share__none">' + L.tooFew + "</div>";
      } else {
        // Both labels are rounded from one number, so they always add up to 100.
        var h1 = Math.round(s.share_h1), lab = function (p) { return p >= 18 ? pct(p, 0) : ""; };
        bar = '<div class="pp-resp-share__bar" role="img" aria-label="' + esc(fill(L.ariaShare,
            { s: s.season, a: pct(h1, 0), b: pct(100 - h1, 0), n: fmt(s.a_subtyped, 0) })) + '">'
          + (s.h1 ? '<div class="pp-resp-share__h1" style="flex:' + s.h1 + ' 1 0" title="A(H1)pdm09: ' + fmt(s.h1, 0) + '">' + lab(h1) + "</div>" : "")
          + (s.h3 ? '<div class="pp-resp-share__h3" style="flex:' + s.h3 + ' 1 0" title="A(H3): ' + fmt(s.h3, 0) + '">' + lab(100 - h1) + "</div>" : "")
          + "</div>";
      }
      return '<div class="pp-resp-share"><div class="pp-resp-share__season">' + esc(s.season) + "</div>" + bar
        + '<div class="pp-resp-share__n">' + esc(info) + "</div></div>";
    }).join("");
  }

  /* ---------------- Start ---------------- */

  var RENDER = { overview: renderOverview, age: renderAge, types: renderTypes };
  var loaded = [];

  function init() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-pp-resp]"), function (root) {
      var part = root.getAttribute("data-pp-resp");
      fetch(root.getAttribute("data-src"))
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(function (data) {
          loaded.push({ root: root, part: part, data: data });
          RENDER[part](root, data);
        })
        .catch(function (error) {
          // Missing JSON = data release without this block: leave the page as it was.
          console.warn("pp-resp: " + part + " not shown (" + error.message + ")");
          drop(root);
        });
    });
  }

  // Recolour the canvases on theme switch, using the same signal as pp-charts.js.
  new MutationObserver(function () {
    loaded.forEach(function (x) { if (x.part !== "overview" && document.contains(x.root)) RENDER[x.part](x.root, x.data); });
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-bs-theme"] });

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})(window, document);
