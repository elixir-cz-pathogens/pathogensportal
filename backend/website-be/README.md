# website-be

The portal's API gateway and business logic.

A container (FastAPI). It listens on the internal network only — everything goes out through Apache.

- Health: `GET /health`
- Port (internal): `8000`
- Locally: `uvicorn app.main:app --reload --port 8000`
- Tests: `pytest`
