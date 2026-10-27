"""Cover photos: uniform scale to 1080 wide, vertical crop to 1350 (content
untouched), and a website line tinted to its own photo (delicate: the band's
own colour, moved 45 % toward ivory on dark photos / toward navy on light).
Usage: python3 tools/prepare.py
"""
from pathlib import Path

import cv2
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
URL = ROOT.parent / "founder" / "build" / "url_on_light.png"
COVERS = {            # name: (photo, crop offset in px after scaling, frame height)
    "river": ("sources/photo_river.jpg", 227, 1350),
    "mountain": ("sources/photo_mountain.jpg", 40, 1350),
    "river_story": ("sources/photo_river.jpg", 0, 1920),     # Stories 1080×1920
}
IVORY, NAVY = np.array([243, 238, 229.]), np.array([16, 37, 55.])
(ROOT / "build").mkdir(exist_ok=True)
alpha = cv2.imread(str(URL), cv2.IMREAD_UNCHANGED)[..., 3]
for name, (src, off, FH) in COVERS.items():
    im = cv2.cvtColor(cv2.imread(str(ROOT / src)), cv2.COLOR_BGR2RGB).astype(np.float32)
    s = max(1080 / im.shape[1], FH / im.shape[0])
    im = cv2.resize(im, (round(im.shape[1] * s), round(im.shape[0] * s)), interpolation=cv2.INTER_LANCZOS4)
    x0 = (im.shape[1] - 1080) // 2
    im = im[off:off + FH, x0:x0 + 1080]
    assert im.shape[:2] == (FH, 1080), name
    cv2.imwrite(str(ROOT / "build" / f"{name}.jpg"), cv2.cvtColor(im.clip(0, 255).astype(np.uint8), cv2.COLOR_RGB2BGR),
                [cv2.IMWRITE_JPEG_QUALITY, 96])
    uy = 1228 if FH == 1350 else 1744                     # website line text top (post / Stories rule)
    band = im[uy - 23:uy + 27, 360:720].reshape(-1, 3).mean(0)
    lum = band @ [0.2126, 0.7152, 0.0722] / 255
    col = band + ((IVORY if lum < 0.5 else NAVY) - band) * 0.45
    rgba = np.zeros(alpha.shape + (4,), np.uint8)
    rgba[..., :3] = col.round()
    rgba[..., 3] = (alpha * 0.9).astype(np.uint8)
    cv2.imwrite(str(ROOT / "build" / f"url_{name}.png"), cv2.cvtColor(rgba, cv2.COLOR_RGBA2BGRA))
    print(f"{name}: band lum {lum:.2f}, url colour #{''.join(f'{int(c):02X}' for c in col.round())}")
