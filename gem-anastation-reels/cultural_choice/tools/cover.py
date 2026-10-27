"""Cover: banana-flower photo full bleed (uniform scale to 1080 wide, vertical
crop only, colours untouched) + the original Gem AnaStation logo (GA monogram
and GEM ANASTATION wordmark layers, never redrawn) at the bottom: wordmark
text top on the bottom service line (y = 1228), centred; monogram scaled
uniformly 0.40, 18 px above it. Usage: python3 tools/cover.py"""
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


wm = layer("s1_wordmark")
x0, x1, y0, _ = ink_box(wm)
put(im, wm, round(540 - (x0 + x1) / 2), 1228 - y0)
mono = layer("s1_logo_ga", 0.40)
mx0, mx1, _, my1 = ink_box(mono)
put(im, mono, round(540 - (mx0 + mx1) / 2), 1228 - 18 - my1)
out = (np.clip(im, 0, 1) * 255 + 0.5).astype(np.uint8)
cv2.imwrite(str(ROOT / "output/GA_CulturalChoice_00_cover.png"), cv2.cvtColor(out, cv2.COLOR_RGB2BGR))
print("written output/GA_CulturalChoice_00_cover.png", f"scale {s:.3f}")
