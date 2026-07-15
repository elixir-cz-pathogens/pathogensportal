# mcp

Model Context Protocol adaptér — bezpečný přístup AI k datům.

Kontejner (FastAPI). Poslouchá jen na interní síti — ven jde vše přes Apache.

- Health: `GET /health`
- Port (interní): `8002`
- Lokálně: `uvicorn app.main:app --reload --port 8002`
- Testy: `pytest`
