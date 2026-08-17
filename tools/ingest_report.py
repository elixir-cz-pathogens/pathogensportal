#!/usr/bin/env python3
"""Ingest an externally generated situational report into the portal.

The report **is not authored in the portal**. A generator (AI with a human in the
loop) delivers it as a finished static site — one folder, one HTML file per
section. This script turns that into portal pages:

    incoming/<report>/*.html  ──ingest──>  frontend/content/cs/dashboards/*.html
                                           frontend/static/data/charts/*.json

What it does and why:

1. **Cuts out `<main>`** and discards `<head>`, `<header>`, `<nav>` and `<footer>`.
   The delivered page has its own navigation and footer; inserting them whole would
   give the portal everything twice and the foreign CSS would fight ours.

2. **Sanitizes** against an allowlist of tags and attributes. The content is
   machine-generated and headed for a public site — the human review focuses on the
   subject-matter accuracy of the text, not on whether a `<script>` or `onclick`
   appeared somewhere. This is a cheap safeguard that complements that review
   rather than replacing it.

3. **Extracts the data from inline JS** (`reportData`, `trajectorySeries`) into
   chart JSON under `/data/charts/` and replaces the chart with our component. That
   way foreign JavaScript never has to reach the portal at all, the chart gets the
   portal's appearance, a tabular listing and an API connection — and the data
   becomes part of the portal's data layer (it can be loaded into Postgres via
   `python -m app.loader`).

4. **Rewrites the links between sections** per the map in
   `frontend/data/reports.yaml`, so the portal's URLs do not depend on how the
   generator names its files.

5. **Reports unknown classes.** The appearance rests on
   `frontend/static/css/reports.css` knowing the generator's classes. When a new one
   appears in a delivery, the script prints it — otherwise the section would simply
   fall apart silently.

The run is **idempotent**: the same input yields the same output, so `git diff`
shows exactly what changed in the report that day.

Usage:
    python tools/ingest_report.py ebola --source /cesta/k/incoming/ebola
    python tools/ingest_report.py ebola --check      # verify only, write nothing
"""

from __future__ import annotations

import argparse
import json
import re
import shutil
import sys
from pathlib import Path

import yaml
from bs4 import BeautifulSoup, Comment

REPO = Path(__file__).resolve().parent.parent
FRONTEND = REPO / "frontend"
REPORTS_YAML = FRONTEND / "data" / "reports.yaml"
CONTENT_DIR = FRONTEND / "content" / "cs" / "dashboards"
CHARTS_DIR = FRONTEND / "static" / "data" / "charts"

# --- Sanitizace ------------------------------------------------------------
# An allowlist, not a blocklist: whatever isn't here is discarded. A blocklist
# would mean every new idea from the generator passes until somebody notices.
ALLOWED_TAGS = {
    "a", "abbr", "article", "aside", "b", "blockquote", "br", "caption", "cite",
    "code", "dd", "details", "div", "dl", "dt", "em", "figcaption", "figure",
    "h2", "h3", "h4", "h5", "h6", "hr", "i", "img", "li", "ol", "p", "pre",
    "section", "small", "span", "strong", "sub", "summary", "sup", "table",
    "tbody", "td", "tfoot", "th", "thead", "time", "tr", "ul",
}
ALLOWED_ATTRS = {
    "class", "id", "href", "src", "alt", "title", "colspan", "rowspan",
    "datetime", "lang", "scope", "role", "download", "tabindex", "aria-label",
    "aria-labelledby", "aria-hidden", "aria-describedby",
}
# Tags discarded together with their content (for the rest, the content is kept).
DROP_WITH_CONTENT = {"script", "style", "noscript", "iframe", "object", "embed", "form"}

SAFE_URL = re.compile(r"^(https?:|mailto:|/|#|\.?/)", re.I)


class IngestError(Exception):
    pass


def load_report(key: str) -> dict:
    reports = yaml.safe_load(REPORTS_YAML.read_text(encoding="utf-8"))
    if key not in reports:
        raise IngestError(f"Report {key!r} is not in {REPORTS_YAML.relative_to(REPO)}")
    return reports[key]


def slug_from_url(url: str) -> str:
    return url.strip("/").split("/")[-1]


def head_metadata(soup: BeautifulSoup) -> dict:
    """Metadata from <head>. The generator uses Dublin Core, so nothing is guessed from prose."""
    meta = {}
    if soup.title and soup.title.string:
        meta["title"] = soup.title.string.strip()
    for name, key in [
        ("description", "description"),
        ("dcterms.modified", "modified"),
        ("dcterms.language", "language"),
        ("dcterms.license", "license_url"),
    ]:
        tag = soup.find("meta", attrs={"name": name})
        if tag and tag.get("content"):
            meta[key] = tag["content"].strip()
    for rel, key in [("canonical", "canonical"), ("cite-as", "citation_url")]:
        tag = soup.find("link", attrs={"rel": rel})
        if tag and tag.get("href"):
            meta[key] = tag["href"].strip()
    jsonld = soup.find("link", attrs={"type": "application/ld+json"})
    if jsonld and jsonld.get("href"):
        meta["jsonld"] = jsonld["href"].strip()
    return meta


def sanitize(main, link_map: dict[str, str], source_dir: Path, asset_prefix: str,
             assets: set, stats: dict) -> None:
    """Walks the tree and removes everything outside the allowlist. Modifies `main` in place.

    Relative links that don't point at another section are the report's attachments
    (CSV with the source data, JSON-LD, CITATION.cff). The portal copies those to
    itself — otherwise it would link to a foreign domain, or lead nowhere after ingest.
    """
    for node in main.find_all(string=lambda t: isinstance(t, Comment)):
        node.extract()

    for tag in main.find_all(list(DROP_WITH_CONTENT)):
        stats.setdefault("dropped_tags", []).append(tag.name)
        tag.decompose()

    for tag in main.find_all(True):
        if tag.name not in ALLOWED_TAGS:
            # An unknown wrapper: drop the tag, keep the content.
            stats.setdefault("unwrapped_tags", []).append(tag.name)
            tag.unwrap()
            continue

        for attr in list(tag.attrs):
            if attr not in ALLOWED_ATTRS:
                stats.setdefault("dropped_attrs", []).append(f"{tag.name}[{attr}]")
                del tag[attr]

        for attr in ("href", "src"):
            if attr in tag.attrs:
                value = str(tag[attr]).strip()
                base, _, anchor = value.partition("#")
                anchor = "#" + anchor if anchor else ""
                mapped = link_map.get(base)
                if mapped:
                    tag[attr] = mapped + anchor
                elif base and (source_dir / base).is_file():
                    assets.add(base)
                    tag[attr] = f"{asset_prefix}/{base}{anchor}"
                elif not SAFE_URL.match(value):
                    stats.setdefault("dropped_urls", []).append(value[:60])
                    del tag[attr]

        # Open outbound links safely
        if tag.name == "a" and str(tag.get("href", "")).startswith("http"):
            tag["rel"] = "noopener"
            tag["target"] = "_blank"


def js_array(script_text: str, name: str) -> list | None:
    """Extracts `const <name> = [ … ];` from an inline script and parses it as JSON.

    The generator writes the data as a JS object literal (unquoted keys), so before
    json.loads the keys have to be quoted and trailing commas dropped.
    """
    start = re.search(r"(?:const|let|var)\s+" + re.escape(name) + r"\s*=\s*\[", script_text)
    if not start:
        return None
    i = start.end() - 1
    depth, end = 0, None
    in_str, quote, escaped = False, "", False
    for j in range(i, len(script_text)):
        ch = script_text[j]
        if in_str:
            if escaped:
                escaped = False
            elif ch == "\\":
                escaped = True
            elif ch == quote:
                in_str = False
            continue
        if ch in "\"'":
            in_str, quote = True, ch
        elif ch == "[":
            depth += 1
        elif ch == "]":
            depth -= 1
            if depth == 0:
                end = j + 1
                break
    if end is None:
        return None

    raw = script_text[i:end]
    # Whole-line comments only — a `//` inside a string is part of a URL
    # (`"https://insp.cd/…"`), not a comment.
    raw = re.sub(r"^\s*//[^\n]*$", "", raw, flags=re.M)
    raw = re.sub(r"([{,]\s*)([A-Za-z_][A-Za-z0-9_]*)\s*:", r'\1"\2":', raw)
    raw = re.sub(r",(\s*[}\]])", r"\1", raw)
    try:
        # strict=False: the generator leaves literal newlines in the notes, which
        # json.loads would otherwise reject as a control character in a string.
        return json.loads(raw, strict=False)
    except json.JSONDecodeError as exc:
        raise IngestError(f"Could not parse the data {name!r}: {exc}") from exc


def chart_from_report_data(rows: list) -> dict:
    """`reportData` (daily SitReps) -> cumulative cases and deaths."""
    return {
        "labels": [r["date"] for r in rows],
        "datasets": [
            {"label": "Potvrzené případy (kumulativní)", "data": [r.get("cases") for r in rows]},
            {"label": "Potvrzená úmrtí (kumulativní)", "data": [r.get("deaths") for r in rows]},
        ],
    }


def chart_from_trajectories(series: list) -> dict:
    """`trajectorySeries` -> a comparison of early trajectories by day since onset."""
    days = sorted({p["day"] for s in series for p in s.get("points", [])})
    index = {d: i for i, d in enumerate(days)}
    datasets = []
    for s in series:
        data = [None] * len(days)
        for p in s.get("points", []):
            data[index[p["day"]]] = p.get("cases")
        datasets.append({"label": s.get("name", "?"), "data": data})
    return {"labels": [f"den {d}" for d in days], "datasets": datasets}


def chart_daily_cases(rows: list) -> dict:
    """`reportData` -> newly reported confirmed cases per day."""
    return {
        "labels": [r["date"] for r in rows],
        "datasets": [
            {"label": "Nově hlášené případy (den)", "data": [r.get("newCases") for r in rows],
             "type": "bar"},
        ],
    }


def chart_cumulative_deaths(rows: list) -> dict:
    """`reportData` -> cumulative deaths among confirmed cases."""
    return {
        "labels": [r["date"] for r in rows],
        "datasets": [
            {"label": "Úmrtí mezi potvrzenými případy (kumulativní)",
             "data": [r.get("deaths") for r in rows]},
        ],
    }


class Chart:
    """The rule for one chart extracted from the delivered HTML.

    `panel` is the CSS class of the block the generator draws itself and which is
    replaced by our component. When it is `None`, the data is merely stored into
    `/data/charts/` and nothing on the page changes — useful for series we want in
    the data layer (and in Postgres) even though the report never renders them.
    """

    def __init__(self, var, key, convert, title, panel=None, index=0, kind="line", height=380):
        self.var, self.key, self.convert, self.title = var, key, convert, title
        self.panel, self.index, self.kind, self.height = panel, index, kind, height


# Careful: `graf-vyvoj.html` has TWO panels with the same `chart-panel` class
# (daily reports and cumulative deaths) — hence `index`, not just `find()`.
CHART_SOURCES = {
    "graf-vyvoj.html": [
        Chart("reportData", "ebola_daily", chart_daily_cases,
              "Denně nově hlášené potvrzené případy (DRK)",
              panel="chart-panel", index=0, kind="bar", height=340),
        Chart("reportData", "ebola_deaths_cumulative", chart_cumulative_deaths,
              "Kumulativní úmrtí mezi potvrzenými případy (DRK)",
              panel="chart-panel", index=1, height=340),
        # The portal's canonical series — it already exists in `/data/charts/` and is
        # loaded in Postgres; the ingest merely keeps it fresh. The report never renders it.
        Chart("reportData", "ebola_timeseries", chart_from_report_data,
              "Kumulativní případy a úmrtí (DRK)"),
    ],
    "predchozi-epidemie.html": [
        Chart("trajectorySeries", "ebola_trajectories", chart_from_trajectories,
              "Srovnání raných trajektorií ebolových ohnisek",
              panel="trajectory-panel", height=420),
    ],
}


def replace_charts(soup, main, source_name: str, write: bool, stats: dict) -> None:
    """Data from inline JS -> chart JSON; the generator's panel -> our component."""
    specs = CHART_SOURCES.get(source_name, [])
    if not specs:
        return
    script_text = "\n".join(s.get_text() for s in soup.find_all("script"))

    # The panels are collected up front: replacing them changes the tree, so searching
    # by posouvalo indexy pod rukama.
    panels: dict[str, list] = {}
    for spec in specs:
        if spec.panel and spec.panel not in panels:
            panels[spec.panel] = main.find_all(class_=spec.panel)

    for spec in specs:
        rows = js_array(script_text, spec.var)
        if not rows:
            stats.setdefault("charts_missing", []).append(spec.var)
            continue

        payload = spec.convert(rows)
        if write:
            CHARTS_DIR.mkdir(parents=True, exist_ok=True)
            (CHARTS_DIR / f"{spec.key}.json").write_text(
                json.dumps(payload, ensure_ascii=False), encoding="utf-8"
            )
        stats.setdefault("charts", []).append(f"{spec.key}.json ({len(payload['labels'])} points)")

        if not spec.panel:
            continue
        found = panels.get(spec.panel, [])
        if len(found) <= spec.index:
            stats.setdefault("charts_no_panel", []).append(f"{spec.panel}[{spec.index}]")
            continue

        placeholder = BeautifulSoup(
            f'<figure class="pp-card" data-pp-chart data-src="/data/charts/{spec.key}.json" '
            f'data-type="{spec.kind}">'
            f'<figcaption class="pp-card__head"><h2 class="pp-card__title">{spec.title}</h2></figcaption>'
            f'<div class="pp-card__plot" style="height:{spec.height}px">'
            f'<div class="pp-skeleton"></div><canvas></canvas></div>'
            f'<div class="pp-card__foot"><span class="pp-origin" data-pp-origin></span>'
            f'<button type="button" class="pp-btn" data-pp-table-toggle aria-expanded="false">'
            f"Tabulka</button></div>"
            f'<div class="pp-table-wrap" data-open="false"></div></figure>',
            "html.parser",
        )
        found[spec.index].replace_with(placeholder)


def front_matter(section: dict, defaults: dict, meta: dict, report_key: str) -> str:
    fm = {
        "title": meta.get("title") or section["name"],
        "description": meta.get("description", ""),
        **{k: v for k, v in defaults.items()},
        # Ties the page to the report — the layout renders the section navigation from it.
        "report": report_key,
        "generated": True,
    }
    if section.get("highlight"):
        fm["highlight"] = True
    if not section.get("listed"):
        fm["build"] = {"list": "never", "render": "always"}
    if meta.get("modified"):
        fm["report_verified"] = meta["modified"]
        fm["update_freq"] = f"{defaults.get('update_freq', '')} · ověřeno {meta['modified']}".strip(" ·")
    for src, dst in [("canonical", "report_canonical"), ("citation_url", "report_citation_url"),
                     ("license_url", "report_license_url"), ("jsonld", "report_jsonld")]:
        if meta.get(src):
            fm[dst] = meta[src]

    body = yaml.safe_dump(fm, allow_unicode=True, sort_keys=False, width=10000).rstrip()
    return f"---\n# GENERATED: tools/ingest_report.py — manual edits are overwritten by the next run.\n{body}\n---\n"


def ingest(report_key: str, source_dir: Path, write: bool) -> int:
    report = load_report(report_key)
    sections = report["sections"]
    defaults = report.get("defaults", {})

    link_map = {s["source"]: s["url"] for s in sections}
    asset_prefix = f"/reports/{report_key}"
    assets_root = FRONTEND / "static" / "reports" / report_key
    assets: set[str] = set()
    used_classes: set[str] = set()
    stats: dict = {}
    written = []

    for section in sections:
        src = source_dir / section["source"]
        if not src.exists():
            raise IngestError(f"Missing source file {src}")

        soup = BeautifulSoup(src.read_text(encoding="utf-8"), "html.parser")
        meta = head_metadata(soup)
        main = soup.find("main")
        if main is None:
            raise IngestError(f"{src.name}: the document has no <main>")

        # The order matters: trim the foreign content first, only then insert our
        # chart component — otherwise sanitization would eat it too
        # (`data-pp-chart` and `<canvas>` are deliberately not in the allowlist).
        sanitize(main, link_map, source_dir, asset_prefix, assets, stats)
        replace_charts(soup, main, section["source"], write, stats)

        html = "".join(str(c) for c in main.contents).strip()
        for value in re.findall(r'class="([^"]+)"', html):
            used_classes.update(value.split())
        out = CONTENT_DIR / f"{slug_from_url(section['url'])}.html"
        text = front_matter(section, defaults, meta, report_key) + "\n" + html + "\n"
        if write:
            out.write_text(text, encoding="utf-8")
        written.append(f"{section['source']:24} -> {out.relative_to(FRONTEND)} ({len(html)} B)")

    for rel in sorted(assets):
        target = assets_root / rel
        if write:
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(source_dir / rel, target)
        stats.setdefault("assets", []).append(f"{asset_prefix}/{rel}")

    print(("Written:" if write else "Dry run (nothing was written):"))
    for line in written:
        print("  " + line)

    for key, label in [
        ("charts", "Grafy z inline JS"),
        ("assets", "Attachments taken over"),
        ("dropped_tags", "Tags dropped with their content"),
        ("unwrapped_tags", "Unknown tags unwrapped"),
        ("dropped_attrs", "Attributes dropped"),
        ("dropped_urls", "Unsafe URLs dropped"),
        ("charts_missing", "⚠️ Chart data not found"),
        ("charts_no_panel", "⚠️ Chart panel not found"),
    ]:
        values = stats.get(key)
        if values:
            uniq = sorted(set(values))
            counts = ", ".join(f"{v}×{values.count(v)}" if values.count(v) > 1 else v for v in uniq)
            print(f"\n{label}: {counts}")

    unknown = unknown_classes(used_classes)
    if unknown:
        print(
            "\n⚠️ Classes reports.css does not know — the section will render unstyled:\n   "
            + ", ".join(sorted(unknown))
        )
        return 1
    return 0


def unknown_classes(used: set[str]) -> set[str]:
    """Classes in the **resulting** HTML that no portal stylesheet covers.

    The output is checked, not the input: chart panels are replaced along the way by
    our component, so their classes never reach the portal and reporting them as
    unknown would be a false alarm.
    """
    known: set[str] = set()
    for name in ("reports.css", "dashboards.css"):
        path = FRONTEND / "static" / "css" / name
        if path.exists():
            known |= set(re.findall(r"\.([a-zA-Z][\w-]*)", path.read_text(encoding="utf-8")))
    return used - known


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("report", help="the report key in frontend/data/reports.yaml")
    parser.add_argument("--source", type=Path, help="the folder with the delivered HTML")
    parser.add_argument("--check", action="store_true", help="verify only, write nothing")
    args = parser.parse_args()

    try:
        report = load_report(args.report)
        source_dir = args.source or (REPO / report.get("source_dir", ""))
        if not source_dir.is_dir():
            raise IngestError(f"The input folder does not exist: {source_dir}")
        return ingest(args.report, source_dir, write=not args.check)
    except IngestError as exc:
        print(f"CHYBA: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
