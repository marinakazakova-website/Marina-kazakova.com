"""Story 01 base: the forest (clean plate, cover-fit to 9:16) with the ORIGINAL
GA monogram, GEM ANASTATION wordmark and NATURE • GEMSTONE • IDENTITY
descriptor — the same layers as the approved reel and Stories, never redrawn.
The type of this story (rubric, statement, body, website) is set in HTML.

Usage: python3 tools/base_story01.py [logo_shift_px]
"""
import sys
from pathlib import Path

import cv2
import numpy as np

HERE = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(HERE.parent / "tools"))
from render import LAYOUT_S1, draw, load_rgba   # noqa: E402
from stories import forest                       # noqa: E402

SHIFT = int(sys.argv[1]) if len(sys.argv) > 1 else -150   # move the logo group up

img = forest()
for name in ("logo_ga", "wordmark", "descriptor"):
    x, y = LAYOUT_S1[name]
    col, a = load_rgba(f"s1_{name}")
    draw(img, col, a, x, y + SHIFT)
out = (np.clip(img, 0, 1) * 255 + 0.5).astype(np.uint8)
(HERE / "build").mkdir(exist_ok=True)
cv2.imwrite(str(HERE / "build" / "story01_base.png"), cv2.cvtColor(out, cv2.COLOR_RGB2BGR))
print(f"story01_base.png: logo group shifted {SHIFT} px (logo top y = {LAYOUT_S1['logo_ga'][1] + SHIFT})")
