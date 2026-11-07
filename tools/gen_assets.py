#!/usr/bin/env python3
"""Generate assets/favicon.svg and assets/og-image.png.

Run once, or again whenever the name or role changes:

    python3 tools/gen_assets.py

Needs Pillow. Tries to use Archivo (the site's display face) and falls back
to a system grotesque if the font cannot be fetched.
"""

from __future__ import annotations

import io
import pathlib
import sys
import urllib.request

from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
ASSETS = ROOT / "assets"
CACHE = ROOT / ".fontcache"

PAPER = (237, 239, 236)
INK = (21, 25, 26)
MUTED = (94, 106, 101)
JADE = (14, 107, 85)

NAME = "Sergio Romero Sanchez"
LINE1 = "Solutions Architect"
LINE2 = "Site Reliability Engineer"
FOOT = "rsergio.com"

ARCHIVO = {
    "bold": "https://github.com/Omnibus-Type/Archivo/raw/master/fonts/ttf/Archivo-Bold.ttf",
    "semibold": "https://github.com/Omnibus-Type/Archivo/raw/master/fonts/ttf/Archivo-SemiBold.ttf",
}

SYSTEM_FALLBACKS = [
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    "/System/Library/Fonts/Helvetica.ttc",
    "/System/Library/Fonts/SFNS.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
]


def load_font(weight: str, size: int) -> ImageFont.FreeTypeFont:
    CACHE.mkdir(exist_ok=True)
    cached = CACHE / f"Archivo-{weight}.ttf"
    if not cached.exists():
        try:
            with urllib.request.urlopen(ARCHIVO[weight], timeout=20) as r:
                cached.write_bytes(r.read())
        except Exception as err:  # noqa: BLE001
            print(f"  archivo {weight}: {err} — using system font", file=sys.stderr)
    if cached.exists():
        try:
            return ImageFont.truetype(str(cached), size)
        except Exception:  # noqa: BLE001
            pass
    for path in SYSTEM_FALLBACKS:
        if pathlib.Path(path).exists():
            try:
                return ImageFont.truetype(path, size)
            except Exception:  # noqa: BLE001
                continue
    return ImageFont.load_default()


def favicon() -> None:
    svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="SR">
  <rect width="64" height="64" rx="10" fill="#0e6b55"/>
  <path d="M32 13v38" stroke="#edefec" stroke-opacity=".28" stroke-width="2"/>
  <text x="32" y="42.5" text-anchor="middle"
        font-family="Archivo, Helvetica Neue, Helvetica, Arial, sans-serif"
        font-size="26" font-weight="800" letter-spacing="-0.5" fill="#edefec">SR</text>
</svg>
"""
    (ASSETS / "favicon.svg").write_text(svg, encoding="utf-8")
    print("  assets/favicon.svg")


def og_image() -> None:
    W, H = 1200, 630
    img = Image.new("RGB", (W, H), PAPER)
    d = ImageDraw.Draw(img)

    # Left jade bar: the one piece of colour, matching the site's rail.
    d.rectangle([0, 0, 14, H], fill=JADE)

    # Fine baseline grid, barely there.
    for y in range(0, H, 42):
        d.line([(14, y), (W, y)], fill=(227, 230, 226), width=1)

    pad_x = 84
    f_name = load_font("semibold", 30)
    f_display = load_font("bold", 86)
    f_foot = load_font("semibold", 26)

    d.text((pad_x, 96), NAME, font=f_name, fill=MUTED)

    y = 170
    for line in (LINE1, LINE2):
        d.text((pad_x, y), line, font=f_display, fill=INK)
        y += 104

    rule_y = y + 36
    d.line([(pad_x, rule_y), (pad_x + 132, rule_y)], fill=JADE, width=4)

    d.text((pad_x, rule_y + 36), FOOT, font=f_foot, fill=MUTED)

    buf = io.BytesIO()
    img.save(buf, format="PNG", optimize=True)
    (ASSETS / "og-image.png").write_bytes(buf.getvalue())
    print(f"  assets/og-image.png  {len(buf.getvalue())} bytes  {W}x{H}")


def main() -> int:
    ASSETS.mkdir(exist_ok=True)
    favicon()
    og_image()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
