"""GEMS IN EVERY COLOR — cover (1080×1350), second cover type: full-bleed
photo, three small AvantGarde captions on the central horizontal (left / centre /
right, read as one line) (as the
approved emerald-on-fabric layout: cap top y 654, left caption from x 81,
right caption ending at x 972, 20.5 px, tracking 3.8 px), website line by the
cover rule (text top 1228, tinted to its own band of the photo).

The photo is only scaled, cropped and darkened (a global tone curve: deeper
greens, texture kept) so the ivory captions read. Nothing is painted in.
Usage: python3 tools/cover.py
"""
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
FONT = ImageFont.truetype(str(ROOT.parent / "founder" / "fonts" / "URWGothic-Book.otf"), 20.5)
TRACK, CAP_TOP = 3.8, 654
IVORY, NAVY = np.array([243, 238, 229.]), np.array([16, 37, 55.])
CAPS = [("ONE COLOR", "left", 81), ("MANY GEMS", "center", 540), ("CREATED BY NATURE", "right", 972)]
CHROMA = 1.2          # chroma gain after darkening
CROP_Y = 0.42          # where the 4:5 window sits in the taller photo (0 top, 1 bottom)


def ink(text, weight=1):
    """Tracked text coverage cropped to its ink box (same as the approved edit)."""
    S = 4
    big = ImageFont.truetype(FONT.path, FONT.size * S)
    w = int(sum(FONT.getlength(c) + TRACK for c in text) * S) + 160
    m = Image.new("L", (w, 240), 0)
    d = ImageDraw.Draw(m)
    x = 40.0
    for c in text:
        d.text((x, 40), c, font=big, fill=255)
        x += (FONT.getlength(c) + TRACK) * S
    m = m.filter(ImageFilter.MaxFilter(2 * weight + 1))
    m = m.resize((m.width // S, m.height // S), Image.LANCZOS)
    a = np.asarray(m).astype(np.float32) / 255
    ys, xs = np.nonzero(a > 0.47)
    return a[ys.min():ys.max() + 1, xs.min():xs.max() + 1]


im = cv2.cvtColor(cv2.imread(str(ROOT / "sources" / "cover_fluorite_macro.jpg")), cv2.COLOR_BGR2RGB).astype(np.float32)
s = 1080 / im.shape[1]
im = cv2.resize(im, (1080, round(im.shape[0] * s)), interpolation=cv2.INTER_LANCZOS4)
y0 = round((im.shape[0] - 1350) * CROP_Y)
im = im[y0:y0 + 1350] / 255

# Darken in Lab: lightness through a gamma curve (texture kept, highlights
# brought down), chroma raised so the green deepens instead of going grey,
# then a soft vignette toward the edges.
im = np.clip(im, 0, 1)
lab = cv2.cvtColor(im, cv2.COLOR_RGB2LAB)
L = lab[..., 0] / 100
lab[..., 0] = 100 * 0.62 * L ** 1.45
lab[..., 1:] *= CHROMA
im = np.clip(cv2.cvtColor(lab, cv2.COLOR_LAB2RGB), 0, 1)
yy, xx = np.mgrid[0:1350, 0:1080].astype(np.float32)
r = np.sqrt(((xx - 540) / 760) ** 2 + ((yy - 640) / 900) ** 2)
im *= (1 - 0.35 * np.clip(r, 0, 1) ** 2)[..., None]
# a soft, wide shade along the caption line (no visible edge)
im *= (1 - 0.28 * np.exp(-((yy - 665) / 150) ** 2))[..., None]
out = np.clip(im * 255, 0, 255)

# Outer captions on the edges; the middle one sits with equal gaps on both
# sides, so the three read as one line (a geometric centre would crowd the
# long right caption).
inks = [ink(t) for t, _, _ in CAPS]
ws = [a.shape[1] for a in inks]
gap = ((CAPS[2][2] - CAPS[0][2] + 1) - sum(ws)) / 2
for (text, align, edge), a in zip(CAPS, inks):
    h, w = a.shape
    x0 = {"left": edge, "right": edge - w + 1, "center": round(CAPS[0][2] + ws[0] + gap)}[align]
    reg = out[CAP_TOP:CAP_TOP + h, x0:x0 + w]
    out[CAP_TOP:CAP_TOP + h, x0:x0 + w] = reg * (1 - a[..., None]) + IVORY * a[..., None]
    print(f"{text}: x {x0}-{x0 + w - 1}, band lum {reg.mean() / 255:.2f}")

# website line: cover rule
alpha = cv2.imread(str(ROOT / "build" / "url_on_light.png"), cv2.IMREAD_UNCHANGED)[..., 3].astype(np.float32) / 255
band = out[1228 - 23:1228 + 27, 360:720].reshape(-1, 3).mean(0)
lum = band @ [0.2126, 0.7152, 0.0722] / 255
col = band + ((IVORY if lum < 0.5 else NAVY) - band) * 0.45
a = alpha[..., None] * 0.9
out[1223:1223 + 23, 375:375 + 351] = out[1223:1223 + 23, 375:375 + 351] * (1 - a) + col * a
print(f"url band lum {lum:.2f}, colour #{''.join(f'{int(c):02X}' for c in col.round())}")

(ROOT / "output").mkdir(exist_ok=True)
Image.fromarray(out.round().astype(np.uint8)).save(ROOT / "output" / "GA_GemsInEveryColor_cover.png")
print("written output/GA_GemsInEveryColor_cover.png")
