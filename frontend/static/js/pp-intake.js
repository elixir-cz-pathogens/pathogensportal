/* Data intake forms (TODO D15): the request form (shortcodes/intake-request.html),
 * the upload form (shortcodes/intake-upload.html) and the key hand-over
 * (shortcodes/intake-claim.html).
 *
 * Browser checks are for the applicant's convenience; website-be validates
 * everything again. While a form has no data-endpoint (params.intake.api is
 * empty) it sends nothing. */
(function () {
  "use strict";

  /* The page language picks the message: the same script serves the Czech and
     the English intake pages. Messages that come from website-be (`detail`,
     the issues in a report) are Czech in both. */
  var EN = (document.documentElement.lang || "").indexOf("en") === 0;
  function t(cs, en) { return EN ? en : cs; }

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
    out.textContent = t("Vyplňte prosím označená pole.", "Please fill in the marked fields.");
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
        out.append(t("Odesílání zatím není zapnuté. Takto by vypadala vaše žádost:", "Sending is not switched on yet. This is what your request would look like:"), pre);
        return;
      }
      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      }).then(function (r) {
        if (r.ok) {
          out.textContent = t("Děkujeme, žádost jsme přijali. Ozveme se vám e-mailem.", "Thank you, we have received your request. We will get back to you by e-mail.");
          form.reset();
        } else if (r.status === 429) {
          out.textContent = t("Odeslali jste příliš mnoho žádostí. Zkuste to prosím za hodinu.", "You have sent too many requests. Please try again in an hour.");
        } else {
          out.textContent = t("Žádost se nepodařilo odeslat (", "The request could not be sent (") + r.status + t("). Zkontrolujte prosím údaje.", "). Please check the details.");
        }
      }).catch(function () {
        out.textContent = t("Žádost se nepodařilo odeslat. Zkontrolujte připojení a zkuste to znovu.", "The request could not be sent. Check your connection and try again.");
      });
    });
  });

  /* ── Upload form ──────────────────────────────────────────────────────── */
  function rowsCs(n) {
    if (EN) return n + (n === 1 ? " row" : " rows");
    return n + (n === 1 ? " řádek" : n >= 2 && n <= 4 ? " řádky" : " řádků");
  }

  function renderReport(out, body) {
    var rep = body.report || {};
    var n = (rep.files || []).length;
    var several = n > 1;
    if (body.status === "accepted") {
      out.append(el("p", "pp-intake__ok",
        EN ? (several ? "All " + n + " files are" : "The file is") + " fine (" + rowsCs(rep.rows) + "); we have stored " +
             (several ? "them." : "it.")
           : (!several ? "Soubor je" : n === 2 ? "Oba soubory jsou" : n <= 4 ? "Všechny " + n + " soubory jsou"
              : "Všech " + n + " souborů je") + " v pořádku (" + rowsCs(rep.rows) +
             "); " + (several ? "uložili jsme je." : "uložili jsme ho.")));
    } else {
      out.append(el("p", null, t("Nahrání jsme nepřijali. Opravte prosím tyto chyby a nahrajte ho znovu:", "We did not accept the upload. Please fix these errors and upload it again:")));
    }
    var issues = rep.issues || [];
    if (issues.length) {
      var ul = el("ul", "pp-intake__issues");
      issues.forEach(function (i) {
        var where = [];
        // Name the file only when there is more than one; for one it is noise.
        if (i.file && several) where.push(i.file);
        if (i.line) where.push(t("řádek ", "row ") + i.line);
        if (i.column) where.push("sloupec " + i.column);
        var li = el("li", i.level === "error" ? "is-error" : "is-warning",
          (i.level === "error" ? t("Chyba", "Error") : t("Upozornění", "Warning")) + (where.length ? " (" + where.join(", ") + ")" : "") +
          ": " + i.message);
        ul.append(li);
      });
      out.append(ul);
      if (rep.truncated) out.append(el("p", null, t("…a další. Opravte nejdřív tyto.", "…and more. Fix these first.")));
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
        out.textContent = t("Nahrávání zatím není zapnuté.", "Uploading is not switched on yet.");
        return;
      }
      var fd = new FormData();
      Array.prototype.forEach.call(form.elements.file.files, function (f) { fd.append("file", f); });
      fd.append("template", form.elements.template.value);
      // The key of the ticked declaration; the backend records it with the upload.
      fd.append("declaration", form.elements.declaration.checked ? form.elements.declaration.value : "");
      out.textContent = t("Nahrávám a kontroluji…", "Uploading and checking…");
      fetch(endpoint, {
        method: "POST",
        headers: { "Authorization": "Bearer " + form.elements.key.value.trim() },
        body: fd
      }).then(function (r) {
        out.textContent = "";
        if (r.status === 401) { out.textContent = t("Klíč není platný. Zkontrolujte ho, případně nás kontaktujte.", "The key is not valid. Check it or contact us."); return; }
        return r.json().then(function (body) {
          if (body.status === "duplicate") {
            out.textContent = t("Tyto soubory už máme (přijaté ", "We already have these files (received ") +
              new Date(body.received_at).toLocaleString(EN ? "en-GB" : "cs-CZ") + t("). Nic dalšího není potřeba.", "). Nothing else is needed.");
          } else if (body.report) {
            renderReport(out, body);
            if (body.key_revoked) {
              out.append(el("p", null, t("Klíč byl jednorázový a tímto nahráním přestal platit. Děkujeme za příspěvek.", "The key was single-use and is no longer valid after this upload. Thank you for your contribution.")));
            }
          }
          else out.textContent = t("Nahrání se nepodařilo (", "The upload failed (") + r.status + "): " + (body.detail || "");
        });
      }).catch(function () {
        out.textContent = t("Nahrání se nepodařilo. Zkontrolujte připojení a zkuste to znovu.", "The upload failed. Check your connection and try again.");
      });
    });
  });
  /* ── Key hand-over (shortcodes/intake-claim.html) ─────────────────────── */
  document.querySelectorAll("[data-pp-claim]").forEach(function (box) {
    var out = box.querySelector(".pp-intake__result");
    var start = box.querySelector("[data-pp-claim-start]");
    var done = box.querySelector("[data-pp-claim-done]");
    // Take the token and drop it from the address bar at once, so it is not
    // left in the history or on the screen for anyone looking over a shoulder.
    var token = decodeURIComponent(location.hash.replace(/^#/, ""));
    if (location.hash) history.replaceState(null, "", location.pathname);
    if (!/^ppc_[A-Za-z0-9_-]{20,}$/.test(token)) {
      start.hidden = true;
      out.textContent = t("Odkaz není úplný. Otevřete prosím celý odkaz z e-mailu.", "The link is incomplete. Please open the whole link from the e-mail.");
      return;
    }
    box.querySelector("[data-pp-claim-go]").addEventListener("click", function (ev) {
      var btn = ev.currentTarget;
      if (!box.dataset.endpoint) { out.textContent = t("Převzetí klíče zatím není zapnuté.", "Key hand-over is not switched on yet."); return; }
      btn.disabled = true;
      out.textContent = t("Vytvářím klíč…", "Creating the key…");
      fetch(box.dataset.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token }),
        cache: "no-store"
      }).then(function (r) {
        return r.json().then(function (body) {
          out.textContent = "";
          if (!r.ok) {
            out.textContent = body.detail || (t("Převzetí se nepodařilo (", "The hand-over failed (") + r.status + ").");
            return;
          }
          token = "";
          start.hidden = true;
          done.hidden = false;
          var input = box.querySelector("[data-pp-claim-key]");
          input.value = body.key;
          input.select();
          box.querySelector("[data-pp-claim-mode]").textContent = body.single_use
            ? t("Klíč je jednorázový: platí pro jedno přijaté nahrání dat.", "The key is single-use: it is valid for one accepted upload.")
            : t("Klíč platí pro opakované nahrávání dat.", "The key is valid for repeated uploads.");
        });
      }).catch(function () {
        btn.disabled = false;
        out.textContent = t("Převzetí se nepodařilo. Zkontrolujte připojení a zkuste to znovu.", "The hand-over failed. Check your connection and try again.");
      });
    });
    box.querySelector("[data-pp-claim-copy]").addEventListener("click", function () {
      var input = box.querySelector("[data-pp-claim-key]");
      input.select();
      if (navigator.clipboard) navigator.clipboard.writeText(input.value);
      else document.execCommand("copy");
      out.textContent = t("Zkopírováno.", "Copied.");
    });
  });
})();
