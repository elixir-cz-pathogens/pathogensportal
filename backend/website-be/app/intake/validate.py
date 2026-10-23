"""Checking an uploaded CSV against a template (TODO D15).

Pure functions, no I/O: bytes in, a `Report` out. Everything the provider is told
about their file comes from here, so the messages are Czech and name the row
and column — "fix line 14, column hodnota" is actionable, "invalid file" is not.

Errors reject the file. Warnings let it through to human review, which decides.
The split is deliberate: a hard rule the reviewer cannot overrule must be one
nobody would ever want to overrule (a broken header, a formula in a cell);
anything that is a judgement (small counts, a suspicious column name on an
otherwise fine file) is a warning, so a false positive costs a look, not a
rejected upload.

Browser checks in the form are a convenience. This is the check that counts.
"""

from __future__ import annotations

import csv
import io
import re
import unicodedata
from dataclasses import dataclass, field
from datetime import date

from .templates import TERRITORIES, Template

MAX_BYTES = 5 * 1024 * 1024
MAX_ROWS = 200_000
MAX_CELL = 500
# Counts below this in one cell can identify a person in a small region.
# A warning, not an error: the threshold itself is still to be decided (TODO R24).
SMALL_COUNT = 5
# Units under which `hodnota` is a count of people (empty = assumed a count).
COUNT_UNITS = frozenset({"", "pocet", "počet", "count", "n"})
# Stop listing problems after this many; a file with 10 000 bad rows needs one
# message about the pattern, not 10 000.
MAX_ISSUES = 50

# Header names that suggest personal data. Matched against the normalised header
# (lower case, no diacritics, `_` for separators), as a whole word.
_PERSONAL = re.compile(
    r"(^|_)(jmeno|prijmeni|name|surname|rodne_cislo|rc|birth|narozeni|datum_narozeni|"
    r"adresa|address|ulice|street|psc|zip|email|e_mail|telefon|phone|pacient|patient|"
    r"pojistenec|cislo_pojistence|insurance_id|ip_adresa)($|_)"
)
# A cell a spreadsheet would execute as a formula. A leading "-" is fine for a
# number ("-3.5"), so it only counts when what follows is not one.
_FORMULA = re.compile(r"^\s*([=+@\t\r]|-(?!\s*\d))")
_PERIOD = (
    (re.compile(r"^\d{4}$"), "year"),
    (re.compile(r"^\d{4}-(0[1-9]|1[0-2])$"), "month"),
    (re.compile(r"^\d{4}-W(0[1-9]|[1-4]\d|5[0-3])$"), "week"),
    (re.compile(r"^\d{4}-\d{2}-\d{2}$"), "day"),
)


@dataclass
class Issue:
    level: str  # "error" | "warning"
    message: str
    line: int | None = None
    column: str | None = None

    def as_dict(self) -> dict:
        return {k: v for k, v in self.__dict__.items() if v is not None}


@dataclass
class Report:
    template: str
    rows: int = 0
    columns: list[str] = field(default_factory=list)
    issues: list[Issue] = field(default_factory=list)
    truncated: bool = False
    # Normalised rows (template columns only, numbers with a dot), set only when
    # the file is accepted.
    normalized: list[dict[str, str]] = field(default_factory=list, repr=False)

    @property
    def ok(self) -> bool:
        return not any(i.level == "error" for i in self.issues)

    def add(self, level: str, message: str, line: int | None = None, column: str | None = None) -> None:
        if len(self.issues) >= MAX_ISSUES:
            self.truncated = True
            return
        self.issues.append(Issue(level, message, line, column))

    def as_dict(self) -> dict:
        return {
            "ok": self.ok,
            "template": self.template,
            "rows": self.rows,
            "columns": self.columns,
            "errors": sum(i.level == "error" for i in self.issues),
            "warnings": sum(i.level == "warning" for i in self.issues),
            "issues": [i.as_dict() for i in self.issues],
            "truncated": self.truncated,
        }


def normalize_header(name: str) -> str:
    """`Datum narození ` -> `datum_narozeni`; also strips a UTF-8 BOM."""
    name = name.replace("﻿", "").strip().lower()
    name = "".join(c for c in unicodedata.normalize("NFKD", name) if not unicodedata.combining(c))
    return re.sub(r"[^a-z0-9]+", "_", name).strip("_")


def _decode(raw: bytes, report: Report) -> str | None:
    try:
        return raw.decode("utf-8-sig")
    except UnicodeDecodeError:
        pass
    try:
        raw.decode("cp1250")
    except UnicodeDecodeError:
        report.add("error", "Soubor není v kódování UTF-8. Uložte ho prosím jako „CSV UTF-8“.")
    else:
        report.add(
            "error",
            "Soubor je v kódování Windows-1250, ne UTF-8. V Excelu zvolte "
            "„Uložit jako → CSV UTF-8 (s oddělovači)“.",
        )
    return None


def _number(value: str) -> float | None:
    v = value.strip().replace(" ", "").replace(" ", "")
    if re.fullmatch(r"-?\d+(,\d+)?", v):  # Czech decimal comma, no thousands separator
        v = v.replace(",", ".")
    try:
        return float(v)
    except ValueError:
        return None


def _period_ok(value: str) -> bool:
    for pattern, kind in _PERIOD:
        if pattern.match(value):
            if kind == "day":
                try:
                    date.fromisoformat(value)
                except ValueError:
                    return False
            return True
    return False


def validate_csv(raw: bytes, template: Template) -> Report:
    report = Report(template=template.key)

    if not raw.strip():
        report.add("error", "Soubor je prázdný.")
        return report
    if len(raw) > MAX_BYTES:
        report.add("error", f"Soubor je větší než {MAX_BYTES // (1024 * 1024)} MB.")
        return report

    text = _decode(raw, report)
    if text is None:
        return report

    first_line = text.splitlines()[0] if text.splitlines() else ""
    # Czech Excel exports with ";" because "," is the decimal separator.
    delimiter = ";" if first_line.count(";") > first_line.count(",") else ","
    reader = csv.reader(io.StringIO(text), delimiter=delimiter)

    try:
        header_raw = next(reader)
    except (StopIteration, csv.Error):
        report.add("error", "Soubor nemá řádek s názvy sloupců.")
        return report
    header = [normalize_header(h) for h in header_raw]
    report.columns = header

    for name in header:
        if _PERSONAL.search(name):
            report.add(
                "warning",
                f"Sloupec „{name}“ vypadá, jako by mohl obsahovat osobní údaje. "
                "Portál přijímá jen agregovaná data.",
                column=name,
            )
    if len(set(header)) != len(header):
        report.add("error", "Některý název sloupce se opakuje.")
    missing = [c for c in template.required if c not in header]
    if missing:
        report.add("error", "Chybí povinné sloupce: " + ", ".join(missing) + ".")
    unknown = [c for c in header if c and template.column(c) is None]
    if unknown:
        report.add(
            "warning",
            "Sloupce, které šablona nezná, budou vynechány: " + ", ".join(unknown) + ".",
        )
    if not report.ok:
        return report

    index = {name: i for i, name in enumerate(header)}
    seen: dict[tuple, int] = {}
    small = 0

    for line_no, row in enumerate(reader, start=2):
        if not any(cell.strip() for cell in row):
            continue
        report.rows += 1
        if report.rows > MAX_ROWS:
            report.add("error", f"Soubor má víc než {MAX_ROWS} řádků.")
            break
        if len(row) != len(header):
            report.add("error", f"Řádek má {len(row)} hodnot, záhlaví {len(header)}.", line=line_no)
            continue

        out: dict[str, str] = {}
        for col in template.columns:
            if col.name not in index:
                continue
            value = row[index[col.name]].strip()
            if len(value) > MAX_CELL:
                report.add("error", f"Hodnota je delší než {MAX_CELL} znaků.", line_no, col.name)
                continue
            if value and _FORMULA.match(value) and _number(value) is None:
                report.add("error", "Buňka začíná znakem, který tabulkový program spustí jako vzorec.", line_no, col.name)
                continue
            if not value:
                if col.required:
                    report.add("error", "Povinná hodnota chybí.", line_no, col.name)
                out[col.name] = ""
                continue
            if col.kind == "period" and not _period_ok(value):
                report.add("error", f"„{value}“ není platné období (YYYY, YYYY-MM, YYYY-MM-DD, YYYY-Www).", line_no, col.name)
            elif col.kind == "territory":
                if value.upper() not in TERRITORIES:
                    # The original spelling, so the provider can find it in the file.
                    report.add("error", f"„{value}“ není kód území (CZ nebo NUTS3, např. CZ010).", line_no, col.name)
                value = value.upper()
            elif col.kind in ("number", "count"):
                number = _number(value)
                if number is None:
                    report.add("error", f"„{value}“ není číslo.", line_no, col.name)
                else:
                    value = repr(number) if not number.is_integer() else str(int(number))
            out[col.name] = value

        # Small counts identify people; small percentages or rates do not.
        if out.get("jednotka", "").lower() in COUNT_UNITS:
            number = _number(out.get("hodnota", ""))
            if number is not None and 0 < number < SMALL_COUNT:
                small += 1

        key = tuple(out.get(c, "") for c in template.row_key)
        if template.row_key and all(key):
            if key in seen:
                report.add("error", f"Duplicitní řádek (stejné {', '.join(template.row_key)} jako řádek {seen[key]}).", line=line_no)
            else:
                seen[key] = line_no
        report.normalized.append(out)

    if report.rows == 0 and report.ok:
        report.add("error", "Soubor neobsahuje žádná data, jen záhlaví.")
    if small:
        report.add(
            "warning",
            f"{_cs_values(small)} než {SMALL_COUNT}. U malých počtů v malém území hrozí, "
            "že půjde poznat konkrétního člověka — posoudíme to při revizi.",
            column="hodnota",
        )
    if not report.ok:
        report.normalized = []
    return report


def _cs_values(n: int) -> str:
    """Czech plural: 1 hodnota je menší / 2–4 hodnoty jsou menší / 5+ hodnot je menších."""
    if n == 1:
        return "1 hodnota je menší"
    if 2 <= n <= 4:
        return f"{n} hodnoty jsou menší"
    return f"{n} hodnot je menších"


def to_csv(rows: list[dict[str, str]], template: Template) -> str:
    """The normalised file: template columns in template order, comma, UTF-8."""
    buf = io.StringIO()
    writer = csv.DictWriter(buf, fieldnames=template.names, extrasaction="ignore", lineterminator="\n")
    writer.writeheader()
    writer.writerows(rows)
    return buf.getvalue()
