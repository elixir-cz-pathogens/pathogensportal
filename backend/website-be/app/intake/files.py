"""Uploaded files on disk (TODO D15).

Two trees, for two readers.

1. The RECORD — INTAKE_DIR, everything that arrived, accepted or not:

    <INTAKE_DIR>/<provider_id>/<upload_id>/
        original/<n>-<name>   exactly the bytes received, one per `file` field (a ZIP stays a ZIP)
        report.json           what the validator said, the same JSON the provider got back

   The original is kept even for a rejected upload: when a provider asks "why
   was it refused?", the reviewer needs the file, not a recollection of it.

2. The HAND-OVER — INTAKE_EXPORT_DIR, accepted uploads only, for the data
   pipeline (pathogensportal-db) to process:

    <INTAKE_EXPORT_DIR>/<provider slug>/<YYYY-MM-DD>/<upload_id>/
        <name>.csv            one per CSV of the upload, normalised: template columns
                              only, UTF-8, comma-separated, numbers with a dot
        manifest.json         who, when, under which declaration, which files

   The date is the UTC day of receipt. The upload id level exists because one
   provider can send several uploads a day. The directory appears ATOMICALLY: it
   is written under a dot-name and renamed when complete, so a pipeline that
   lists the tree never reads half an upload. Readers should skip dot-entries.

   The provider is identified by its slug, never by its key: the key is a secret
   and a path is not — directory names end up in listings, logs and backups.

Paths are built only from UUIDs, the slug (validated in cli.py) and names
passed through bundle.safe_names, never from raw uploaded names, so a name like
`../../etc/passwd.csv` cannot place a file anywhere.
"""

from __future__ import annotations

import json
import os
from datetime import datetime
from pathlib import Path

from .bundle import safe_names, Part


def write_record(root: Path, provider_id: str, upload_id: str,
                 received: list[tuple[str, bytes]], report: dict) -> Path:
    target = root / provider_id / upload_id
    (target / "original").mkdir(parents=True, exist_ok=False)
    names = safe_names([Part(name, b"") for name, _ in received])
    for i, ((filename, raw), name) in enumerate(zip(received, names), start=1):
        # Keep the real extension of an archive; safe_names forces .csv.
        (target / "original" / f"{i}-{name[:-4]}{_ext(filename)}").write_bytes(raw)
    (target / "report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    return target


def _ext(filename: str) -> str:
    lower = (filename or "").lower()
    for e in (".tar.gz", ".tar.bz2", ".tar.xz", ".tgz", ".zip", ".tar", ".csv"):
        if lower.endswith(e):
            return e
    return ".bin"


def write_export(root: Path, slug: str, upload_id: str, received_at: datetime,
                 csvs: list[tuple[str, str]], manifest: dict) -> Path:
    """csvs: (safe file name, normalised CSV text). Returns the final directory."""
    day = root / slug / received_at.strftime("%Y-%m-%d")
    day.mkdir(parents=True, exist_ok=True)
    tmp = day / f".{upload_id}.tmp"
    tmp.mkdir()
    for name, text in csvs:
        (tmp / name).write_text(text, encoding="utf-8")
    (tmp / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    final = day / upload_id
    os.rename(tmp, final)
    return final
