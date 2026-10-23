"""Provider upload keys (TODO D15).

A key is shown to the approver ONCE, when it is issued, and only its SHA-256 is
stored. A plain hash is enough here, unlike for passwords: the key is 32 random
bytes, so there is nothing to brute-force and no need for a slow hash or salt.

The short prefix is stored in clear so a key can be recognised in logs and in the
CLI ("pp_k7Qx…") without storing the key itself.
"""

from __future__ import annotations

import hashlib
import secrets

PREFIX = "pp_"


def generate() -> str:
    return PREFIX + secrets.token_urlsafe(32)


def digest(key: str) -> str:
    return hashlib.sha256(key.encode("utf-8")).hexdigest()


def display_prefix(key: str) -> str:
    return key[: len(PREFIX) + 6]


def looks_valid(key: str) -> bool:
    return key.startswith(PREFIX) and 30 <= len(key) <= 100
