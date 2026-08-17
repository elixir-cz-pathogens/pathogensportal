# mcp

The Model Context Protocol adapter — safe AI access to the data.

A container (FastAPI). It listens on the internal network only — everything goes out through Apache.

- Health: `GET /health`
- Port (internal): `8002`
- Locally: `uvicorn app.main:app --reload --port 8002`
- Tests: `pytest`
