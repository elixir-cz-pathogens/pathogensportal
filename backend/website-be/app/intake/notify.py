"""Telling the approver that something arrived (TODO D15).

E-mail over SMTP when INTAKE_SMTP_HOST is set; otherwise the message goes to
the log, which is what local runs and tests use. It is logged as a WARNING on
purpose: under uvicorn an INFO from this logger is printed nowhere, so a server
with no mail settings would take requests that nobody ever hears about.

A failed send is logged and swallowed: the request is already stored, and an
applicant must not see an error for a problem in OUR mail setup.

The recipient (INTAKE_NOTIFY_TO) is configuration, not code — the repository is
public, and an approver's address does not belong in it.
"""

from __future__ import annotations

import logging
import smtplib
from email.message import EmailMessage

from ..config import settings

log = logging.getLogger("intake")


def send(subject: str, body: str) -> None:
    recipients = settings.intake_notify_to
    if not settings.intake_smtp_host or not recipients:
        log.warning("intake notification NOT e-mailed (no SMTP configured): %s\n%s", subject, body)
        return
    msg = EmailMessage()
    msg["Subject"] = f"[Pathogen Portal CZ] {subject}"
    msg["From"] = settings.intake_smtp_from
    msg["To"] = ", ".join(recipients)
    msg.set_content(body)
    try:
        with smtplib.SMTP(settings.intake_smtp_host, settings.intake_smtp_port, timeout=10) as smtp:
            if settings.intake_smtp_starttls:
                smtp.starttls()
            if settings.intake_smtp_user:
                smtp.login(settings.intake_smtp_user, settings.intake_smtp_password)
            smtp.send_message(msg)
    except (OSError, smtplib.SMTPException):
        log.exception("intake notification could not be sent: %s", subject)
