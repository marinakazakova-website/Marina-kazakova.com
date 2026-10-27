"""Cover: banana-flower photo full bleed (uniform scale to 1080 wide, vertical
crop only, colours untouched) + the website line on the cover rule
(text top y = 1228, centred, tinted to the photo). No other text. Usage: python3 tools/cover.py"""
from pathlib import Path
import cv2
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
LAY = ROOT.parent / "build" / "layers"
CROP_TOP = 120

im = cv2.cvtColor(cv2.imread(str(ROOT / "sources/00_cover_banana_flower.jpg")), cv2.COLOR_BGR2RGB).astype(np.float32)
s = 1080 / im.shape[1]
im = cv2.resize(im, (1080, round(im.shape[0] * s)), interpolation=cv2.INTER_LANCZOS4)[CROP_TOP:CROP_TOP + 1350] / 255


def layer(name, scale=1.0):
    a = cv2.cvtColor(cv2.imread(str(LAY / f"{name}.png"), cv2.IMREAD_UNCHANGED), cv2.COLOR_BGRA2RGBA).astype(np.float32) / 255
    if scale != 1.0:
        a = cv2.resize(a, (round(a.shape[1] * scale), round(a.shape[0] * scale)), interpolation=cv2.INTER_AREA)
    return a


def put(img, a, x, y):
    h, w = a.shape[:2]
    al = a[..., 3:]
    img[y:y + h, x:x + w] = img[y:y + h, x:x + w] * (1 - al) + a[..., :3] * al


def ink_box(a):
    ys, xs = np.nonzero(a[..., 3] > 0.25)
    return xs.min(), xs.max(), ys.min(), ys.max()


# Website line — cover rule: the approved rendered line, text top y = 1228,
# centred; tinted to the photo: the band's own colour moved 45 % toward
# ivory (dark band) or navy (light band), 90 % opacity.
url_a = cv2.imread(str(ROOT.parent / "founder" / "build" / "url_on_light.png"), cv2.IMREAD_UNCHANGED)[..., 3] / 255.0
band = im[1205:1255, 360:720].reshape(-1, 3).mean(0) * 255
lum = band @ [0.2126, 0.7152, 0.0722] / 255
target = np.array([243, 238, 229.]) if lum < 0.5 else np.array([16, 37, 55.])
col = (band + (target - band) * 0.45) / 255
al = (url_a * 0.9)[..., None]
im[1223:1223 + al.shape[0], 375:375 + al.shape[1]] = im[1223:1223 + al.shape[0], 375:375 + al.shape[1]] * (1 - al) + col * al
print("website line colour #" + "".join(f"{int(round(c * 255)):02X}" for c in col))
out = (np.clip(im, 0, 1) * 255 + 0.5).astype(np.uint8)
cv2.imwrite(str(ROOT / "output/GA_CulturalChoice_00_cover.png"), cv2.cvtColor(out, cv2.COLOR_RGB2BGR))
print("written output/GA_CulturalChoice_00_cover.png", f"scale {s:.3f}")
