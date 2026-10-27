"""Stone cut-outs for GEMS IN EVERY COLOR: removes the studio background
(white or light grey), its soft cast shadow and any watermark beside the
stone. The stone = the largest connected region of saturated / darker
pixels, holes filled, edge feathered. The stone itself is never retouched.
Input sources/raw_<colour>_<stone>.jpg -> sources/<colour>_<stone>.png
(tight crop, 3 % padding, longest side 800 px).

Usage: python3 tools/cutout.py
"""
from pathlib import Path

import cv2
import numpy as np
from scipy import ndimage

SRC = Path(__file__).resolve().parents[1] / "sources"
# Per-photo settings. DARK: value below which a pixel counts as stone even
# when unsaturated (default: 90 below the background) — lowered where a grey
# shadow line sits under the stone.
DARK = {"raw_red_ruby": 100, "raw_red_red_beryl": 100}
BROWN_SHADOW = {"raw_red_red_beryl"}
for raw in sorted(SRC.glob("raw_*.jpg")):
    img = cv2.imread(str(raw)).astype(np.float32)
    hsv = cv2.cvtColor(img.astype(np.uint8), cv2.COLOR_BGR2HSV).astype(np.float32)
    bg = np.median(np.concatenate([img[:8].reshape(-1, 3), img[-8:].reshape(-1, 3)]), 0)
    # far enough from the background colour: drops the pale light that a
    # transparent stone (peridot) throws onto the white below it
    dist = np.linalg.norm(img - bg, axis=2)
    dark = hsv[..., 2] < DARK.get(raw.stem, bg.mean() - 90)
    m = ((hsv[..., 1] > 50) & (dist > 125)) | dark
    if raw.stem in BROWN_SHADOW:      # stone on fabric: its warm contact shadow (hue 6-30) is not stone
        m &= ~((hsv[..., 0] >= 6) & (hsv[..., 0] <= 30))
    m = ndimage.binary_closing(m, iterations=4)
    lab, n = ndimage.label(m)
    keep = 1 + int(np.argmax(ndimage.sum(m, lab, range(1, n + 1))))
    m = ndimage.binary_fill_holes(lab == keep)
    m = ndimage.binary_opening(m, iterations=2)
    m = ndimage.binary_erosion(m, iterations=1)          # drop the light fringe
    a = cv2.GaussianBlur(m.astype(np.float32), (0, 0), 1.0)
    ys, xs = np.nonzero(m)
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    pad = int(max(y1 - y0, x1 - x0) * 0.03)
    h, w = m.shape
    y0, y1, x0, x1 = max(y0 - pad, 0), min(y1 + pad, h), max(x0 - pad, 0), min(x1 + pad, w)
    rgba = np.dstack([img[y0:y1, x0:x1], a[y0:y1, x0:x1] * 255])
    s = 800 / max(rgba.shape[:2])
    rgba = cv2.resize(rgba, None, fx=s, fy=s, interpolation=cv2.INTER_AREA if s < 1 else cv2.INTER_LANCZOS4)
    name = raw.stem.replace("raw_", "")
    cv2.imwrite(str(SRC / f"{name}.png"), np.clip(rgba, 0, 255).astype(np.uint8))
    print(name, "stone", x1 - x0, "x", y1 - y0, "px")
