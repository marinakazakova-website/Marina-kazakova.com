"""Editorial colour grade for the Founder photos.

Global tonal operations only (no retouching, no generative fill): shapes,
hands, stones, tools and sketches are untouched pixel-for-pixel in form.

  - saturation down slightly, with skin and gemstone hues protected
  - whites brought down with a soft shoulder (no clipped paper or skin)
  - a delicate warmth in the highlights only (ivory, never yellow)
  - softer mid-tone contrast, shadows kept deep
  - fine grain for a printed-magazine surface

Usage: python3 tools/grade.py   -> build/photo1_graded.png, build/photo2_graded.png
"""
from pathlib import Path

import cv2
import numpy as np

ROOT = Path(__file__).resolve().parents[1]

PHOTOS = {
    "photo1_craft.jpg": "photo1_graded.png",
    "photo2_expertise.jpg": "photo2_graded.png",
}

# Tuning
SATURATION = 0.86        # 1.0 = unchanged
WHITE_POINT = 0.925      # brightest output value (0-1): paper reads ivory, not white
SHOULDER = 0.62          # where highlight compression starts
CONTRAST = 0.82          # mid-tone contrast (1.0 = unchanged), pivot at mid-grey
SHADOW_HOLD = 0.22       # below this the original shadow depth is kept
WARM = np.array([1.035, 1.0, 0.94])   # highlight tint, ivory direction
GRAIN = 2.0              # in 8-bit levels


def srgb_to_lin(c):
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)


def lin_to_srgb(c):
    c = np.clip(c, 0, 1)
    return np.where(c <= 0.0031308, c * 12.92, 1.055 * c ** (1 / 2.4) - 0.055)


def tone(v):
    """Tone curve on perceptual (sRGB-encoded) values."""
    # Softer mid contrast around 0.5, blended back to identity in the shadows
    # so their depth survives.
    soft = 0.5 + (v - 0.5) * CONTRAST
    w = np.clip(v / SHADOW_HOLD, 0, 1)
    w = w * w * (3 - 2 * w)
    v = v * (1 - w) + soft * w
    # Highlight shoulder towards the white point.
    k = SHOULDER
    top = WHITE_POINT
    over = np.clip(v - k, 0, None)
    span = 1.0 - k
    comp = k + (top - k) * (1 - np.exp(-over / (span * 0.75))) / (1 - np.exp(-1 / 0.75))
    return np.where(v > k, comp, v)


def grade(src, dst):
    bgr = cv2.imread(str(src))
    img = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB).astype(np.float32) / 255.0

    # Saturation in HSV, protecting skin (orange) and gemstone blues/greens
    # from going grey: they are reduced half as much.
    hsv = cv2.cvtColor(img, cv2.COLOR_RGB2HSV)
    h, s = hsv[..., 0], hsv[..., 1]
    skin = np.exp(-((h - 25) / 18) ** 2)
    stone = np.exp(-((h - 205) / 25) ** 2) * np.clip((s - 0.35) / 0.3, 0, 1)
    protect = np.clip(skin + stone, 0, 1)
    hsv[..., 1] = s * (SATURATION + (1 - SATURATION) * 0.5 * protect)
    img = cv2.cvtColor(hsv, cv2.COLOR_HSV2RGB)

    # Tone on luminance, then re-apply colour ratios (keeps hues honest).
    luma = img @ np.array([0.2126, 0.7152, 0.0722], np.float32)
    new = tone(luma)
    img = img * (new / np.maximum(luma, 1e-4))[..., None]

    # Warmth only where it is light.
    hl = np.clip((new - 0.55) / 0.35, 0, 1)[..., None]
    img = img * (1 + (WARM - 1) * hl)

    rng = np.random.default_rng(5)
    img = img + rng.standard_normal(img.shape[:2])[..., None] * (GRAIN / 255.0)
    out = (np.clip(img, 0, 1) * 255 + 0.5).astype(np.uint8)
    cv2.imwrite(str(dst), cv2.cvtColor(out, cv2.COLOR_RGB2BGR))


if __name__ == "__main__":
    (ROOT / "build").mkdir(exist_ok=True)
    for s, d in PHOTOS.items():
        grade(ROOT / "sources" / s, ROOT / "build" / d)
        print("graded", d)
