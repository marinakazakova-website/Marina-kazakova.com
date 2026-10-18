"""Build the slide surfaces from the brand gradients (GA Identity p.1 and p.10).

The originals are 9:16 and grainy; they are rotated to 16:9 where needed,
softened so the upscale does not magnify their grain, resized, and given a
fresh fine grain at the target size. Tonal operations only.

Usage: python3 tools/surfaces.py
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

g = Path(__file__).resolve().parent.parent / "assets" / "gradients"


def surface(src, dst, size, rotate=0, soften=1.6, grain=2.6, seed=1):
    im = Image.open(g / src).convert("RGB")
    if rotate:
        im = im.rotate(rotate, expand=True)
    im = im.filter(ImageFilter.GaussianBlur(soften))
    w, h = size
    s = max(w / im.width, h / im.height)            # cover, no distortion
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    l, t = (im.width - w) // 2, (im.height - h) // 2
    a = np.asarray(im.crop((l, t, l + w, t + h))).astype(np.float32)
    a += np.random.default_rng(seed).normal(0, grain, a.shape[:2])[..., None]
    Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).save(g / dst, quality=93)


surface("g1_cover_blue.png", "surface_cover_1920x1080.jpg", (1920, 1080), rotate=90, soften=1.0)
surface("g3_navy_teal.png", "surface_method_1920x1080.jpg", (1920, 1080), rotate=90)
surface("g4_aurora_teal.png", "surface_aurora_vertical.jpg", (554, 984), soften=0.8, seed=2)
