/* Vykreslování grafů na dashboardech Pathogen Portalu.
 *
 * ZDROJ DAT — statika první, API jako bonus:
 * Na začátku stránky se **jednou** zeptáme `/api/charts`, jestli backend žije.
 * Když ano, grafy berou čerstvá data z databáze; když ne (nebo API vůbec
 * neexistuje, což je dnešní stav produkce), sáhnou po commitnutém JSON
 * v /data/charts/. Payload je v obou případech bajt po bajtu stejný, takže
 * fallback mění jen URL, ne kód. Web tím zůstává statický ve smyslu modelu A —
 * bez běžícího BE se nic nerozbije.
 *
 * BARVY: všechny jdou z CSS proměnných v dashboards.css (--pp-*). Barvy, které
 * si nese samotný JSON z generate_json.py, se ignorují — jinak by vzhled
 * portálu určoval generátor v cizím repu a každý graf by vypadal jinak.
 */
(function (window, document) {
  "use strict";

  var API_BASE = (window.PP_API_BASE || "").replace(/\/$/, "");
  var STATIC_DIR = "/data/charts/";
  var MAX_SERIES = 8; // počet slotů palety; devátá řada se skládá do „Ostatní"
  var LOCALE = "cs-CZ";

  var nf = new Intl.NumberFormat(LOCALE);
  var nf1 = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 1 });

  function fmt(value) {
    if (value === null || value === undefined || value === "") return "—";
    if (typeof value !== "number") return String(value);
    return Number.isInteger(value) ? nf.format(value) : nf1.format(value);
  }

  /* ---------------- Design tokeny ---------------- */

  function tokens() {
    var probe = document.querySelector(".pp-viz") || document.body;
    var css = getComputedStyle(probe);
    function v(name, fallback) {
      return (css.getPropertyValue(name) || "").trim() || fallback;
    }
    var series = [];
    for (var i = 1; i <= MAX_SERIES; i++) {
      series.push(v("--pp-series-" + i, "#2a78d6"));
    }
    return {
      series: series,
      rest: v("--pp-series-rest", "#8b8a83"),
      surface: v("--pp-surface-raised", "#ffffff"),
      grid: v("--pp-grid", "#ebeae6"),
      text: v("--pp-text", "#0b0b0b"),
      textSecondary: v("--pp-text-secondary", "#52514e"),
      textMuted: v("--pp-text-muted", "#77766f"),
      seqLow: v("--pp-seq-low", "#cde2fb"),
      seqHigh: v("--pp-seq-high", "#104281")
    };
  }

  function withAlpha(hex, alpha) {
    var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
    if (!m) return hex;
    return (
      "rgba(" +
      parseInt(m[1], 16) + "," + parseInt(m[2], 16) + "," + parseInt(m[3], 16) +
      "," + alpha + ")"
    );
  }

  /* ---------------- Zdroj dat ---------------- */

  var apiIndexPromise = null;

  /** Jediný dotaz na dostupnost API za stránku; výsledkem je Set klíčů (nebo prázdný). */
  function apiIndex() {
    if (apiIndexPromise) return apiIndexPromise;
    apiIndexPromise = fetch(API_BASE + "/api/charts", { headers: { Accept: "application/json" } })
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function (body) {
        var keys = new Set();
        (body.charts || []).forEach(function (c) { keys.add(c.key); });
        return keys;
      })
      .catch(function () {
        return new Set(); // BE neběží nebo endpoint neexistuje -> jedeme ze statiky
      });
    return apiIndexPromise;
  }

  function keyFromSrc(src) {
    return src.split("/").pop().replace(/\.json$/, "");
  }

  /** Vrátí { payload, origin: "api" | "static" }. */
  function loadChartData(src) {
    var key = keyFromSrc(src);
    return apiIndex().then(function (keys) {
      if (!keys.has(key)) return fetchStatic(src);
      return fetch(API_BASE + "/api/charts/" + encodeURIComponent(key))
        .then(function (r) {
          if (!r.ok) throw new Error("HTTP " + r.status);
          return r.json();
        })
        .then(function (payload) { return { payload: payload, origin: "api" }; })
        .catch(function () { return fetchStatic(src); });
    });
  }

  function fetchStatic(src) {
    return fetch(src)
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function (payload) { return { payload: payload, origin: "static" }; });
  }

  /* ---------------- Úprava dat pro vykreslení ---------------- */

  function magnitude(dataset) {
    return (dataset.data || []).reduce(function (sum, value) {
      return sum + Math.abs(typeof value === "number" ? value : 0);
    }, 0);
  }

  /**
   * Nad MAX_SERIES řad se ty nejmenší sečtou do jedné šedé „Ostatní".
   * Devátá barva se nevymýšlí — paleta má osm validovaných slotů a devátý hue
   * by rozbil odlišitelnost při barvosleposti.
   *
   * Které řady zůstanou, rozhoduje velikost; **pořadí** ale zůstává původní,
   * takže slot (a tedy barva) patří konkrétní řadě, ne jejímu pořadí v žebříčku.
   */
  function foldExtraSeries(datasets) {
    if (datasets.length <= MAX_SERIES) return datasets.slice();

    var ranked = datasets.slice().sort(function (a, b) { return magnitude(b) - magnitude(a); });
    var keep = new Set(ranked.slice(0, MAX_SERIES - 1));

    var kept = [];
    var folded = [];
    datasets.forEach(function (dataset) {
      (keep.has(dataset) ? kept : folded).push(dataset);
    });

    var length = Math.max.apply(null, folded.map(function (d) { return (d.data || []).length; }));
    var summed = [];
    for (var i = 0; i < length; i++) {
      var total = 0;
      var seen = false;
      folded.forEach(function (d) {
        var value = (d.data || [])[i];
        if (typeof value === "number") { total += value; seen = true; }
      });
      summed.push(seen ? total : null);
    }

    kept.push({
      label: "Ostatní (" + folded.length + ")",
      data: summed,
      type: folded[0] && folded[0].type,
      ppRest: true
    });
    return kept;
  }

  /** Nastaví barvy a tloušťky podle mark specs; barvy z payloadu ignoruje. */
  function styleDatasets(datasets, t, chartType) {
    return datasets.map(function (dataset, index) {
      var color = dataset.ppRest ? t.rest : t.series[index % t.series.length];
      var isBar = (dataset.type || chartType) === "bar";
      var styled = Object.assign({}, dataset, {
        borderColor: color,
        backgroundColor: dataset.fill || isBar ? withAlpha(color, isBar ? 1 : 0.1) : color,
        ppColor: color
      });
      if (isBar) {
        styled.borderWidth = 0;
        styled.borderRadius = { topLeft: 4, topRight: 4, bottomLeft: 0, bottomRight: 0 };
        styled.borderSkipped = "bottom";
        styled.maxBarThickness = 24;
        // 2px mezera v barvě povrchu mezi sousedními sloupci místo obrysu
        styled.barPercentage = 0.86;
        styled.categoryPercentage = 0.86;
      } else {
        styled.borderWidth = 2;
        styled.tension = 0.3;
        styled.pointRadius = 0;
        styled.pointHoverRadius = 4;
        styled.pointHoverBorderWidth = 2;
        styled.pointHoverBorderColor = t.surface; // prstenec v barvě povrchu
        styled.pointBackgroundColor = color;
        styled.borderJoinStyle = "round";
        styled.borderCapStyle = "round";
        styled.fill = dataset.fill ? { target: "origin" } : false;
      }
      return styled;
    });
  }

  /* ---------------- Chart.js pluginy ---------------- */

  /** Svislý zaměřovač pod kurzorem — čtení víc řad v jednom okamžiku. */
  var crosshair = {
    id: "ppCrosshair",
    afterDatasetsDraw: function (chart, _args, opts) {
      var active = chart.tooltip && chart.tooltip.getActiveElements();
      if (!active || !active.length) return;
      var x = active[0].element.x;
      var area = chart.chartArea;
      var ctx = chart.ctx;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, area.top);
      ctx.lineTo(x, area.bottom);
      ctx.lineWidth = 1;
      ctx.strokeStyle = opts.color;
      ctx.stroke();
      ctx.restore();
    }
  };

  /**
   * Hodnota u konce čáry. Popisky se **nerozestrkávají** — když by se překryly,
   * radši nejsou žádné a identitu nese legenda s tooltipem.
   */
  var endLabels = {
    id: "ppEndLabels",
    afterDatasetsDraw: function (chart, _args, opts) {
      if (!opts || !opts.enabled) return;
      var placed = [];
      chart.data.datasets.forEach(function (dataset, i) {
        if ((dataset.type || chart.config.type) === "bar" || !chart.isDatasetVisible(i)) return;
        var meta = chart.getDatasetMeta(i);
        for (var p = meta.data.length - 1; p >= 0; p--) {
          if (typeof dataset.data[p] === "number") {
            placed.push({ x: meta.data[p].x, y: meta.data[p].y, value: dataset.data[p] });
            break;
          }
        }
      });
      if (placed.length < 1) return;
      var sorted = placed.slice().sort(function (a, b) { return a.y - b.y; });
      for (var k = 1; k < sorted.length; k++) {
        if (Math.abs(sorted[k].y - sorted[k - 1].y) < 14) return; // kolize -> žádné popisky
      }
      var ctx = chart.ctx;
      ctx.save();
      ctx.font = "600 11px " + opts.font;
      ctx.fillStyle = opts.color;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      placed.forEach(function (point) {
        ctx.fillText(fmt(point.value), point.x + 8, point.y);
      });
      ctx.restore();
    }
  };

  /* ---------------- Graf ---------------- */

  function baseOptions(t, datasets, chartType) {
    var multi = datasets.length > 1;
    var lineCount = datasets.filter(function (d) {
      return (d.type || chartType) !== "bar";
    }).length;
    return {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { right: lineCount ? 52 : 4, top: 4 } },
      interaction: { mode: "index", intersect: false },
      plugins: {
        // Jedna řada legendu nepotřebuje — titulek karty ji pojmenovává.
        legend: multi
          ? {
              position: "top",
              align: "start",
              labels: {
                usePointStyle: true,
                pointStyle: "rectRounded",
                boxWidth: 8,
                boxHeight: 8,
                padding: 14,
                color: t.textSecondary
              }
            }
          : { display: false },
        tooltip: {
          backgroundColor: t.text,
          titleColor: t.surface,
          bodyColor: t.surface,
          padding: 10,
          cornerRadius: 6,
          usePointStyle: true,
          displayColors: multi,
          callbacks: {
            label: function (item) {
              return " " + item.dataset.label + ": " + fmt(item.parsed.y);
            }
          }
        },
        ppCrosshair: { color: t.grid },
        ppEndLabels: {
          enabled: lineCount > 0 && lineCount <= 4,
          color: t.textMuted,
          font: getComputedStyle(document.body).fontFamily
        }
      },
      scales: {
        x: {
          grid: { display: false },
          border: { color: t.grid },
          ticks: { color: t.textMuted, maxTicksLimit: 12, maxRotation: 0, autoSkip: true }
        },
        y: {
          beginAtZero: true,
          grid: { color: t.grid, drawTicks: false },
          border: { display: false },
          ticks: { color: t.textMuted, padding: 8, callback: function (v) { return fmt(v); } }
        }
      }
    };
  }

  /**
   * Tabulka se staví z **původních** řad, ne z těch složených do „Ostatní" —
   * co graf kvůli osmi slotům palety sloučí, tady zůstává rozepsané.
   */
  function buildTable(payload, colorByLabel, t) {
    var datasets = payload.datasets || [];
    var head = ["<tr><th scope=\"col\">Období</th>"];
    datasets.forEach(function (d, i) {
      var label = d.label || "Řada " + (i + 1);
      head.push(
        '<th scope="col"><span class="pp-swatch" style="background:' +
        (colorByLabel[label] || t.rest) + '"></span>' + escapeHtml(label) + "</th>"
      );
    });
    head.push("</tr>");

    var rows = (payload.labels || []).map(function (label, row) {
      var cells = ['<tr><th scope="row">' + escapeHtml(String(label)) + "</th>"];
      datasets.forEach(function (d) {
        cells.push("<td>" + fmt((d.data || [])[row]) + "</td>");
      });
      return cells.join("") + "</tr>";
    });

    return (
      '<table class="pp-table"><caption class="visually-hidden">Data grafu v tabulce</caption>' +
      "<thead>" + head.join("") + "</thead><tbody>" + rows.join("") + "</tbody></table>"
    );
  }

  function escapeHtml(value) {
    return value.replace(/[&<>"]/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch];
    });
  }

  function setOrigin(root, origin) {
    var el = root.querySelector("[data-pp-origin]");
    if (!el) return;
    var live = origin === "api";
    el.classList.toggle("pp-origin--live", live);
    el.textContent = live ? "živá data z databáze" : "statický snímek dat";
  }

  function showError(root, message) {
    var plot = root.querySelector(".pp-card__plot");
    if (plot) {
      plot.innerHTML = '<div class="pp-error"><span aria-hidden="true">⚠</span><span>' +
        escapeHtml(message) + "</span></div>";
      plot.style.height = "auto";
    }
  }

  function renderChart(root) {
    var canvas = root.querySelector("canvas");
    var src = root.dataset.src;
    var instance = null;

    function draw(payload) {
      var t = tokens();
      var chartType = root.dataset.type || "line";
      var datasets = styleDatasets(foldExtraSeries(payload.datasets || []), t, chartType);
      if (instance) instance.destroy();
      instance = new Chart(canvas, {
        type: chartType,
        data: { labels: payload.labels, datasets: datasets },
        options: baseOptions(t, datasets, chartType),
        plugins: [crosshair, endLabels]
      });

      var tableWrap = root.querySelector(".pp-table-wrap");
      if (tableWrap) {
        var colorByLabel = {};
        datasets.forEach(function (d) { colorByLabel[d.label] = d.ppColor; });
        tableWrap.innerHTML = buildTable(payload, colorByLabel, t);
      }
    }

    loadChartData(src)
      .then(function (result) {
        var skeleton = root.querySelector(".pp-skeleton");
        if (skeleton) skeleton.remove();
        setOrigin(root, result.origin);
        draw(result.payload);
        onThemeChange(function () { draw(result.payload); });
      })
      .catch(function (err) {
        var skeleton = root.querySelector(".pp-skeleton");
        if (skeleton) skeleton.remove();
        showError(root, "Data grafu se nepodařilo načíst (" + err.message + ").");
      });

    var toggle = root.querySelector("[data-pp-table-toggle]");
    if (toggle) {
      toggle.addEventListener("click", function () {
        var wrap = root.querySelector(".pp-table-wrap");
        var open = wrap.getAttribute("data-open") === "true";
        wrap.setAttribute("data-open", open ? "false" : "true");
        toggle.setAttribute("aria-expanded", open ? "false" : "true");
        toggle.textContent = open ? "Tabulka" : "Skrýt tabulku";
      });
    }
  }

  /* ---------------- Statistické dlaždice ---------------- */

  var STAT_FIELDS = [
    { key: "celkem_nakazenych", label: "Celkem nakažených", slot: 1 },
    { key: "celkem_umrti", label: "Celkem úmrtí", slot: 8 },
    { key: "celkem_testu", label: "Celkem testů", slot: 3 },
    { key: "cfr_pct", label: "Smrtnost (CFR)", slot: 2, suffix: " %" }
  ];

  function renderStats(root) {
    loadChartData(root.dataset.src)
      .then(function (result) {
        var data = result.payload;
        var t = tokens();
        var tiles = STAT_FIELDS.filter(function (field) {
          return data[field.key] !== undefined && data[field.key] !== null;
        }).map(function (field) {
          return (
            '<div class="pp-stat" style="--pp-stat-accent:' + t.series[field.slot - 1] + '">' +
            '<div class="pp-stat__label">' + field.label + "</div>" +
            '<div class="pp-stat__value">' + fmt(data[field.key]) + (field.suffix || "") + "</div>" +
            '<div class="pp-stat__note">k ' + escapeHtml(String(data.posledni_datum || "—")) + "</div>" +
            "</div>"
          );
        });
        root.innerHTML = tiles.join("") ||
          '<div class="pp-error">Souhrnná data nejsou k dispozici.</div>';
        setOrigin(root.parentNode, result.origin);
      })
      .catch(function () {
        root.innerHTML = '<div class="pp-error">Souhrnná data se nepodařilo načíst.</div>';
      });
  }

  /* ---------------- Mapa krajů ---------------- */

  function mixHex(from, to, ratio) {
    function parse(hex) {
      var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
      return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [0, 0, 0];
    }
    var a = parse(from);
    var b = parse(to);
    return "rgb(" + a.map(function (channel, i) {
      return Math.round(channel + (b[i] - channel) * ratio);
    }).join(",") + ")";
  }

  function renderMap(root) {
    var svg = root.querySelector("svg");
    var tooltip = root.querySelector(".pp-tooltip");

    loadChartData(root.dataset.src)
      .then(function (result) {
        var data = result.payload;
        var regions = data.regions || {};
        var labels = data.labels || {};
        // Co se vlastně počítá. Mapy incidence nesou "unit" v JSONu; bez něj
        // zůstává původní znění, aby se starší datové soubory chovaly stejně.
        var unit = data.unit || "případů";
        var values = Object.keys(regions).map(function (code) { return regions[code]; })
          .filter(function (v) { return v > 0; });
        var min = Math.min.apply(null, values);
        var max = Math.max.apply(null, values);
        var t = tokens();

        Object.keys(regions).forEach(function (code) {
          var path = svg.querySelector('[data-region="' + code + '"]');
          if (!path) return;
          var value = regions[code] || 0;
          var ratio = max === min ? 0.5 : (value - min) / (max - min);
          path.style.fill = mixHex(t.seqLow, t.seqHigh, ratio);

          // Popisek leží uvnitř výplně — barvu textu volíme podle jejího jasu,
          // jinak tmavé kraje končí tmavým písmem na tmavém podkladu.
          var label = svg.querySelector('[data-region-label="' + code + '"]');
          if (label) label.style.fill = ratio > 0.5 ? t.surface : t.textSecondary;
          path.setAttribute("tabindex", "0");
          path.setAttribute("role", "img");
          path.setAttribute("aria-label", (labels[code] || code) + ": " + fmt(value) + " " + unit);

          function show(event) {
            tooltip.style.display = "block";
            tooltip.textContent = (labels[code] || code) + ": " + fmt(value) +
              " " + unit + " (" + data.year + ")";
            var rect = root.getBoundingClientRect();
            var x = event.clientX !== undefined ? event.clientX : rect.left + rect.width / 2;
            var y = event.clientY !== undefined ? event.clientY : rect.top;
            tooltip.style.left = (x - rect.left + 12) + "px";
            tooltip.style.top = (y - rect.top - 32) + "px";
          }
          path.addEventListener("mouseenter", show);
          path.addEventListener("mousemove", show);
          path.addEventListener("focus", show);
          path.addEventListener("mouseleave", function () { tooltip.style.display = "none"; });
          path.addEventListener("blur", function () { tooltip.style.display = "none"; });
        });

        var legend = root.parentNode.querySelector(".pp-map__legend");
        if (legend) {
          legend.querySelector("[data-pp-min]").textContent = fmt(min);
          legend.querySelector("[data-pp-max]").textContent = fmt(max);
        }
        setOrigin(root.parentNode, result.origin);
      })
      .catch(function () {
        root.innerHTML = '<div class="pp-error"><span aria-hidden="true">⚠</span>' +
          "<span>Data mapy se nepodařilo načíst.</span></div>";
      });
  }

  /* ---------------- Přebarvení při přepnutí motivu ---------------- */

  var themeListeners = [];

  function onThemeChange(callback) {
    themeListeners.push(callback);
  }

  new MutationObserver(function () {
    themeListeners.forEach(function (callback) { callback(); });
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-bs-theme"] });

  /* ---------------- Start ---------------- */

  function init() {
    if (window.Chart) {
      Chart.defaults.font.family = getComputedStyle(document.body).fontFamily;
      Chart.defaults.font.size = 12;
      Chart.defaults.color = tokens().textSecondary;
      document.querySelectorAll("[data-pp-chart]").forEach(renderChart);
    }
    document.querySelectorAll("[data-pp-stats]").forEach(renderStats);
    document.querySelectorAll("[data-pp-map]").forEach(renderMap);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window, document);
