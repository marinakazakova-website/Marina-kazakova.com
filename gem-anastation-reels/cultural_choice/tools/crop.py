"""Fit each photo to 1080×1350 with the stone 20 % smaller than full-height
fit: the photo is scaled uniformly (never distorted, never edited) and placed
so the stone keeps its slide position (R/L/R/L/R). Where the smaller photo no
longer reaches the slide edge, the frame is continued with a mirrored copy of
the photo's own edge, softly blurred and darkened (a depth-of-field falloff),
blended over 70 px — the stone and its surroundings are original pixels.
Usage: python3 tools/crop.py"""
from pathlib import Path
import cv2
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
SHRINK = 0.80
# name: stone centre in the source (x, y) and its target position on the slide
STONES = {
    "01_jade":        ((984, 735), (700, 680)),
    "02_ruby":        ((678, 645), (330, 660)),
    "03_emerald":     ((724, 753), (700, 763)),
    "04_spessartine": ((518, 547), (420, 721)),
    "05_sapphire":    ((497, 256), (760, 733)),
}
PAD = 900
for name, ((sx, sy), (tx, ty)) in STONES.items():
    im = cv2.imread(str(ROOT / "sources" / f"{name}.jpg")).astype(np.float32)
    s = 1350 / im.shape[0] * SHRINK
    im = cv2.resize(im, (round(im.shape[1] * s), round(im.shape[0] * s)),
                    interpolation=cv2.INTER_LANCZOS4 if s > 1 else cv2.INTER_AREA)
    h, w = im.shape[:2]
    dx, dy = round(tx - sx * s), round(ty - sy * s)
    big = cv2.copyMakeBorder(im, PAD, PAD, PAD, PAD, cv2.BORDER_REFLECT)
    soft = cv2.GaussianBlur(big, (0, 0), 18) * 0.82
    # distance outside the photo rectangle -> blend weight of the soft fill
    yy, xx = np.mgrid[0:big.shape[0], 0:big.shape[1]]
    ox = np.maximum(np.maximum(PAD - xx, xx - (PAD + w - 1)), 0)
    oy = np.maximum(np.maximum(PAD - yy, yy - (PAD + h - 1)), 0)
    inside_edge = np.minimum(np.minimum(xx - PAD, PAD + w - 1 - xx), np.minimum(yy - PAD, PAD + h - 1 - yy))
    t = np.where((ox == 0) & (oy == 0), np.clip(1 - inside_edge / 70.0, 0, 1), 1.0)
    t = (t * t * (3 - 2 * t))[..., None]
    comp = big * (1 - t) + soft * t
    x0, y0 = PAD - dx, PAD - dy
    out = comp[y0:y0 + 1350, x0:x0 + 1080]
    assert out.shape[:2] == (1350, 1080), name
    cv2.imwrite(str(ROOT / "build" / f"{name}.jpg"), out.clip(0, 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 96])
    print(f"{name}: scale {s:.3f}, photo at ({dx},{dy}) size {w}x{h}")
