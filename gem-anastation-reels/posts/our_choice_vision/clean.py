"""Remove the two side captions of the supplied emerald layout (they belong to
another post): each column is interpolated between the clean rows above and
below the caption line, filled with real silk texture copied from just above
and tone-matched. The emerald, the silk and the website line are untouched.
Usage: python3 clean.py -> build/base.png
"""
import cv2
import numpy as np

img = cv2.cvtColor(cv2.imread("sources/emerald_layout.webp"), cv2.COLOR_BGR2RGB).astype(np.float32)
y0, y1 = 644, 680
src = img.copy()
for x0, x1 in ((56, 366), (694, 1000)):
    h = y1 - y0
    # real silk texture from the same columns just above, tone-matched row by
    # row to the edges of the gap, with a feathered seam
    patch = src[y0 - h - 6:y1 - h - 6, x0:x1].copy()
    t = np.linspace(0, 1, h, dtype=np.float32)[:, None, None]
    want = src[y0 - 3:y0, x0:x1].mean(0) * (1 - t) + src[y1:y1 + 3, x0:x1].mean(0) * t
    have = cv2.GaussianBlur(patch, (0, 0), 6)
    patch = patch - have + want
    m = np.ones((h, x1 - x0), np.float32)
    m[:, :24] = np.linspace(0, 1, 24); m[:, -24:] = np.linspace(1, 0, 24)
    m[:5] *= np.linspace(0.3, 1, 5)[:, None]; m[-5:] *= np.linspace(1, 0.3, 5)[:, None]
    img[y0:y1, x0:x1] = patch * m[..., None] + src[y0:y1, x0:x1] * (1 - m[..., None])
cv2.imwrite("build/base.png", cv2.cvtColor(img.clip(0, 255).astype(np.uint8), cv2.COLOR_RGB2BGR))
print("written build/base.png")
