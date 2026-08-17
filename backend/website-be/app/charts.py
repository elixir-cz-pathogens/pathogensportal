"""Reading the charts' source data from the database.

The data lives in the `dashboard_data` table (schema from the pathogensportal-db
submodule):

| column           | meaning here                                                   |
|------------------|----------------------------------------------------------------|
| `dashboard_slug` | thematic group derived from the file name (`covid`, `flu`, …)   |
| `data_key`       | the chart key = file name without extension (`covid_cases_weekly`) |
| `data_value`     | the finished Chart.js payload, exactly as generate_json made it |
| `recorded_at`    | when the source data was created (the file's mtime), see `loader.py` |

`data_value` is returned **unchanged**, so the API response is byte-for-byte the
same as the static file in `frontend/static/data/charts/`. That is what makes the
frontend's fallback to static data purely a matter of a different URL, not a
different format.
"""

from __future__ import annotations

from datetime import datetime
from typing import Any, NamedTuple

from .db import connect

# One row per key — always the freshest one.
_LATEST_PER_KEY = """
SELECT DISTINCT ON (data_key) data_key, dashboard_slug, data_value, recorded_at
FROM dashboard_data
"""


class Chart(NamedTuple):
    key: str
    group: str
    payload: Any
    recorded_at: datetime


def list_charts() -> list[Chart]:
    sql = _LATEST_PER_KEY + "ORDER BY data_key, recorded_at DESC"
    with connect() as conn:
        rows = conn.execute(sql).fetchall()
    return [Chart(key=r[0], group=r[1], payload=r[2], recorded_at=r[3]) for r in rows]


def get_chart(key: str) -> Chart | None:
    sql = _LATEST_PER_KEY + "WHERE data_key = %s ORDER BY data_key, recorded_at DESC"
    with connect() as conn:
        row = conn.execute(sql, (key,)).fetchone()
    if row is None:
        return None
    return Chart(key=row[0], group=row[1], payload=row[2], recorded_at=row[3])
