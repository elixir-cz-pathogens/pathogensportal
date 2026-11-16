#!/usr/bin/env python3
"""Make dark-mode variants of the logos in frontend/static/images/.

Logos are drawn for a white page. On the dark theme (css/pp-dark.css) each one
is swapped for a variant written to frontend/static/images/dark/<same name>:

1. White background → transparent. Only the white that touches the image edge
   (flood fill), so white shapes INSIDE a logo survive. Edge pixels blended
   with that white are un-blended (colour-to-alpha), so no light halo.
2. Black and grey lettering → light (black → #f2f1ee, mid grey → ~#bebdb8).
3. Brand colours stay, except ones too dark to read on the dark page: their
   lightness is raised just until they reach 3:1 contrast on PAGE_BG.

SVGs get steps 2 and 3 on their fill/stroke colours (they have no background).

Usage:  python tools/make_dark_logos.py IMG.png SIB.png CESNET.svg ...
        (names relative to frontend/static/images/). Needs Pillow.
Re-run it when a logo is added or replaced, and look at the result: it is a
mechanical recolouring, not the organisation's own negative logo. Prefer an
official dark/negative variant when the organisation publishes one.
"""
import colorsys
import re
import sys
from collections import deque
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent / "frontend" / "static" / "images"
OUT = ROOT / "dark"
PAGE_BG = (0x14, 0x14, 0x13)  # --pp-dk-bg in pp-dark.css
MIN_CONTRAST = 3.0


def _lin(c):
    c /= 255
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def luminance(rgb):
    r, g, b = (_lin(c) for c in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast(a, b):
    la, lb = sorted((luminance(a), luminance(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)


def is_neutral(rgb):
    return max(rgb) - min(rgb) < 30


def relight(rgb):
    """Map one opaque colour to its dark-theme counterpart."""
    if is_neutral(rgb):
        v = sum(rgb) / 3
        if v > 150:          # light greys and white: leave (they were already light)
            return rgb
        n = round(242 - min(v, 140) * (242 - 170) / 140)
        return (n, n - 1, max(n - 4, 0))
    if contrast(rgb, PAGE_BG) >= MIN_CONTRAST:
        return rgb
    h, l, s = colorsys.rgb_to_hls(*(c / 255 for c in rgb))
    while l < 0.95:
        l += 0.01
        out = tuple(round(c * 255) for c in colorsys.hls_to_rgb(h, l, s))
        if contrast(out, PAGE_BG) >= MIN_CONTRAST:
            return out
    return out


def strip_white_background(im, tol=24):
    """Flood-fill the near-white region connected to the edge and make it
    transparent; un-blend the pixels on its border."""
    w, h = im.size
    px = im.load()
    near_white = lambda p: p[3] > 0 and min(p[:3]) >= 255 - tol
    bg = bytearray(w * h)
    q = deque()
    for x in range(w):
        q.extend(((x, 0), (x, h - 1)))
    for y in range(h):
        q.extend(((0, y), (w - 1, y)))
    while q:
        x, y = q.popleft()
        i = y * w + x
        if bg[i]:
            continue
        p = px[x, y]
        if not (p[3] == 0 or near_white(p)):
            continue
        bg[i] = 1
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h and not bg[ny * w + nx]:
                q.append((nx, ny))
    # White enclosed by lettering (the counters of o, B, P, R …) is background
    # too — left white it fills the letters once they are re-lit. White
    # enclosed by a COLOURED shape (a cross on a red square) is part of the logo.
    seen = bytearray(bg)
    for sy in range(h):
        for sx in range(w):
            if seen[sy * w + sx] or not near_white(px[sx, sy]):
                continue
            comp, border = [], []
            q = deque([(sx, sy)])
            seen[sy * w + sx] = 1
            while q:
                x, y = q.popleft()
                comp.append(y * w + x)
                for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                    if not (0 <= nx < w and 0 <= ny < h):
                        continue
                    j = ny * w + nx
                    if seen[j]:
                        continue
                    p = px[nx, ny]
                    if near_white(p):
                        seen[j] = 1
                        q.append((nx, ny))
                    else:
                        border.append(p)
            solid = [p for p in border if p[3] > 200]
            if solid and sum(is_neutral(p[:3]) for p in solid) / len(solid) > 0.8:
                for i in comp:
                    bg[i] = 1
    for y in range(h):
        for x in range(w):
            i = y * w + x
            r, g, b, a = px[x, y]
            if bg[i]:
                px[x, y] = (0, 0, 0, 0)
                continue
            # anti-aliased border pixel: neighbour of the background
            if any(0 <= x + dx < w and 0 <= y + dy < h and bg[(y + dy) * w + x + dx]
                   for dx in (-1, 0, 1) for dy in (-1, 0, 1)):
                # colour-to-alpha against white
                alpha = max((255 - c) / 255 for c in (r, g, b))
                if alpha <= 0:
                    px[x, y] = (0, 0, 0, 0)
                    continue
                fg = tuple(round(255 - (255 - c) / alpha) for c in (r, g, b))
                px[x, y] = (*fg, round(a * alpha))


def do_png(src, dst):
    im = Image.open(src).convert("RGBA")
    strip_white_background(im)
    px = im.load()
    cache = {}
    for y in range(im.size[1]):
        for x in range(im.size[0]):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            key = (r, g, b)
            if key not in cache:
                cache[key] = relight(key)
            px[x, y] = (*cache[key], a)
    im.save(dst, optimize=True)


def do_svg(src, dst):
    text = src.read_text(encoding="utf-8")

    def sub(m):
        hexv = m.group(2)
        if len(hexv) == 3:
            hexv = "".join(c * 2 for c in hexv)
        rgb = tuple(int(hexv[i:i + 2], 16) for i in (0, 2, 4))
        return m.group(1) + "#%02x%02x%02x" % relight(rgb)

    text = re.sub(r'((?:fill|stroke)\s*[:=]\s*"?)#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b', sub, text)
    dst.write_text(text, encoding="utf-8")


def main(names):
    OUT.mkdir(exist_ok=True)
    for name in names:
        src, dst = ROOT / name, OUT / name
        (do_svg if src.suffix == ".svg" else do_png)(src, dst)
        print(f"{name} -> {dst.relative_to(ROOT.parent.parent.parent)}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    main(sys.argv[1:])
