"""Tint the website line (the exact rendered URL from the earlier Gem AnaStation
layouts, extracted as an alpha layer) for light and dark backgrounds."""
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
a = np.asarray(Image.open(ROOT / "build" / "url_layer.png").convert("RGBA"))[..., 3]
for name, hexcol in {"url_on_light.png": "8E7550", "url_on_dark.png": "B4996C"}.items():
    rgba = np.zeros(a.shape + (4,), np.uint8)
    rgba[..., :3] = [int(hexcol[i:i + 2], 16) for i in (0, 2, 4)]
    rgba[..., 3] = a
    Image.fromarray(rgba).save(ROOT / "build" / name)
    print("wrote", name)
