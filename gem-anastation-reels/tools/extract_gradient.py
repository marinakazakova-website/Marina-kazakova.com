"""Separate the four gradient layouts (slides 02-05) into one clean gradient
plate and transparent layers of the ORIGINAL typography, one per text line.

The four layouts share a pixel-identical background, so the clean plate is
assembled from real pixels: each pixel is taken from a slide that has no
text at that spot. Only the website line is common to all four; under it the
gradient is interpolated vertically (it is smooth there).

Writes build/layers/gradient_clean.png, s<N>_line<K>.png and lines.json.
Usage: python3 tools/extract_gradient.py [project_dir]
"""
import json
import sys
from pathlib import Path

import cv2
import numpy as np
from scipy import ndimage

ROOT = Path(sys.argv[1] if len(sys.argv) > 1 else Path(__file__).resolve().parents[1])
OUT = ROOT / "build" / "layers"
OUT.mkdir(parents=True, exist_ok=True)
SLIDES = {
    2: "02_gem_anastation.jpg",
    3: "03_our_mission.jpg",
    4: "04_our_approach.jpg",
    5: "05_philosophy.jpg",
}
LUMA = np.array([0.3, 0.55, 0.15], np.float32)
URL_ROWS = (1216, 1252)

imgs = {k: cv2.cvtColor(cv2.imread(str(ROOT / "sources" / f)), cv2.COLOR_BGR2RGB).astype(np.float32)
        for k, f in SLIDES.items()}
H, W, _ = imgs[2].shape


def text_mask(a):
    R, B = a[..., 0], a[..., 2]
    return (R - B > 22) & (R > 70)


def line_groups(m, gap=4):
    rows = np.nonzero(m.sum(1) > 0)[0]
    groups, s, p = [], rows[0], rows[0]
    for y in rows[1:]:
        if y > p + gap:
            groups.append((s, p))
            s = y
        p = y
    groups.append((s, p))
    return groups


# --- clean plate from real pixels ----------------------------------------
# Each pixel is averaged over the slides that carry no type there (type is
# detected as any lift over the four-slide median, then dilated to cover JPEG
# ringing). Where two slides overlap with type, the darkest value is used:
# gold type only ever lightens the dark gradient.
stack = np.stack([imgs[k] for k in SLIDES])
med = np.median(stack, 0)
has = np.stack([ndimage.binary_dilation(((x - med) @ LUMA) > 2, iterations=5) for x in stack])
free = (~has).astype(np.float32)[..., None]
n = free.sum(0)
darkest = np.take_along_axis(stack, (stack @ LUMA).argmin(0)[None, ..., None], 0)[0]
clean = np.where(n > 0, (stack * free).sum(0) / np.maximum(n, 1), darkest)

y0, y1 = URL_ROWS
# Average a few rows on each side so JPEG noise is not smeared into streaks.
top = cv2.GaussianBlur(clean[y0 - 8:y0].mean(0)[None], (0, 0), 6)[0]
bot = cv2.GaussianBlur(clean[y1:y1 + 8].mean(0)[None], (0, 0), 6)[0]
for y in range(y0, y1):
    f = (y - (y0 - 1)) / (y1 - (y0 - 1))
    clean[y] = top * (1 - f) + bot * f
cv2.imwrite(str(OUT / "gradient_clean.png"), cv2.cvtColor(clean.round().clip(0, 255).astype(np.uint8), cv2.COLOR_RGB2BGR))

# --- per-line typography layers -----------------------------------------
manifest = {}
for k, a in imgs.items():
    m = text_mask(a)
    L = a @ LUMA
    gold = a[m & (L >= np.percentile(L[m], 90))].mean(0)
    d = gold - clean
    alpha = np.clip(np.sum((a - clean) * d, -1) / np.maximum(np.sum(d * d, -1), 1), 0, 1)
    # Keep everything that is lifted off the plate, including faint glyphs
    # such as the em dash, but nothing that is not near real type.
    lift = ((a - clean) @ LUMA) > 3
    near = ndimage.binary_dilation(m, iterations=40)
    alpha[~(ndimage.binary_dilation(lift, iterations=1) & near)] = 0
    alpha = np.clip((alpha - 0.04) / 0.96, 0, 1)

    # Each text pixel belongs to exactly one line (the nearest by row), so
    # descenders never leak into the next line's layer.
    groups = line_groups(m)
    centers = np.array([(s + e) / 2 for s, e in groups])
    owner = np.abs(np.arange(H)[:, None] - centers[None]).argmin(1)

    lines = []
    for i, (s, e) in enumerate(groups):
        cols = np.nonzero(((alpha > 0.03) & (owner == i)[:, None]).sum(0))[0]
        x0, x1 = max(cols.min() - 6, 0), min(cols.max() + 7, W)
        ys, ye = max(s - 5, 0), min(e + 6, H)
        name = "url" if s >= URL_ROWS[0] else f"s{k}_line{i}"
        rgba = np.zeros((ye - ys, x1 - x0, 4), np.uint8)
        rgba[..., :3] = gold.round().astype(np.uint8)
        own = (owner[ys:ye] == i)[:, None]
        rgba[..., 3] = (alpha[ys:ye, x0:x1] * own * 255).round().astype(np.uint8)
        if name == "url":
            if k == 2:
                cv2.imwrite(str(OUT / "s2_url.png"), cv2.cvtColor(rgba, cv2.COLOR_RGBA2BGRA))
                manifest["url"] = {"x": int(x0), "y": int(ys), "w": int(x1 - x0), "h": int(ye - ys)}
            continue
        cv2.imwrite(str(OUT / f"{name}.png"), cv2.cvtColor(rgba, cv2.COLOR_RGBA2BGRA))
        lines.append({"name": name, "x": int(x0), "y": int(ys), "w": int(x1 - x0), "h": int(ye - ys)})
    manifest[f"s{k}"] = {"gold": gold.round().astype(int).tolist(), "lines": lines}

    comp = clean * (1 - alpha[..., None]) + gold * alpha[..., None]
    print(f"slide {k}: {len(lines)} lines, gold {manifest[f's{k}']['gold']}, "
          f"recomposite error {np.abs(comp - a).mean():.2f}")

(OUT / "lines.json").write_text(json.dumps(manifest, indent=1))
