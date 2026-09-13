#!/usr/bin/env python3
"""Fail if this tree would publish older content than origin/main already serves.

Run from the repository root, with origin/main fetched:

    git fetch origin main && python3 .github/scripts/check_no_content_regression.py

Called by .github/workflows/check-no-content-regression.yaml, which carries the
reasoning for why this check exists at all. This file carries the reasoning for
how it decides.

It lives in a file rather than inline in the workflow for one reason: a check has
to be provable. Point it at any two commits locally and watch it go red on a real
regression and green on a real release — a rule that has only ever been asserted
in YAML has never been shown to be able to fail.

WHAT IS COMPARED
----------------
Only facts that move in one direction, so an ordinary change cannot trip it:

  * the generator's version stamp on the Ebola pages   v84 -> v83  is a regression
  * `posledni_datum` in a chart file                   how far data reaches
  * `generated_at` in a chart file                     when the pipeline ran

Series length is REPORTED, never enforced: `flu_weekly` holds one season and
resets to a single point every autumn, so "never shorter" would fail every
October on a correct file.
"""

from __future__ import annotations

import glob
import json
import re
import subprocess
import sys

CHARTS = "frontend/static/data/charts"
EBOLA = "frontend/content/*/dashboards/ebola-*.html"
BASE = "origin/main"

# `update_freq: Průběžně (aktivní ohnisko) · v84 · 2026-09-09`
VERSION = re.compile(r"^update_freq:.*?·\s*v(\d+)\s*·", re.MULTILINE)


def at_base(path: str) -> str | None:
    """File contents at origin/main, or None if it does not exist there."""
    r = subprocess.run(
        ["git", "show", f"{BASE}:{path}"],
        capture_output=True, text=True,
    )
    return r.stdout if r.returncode == 0 else None


def read(path: str) -> str:
    with open(path, encoding="utf-8") as fh:
        return fh.read()


def main() -> int:
    # Without a base every file looks new, every comparison is skipped, and the
    # vacuity guard at the end would report a confusing failure. Say the real
    # reason instead.
    if subprocess.run(
        ["git", "rev-parse", "--verify", "--quiet", BASE],
        capture_output=True,
    ).returncode != 0:
        print(f"🚨 {BASE} does not resolve here. Fetch it first:")
        print(f"     git fetch --no-tags origin +refs/heads/main:refs/remotes/{BASE}")
        return 1

    regressions: list[str] = []
    notes: list[str] = []
    compared = 0

    # ── the Ebola pages carry the generator's own version ────────────────────
    for path in sorted(glob.glob(EBOLA)):
        base = at_base(path)
        if base is None:
            notes.append(f"new file, nothing to compare: {path}")
            continue
        m_now, m_base = VERSION.search(read(path)), VERSION.search(base)
        if not (m_now and m_base):
            # Only a note: a page may legitimately not carry a stamp, and a
            # missing stamp is not evidence of going backwards.
            if m_base and not m_now:
                notes.append(f"version stamp disappeared: {path}")
            continue
        now, was = int(m_now.group(1)), int(m_base.group(1))
        compared += 1
        if now < was:
            regressions.append(f"{path}: Ebola v{was} on main -> v{now} here")

    # ── chart files carry dates ──────────────────────────────────────────────
    files = sorted(glob.glob(f"{CHARTS}/*.json"))
    if not files:
        print(f"🚨 No chart files under {CHARTS} — refusing to pass over nothing.")
        return 1

    for path in files:
        base_raw = at_base(path)
        if base_raw is None:
            notes.append(f"new file, nothing to compare: {path}")
            continue
        try:
            now, was = json.loads(read(path)), json.loads(base_raw)
        except json.JSONDecodeError as exc:
            print(f"🚨 {path} is not valid JSON on one side: {exc}")
            return 1
        if not (isinstance(now, dict) and isinstance(was, dict)):
            continue

        for field in ("posledni_datum", "generated_at"):
            a, b = now.get(field), was.get(field)
            if not (a and b):
                continue
            compared += 1
            # ISO 8601 in both fields, so string order is chronological order.
            if str(a) < str(b):
                regressions.append(f"{path}: {field} {b} on main -> {a} here")

        la, lb = now.get("labels"), was.get("labels")
        if isinstance(la, list) and isinstance(lb, list) and len(la) < len(lb):
            notes.append(
                f"series is shorter: {path} ({len(lb)} -> {len(la)} points) "
                f"— expected at a season rollover, suspicious otherwise"
            )

    # ── a check that compared nothing has not checked anything ───────────────
    if compared == 0:
        print("🚨 Nothing comparable was found — no version stamps and no dated")
        print("   chart fields on either side. Refusing to report success; the")
        print("   paths in this script have probably moved.")
        return 1

    print(f"ℹ️  Compared {compared} monotonic value(s) against {BASE}.")
    for n in notes:
        print(f"ℹ️  {n}")

    if not regressions:
        print("")
        print("✅ Nothing goes backwards. Every dated value is at or ahead of main.")
        return 0

    print("")
    print("🚨 This PR would publish OLDER content than production already serves:")
    print("")
    for r in regressions:
        print(f"     {r}")
    print("")
    print("   What this usually means")
    print("   -----------------------")
    print("   Content went into `main` directly — an Ebola delivery, a hotfix —")
    print("   and this branch was never realigned, so merging it reverts that work.")
    print("")
    print("   How to fix it")
    print("   -------------")
    print("     git fetch origin")
    print("     git merge origin/main          # on this branch")
    print("     # resolve every conflict toward the NEWER side, then push")
    print("")
    print("   If the rollback is intended — bad data being withdrawn — this check")
    print("   cannot tell the difference and will keep failing. `enforce_admins` is")
    print("   off on this repo, so an admin can merge past it deliberately. Say so")
    print("   in the PR, so the next person does not read the red mark as a bug.")
    return 1


if __name__ == "__main__":
    sys.exit(main())
