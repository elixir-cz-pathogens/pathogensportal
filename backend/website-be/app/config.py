import os
from pathlib import Path


def _csv_env(name: str, default: str) -> list[str]:
    return [item.strip() for item in os.getenv(name, default).split(",") if item.strip()]


class Settings:
    service_name: str = "website-be"
    port: int = int(os.getenv("PORT", "8000"))
    db_host: str = os.getenv("DB_HOST", "pathogen-db")
    db_port: int = int(os.getenv("DB_PORT", "5432"))
    db_name: str = os.getenv("POSTGRES_DB", "pathogens")
    db_user: str = os.getenv("POSTGRES_USER", "portal")
    db_password: str = os.getenv("POSTGRES_PASSWORD", "")
    db_connect_timeout: int = int(os.getenv("DB_CONNECT_TIMEOUT", "3"))

    # Input for the loader: the directory with chart JSON (the output of
    # generate_json.py from the submodule).
    charts_dir: Path = Path(os.getenv("CHARTS_DIR", "/charts"))

    # The Hugo dev server runs on a different port (:1313), so a different origin
    # from the API. In production the FE and the API sit behind the same Apache
    # (same-origin) and this list may be empty.
    cors_origins: list[str] = _csv_env(
        "CORS_ORIGINS", "http://localhost:1313,http://127.0.0.1:1313"
    )

    @property
    def dsn(self) -> str:
        return (
            f"host={self.db_host} port={self.db_port} dbname={self.db_name} "
            f"user={self.db_user} password={self.db_password} "
            f"connect_timeout={self.db_connect_timeout}"
        )


settings = Settings()
