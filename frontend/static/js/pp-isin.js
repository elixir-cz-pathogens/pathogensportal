/* Infectious diseases — overview blocks: this year by week, the most frequent
 * diagnoses, age groups.
 *
 * Page parts ({{< isin part="…" >}}) read three JSON files from pathogensportal-db
 * (compute_isin.py): isin_weekly.json (weekly ÚZIS summary, 11 diagnoses up to
 * the previous week), isin_overview.json and isin_groups.json (the yearly open
 * ISIN export — the overview page and the thematic group pages).
 * Nothing is computed here beyond what a control needs — values, the comment
 * above each block and the facts behind it arrive ready.
 *
 * One thing the drawing must keep visible: since July 2025 part of the records
 * comes from EWS reports and the share keeps growing. Bars therefore always
 * show the EWS part as its own segment, and no block compares a diagnosis with
 * earlier years unless the data say it is comparable (`comparable`).
 *
 * A part whose JSON is missing removes itself. Colours come from the tokens in
 * dashboards.css: slot 1 for records reported the earlier way, slot 2 for
 * records from EWS — the same two colours in every block of the page.
 */
(function (window, document) {
  "use strict";

  var EN = (document.documentElement.lang || "").indexOf("en") === 0;
  var LANG = EN ? "en" : "cs";
  var LOCALE = EN ? "en-GB" : "cs-CZ";

  var L = EN ? {
    auto: "text composed automatically from the data", model: "text written by a language model from the data below",
    pick: "Diagnosis", year: "Year",
    lastWeek: "Latest week ({w})", ofWhichEws: "of which from EWS reports: {n}",
    ytd: "Since the start of {y}", upTo: "up to the week of {w}",
    ewsShare: "From EWS reports this year", notComparable: "cannot be compared with previous years",
    comparable: "below {t} — can be compared with last year",
    weeklyTitle: "{name} · reported cases by week · {y}",
    other: "reported the earlier way", ews: "from EWS reports", total: "total",
    ewsOf: "{p} from EWS",
    colWeek: "Week", colTotal: "Total", colEws: "Of which EWS",
    ageTitle: "{name} by age",
    ageSub: "reported cases in 52 weeks ({range}) per 100,000 population of the age group · Czechia · population on 31 Dec {py}",
    topTitle: "The ten most frequently reported diagnoses · {y}",
    otherTitle: "The ten most frequent diagnoses outside the groups · {y}",
    groupTitle: "{g} · reported cases per year",
    inYear: "in {y}", peak: "highest: {n} ({y})", ewsPart: "of which from EWS reports {n} ({p})",
    colYear: "Year", ariaMini: "{name}: reported cases per year. ",
    groupAgeTitle: "{g} by age · {y}",
    groupAgeSub: "diagnoses of this group · per 100,000 population of the age group · Czechia · population on 31 Dec {py}",
    icd: "ICD-10 {c}", official: "Official name: {n}",
    ageAllTitle: "Reported cases by age · {y}",
    ageAllSub: "all reported diagnoses except influenza · per 100,000 population of the age group · Czechia · population on 31 Dec {py}",
    mostOften: "most often: {d}",
    origin: "static data snapshot", sourceWeekly: "ÚZIS, weekly data summary", sourceIsin: "ÚZIS, open ISIN data",
    table: "Table", hideTable: "Hide table",
    ariaChart: "{name}: reported cases per week in {y}, the part from EWS reports shown separately. Values are in the table below."
  } : {
    auto: "text sestavený automaticky z dat", model: "text napsal jazykový model z údajů níže",
    pick: "Diagnóza", year: "Rok",
    lastWeek: "Poslední týden ({w})", ofWhichEws: "z toho z hlášení EWS: {n}",
    ytd: "Od začátku roku {y}", upTo: "do týdne {w}",
    ewsShare: "Z hlášení EWS letos", notComparable: "s předchozími roky nelze srovnávat",
    comparable: "pod hranicí {t} — s loňskem lze srovnat",
    weeklyTitle: "{name} · hlášené případy po týdnech · {y}",
    other: "hlášeno dosavadním způsobem", ews: "z hlášení EWS", total: "celkem",
    ewsOf: "{p} z EWS",
    colWeek: "Týden", colTotal: "Celkem", colEws: "Z toho EWS",
    ageTitle: "{name} podle věku",
    ageSub: "hlášené případy za 52 týdnů ({range}) na 100 tis. obyvatel dané věkové skupiny · celá ČR · obyvatelstvo k 31. 12. {py}",
    topTitle: "Deset nejčastěji hlášených diagnóz · {y}",
    otherTitle: "Deset nejčastějších diagnóz mimo skupiny · {y}",
    groupTitle: "{g} · hlášené případy po letech",
    inYear: "v roce {y}", peak: "nejvíc: {n} ({y})", ewsPart: "z toho z hlášení EWS {n} ({p})",
    colYear: "Rok", ariaMini: "{name}: hlášené případy po letech. ",
    groupAgeTitle: "{g} podle věku · {y}",
    groupAgeSub: "diagnózy této skupiny · na 100 tis. obyvatel dané věkové skupiny · celá ČR · obyvatelstvo k 31. 12. {py}",
    icd: "MKN-10 {c}", official: "Úřední název: {n}",
    ageAllTitle: "Hlášené případy podle věku · {y}",
    ageAllSub: "všechny hlášené diagnózy kromě chřipky · na 100 tis. obyvatel dané věkové skupiny · celá ČR · obyvatelstvo k 31. 12. {py}",
    mostOften: "nejčastěji: {d}",
    origin: "statický snímek dat", sourceWeekly: "ÚZIS, týdenní datový souhrn", sourceIsin: "ÚZIS, otevřená data ISIN",
    table: "Tabulka", hideTable: "Skrýt tabulku",
    ariaChart: "{name}: hlášené případy po týdnech roku {y}, část z hlášení EWS zvlášť. Hodnoty jsou v tabulce pod grafem."
  };

  function fill(template, values) {
    return template.replace(/\{(\w+)\}/g, function (_, key) { return values[key]; });
  }
  function fmt(value, digits) {
    if (value === null || value === undefined) return "–";
    var d = digits === undefined ? 0 : digits;
    return value.toLocaleString(LOCALE, { minimumFractionDigits: d, maximumFractionDigits: d });
  }
  /** Percent as the comments write it: whole numbers from 10 up, one decimal below. */
  function pct(value) { return fmt(value, value >= 10 ? 0 : 1) + (EN ? "%" : " %"); }
  /** "1 případ", "3 případy", "1 106 případů" / "1 case", "1,106 cases" */
  function casesText(n) {
    var noun = EN ? (n === 1 ? "case" : "cases") : (n === 1 ? "případ" : n >= 2 && n <= 4 ? "případy" : "případů");
    return fmt(n) + (EN ? " " : "\u00a0") + noun;
  }
  function esc(text) {
    return String(text).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }
  function token(name, fallback) {
    var probe = document.querySelector(".pp-viz") || document.body;
    return (getComputedStyle(probe).getPropertyValue(name) || "").trim() || fallback;
  }
  function field(root, name) { return root.querySelector('[data-f="' + name + '"]'); }
  function setOrigin(root, source) {
    var el = root.querySelector("[data-pp-origin]");
    if (el) el.textContent = L.origin + " · " + source;
  }

  /* ---------------- Calendar weeks ----------------
   * Shown to the reader as dates, never as week numbers. */

  var MONTHS = EN ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                  : ["led", "úno", "bře", "dub", "kvě", "čvn", "čvc", "srp", "zář", "říj", "lis", "pro"];

  function monday(year, week) {
    var jan4 = new Date(Date.UTC(year, 0, 4));
    return new Date(Date.UTC(year, 0, 4 - ((jan4.getUTCDay() + 6) % 7) + (week - 1) * 7));
  }
  function day(d) {
    return EN ? d.getUTCDate() + " " + MONTHS[d.getUTCMonth()] : d.getUTCDate() + ". " + (d.getUTCMonth() + 1) + ".";
  }
  /** "9.–15. 11." / "9–15 Nov"; across months "26. 10. – 1. 11." */
  function weekShort(year, week) {
    var a = monday(year, week), b = new Date(a.getTime() + 6 * 864e5);
    if (a.getUTCMonth() !== b.getUTCMonth()) return day(a) + " – " + day(b);
    return EN ? a.getUTCDate() + "–" + day(b) : a.getUTCDate() + ".–" + day(b);
  }
  function weekFull(year, week) {
    var b = new Date(monday(year, week).getTime() + 6 * 864e5);
    return weekShort(year, week) + " " + b.getUTCFullYear();
  }
  /**
   * Month name on the first week of a month, empty otherwise — for the X axis.
   * A week belongs to the month of its Thursday, as it belongs to its ISO year:
   * week 1 that starts on 29 December is the first week of January.
   */
  function monthTick(year, week) {
    function month(w) { return new Date(monday(year, w).getTime() + 3 * 864e5).getUTCMonth(); }
    return (week === 1 || month(week - 1) !== month(week)) ? MONTHS[month(week)] : "";
  }

  /* ---------------- Shared pieces ---------------- */

  function renderComment(root, block, eyebrow) {
    var c = block.comment, facts = block.facts;
    field(root, "eyebrow").textContent = eyebrow;
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

  /** A group of buttons where exactly one is pressed. */
  function choice(host, options, selected, onPick) {
    host.innerHTML = options.map(function (o) {
      return '<button type="button" data-v="' + esc(o.value) + '" aria-pressed="' + (o.value === selected) + '"'
        + (o.title ? ' title="' + esc(o.title) + '"' : "") + ">" + esc(o.label) + "</button>";
    }).join("");
    host.onclick = function (event) {
      var btn = event.target.closest("button[data-v]");
      if (!btn || btn.getAttribute("aria-pressed") === "true") return;
      host.querySelectorAll("button[data-v]").forEach(function (b) {
        b.setAttribute("aria-pressed", String(b === btn));
      });
      onPick(btn.getAttribute("data-v"));
    };
  }

  function legend(host, keys) {
    host.innerHTML = keys.map(function (k) {
      return '<span><i class="pp-resp-key" style="background:var(' + k.token + ')"></i>' + esc(k.label) + "</span>";
    }).join("");
  }

  /** Horizontal bars with one value per row (age groups). */
  function rateBars(groups, sub) {
    var max = 0;
    groups.forEach(function (g) { if (g.rate > max) max = g.rate; });
    return groups.map(function (g) {
      var width = max && g.rate ? Math.max(1.5, 100 * g.rate / max) : 0;
      return '<span class="pp-gen-bar__label">' + esc(g[LANG]) + " <small>" + esc(sub(g)) + "</small></span>"
        + '<span class="pp-gen-bar__track">' + (width
            ? '<i style="width:' + width.toFixed(1) + '%"></i>' : '<i class="pp-gen-bar--zero"></i>') + "</span>"
        + '<span class="pp-gen-bar__value">' + fmt(g.rate, 1) + "</span>";
    }).join("");
  }

  function wireTable(root) {
    var button = field(root, "tableToggle"), wrap = field(root, "table");
    if (!button || !wrap || button.getAttribute("data-wired")) return;
    button.setAttribute("data-wired", "1");
    button.addEventListener("click", function () {
      var open = wrap.getAttribute("data-open") !== "true";
      wrap.setAttribute("data-open", String(open));
      button.setAttribute("aria-expanded", String(open));
      button.textContent = open ? L.hideTable : L.table;
    });
  }

  /* ---------------- 1. This year by week ---------------- */

  var weeklyChart = null;

  function renderWeekly(root, D, state) {
    // On a group page only the diagnoses of that group; a group the weekly
    // summary does not cover has nothing to show.
    var group = root.getAttribute("data-group");
    var list = group ? D.diseases.filter(function (x) { return x.group === group; }) : D.diseases;
    if (!list.length) { root.remove(); return; }
    state = state || root.ppState || { code: list[0].code, year: String(D.year) };
    root.ppState = state;
    var d = list.filter(function (x) { return x.code === state.code; })[0] || list[0];
    var year = +state.year, weeks = d.weeks[state.year] || { n: [], ews: [] };
    var lastWeek = +D.week.slice(6);

    field(root, "pick").hidden = list.length < 2;   // one diagnosis needs no choice
    choice(field(root, "pick"), list.map(function (x) {
      return { value: x.code, label: x.name[LANG], title: fill(L.official, { n: x.official[LANG] }) + " · " + fill(L.icd, { c: x.code }) };
    }), d.code, function (code) { state.code = code; renderWeekly(root, D, state); });

    choice(field(root, "years"), D.years.slice().reverse().map(function (y) {
      return { value: String(y), label: String(y) };
    }), state.year, function (y) { state.year = y; renderWeekly(root, D, state); });

    renderComment(root, d, D.period[LANG]);

    field(root, "tiles").innerHTML = [
      { label: fill(L.lastWeek, { w: weekShort(D.year, lastWeek) }), value: fmt(d.last_week.n),
        note: fill(L.ofWhichEws, { n: fmt(d.last_week.ews) }) },
      { label: fill(L.ytd, { y: D.year }), value: fmt(d.ytd.n), note: fill(L.upTo, { w: weekShort(D.year, lastWeek) }) },
      { label: L.ewsShare, value: pct(d.ytd.ews_share),
        note: d.comparable ? fill(L.comparable, { t: pct(D.ews_threshold) }) : L.notComparable }
    ].map(function (t) {
      return '<div class="pp-stat"><div class="pp-stat__label">' + esc(t.label) + '</div><div class="pp-stat__value">'
        + esc(t.value) + '</div><div class="pp-stat__note">' + esc(t.note) + "</div></div>";
    }).join("");

    field(root, "title").textContent = fill(L.weeklyTitle, { name: d.name[LANG], y: year });
    var hasEws = weeks.ews.some(function (v) { return v > 0; });
    legend(field(root, "legend"), [{ token: "--pp-series-1", label: L.other }]
      .concat(hasEws ? [{ token: "--pp-series-2", label: L.ews }] : []));

    var canvas = root.querySelector(".pp-card__plot canvas");
    canvas.setAttribute("aria-label", fill(L.ariaChart, { name: d.name[LANG], y: year }));
    if (weeklyChart) { weeklyChart.destroy(); weeklyChart = null; }
    if (window.Chart) {
      var muted = token("--pp-text-muted", "#77766f"), surface = token("--pp-surface-raised", "#ffffff");
      var ink = token("--pp-text", "#0b0b0b"), paper = token("--pp-surface", "#fcfcfb");
      var keys = [
        { label: L.other, colour: token("--pp-series-1", "#2a78d6"), data: weeks.n.map(function (n, i) { return n - weeks.ews[i]; }) },
        { label: L.ews, colour: token("--pp-series-2", "#eb6834"), data: weeks.ews }
      ];
      weeklyChart = new window.Chart(canvas, {
        type: "bar",
        data: {
          labels: weeks.n.map(function (_n, i) { return i + 1; }),
          datasets: keys.map(function (k) {
            return { label: k.label, data: k.data, backgroundColor: k.colour, ppColour: k.colour,
                     // 2px gap in the surface colour between the stacked segments
                     borderColor: surface, borderWidth: { top: 2 }, borderRadius: 2, maxBarThickness: 16 };
          })
        },
        options: {
          responsive: true, maintainAspectRatio: false, animation: false,
          interaction: { mode: "index", intersect: false },
          layout: { padding: { top: 6, right: 6 } },
          scales: {
            x: { stacked: true, grid: { display: false }, border: { color: token("--pp-border", "#e2e1dc") },
                 ticks: { color: muted, font: { size: 11 }, maxRotation: 0, autoSkip: false,
                          callback: function (_v, index) { return monthTick(year, index + 1); } } },
            y: { stacked: true, min: 0, grid: { color: token("--pp-grid", "#ebeae6") }, border: { display: false },
                 ticks: { color: muted, font: { size: 11 }, precision: 0, maxTicksLimit: 6,
                          callback: function (v) { return fmt(v); } } }
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              padding: 10, cornerRadius: 6, boxWidth: 9, boxHeight: 9,
              backgroundColor: ink, titleColor: paper, bodyColor: paper, footerColor: paper,
              callbacks: {
                title: function (items) { return items.length ? weekFull(year, items[0].dataIndex + 1) : ""; },
                label: function (item) { return " " + item.dataset.label + ": " + fmt(item.parsed.y); },
                labelColor: function (item) {
                  return { borderColor: item.dataset.ppColour, backgroundColor: item.dataset.ppColour };
                },
                footer: function (items) {
                  if (!items.length) return "";
                  var i = items[0].dataIndex, n = weeks.n[i], e = weeks.ews[i];
                  return L.total + ": " + fmt(n) + (e ? " · " + fill(L.ewsOf, { p: pct(100 * e / n) }) : "");
                }
              }
            }
          }
        }
      });
    }

    field(root, "table").innerHTML = '<table class="pp-table"><thead><tr><th scope="col">' + L.colWeek
      + '</th><th scope="col">' + L.colTotal + '</th><th scope="col">' + L.colEws + "</th></tr></thead><tbody>"
      + weeks.n.map(function (n, i) {
          return '<tr><th scope="row">' + weekFull(year, i + 1) + "</th><td>" + fmt(n) + "</td><td>" + fmt(weeks.ews[i]) + "</td></tr>";
        }).join("") + "</tbody></table>";
    wireTable(root);

    var ageCard = field(root, "ageCard");
    if (d.age && D.age_window) {
      field(root, "ageTitle").textContent = fill(L.ageTitle, { name: d.name[LANG] });
      field(root, "ageSub").textContent = fill(L.ageSub, { range: D.age_window.label[LANG], py: D.age_window.population_year });
      field(root, "age").innerHTML = rateBars(d.age, function (g) { return casesText(g.n); });
    } else if (ageCard) {
      ageCard.remove();   // population by age not delivered yet
    }
    setOrigin(root, L.sourceWeekly);
  }

  /* ---------------- 2. The ten most frequent diagnoses ---------------- */

  function renderTop(root, D) {
    if (!D.blocks.top) { root.remove(); return; }
    renderRanking(root, D.blocks.top, L.topTitle);
  }

  function renderOther(root, D) {
    if (!D.groups.other) { root.remove(); return; }
    renderRanking(root, D.groups.other, L.otherTitle);
  }

  function renderRanking(root, top, title, state) {
    state = state || root.ppState || { year: top.years[0] };
    root.ppState = state;
    var rows = top.by_year[state.year] || [];

    // The comment describes the last year; the bars can show any year.
    renderComment(root, top, top.period[LANG]);
    choice(field(root, "years"), top.years.map(function (y) { return { value: y, label: y }; }), state.year,
      function (y) { state.year = y; renderRanking(root, top, title, state); });
    field(root, "title").textContent = fill(title, { y: state.year });

    var hasEws = rows.some(function (r) { return r.ews > 0; });
    legend(field(root, "legend"), [{ token: "--pp-series-1", label: L.other }]
      .concat(hasEws ? [{ token: "--pp-series-2", label: L.ews }] : []));

    var max = 0;
    rows.forEach(function (r) { if (r.n > max) max = r.n; });
    field(root, "bars").innerHTML = rows.map(function (r) {
      var other = max ? 100 * (r.n - r.ews) / max : 0, ews = max ? 100 * r.ews / max : 0;
      return '<div class="pp-isin-row" role="listitem" title="' + esc(fill(L.official, { n: r.official[LANG] })) + '">'
        + '<span class="pp-isin-row__label">' + esc(r.name[LANG]) + " <small>" + esc(fill(L.icd, { c: r.code })) + "</small></span>"
        + '<span class="pp-isin-row__track">'
        + (other ? '<i style="width:' + other.toFixed(2) + '%"></i>' : "")
        + (ews ? '<i class="pp-isin-row__ews" style="width:' + ews.toFixed(2) + '%"></i>' : "") + "</span>"
        + '<span class="pp-isin-row__value">' + fmt(r.n)
        + (r.ews ? " <small>" + esc(fill(L.ewsOf, { p: pct(r.ews_share) })) + "</small>" : "") + "</span></div>";
    }).join("");
    setOrigin(root, L.sourceIsin);
  }

  /* ---------------- 3. Age groups of the last year ---------------- */

  function renderAge(root, D) {
    var age = D.blocks.age;
    if (!age) { root.remove(); return; }
    renderComment(root, age, age.period[LANG]);
    field(root, "title").textContent = fill(L.ageAllTitle, { y: age.year });
    field(root, "subtitle").textContent = fill(L.ageAllSub, { py: age.population_year });
    field(root, "bars").innerHTML = rateBars(age.groups, function (g) {
      return casesText(g.n) + (g.top ? " · " + fill(L.mostOften, { d: g.top[LANG] }) : "");
    });
    setOrigin(root, L.sourceIsin);
  }

  /* ---------------- 4. A thematic group: one small chart per diagnosis ----------------
   * Diagnoses of one group differ by orders of magnitude (chickenpox in tens of
   * thousands, measles in tens), so each gets its own chart with its own axis
   * instead of one chart where the small ones are a line on the floor. */

  function miniChart(d, years) {
    var max = 0, peakAt = 0;
    d.n.forEach(function (n, i) { if (n > max) { max = n; peakAt = i; } });
    var last = d.n.length - 1;
    var cols = d.n.map(function (n, i) {
      var e = d.ews[i], other = max ? 100 * (n - e) / max : 0, ews = max ? 100 * e / max : 0;
      var tip = years[i] + ": " + fmt(n) + (e ? " · " + fill(L.ewsPart, { n: fmt(e), p: pct(100 * e / n) }) : "");
      return '<span class="pp-isin-mini__col" title="' + esc(tip) + '">'
        + (ews ? '<i class="pp-isin-mini__ews" style="height:' + ews.toFixed(2) + '%"></i>' : "")
        + (other ? '<i style="height:' + other.toFixed(2) + '%"></i>' : "") + "</span>";
    }).join("");
    var spoken = fill(L.ariaMini, { name: d.name[LANG] }) + d.n.map(function (n, i) { return years[i] + ": " + fmt(n); }).join(", ");
    return '<div class="pp-isin-mini" title="' + esc(fill(L.official, { n: d.official[LANG] })) + '">'
      + '<div class="pp-isin-mini__name">' + esc(d.name[LANG]) + " <small>" + esc(fill(L.icd, { c: d.code })) + "</small></div>"
      + '<div class="pp-isin-mini__value">' + fmt(d.n[last]) + " <small>" + esc(fill(L.inYear, { y: years[last] }))
      + (d.ews[last] ? " · " + esc(fill(L.ewsOf, { p: pct(d.ews_share) })) : "") + "</small></div>"
      + '<div class="pp-isin-mini__plot" role="img" aria-label="' + esc(spoken) + '">' + cols + "</div>"
      + '<div class="pp-isin-mini__axis"><span>' + years[0] + "</span><span>"
      + (max ? esc(fill(L.peak, { n: fmt(max), y: years[peakAt] })) : "") + "</span><span>" + years[last] + "</span></div></div>";
  }

  function groupOf(root, D) {
    return (D.groups || {})[root.getAttribute("data-group")];
  }

  function renderGroup(root, D) {
    var G = groupOf(root, D);
    if (!G || !G.diseases) { root.remove(); return; }
    renderComment(root, G, G.period[LANG]);
    field(root, "title").textContent = fill(L.groupTitle, { g: G.title[LANG] });
    var hasEws = G.diseases.some(function (d) { return d.ews.some(function (e) { return e > 0; }); });
    legend(field(root, "legend"), [{ token: "--pp-series-1", label: L.other }]
      .concat(hasEws ? [{ token: "--pp-series-2", label: L.ews }] : []));
    field(root, "minis").innerHTML = G.diseases.map(function (d) { return miniChart(d, D.years); }).join("");

    field(root, "table").innerHTML = '<table class="pp-table"><thead><tr><th scope="col">' + L.colYear + "</th>"
      + G.diseases.map(function (d) { return '<th scope="col">' + esc(d.name[LANG]) + "</th>"; }).join("")
      + "</tr></thead><tbody>" + D.years.map(function (y, i) {
          return '<tr><th scope="row">' + y + "</th>" + G.diseases.map(function (d) {
            return "<td>" + fmt(d.n[i]) + (d.ews[i] ? " <small>(EWS " + fmt(d.ews[i]) + ")</small>" : "") + "</td>";
          }).join("") + "</tr>";
        }).join("") + "</tbody></table>";
    wireTable(root);
    setOrigin(root, L.sourceIsin);
  }

  function renderGroupAge(root, D) {
    var G = groupOf(root, D), age = G && G.age;
    if (!age) { root.remove(); return; }
    renderComment(root, age, age.period[LANG]);
    field(root, "title").textContent = fill(L.groupAgeTitle, { g: G.title[LANG], y: age.year });
    field(root, "subtitle").textContent = fill(L.groupAgeSub, { py: age.population_year });
    field(root, "bars").innerHTML = rateBars(age.groups, function (g) {
      return casesText(g.n) + (g.top ? " · " + fill(L.mostOften, { d: g.top[LANG] }) : "");
    });
    setOrigin(root, L.sourceIsin);
  }

  /* ---------------- Start ---------------- */

  var RENDER = { weekly: renderWeekly, top: renderTop, age: renderAge,
                 group: renderGroup, "group-age": renderGroupAge, other: renderOther };
  var loaded = [];

  function init() {
    var cache = {};
    Array.prototype.slice.call(document.querySelectorAll("[data-pp-isin]")).forEach(function (root) {
      var part = root.getAttribute("data-pp-isin"), src = root.getAttribute("data-src");
      if (!cache[src]) {
        cache[src] = fetch(src).then(function (r) {
          if (!r.ok) throw new Error(r.status);
          return r.json();
        });
      }
      cache[src].then(function (data) {
        loaded.push({ root: root, part: part, data: data });
        RENDER[part](root, data);
      }).catch(function (error) {
        // Missing JSON = data release without this block: leave the page as it was.
        console.warn("pp-isin: " + part + " not shown (" + error.message + ")");
        root.remove();
      });
    });
  }

  // Recolour the canvas on theme switch, using the same signal as pp-charts.js.
  new MutationObserver(function () {
    loaded.forEach(function (x) {
      if (x.part === "weekly" && document.contains(x.root)) RENDER.weekly(x.root, x.data);
    });
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-bs-theme"] });

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})(window, document);
