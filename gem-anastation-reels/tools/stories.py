"""Static Instagram Stories (1080x1920, 9:16) from the five original layouts.

Uses the same layers as the reel: the original logo and typography over the
clean forest / gradient plates, so nothing is re-typeset. Layout is shared
with the reel (render.py), which keeps all type inside the Stories safe zone
(clear of the profile bar at the top and the reply bar at the bottom).

Usage: python3 tools/stories.py   -> output/stories/GA_story_0N.png + .jpg
"""
import json
import sys
from pathlib import Path

import cv2
import numpy as np

sys.path.insert(0, str(Path(__file__).parent))
from render import (H, W, LAYERS, LAYOUT_GRAD, LAYOUT_S1, OUTDIR, URL_POS,  # noqa: E402
                    draw, load_rgba)

OUT = OUTDIR / "stories"


def plate(name):
    im = cv2.cvtColor(cv2.imread(str(LAYERS / name)), cv2.COLOR_BGR2RGB)
    return im.astype(np.float32) / 255.0


def forest():
    """Cover-fit the 4:5 forest into 9:16: uniform scale, centred crop."""
    p = plate("forest_clean.png")
    s = H / p.shape[0]
    p = cv2.resize(p, (round(p.shape[1] * s), H), interpolation=cv2.INTER_LANCZOS4)
    x = (p.shape[1] - W) // 2
    return np.ascontiguousarray(p[:, x:x + W])


def gradient():
    """The gradient carries no structure to distort, so it is fitted to the
    taller frame directly, keeping its dark corner and lower-right light."""
    return cv2.resize(plate("gradient_clean.png"), (W, H), interpolation=cv2.INTER_CUBIC)


def save(img, n):
    out = (np.clip(img, 0, 1) * 255 + 0.5).astype(np.uint8)
    bgr = cv2.cvtColor(out, cv2.COLOR_RGB2BGR)
    cv2.imwrite(str(OUT / f"GA_story_{n:02d}.png"), bgr)
    cv2.imwrite(str(OUT / f"GA_story_{n:02d}.jpg"), bgr, [cv2.IMWRITE_JPEG_QUALITY, 95])


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    img = forest()
    for name, (x, y) in LAYOUT_S1.items():
        col, a = load_rgba(f"s1_{name}")
        draw(img, col, a, x, y)
    save(img, 1)

    meta = json.loads((LAYERS / "lines.json").read_text())
    url = load_rgba("s2_url")
    for n, k in enumerate(("s2", "s3", "s4", "s5"), start=2):
        img = gradient()
        for line in meta[k]["lines"]:
            col, a = load_rgba(line["name"])
            draw(img, col, a, line["x"], line["y"] + LAYOUT_GRAD[k])
        draw(img, *url, *URL_POS)
        save(img, n)
    print(f"5 stories written to {OUT}")


if __name__ == "__main__":
    main()
