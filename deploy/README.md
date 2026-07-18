# deploy/

Orchestrace kontejnerů.

- `docker-compose.yml` — **produkce**: BE služby + `pathogen-db`, jen interní síť,
  nic nepublikováno na hostitele (DB není zvenčí dostupná). FE servíruje Apache na hostu.
- `docker-compose.dev.yml` — **dev override**: přidá Hugo dev server, publikuje porty na
  `127.0.0.1` a zapne hot-reload BE.
- `.env.example` — šablona proměnných. Zkopíruj na `.env` (necommituje se).

```bash
# dev
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
# produkce
docker compose up -d
```

> Schéma DB dodá submodul `pathogensportal-db` (řádek s `init.sql` je v compose zatím zakomentovaný).
