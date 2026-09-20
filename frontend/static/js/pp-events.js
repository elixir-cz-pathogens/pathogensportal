/* Akce na titulce: roztřídění na nadcházející/proběhlé a měsíční kalendář.
 *
 * Značkování vypisuje partials/home-events.html — všechny akce jedním seznamem.
 * Tenhle skript je roztřídí PODLE DNEŠNÍHO DATA V PROHLÍŽEČI (web je statický,
 * rozdělení při buildu by zastarávalo) a nakreslí kalendář s vyznačenými dny.
 *
 * ⚠️ Akce je „nadcházející", dokud neskončila — probíhající akce sem patří taky.
 * ⚠️ Nadcházející a proběhlé se v kalendáři liší TVAREM (plné kolečko × obrys),
 *    ne jen barvou, a stav je i v aria-label dne.
 */
(function (document) {
  "use strict";

  var root = document.querySelector("[data-pp-events]");
  if (!root) return;

  var lang = root.getAttribute("data-lang") || "cs-CZ";
  var PAST_VISIBLE = 3;       // kolik proběhlých akcí je vidět bez výběru v kalendáři
  var MAX_SPAN_DAYS = 60;     // pojistka proti překlepu v end_date (rok místo měsíce)

  function L(key) { return root.getAttribute("data-l-" + key) || ""; }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function dayKey(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function startOfDay(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
  function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  var now = new Date();
  var todayKey = dayKey(now);

  /* ---------------- Data ze značkování ---------------- */

  var events = Array.prototype.slice.call(root.querySelectorAll(".pp-event")).map(function (li) {
    var start = new Date(li.getAttribute("data-start"));
    var end = new Date(li.getAttribute("data-end") || li.getAttribute("data-start"));
    if (isNaN(end) || end < start) end = start;
    return {
      li: li,
      start: start,
      end: end,
      upcoming: end >= now,
      title: (li.querySelector(".pp-event__title") || {}).textContent || ""
    };
  }).filter(function (ev) { return !isNaN(ev.start); });

  var byDay = {};
  events.forEach(function (ev) {
    var d = startOfDay(ev.start);
    var last = startOfDay(ev.end);
    for (var i = 0; d <= last && i < MAX_SPAN_DAYS; i++) {
      var key = dayKey(d);
      (byDay[key] = byDay[key] || []).push(ev);
      d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
    }
  });

  /* ---------------- Seznam: nadcházející a proběhlé ---------------- */

  var listHost = root.querySelector("[data-pp-events-list]");

  function group(title, list, emptyText, limit) {
    var frag = document.createDocumentFragment();
    var head = document.createElement("h3");
    head.className = "pp-events__head";
    head.textContent = title;
    frag.appendChild(head);
    if (!list.length) {
      var p = document.createElement("p");
      p.className = "pp-events__empty";
      p.textContent = emptyText;
      frag.appendChild(p);
      return frag;
    }
    var ol = document.createElement("ol");
    ol.className = "pp-events__list";
    list.forEach(function (ev, i) {
      ev.li.classList.add(ev.upcoming ? "is-upcoming" : "is-past");
      if (limit && i >= limit) {
        ev.li.hidden = true;
        ev.li.setAttribute("data-pp-overflow", "");
      }
      ol.appendChild(ev.li);
    });
    frag.appendChild(ol);
    return frag;
  }

  if (events.length) {
    var upcoming = events.filter(function (ev) { return ev.upcoming; })
      .sort(function (a, b) { return a.start - b.start; });
    var past = events.filter(function (ev) { return !ev.upcoming; })
      .sort(function (a, b) { return b.start - a.start; });

    listHost.innerHTML = "";
    listHost.appendChild(group(L("upcoming"), upcoming, L("none-upcoming"), 0));
    if (past.length) listHost.appendChild(group(L("past"), past, "", PAST_VISIBLE));
  }

  /* ---------------- Kalendář ---------------- */

  var cal = root.querySelector("[data-pp-cal]");
  var titleEl = root.querySelector("[data-pp-cal-title]");
  var bodyEl = root.querySelector("[data-pp-cal-body]");
  var weekdaysEl = root.querySelector("[data-pp-cal-weekdays]");
  if (!cal || !titleEl || !bodyEl || !weekdaysEl || !window.Intl) return;

  var monthFmt = new Intl.DateTimeFormat(lang, { month: "long", year: "numeric" });
  var dayFmt = new Intl.DateTimeFormat(lang, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  var weekdayShort = new Intl.DateTimeFormat(lang, { weekday: "short" });
  var weekdayLong = new Intl.DateTimeFormat(lang, { weekday: "long" });

  // Týden začíná pondělím (cs-CZ i en-GB). 1. 1. 2024 bylo pondělí.
  for (var w = 0; w < 7; w++) {
    var ref = new Date(2024, 0, 1 + w);
    var th = document.createElement("th");
    th.scope = "col";
    th.textContent = weekdayShort.format(ref).replace(/\.$/, "");
    th.title = weekdayLong.format(ref);
    weekdaysEl.appendChild(th);
  }

  var view = new Date(now.getFullYear(), now.getMonth(), 1);
  var selectedKey = null;

  function select(key) {
    selectedKey = selectedKey === key ? null : key;
    var chosen = selectedKey ? byDay[selectedKey] || [] : [];
    events.forEach(function (ev) {
      var on = chosen.indexOf(ev) !== -1;
      ev.li.classList.toggle("is-selected", on);
      // Proběhlá akce za limitem je skrytá; vybraná v kalendáři se musí ukázat.
      if (ev.li.hasAttribute("data-pp-overflow")) ev.li.hidden = !on;
    });
    if (chosen.length) {
      var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      chosen[0].li.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" });
    }
    render();
  }

  function render() {
    var y = view.getFullYear();
    var m = view.getMonth();
    titleEl.textContent = capitalize(monthFmt.format(view));
    bodyEl.innerHTML = "";

    var offset = (new Date(y, m, 1).getDay() + 6) % 7;
    var cursor = new Date(y, m, 1 - offset);
    for (var row = 0; row < 6; row++) {
      var tr = document.createElement("tr");
      for (var col = 0; col < 7; col++) {
        var d = cursor;
        var key = dayKey(d);
        var evs = byDay[key];
        var td = document.createElement("td");
        var cell;
        if (evs) {
          var anyUpcoming = evs.some(function (ev) { return ev.upcoming; });
          cell = document.createElement("button");
          cell.type = "button";
          cell.className = "pp-cal__day " + (anyUpcoming ? "has-upcoming" : "has-past");
          cell.setAttribute("aria-pressed", selectedKey === key ? "true" : "false");
          cell.setAttribute("aria-label", dayFmt.format(d) + ": " + evs.map(function (ev) {
            return ev.title + " (" + L(ev.upcoming ? "state-upcoming" : "state-past") + ")";
          }).join("; "));
          cell.addEventListener("click", (function (k) { return function () { select(k); }; })(key));
        } else {
          cell = document.createElement("span");
          cell.className = "pp-cal__day";
        }
        cell.textContent = d.getDate();
        if (d.getMonth() !== m) cell.classList.add("is-out");
        if (key === todayKey) {
          cell.classList.add("is-today");
          cell.setAttribute("aria-current", "date");
        }
        td.appendChild(cell);
        tr.appendChild(td);
        cursor = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
      }
      bodyEl.appendChild(tr);
    }
  }

  root.querySelector("[data-pp-cal-prev]").addEventListener("click", function () {
    view = new Date(view.getFullYear(), view.getMonth() - 1, 1);
    render();
  });
  root.querySelector("[data-pp-cal-next]").addEventListener("click", function () {
    view = new Date(view.getFullYear(), view.getMonth() + 1, 1);
    render();
  });

  render();
  cal.hidden = false;
})(document);
