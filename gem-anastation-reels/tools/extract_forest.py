"""Separate the original forest layout (slide 01) into a clean forest plate and
transparent layers of the ORIGINAL rendered typography and logo.

Nothing is re-typeset or regenerated: every gold pixel in the output layers
comes from the supplied layout. The forest behind the text is restored with
classical, non-generative methods (real forest texture copied from a
neighbouring area of the same photograph, seam-feathered).

Usage: python3 tools/extract_forest.py [project_dir]
"""
import sys
from pathlib import Path

import cv2
import numpy as np
from scipy import ndimage

ROOT = Path(sys.argv[1] if len(sys.argv) > 1 else Path(__file__).resolve().parents[1])
SRC = ROOT / "sources" / "01_created_by_nature.jpg"
OUT = ROOT / "build" / "layers"
OUT.mkdir(parents=True, exist_ok=True)

img = cv2.cvtColor(cv2.imread(str(SRC)), cv2.COLOR_BGR2RGB).astype(np.float32)
H, W, _ = img.shape
R, G, B = img[..., 0], img[..., 1], img[..., 2]
LUMA = np.array([0.3, 0.55, 0.15], np.float32)

# Elements of the layout (x0, y0, x1, y1) in source pixels, padded.
ELEMENTS = {
    "created_by_nature": (400, 100, 680, 130),
    "logo_ga":           (410, 455, 670, 625),
    "wordmark":          (370, 638, 712, 666),
    "descriptor":        (396, 668, 690, 690),
    "url":               (370, 1222, 690, 1252),
}

# "Goldness": champagne gold has R ~= G with a lower B; the forest is green
# (R << G) and the eucalyptus trunks are neutral grey (R ~= B).
gold = np.minimum(R - 0.75 * G, R - B)
taken = np.zeros((H, W), bool)
for x0, y0, x1, y1 in ELEMENTS.values():
    taken[y0 - 16:y1 + 16, x0 - 16:x1 + 16] = True


def patch_fill(plate, box):
    """Fill a box with real forest texture copied from a neighbour offset,
    chosen by the best boundary match, with a feathered seam."""
    pad = 14
    x0, y0, x1, y1 = box[0] - pad, box[1] - pad, box[2] + pad, box[3] + pad
    w, h = x1 - x0, y1 - y0
    ring = np.zeros((h, w), bool)
    ring[:6], ring[-6:], ring[:, :6], ring[:, -6:] = True, True, True, True
    target = img[y0:y1, x0:x1]
    best = None
    for dx in range(-420, 421, 6):
        for dy in range(-120, 121, 4):
            sx, sy = x0 + dx, y0 + dy
            if sx < 0 or sy < 0 or sx + w > W or sy + h > H:
                continue
            if taken[sy:sy + h, sx:sx + w].any():
                continue
            err = np.mean((img[sy:sy + h, sx:sx + w][ring] - target[ring]) ** 2)
            if best is None or err < best[0]:
                best = (err, sx, sy)
    _, sx, sy = best
    inner = np.zeros((h, w), bool)
    inner[pad:-pad, pad:-pad] = True
    feather = np.clip(1 - ndimage.distance_transform_edt(~inner) / pad, 0, 1)
    feather = (feather * feather * (3 - 2 * feather)).astype(np.float32)[..., None]
    plate[y0:y1, x0:x1] = img[sy:sy + h, sx:sx + w] * feather + plate[y0:y1, x0:x1] * (1 - feather)
    return sx, sy


# --- Clean forest plate (moving background) ------------------------------
clean = img.copy()
for name, box in ELEMENTS.items():
    print(f"{name}: forest texture copied from {patch_fill(clean, box)}")

fg = np.zeros_like(img)
alpha = np.zeros((H, W), np.float32)

# --- Logo ---------------------------------------------------------------
# Thick strokes: background from the patched plate; foreground colour per
# pixel = nearest solid gold pixel (keeps the designed bronze-to-champagne
# gradient untouched).
x0, y0, x1, y1 = ELEMENTS["logo_ga"]
sl = (slice(y0, y1), slice(x0, x1))
m = gold[sl] > 6
solid = gold[sl] > 28
_, (iy, ix) = ndimage.distance_transform_edt(~solid, return_indices=True)
f = img[sl][iy, ix]
d = f - clean[sl]
a = np.clip(np.sum((img[sl] - clean[sl]) * d, -1) / np.maximum(np.sum(d * d, -1), 1), 0, 1)
a[~ndimage.binary_dilation(m, iterations=2)] = 0
a = np.clip((a - 0.08) / 0.92, 0, 1)
a[solid] = 1
fg[sl], alpha[sl] = f, a

# --- Thin typography (1-3 px strokes) -----------------------------------
# The local background under each stroke is recovered with a grey-scale
# morphological opening: it removes bright features thinner than the kernel
# and keeps the surrounding forest. Alpha is the luminance lift over it.
# JPEG chroma subsampling has tinted these hairline strokes green, so their
# colour is taken from the logo's own mid champagne gold.
s = fg[ELEMENTS["logo_ga"][1]:ELEMENTS["logo_ga"][3], ELEMENTS["logo_ga"][0]:ELEMENTS["logo_ga"][2]]
s = s[alpha[ELEMENTS["logo_ga"][1]:ELEMENTS["logo_ga"][3], ELEMENTS["logo_ga"][0]:ELEMENTS["logo_ga"][2]] == 1]
sl_l = s @ LUMA
CHAMPAGNE = s[(sl_l > np.percentile(sl_l, 45)) & (sl_l < np.percentile(sl_l, 55))].mean(0)
print("champagne gold from logo:", CHAMPAGNE.round().astype(int).tolist())
for name in ("created_by_nature", "wordmark", "descriptor", "url"):
    x0, y0, x1, y1 = ELEMENTS[name]
    sl = (slice(y0, y1), slice(x0, x1))
    P = img[sl]
    Bg = np.stack([ndimage.grey_opening(P[..., c], size=(7, 7)) for c in range(3)], -1)
    L, Lb = P @ LUMA, Bg @ LUMA
    # Champagne hue, at the element's own designed brightness (the
    # descriptor is set dimmer than the wordmark).
    peak = min(float(np.percentile(L, 99.6)), float(CHAMPAGNE @ LUMA))
    col = CHAMPAGNE * peak / float(CHAMPAGNE @ LUMA)
    a = np.clip((L - Lb) / np.maximum(peak - Lb, 20), 0, 1)
    a = np.clip((a - 0.10) / 0.90, 0, 1)
    # Drop isolated specks of lit foliage: keep only pixels near real strokes.
    a[~ndimage.binary_dilation(a > 0.3, iterations=2)] = 0
    fg[sl], alpha[sl] = col, a

cv2.imwrite(str(OUT / "forest_clean.png"), cv2.cvtColor(clean.clip(0, 255).astype(np.uint8), cv2.COLOR_RGB2BGR))
for name, (x0, y0, x1, y1) in ELEMENTS.items():
    rgba = np.zeros((y1 - y0, x1 - x0, 4), np.uint8)
    rgba[..., :3] = fg[y0:y1, x0:x1].clip(0, 255).astype(np.uint8)
    rgba[..., 3] = (alpha[y0:y1, x0:x1] * 255).round().astype(np.uint8)
    cv2.imwrite(str(OUT / f"s1_{name}.png"), cv2.cvtColor(rgba, cv2.COLOR_RGBA2BGRA))
    (OUT / f"s1_{name}.txt").write_text(f"{x0} {y0}\n")
