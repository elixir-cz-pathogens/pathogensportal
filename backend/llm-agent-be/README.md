# llm-agent-be

The AI core — semantic queries, translation flows and reasoning on top of an LLM.

A container (FastAPI). It listens on the internal network only — everything goes out through Apache.

- Health: `GET /health`
- Port (internal): `8001`
- Locally: `uvicorn app.main:app --reload --port 8001`
- Tests: `pytest`
