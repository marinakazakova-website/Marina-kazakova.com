"""MY TOP 3 GEMS cover: the photo scaled to 1080 wide and cropped to 4:5
(nothing else changed), plus the website line tinted by the cover rule.
Usage: python3 tools/prepare.py"""
from pathlib import Path

import cv2
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
OFFSET = 60                      # px cut from the top after scaling (91 px spare)
IVORY, NAVY = np.array([243, 238, 229.]), np.array([16, 37, 55.])
im = cv2.cvtColor(cv2.imread(str(ROOT / "sources" / "photo_green_emerald_cut.jpg")), cv2.COLOR_BGR2RGB)
im = cv2.resize(im, (1080, round(im.shape[0] * 1080 / im.shape[1])), interpolation=cv2.INTER_AREA)[OFFSET:OFFSET + 1350]
assert im.shape[:2] == (1350, 1080)
cv2.imwrite(str(ROOT / "build" / "photo.jpg"), cv2.cvtColor(im, cv2.COLOR_RGB2BGR), [cv2.IMWRITE_JPEG_QUALITY, 97])
alpha = cv2.imread(str(ROOT / "build" / "url_on_light.png"), cv2.IMREAD_UNCHANGED)[..., 3]
band = im[1228 - 23:1228 + 27, 360:720].reshape(-1, 3).astype(np.float32).mean(0)
lum = band @ [0.2126, 0.7152, 0.0722] / 255
col = band + ((IVORY if lum < 0.5 else NAVY) - band) * 0.45
rgba = np.zeros(alpha.shape + (4,), np.uint8)
rgba[..., :3] = col.round()
rgba[..., 3] = (alpha * 0.9).astype(np.uint8)
cv2.imwrite(str(ROOT / "build" / "url_cover.png"), cv2.cvtColor(rgba, cv2.COLOR_RGBA2BGRA))
print(f"band lum {lum:.2f}, url colour #{''.join(f'{int(c):02X}' for c in col.round())}")
