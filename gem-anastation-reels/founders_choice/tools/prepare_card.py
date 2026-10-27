"""FOUNDER'S CHOICE card — photo prep. The stone's abstract gradient photo is
turned horizontal (90° CCW), zoomed and darkened for the top block; the
portrait is cropped from the top only for the bottom-right block.
Usage: python3 tools/prepare_card.py <id>   (ids in CARDS)"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
CARDS = {   # id: (gradient photo, zoom, crop x, crop y, darken, portrait)
    "blue_sapphire": ("sources/abstract_blue.webp", 1.25, 0, 210, 0.66, "sources/portrait_mirror.webp"),
}
src, zoom, cx, cy, dark, portrait = CARDS[sys.argv[1] if len(sys.argv) > 1 else "blue_sapphire"]
g = Image.open(ROOT / src).convert("RGB").rotate(90, expand=True)
w = round(1080 * zoom)
g = g.resize((w, round(g.size[1] * w / g.size[0])), Image.LANCZOS).crop((cx, cy, cx + 1080, cy + 675))
a = np.asarray(g).astype(np.float32) / 255
a = dark * a ** 1.1                       # darker, highlights kept soft
Image.fromarray((a * 255).round().astype(np.uint8)).save(ROOT / "build" / f"top_{sys.argv[1] if len(sys.argv) > 1 else 'blue_sapphire'}.png")
p = Image.open(ROOT / portrait).convert("RGB")
W, H = p.size
h = round(W * 675 / 540)
p.crop((0, H - h, W, H)).resize((540, 675), Image.LANCZOS).save(ROOT / "build" / "portrait.jpg", quality=96)
print("ok")
