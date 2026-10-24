# deploy/

Container orchestration.

- `docker-compose.yml` — **production**: the BE services + `pathogen-db`, internal network only,
  nothing published to the host (the DB is not reachable from outside). The FE is served by Apache on the host.
- `docker-compose.dev.yml` — **dev override**: adds the Hugo dev server, publishes ports on
  `127.0.0.1` and enables BE hot reload.
- `.env.example` — a template of the variables. Copy it to `.env` (which is not committed).

```bash
# dev
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
# production
docker compose up -d
```

> The DB schema comes from the `pathogensportal-db` submodule — compose mounts its `db/init.sql`
> into `docker-entrypoint-initdb.d` (runs only on the first init of an empty volume; on an existing
> DB the loader applies the schema itself, see `pathogensportal-db/scripts/load_to_db.py`).
