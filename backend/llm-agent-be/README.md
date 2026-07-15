# llm-agent-be

AI jádro — sémantické dotazy, překladové toky a reasoning nad LLM.

Kontejner (FastAPI). Poslouchá jen na interní síti — ven jde vše přes Apache.

- Health: `GET /health`
- Port (interní): `8001`
- Lokálně: `uvicorn app.main:app --reload --port 8001`
- Testy: `pytest`
