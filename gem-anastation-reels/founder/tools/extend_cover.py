"""Extend the 4:5 cover to 9:16 for Stories without touching the photo.

The cover is kept whole and bottom-aligned (its lower edge crops the arms, so
nothing can be added below). Above it, the plain studio wall is continued:
per-column tone from the top rows of the photo, a gentle continuation of its
vertical falloff, and grain matched to the wall's own noise. A soft blend over
the top rows of the photo hides the seam. Purely tonal, no generative fill.

Usage: python3 tools/extend_cover.py  -> build/cover_story.png (1080x1920)
"""
from pathlib import Path

import cv2
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
W, H = 1080, 1920

src = cv2.imread(str(ROOT / "sources" / "cover.jpg")).astype(np.float32)
sh = src.shape[0]
ext = H - sh                                   # rows to add above
BAND, BLEND = 60, 40

# Wall tone per column from the top band, smoothed so no detail is copied.
top = src[:BAND].mean(0)
top = cv2.GaussianBlur(top[None], (0, 0), sigmaX=40)[0]
# Vertical trend of the wall in the top 250 rows (it brightens upwards).
rows = src[:250].mean((1, 2))
slope = np.polyfit(np.arange(250), rows, 1)[0]          # level per row
grain = float((src[:BAND] - cv2.GaussianBlur(src[:BAND], (0, 0), 3)).std())

y = np.arange(ext, dtype=np.float32)[:, None, None]
dist = ext - y                                          # rows above the photo
# Continue the falloff, easing it out so the top does not blow out.
lift = -slope * 120 * (1 - np.exp(-dist / 120))
wall = top[None] + lift
rng = np.random.default_rng(3)
noise = rng.standard_normal((ext, W, 1)).astype(np.float32)
noise = cv2.GaussianBlur(noise, (0, 0), 0.6)[..., None] if noise.ndim == 2 else noise
wall = wall + noise * grain * 0.9

out = np.zeros((H, W, 3), np.float32)
out[:ext] = wall
out[ext:] = src
# Seam: blend the first rows of the photo with the wall continuation.
for i in range(BLEND):
    a = (i + 1) / (BLEND + 1)
    a = a * a * (3 - 2 * a)
    out[ext + i] = src[i] * a + (top + rng.standard_normal((W, 1)) * grain * 0.9) * (1 - a)

cv2.imwrite(str(ROOT / "build" / "cover_story.png"), np.clip(out, 0, 255).round().astype(np.uint8))
print(f"cover_story.png: photo bottom-aligned at y={ext}, wall slope {slope:.3f}/row, grain {grain:.2f}")
