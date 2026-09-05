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
  var LOCALE = (document.documentElement.lang || "").indexOf("en") === 0 ? "en-GB" : "cs-CZ";

  /* ---------------- Lokalizace ----------------
   * Datové JSONy nesou české popisky (generuje je pipeline). Anglická verze
   * webu je překládá tímhle slovníkem — je záměrně konečný: popisky, které
   * v něm nejsou (např. 114 názvů ISIN diagnóz), zůstávají česky a stránky
   * to přiznávají poznámkou. Trvalé řešení řeší pathogensportal-db#47.
   */
  var EN = (document.documentElement.lang || "").indexOf("en") === 0;
  var CS_EN = {
    "Nové případy (týden)": "New cases (week)",
    "Úmrtí (týden)": "Deaths (week)",
    "Úmrtí": "Deaths",
    "Případy": "Cases",
    "Hospitalizace": "Hospitalisations",
    "Hospitalizovaní celkem": "Hospitalised, total",
    "JIP": "ICU",
    "UPV (plicní ventilace)": "Mechanical ventilation",
    "ECMO": "ECMO",
    "PCR pozitivita (%)": "PCR positivity (%)",
    "7denní incidence / 100 000": "7-day incidence / 100,000",
    "Hospitalizační míra (%)": "Hospitalisation rate (%)",
    "Smrtnost (CFR %)": "Case fatality (CFR %)",
    "Bez očkování": "Unvaccinated",
    "Nedokončené očkování": "Incomplete vaccination",
    "Dokončené očkování": "Complete vaccination",
    "Posilující dávka": "Booster dose",
    "Influenza A (celkem)": "Influenza A (total)",
    "Coronavirus (sezónní)": "Coronavirus (seasonal)",
    "Potvrzené případy (kumulativní)": "Confirmed cases (cumulative)",
    "Potvrzená úmrtí (kumulativní)": "Confirmed deaths (cumulative)",
    "Úmrtí mezi potvrzenými případy (kumulativní)": "Deaths among confirmed cases (cumulative)",
    "Nově hlášené případy (den)": "Newly reported cases (day)",
    "Západní Afrika 2014–2016": "West Africa 2014–2016",
    "DRK 2012": "DRC 2012", "DRK 2018–2020": "DRC 2018–2020", "DRK 2020": "DRC 2020",
    "DRK 2025": "DRC 2025", "DRK 2026": "DRC 2026",
    "Praha + Stř. Čechy": "Prague + Central Bohemia",
    "Den od prvního hlášeného případu": "Day since first reported case",
    "den": "day",
    "Období": "Period",
    "Ostatní": "Other",
    "Tabulka": "Table",
    "Skrýt tabulku": "Hide table",
    "Data grafu v tabulce": "Chart data as a table",
    "živá data z databáze": "live data from the database",
    "statický snímek dat": "static data snapshot",
    "případů": "cases",
    "Celkem nakažených": "Total cases",
    "Celkem úmrtí": "Total deaths",
    "Celkem testů": "Total tests",
    "Smrtnost (CFR)": "Case fatality (CFR)",
    "Diagnóza": "Diagnosis", "Kraj": "Region",
    "Očekáváno": "Expected", "Práh": "Threshold", "Síla": "Strength",
    "vzácná nemoc": "rare disease",
    "mimo dosavadní výskyt": "outside prior occurrence",
    "Řady nad očekávanou hladinou": "Series above the expected level",
    "Období ": "Period ",
    " · hodnoceno ": " · scored ",
    " řad (diagnóza × kraj) · ": " series (diagnosis × region) · ",
    " překročení": " exceedances",
    " z nich čekáme čistou náhodou": " of them expected by chance alone",
    "Žádná řada aktuálně nepřekračuje očekávanou hladinu.": "No series currently exceeds the expected level.",
    "Zobrazit všech ": "Show all ",
    "Zobrazit jen prvních ": "Show only the first ",
    "Kolik případů bylo za daný měsíc skutečně nahlášeno": "How many cases were actually notified in the given month",
    "Endemická hladina z modelu — běžný počet pro tuhle nemoc, kraj a roční dobu": "The model's endemic level — the usual count for this disease, region and time of year",
    "Horní mez běžného kolísání (99. percentil); signál začíná nad ní": "Upper limit of ordinary fluctuation (99th percentile); a signal starts above it",
    "Kolikrát pozorování překročilo vzdálenost od očekávání k prahu; 1× = přesně na prahu": "How many times the observation exceeded the expectation-to-threshold distance; 1× = exactly at the threshold",
    "k ": "as of ",
    "Data grafu se nepodařilo načíst": "Chart data could not be loaded",
    "Souhrnná data nejsou k dispozici.": "Summary data is not available.",
    "Souhrnná data se nepodařilo načíst.": "Summary data could not be loaded.",
    "Data mapy se nepodařilo načíst.": "Map data could not be loaded.",
    "Signály se nepodařilo načíst": "Signals could not be loaded"
  };
  function tr(text) {
    if (!EN || text === null || text === undefined) return text;
    return CS_EN[text] !== undefined ? CS_EN[text] : text;
  }
  /** Přeloží popisky v payloadu (na místě) — volá se hned po načtení dat. */
  function localizePayload(payload) {
    if (!EN || !payload) return payload;
    (payload.datasets || []).forEach(function (d) { d.label = tr(d.label); });
    if (payload.x_title) payload.x_title = tr(payload.x_title);
    if (payload.x_unit) payload.x_unit = tr(payload.x_unit);
    if (payload.unit) payload.unit = tr(payload.unit);
    return payload;
  }

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
        .then(function (payload) { return { payload: localizePayload(payload), origin: "api" }; })
        .catch(function () { return fetchStatic(src); });
    });
  }

  function fetchStatic(src) {
    return fetch(src)
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function (payload) { return { payload: localizePayload(payload), origin: "static" }; });
  }

  /* ---------------- Úprava dat pro vykreslení ---------------- */

  /**
   * Hodnota bodu bez ohledu na tvar dat. Řady na kategorické ose jsou pole čísel
   * (a `null` tam, kde hodnota chybí), řady na číselné ose jsou {x, y} objekty.
   * Zbytek kódu ten rozdíl nemá řešit.
   */
  function yOf(value) {
    if (typeof value === "number") return value;
    if (value && typeof value.y === "number") return value.y;
    return null;
  }

  function magnitude(dataset) {
    return (dataset.data || []).reduce(function (sum, value) {
      var y = yOf(value);
      return sum + Math.abs(y === null ? 0 : y);
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
      label: tr("Ostatní") + " (" + folded.length + ")",
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
        // Řídké řady: Chart.js kreslí úsečku jen mezi *sousedními* nenulovými
        // body, takže série jako [28, null, null, 64] nenakreslila nic a s
        // nulovým poloměrem bodu zmizela z grafu úplně — data byla dohledatelná
        // jen v tooltipu. spanGaps mezeru přemostí; u kumulativních řad je to
        // i věcně správně, mezi dvěma hlášeními křivka opravdu spojitě roste.
        styled.spanGaps = true;
        // Osamocený bod (bez souseda, se kterým by šla vést čára) se musí
        // vykreslit sám za sebe, jinak by taková řada nebyla vidět vůbec.
        styled.pointRadius = function (ctx) {
          var data = (ctx.dataset && ctx.dataset.data) || [];
          if (yOf(data[ctx.dataIndex]) === null) return 0;
          var before = ctx.dataIndex > 0 ? yOf(data[ctx.dataIndex - 1]) : null;
          var after = ctx.dataIndex < data.length - 1 ? yOf(data[ctx.dataIndex + 1]) : null;
          return before === null && after === null ? 2.5 : 0;
        };
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
          var value = yOf(dataset.data[p]);
          if (value !== null) {
            placed.push({ x: meta.data[p].x, y: meta.data[p].y, value: value });
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

  function baseOptions(t, datasets, chartType, payload) {
    var multi = datasets.length > 1;
    // Číselná osa X: vzdálenost na ose odpovídá hodnotě, ne pořadí popisku.
    // Bez ní se u srovnání trajektorií kreslí den 0→4 stejně široce jako 59→85
    // a sklony křivek — tedy to jediné, co má graf ukázat — nic neznamenají.
    var linearX = payload && payload.x_scale === "linear";
    var xUnit = (payload && payload.x_unit) || "";
    var logY = payload && payload.y_scale === "logarithmic";
    var lineCount = datasets.filter(function (d) {
      return (d.type || chartType) !== "bar";
    }).length;
    return {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { right: lineCount ? 52 : 4, top: 4 } },
      // "index" páruje body podle pořadí v poli, což na kategorické ose sedí —
      // všechny řady tam sdílejí popisky. Na číselné ose má ale každá řada své
      // vlastní body, takže by se do jednoho tooltipu dostal den 5 jedné epidemie
      // a den 88 druhé. Tam se proto hledá nejbližší bod podle osy X.
      interaction: linearX
        ? { mode: "nearest", axis: "x", intersect: false }
        : { mode: "index", intersect: false },
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
            title: linearX
              ? function (items) {
                  return (xUnit ? xUnit + " " : "") + fmt(items[0].parsed.x);
                }
              : undefined,
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
          type: linearX ? "linear" : undefined,
          bounds: linearX ? "data" : undefined,
          title: payload && payload.x_title
            ? { display: true, text: payload.x_title, color: t.textMuted, padding: { top: 6 } }
            : undefined,
          grid: { display: false },
          border: { color: t.grid },
          ticks: { color: t.textMuted, maxTicksLimit: 12, maxRotation: 0, autoSkip: true }
        },
        y: {
          // Logaritmická osa se hodí tam, kde řady spolu srovnávané leží o řády
          // od sebe — na lineární ose by se ty menší slisovaly na nulu. Sklon
          // křivky pak navíc odpovídá *rychlosti* růstu, ne absolutnímu počtu.
          type: logY ? "logarithmic" : undefined,
          beginAtZero: !logY, // log(0) neexistuje; osa začíná na nejmenší hodnotě
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
    var head = ['<tr><th scope="col">' + escapeHtml(payload.x_title || tr("Období")) + "</th>"];
    datasets.forEach(function (d, i) {
      var label = d.label || "Řada " + (i + 1);
      head.push(
        '<th scope="col"><span class="pp-swatch" style="background:' +
        (colorByLabel[label] || t.rest) + '"></span>' + escapeHtml(label) + "</th>"
      );
    });
    head.push("</tr>");

    var rows;
    if (payload.x_scale === "linear") {
      // Bez společných popisků se řádky staví ze sjednocení x hodnot všech řad
      // a hodnota se dohledává podle x — řady tu nejsou zarovnané na společnou
      // osu, každá nese jen své vlastní body.
      var xs = [];
      datasets.forEach(function (d) {
        (d.data || []).forEach(function (point) {
          if (point && xs.indexOf(point.x) === -1) xs.push(point.x);
        });
      });
      xs.sort(function (a, b) { return a - b; });
      var unit = payload.x_unit ? payload.x_unit + " " : "";
      rows = xs.map(function (x) {
        var cells = ['<tr><th scope="row">' + escapeHtml(unit + fmt(x)) + "</th>"];
        datasets.forEach(function (d) {
          var hit = (d.data || []).filter(function (p) { return p && p.x === x; })[0];
          cells.push("<td>" + fmt(hit ? hit.y : null) + "</td>");
        });
        return cells.join("") + "</tr>";
      });
    } else {
      rows = (payload.labels || []).map(function (label, row) {
        var cells = ['<tr><th scope="row">' + escapeHtml(String(label)) + "</th>"];
        datasets.forEach(function (d) {
          cells.push("<td>" + fmt((d.data || [])[row]) + "</td>");
        });
        return cells.join("") + "</tr>";
      });
    }

    return (
      '<table class="pp-table"><caption class="visually-hidden">' + tr("Data grafu v tabulce") + '</caption>' +
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
    el.textContent = live ? tr("živá data z databáze") : tr("statický snímek dat");
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
        options: baseOptions(t, datasets, chartType, payload),
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
        showError(root, tr("Data grafu se nepodařilo načíst") + " (" + err.message + ").");
      });

    var toggle = root.querySelector("[data-pp-table-toggle]");
    if (toggle) {
      toggle.addEventListener("click", function () {
        var wrap = root.querySelector(".pp-table-wrap");
        var open = wrap.getAttribute("data-open") === "true";
        wrap.setAttribute("data-open", open ? "false" : "true");
        toggle.setAttribute("aria-expanded", open ? "false" : "true");
        toggle.textContent = open ? tr("Tabulka") : tr("Skrýt tabulku");
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
            '<div class="pp-stat__label">' + tr(field.label) + "</div>" +
            '<div class="pp-stat__value">' + fmt(data[field.key]) + (field.suffix || "") + "</div>" +
            '<div class="pp-stat__note">' + tr("k ") + escapeHtml(String(data.posledni_datum || "—")) + "</div>" +
            "</div>"
          );
        });
        root.innerHTML = tiles.join("") ||
          '<div class="pp-error">' + tr("Souhrnná data nejsou k dispozici.") + '</div>';
        setOrigin(root.parentNode, result.origin);
      })
      .catch(function () {
        root.innerHTML = '<div class="pp-error">' + tr("Souhrnná data se nepodařilo načíst.") + '</div>';
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
        var unit = data.unit || tr("případů");
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
          "<span>" + tr("Data mapy se nepodařilo načíst.") + "</span></div>";
      });
  }

  /* ---------------- Signály detekce anomálií ---------------- */

  var SIGNALS_PREVIEW = 20;   // řádků viditelných bez rozbalení
  var NOMINAL_ALPHA = 0.01;   // 99. percentil — tolik překročení čekáme náhodou

  /**
   * Tabulka aktuálních překročení očekávané hladiny. Poctivost je tu součást
   * návrhu: hlavička vždy říká, kolik překročení bychom při daném prahu čekali
   * čistou náhodou — bez té věty by seznam vypadal jako seznam epidemií.
   */
  function renderSignals(root) {
    var body = root.querySelector("[data-pp-signals-body]");

    function typeBadge(s) {
      if (s.type === "rare") return '<span class="badge text-bg-warning">' + tr("vzácná nemoc") + '</span>';
      if (s.type === "sporadic") return '<span class="badge text-bg-warning">' + tr("mimo dosavadní výskyt") + '</span>';
      return s.score !== null && s.score !== undefined ? fmt(s.score) + "×" : "—";
    }

    function draw(data) {
      var signals = data.signals || [];
      var expectedByChance = Math.round((data.n_series_scored || 0) * NOMINAL_ALPHA);
      var html =
        '<p class="pp-card__subtitle">' + tr("Období ") + '<strong>' + escapeHtml(String(data.target_period || "—")) +
        "</strong>" + tr(" · hodnoceno ") + fmt(data.n_series_scored) + tr(" řad (diagnóza × kraj) · ") +
        "<strong>" + fmt(signals.length) + tr(" překročení") + "</strong>" +
        (expectedByChance ? " · ~" + fmt(expectedByChance) + tr(" z nich čekáme čistou náhodou") : "") +
        "</p>";

      if (!signals.length) {
        body.innerHTML = html +
          '<p class="pp-error" style="color:inherit">' + tr("Žádná řada aktuálně nepřekračuje očekávanou hladinu.") + '</p>';
        return;
      }

      var rows = signals.map(function (s, i) {
        return "<tr" + (i >= SIGNALS_PREVIEW ? ' hidden data-pp-signals-extra' : "") + ">" +
          '<td class="text-end">' + (i + 1) + "</td>" +
          "<td>" + escapeHtml(s.diagnoza_nazev || s.diagnoza || "?") + "</td>" +
          "<td>" + escapeHtml(s.kraj_nazev || s.kraj_kod || "?") + "</td>" +
          '<td class="text-end"><strong>' + fmt(s.observed) + "</strong></td>" +
          '<td class="text-end">' + fmt(s.expected) + "</td>" +
          '<td class="text-end">' + fmt(s.threshold) + "</td>" +
          '<td class="text-end">' + typeBadge(s) + "</td>" +
          "</tr>";
      });

      html += '<div style="overflow-x:auto"><table class="pp-table">' +
        '<caption class="visually-hidden">' + tr("Řady nad očekávanou hladinou") + '</caption>' +
        '<thead><tr><th scope="col">#</th><th scope="col">' + tr("Diagnóza") + '</th><th scope="col">' + tr("Kraj") + '</th>' +
        '<th scope="col" class="text-end" title="' + tr("Kolik případů bylo za daný měsíc skutečně nahlášeno") + '">' + tr("Případy") + '</th>' +
        '<th scope="col" class="text-end" title="' + tr("Endemická hladina z modelu — běžný počet pro tuhle nemoc, kraj a roční dobu") + '">' + tr("Očekáváno") + '</th>' +
        '<th scope="col" class="text-end" title="' + tr("Horní mez běžného kolísání (99. percentil); signál začíná nad ní") + '">' + tr("Práh") + '</th>' +
        '<th scope="col" class="text-end" title="' + tr("Kolikrát pozorování překročilo vzdálenost od očekávání k prahu; 1× = přesně na prahu") + '">' + tr("Síla") + '</th></tr></thead>' +
        "<tbody>" + rows.join("") + "</tbody></table></div>";

      if (signals.length > SIGNALS_PREVIEW) {
        html += '<button type="button" class="pp-btn mt-2" data-pp-signals-more aria-expanded="false">' +
          tr("Zobrazit všech ") + fmt(signals.length) + "</button>";
      }
      body.innerHTML = html;

      var more = body.querySelector("[data-pp-signals-more]");
      if (more) {
        more.addEventListener("click", function () {
          var open = more.getAttribute("aria-expanded") === "true";
          body.querySelectorAll("[data-pp-signals-extra]").forEach(function (tr) {
            tr.hidden = open;
          });
          more.setAttribute("aria-expanded", open ? "false" : "true");
          more.textContent = open
            ? tr("Zobrazit všech ") + fmt(signals.length)
            : tr("Zobrazit jen prvních ") + SIGNALS_PREVIEW;
        });
      }
    }

    loadChartData(root.dataset.src)
      .then(function (result) {
        setOrigin(root, result.origin);
        draw(result.payload);
      })
      .catch(function (err) {
        body.innerHTML = '<div class="pp-error"><span aria-hidden="true">⚠</span><span>' +
          tr("Signály se nepodařilo načíst") + " (" + escapeHtml(err.message) + ").</span></div>";
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

  /* ---------------- Signály: tabulka + mapa jedné diagnózy ---------------- */

  /* Mapa neukazuje POČET signálů, ale JEDNU vybranou diagnózu: kraje se obarví
     podle síly jejího signálu, kraje bez signálu zůstanou bílé. Tabulka vlevo je
     výpis i přepínač; ve výchozím stavu je vybraný nejsilnější signál.

     Čte tentýž anomaly_signals.json jako všechno ostatní kolem signálů — žádný
     nový datový soubor, tedy ani změna v -db.

     ⚠️ Řádky s kraj_kod === "CZ" NEJSOU součtem krajů; detect_anomalies.py je
     počítá zvlášť nad celostátní řadou. Do mapy proto nejdou vůbec a zobrazují se
     jako samostatná věta pod ní. */
  function renderSignalMap(root) {
    var svg     = root.querySelector("svg");
    var tbody   = root.querySelector("[data-pp-signalmap-rows]");
    var titleEl = root.querySelector("[data-pp-signalmap-title]");
    var emptyEl = root.querySelector("[data-pp-signalmap-empty]");
    var legend  = root.querySelector("[data-pp-signalmap-legend]");
    var natEl   = root.querySelector("[data-pp-signalmap-national]");
    var tooltip = root.querySelector(".pp-tooltip");
    if (!svg || !tbody) return;

    loadChartData(root.dataset.src)
      .then(function (result) {
        var all = (result.payload || {}).signals || [];

        /* Seskupení podle diagnózy. Klíčem je KÓD MKN-10, ne český název —
           název je volný text a je to jediná věc, která se dá přejmenovat. */
        var groups = {};
        all.forEach(function (sig) {
          var key = sig.diagnoza;
          if (!groups[key]) {
            groups[key] = { code: key, name: sig.diagnoza_nazev || key, regions: {}, national: null, max: 0 };
          }
          if (sig.kraj_kod === "CZ") { groups[key].national = sig; return; }
          groups[key].regions[sig.kraj_kod] = sig;
          if (sig.score > groups[key].max) groups[key].max = sig.score;
        });

        var order = Object.keys(groups).sort(function (a, b) {
          return groups[b].max - groups[a].max;
        });
        if (!order.length) return;

        var t = tokens();
        var regionPaths = {};
        svg.querySelectorAll("[data-region]").forEach(function (path) {
          regionPaths[path.getAttribute("data-region")] = path;
        });

        function clearMap() {
          Object.keys(regionPaths).forEach(function (code) {
            var path = regionPaths[code];
            /* ⛔ Bílá, ne „nejsvětlejší odstín škály". Kraj bez signálu není kraj
               s nejnižší hodnotou — je to kraj, o kterém model nic netvrdí, a to
               se nesmí splést s „skoro nic". */
            path.style.fill = "#ffffff";
            path.classList.remove("is-clickable");
            path.removeAttribute("tabindex");
            path.removeAttribute("aria-label");
            var label = svg.querySelector('[data-region-label="' + code + '"]');
            if (label) label.style.fill = t.textMuted;
          });
        }

        function select(code) {
          var g = groups[code];
          if (!g) return;

          tbody.querySelectorAll("[data-dg]").forEach(function (tr) {
            var on = tr.getAttribute("data-dg") === code;
            tr.classList.toggle("is-selected", on);
            tr.setAttribute("aria-selected", on ? "true" : "false");
          });

          titleEl.textContent = g.name;
          clearMap();

          var codes = Object.keys(g.regions);
          var scores = codes.map(function (c) { return g.regions[c].score; });
          var min = scores.length ? Math.min.apply(null, scores) : 0;
          var max = scores.length ? Math.max.apply(null, scores) : 0;

          if (!codes.length) {
            /* Diagnóza má jen celostátní signál, v žádném kraji ne. Mapa zůstane
               bílá a řekne proč — prázdná mapa bez vysvětlení vypadá jako chyba. */
            emptyEl.hidden = false;
            emptyEl.textContent = tr("V žádném kraji tato diagnóza signál nemá.");
            legend.hidden = true;
          } else {
            emptyEl.hidden = true;
            legend.hidden = false;
            legend.querySelector("[data-pp-min]").textContent = fmt(min);
            legend.querySelector("[data-pp-max]").textContent = fmt(max);
          }

          codes.forEach(function (rc) {
            var path = regionPaths[rc];
            if (!path) return;
            var sig = g.regions[rc];
            var ratio = max === min ? 1 : (sig.score - min) / (max - min);
            path.style.fill = mixHex(t.seqLow, t.seqHigh, ratio);
            var label = svg.querySelector('[data-region-label="' + rc + '"]');
            if (label) label.style.fill = ratio > 0.5 ? t.surface : t.textSecondary;
            path.classList.add("is-clickable");
            path.setAttribute("tabindex", "0");
            path.setAttribute("aria-label",
              sig.kraj_nazev + ": " + fmt(sig.observed) + " " + tr("případů") +
              ", " + tr("očekáváno") + " " + fmt(sig.expected) +
              ", " + tr("práh") + " " + fmt(sig.threshold));

            function show(event) {
              tooltip.style.display = "block";
              tooltip.innerHTML =
                "<strong>" + escapeHtml(sig.kraj_nazev) + "</strong><br>" +
                tr("případů") + ": " + fmt(sig.observed) + "<br>" +
                tr("očekáváno") + ": " + fmt(sig.expected) + "<br>" +
                tr("práh") + ": " + fmt(sig.threshold) + "<br>" +
                tr("síla") + ": " + fmt(sig.score) + "×";
              var rect = root.getBoundingClientRect();
              var x = event.clientX !== undefined ? event.clientX : rect.left + rect.width / 2;
              var y = event.clientY !== undefined ? event.clientY : rect.top;
              tooltip.style.left = (x - rect.left + 12) + "px";
              tooltip.style.top = (y - rect.top - 70) + "px";
            }
            path.addEventListener("mouseenter", show);
            path.addEventListener("mousemove", show);
            path.addEventListener("focus", show);
            path.addEventListener("mouseleave", function () { tooltip.style.display = "none"; });
            path.addEventListener("blur", function () { tooltip.style.display = "none"; });
          });

          if (g.national) {
            natEl.hidden = false;
            natEl.innerHTML = "<strong>" + tr("Celostátně") + ":</strong> " +
              fmt(g.national.observed) + " " + tr("případů") + ", " +
              tr("očekáváno") + " " + fmt(g.national.expected) + ", " +
              tr("práh") + " " + fmt(g.national.threshold) +
              " (" + fmt(g.national.score) + "×)";
          } else {
            natEl.hidden = true;
          }
        }

        tbody.querySelectorAll("[data-dg]").forEach(function (row) {
          row.setAttribute("tabindex", "0");
          row.setAttribute("role", "button");
          row.addEventListener("click", function () { select(row.getAttribute("data-dg")); });
          row.addEventListener("keydown", function (e) {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(row.getAttribute("data-dg")); }
          });
        });

        select(order[0]);
        setOrigin(root, result.origin);
      })
      .catch(function () {
        var host = root.querySelector("[data-pp-signalmap-title]");
        if (host) host.textContent = tr("Data signálů se nepodařilo načíst.");
      });
  }

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
    document.querySelectorAll("[data-pp-signals]").forEach(renderSignals);
    document.querySelectorAll("[data-pp-signalmap]").forEach(renderSignalMap);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window, document);
