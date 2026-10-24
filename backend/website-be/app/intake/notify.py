"""Telling the approver that something arrived (TODO D15).

Every notification is logged. It is also e-mailed when there are recipients
(INTAKE_NOTIFY_TO) and a way to send: INTAKE_NOTIFY_SPOOL (the server — the
message is written as a file and the host's mailer sends it, so the container
needs no SMTP access) or INTAKE_SMTP_HOST (a direct SMTP server). It is logged as a WARNING on
purpose: under uvicorn an INFO from this logger is printed nowhere, so a server
with no mail settings would take requests that nobody ever hears about.

A failed send is logged and swallowed: the request is already stored, and an
applicant must not see an error for a problem in OUR mail setup.

The recipient (INTAKE_NOTIFY_TO) is configuration, not code — the repository is
public, and an approver's address does not belong in it.
"""

from __future__ import annotations

import logging
import os
import smtplib
import uuid
from email import policy
from email.message import EmailMessage
from email.utils import formatdate, make_msgid
from pathlib import Path

from ..config import settings

log = logging.getLogger("intake")

# Folding a long non-ASCII subject into several encoded words loses the space
# between them ("Zkušební ústav" arrives as "Zkušebníústav"): whitespace between
# encoded words is ignored on decoding. A line limit of 998 (the RFC maximum)
# keeps our subjects on one line.
_POLICY = policy.default.clone(max_line_length=998)


def send(subject: str, body: str) -> None:
    recipients = settings.intake_notify_to
    if not recipients or not (settings.intake_notify_spool or settings.intake_smtp_host):
        log.warning("intake notification NOT e-mailed (no mail configured): %s\n%s", subject, body)
        return
    log.warning("intake notification: %s\n%s", subject, body)
    msg = EmailMessage(policy=_POLICY)
    msg["Subject"] = f"[Pathogen Portal CZ] {subject}"
    msg["From"] = settings.intake_smtp_from
    msg["To"] = ", ".join(recipients)
    msg["Date"] = formatdate(localtime=False)
    msg["Message-ID"] = make_msgid(domain=settings.intake_smtp_from.rpartition("@")[2] or None)
    msg.set_content(body)
    if settings.intake_notify_spool:
        _spool(msg)
        return
    try:
        with smtplib.SMTP(settings.intake_smtp_host, settings.intake_smtp_port, timeout=10) as smtp:
            if settings.intake_smtp_starttls:
                smtp.starttls()
            if settings.intake_smtp_user:
                smtp.login(settings.intake_smtp_user, settings.intake_smtp_password)
            smtp.send_message(msg)
    except (OSError, smtplib.SMTPException):
        log.exception("intake notification could not be sent: %s", subject)


def _spool(msg: EmailMessage) -> None:
    """Write the message where the host's mailer picks it up. Written under a
    dot-name and renamed, so the mailer never sends half a message."""
    spool = Path(settings.intake_notify_spool)
    name = uuid.uuid4().hex
    try:
        tmp = spool / f".{name}.tmp"
        tmp.write_bytes(bytes(msg))
        os.rename(tmp, spool / f"{name}.eml")
    except OSError:
        log.exception("intake notification could not be spooled: %s", msg["Subject"])
