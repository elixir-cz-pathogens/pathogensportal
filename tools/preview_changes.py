#!/usr/bin/env python3
"""Show the content reviewer what a content PR changes (preview-content.yml).

The reviewer used to get one link to the whole preview and had to read every
page again to find what was new. This script compares two builds of the site:

    BASE  `main`, i.e. what production serves now
    HEAD  the PR

Both must be built with the same --baseURL, so that only the content differs.

For every page whose visible text inside #content changed, it writes
`zmeny.html` next to the page's `index.html` in HEAD: the same page, with
additions and deletions marked and a bar to jump from one change to the next.
For chart data (`data/charts/*.json`) it lists new points, revised values and
removed points — a revised past value is easy to miss in prose and matters
most. It prints a Markdown summary for the PR comment.

    python tools/preview_changes.py BASE_PUBLIC HEAD_PUBLIC --url PREVIEW_URL > changes.md

Only text is compared: a changed link target or attribute is not marked.
Needs lxml (for lxml.html.diff); installed by the workflow, not by
tools/requirements.txt.
"""

from __future__ import annotations

import argparse
import copy
import difflib
import json
import re
import sys
from pathlib import Path
from urllib.parse import quote

import lxml.html
from lxml import etree
from lxml.html.diff import htmldiff

OUT_NAME = "zmeny.html"
MAX_LISTED = 6  # points listed per kind and dataset before "and N more"

STYLE = """
#content ins{background:#d4f5dc;color:#0a3d1a;text-decoration:none;border-bottom:2px solid #1f9d55;padding:0 .1em}
#content del{background:#fde0e0;color:#7a1414;text-decoration:line-through;padding:0 .1em}
#content ins.pp-current,#content del.pp-current{outline:3px solid #f59e0b;outline-offset:2px}
.pp-changes-bar{position:sticky;top:0;z-index:1030;background:#fff8e1;border:1px solid #f0d58a;
 border-radius:.4rem;padding:.5rem .8rem;margin:.5rem 0 1rem;display:flex;flex-wrap:wrap;gap:.4rem 1rem;
 align-items:center;font-size:.95rem}
.pp-changes-bar button{border:1px solid #c9a227;background:#fff;border-radius:.3rem;padding:.1rem .6rem}
"""

SCRIPT = """
(function(){
  var marks=[].slice.call(document.querySelectorAll('#content ins,#content del'))
    .filter(function(e){return e.textContent.trim()!=='' && !e.closest('.pp-changes-bar')});
  var i=-1, pos=document.getElementById('pp-change-pos');
  function go(d){
    if(!marks.length)return;
    if(i>=0)marks[i].classList.remove('pp-current');
    i=(i+d+marks.length)%marks.length;
    marks[i].classList.add('pp-current');
    marks[i].scrollIntoView({behavior:'smooth',block:'center'});
    pos.textContent=(i+1)+' / '+marks.length;
  }
  pos.textContent=marks.length?('0 / '+marks.length):'0';
  document.getElementById('pp-change-next').onclick=function(){go(1)};
  document.getElementById('pp-change-prev').onclick=function(){go(-1)};
  document.addEventListener('keydown',function(e){
    if(e.target.closest&&e.target.closest('input,textarea'))return;
    if(e.key==='n')go(1); if(e.key==='p')go(-1);
  });
})();
"""

TEXT = {
    "cs": {
        "bar": "Změny oproti produkci:",
        "added": "přidáno",
        "removed": "odebráno",
        "prev": "↑ Předchozí",
        "next": "Další změna ↓",
        "clean": "Čistá verze",
        "keys": "(klávesy n / p)",
    },
    "en": {
        "bar": "Changes against production:",
        "added": "added",
        "removed": "removed",
        "prev": "↑ Previous",
        "next": "Next change ↓",
        "clean": "Clean version",
        "keys": "(keys n / p)",
    },
}


# ── pages ──────────────────────────────────────────────────────────────────


def content_of(root: etree._Element) -> etree._Element | None:
    found = root.xpath('//*[@id="content"]')
    return found[0] if found else None


def visible_words(content: etree._Element) -> list[str]:
    c = copy.deepcopy(content)
    for el in c.xpath(".//script|.//style|.//noscript"):
        el.drop_tree()
    return c.text_content().split()


def inner_html(el: etree._Element) -> str:
    return (el.text or "") + "".join(
        etree.tostring(child, encoding="unicode", method="html") for child in el
    )


def count_changes(old: list[str], new: list[str]) -> int:
    ops = difflib.SequenceMatcher(None, old, new, autojunk=False).get_opcodes()
    return sum(1 for tag, *_ in ops if tag != "equal")


def marked_diff(old_html: str, new_html: str) -> str:
    out = htmldiff(old_html, new_html)
    # lxml emits <ins>new</ins> <del>old</del>; read naturally it is old → new.
    return re.sub(
        r"(<ins>(?:(?!</ins>).)*</ins>)(\s*)(<del>(?:(?!</del>).)*</del>)",
        r"\3\2\1",
        out,
        flags=re.S,
    )


def write_marked_page(head_root, base_content, head_content, target: Path) -> int:
    """Write the marked page; return how many marks it carries (what its bar counts)."""
    root = copy.deepcopy(head_root)
    content = content_of(root)
    lang = "en" if (root.get("lang") or "").startswith("en") else "cs"
    t = TEXT[lang]

    diffed = marked_diff(inner_html(base_content), inner_html(head_content))
    for child in list(content):
        content.remove(child)
    content.text = None
    bar = lxml.html.fragment_fromstring(
        f'<div class="pp-changes-bar" role="navigation">'
        f'<strong>{t["bar"]}</strong>'
        f'<span><ins>{t["added"]}</ins> · <del>{t["removed"]}</del></span>'
        f'<button type="button" id="pp-change-prev">{t["prev"]}</button>'
        f'<button type="button" id="pp-change-next">{t["next"]}</button>'
        f'<span id="pp-change-pos"></span><small>{t["keys"]}</small>'
        f'<a href="./">{t["clean"]}</a></div>'
    )
    content.append(bar)
    for part in lxml.html.fragments_fromstring(diffed):
        if isinstance(part, str):  # leading text before the first element
            bar.tail = (bar.tail or "") + part
        else:
            content.append(part)

    head = root.find("head")
    style = etree.SubElement(head, "style")
    style.text = STYLE
    # Keep crawlers off a page that exists only for review.
    etree.SubElement(head, "meta", name="robots", content="noindex")
    body = root.find("body")
    script = etree.SubElement(body, "script")
    script.text = SCRIPT

    target.write_text(
        "<!DOCTYPE html>\n" + etree.tostring(root, encoding="unicode", method="html"),
        encoding="utf-8",
    )
    return sum(
        1 for el in content.xpath(".//ins|.//del")
        if el.text_content().strip() and not el.xpath("ancestor::*[@class='pp-changes-bar']")
    )


def is_list_page(rel: Path, head_dir: Path) -> bool:
    """Home, section and taxonomy pages: they repeat other pages' summaries."""
    parts = rel.parent.parts
    if not parts or parts == ("en",):
        return True
    if "tags" in parts:
        return True
    page_dir = head_dir / rel.parent
    return any((d / "index.html").exists() for d in page_dir.iterdir() if d.is_dir())


def page_url(base_url: str, rel: Path) -> str:
    path = "/".join(quote(p) for p in rel.parent.parts)
    return base_url + (path + "/" if path else "")


def compare_pages(base_dir: Path, head_dir: Path, base_url: str):
    pages = []
    for head_file in sorted(head_dir.rglob("index.html")):
        rel = head_file.relative_to(head_dir)
        if rel.parts[0] in ("reports", "preview"):
            continue
        head_root = lxml.html.parse(str(head_file)).getroot()
        head_content = content_of(head_root)
        if head_content is None:
            continue
        base_file = base_dir / rel
        if base_file.exists():
            base_content = content_of(lxml.html.parse(str(base_file)).getroot())
        else:
            base_content = None
        new_words = visible_words(head_content)
        if base_content is None:
            old_words = []
            base_content = lxml.html.fragment_fromstring("<div></div>")
        else:
            old_words = visible_words(base_content)
        if old_words == new_words:
            continue
        marks = write_marked_page(head_root, base_content, head_content, head_file.parent / OUT_NAME)
        title = head_root.findtext(".//title") or str(rel.parent)
        url = page_url(base_url, rel)
        pages.append(
            {
                "title": " ".join(title.split()),
                "lang": "en" if (head_root.get("lang") or "").startswith("en") else "cs",
                "url": url,
                "marked": url + OUT_NAME,
                "changes": marks or count_changes(old_words, new_words),
                "new": not base_file.exists(),
                "list": is_list_page(rel, head_dir),
            }
        )
    return pages


# ── chart data ─────────────────────────────────────────────────────────────


def fmt(v) -> str:
    if isinstance(v, bool) or v is None:
        return str(v)
    if isinstance(v, int):
        return f"{v:,}".replace(",", " ")
    if isinstance(v, float):
        return f"{v:,}".replace(",", " ")
    return str(v)


def flatten(x, prefix=""):
    if isinstance(x, dict):
        for k, v in x.items():
            yield from flatten(v, f"{prefix}.{k}" if prefix else str(k))
    elif isinstance(x, list):
        for i, v in enumerate(x):
            yield from flatten(v, f"{prefix}[{i}]")
    else:
        yield prefix, x


def is_chartjs(x) -> bool:
    return isinstance(x, dict) and isinstance(x.get("labels"), list) and isinstance(x.get("datasets"), list)


def listed(items: list[str]) -> str:
    shown = ", ".join(items[:MAX_LISTED])
    more = len(items) - MAX_LISTED
    return shown + (f" a dalších {more}" if more > 0 else "")


def chart_changes(old, new) -> tuple[list[str], tuple]:
    """Human-readable lines, plus a signature that ignores labels and language."""
    lines, sig = [], []
    if is_chartjs(old) and is_chartjs(new):
        for i, ds in enumerate(new["datasets"]):
            ods = old["datasets"][i] if i < len(old["datasets"]) else {"data": []}
            o = dict(zip(old["labels"], ods.get("data", [])))
            n = dict(zip(new["labels"], ds.get("data", [])))
            added = [k for k in n if k not in o]
            removed = [k for k in o if k not in n]
            revised = [k for k in n if k in o and n[k] != o[k]]
            if not (added or removed or revised):
                continue
            parts = []
            if added:
                parts.append("nové: " + listed([f"{k}: **{fmt(n[k])}**" for k in added]))
            if revised:
                parts.append(
                    "⚠️ opravené starší hodnoty: "
                    + listed([f"{k}: {fmt(o[k])} → **{fmt(n[k])}**" for k in revised])
                )
            if removed:
                parts.append("odebrané: " + listed([f"{k}: {fmt(o[k])}" for k in removed]))
            label = ds.get("label") or f"řada {i + 1}"
            lines.append(f"„{label}“ — " + "; ".join(parts))
            sig.append((i, tuple(added), tuple(removed), tuple((k, o[k], n[k]) for k in revised)))
        old_rest = {k: v for k, v in old.items() if k not in ("labels", "datasets")}
        new_rest = {k: v for k, v in new.items() if k not in ("labels", "datasets")}
        old, new = old_rest, new_rest
    o, n = dict(flatten(old)), dict(flatten(new))
    for k in n:
        if k not in o:
            lines.append(f"`{k}`: nové **{fmt(n[k])}**")
            sig.append((k, None, n[k]))
        elif o[k] != n[k] and not (isinstance(n[k], str) and isinstance(o[k], str) and k.endswith("label")):
            lines.append(f"`{k}`: {fmt(o[k])} → **{fmt(n[k])}**")
            sig.append((k, o[k], n[k]))
    for k in o:
        if k not in n:
            lines.append(f"`{k}`: odebráno ({fmt(o[k])})")
            sig.append((k, o[k], None))
    return lines, tuple(sig)


def compare_charts(base_dir: Path, head_dir: Path):
    charts = []
    head_charts = head_dir / "data" / "charts"
    if not head_charts.is_dir():
        return charts
    seen = {}
    for f in sorted(head_charts.glob("*.json")):
        b = base_dir / "data" / "charts" / f.name
        new = json.loads(f.read_text(encoding="utf-8"))
        if b.exists():
            old = json.loads(b.read_text(encoding="utf-8"))
            if old == new:
                continue
            lines, sig = chart_changes(old, new)
        else:
            lines, sig = ["nový soubor"], ("new", f.name)
        if not lines:
            continue
        twin = f.name.replace("_en.json", ".json")
        if twin != f.name and seen.get(twin) == sig:
            charts.append({"file": f.name, "same_as": twin})
            continue
        seen[f.name] = sig
        charts.append({"file": f.name, "lines": lines})
    for f in sorted((base_dir / "data" / "charts").glob("*.json")):
        if not (head_charts / f.name).exists():
            charts.append({"file": f.name, "lines": ["soubor odebrán"]})
    return charts


# ── summary ────────────────────────────────────────────────────────────────


def summary(pages, charts) -> str:
    out = ["### 📝 Co se mění oproti produkci", ""]
    if not pages and not charts:
        out.append("Text stránek ani data grafů se oproti produkci nemění.")
        return "\n".join(out) + "\n"

    content = [p for p in pages if not p["list"]]
    lists = [p for p in pages if p["list"]]
    if content:
        out += [
            "Odkaz **zvýrazněno** otevře stránku s vyznačenými změnami "
            "(<ins>přidané</ins> zeleně, <del>odebrané</del> přeškrtnuté) a tlačítkem *Další změna*.",
            "",
            "| Stránka | Změny | |",
            "|---|---:|---|",
        ]
        for lang, heading in (("cs", None), ("en", "**English**")):
            group = [p for p in content if p["lang"] == lang]
            if not group:
                continue
            if heading:
                out.append(f"| {heading} | | |")
            for p in sorted(group, key=lambda p: -p["changes"]):
                badge = " 🆕" if p["new"] else ""
                out.append(
                    f"| [{p['title']}]({p['url']}){badge} | {p['changes']} | [zvýrazněno]({p['marked']}) |"
                )
        out.append("")
    if lists:
        out += [
            f"<details><summary>Přehledové stránky (shrnutí jiných stránek): {len(lists)}</summary>",
            "",
        ]
        out += [f"- [{p['title']}]({p['url']}) — {p['changes']} · [zvýrazněno]({p['marked']})" for p in lists]
        out += ["", "</details>", ""]
    if charts:
        out += ["**Data grafů**", ""]
        for c in charts:
            if "same_as" in c:
                out.append(f"- `{c['file']}` — stejné změny jako `{c['same_as']}`")
                continue
            out.append(f"- `{c['file']}`")
            out += [f"  - {line}" for line in c["lines"]]
        out.append("")
    return "\n".join(out) + "\n"


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("base", type=Path, help="public/ built from main")
    ap.add_argument("head", type=Path, help="public/ built from the PR (marked pages are written here)")
    ap.add_argument("--url", required=True, help="the preview's base URL, ending in /")
    args = ap.parse_args()
    url = args.url if args.url.endswith("/") else args.url + "/"
    pages = compare_pages(args.base, args.head, url)
    charts = compare_charts(args.base, args.head)
    sys.stdout.write(summary(pages, charts))
    return 0


if __name__ == "__main__":
    sys.exit(main())
