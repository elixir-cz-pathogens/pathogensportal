"""Administration of data intake, run on the server (TODO D15).

    python -m app.intake.cli requests [--status pending]
    python -m app.intake.cli approve <request_id> --slug <dir-name> [--single-use|--repeated] [--by <who>]
    python -m app.intake.cli issue --slug <dir-name> --name "<person>" --email <e-mail> --institution "<inst>"
                             [--description "<data>"] [--single-use] [--by <who>]
    python -m app.intake.cli link <provider_id>
    python -m app.intake.cli reject  <request_id> --note "<why>" [--by <who>]
    python -m app.intake.cli providers
    python -m app.intake.cli revoke  <provider_id>
    python -m app.intake.cli uploads [--provider <provider_id>]
    python -m app.intake.cli purge [--days 365]

`purge` deletes rejected requests decided more than --days ago. The privacy
notice (frontend/data/privacy.yaml) promises deletion within 12 months, so it
must run on a schedule — a promise kept by hand is a promise broken.

`issue` is `approve` without the web form, for a provider we already deal with
in person: it records the request on their behalf (so every provider still has
one, with who issued it and when) and approves it in the same step.

`--slug` names the provider's directory in the hand-over tree (files.py), e.g.
`svu-praha-omb`. Choose it once per institution and reuse it for a replacement
key, so the data keep landing in the same place.

`approve` and `issue` do NOT print a key. They print a one-time LINK (valid
INTAKE_CLAIM_HOURS, 72 by default) to send to the provider; the key is created
when the provider opens it and presses the button, and is shown only to them
(api.claim). `link <provider_id>` prints a fresh link for a provider who has not
claimed the key yet (an expired link). A provider who lost the key gets a new
one by `revoke` + `issue` with the same --slug.

`--single-use` (or a request whose frequency is "jednorázově") issues a one-off
key: it stops working after the first accepted upload.

Only the key's hash is stored, so a lost key cannot be shown again. The link
may go by e-mail: it works once, so if someone else used it first the provider
sees "already used" and we are notified — unlike a key, whose interception
nobody would ever notice.

Uses the PostgreSQL store; with INTAKE_STORE=memory there is nothing to
administer from a separate process.
"""

from __future__ import annotations

import argparse
import re
from datetime import datetime, timedelta, timezone
import getpass
import sys

from ..config import settings
from . import keys
from .store import PostgresStore


def _whoami() -> str:
    """The default for --by. In the server's container the service user has no
    passwd entry and getpass raises; the server wrapper passes --by explicitly."""
    try:
        return getpass.getuser()
    except (KeyError, OSError):
        return "unknown"


_SLUG = re.compile(r"^[a-z0-9][a-z0-9-]{1,39}$")


def _slug(value: str) -> str:
    if not _SLUG.match(value):
        raise argparse.ArgumentTypeError("2–40 znaků: malá písmena bez diakritiky, číslice a pomlčka, např. svu-praha-omb")
    return value


def _print_link(store, provider_id: str) -> None:
    token = keys.generate_claim()
    expires = datetime.now(timezone.utc) + timedelta(hours=settings.intake_claim_hours)
    store.add_claim(provider_id, keys.digest(token), expires)
    print(f"Odkaz pro převzetí klíče (jednorázový, platí do {expires:%Y-%m-%d %H:%M} UTC):")
    print(keys.claim_url(settings.intake_public_url, token))


def _issue_key(store, r, slug: str, by: str, single_use: bool) -> int:
    for other in store.list_providers():
        if other.active and other.slug == slug and other.institution != r.institution:
            print(f"Pozor: adresář {slug} už používá {other.institution} ({other.id}).", file=sys.stderr)
    provider = store.add_provider(r, None, "", slug, single_use)
    store.decide_request(r.id, "approved", by)
    print(f"Schváleno. Poskytovatel {provider.id} ({r.institution}), adresář {slug}/, "
          f"klíč {'JEDNORÁZOVÝ (zanikne po prvním přijatém nahrání)' if single_use else 'opakovaný'}.")
    _print_link(store, provider.id)
    print("Pošlete odkaz poskytovateli na jeho e-mail. Klíč se vytvoří a zobrazí až jemu, po kliknutí.")
    return 0


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(prog="python -m app.intake.cli")
    sub = p.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("requests"); s.add_argument("--status")
    s = sub.add_parser("approve"); s.add_argument("request_id"); s.add_argument("--slug", type=_slug, required=True)
    s.add_argument("--single-use", action="store_true", default=None,
                   help="jednorázový klíč; výchozí podle frekvence v žádosti")
    s.add_argument("--repeated", dest="single_use", action="store_false", help="opakovaný klíč")
    s.add_argument("--by", default=_whoami())
    s = sub.add_parser("link"); s.add_argument("provider_id")
    s = sub.add_parser("issue"); s.add_argument("--slug", type=_slug, required=True)
    s.add_argument("--name", required=True); s.add_argument("--email", required=True)
    s.add_argument("--institution", required=True); s.add_argument("--position", default="")
    s.add_argument("--description", default="(vydáno ručně, bez formuláře)")
    s.add_argument("--single-use", action="store_true", help="jednorázový klíč")
    s.add_argument("--by", default=_whoami())
    s = sub.add_parser("reject"); s.add_argument("request_id"); s.add_argument("--note", required=True)
    s.add_argument("--by", default=_whoami())
    sub.add_parser("providers")
    s = sub.add_parser("revoke"); s.add_argument("provider_id")
    s = sub.add_parser("uploads"); s.add_argument("--provider")
    s = sub.add_parser("purge"); s.add_argument("--days", type=int, default=365)
    args = p.parse_args(argv)

    store = PostgresStore()
    store.ensure_schema()

    if args.cmd == "requests":
        for r in store.list_requests(args.status):
            print(f"{r.id}  {r.created_at:%Y-%m-%d %H:%M}  {r.status:8}  {r.institution} — {r.name} <{r.email}>")
    elif args.cmd == "approve":
        r = store.get_request(args.request_id)
        if r is None:
            print("Žádost neexistuje.", file=sys.stderr); return 1
        if r.status != "pending":
            print(f"Žádost už je ve stavu {r.status}.", file=sys.stderr); return 1
        single = args.single_use if args.single_use is not None else r.frequency.strip().lower() == "jednorázově"
        return _issue_key(store, r, args.slug, args.by, single)
    elif args.cmd == "link":
        pr = store.get_provider(args.provider_id)
        if pr is None or not pr.active:
            print("Poskytovatel neexistuje nebo je zneplatněný.", file=sys.stderr); return 1
        if pr.claimed:
            print("Klíč už je převzatý. Ztracený klíč: revoke + issue se stejným --slug.", file=sys.stderr); return 1
        _print_link(store, pr.id)
    elif args.cmd == "issue":
        r = store.add_request({
            "name": args.name, "email": args.email, "institution": args.institution,
            "position": args.position, "description": args.description,
            "origin": f"vydáno ručně ({args.by})", "frequency": "jednorázově" if args.single_use else "-",
            "link": "",
        })
        return _issue_key(store, r, args.slug, args.by, args.single_use)
    elif args.cmd == "reject":
        r = store.get_request(args.request_id)
        if r is None:
            print("Žádost neexistuje.", file=sys.stderr); return 1
        store.decide_request(r.id, "rejected", args.by, args.note)
        print("Zamítnuto.")
    elif args.cmd == "providers":
        for pr in store.list_providers():
            if not pr.active:
                state = f"zneplatněn {pr.revoked_at:%Y-%m-%d}"
            else:
                state = ("aktivní" if pr.claimed else "čeká na převzetí") + (", 1×" if pr.single_use else "")
            print(f"{pr.id}  {(pr.key_prefix or '-'):10}…  {state:26}  {pr.slug or '-':20}  {pr.institution} — {pr.name} <{pr.email}>")
    elif args.cmd == "revoke":
        store.revoke_provider(args.provider_id)
        print("Klíč zneplatněn.")
    elif args.cmd == "uploads":
        for u in store.list_uploads(args.provider):
            print(f"{u.id}  {u.received_at:%Y-%m-%d %H:%M}  {u.status:8}  {u.rows:6} ř.  {u.declaration or '-':14}  {u.filename}  {u.path}")
    elif args.cmd == "purge":
        cutoff = datetime.now(timezone.utc) - timedelta(days=args.days)
        print(f"Smazáno zamítnutých žádostí: {store.purge_rejected_requests(cutoff)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
