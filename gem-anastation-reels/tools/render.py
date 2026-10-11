"""Gem AnaStation — editorial brand reel renderer (1080x1920, 30 fps).

Every frame is composed in numpy from the layers produced by
extract_forest.py (original logo and typography, clean forest plate) and
piped straight into ffmpeg. All timings and positions live in TIMELINE /
LAYOUT below, so the animation can be re-tuned and re-rendered in one step.

Usage:
  python3 tools/render.py scene01            # test fragment (Scene 01)
  python3 tools/render.py scene01 --still 5.5 # single PNG frame at t=5.5 s
"""
import argparse
import subprocess
import sys
from pathlib import Path

import cv2
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
LAYERS = ROOT / "build" / "layers"
OUTDIR = ROOT / "output"
sys.path.insert(0, str(Path(__file__).parent))
import soundscape  # noqa: E402

W, H, FPS = 1080, 1920, 30

# Reels safe zone: keep type between y=250 and y=1500 (caption/UI overlay
# below, profile bar above), and away from the right-hand action buttons.
# Positions are the top-left of each original layer, in output pixels.
# x is unchanged from the 1080-wide source layout; y is re-spaced for 9:16.
LAYOUT_S1 = {
    "created_by_nature": (400, 300),
    "logo_ga":           (410, 786),     # logo group centred at y ~ 900
    "wordmark":          (370, 969),
    "descriptor":        (396, 999),
    "url":               (370, 1478),
}

# Scene 01 timeline, seconds: (start, end) of each element's reveal.
TIMELINE_S1 = {
    "duration": 6.0,
    "forest_fade": (0.0, 1.6),
    "zoom": (1.0, 1.075),               # slow cinematic push-in over the scene
    "created_by_nature": (1.3, 2.7),
    "logo_ga": (2.5, 4.0),
    "logo_light": (2.9, 4.6),           # one gem-like light pass across the GA
    "wordmark": (3.4, 4.5),
    "descriptor": (4.1, 5.0),
    "url": (4.4, 5.3),
}


# --- helpers --------------------------------------------------------------
def ease(x):
    """Smooth ease-in-out (smootherstep), clamped to [0, 1]."""
    x = np.clip(x, 0.0, 1.0)
    return x * x * x * (x * (x * 6 - 15) + 10)


def progress(t, span):
    a, b = span
    return float(ease((t - a) / (b - a)))


def load_rgba(name):
    im = cv2.imread(str(LAYERS / f"{name}.png"), cv2.IMREAD_UNCHANGED)
    im = cv2.cvtColor(im, cv2.COLOR_BGRA2RGBA).astype(np.float32) / 255.0
    return im[..., :3], im[..., 3]


def smooth_field(shape, sigma, rng):
    f = cv2.GaussianBlur(rng.standard_normal(shape).astype(np.float32), (0, 0), sigma)
    return f / (f.std() + 1e-6)


def srgb_to_linear(c):
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)


def linear_to_srgb(c):
    c = np.clip(c, 0, 1)
    return np.where(c <= 0.0031308, c * 12.92, 1.055 * c ** (1 / 2.4) - 0.055)


# --- Scene 01: CREATED BY NATURE -----------------------------------------
class Scene01:
    def __init__(self, seed=7):
        rng = np.random.default_rng(seed)
        plate = cv2.imread(str(LAYERS / "forest_clean.png"))
        self.plate = cv2.cvtColor(plate, cv2.COLOR_BGR2RGB).astype(np.float32) / 255.0
        self.sh, self.sw = self.plate.shape[:2]
        # Cover-fit the 4:5 plate into 9:16: uniform scale, no distortion.
        self.cover = H / self.sh
        self.layers = {n: load_rgba(f"s1_{n}") for n in LAYOUT_S1}

        # Foliage motion. Each crown sways on its own phase (phase field at
        # crown scale); a slow gust travels across the canopy; nearer trees at
        # the bottom move more than the far slope. Amplitudes are in source px.
        sh, sw = self.sh, self.sw
        yy, xx = np.mgrid[0:sh, 0:sw].astype(np.float32)
        self.xx, self.yy = xx, yy
        self.phase = smooth_field((sh, sw), 9, rng) * 2.2
        self.phase2 = smooth_field((sh, sw), 5, rng) * 2.6
        self.amp = (0.45 + 1.0 * (yy / sh) ** 1.4) * (0.75 + 0.25 * smooth_field((sh, sw), 30, rng))
        self.mist = [smooth_field((sh // 4, sw // 4), s, rng) for s in (18, 40)]
        self.grain_rng = np.random.default_rng(seed + 1)

        # Output pixel grid (for the camera mapping) and vignette.
        oy, ox = np.mgrid[0:H, 0:W].astype(np.float32)
        self.ox, self.oy = ox, oy
        r = np.sqrt(((ox - W / 2) / (W * 0.62)) ** 2 + ((oy - H * 0.47) / (H * 0.6)) ** 2)
        self.vignette = (1 - 0.38 * np.clip(r - 0.35, 0, 1) ** 1.6)[..., None]

    def forest(self, t, dur):
        # Camera: slow push-in, eased, focused just above the logo.
        z0, z1 = TIMELINE_S1["zoom"]
        z = z0 + (z1 - z0) * float(ease(t / dur * 0.85 + 0.075))
        s = self.cover * z
        fx, fy = self.sw / 2, self.sh * 0.43
        # Output point (W/2, 900) looks at source focus (fx, fy).
        mx = fx + (self.ox - W / 2) / s
        my = fy + (self.oy - 900) / s

        # Wind displacement sampled in source space, then resampled to output.
        w1, w2 = 2 * np.pi * 0.23, 2 * np.pi * 0.41
        gust = 0.65 + 0.35 * np.sin(2 * np.pi * (self.xx / 650 - 0.11 * t) + self.yy / 900)
        dx = self.amp * gust * (0.8 * np.sin(w1 * t + self.phase) + 0.35 * np.sin(w2 * t + self.phase2))
        dy = self.amp * gust * 0.35 * np.sin(w1 * 0.8 * t + self.phase2 + 1.3)
        dxo = cv2.remap(dx, mx, my, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
        dyo = cv2.remap(dy, mx, my, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
        img = cv2.remap(self.plate, mx + dxo, my + dyo, cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT)

        # Air: faint drifting mist and a slow breathing of light from above.
        m = cv2.resize(0.6 * np.roll(self.mist[0], int(t * 6), axis=1) +
                       0.4 * np.roll(self.mist[1], -int(t * 3), axis=1),
                       (self.sw, self.sh), interpolation=cv2.INTER_CUBIC)
        m = cv2.remap(m, mx, my, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
        haze = np.clip(m * 0.5 + 0.5, 0, 1)[..., None]
        top_light = (1 + 0.07 * np.clip(1 - self.oy / (H * 0.7), 0, 1)
                     * (0.6 + 0.4 * np.sin(2 * np.pi * 0.09 * t)))[..., None]
        lin = srgb_to_linear(np.clip(img, 0, 1)) * top_light
        # Mist is a gentle lift in the mid-tones only, never a grey veil.
        lin = lin * (1 + 0.10 * (haze - 0.5)) + np.array([0.002, 0.005, 0.006]) * haze
        return lin

    def frame(self, t):
        T = TIMELINE_S1
        lin = self.forest(t, T["duration"]) * self.vignette
        lin *= progress(t, T["forest_fade"])  # forest opens from black
        out = linear_to_srgb(lin)

        for name, (x, y) in LAYOUT_S1.items():
            p = progress(t, T[name])
            if p <= 0:
                continue
            col, a = self.layers[name]
            h, w = a.shape
            if name == "logo_ga":
                # Logo: opacity only (never scaled, blurred or deformed) plus
                # a single soft diagonal pass of light, like light moving
                # through a stone.
                lp = (t - T["logo_light"][0]) / (T["logo_light"][1] - T["logo_light"][0])
                if 0 < lp < 1:
                    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
                    pos = -0.3 + 1.6 * float(ease(lp))
                    band = np.exp(-(((xx / w) * 0.8 + (yy / h) * 0.45 - pos * 1.25) / 0.09) ** 2)
                    col = np.clip(col * (1 + 0.32 * band[..., None]) + 0.06 * band[..., None], 0, 1)
            else:
                # Hairline type resolves out of soft focus while it fades in.
                blur = 2.4 * (1 - p)
                if blur > 0.15:
                    a = cv2.GaussianBlur(a, (0, 0), blur)
            a = (a * p)[..., None]
            region = out[y:y + h, x:x + w]
            out[y:y + h, x:x + w] = region * (1 - a) + col * a

        # Fine film grain keeps the dark greens free of banding on H.264.
        g = self.grain_rng.standard_normal((H, W, 1)).astype(np.float32)
        out = out + g * (2.2 / 255.0)
        return (np.clip(out, 0, 1) * 255 + 0.5).astype(np.uint8)


# --- output ---------------------------------------------------------------
def encode(scene, duration, path):
    cmd = ["ffmpeg", "-y", "-loglevel", "error",
           "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
           "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-maxrate", "16M", "-bufsize", "32M", "-profile:v", "high",
            "-pix_fmt", "yuv420p", "-colorspace", "bt709", "-color_primaries", "bt709",
            "-color_trc", "bt709", "-movflags", "+faststart", str(path)]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    n = int(round(duration * FPS))
    for i in range(n):
        proc.stdin.write(scene.frame(i / FPS).tobytes())
        if i % 30 == 0:
            print(f"  frame {i}/{n}", flush=True)
    proc.stdin.close()
    proc.wait()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("scene", choices=["scene01"])
    ap.add_argument("--still", type=float, help="render one PNG frame at this time")
    args = ap.parse_args()
    OUTDIR.mkdir(exist_ok=True)

    scene, dur = Scene01(), TIMELINE_S1["duration"]
    if args.still is not None:
        f = scene.frame(args.still)
        p = OUTDIR / f"{args.scene}_frame_{args.still:.1f}s.png"
        cv2.imwrite(str(p), cv2.cvtColor(f, cv2.COLOR_RGB2BGR))
        print(p)
        return

    wav = ROOT / "build" / f"{args.scene}_sound.wav"
    soundscape.scene01(wav, dur, TIMELINE_S1)
    silent = OUTDIR / f"GA_{args.scene}_test_silent.mp4"
    encode(scene, dur, silent)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(silent), "-i", str(wav),
                    "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "256k",
                    "-movflags", "+faststart", "-shortest",
                    str(OUTDIR / f"GA_{args.scene}_test.mp4")], check=True)


if __name__ == "__main__":
    main()
