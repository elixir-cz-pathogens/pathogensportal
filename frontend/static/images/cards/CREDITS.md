# Card image credits

Real photographs used on dashboard cards. All of these are **public domain** — works
of US federal agencies (CDC, NIH/NIAID) carry no licence conditions and require no
attribution. They are credited anyway: a portal that labels the provenance of its
data should not be careless about the provenance of its pictures.

| File | Subject | Author / source | Licence |
|---|---|---|---|
| `ebola.webp` | Ebola virus virion, TEM | CDC / Cynthia Goldsmith | Public domain |
| `flu.webp` | Influenza A virus, negative stain TEM | CDC / F. A. Murphy | Public domain |
| `covid.webp` | SARS-CoV-2 | NIH Image Gallery | Public domain |
| `hantavirus.webp` | Sin Nombre hantavirus, TEM | CDC / Cynthia Goldsmith | Public domain |
| `id-gastro.webp` | Salmonella | NIAID | Public domain |
| `id-hepatitis.webp` | Hepatitis B virus | CDC / Erskine Palmer | Public domain |
| `id-childhood.webp` | Measles virus | CDC / William Bellini | Public domain |
| `id-rare.webp` | Mpox (monkeypox) virus | CDC Public Health Image Library | Public domain |
| `id-sti.webp` | Chlamydia trachomatis, inclusion bodies | Marcus007 (Wikimedia Commons) | Public domain |
| `wastewater.webp` | Poliovirus, TEM | CDC / Fred Murphy | Public domain |

Sourced through Wikimedia Commons; each file's licence was read from the Commons API
rather than assumed. Cropped from the centre to 20:11 and resized to 800×440 — no
image was upscaled by more than 1.15×, because a stretched micrograph is mush.

⛔ These are NOT AI-generated and must stay out of `images/cards/ai/`. That directory
is what makes a card show the "AI" badge; a real CDC micrograph filed there would
carry a badge that lies about it.

Still on generated/abstract placeholders, because they depict no single pathogen:
`signals.svg`, `infectious-hub.svg`, `id-other.svg`, `id-skin.svg`, `id-vector.svg`,
`covid-demographics.svg`.

`phylo.svg` and `flu-regional.svg` are no longer referenced by anything. Each carried a
card about exactly one pathogen — the two Nextstrain phylogenies and the regional
influenza surveillance — and a card about one pathogen shows that pathogen. All three
now use the same photograph as the surveillance dashboard for the same pathogen.

⚠️ The consequence is three identical influenza pictures on /dashboards/: weekly
surveillance, regional surveillance and phylogeny. That is deliberate — the card is
identified by its title, and a reader should recognise the pathogen without reading.
Splitting them again needs three DIFFERENT influenza photographs, not a return to
abstract icons for two of them.
