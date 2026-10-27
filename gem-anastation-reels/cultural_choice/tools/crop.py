"""Fit each photo to 1080×1350 by uniform scale to the full height and a
horizontal crop that puts the stone on its side (no distortion, no edits).
Usage: python3 tools/crop.py"""
from pathlib import Path
import cv2
ROOT = Path(__file__).resolve().parents[1]
OFFSETS = {"01_jade": 210, "02_ruby": 360, "03_emerald": 33, "04_spessartine": 263, "05_sapphire": 662}
for name, off in OFFSETS.items():
    im = cv2.imread(str(ROOT / "sources" / f"{name}.jpg"))
    s = 1350 / im.shape[0]
    im = cv2.resize(im, (round(im.shape[1] * s), 1350), interpolation=cv2.INTER_LANCZOS4 if s > 1 else cv2.INTER_AREA)
    out = im[:, off:off + 1080]
    assert out.shape[1] == 1080, name
    cv2.imwrite(str(ROOT / "build" / f"{name}.jpg"), out, [cv2.IMWRITE_JPEG_QUALITY, 96])
    print(name, f"scale {s:.3f}")
