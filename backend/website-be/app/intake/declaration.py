"""The provider's declaration ticked on every upload (TODO I34).

Decided 22 Oct 2026: until the full terms exist (TODO R24), a short declaration
of consent on the upload form is the legal basis for using a provider's data.

Every upload records WHICH version was ticked, and the text of that version is
copied into the upload's report.json — so years later the file itself says what
its provider agreed to, even after the wording here has changed.

⛔ Never edit the text of a published version. Add a new version and make it
CURRENT; old uploads keep pointing at the text they were accepted under.
The same text is shown on the upload page (shortcodes/intake-upload.html) — the
page sends CURRENT's key, and an upload with any other key is refused, so a
page and a backend that disagree fail loudly instead of recording a consent to
a text nobody saw.
"""

from __future__ import annotations

DECLARATIONS: dict[str, str] = {
    "prohlaseni-v1": (
        "Prohlašuji, že jsem oprávněn(a) tato data za svou instituci poskytnout, že neobsahují "
        "osobní údaje a že souhlasím s jejich zpracováním a zveřejněním na portálu Pathogen "
        "Portal CZ pod licencí Creative Commons Uveďte původ 4.0 (CC BY 4.0) s uvedením naší "
        "instituce jako zdroje. Beru na vědomí, že takto zveřejněná data může kdokoli dál "
        "používat, pokud uvede zdroj. O opravu nebo stažení dat můžeme kdykoli požádat."
    ),
}

# v1 gained the licence (CC BY 4.0, TODO R12) on 22 Oct 2026, before any
# upload existed anywhere — the one moment editing a version in place is safe.
CURRENT = "prohlaseni-v1"
