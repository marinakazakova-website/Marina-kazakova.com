"""Remove the white studio background (and the soft cast shadow) from the
gem photos: the stone is the connected region of coloured / darker pixels
around the centre, holes filled, edge feathered. No retouching of the stone.
Output: sources/gem_<country>_<stone>.png, square, stone centred, 1000 px.

Usage: python3 tools/cutout_gems.py
"""
from pathlib import Path

import cv2
import numpy as np
from scipy import ndimage

SRC = Path(__file__).resolve().parents[1] / "sources"
for raw in sorted(SRC.glob("raw_*.jpg")):
    img = cv2.imread(str(raw)).astype(np.float32)
    hsv = cv2.cvtColor(img.astype(np.uint8), cv2.COLOR_BGR2HSV).astype(np.float32)
    sat, val = hsv[..., 1], hsv[..., 2]
    # stone = saturated or clearly darker than the white field; the grey
    # shadow is low-saturation and light, so it falls out
    m = (sat > 45) | (val < 150)
    m = ndimage.binary_closing(m, iterations=4)
    lab, n = ndimage.label(m)
    h, w = m.shape
    sizes = ndimage.sum(m, lab, range(1, n + 1))
    keep = 1 + int(np.argmax(sizes))
    m = ndimage.binary_fill_holes(lab == keep)
    m = ndimage.binary_opening(m, iterations=2)
    a = cv2.GaussianBlur(m.astype(np.float32), (0, 0), 1.2)
    ys, xs = np.nonzero(m)
    y0, y1, x0, x1 = ys.min(), ys.max(), xs.min(), xs.max()
    side = int(max(y1 - y0, x1 - x0) * 1.08)
    cy, cx = (y0 + y1) // 2, (x0 + x1) // 2
    rgba = np.zeros((side, side, 4), np.float32)
    sy, sx = cy - side // 2, cx - side // 2
    ys0, xs0 = max(sy, 0), max(sx, 0)
    ys1, xs1 = min(sy + side, h), min(sx + side, w)
    rgba[ys0 - sy:ys1 - sy, xs0 - sx:xs1 - sx, :3] = img[ys0:ys1, xs0:xs1]
    rgba[ys0 - sy:ys1 - sy, xs0 - sx:xs1 - sx, 3] = a[ys0:ys1, xs0:xs1] * 255
    out = cv2.resize(rgba, (1000, 1000), interpolation=cv2.INTER_LANCZOS4)
    name = raw.stem.replace("raw_", "gem_")
    cv2.imwrite(str(SRC / f"{name}.png"), np.clip(out, 0, 255).astype(np.uint8))
    print(name, "stone bbox", x1 - x0, "x", y1 - y0)
