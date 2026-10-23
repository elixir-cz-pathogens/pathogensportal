/* Data intake forms (TODO D15): the request form (shortcodes/intake-request.html)
 * and the upload form (shortcodes/intake-upload.html).
 *
 * Browser checks are for the applicant's convenience; website-be validates
 * everything again. While a form has no data-endpoint (params.intake.api is
 * empty) it sends nothing. */
(function () {
  "use strict";

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  function invalid(form, out) {
    if (form.checkValidity()) return false;
    form.classList.add("was-validated");
    var bad = form.querySelector(":invalid");
    if (bad) bad.focus();
    out.textContent = "Vyplňte prosím označená pole.";
    return true;
  }

  /* ── Request form ─────────────────────────────────────────────────────── */
  document.querySelectorAll("[data-pp-intake]").forEach(function (form) {
    var out = form.querySelector(".pp-intake__result");
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      out.textContent = "";
      if (invalid(form, out)) return;
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = typeof v === "string" ? v.trim() : v; });
      data.no_personal_data = form.elements.no_personal_data.checked;
      data.privacy_ack = form.elements.privacy_ack.checked;

      var endpoint = form.dataset.endpoint;
      if (!endpoint) {
        var pre = el("pre", "pp-intake__preview", JSON.stringify(data, null, 2));
        out.append("Odesílání zatím není zapnuté. Takto by vypadala vaše žádost:", pre);
        return;
      }
      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      }).then(function (r) {
        if (r.ok) {
          out.textContent = "Děkujeme, žádost jsme přijali. Ozveme se vám e-mailem.";
          form.reset();
        } else if (r.status === 429) {
          out.textContent = "Odeslali jste příliš mnoho žádostí. Zkuste to prosím za hodinu.";
        } else {
          out.textContent = "Žádost se nepodařilo odeslat (" + r.status + "). Zkontrolujte prosím údaje.";
        }
      }).catch(function () {
        out.textContent = "Žádost se nepodařilo odeslat. Zkontrolujte připojení a zkuste to znovu.";
      });
    });
  });

  /* ── Upload form ──────────────────────────────────────────────────────── */
  function rowsCs(n) {
    return n + (n === 1 ? " řádek" : n >= 2 && n <= 4 ? " řádky" : " řádků");
  }

  function renderReport(out, body) {
    var rep = body.report || {};
    var n = (rep.files || []).length;
    var several = n > 1;
    if (body.status === "accepted") {
      out.append(el("p", "pp-intake__ok",
        (!several ? "Soubor je" : n === 2 ? "Oba soubory jsou" : n <= 4 ? "Všechny " + n + " soubory jsou"
          : "Všech " + n + " souborů je") + " v pořádku (" + rowsCs(rep.rows) +
        "); " + (several ? "uložili jsme je." : "uložili jsme ho.")));
    } else {
      out.append(el("p", null, "Nahrání jsme nepřijali. Opravte prosím tyto chyby a nahrajte ho znovu:"));
    }
    var issues = rep.issues || [];
    if (issues.length) {
      var ul = el("ul", "pp-intake__issues");
      issues.forEach(function (i) {
        var where = [];
        // Name the file only when there is more than one; for one it is noise.
        if (i.file && several) where.push(i.file);
        if (i.line) where.push("řádek " + i.line);
        if (i.column) where.push("sloupec " + i.column);
        var li = el("li", i.level === "error" ? "is-error" : "is-warning",
          (i.level === "error" ? "Chyba" : "Upozornění") + (where.length ? " (" + where.join(", ") + ")" : "") +
          ": " + i.message);
        ul.append(li);
      });
      out.append(ul);
      if (rep.truncated) out.append(el("p", null, "…a další. Opravte nejdřív tyto."));
    }
  }

  document.querySelectorAll("[data-pp-upload]").forEach(function (form) {
    var out = form.querySelector(".pp-intake__result");
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      out.textContent = "";
      if (invalid(form, out)) return;
      var endpoint = form.dataset.endpoint;
      if (!endpoint) {
        out.textContent = "Nahrávání zatím není zapnuté.";
        return;
      }
      var fd = new FormData();
      Array.prototype.forEach.call(form.elements.file.files, function (f) { fd.append("file", f); });
      fd.append("template", form.elements.template.value);
      // The key of the ticked declaration; the backend records it with the upload.
      fd.append("declaration", form.elements.declaration.checked ? form.elements.declaration.value : "");
      out.textContent = "Nahrávám a kontroluji…";
      fetch(endpoint, {
        method: "POST",
        headers: { "Authorization": "Bearer " + form.elements.key.value.trim() },
        body: fd
      }).then(function (r) {
        out.textContent = "";
        if (r.status === 401) { out.textContent = "Klíč není platný. Zkontrolujte ho, případně nás kontaktujte."; return; }
        return r.json().then(function (body) {
          if (body.status === "duplicate") {
            out.textContent = "Tyto soubory už máme (přijaté " +
              new Date(body.received_at).toLocaleString("cs-CZ") + "). Nic dalšího není potřeba.";
          } else if (body.report) renderReport(out, body);
          else out.textContent = "Nahrání se nepodařilo (" + r.status + "): " + (body.detail || "");
        });
      }).catch(function () {
        out.textContent = "Nahrání se nepodařilo. Zkontrolujte připojení a zkuste to znovu.";
      });
    });
  });
})();
