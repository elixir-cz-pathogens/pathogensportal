from fastapi import FastAPI

from .config import settings

app = FastAPI(title=settings.service_name)


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "service": settings.service_name}
