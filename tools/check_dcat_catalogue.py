#!/usr/bin/env python3
"""Check the built DCAT-AP-CZ catalogue (public/dcat/).

The catalogue is written by a Hugo partial (layouts/partials/dcat-publish.html)
from data/dcat.yaml and data/sources.yaml. A template that goes wrong does not
fail the build — it writes a record with a field missing, and nobody opens
/dcat/ to look. Once the catalogue is registered in the National Open Data
Catalogue (NKOD), a broken record is harvested as it is. This script reads the
built files and checks what the template cannot check about itself:

  - the index and the dataset files agree: every dataset the index names has
    a file, and no file is left that the index does not name;
  - every record names the JSON-LD context of the version of the standard the
    catalogue follows — OFN "DCAT-AP-CZ: Open data catalogue interface",
    2024-05-28 (https://ofn.gov.cz/dcat-ap-cz-rozhraní-katalogů-otevřených-dat/2024-05-28/)
    — and has the fields that version marks mandatory; IRIs are absolute and
    every distribution points to a file that was built;
  - every distribution states terms of use on all four axes;
  - every dataset links to its sources (`dcterms:source`);
  - the open-reuse rule holds: a dataset is in the catalogue only when every
    source it is built on is marked `licence.open` in data/sources.yaml. The
    template applies the rule; this repeats it from the YAML files, so an
    edit to the template cannot quietly lift it.

`poskytovatel` (publisher) is mandatory for NKOD but empty until the portal is
registered (hugo.toml, params.dcat.publisher). Its absence is reported as a
warning; `--strict` turns it into an error — use that before registration.

Usage:
    (cd frontend && hugo --minify)
    python tools/check_dcat_catalogue.py              # reads frontend/public
    python tools/check_dcat_catalogue.py --public <dir> --strict

Exit code 0 = catalogue is consistent, 1 = at least one error.
Needs PyYAML (to read the two data files).
"""
import argparse
import json
import sys
from pathlib import Path
from urllib.parse import unquote, urlparse

import yaml

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "frontend" / "data"

# The official schemas pin `@context` to this exact address, so it is what
# says which version of the standard a record claims to follow.
CONTEXT = ("https://ofn.gov.cz/dcat-ap-cz-rozhraní-katalogů-otevřených-dat/2024-05-28/"
           "kontexty/rozhraní-katalogů-otevřených-dat.jsonld")

# Mandatory per the OFN JSON schemas (schémata/katalog.json, datová-sada.json),
# apart from `poskytovatel`, which is handled separately — see the docstring.
CATALOGUE_REQUIRED = ["@context", "typ", "iri", "název", "popis", "datová_sada"]
DATASET_REQUIRED = ["@context", "typ", "iri", "název", "popis", "téma",
                    "periodicita_aktualizace", "klíčové_slovo", "prvek_rúian"]
# A distribution is either a data service or a file to download; ours are
# files, for which the schema also requires the format, media type and URL.
DISTRIBUTION_REQUIRED = ["typ", "iri", "podmínky_užití", "přístupové_url",
                         "formát", "typ_média", "soubor_ke_stažení"]
TERMS_AXES = ["autorské_dílo", "databáze_jako_autorské_dílo",
              "databáze_chráněná_zvláštními_právy", "osobní_údaje"]


def local_path(public: Path, url: str) -> Path:
    """File in the build that a URL of this site resolves to (host is ignored:
    the build may carry the production or the staging base URL)."""
    return public / unquote(urlparse(url).path).lstrip("/")


def bilingual(value) -> bool:
    return isinstance(value, dict) and bool(value.get("cs")) and bool(value.get("en"))


def check(public: Path, strict: bool) -> tuple[list[str], list[str], list[str]]:
    errors, warnings, info = [], [], []
    index_file = public / "dcat" / "katalog.jsonld"
    if not index_file.exists():
        return [f"{index_file} does not exist — was the site built?"], warnings, info

    index = json.loads(index_file.read_text(encoding="utf-8"))
    for key in CATALOGUE_REQUIRED:
        if not index.get(key):
            errors.append(f"katalog.jsonld: missing `{key}`")
    if index.get("@context") != CONTEXT:
        errors.append("katalog.jsonld: `@context` is not the 2024-05-28 context of the standard")
    if not bilingual(index.get("název")) or not bilingual(index.get("popis")):
        errors.append("katalog.jsonld: `název` and `popis` need both cs and en")

    def publisher(record: dict, where: str) -> None:
        if not record.get("poskytovatel"):
            (errors if strict else warnings).append(
                f"{where}: no `poskytovatel` — NKOD will not harvest the catalogue without it")

    publisher(index, "katalog.jsonld")

    # What the YAML files say should be published.
    sources = {s["id"]: s for s in yaml.safe_load((DATA / "sources.yaml").read_text(encoding="utf-8"))}
    declared = {d["id"]: d for d in yaml.safe_load((DATA / "dcat.yaml").read_text(encoding="utf-8"))}
    expected = set()
    for ds_id, ds in declared.items():
        ids = ds.get("zdroje") or []
        unknown = [i for i in ids if i not in sources]
        if not ids or unknown:
            errors.append(f"dcat.yaml: {ds_id}: `zdroje` empty or not in sources.yaml {unknown}")
            continue
        restricted = [i for i in ids if (sources[i].get("licence") or {}).get("open") is not True]
        if restricted:
            info.append(f"held back: {ds_id} (no open-reuse terms for {', '.join(restricted)})")
        else:
            expected.add(ds_id)

    listed = {}
    for iri in index.get("datová_sada") or []:
        listed[Path(unquote(urlparse(iri).path)).stem] = iri
    built = {p.stem for p in (public / "dcat" / "datova-sada").glob("*.jsonld")}

    for ds_id in sorted(set(listed) - built):
        errors.append(f"{ds_id}: named in the index, but its file was not built")
    for ds_id in sorted(built - set(listed)):
        errors.append(f"{ds_id}: file built, but the index does not name it")
    for ds_id in sorted(set(listed) - expected):
        errors.append(f"{ds_id}: published although a source lacks `licence.open` "
                      f"(or the dataset is not in dcat.yaml)")
    for ds_id in sorted(expected - set(listed)):
        errors.append(f"{ds_id}: all sources are open, but the dataset is not in the catalogue")
    if not listed:
        warnings.append("the catalogue lists no dataset")

    for ds_id in sorted(set(listed) & built):
        record = json.loads(local_path(public, listed[ds_id]).read_text(encoding="utf-8"))
        where = f"{ds_id}.jsonld"
        for key in DATASET_REQUIRED:
            if not record.get(key):
                errors.append(f"{where}: missing `{key}`")
        if record.get("@context") != CONTEXT:
            errors.append(f"{where}: `@context` is not the 2024-05-28 context of the standard")
        if record.get("iri") != listed[ds_id]:
            errors.append(f"{where}: `iri` differs from the IRI in the index")
        if not bilingual(record.get("název")) or not bilingual(record.get("popis")):
            errors.append(f"{where}: `název` and `popis` need both cs and en")
        publisher(record, where)

        linked = {s.get("iri") for s in record.get("dcterms:source") or []}
        wanted = {sources[i]["url"] for i in declared.get(ds_id, {}).get("zdroje") or [] if i in sources}
        if linked != wanted:
            errors.append(f"{where}: `dcterms:source` {sorted(linked)} does not match "
                          f"the sources in dcat.yaml {sorted(wanted)}")

        distributions = record.get("distribuce") or []
        if not distributions:
            errors.append(f"{where}: no distribution — a dataset without a file offers nothing")
        seen = set()
        for dist in distributions:
            name = str(dist.get("iri", "?")).rsplit("#", 1)[-1]
            for key in DISTRIBUTION_REQUIRED:
                if not dist.get(key):
                    errors.append(f"{where} › {name}: missing `{key}`")
            if dist.get("iri") in seen:
                errors.append(f"{where} › {name}: distribution IRI used twice")
            seen.add(dist.get("iri"))
            terms = dist.get("podmínky_užití") or {}
            for axis in TERMS_AXES:
                if not str(terms.get(axis, "")).startswith("https://"):
                    errors.append(f"{where} › {name}: terms of use lack `{axis}`")
            url = dist.get("přístupové_url", "")
            if not url.startswith("https://"):
                errors.append(f"{where} › {name}: `přístupové_url` is not an https URL")
            elif not local_path(public, url).is_file():
                errors.append(f"{where} › {name}: {urlparse(url).path} was not built")
            if not bilingual(dist.get("název")):
                errors.append(f"{where} › {name}: `název` needs both cs and en")
        info.append(f"published: {ds_id} ({len(distributions)} distributions)")

    return errors, warnings, info


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--public", type=Path, default=ROOT / "frontend" / "public",
                        help="directory with the built site (default: frontend/public)")
    parser.add_argument("--strict", action="store_true",
                        help="a missing `poskytovatel` is an error (use before NKOD registration)")
    args = parser.parse_args()

    errors, warnings, info = check(args.public, args.strict)
    for line in info:
        print(f"  {line}")
    for line in warnings:
        print(f"⚠️  {line}")
    for line in errors:
        print(f"❌ {line}")
    if errors:
        print(f"\nDCAT catalogue: {len(errors)} error(s).")
        return 1
    print(f"\n✅ DCAT catalogue is consistent ({len(warnings)} warning(s)).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
