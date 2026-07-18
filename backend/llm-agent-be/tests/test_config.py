from app.config import settings


def test_service_name():
    assert settings.service_name == "llm-agent-be"


def test_port_is_int():
    assert isinstance(settings.port, int)
    assert settings.port > 0
