/* Dark mode toggle.
 *
 * Opt-in: the site is light unless the visitor presses the moon in the header.
 * The choice is kept in localStorage ("pp-theme") and re-applied by an inline
 * script in head.html before the first paint. The attribute is
 * data-bs-theme on <html> — Bootstrap 5.3, dashboards.css, pp-dark.css and the
 * chart scripts (pp-charts.js, pp-flu.js re-colour on change) all key off it.
 */
(function () {
  "use strict";
  var KEY = "pp-theme";
  var root = document.documentElement;

  function isDark() { return root.getAttribute("data-bs-theme") === "dark"; }

  function sync() {
    document.querySelectorAll("[data-pp-theme-toggle]").forEach(function (b) {
      b.setAttribute("aria-pressed", isDark() ? "true" : "false");
    });
  }

  function set(dark) {
    if (dark) root.setAttribute("data-bs-theme", "dark");
    else root.removeAttribute("data-bs-theme");
    try { if (dark) localStorage.setItem(KEY, "dark"); else localStorage.removeItem(KEY); } catch (e) { /* private mode: works for this page only */ }
    sync();
  }

  document.addEventListener("DOMContentLoaded", function () {
    sync();
    document.querySelectorAll("[data-pp-theme-toggle]").forEach(function (b) {
      b.addEventListener("click", function () { set(!isDark()); });
    });
  });
})();
