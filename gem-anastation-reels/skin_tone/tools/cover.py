"""GEMSTONE & SKIN TONE — cover (1080×1350). Full-bleed portrait of Anastasia,
global grade only (a little muted, glossy editorial contrast — nothing
retouched or added), three AvantGarde captions on one line in the green above
her head (same type as the ONE COLOR / MANY GEMS cover: 20.5 px, tracking
3.8 px, outer captions on x 81 / 972, middle one with equal gaps), website line
ivory by the house rule (text top 1228).
Usage: python3 tools/cover.py"""
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
FONT = ImageFont.truetype(str(ROOT.parent / "founder" / "fonts" / "URWGothic-Book.otf"), 20.5)
TRACK, CAP_TOP = 3.8, 170
IVORY = np.array([243, 238, 229.])
CAPS = [("SKIN TONE", "left", 81), ("GEMSTONE COLOR", "center", None), ("PERSONAL HARMONY", "right", 972)]
CROP_TOP = 0                       # px of the source above the 4:5 window (head well below the captions)


def ink(text, weight=1):
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


im = cv2.cvtColor(cv2.imread(str(ROOT / "sources" / "portrait_tropical.jpg")), cv2.COLOR_BGR2RGB)
s = 1080 / im.shape[1]
src_h = round(1350 / s)
im = im[CROP_TOP:CROP_TOP + src_h]
im = cv2.resize(im, (1080, 1350), interpolation=cv2.INTER_AREA).astype(np.float32) / 255

# Grade: saturation down 12 %, a gentle S-curve for an editorial gloss with the
# highlights held back, then a soft shade at the top for the captions.
lab = cv2.cvtColor(im, cv2.COLOR_RGB2LAB)
lab[..., 1:] *= 0.88
L = lab[..., 0] / 100
L = L + 0.10 * np.sin(2 * np.pi * (L - 0.5)) / (2 * np.pi) * 2       # mild S-curve
L = np.where(L > 0.8, 0.8 + (L - 0.8) * 0.75, L)                       # soft shoulder
lab[..., 0] = np.clip(L, 0, 1) * 100
im = np.clip(cv2.cvtColor(lab, cv2.COLOR_LAB2RGB), 0, 1)
yy = np.arange(1350, dtype=np.float32)[:, None, None]
im *= 1 - 0.30 * np.exp(-((yy - 180) / 170) ** 2)                    # shade behind the caption line
out = im * 255

inks = [ink(t) for t, _, _ in CAPS]
ws = [a.shape[1] for a in inks]
gap = ((CAPS[2][2] - CAPS[0][2] + 1) - sum(ws)) / 2
for (text, align, edge), a in zip(CAPS, inks):
    h, w = a.shape
    x0 = {"left": edge, "right": edge - w + 1 if edge else 0, "center": round(CAPS[0][2] + ws[0] + gap)}[align]
    reg = out[CAP_TOP:CAP_TOP + h, x0:x0 + w]
    out[CAP_TOP:CAP_TOP + h, x0:x0 + w] = reg * (1 - a[..., None]) + IVORY * a[..., None]
    print(f"{text}: x {x0}-{x0 + w - 1}, band lum {reg.mean() / 255:.2f}")

alpha = cv2.imread(str(ROOT.parent / "founder" / "build" / "url_on_light.png"), cv2.IMREAD_UNCHANGED)[..., 3].astype(np.float32) / 255
a = alpha[..., None]
out[1223:1246, 375:726] = out[1223:1246, 375:726] * (1 - a) + IVORY * a
print("url band lum", round(float(out[1205:1255, 360:720].mean() / 255), 2))
Image.fromarray(out.clip(0, 255).round().astype(np.uint8)).save(ROOT / "output" / "GA_SkinTone_cover.png")
print("written output/GA_SkinTone_cover.png")
