"""Post of 19 Oct 2026 — CREATED BY NATURE / CURATED BY EXPERT.

Brings the supplied post to the house rule and builds the 9:16 Stories
version. The type is the client's own rendered type, lifted off the photo
(never re-typeset); the photo behind it is restored with a grey-scale
morphological opening is used to measure each stroke's coverage; under the
captions the photo is restored by vertical interpolation (keeps the soft
vertical edges of hands and background), under the website line with real velvet
copied from just above it.

Post (1080x1350): website line already on the rule (text top y = 1228,
x 383-694) and stays; the two captions move to the 96 px side margins.
Stories (1080x1920): photo centred (285 px added above and below), the
soft background continued upwards by a smooth vertical stretch of its own
top band, the velvet continued downwards by reflecting its own texture,
captions moved with the photo, website line at text top y = 1744.

Usage: python3 relayout.py
"""
from pathlib import Path

import cv2
import numpy as np
from scipy import ndimage

HERE = Path(__file__).resolve().parent
OUT = HERE / "output"
OUT.mkdir(exist_ok=True)

MARGIN = 96
STORY_H, ADD_TOP, ADD_BOTTOM = 1920, 285, 285
URL_TEXT_TOP_STORY = 1744

img = cv2.cvtColor(cv2.imread(str(HERE / "sources" / "layout_post.jpg")), cv2.COLOR_BGR2RGB).astype(np.float32)
H, W, _ = img.shape
LUMA = np.array([0.3, 0.55, 0.15], np.float32)

# Type boxes in the supplied post (padded).
BOXES = {
    "nature": (70, 646, 352, 678),
    "expert": (706, 646, 986, 678),
    "url":    (372, 1220, 706, 1248),
}

white = img[650:672, 80:340].reshape(-1, 3)
COL = white[np.argsort(white @ LUMA)[-40:]].mean(0)          # the captions' white

clean = img.copy()
layers = {}
for name, (x0, y0, x1, y1) in BOXES.items():
    P = img[y0:y1, x0:x1]
    Bg = np.stack([ndimage.grey_opening(P[..., c], size=(7, 7)) for c in range(3)], -1)
    L, Lb = P @ LUMA, Bg @ LUMA
    a = np.clip((L - Lb) / np.maximum(float(COL @ LUMA) - Lb, 25), 0, 1)
    a = np.clip((a - 0.06) / 0.94, 0, 1)
    a[~ndimage.binary_dilation(a > 0.25, iterations=2)] = 0
    hole = ndimage.binary_dilation(a > 0.02, iterations=4)
    if name == "url":
        # On the even velvet: the same velvet copied from just above the line
        # (rows 1176-1204, clean), so the texture is real, not smoothed.
        fill = img[y0 - 44:y1 - 44, x0:x1]
        # The velvet lightens towards the hands: match the patch's tone,
        # row by row, to the clean velvet beside the line.
        def rows_tone(y_a, y_b):
            side = np.concatenate([img[y_a:y_b, x0 - 40:x0], img[y_a:y_b, x1:x1 + 40]], 1)
            return cv2.GaussianBlur(side.mean(1), (1, 0), sigmaX=0.1, sigmaY=4)[:, None]
        fill = fill + (rows_tone(y0, y1) - rows_tone(y0 - 44, y1 - 44))
    else:
        # Captions cross soft vertical edges (background/finger), so each
        # column is interpolated between the clean rows above and below the
        # line: vertical edges stay exactly where they are.
        t = np.linspace(0, 1, y1 - y0, dtype=np.float32)[:, None, None]
        fill = P[:2].mean(0) * (1 - t) + P[-2:].mean(0) * t
    if name == "url":                  # wider, softer seam on the velvet
        hole = ndimage.binary_dilation(hole, iterations=3)
    m = cv2.GaussianBlur(hole.astype(np.float32), (0, 0), 2.5 if name == "url" else 1.0)[..., None]
    m = np.clip(m * 1.15, 0, 1)
    clean[y0:y1, x0:x1] = fill * m + P * (1 - m)
    cols = np.nonzero((a > 0.2).any(0))[0]
    layers[name] = {"a": a, "x0": x0, "y0": y0, "tx0": x0 + cols.min(), "tx1": x0 + cols.max()}
    print(f"{name}: text x {x0 + cols.min()}-{x0 + cols.max()}")

# Grain over the interpolated caption strips so they match the photo's surface.
rng = np.random.default_rng(7)
grain = float((img[1000:1100, 100:300] - cv2.GaussianBlur(img[1000:1100, 100:300], (0, 0), 2)).std())
for name in ("nature", "expert"):      # the velvet copy already has real grain
    x0, y0, x1, y1 = BOXES[name]
    clean[y0:y1, x0:x1] += rng.standard_normal((y1 - y0, x1 - x0, 1)) * grain * 0.6


def draw(canvas, name, x_text0, y_shift):
    """Composite a lifted type layer so its text starts at x_text0."""
    L = layers[name]
    a = L["a"][..., None]
    x = L["x0"] + (x_text0 - L["tx0"])
    y = L["y0"] + y_shift
    h, w = L["a"].shape
    canvas[y:y + h, x:x + w] = canvas[y:y + h, x:x + w] * (1 - a) + COL * a


def save(arr, name):
    out = np.clip(arr, 0, 255).round().astype(np.uint8)
    cv2.imwrite(str(OUT / f"{name}.png"), cv2.cvtColor(out, cv2.COLOR_RGB2BGR))
    cv2.imwrite(str(OUT / f"{name}.jpg"), cv2.cvtColor(out, cv2.COLOR_RGB2BGR), [cv2.IMWRITE_JPEG_QUALITY, 95])


# Captions on the side margins: left starts at 96, right ends at W - 96.
def captions(canvas, y_shift):
    draw(canvas, "nature", MARGIN, y_shift)
    e = layers["expert"]
    draw(canvas, "expert", (W - MARGIN) - (e["tx1"] - e["tx0"]), y_shift)


# --- Post -----------------------------------------------------------------
post = clean.copy()
captions(post, 0)
draw(post, "url", layers["url"]["tx0"], 0)          # unchanged: already on the rule
save(post, "GA_post_2026-10-19")

# --- Stories --------------------------------------------------------------
story = np.zeros((STORY_H, W, 3), np.float32)
story[ADD_TOP:ADD_TOP + H] = clean

# Top: smooth vertical stretch of the photo's own soft top band, continuous
# at the seam (slope 1), then softened further and re-grained.
S = 160
n = ADD_TOP + S
p = n / S
y = np.arange(n, dtype=np.float32)
src_y = S * (y / n) ** p
top = cv2.remap(clean[:S], np.tile(np.arange(W, dtype=np.float32), (n, 1)),
                np.repeat(src_y[:, None], W, 1), cv2.INTER_LINEAR)
blur = cv2.GaussianBlur(top, (0, 0), 6)
w = np.clip(1 - y / n, 0, 1)[:, None, None] ** 0.8
top = blur * w + top * (1 - w)
top += rng.standard_normal((n, W, 1)) * grain * w * 0.8
story[:n] = top

# Bottom: the velvet reflected (ping-pong over its last clean 190 rows, the
# fingertip above is never reached), with a slight darkening into the frame
# edge like the photo's own vignette.
band = clean[H - 190:H]
k = np.arange(ADD_BOTTOM)
refl = band[np.where((k // 190) % 2 == 0, 189 - (k % 190), k % 190)]
fade = (1 - 0.18 * (k / ADD_BOTTOM) ** 1.5)[:, None, None]
story[ADD_TOP + H:] = refl * fade

captions(story, ADD_TOP)
draw(story, "url", layers["url"]["tx0"], URL_TEXT_TOP_STORY - 1228)
save(story, "GA_story_2026-10-19")
print("written to", OUT)
