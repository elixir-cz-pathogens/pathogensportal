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

    # ── Data intake from providers (TODO D15) ────────────────────────────────
    # Uploaded files; a volume on the server, never inside the web root.
    intake_dir: Path = Path(os.getenv("INTAKE_DIR", "/intake"))
    # Accepted uploads, normalised, for the data pipeline to pick up (files.py).
    # On the server this is the -db DATA_DIR's `ext_income/`. Empty = no hand-over.
    intake_export_dir: str = os.getenv("INTAKE_EXPORT_DIR", "")
    # Peers whose X-Forwarded-For is believed (api.client_ip). On the server the
    # request reaches the container from Apache through Docker's port proxy, so
    # the peer is the bridge gateway, not loopback — without it every visitor
    # would share one rate-limit bucket.
    intake_trusted_proxies: list[str] = _csv_env("INTAKE_TRUSTED_PROXIES", "127.0.0.0/8,::1/128")
    # Who is told about new requests and uploads. Comma-separated. Empty = log only.
    intake_notify_to: list[str] = _csv_env("INTAKE_NOTIFY_TO", "")
    intake_smtp_host: str = os.getenv("INTAKE_SMTP_HOST", "")
    intake_smtp_port: int = int(os.getenv("INTAKE_SMTP_PORT", "587"))
    intake_smtp_user: str = os.getenv("INTAKE_SMTP_USER", "")
    intake_smtp_password: str = os.getenv("INTAKE_SMTP_PASSWORD", "")
    intake_smtp_from: str = os.getenv("INTAKE_SMTP_FROM", "noreply@pathogens.vm.cesnet.cz")
    intake_smtp_starttls: bool = os.getenv("INTAKE_SMTP_STARTTLS", "1") == "1"
    # "postgres" on a server; "memory" runs the intake with no database (local
    # tryout only — everything is lost on restart).
    intake_store: str = os.getenv("INTAKE_STORE", "postgres")
    # Requests per client IP per hour on the public request endpoint.
    intake_requests_per_hour: int = int(os.getenv("INTAKE_REQUESTS_PER_HOUR", "5"))
    # Uploads per provider key per 24 h, accepted and rejected alike — stops a
    # provider's script stuck in a loop, not an honest weekly or daily export.
    intake_uploads_per_day: int = int(os.getenv("INTAKE_UPLOADS_PER_DAY", "50"))

    @property
    def dsn(self) -> str:
        return (
            f"host={self.db_host} port={self.db_port} dbname={self.db_name} "
            f"user={self.db_user} password={self.db_password} "
            f"connect_timeout={self.db_connect_timeout}"
        )


settings = Settings()
