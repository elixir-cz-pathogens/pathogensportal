import os


class Settings:
    service_name: str = "website-be"
    port: int = int(os.getenv("PORT", "8000"))
    db_host: str = os.getenv("DB_HOST", "pathogen-db")
    db_port: int = int(os.getenv("DB_PORT", "5432"))


settings = Settings()
