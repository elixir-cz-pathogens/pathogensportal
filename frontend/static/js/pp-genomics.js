/* Genomics: what is publicly available from Czech specimens.
 *
 * Page parts ({{< genomics part="…" >}}) read JSON built by pathogensportal-db
 * (compute_genomics.py): genomics_overview.json, genomics_lineages.json,
 * genomics_amr.json. Nothing is computed here — counts, lineages, resistance
 * genes and the comment above each block arrive ready. Parts that share a file
 * fetch it once.
 *
 * A part whose JSON is missing removes itself: an older data release then renders
 * the page without that block instead of showing an error.
 *
 * What the rendering must never do, because the data do not support it:
 *   - present a record count as an illness count;
 *   - turn resistance-gene counts into percentages (the isolates are not a random
 *     sample — strains are sequenced because they are resistant);
 *   - show lineage proportions as if they described the population.
 * Hence counts everywhere, and every block carries its caveat from the facts.
 *
 * Colours come from tokens in dashboards.css; the grey slot is reserved for
 * "other", as in the rest of the portal.
 */
(function (window, document) {
  "use strict";

  var EN = (document.documentElement.lang || "").indexOf("en") === 0;
  var LANG = EN ? "en" : "cs";
  var LOCALE = EN ? "en-GB" : "cs-CZ";

  var L = EN ? {
    asOf: "As of", auto: "text composed automatically from the data",
    model: "text written by a language model from the data below",
    origin: "static data snapshot", table: "Table", hideTable: "Hide table",
    samples: "Samples", runs: "Sequencing runs", sequences: "Assembled sequences",
    samplesNote: "the collected material the data come from",
    runsNote: "raw data from the sequencer, from {n} studies",
    sequencesNote: "finished genomes or parts of them, from {n} studies",
    lastAdded: "Latest record added: {d}",
    divSub: "{n} assembled sequences from Czech specimens, by group of organisms",
    growthNote: "{year} is incomplete (to {d}). Up to {until} a total of {n} runs were added.",
    colYear: "Year", colTotal: "Total", partial: "incomplete year",
    colPathogen: "Pathogen", colRuns: "Sequencing runs", colSeqs: "Assembled sequences",
    colLast: "Last added", colPage: "Portal page", noPage: "none yet",
    staleSince: "nothing new since {y}", inGisaid: "the data are in GISAID",
    none: "Nothing from Czechia is in ENA: {list}.",
    legendRuns: "sequencing runs", legendSeqs: "assembled sequences",
    qualitySub: "share of the {n} sequencing runs where the field is filled in",
    filled: "{n} of {total}",
    lag: "From collection to publication", lagNote: "median; half the runs between {a} and {b}",
    volume: "Volume of raw data", volumeNote: "bases read in total",
    depth: "Genome coverage", depthNote: "{species}, median of {n} runs",
    years: "years", gb: "Gb",
    treeCz: "{n} of {total} tips", treeUpdated: "tree recomputed {d}",
    treeCollected: "collection {a} to {b}", treeOpen: "Open the tree with Czechia selected",
    treeNoCz: "not a single Czech strain", treeNotHuman: "no Czech specimen comes from a human",
    treeLineages: "Lineages of the Czech strains", treeHosts: "Of which",
    emptyLine: "Trees without a single Czech strain: {list}. All of them are recomputed regularly, so the zero is a finding, not a gap in the portal.",
    isolates: "sequenced isolates", withGenotype: "with a resistance-gene result",
    collectedYears: "collection {a} to {b}", environmental: "of which {n} from wastewater or the environment",
    noGroups: "No acquired resistance genes are followed for this species; the records carry only genes that the species has in itself.",
    geneIsolates: "{n} isolates", moreGenes: "and {n} more genes, each in {a} to {b} isolates",
    moreGenesOne: "and {n} more genes, each in a single isolate",
    host: { domestic: "farmed poultry", wild: "wild birds", "": "not stated" }
  } : {
    asOf: "Stav k", auto: "text sestavený automaticky z dat",
    model: "text napsal jazykový model z údajů níže",
    origin: "statický snímek dat", table: "Tabulka", hideTable: "Skrýt tabulku",
    samples: "Vzorky", runs: "Sekvenační běhy", sequences: "Sestavené sekvence",
    samplesNote: "odebraný materiál, ze kterého data vznikla",
    runsNote: "surová data ze sekvenátoru, z {n} studií",
    sequencesNote: "hotové genomy nebo jejich části, z {n} studií",
    lastAdded: "Poslední záznam přibyl {d}",
    divSub: "{n} sestavených sekvencí z českých vzorků podle skupiny organismů",
    growthNote: "Rok {year} je neúplný (do {d}). Do roku {until} přibylo dohromady {n} běhů.",
    colYear: "Rok", colTotal: "Celkem", partial: "neúplný rok",
    colPathogen: "Patogen", colRuns: "Sekvenační běhy", colSeqs: "Sestavené sekvence",
    colLast: "Naposledy přibylo", colPage: "Stránka portálu", noPage: "zatím žádná",
    staleSince: "od roku {y} nic nového", inGisaid: "data jsou v GISAID",
    none: "V archivu ENA z Česka nic není: {list}.",
    legendRuns: "sekvenační běhy", legendSeqs: "sestavené sekvence",
    qualitySub: "podíl z {n} sekvenačních běhů, u kterých je údaj vyplněný",
    filled: "{n} z {total}",
    lag: "Od odběru po zveřejnění", lagNote: "medián; polovina běhů mezi {a} a {b}",
    volume: "Objem surových dat", volumeNote: "přečtených bází celkem",
    depth: "Pokrytí genomu", depthNote: "{species}, medián z {n} běhů",
    years: "roku", gb: "Gb",
    treeCz: "{n} z {total} listů", treeUpdated: "strom přepočítán {d}",
    treeCollected: "odběry {a} až {b}", treeOpen: "Otevřít strom s vybraným Českem",
    treeNoCz: "ani jeden český kmen", treeNotHuman: "žádný český vzorek není od člověka",
    treeLineages: "Linie českých kmenů", treeHosts: "Z toho",
    emptyLine: "Bez jediného českého kmene zůstávají stromy: {list}. Všechny se pravidelně přepočítávají, nula je tedy zjištění, ne mezera portálu.",
    isolates: "sekvenovaných izolátů", withGenotype: "s nálezem genů rezistence",
    collectedYears: "odběry {a} až {b}", environmental: "z toho {n} z odpadních vod nebo prostředí",
    noGroups: "U tohoto druhu se sledované geny získané rezistence nehledají; záznamy nesou jen geny, které druh má sám o sobě.",
    geneIsolates: "{n} izolátů", moreGenes: "a dalších {n} genů, každý u {a} až {b} izolátů",
    moreGenesOne: "a dalších {n} genů, každý u jediného izolátu",
    host: { domestic: "chovaná drůbež", wild: "volně žijící ptáci", "": "neuvedeno" }
  };

  function fill(template, values) {
    return template.replace(/\{(\w+)\}/g, function (_, key) { return values[key]; });
  }
  function fmt(value, digits) {
    if (value === null || value === undefined) return "–";
    var d = digits === undefined ? 0 : digits;
    return value.toLocaleString(LOCALE, { minimumFractionDigits: d, maximumFractionDigits: d });
  }
  function pct(value, digits) { return fmt(value, digits === undefined ? 1 : digits) + (EN ? "%" : " %"); }
  function esc(text) {
    return String(text).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }
  function pick(obj, key) { return (EN && obj[key + "_en"] !== undefined && obj[key + "_en"] !== null) ? obj[key + "_en"] : obj[key]; }
  function token(name, fallback) {
    var probe = document.querySelector(".pp-viz") || document.body;
    return (getComputedStyle(probe).getPropertyValue(name) || "").trim() || fallback;
  }
  function withAlpha(hex, alpha) {
    var m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
    return m ? "rgba(" + parseInt(m[1], 16) + "," + parseInt(m[2], 16) + "," + parseInt(m[3], 16) + "," + alpha + ")" : hex;
  }
  function field(root, name) { return root.querySelector('[data-f="' + name + '"]'); }
  function day(iso) {
    if (!iso) return "";
    var d = new Date(iso + "T00:00:00Z");
    // „3. 11. 2026“ / „3 Nov 2026“ — the all-numeric English form reads as a US date.
    return isNaN(d) ? iso : d.toLocaleDateString(LOCALE, {
      day: "numeric", month: EN ? "short" : "numeric", year: "numeric", timeZone: "UTC" });
  }
  function setOrigin(root, text) {
    var el = root.querySelector("[data-pp-origin]");
    if (el) el.textContent = L.origin + (text ? " · " + text : "");
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
  /** One horizontal bar row: label, track, value. */
  function bars(rows) {
    var max = 0;
    rows.forEach(function (r) { if (r.value > max) max = r.value; });
    return rows.map(function (r) {
      var width = max ? Math.max(1.5, 100 * r.value / max) : 0;
      return '<span class="pp-gen-bar__label">' + esc(r.label)
        + (r.sub ? ' <small>' + esc(r.sub) + "</small>" : "") + "</span>"
        + '<span class="pp-gen-bar__track">' + (r.value
            ? '<i style="width:' + width.toFixed(1) + '%"></i>'
            : '<i class="pp-gen-bar--zero"></i>') + "</span>"
        + '<span class="pp-gen-bar__value">' + esc(r.text) + "</span>";
    }).join("");
  }

  function renderComment(root, data, stamp) {
    var c = data.comment, facts = data.facts;
    if (!c || !facts) return;
    field(root, "eyebrow").textContent = L.asOf + ": " + day(stamp);
    field(root, "badge").textContent = c.origin === "template" ? L.auto : L.model;
    field(root, "comment").textContent = c[LANG];
    var byId = {};
    facts.facts.forEach(function (f) { byId[f.id] = f; });
    function filled(text) {
      return text.replace(/\{(\w+)\}/g, function (_, key) {
        return facts.values[key] ? facts.values[key][LANG] : "";
      });
    }
    field(root, "sources").innerHTML = c.sentences.map(function (s) {
      return "<li><span>" + esc(s[LANG]) + "</span><ul>" + s.facts.map(function (id) {
        return byId[id] ? "<li>" + esc(filled(byId[id][LANG])) + "</li>" : "";
      }).join("") + "</ul></li>";
    }).join("");
  }

  /* ---------------- 1. Overview: totals + what the tag covers ---------------- */

  var SEG_TOKENS = ["--pp-seq-high", "--pp-series-7", "--pp-series-1", "--pp-band-3",
                    "--pp-band-2", "--pp-band-1", "--pp-series-rest"];

  function renderOverview(root, D) {
    renderComment(root, D, (D.fetched_at || "").slice(0, 10));
    var t = D.totals;
    var tiles = [
      { label: L.samples, value: t.samples, note: L.samplesNote },
      { label: L.runs, value: t.runs, note: fill(L.runsNote, { n: fmt(t.run_studies) }) },
      { label: L.sequences, value: t.sequences, note: fill(L.sequencesNote, { n: fmt(t.sequence_studies) }) }
    ];
    field(root, "totals").innerHTML = tiles.map(function (x) {
      return '<div class="pp-stat"><div class="pp-stat__label">' + esc(x.label) + "</div>"
        + '<div class="pp-stat__value">' + fmt(x.value) + "</div>"
        + '<div class="pp-stat__note">' + esc(x.note) + "</div></div>";
    }).join("") + '<div class="pp-stat pp-gen-stamp"><div class="pp-stat__label">'
      + esc(fill(L.lastAdded, { d: day(D.last_added) })) + "</div></div>";

    var divs = D.divisions.slice(0, SEG_TOKENS.length);
    var total = divs.reduce(function (a, d) { return a + d.count; }, 0);
    field(root, "divSubtitle").textContent = fill(L.divSub, { n: fmt(t.sequences) });
    field(root, "divLegend").innerHTML = divs.map(function (d, i) {
      return '<span><i class="pp-resp-key" style="background:var(' + SEG_TOKENS[i] + ')"></i>'
        + esc(pick(d, "label")) + " " + fmt(d.count) + "</span>";
    }).join("");
    field(root, "divisions").innerHTML = '<div class="pp-gen-seg__bar" role="img" aria-label="'
      + esc(divs.map(function (d) { return pick(d, "label") + " " + fmt(d.count); }).join(", ")) + '">'
      + divs.map(function (d, i) {
          var share = total ? 100 * d.count / total : 0;
          return '<i style="flex:' + d.count + ' 1 0;background:var(' + SEG_TOKENS[i] + ')" title="'
            + esc(pick(d, "label") + ": " + fmt(d.count)) + '">'
            + (share >= 12 ? esc(pick(d, "label")) : "") + "</i>";
        }).join("") + "</div>";
    setOrigin(root, "EMBL-EBI / ENA");
  }

  /* ---------------- 2. Growth by year and technology ---------------- */

  var growthChart = null;

  function renderGrowth(root, D) {
    var g = D.growth, muted = token("--pp-text-muted", "#77766f");
    var surface = token("--pp-surface-raised", "#ffffff");
    var tokens = { ILLUMINA: "--pp-series-1", OXFORD_NANOPORE: "--pp-series-2", other: "--pp-series-rest" };

    field(root, "legend").innerHTML = g.platforms.map(function (p) {
      return '<span><i class="pp-resp-key" style="background:var(' + (tokens[p.id] || "--pp-series-rest")
        + ')"></i>' + esc(pick(p, "label")) + "</span>";
    }).join("");

    var partial = g.rows.filter(function (r) { return r.partial; })[0];
    field(root, "note").textContent = fill(L.growthNote, {
      year: partial ? partial.year : "", d: day(D.last_added),
      until: g.older_until, n: fmt(g.older_total)
    });

    if (growthChart) { growthChart.destroy(); growthChart = null; }
    if (window.Chart) {
      growthChart = new window.Chart(root.querySelector(".pp-card__plot canvas"), {
        type: "bar",
        data: {
          labels: g.rows.map(function (r) { return r.year; }),
          datasets: g.platforms.map(function (p) {
            var colour = token(tokens[p.id] || "--pp-series-rest", "#8b8a83");
            return {
              label: pick(p, "label"), ppKey: p.id,
              data: g.rows.map(function (r) { return r[p.id]; }),
              // The running year is incomplete; a lighter fill says so in the chart itself.
              backgroundColor: g.rows.map(function (r) { return r.partial ? withAlpha(colour, 0.5) : colour; }),
              borderColor: surface, borderWidth: { top: 2 }, borderRadius: 2, maxBarThickness: 30
            };
          })
        },
        options: {
          responsive: true, maintainAspectRatio: false, animation: false,
          interaction: { mode: "index", intersect: false },
          layout: { padding: { top: 6, right: 6 } },
          scales: {
            x: { stacked: true, grid: { display: false }, border: { color: token("--pp-border", "#e2e1dc") },
                 ticks: { color: muted, font: { size: 11 }, maxRotation: 0 } },
            y: { stacked: true, min: 0, grid: { color: token("--pp-grid", "#ebeae6") },
                 border: { display: false },
                 ticks: { color: muted, font: { size: 11 }, precision: 0, maxTicksLimit: 6,
                          callback: function (v) { return fmt(v); } } }
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              padding: 10, cornerRadius: 6, boxWidth: 9, boxHeight: 9,
              backgroundColor: token("--pp-text", "#0b0b0b"),
              titleColor: token("--pp-surface", "#fcfcfb"), bodyColor: token("--pp-surface", "#fcfcfb"),
              footerColor: token("--pp-surface", "#fcfcfb"),
              callbacks: {
                title: function (items) {
                  if (!items.length) return "";
                  var row = g.rows[items[0].dataIndex];
                  return row.year + (row.partial ? " · " + L.partial : "");
                },
                label: function (item) { return " " + item.dataset.label + ": " + fmt(item.parsed.y); },
                labelColor: function (item) {
                  var colour = token(tokens[item.dataset.ppKey] || "--pp-series-rest", "#8b8a83");
                  return { borderColor: colour, backgroundColor: colour };
                },
                footer: function (items) {
                  return items.length ? L.colTotal + ": " + fmt(g.rows[items[0].dataIndex].total) : "";
                }
              }
            }
          }
        }
      });
    }

    field(root, "table").innerHTML = '<table class="pp-table"><thead><tr><th>' + L.colYear + "</th>"
      + g.platforms.map(function (p) { return "<th>" + esc(pick(p, "label")) + "</th>"; }).join("")
      + "<th>" + L.colTotal + "</th></tr></thead><tbody>"
      + g.rows.map(function (r) {
          return "<tr><td>" + r.year + (r.partial ? " *" : "") + "</td>"
            + g.platforms.map(function (p) { return "<td>" + fmt(r[p.id]) + "</td>"; }).join("")
            + "<td>" + fmt(r.total) + "</td></tr>";
        }).join("") + "</tbody></table><p class=\"pp-note\">* " + L.partial + "</p>";
    wireTable(root);
    setOrigin(root, "EMBL-EBI / ENA");
  }

  /* ---------------- 3. Table of pathogens ---------------- */

  function renderTaxa(root, D) {
    var maxRuns = 0, maxSeqs = 0;
    D.groups.forEach(function (g) {
      g.rows.forEach(function (r) {
        if (r.runs > maxRuns) maxRuns = r.runs;
        if (r.sequences > maxSeqs) maxSeqs = r.sequences;
      });
    });
    function cell(value, max, extra) {
      return '<div class="pp-gen-cell"><b>' + fmt(value) + "</b>" + (value
        ? '<i class="' + extra + '" style="width:' + Math.max(2, 100 * value / (max || 1)).toFixed(1) + '%"></i>'
        : '<i class="pp-gen-bar--zero"></i>') + "</div>";
    }
    field(root, "legend").innerHTML =
      '<span><i class="pp-resp-key" style="background:var(--pp-series-1)"></i>' + L.legendRuns + "</span>"
      + '<span><i class="pp-resp-key" style="background:var(--pp-series-3)"></i>' + L.legendSeqs + "</span>";

    var head = "<thead><tr><th>" + L.colPathogen + "</th><th>" + L.colRuns + "</th><th>" + L.colSeqs
      + "</th><th>" + L.colLast + "</th><th>" + L.colPage + "</th><th></th></tr></thead>";
    field(root, "table").innerHTML = head + "<tbody>" + D.groups.map(function (g) {
      return '<tr class="pp-gen-group"><td colspan="6">' + esc(pick(g, "label")) + "</td></tr>"
        + g.rows.map(function (r) {
            var chip = r.note === "gisaid" ? '<span class="pp-tag">' + L.inGisaid + "</span>"
              : r.stale_since ? '<span class="pp-tag">' + fill(L.staleSince, { y: r.stale_since }) + "</span>" : "";
            var latin = r.italic ? "<i>" + esc(r.latin) + "</i>" : esc(r.latin);
            return "<tr><td class=\"l pp-gen-name\"><span>" + esc(pick(r, "name")) + "</span><small>" + latin + "</small></td>"
              + "<td>" + cell(r.runs, maxRuns, "") + "</td>"
              + "<td>" + cell(r.sequences, maxSeqs, "pp-gen-cell--seq") + "</td>"
              + '<td class="l">' + esc(pick(r, "last_label")) + " " + chip + "</td>"
              + '<td class="l">' + (r.page ? '<a href="' + esc(r.page) + '">' + esc(pick(r, "name")) + "</a>"
                                           : '<span class="pp-gen-muted">' + L.noPage + "</span>") + "</td>"
              + '<td class="l"><a href="' + esc(r.ena_url) + '" target="_blank" rel="noopener">ENA →</a></td></tr>';
          }).join("");
    }).join("") + "</tbody>";

    var none = field(root, "none");
    if (D.none && D.none.length) {
      none.textContent = fill(L.none, {
        list: D.none.map(function (x) { return pick(x, "name"); }).join(", ")
      });
    } else {
      none.hidden = true;
    }
    setOrigin(root, "EMBL-EBI / ENA");
  }

  /* ---------------- 4. How well the records are described ---------------- */

  function renderQuality(root, D) {
    var q = D.quality;
    field(root, "subtitle").textContent = fill(L.qualitySub, { n: fmt(q.runs) });
    field(root, "fields").innerHTML = bars(q.fields.map(function (f) {
      return { label: pick(f, "label"), value: f.share, text: pct(f.share, 0),
               sub: fill(L.filled, { n: fmt(f.filled), total: fmt(q.runs) }) };
    }));

    var tiles = [];
    if (q.lag_median !== null && q.lag_median !== undefined) {
      tiles.push({ label: L.lag, value: fmt(q.lag_median / 365.25, 1) + " " + L.years,
                   note: fill(L.lagNote, { a: fmt(q.lag_q1 / 365.25, 1), b: fmt(q.lag_q3 / 365.25, 1) }) });
    }
    tiles.push({ label: L.volume, value: fmt(q.bases / 1e9) + " " + L.gb, note: L.volumeNote });
    if (q.depth && q.depth.length) {
      var top = q.depth[0];
      tiles.push({ label: L.depth, value: fmt(top.median) + "×",
                   note: fill(L.depthNote, { species: top.species, n: fmt(top.runs) }) });
    }
    field(root, "tiles").innerHTML = tiles.map(function (x) {
      return '<div class="pp-stat"><div class="pp-stat__label">' + esc(x.label) + "</div>"
        + '<div class="pp-stat__value">' + x.value + "</div>"
        + '<div class="pp-stat__note">' + esc(x.note) + "</div></div>";
    }).join("");

    field(root, "table").innerHTML = '<table class="pp-table"><thead><tr><th>'
      + L.depth + "</th><th>" + L.colRuns + "</th><th>×</th></tr></thead><tbody>"
      + (q.depth || []).map(function (d) {
          return "<tr><td class=\"l\"><i>" + esc(d.species) + "</i></td><td>" + fmt(d.runs)
            + "</td><td>" + fmt(d.median) + "×</td></tr>";
        }).join("") + "</tbody></table>";
    wireTable(root);
    setOrigin(root, "EMBL-EBI / ENA");
  }

  /* ---------------- 5. Czech strains in public trees ---------------- */

  function renderLineages(root, D) {
    renderComment(root, D, (D.generated_at || "").slice(0, 10));
    var withData = D.trees.filter(function (t) { return t.czech > 0; });
    var empty = D.trees.filter(function (t) { return !t.czech; });

    field(root, "trees").innerHTML = withData.map(function (t) {
      return '<figure class="pp-card pp-gen-tree">'
        + '<figcaption class="pp-card__head"><div>'
        + '<h2 class="pp-card__title">' + esc(pick(t, "name")) + "</h2>"
        + '<p class="pp-card__subtitle">' + esc(fill(L.treeCz, { n: fmt(t.czech), total: fmt(t.tips) })
            + (t.from ? " · " + fill(L.treeCollected, { a: pick(t, "from_label"), b: pick(t, "to_label") }) : "")
            + " · " + fill(L.treeUpdated, { d: pick(t, "updated_label") })) + "</p>"
        + "</div></figcaption>"
        + (t.human === false ? '<p class="pp-gen-flag">' + L.treeNotHuman + "</p>" : "")
        + (t.clades.length ? '<div class="pp-gen-bars pp-gen-bars--clades"><span class="pp-gen-bars__head">'
            + L.treeLineages + "</span>" + bars(t.clades.map(function (c) {
                return { label: c.clade, value: c.count, text: fmt(c.count) };
              })) + "</div>" : "")
        + (t.hosts.length > 1 ? '<p class="pp-note">' + L.treeHosts + ": "
            + t.hosts.map(function (h) {
                return esc((L.host[h.host] !== undefined ? L.host[h.host] : h.host) + " " + fmt(h.count));
              }).join(" · ") + "</p>" : "")
        + '<div class="pp-card__foot"><span class="pp-origin">' + L.origin + " · Nextstrain"
        + (t.provenance ? " · " + esc(t.provenance) : "") + "</span>"
        + '<a class="pp-btn" href="' + esc(t.url) + '" target="_blank" rel="noopener">'
        + L.treeOpen + " →</a></div></figure>";
    }).join("");

    var line = field(root, "empty");
    if (empty.length) {
      line.textContent = fill(L.emptyLine, {
        list: empty.map(function (t) { return pick(t, "name"); }).join(", ")
      });
    } else {
      line.hidden = true;
    }
  }

  /* ---------------- 6. Resistance genes ---------------- */

  var MAX_GENES = 8;

  function moreGenes(genes) {
    var rest = genes.slice(MAX_GENES);
    if (!rest.length) return "";
    var counts = rest.map(function (g) { return g.count; });
    var lo = Math.min.apply(null, counts), hi = Math.max.apply(null, counts);
    return '<p class="pp-gen-group-note">' + esc(lo === hi && lo === 1
      ? fill(L.moreGenesOne, { n: fmt(rest.length) })
      : fill(L.moreGenes, { n: fmt(rest.length), a: fmt(lo), b: fmt(hi) })) + "</p>";
  }

  function renderAmr(root, D) {
    renderComment(root, D, (D.fetched_at || "").slice(0, 10));
    field(root, "organisms").innerHTML = D.organisms.map(function (o) {
      var sub = [fmt(o.isolates) + " " + L.isolates];
      if (o.from_year) sub.push(fill(L.collectedYears, { a: o.from_year, b: o.to_year }));
      if (o.environmental) sub.push(fill(L.environmental, { n: fmt(o.environmental) }));
      var groups = o.groups.filter(function (g) { return g.genes.length; });
      return '<figure class="pp-card pp-gen-org">'
        + '<figcaption class="pp-card__head"><div>'
        + '<h2 class="pp-card__title"><i>' + esc(o.organism) + "</i></h2>"
        + '<p class="pp-card__subtitle">' + esc(sub.join(" · ")) + "</p>"
        + "</div></figcaption>"
        + (groups.length ? groups.map(function (g) {
            return '<div class="pp-gen-group-block"><h3>' + esc(pick(g, "label")) + "</h3>"
              + '<p class="pp-gen-group-note">' + esc(pick(g, "note")) + " · "
              + esc(fill(L.geneIsolates, { n: fmt(g.isolates) })) + "</p>"
              // Dlouhý ocas genů s jedním nálezem by graf zaplavil; zbytek se shrne
              // do jedné věty, aby bylo vidět, že se nic nezamlčelo.
              + '<div class="pp-gen-bars">' + bars(g.genes.slice(0, MAX_GENES).map(function (x) {
                  return { label: x.gene, value: x.count, text: fmt(x.count) };
                })) + "</div>" + moreGenes(g.genes) + "</div>";
          }).join("") : '<p class="pp-note">' + L.noGroups + "</p>")
        + '<div class="pp-card__foot"><span class="pp-origin">' + L.origin
        + " · NCBI Pathogen Detection" + (o.release ? " · " + esc(o.release) : "") + "</span></div></figure>";
    }).join("");
  }

  /* ---------------- Start ---------------- */

  var RENDER = {
    overview: renderOverview, growth: renderGrowth, taxa: renderTaxa,
    quality: renderQuality, lineages: renderLineages, amr: renderAmr
  };
  var loaded = [];

  function init() {
    var parts = Array.prototype.slice.call(document.querySelectorAll("[data-pp-genomics]"));
    var cache = {};
    parts.forEach(function (root) {
      var part = root.getAttribute("data-pp-genomics"), src = root.getAttribute("data-src");
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
        console.warn("pp-genomics: " + part + " not shown (" + error.message + ")");
        root.remove();
      });
    });
  }

  // Recolour the canvas on theme switch, using the same signal as pp-charts.js.
  new MutationObserver(function () {
    loaded.forEach(function (x) {
      if (x.part === "growth" && document.contains(x.root)) RENDER.growth(x.root, x.data);
    });
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-bs-theme"] });

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})(window, document);
