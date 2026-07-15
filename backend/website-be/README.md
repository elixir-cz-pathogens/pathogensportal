# website-be

API brána a business logika portálu.

Kontejner (FastAPI). Poslouchá jen na interní síti — ven jde vše přes Apache.

- Health: `GET /health`
- Port (interní): `8000`
- Lokálně: `uvicorn app.main:app --reload --port 8000`
- Testy: `pytest`
