"""GA / NATURE · GEMSTONE · IDENTITY / EDITORIAL GRID — photo crops.
Each photo is cut to a 540×540 square: (source left, top, side) in source
pixels, chosen to keep the framing of the approved mock-up (subject at the same
place in the tile, same scale where the square allows). Only scale + crop.
Usage: python3 tools/crop.py <set>"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SETS = {
    "green_tourmaline": {
        "human":  (31, 313, 680),     # face, lips at ~59 % height as in the mock-up
        "nature": (120, 236, 800),    # stamens slightly left of centre
        "gem":    (427, 648, 480),   # front stone low-left, second stone top-right
    },
}
# Global colour match to the approved mock-up where the client graded a photo
# (per-channel mean/std transfer; a tonal operation only, nothing retouched).
GRADE = {("green_tourmaline", "gem"): ("sources/mockup_green_tourmaline.jpg", (546, 721, 1080, 1350))}
name = sys.argv[1] if len(sys.argv) > 1 else "green_tourmaline"
for slot, (x, y, side) in SETS[name].items():
    im = Image.open(ROOT / "sources" / f"{name}_{slot}.jpg").convert("RGB")
    assert x + side <= im.width and y + side <= im.height, (slot, im.size)
    im = im.crop((x, y, x + side, y + side)).resize((540, 540), Image.LANCZOS)
    if (name, slot) in GRADE:
        ref, box = GRADE[(name, slot)]
        r = np.asarray(Image.open(ROOT / ref).convert("RGB").crop(box)).reshape(-1, 3).astype(np.float32)
        a = np.asarray(im).astype(np.float32)
        f = a.reshape(-1, 3)
        a = (a - f.mean(0)) / f.std(0) * r.std(0) + r.mean(0)
        im = Image.fromarray(a.clip(0, 255).round().astype(np.uint8))
    im.save(ROOT / "build" / f"{name}_{slot}.jpg", quality=96)
    print(slot, im.size, "->", (x, y, side))
