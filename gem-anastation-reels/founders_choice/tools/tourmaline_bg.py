"""TOURMALINE card background (1080×1350): the client's stone band (from her
mock-up, stones untouched) with its own glow carried over the whole page, so
there is no black backdrop and no band edge. Above and below the band each
column continues the band's own edge colour (smoothed), fading slowly into a
deep teal taken from the band; seams are feathered; fine grain against banding.
Usage: python3 tools/tourmaline_bg.py"""
from pathlib import Path

import cv2
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
m = cv2.cvtColor(cv2.imread(str(ROOT / "sources" / "mockup_tourmaline.webp")), cv2.COLOR_BGR2RGB).astype(np.float32)
band = m[989:1513]                                   # the stone photo inside the mock-up (edges excluded)
s = 1080 / band.shape[1]
band = cv2.resize(band, (1080, round(band.shape[0] * s)), interpolation=cv2.INTER_AREA)
BH, Y0 = band.shape[0], 742                          # band height, top on the page
H = 1350
edge_top = cv2.GaussianBlur(band[:24].mean(0, keepdims=True), (0, 0), sigmaX=45, sigmaY=0.1)[0]
edge_bot = cv2.GaussianBlur(band[-24:].mean(0, keepdims=True), (0, 0), sigmaX=45, sigmaY=0.1)[0]
deep = np.percentile(band.reshape(-1, 3), 12, axis=0)        # band's own deep teal

out = np.zeros((H, 1080, 3), np.float32)
d_up = (Y0 - np.arange(Y0, dtype=np.float32))[:, None, None]  # distance above the band
f = np.exp(-d_up / 900)
out[:Y0] = edge_top[None] * f + deep * (1 - f)
d_dn = (np.arange(H - Y0 - BH, dtype=np.float32) + 1)[:, None, None]
f = np.exp(-d_dn / 260)
out[Y0 + BH:] = edge_bot[None] * f + deep * (1 - f)
# the band, feathered top and bottom into the continuation
w = np.ones((BH, 1, 1), np.float32)
r = np.arange(48, dtype=np.float32) / 48
w[:48, 0, 0] = r ** 1.5
w[-48:, 0, 0] = (r ** 1.5)[::-1]
ext = np.concatenate([np.repeat(edge_top[None], 48, 0), np.zeros((BH - 96, 1080, 3), np.float32),
                      np.repeat(edge_bot[None], 48, 0)])
out[Y0:Y0 + BH] = band * w + ext * (1 - w)
out += np.random.default_rng(3).normal(0, 1.2, out.shape).astype(np.float32)
cv2.imwrite(str(ROOT / "build" / "bg_tourmaline.png"), cv2.cvtColor(out.clip(0, 255).round().astype(np.uint8), cv2.COLOR_RGB2BGR))
print("band", BH, "px at y", Y0, "deep", deep.round())
