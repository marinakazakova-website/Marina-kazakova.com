"""Cut out pearls (white on white, or on a grey studio sweep with a
reflection): a pearl is a sphere, so its outline is a circle. The circle is
found from the strongest edge ring (Hough), refined, and used as the mask
with a 1.5 px feathered edge; the pearl itself is untouched.
Usage: python3 tools/cutout_round.py raw.jpg out.png
"""
import sys

import cv2
import numpy as np

src, dst = sys.argv[1], sys.argv[2]
img = cv2.imread(src)
h, w = img.shape[:2]
g = cv2.GaussianBlur(cv2.cvtColor(img, cv2.COLOR_BGR2GRAY), (0, 0), 2)
circles = cv2.HoughCircles(g, cv2.HOUGH_GRADIENT, dp=1, minDist=w, param1=40, param2=20,
                           minRadius=int(w * 0.18), maxRadius=int(w * 0.48))
cx, cy, r = circles[0][0]
# refine: radius where the radial gradient is strongest
ang = np.linspace(0, 2 * np.pi, 360, endpoint=False)
best = None
for dr in np.arange(-6, 6.5, 0.5):
    rr = r + dr
    xs = (cx + rr * np.cos(ang)).astype(int).clip(0, w - 1)
    ys = (cy + rr * np.sin(ang)).astype(int).clip(0, h - 1)
    xo = (cx + (rr + 3) * np.cos(ang)).astype(int).clip(0, w - 1)
    yo = (cy + (rr + 3) * np.sin(ang)).astype(int).clip(0, h - 1)
    xi = (cx + (rr - 3) * np.cos(ang)).astype(int).clip(0, w - 1)
    yi = (cy + (rr - 3) * np.sin(ang)).astype(int).clip(0, h - 1)
    score = np.abs(g[yo, xo].astype(float) - g[yi, xi].astype(float)).mean()
    if best is None or score > best[0]:
        best = (score, rr)
r = best[1] - 1.0          # stay just inside the edge
yy, xx = np.mgrid[0:h, 0:w]
d = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2)
a = np.clip((r - d) / 1.5 + 0.5, 0, 1)
side = int(2 * r * 1.08)
out = np.zeros((side, side, 4), np.float32)
sx, sy = int(cx - side / 2), int(cy - side / 2)
for c in range(3):
    pad = cv2.copyMakeBorder(img[..., c], side, side, side, side, cv2.BORDER_REPLICATE)
    out[..., c] = pad[sy + side:sy + 2 * side, sx + side:sx + 2 * side]
pa = cv2.copyMakeBorder(a.astype(np.float32), side, side, side, side, cv2.BORDER_CONSTANT, value=0)
out[..., 3] = pa[sy + side:sy + 2 * side, sx + side:sx + 2 * side] * 255
out = cv2.resize(out, (1000, 1000), interpolation=cv2.INTER_LANCZOS4)
cv2.imwrite(dst, np.clip(out, 0, 255).astype(np.uint8))
print(dst, f"circle c=({cx:.0f},{cy:.0f}) r={r:.1f}")
