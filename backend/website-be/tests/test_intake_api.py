"""The intake flow end to end through HTTP, on the in-memory store:
request -> approval (as the CLI does it) -> upload -> the provider's list."""

import json

import pytest
from fastapi.testclient import TestClient

from app.config import settings
from app.intake import api, declaration, keys
from app.intake.store import MemoryStore
from app.main import app

FORM = {
    "name": "Jana Nováková",
    "email": "jana@example.org",
    "institution": "Zkušební ústav",
    "position": "vedoucí laboratoře",
    "description": "Týdenní počty pozitivních vzorků podle krajů",
    "origin": "Laboratorní systém ústavu",
    "frequency": "týdně",
    "link": "",
    "no_personal_data": True,
    "privacy_ack": True,
}
GOOD_CSV = b"obdobi,uzemi,ukazatel,hodnota\n2026-W40,CZ010,pozitivni_vzorky,12\n"
DECL = {"declaration": declaration.CURRENT}


@pytest.fixture
def env(tmp_path, monkeypatch):
    store = MemoryStore()
    app.dependency_overrides[api.get_store] = lambda: store
    monkeypatch.setattr(settings, "intake_dir", tmp_path)
    monkeypatch.setattr(settings, "intake_export_dir", str(tmp_path / "export"))
    monkeypatch.setattr(settings, "intake_requests_per_hour", 3)
    api._hits.clear()
    yield TestClient(app), store, tmp_path
    app.dependency_overrides.clear()


def approve(store: MemoryStore, request_id: str) -> str:
    """What `cli.py approve` does, on the memory store."""
    key = keys.generate()
    store.add_provider(store.get_request(request_id), keys.digest(key), keys.display_prefix(key), "zkusebni-ustav")
    store.decide_request(request_id, "approved", "test")
    return key


def test_request_is_stored(env):
    client, store, _ = env
    r = client.post("/api/intake/requests", json=FORM)
    assert r.status_code == 201
    assert store.get_request(r.json()["id"]).institution == "Zkušební ústav"


def test_request_needs_both_confirmations(env):
    client, store, _ = env
    r = client.post("/api/intake/requests", json={**FORM, "privacy_ack": False})
    assert r.status_code == 422
    assert store.list_requests() == []


def test_honeypot_looks_like_success_but_stores_nothing(env):
    client, store, _ = env
    r = client.post("/api/intake/requests", json={**FORM, "website": "http://spam"})
    assert r.status_code == 201
    assert store.list_requests() == []


def test_rate_limit(env):
    client, _, _ = env
    codes = [client.post("/api/intake/requests", json=FORM).status_code for _ in range(4)]
    assert codes == [201, 201, 201, 429]


def test_forwarded_header_is_ignored_from_a_non_proxy(env):
    """A client cannot dodge the limit by inventing X-Forwarded-For: the
    TestClient's peer is not loopback, so the header must not count."""
    client, _, _ = env
    codes = [
        client.post("/api/intake/requests", json=FORM, headers={"X-Forwarded-For": f"10.0.0.{i}"}).status_code
        for i in range(4)
    ]
    assert codes[-1] == 429


def test_upload_without_or_with_a_wrong_key_is_401(env):
    client, _, _ = env
    files = {"file": ("data.csv", GOOD_CSV, "text/csv")}
    assert client.post("/api/intake/uploads", files=files).status_code == 401
    r = client.post("/api/intake/uploads", files=files, headers={"Authorization": "Bearer " + keys.generate()})
    assert r.status_code == 401


def test_full_flow_accepted_upload_is_stored_on_disk(env):
    client, store, root = env
    req_id = client.post("/api/intake/requests", json=FORM).json()["id"]
    key = approve(store, req_id)

    r = client.post("/api/intake/uploads", files={"file": ("../../evil.csv", GOOD_CSV, "text/csv")}, data=DECL,
                    headers={"Authorization": f"Bearer {key}"})
    assert r.status_code == 200, r.json()
    body = r.json()
    assert body["status"] == "accepted" and body["report"]["rows"] == 1

    upload = store.list_uploads()[0]
    target = root / upload.provider_id / upload.id
    assert (target / "original" / "1-evil.csv").read_bytes() == GOOD_CSV
    assert json.loads((target / "report.json").read_text())["ok"] is True
    # The uploaded file name never becomes a path.
    assert not (root.parent / "evil.csv").exists()
    assert upload.filename == "../../evil.csv"

    # The hand-over: <slug>/<day>/<upload id>/, normalised CSV + manifest, no temp dir left.
    day = root / "export" / "zkusebni-ustav" / upload.received_at.strftime("%Y-%m-%d")
    assert [d.name for d in day.iterdir()] == [upload.id]
    assert (day / upload.id / "evil.csv").read_text().startswith("obdobi,uzemi,ukazatel,hodnota")
    manifest = json.loads((day / upload.id / "manifest.json").read_text())
    assert manifest["provider"]["slug"] == "zkusebni-ustav"
    assert manifest["declaration"]["version"] == declaration.CURRENT
    assert manifest["files"][0]["name"] == "../../evil.csv"

    mine = client.get("/api/intake/uploads", headers={"Authorization": f"Bearer {key}"}).json()["uploads"]
    assert [u["id"] for u in mine] == [upload.id]


def test_rejected_upload_is_kept_without_normalized_file(env):
    client, store, root = env
    key = approve(store, client.post("/api/intake/requests", json=FORM).json()["id"])
    r = client.post("/api/intake/uploads", files={"file": ("bad.csv", b"obdobi,uzemi,hodnota\n2026,CZ,1\n")}, data=DECL,
                    headers={"Authorization": f"Bearer {key}"})
    assert r.status_code == 422
    assert r.json()["status"] == "rejected"
    u = store.list_uploads()[0]
    assert (root / u.provider_id / u.id / "original" / "1-bad.csv").exists()
    # Nothing rejected reaches the pipeline.
    assert not (root / "export").exists()


def test_revoked_key_stops_working(env):
    client, store, _ = env
    key = approve(store, client.post("/api/intake/requests", json=FORM).json()["id"])
    store.revoke_provider(store.list_providers()[0].id)
    r = client.post("/api/intake/uploads", files={"file": ("d.csv", GOOD_CSV)}, data=DECL, headers={"Authorization": f"Bearer {key}"})
    assert r.status_code == 401


def test_unknown_template(env):
    client, store, _ = env
    key = approve(store, client.post("/api/intake/requests", json=FORM).json()["id"])
    r = client.post("/api/intake/uploads", files={"file": ("d.csv", GOOD_CSV)}, data={"template": "nope", **DECL},
                    headers={"Authorization": f"Bearer {key}"})
    assert r.status_code == 422


def test_templates_endpoint(env):
    client, _, _ = env
    t = client.get("/api/intake/templates").json()["templates"][0]
    assert t["key"] == "agregace-v1"
    assert {"name": "hodnota", "kind": "number", "required": True} .items() <= t["columns"][3].items()


def test_notification_without_smtp_is_visible_in_the_log(env, caplog):
    """No SMTP configured must not mean a silent request (see notify.py)."""
    client, _, _ = env
    with caplog.at_level("WARNING", logger="intake"):
        client.post("/api/intake/requests", json=FORM)
    assert any("Nová žádost" in r.getMessage() for r in caplog.records)


def test_upload_without_declaration_is_refused_and_nothing_is_kept(env):
    client, store, root = env
    key = approve(store, client.post("/api/intake/requests", json=FORM).json()["id"])
    r = client.post("/api/intake/uploads", files={"file": ("d.csv", GOOD_CSV)}, headers={"Authorization": f"Bearer {key}"})
    assert r.status_code == 422
    assert "prohlášení" in r.json()["detail"]
    assert store.list_uploads() == []
    assert not any(root.rglob("*.csv"))


def test_stale_declaration_version_is_refused(env):
    client, store, _ = env
    key = approve(store, client.post("/api/intake/requests", json=FORM).json()["id"])
    r = client.post("/api/intake/uploads", files={"file": ("d.csv", GOOD_CSV)}, data={"declaration": "prohlaseni-v0"},
                    headers={"Authorization": f"Bearer {key}"})
    assert r.status_code == 422 and "zastaralé" in r.json()["detail"]
    assert store.list_uploads() == []


def test_declaration_is_recorded_with_the_upload(env):
    """Version on the record, version AND text in report.json next to the file."""
    client, store, root = env
    key = approve(store, client.post("/api/intake/requests", json=FORM).json()["id"])
    client.post("/api/intake/uploads", files={"file": ("d.csv", GOOD_CSV)}, data=DECL, headers={"Authorization": f"Bearer {key}"})
    u = store.list_uploads()[0]
    assert u.declaration == declaration.CURRENT
    saved = json.loads((root / u.provider_id / u.id / "report.json").read_text())["declaration"]
    assert saved["version"] == declaration.CURRENT
    assert saved["text"] == declaration.DECLARATIONS[declaration.CURRENT]
    assert saved["institution"] == "Zkušební ústav"


def test_upload_page_shows_the_current_declaration():
    """The page and the backend must agree on the key and the wording."""
    from pathlib import Path
    import re

    page = (Path(__file__).resolve().parents[3] / "frontend/layouts/shortcodes/intake-upload.html").read_text()
    assert f'value="{declaration.CURRENT}"' in page
    shown = re.search(r'name="declaration".*?<span>(.*?)</span></label>', page, re.S).group(1)
    shown = re.sub(r"<[^>]+>", "", shown)  # the licence name is a link on the page
    assert " ".join(shown.split()) == declaration.DECLARATIONS[declaration.CURRENT]


def _post(client, key, content=GOOD_CSV, name="d.csv"):
    return client.post("/api/intake/uploads", files={"file": (name, content)}, data=DECL,
                       headers={"Authorization": f"Bearer {key}"})


def test_same_accepted_file_again_is_a_duplicate_and_not_stored(env):
    client, store, _ = env
    key = approve(store, client.post("/api/intake/requests", json=FORM).json()["id"])
    first = _post(client, key).json()
    again = _post(client, key, name="renamed.csv")
    assert again.status_code == 200
    assert again.json()["status"] == "duplicate"
    assert again.json()["duplicate_of"] == first["id"]
    assert len(store.list_uploads()) == 1


def test_rejected_file_sent_again_is_checked_again(env):
    """Only accepted copies are duplicates: a provider resending a broken file
    must get the errors again, not a silent 'already have it'."""
    client, store, _ = env
    key = approve(store, client.post("/api/intake/requests", json=FORM).json()["id"])
    bad = b"obdobi,uzemi,hodnota\n2026,CZ,1\n"
    assert _post(client, key, bad).status_code == 422
    assert _post(client, key, bad).status_code == 422
    assert len(store.list_uploads()) == 2


def test_daily_limit_per_key(env, monkeypatch):
    client, store, _ = env
    monkeypatch.setattr(settings, "intake_uploads_per_day", 2)
    key = approve(store, client.post("/api/intake/requests", json=FORM).json()["id"])
    codes = [_post(client, key, GOOD_CSV + f"2026-W4{i},CZ,x,{i}\n".encode()).status_code for i in range(3)]
    assert codes == [200, 200, 429]


def test_machine_upload_docs_name_the_current_declaration():
    """The machine-upload page tells scripts which declaration key to send;
    it must change together with declaration.CURRENT."""
    from pathlib import Path

    page = (Path(__file__).resolve().parents[3] / "frontend/content/cs/about/prispet.md").read_text()
    assert f"declaration={declaration.CURRENT}" in page
    assert " ".join(declaration.DECLARATIONS[declaration.CURRENT].split()) in " ".join(
        line.lstrip("> ") for line in page.splitlines()
    )


def test_purge_removes_only_old_rejected_requests(env):
    """The privacy notice promises deletion of rejected requests within 12 months."""
    from datetime import datetime, timedelta, timezone

    client, store, _ = env
    ids = [client.post("/api/intake/requests", json=FORM).json()["id"] for _ in range(3)]
    store.decide_request(ids[0], "rejected", "test")
    store.decide_request(ids[1], "rejected", "test")
    approve(store, ids[2])
    old = store.requests[ids[0]]
    store.requests[ids[0]] = old.__class__(**{**old.__dict__, "decided_at": old.decided_at - timedelta(days=400)})

    removed = store.purge_rejected_requests(datetime.now(timezone.utc) - timedelta(days=365))
    assert removed == 1
    assert store.get_request(ids[0]) is None
    assert store.get_request(ids[1]).status == "rejected"
    assert store.get_request(ids[2]).status == "approved"


# ── Several files and archives (bundle.py) ─────────────────────────────────
import io
import tarfile
import zipfile

SECOND_CSV = b"obdobi;uzemi;ukazatel;hodnota\n2026-W41;CZ064;pozitivni_vzorky;3,5\n"


def _zip(members: dict[str, bytes]) -> bytes:
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
        for name, data in members.items():
            zf.writestr(name, data)
    return buf.getvalue()


def _export_dir(root, upload):
    return root / "export" / "zkusebni-ustav" / upload.received_at.strftime("%Y-%m-%d") / upload.id


def test_zip_with_two_csvs_is_one_upload_with_two_files(env):
    client, store, root = env
    key = approve(store, client.post("/api/intake/requests", json=FORM).json()["id"])
    z = _zip({"data/kraje.csv": GOOD_CSV, "data/Okresy 2026.csv": SECOND_CSV,
              "__MACOSX/data/._kraje.csv": b"junk", "data/": b""})
    r = _post(client, key, z, "export.zip")
    assert r.status_code == 200, r.json()
    rep = r.json()["report"]
    assert rep["rows"] == 2 and [f["name"] for f in rep["files"]] == ["data/kraje.csv", "data/Okresy 2026.csv"]
    u = store.list_uploads()[0]
    out = _export_dir(root, u)
    assert sorted(p.name for p in out.iterdir()) == ["Okresy_2026.csv", "kraje.csv", "manifest.json"]
    # Normalised: comma-separated, decimal dot.
    assert "3.5" in (out / "Okresy_2026.csv").read_text()
    # The record keeps the archive itself.
    assert (root / u.provider_id / u.id / "original" / "1-export.zip").read_bytes() == z


def test_several_file_fields_are_one_upload(env):
    client, store, root = env
    key = approve(store, client.post("/api/intake/requests", json=FORM).json()["id"])
    r = client.post("/api/intake/uploads", data=DECL, headers={"Authorization": f"Bearer {key}"},
                    files=[("file", ("a.csv", GOOD_CSV)), ("file", ("a.csv", SECOND_CSV))])
    assert r.status_code == 200, r.json()
    out = _export_dir(root, store.list_uploads()[0])
    # Same name twice: the second one is renamed, not overwritten.
    assert sorted(p.name for p in out.iterdir()) == ["a-2.csv", "a.csv", "manifest.json"]


def test_tar_gz_is_accepted(env):
    client, store, _ = env
    key = approve(store, client.post("/api/intake/requests", json=FORM).json()["id"])
    buf = io.BytesIO()
    with tarfile.open(fileobj=buf, mode="w:gz") as tf:
        info = tarfile.TarInfo("kraje.csv"); info.size = len(GOOD_CSV)
        tf.addfile(info, io.BytesIO(GOOD_CSV))
    assert _post(client, key, buf.getvalue(), "export.tar.gz").status_code == 200


def test_one_bad_csv_rejects_the_whole_upload(env):
    client, store, root = env
    key = approve(store, client.post("/api/intake/requests", json=FORM).json()["id"])
    r = _post(client, key, _zip({"ok.csv": GOOD_CSV, "bad.csv": b"obdobi,uzemi,hodnota\n2026,CZ,1\n"}), "x.zip")
    assert r.status_code == 422
    assert all(i["file"] == "bad.csv" for i in r.json()["report"]["issues"])
    assert not (root / "export").exists()


@pytest.mark.parametrize("members,message", [
    ({"a.csv": GOOD_CSV, "readme.txt": b"hi"}, "není CSV"),
    ({}, "žádné CSV"),
])
def test_archive_content_problems_are_reported(env, members, message):
    client, store, _ = env
    key = approve(store, client.post("/api/intake/requests", json=FORM).json()["id"])
    r = _post(client, key, _zip(members), "x.zip")
    assert r.status_code == 422
    assert message in r.json()["report"]["issues"][0]["message"]


def test_tar_symlink_is_refused(env):
    client, store, _ = env
    key = approve(store, client.post("/api/intake/requests", json=FORM).json()["id"])
    buf = io.BytesIO()
    with tarfile.open(fileobj=buf, mode="w") as tf:
        link = tarfile.TarInfo("evil.csv"); link.type = tarfile.SYMTYPE; link.linkname = "/etc/passwd"
        tf.addfile(link)
    r = _post(client, key, buf.getvalue(), "x.tar")
    assert r.status_code == 422 and "není obyčejný soubor" in r.json()["report"]["issues"][0]["message"]


def test_zip_bomb_is_refused_from_its_header():
    """A member declaring more than the limit is refused before decompression."""
    from app.intake import bundle

    z = _zip({"big.csv": b"0" * (bundle.MAX_BYTES + 10)})
    with pytest.raises(bundle.BundleError, match="větší než"):
        bundle.unpack([("big.zip", z)])


def test_corrupt_archive_is_a_clear_error():
    from app.intake import bundle

    with pytest.raises(bundle.BundleError, match="nepodařilo otevřít"):
        bundle.unpack([("x.zip", b"PK\x03\x04 not really a zip")])


def test_forwarded_header_is_believed_from_a_configured_proxy(env, monkeypatch):
    from starlette.requests import Request

    monkeypatch.setattr(settings, "intake_trusted_proxies", ["172.16.0.0/12"])
    req = Request({"type": "http", "client": ("172.18.0.1", 1234),
                   "headers": [(b"x-forwarded-for", b"203.0.113.7")]})
    assert api.client_ip(req) == "203.0.113.7"
    req = Request({"type": "http", "client": ("198.51.100.1", 1234),
                   "headers": [(b"x-forwarded-for", b"203.0.113.7")]})
    assert api.client_ip(req) == "198.51.100.1"
