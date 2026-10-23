"""CSV templates a provider can upload against (TODO D15).

A template is the contract with the provider: which columns exist, which are
required and what a valid value looks like. It is deliberately small and LONG
format — one row per period × territory × indicator — because that shape holds
almost any aggregated statistic without a new template per dataset, and it is
what the chart generators in pathogensportal-db already consume.

Column names are Czech and ASCII: providers fill these files in Czech, and
diacritics in a header are the first thing a spreadsheet export mangles.

A new template is a new entry in TEMPLATES with its own version suffix. Never
change a published template in place — a provider's existing export would start
failing without anything on their side having changed.
"""

from __future__ import annotations

from dataclasses import dataclass, field


@dataclass(frozen=True)
class Column:
    name: str
    kind: str  # "period" | "territory" | "number" | "count" | "text"
    required: bool = True
    description: str = ""


@dataclass(frozen=True)
class Template:
    key: str
    title: str
    columns: tuple[Column, ...]
    # Columns that identify a row; two rows with the same values are a duplicate.
    row_key: tuple[str, ...] = field(default_factory=tuple)

    @property
    def names(self) -> list[str]:
        return [c.name for c in self.columns]

    @property
    def required(self) -> list[str]:
        return [c.name for c in self.columns if c.required]

    def column(self, name: str) -> Column | None:
        return next((c for c in self.columns if c.name == name), None)


AGGREGATE_V1 = Template(
    key="agregace-v1",
    title="Agregovaná data (dlouhý formát)",
    columns=(
        Column("obdobi", "period", description="YYYY, YYYY-MM, YYYY-MM-DD nebo ISO týden YYYY-Www"),
        Column("uzemi", "territory", description="CZ nebo kód kraje NUTS3 (CZ010 … CZ080)"),
        Column("ukazatel", "text", description="co se měří, např. pozitivni_vzorky"),
        Column("hodnota", "number", description="číslo; desetinná tečka nebo čárka"),
        Column("jednotka", "text", required=False, description="např. pocet, procento, na_100000"),
        Column("ci_dolni", "number", required=False, description="dolní mez intervalu spolehlivosti"),
        Column("ci_horni", "number", required=False, description="horní mez intervalu spolehlivosti"),
        Column("poznamka", "text", required=False),
    ),
    row_key=("obdobi", "uzemi", "ukazatel"),
)

TEMPLATES: dict[str, Template] = {t.key: t for t in (AGGREGATE_V1,)}

# NUTS3 regions of Czechia (CZ-NUTS 2021) plus the whole country.
TERRITORIES: frozenset[str] = frozenset(
    {
        "CZ",
        "CZ010", "CZ020", "CZ031", "CZ032", "CZ041", "CZ042", "CZ051",
        "CZ052", "CZ053", "CZ063", "CZ064", "CZ071", "CZ072", "CZ080",
    }
)
