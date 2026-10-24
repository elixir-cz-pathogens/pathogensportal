"""Turning what a provider sent into a list of CSV files (TODO D15).

One upload may be several CSV files, sent as several `file` fields, as a ZIP,
or as a TAR (plain, .gz, .bz2, .xz). Whatever the wrapping, the rest of the
intake sees a flat list of `Part`s and checks each one like a single CSV.

Nothing is ever extracted to disk here. Archive members are read into memory
under hard limits and only their CONTENT leaves this module — the name inside
the archive is a label for the report, never a path. That one rule removes the
whole class of archive attacks that work through extraction: `../` members,
absolute paths, symlinks pointing out of the target, device files.

What is left are resource attacks, closed by the limits below:
  - a member declaring a huge size (a "zip bomb") is refused from its header,
    before decompressing it, and the read is capped anyway because a header can lie;
  - the total of all members is capped, so many medium files cannot add up;
  - the member count is capped, so a million empty entries cannot either.

An archive holding anything other than CSV is refused as a whole rather than
partly accepted: a provider who zipped the wrong folder should hear about it,
not find out later that half of it was silently dropped. The only things
skipped quietly are the ones nobody puts in on purpose — directories, macOS
`__MACOSX/` and `._*` resource forks, and other dot-files.
"""

from __future__ import annotations

import io
import posixpath
import re
import tarfile
import zipfile
import zlib
from dataclasses import dataclass

from .validate import MAX_BYTES

# One request, as received (an archive is counted compressed here).
MAX_REQUEST_BYTES = 20 * 1024 * 1024
# All CSV files of one upload together, after decompression.
MAX_TOTAL_BYTES = 50 * 1024 * 1024
MAX_PARTS = 50


@dataclass(frozen=True)
class Part:
    name: str  # as the provider knows it: "export.csv" or "data/2026/kraje.csv" inside an archive
    data: bytes


class BundleError(ValueError):
    """The upload as a whole cannot be read. The message is shown to the provider."""


def _mb(n: int) -> int:
    return n // (1024 * 1024)


def _skipped(name: str) -> bool:
    base = posixpath.basename(name.rstrip("/"))
    return name.startswith("__MACOSX/") or base.startswith(".") or not base


def _kind(raw: bytes) -> str:
    if raw[:4] in (b"PK\x03\x04", b"PK\x05\x06"):
        return "zip"
    if raw[:2] == b"\x1f\x8b" or raw[:3] == b"BZh" or raw[:6] == b"\xfd7zXZ\x00" or raw[257:262] == b"ustar":
        return "tar"
    return "csv"


class _Budget:
    def __init__(self) -> None:
        self.total = 0
        self.parts: list[Part] = []

    def check_count(self) -> None:
        if len(self.parts) >= MAX_PARTS:
            raise BundleError(f"Nahrání obsahuje víc než {MAX_PARTS} souborů CSV. Rozdělte ho prosím.")

    def check_size(self, name: str, size: int) -> None:
        if size > MAX_BYTES:
            raise BundleError(f"Soubor „{name}“ je větší než {_mb(MAX_BYTES)} MB.")
        if self.total + size > MAX_TOTAL_BYTES:
            raise BundleError(f"Soubory CSV mají dohromady víc než {_mb(MAX_TOTAL_BYTES)} MB. Rozdělte prosím nahrání.")

    def add(self, name: str, data: bytes) -> None:
        # The declared size was checked already; this catches a header that lied.
        self.check_size(name, len(data))
        self.total += len(data)
        self.parts.append(Part(name, data))


def _member(name: str, archive: str) -> None:
    if not name.lower().endswith(".csv"):
        raise BundleError(
            f"Archiv „{archive}“ obsahuje soubor „{name}“, který není CSV. "
            "Archiv smí obsahovat jen soubory CSV."
        )


def _from_zip(archive: str, raw: bytes, budget: _Budget) -> None:
    with zipfile.ZipFile(io.BytesIO(raw)) as zf:
        for info in zf.infolist():
            if info.is_dir() or _skipped(info.filename):
                continue
            _member(info.filename, archive)
            if info.flag_bits & 0x1:
                raise BundleError(f"Archiv „{archive}“ je zaheslovaný. Pošlete ho prosím bez hesla.")
            budget.check_count()
            budget.check_size(info.filename, info.file_size)
            with zf.open(info) as fh:
                budget.add(info.filename, fh.read(MAX_BYTES + 1))


def _from_tar(archive: str, raw: bytes, budget: _Budget) -> None:
    with tarfile.open(fileobj=io.BytesIO(raw), mode="r:*") as tf:
        seen = 0
        for m in tf:
            seen += 1
            if seen > MAX_PARTS * 4:
                raise BundleError(f"Archiv „{archive}“ má příliš mnoho položek.")
            if m.isdir() or _skipped(m.name):
                continue
            if not m.isreg():
                raise BundleError(f"Archiv „{archive}“ obsahuje „{m.name}“, který není obyčejný soubor (odkaz nebo zařízení).")
            _member(m.name, archive)
            budget.check_count()
            budget.check_size(m.name, m.size)
            fh = tf.extractfile(m)
            budget.add(m.name, fh.read(MAX_BYTES + 1) if fh else b"")


def unpack(files: list[tuple[str, bytes]]) -> list[Part]:
    """(filename, bytes) as received -> the CSV files inside. Raises BundleError."""
    if sum(len(raw) for _, raw in files) > MAX_REQUEST_BYTES:
        raise BundleError(f"Nahrání je větší než {_mb(MAX_REQUEST_BYTES)} MB.")
    budget = _Budget()
    for filename, raw in files:
        name = filename or "soubor.csv"
        kind = _kind(raw)
        try:
            if kind == "zip":
                _from_zip(name, raw, budget)
            elif kind == "tar":
                _from_tar(name, raw, budget)
            else:
                budget.check_count()
                # A plain CSV goes on as it is; validate_csv reports its own size.
                budget.total += len(raw)
                budget.parts.append(Part(name, raw))
        except BundleError:
            raise
        except (zipfile.BadZipFile, zipfile.LargeZipFile, tarfile.TarError, EOFError, zlib.error,
                OSError, NotImplementedError, ValueError):
            raise BundleError(f"Archiv „{name}“ se nepodařilo otevřít. Je poškozený nebo v nepodporovaném formátu.")
    if not budget.parts:
        raise BundleError("V nahraných souborech není žádné CSV.")
    return budget.parts


_UNSAFE = re.compile(r"[^A-Za-z0-9._-]+")


def safe_names(parts: list[Part]) -> list[str]:
    """File names to store the parts under: ASCII, no directories, unique, `.csv`.
    `data/Kraje 2026.csv` -> `Kraje_2026.csv`; a second `kraje.csv` -> `kraje-2.csv`."""
    out: list[str] = []
    used: set[str] = set()
    for p in parts:
        base = posixpath.basename(p.name.replace("\\", "/"))
        stem = _UNSAFE.sub("_", base.rsplit(".", 1)[0]).strip("._-")[:80] or "data"
        name, n = f"{stem}.csv", 1
        while name.lower() in used:
            n += 1
            name = f"{stem}-{n}.csv"
        used.add(name.lower())
        out.append(name)
    return out
