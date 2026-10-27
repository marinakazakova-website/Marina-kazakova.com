"""Edit of the supplied emerald layout: only the two centre captions change.
CREATED BY NATURE -> BASED IN BANGKOK (left edge kept at x = 81)
CURATED BY EXPERT -> CURATED FOR YOU  (right edge kept at x = 972)
Same face (URW Gothic = AvantGarde), 20.5 px, tracking 3.8 px, cap top y = 654,
and each caption's own colour — all measured from the original (calibrate.mjs
reproduces the original ink boxes to 1 px). Background under the old captions:
build/base.png (clean.py). Everything else is the original pixels.
Usage: python3 clean.py && python3 edit.py
"""
import numpy as np
import sys

from PIL import Image, ImageDraw, ImageFilter, ImageFont

FONT = ImageFont.truetype("../../founder/fonts/URWGothic-Book.otf", 20.5)
TRACK, CAP_TOP = 3.8, 654
WEIGHT = int(sys.argv[1]) if len(sys.argv) > 1 else 1
CAPS = [("BASED IN BANGKOK", "left", 81, (207, 213, 209)),
        ("CURATED FOR YOU", "right", 972, (203, 228, 215))]


def ink(text, weight=WEIGHT):
    """Antialiased coverage of tracked text, cropped to its ink box. Drawn at 4x
    and thickened by `weight` (4x px) so the stroke weight matches the
    original captions' measured ink (their rendering is slightly heavier)."""
    S = 4
    big = ImageFont.truetype(FONT.path, FONT.size * S)
    w = int(sum(FONT.getlength(c) + TRACK for c in text) * S) + 160
    m = Image.new("L", (w, 240), 0)
    d = ImageDraw.Draw(m)
    x = 40.0
    for c in text:
        d.text((x, 40), c, font=big, fill=255)
        x += (FONT.getlength(c) + TRACK) * S
    if weight:
        m = m.filter(ImageFilter.MaxFilter(2 * weight + 1))
    m = m.resize((m.width // S, m.height // S), Image.LANCZOS)
    a = np.asarray(m).astype(np.float32) / 255
    ys, xs = np.nonzero(a > 0.47)
    return a[ys.min():ys.max() + 1, xs.min():xs.max() + 1], ys.min()


if __name__ == "__main__":
    for old, w in (("CREATED BY NATURE", 258), ("CURATED BY EXPERT", 253)):
        print(f"check {old}: ink width {ink(old)[0].shape[1] - 1} (original {w})")
    orig = np.asarray(Image.open("sources/emerald_layout.webp").convert("RGB")).astype(np.float32)
    out = np.asarray(Image.open("build/base.png").convert("RGB")).astype(np.float32).copy()
    # keep the original everywhere except the two cleaned caption strips
    keep = np.ones(out.shape[:2], bool)
    keep[644:680, 56:366] = False
    keep[644:680, 694:1000] = False
    out[keep] = orig[keep]
    for text, align, x_edge, col in CAPS:
        a, _ = ink(text)
        h, w = a.shape
        x0 = x_edge if align == "left" else x_edge - w + 1
        reg = out[CAP_TOP:CAP_TOP + h, x0:x0 + w]
        out[CAP_TOP:CAP_TOP + h, x0:x0 + w] = reg * (1 - a[..., None]) + np.array(col) * a[..., None]
        print(f"{text}: x {x0}-{x0 + w - 1}, y {CAP_TOP}-{CAP_TOP + h - 1}")
    Image.fromarray(out.clip(0, 255).round().astype(np.uint8)).save("output/GA_OurChoiceVision.png")
    print("written output/GA_OurChoiceVision.png")
