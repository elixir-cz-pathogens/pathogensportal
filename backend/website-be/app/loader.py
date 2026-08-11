"""ETL: chart JSON -> PostgreSQL.

The input is the directory holding the output of `generate_json.py` from the
pathogensportal-db submodule (`CHARTS_DIR`, mounted as
`frontend/static/data/charts/` in the dev compose). So the chain is:

    external sources --scrapers--> CSV --generate_json.py--> chart JSON --loader--> Postgres

The CSV -> JSON step stays in the submodule, because a colleague owns it; this
loader picks up only from his output and does not reach into someone else's repo.

Usage:

    python -m app.loader                 # from CHARTS_DIR
    python -m app.loader /other/path     # from a specific directory

The run is **idempotent**: `recorded_at` is the file's last-modified time, so
running it again over unchanged data merely rewrites the same rows and does not
create a new historical version.
"""

from __future__ import annotations

import json
import sys
from datetime import datetime, timezone
from pathlib import Path

from psycopg.types.json import Jsonb

from .config import settings
from .db import connect, ensure_schema

_UPSERT = """
INSERT INTO dashboard_data (dashboard_slug, data_key, data_value, recorded_at)
VALUES (%s, %s, %s, %s)
ON CONFLICT (dashboard_slug, data_key, recorded_at)
DO UPDATE SET data_value = EXCLUDED.data_value, updated_at = NOW()
"""


def group_of(key: str) -> str:
    """The thematic group = the part of the file name before the first underscore.

    `covid_cases_weekly` -> `covid`, `flu_regional_weekly` -> `flu`. When there is
    no underscore, the group is the whole key.
    """
    return key.split("_", 1)[0]


def load_dir(charts_dir: Path) -> int:
    """Loads every `*.json` from the directory into the DB. Returns how many charts were loaded."""
    files = sorted(charts_dir.glob("*.json"))
    if not files:
        raise SystemExit(f"There are no *.json files in {charts_dir}.")

    ensure_schema()
    loaded = 0
    with connect() as conn:
        for path in files:
            try:
                payload = json.loads(path.read_text(encoding="utf-8"))
            except json.JSONDecodeError as exc:
                print(f"  skipped {path.name}: invalid JSON ({exc})", file=sys.stderr)
                continue
            recorded_at = datetime.fromtimestamp(path.stat().st_mtime, tz=timezone.utc)
            key = path.stem
            conn.execute(_UPSERT, (group_of(key), key, Jsonb(payload), recorded_at))
            loaded += 1
            print(f"  {key} ({group_of(key)}, {recorded_at:%Y-%m-%d %H:%M})")
    return loaded


def main() -> None:
    charts_dir = Path(sys.argv[1]) if len(sys.argv) > 1 else settings.charts_dir
    if not charts_dir.is_dir():
        raise SystemExit(f"The directory {charts_dir} does not exist.")
    print(f"Loading chart JSON from {charts_dir} into {settings.db_host}/{settings.db_name}:")
    count = load_dir(charts_dir)
    print(f"Done — {count} charts in the database.")


if __name__ == "__main__":
    main()
