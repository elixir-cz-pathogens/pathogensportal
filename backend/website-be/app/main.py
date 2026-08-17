import re

import psycopg
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from . import charts
from .config import settings

app = FastAPI(title=settings.service_name)

if settings.cors_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_methods=["GET"],
        allow_headers=["*"],
        expose_headers=["X-Recorded-At"],
    )

# The chart key = the file name without its extension; nothing else reaches the query.
_KEY_RE = re.compile(r"^[a-z0-9_]{1,255}$")

_DB_UNAVAILABLE = "The database is unavailable."


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "service": settings.service_name}


@app.get("/api/charts")
def list_charts() -> dict:
    """List of available charts — key, thematic group and the data's age."""
    try:
        rows = charts.list_charts()
    except psycopg.Error:
        raise HTTPException(status_code=503, detail=_DB_UNAVAILABLE)
    return {
        "charts": [
            {"key": c.key, "group": c.group, "recorded_at": c.recorded_at.isoformat()}
            for c in rows
        ]
    }


@app.get("/api/charts/{key}")
def get_chart(key: str) -> JSONResponse:
    """One chart's payload, identical in format to the static `/data/charts/<key>.json`."""
    if not _KEY_RE.match(key):
        raise HTTPException(status_code=404, detail="Unknown chart.")
    try:
        chart = charts.get_chart(key)
    except psycopg.Error:
        raise HTTPException(status_code=503, detail=_DB_UNAVAILABLE)
    if chart is None:
        raise HTTPException(status_code=404, detail="Unknown chart.")
    return JSONResponse(
        content=chart.payload,
        headers={"X-Recorded-At": chart.recorded_at.isoformat()},
    )
