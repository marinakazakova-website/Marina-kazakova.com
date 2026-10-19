"""Transparent 1080x1920 layer with the ORIGINAL GA monogram, GEM ANASTATION
wordmark and NATURE • GEMSTONE • IDENTITY descriptor (the same extracted
layers as the approved reel and Stories, never redrawn), at their approved
9:16 positions shifted by LOGO_SHIFT. Placed over the brand gradient in HTML.

Usage: python3 tools/logo_layer.py [shift_px]   -> build/logo_group.png
"""
import sys
from pathlib import Path

import cv2
import numpy as np

HERE = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(HERE.parent / "tools"))
from render import LAYOUT_S1, load_rgba   # noqa: E402

SHIFT = int(sys.argv[1]) if len(sys.argv) > 1 else -60
W, H = 1080, 1920
rgb = np.zeros((H, W, 3), np.float32)
alpha = np.zeros((H, W), np.float32)
for name in ("logo_ga", "wordmark", "descriptor"):
    x, y = LAYOUT_S1[name]
    col, a = load_rgba(f"s1_{name}")
    h, w = a.shape
    y += SHIFT
    # "over" compositing of straight-alpha layers
    A = alpha[y:y + h, x:x + w]
    out_a = a + A * (1 - a)
    rgb[y:y + h, x:x + w] = (col * a[..., None] + rgb[y:y + h, x:x + w] * (A * (1 - a))[..., None]) \
        / np.maximum(out_a, 1e-6)[..., None]
    alpha[y:y + h, x:x + w] = out_a
rgba = np.dstack([rgb, alpha])
out = (np.clip(rgba, 0, 1) * 255 + 0.5).astype(np.uint8)
(HERE / "build").mkdir(exist_ok=True)
cv2.imwrite(str(HERE / "build" / "logo_group.png"), cv2.cvtColor(out, cv2.COLOR_RGBA2BGRA))
print(f"logo_group.png: logo top y = {LAYOUT_S1['logo_ga'][1] + SHIFT}")
