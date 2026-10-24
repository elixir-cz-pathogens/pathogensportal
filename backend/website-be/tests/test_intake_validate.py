"""The CSV checks — every rule a provider can trip over, one test each."""

from app.intake.templates import AGGREGATE_V1 as T
from app.intake.validate import SMALL_COUNT, normalize_header, to_csv, validate_csv

GOOD = "obdobi,uzemi,ukazatel,hodnota,jednotka\n2026-W40,CZ010,pozitivni_vzorky,12,pocet\n2026-W40,CZ,pozitivni_vzorky,140,pocet\n"


def v(text: str, encoding: str = "utf-8"):
    return validate_csv(text.encode(encoding), T)


def messages(report, level="error"):
    return [i.message for i in report.issues if i.level == level]


def test_good_file_is_accepted_and_normalized():
    r = v(GOOD)
    assert r.ok, r.issues
    assert r.rows == 2
    out = to_csv(r.normalized, T)
    assert out.splitlines()[0] == ",".join(T.names)
    assert "2026-W40,CZ010,pozitivni_vzorky,12,pocet" in out


def test_czech_excel_export_semicolon_decimal_comma_bom():
    r = v("﻿Období;Území;Ukazatel;Hodnota;Jednotka\n2026-09;CZ064;pozitivita;12,5;procento\n")
    assert r.ok, r.issues
    assert r.normalized[0]["hodnota"] == "12.5"
    assert r.normalized[0]["uzemi"] == "CZ064"


def test_windows_1250_is_rejected_with_a_fix():
    r = v("obdobi,uzemi,ukazatel,hodnota\n2026,CZ,příklad,1\n", encoding="cp1250")
    assert not r.ok
    assert "CSV UTF-8" in messages(r)[0]


def test_missing_required_column():
    r = v("obdobi,uzemi,hodnota\n2026,CZ,1\n")
    assert not r.ok
    assert "ukazatel" in messages(r)[0]


def test_bad_period_territory_and_number_name_line_and_column():
    r = v("obdobi,uzemi,ukazatel,hodnota\n2026-13,CZ999,x,dvanáct\n")
    errs = [i for i in r.issues if i.level == "error"]
    assert {i.column for i in errs} == {"obdobi", "uzemi", "hodnota"}
    assert all(i.line == 2 for i in errs)


def test_invalid_calendar_day():
    assert not v("obdobi,uzemi,ukazatel,hodnota\n2026-02-30,CZ,x,1\n").ok


def test_formula_injection_is_an_error_but_negative_numbers_are_fine():
    r = v('obdobi,uzemi,ukazatel,hodnota,poznamka\n2026,CZ,x,1,"=HYPERLINK(""http://evil"")"\n')
    assert not r.ok
    assert any("vzorec" in m for m in messages(r))
    assert v("obdobi,uzemi,ukazatel,hodnota\n2026,CZ,zmena,-3.5\n").ok


def test_personal_looking_column_is_a_warning():
    r = v("obdobi,uzemi,ukazatel,hodnota,Rodné číslo\n2026,CZ,x,10,\n")
    assert any("osobní údaje" in m for m in messages(r, "warning"))


def test_small_counts_warn_but_small_percentages_do_not():
    counts = v(f"obdobi,uzemi,ukazatel,hodnota,jednotka\n2026,CZ041,x,{SMALL_COUNT - 1},pocet\n")
    assert counts.ok and any("1 hodnota je menší než" in m for m in messages(counts, "warning"))
    pct = v("obdobi,uzemi,ukazatel,hodnota,jednotka\n2026,CZ041,x,2.5,procento\n")
    assert not any("menší" in m for m in messages(pct, "warning"))


def test_duplicate_rows():
    r = v("obdobi,uzemi,ukazatel,hodnota\n2026,CZ,x,1\n2026,CZ,x,2\n")
    assert not r.ok and any("Duplicitní" in m for m in messages(r))


def test_unknown_columns_are_dropped_with_a_warning():
    r = v("obdobi,uzemi,ukazatel,hodnota,extra\n2026,CZ,x,10,abc\n")
    assert r.ok
    assert "extra" not in r.normalized[0]
    assert any("extra" in m for m in messages(r, "warning"))


def test_empty_and_header_only_files():
    assert not v("").ok
    assert not v("obdobi,uzemi,ukazatel,hodnota\n").ok


def test_ragged_row():
    assert not v("obdobi,uzemi,ukazatel,hodnota\n2026,CZ,x\n").ok


def test_rejected_file_has_no_normalized_rows():
    assert v("obdobi,uzemi,ukazatel,hodnota\n2026,XX,x,1\n").normalized == []


def test_normalize_header():
    assert normalize_header("﻿ Datum narození ") == "datum_narozeni"
