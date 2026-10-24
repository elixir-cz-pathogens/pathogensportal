#!/usr/bin/env python3
"""Check the external links of the linked-out dashboards (TODO I24).

Dashboards with `redirect_url` in their front matter (Nextstrain, SZÚ
wastewater, …) send readers to someone else's site. When that site renames a
page, the portal keeps showing a dead link and nothing reports it. This script
collects every http(s) URL in those pages — the redirect target and the links
in the text — and checks that each still answers.

    python tools/check_external_links.py            # human-readable
    python tools/check_external_links.py --markdown # report for a GitHub issue

Exit 1 when a link is broken. "Broken" is 404/410, a 5xx, or no answer at all.
401/403/429 are reported as WARNINGS, not failures: several of these sites
answer bots that way while serving people fine, and a check that cries wolf
every week gets ignored — the lesson of the backup timer.

Standard library only, so the workflow needs no install step.
"""

from __future__ import annotations

import argparse
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path

CONTENT = Path(__file__).resolve().parents[1] / "frontend" / "content"
URL = re.compile(r"https?://[^\s)\"'<>\]]+")
UA = "Mozilla/5.0 (compatible; PathogenPortalCZ-linkcheck/1.0; +https://pathogens.vm.cesnet.cz/)"
SOFT = {401, 403, 429}


def linked_out_pages() -> list[Path]:
    return sorted(p for p in CONTENT.glob("*/dashboards/*.md")
                  if re.search(r"^redirect_url:", p.read_text(encoding="utf-8"), re.M))


def collect() -> dict[str, list[str]]:
    """URL -> pages that use it."""
    found: dict[str, list[str]] = {}
    for page in linked_out_pages():
        rel = str(page.relative_to(CONTENT))
        for url in URL.findall(page.read_text(encoding="utf-8")):
            found.setdefault(url.rstrip(".,;"), []).append(rel)
    return found


def status(url: str) -> int | str:
    """HTTP status after redirects, or the error text when nothing answered.
    HEAD first; some servers refuse HEAD (405/501), so GET is the fallback."""
    for method in ("HEAD", "GET"):
        req = urllib.request.Request(url, method=method, headers={"User-Agent": UA})
        try:
            with urllib.request.urlopen(req, timeout=20) as r:
                return r.status
        except urllib.error.HTTPError as e:
            if method == "HEAD" and e.code in (403, 405, 501):
                continue
            return e.code
        except (urllib.error.URLError, TimeoutError, OSError) as e:
            return f"{type(e).__name__}: {getattr(e, 'reason', e)}"
    return "no answer"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--markdown", action="store_true")
    args = ap.parse_args()

    links = collect()
    broken, warn = [], []
    for url, pages in sorted(links.items()):
        st = status(url)
        if isinstance(st, int) and st < 400:
            continue
        (warn if st in SOFT else broken).append((url, st, sorted(set(pages))))

    if args.markdown:
        print(f"Checked {len(links)} external links on {len(linked_out_pages())} linked-out dashboard pages.\n")
        for title, rows in (("Broken", broken), ("Refused the checker (probably fine, check by hand)", warn)):
            if rows:
                print(f"### {title}\n")
                for url, st, pages in rows:
                    print(f"- `{st}` {url} — in {', '.join(f'`{p}`' for p in pages)}")
                print()
    else:
        print(f"{len(links)} links checked")
        for url, st, pages in broken:
            print(f"BROKEN  {st}  {url}  ({', '.join(pages)})")
        for url, st, pages in warn:
            print(f"warning {st}  {url}  ({', '.join(pages)})")
    return 1 if broken else 0


if __name__ == "__main__":
    sys.exit(main())
