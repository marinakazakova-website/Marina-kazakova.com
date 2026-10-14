"""Gem AnaStation — editorial brand reel renderer (1080x1920, 30 fps).

Every frame is composed in numpy from the layers produced by
extract_forest.py (original logo and typography, clean forest plate) and
piped straight into ffmpeg. All timings and positions live in TIMELINE /
LAYOUT below, so the animation can be re-tuned and re-rendered in one step.

Usage:
  python3 tools/render.py reel                   # full reel, with and without sound
  python3 tools/render.py scene01                # Scene 01 test fragment
  python3 tools/render.py reel --still 6.2 9.0   # PNG frames at given times
"""
import argparse
import json
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

# House rule for 9:16 service lines (shared with the Founder Stories): the top
# rubric's text starts at y = 139, the website line's text at y = 1744 (the
# post's 127 px bottom margin scaled to 1920). Main type stays between
# y = 250 and y = 1500, away from the right-hand action buttons.
# Positions are the top-left of each original layer, in output pixels.
# x is unchanged from the 1080-wide source layout; y is re-spaced for 9:16.
LAYOUT_S1 = {
    "created_by_nature": (400, 130),     # text top y = 139 (house rule, Stories)
    "logo_ga":           (410, 786),     # logo group centred at y ~ 900
    "wordmark":          (370, 969),
    "descriptor":        (396, 999),
    "url":               (382, 1737),    # text top y = 1744 (house rule); +12 px puts this
                                         # narrower forest-layout line on the 540 axis
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

    def compose(self, t, mult=None, defocus=0.0):
        """Scene 01 as float sRGB, before grain. `mult` scales the opacity of
        named layers (used by the reel to hand over to the next scene);
        `defocus` blurs the forest (Gaussian sigma, output px)."""
        T = TIMELINE_S1
        mult = mult or {}
        lin = self.forest(t, T["duration"]) * self.vignette
        lin *= progress(t, T["forest_fade"])  # forest opens from black
        if defocus > 0.2:
            lin = cv2.GaussianBlur(lin.astype(np.float32), (0, 0), defocus)
        out = linear_to_srgb(lin)

        for name, (x, y) in LAYOUT_S1.items():
            p = progress(t, T[name])
            k = mult.get(name, 1.0)
            if p <= 0 or k <= 0:
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
            draw(out, col, a * p * k, x, y)
        return out

    def frame(self, t):
        return finish(self.compose(t), self.grain_rng)


def draw(out, col, a, x, y):
    """Composite a layer (colour, alpha) onto the frame at (x, y)."""
    h, w = a.shape
    a = a[..., None]
    out[y:y + h, x:x + w] = out[y:y + h, x:x + w] * (1 - a) + col * a


def finish(out, rng):
    """Fine film grain keeps the dark greens free of banding on H.264."""
    g = rng.standard_normal((H, W, 1)).astype(np.float32)
    out = out + g * (2.2 / 255.0)
    return (np.clip(out, 0, 1) * 255 + 0.5).astype(np.uint8)


# --- Scenes 02-05: gradient editorial pages --------------------------------
# Vertical offset of each original layout in the 9:16 frame (x unchanged):
# s2 keeps its top position, s3 sits at mid-height, s4 sits low, as in the
# originals; s5 is centred where the GA monogram stood in Scene 01. The
# website line keeps exactly the position it has in Scene 01.
LAYOUT_GRAD = {"s2": 125, "s3": 260, "s4": 255, "s5": 308}
URL_POS = (375, 1739)   # original x of the layouts; text top y = 1744 (house rule)

# Full reel timeline, seconds. Scene 01 keeps its approved timing.
TIMELINE_REEL = {
    "duration": 26.0,
    "s1_type_out": (5.35, 5.95),       # Scene 01 type dissolves (website stays)
    "to_gradient": (5.5, 6.9),         # forest defocuses into the gradient
    "s2": {"in": 6.5, "out": (11.0, 11.6)},
    "s3": {"in": 11.5, "out": (15.4, 16.0)},
    "s4": {"in": 16.1, "out": (20.2, 20.8)},
    "dip": (15.4, 16.6),               # soft darkening between s3 and s4
    "s5": {"in": [20.8, 21.8, 22.8], "out": None},
    "end_fade": (24.6, 25.8),
    "heading": 0.7,                    # heading fade-in
    "line_delay": 0.35,                # first body line after heading start
    "line": 0.8,                       # each body line's left-to-right reveal
    "stagger": 0.3,                    # gap between body line starts
    "s5_line": 0.9,                    # each philosophy line
}


def bump(t, span):
    """0 -> 1 -> 0 across a span (sine)."""
    a, b = span
    x = np.clip((t - a) / (b - a), 0, 1)
    return float(np.sin(np.pi * x))


class Gradient:
    """The brand gradient, alive: a slow drift of the plate, a turquoise light
    travelling through it, and faint refraction veins like the inside of a
    stone. All motion is in linear light and kept barely perceptible."""

    def __init__(self, seed=21):
        rng = np.random.default_rng(seed)
        plate = cv2.cvtColor(cv2.imread(str(LAYERS / "gradient_clean.png")), cv2.COLOR_BGR2RGB)
        plate = cv2.resize(plate.astype(np.float32) / 255.0, (W, H), interpolation=cv2.INTER_CUBIC)
        self.plate = srgb_to_linear(plate).astype(np.float32)
        lum = self.plate @ np.array([0.2126, 0.7152, 0.0722], np.float32)
        self.bright = (lum / lum.max())[..., None] ** 0.7
        oy, ox = np.mgrid[0:H, 0:W].astype(np.float32)
        self.ox, self.oy = ox, oy
        self.turq = srgb_to_linear(np.array([0x43, 0x90, 0x90]) / 255.0).astype(np.float32)
        q = (H // 4, W // 4)
        self.f1 = smooth_field(q, 18, rng) * 2.2
        self.f2 = smooth_field(q, 22, rng) * 4
        self.f3 = smooth_field(q, 40, rng)

    def lin(self, t):
        # Drift: a very slow breathing scale and float, never a visible move.
        sc = 1.035 + 0.012 * np.sin(2 * np.pi * t / 21)
        dx, dy = 10 * np.sin(2 * np.pi * t / 17), -14 + 10 * np.cos(2 * np.pi * t / 23)
        M = np.float32([[sc, 0, (1 - sc) * W / 2 + dx], [0, sc, (1 - sc) * H / 2 + dy]])
        img = cv2.warpAffine(self.plate, M, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)

        # Light travelling through the mineral.
        cx = W * (0.74 + 0.14 * np.sin(2 * np.pi * t / 19))
        cy = H * (0.76 + 0.07 * np.cos(2 * np.pi * t / 23))
        g = np.exp(-(((self.ox - cx) / (W * 0.42)) ** 2 + ((self.oy - cy) / (H * 0.26)) ** 2))
        cx2 = W * (0.25 + 0.10 * np.cos(2 * np.pi * t / 27))
        cy2 = H * (0.30 + 0.05 * np.sin(2 * np.pi * t / 31))
        g2 = np.exp(-(((self.ox - cx2) / (W * 0.5)) ** 2 + ((self.oy - cy2) / (H * 0.3)) ** 2))
        img = img + (0.045 * g + 0.012 * g2)[..., None] * self.turq

        # Refraction veins: thin bright lines where a slowly evolving field
        # crosses zero, modulated so they appear and dissolve.
        v = np.exp(-(np.sin(self.f1 + 0.30 * t) / 0.22) ** 2) * (0.5 + 0.5 * np.sin(self.f2 - 0.22 * t))
        v *= np.clip(0.5 + 0.8 * self.f3, 0, 1)
        v = cv2.resize(cv2.GaussianBlur(v.astype(np.float32), (0, 0), 2.0), (W, H), interpolation=cv2.INTER_CUBIC)
        img = img + (0.022 * v)[..., None] * self.bright * (self.turq + 0.25)
        return img


class Reel:
    def __init__(self):
        self.s1 = Scene01()
        self.grad = Gradient()
        self.grain_rng = np.random.default_rng(8)
        meta = json.loads((LAYERS / "lines.json").read_text())
        self.pages = {}
        for k in ("s2", "s3", "s4", "s5"):
            dy = LAYOUT_GRAD[k]
            self.pages[k] = [(load_rgba(l["name"]), l["x"], l["y"] + dy) for l in meta[k]["lines"]]
        self.url = load_rgba("s2_url")
        xs = np.arange(1200, dtype=np.float32)
        self.xs = xs

    def wipe(self, a, p, feather=170.0):
        """Left-to-right reveal with a soft leading edge."""
        w = a.shape[1]
        edge = -feather + (w + feather) * p
        m = np.clip((edge + feather - self.xs[:w]) / feather, 0, 1)
        return a * (m * m * (3 - 2 * m))[None, :]

    def page(self, out, k, t):
        T = TIMELINE_REEL
        spec = T[k]
        o = 1.0 if spec["out"] is None else 1 - progress(t, spec["out"])
        if o <= 0:
            return
        for i, ((col, a), x, y) in enumerate(self.pages[k]):
            if k == "s5":
                # Philosophy: each line on its own, resolving from soft focus.
                t0 = spec["in"][i]
                p = progress(t, (t0, t0 + T["s5_line"]))
                if p <= 0:
                    continue
                if 2.4 * (1 - p) > 0.15:
                    a = cv2.GaussianBlur(a, (0, 0), 2.4 * (1 - p))
                draw(out, col, a * p * o, x, y)
            elif i == 0:
                # Heading first: a calm fade out of soft focus.
                p = progress(t, (spec["in"], spec["in"] + T["heading"]))
                if p <= 0:
                    continue
                if 1.8 * (1 - p) > 0.15:
                    a = cv2.GaussianBlur(a, (0, 0), 1.8 * (1 - p))
                draw(out, col, a * p * o, x, y)
            else:
                t0 = spec["in"] + T["line_delay"] + (i - 1) * T["stagger"]
                p = float(np.clip((t - t0) / T["line"], 0, 1))
                if p <= 0:
                    continue
                draw(out, col, self.wipe(a, p) * o, x, y)

    def frame(self, t):
        T = TIMELINE_REEL
        tg = progress(t, T["to_gradient"])
        if tg < 1:
            type_out = 1 - progress(t, T["s1_type_out"])
            mult = {n: type_out for n in LAYOUT_S1 if n != "url"}
            mult["url"] = 1 - tg
            f = srgb_to_linear(self.s1.compose(t, mult, defocus=16 * tg))
        lin = self.grad.lin(t) if tg > 0 else None
        if tg <= 0:
            out = linear_to_srgb(f)
        elif tg >= 1:
            out = linear_to_srgb(lin * (1 - 0.22 * bump(t, T["dip"])))
        else:
            out = linear_to_srgb(f * (1 - tg) + lin * tg)
        out = out.astype(np.float32)

        if tg > 0:
            col, a = self.url
            draw(out, col, a * tg, *URL_POS)
        for k in ("s2", "s3", "s4", "s5"):
            self.page(out, k, t)

        e = progress(t, T["end_fade"])
        if e > 0:
            out = linear_to_srgb(srgb_to_linear(np.clip(out, 0, 1)) * (1 - e)).astype(np.float32)
        return finish(out, self.grain_rng)


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
    ap.add_argument("what", choices=["scene01", "reel"])
    ap.add_argument("--still", type=float, nargs="*", help="render PNG frames at these times")
    args = ap.parse_args()
    OUTDIR.mkdir(exist_ok=True)

    if args.what == "scene01":
        scene, dur, stem = Scene01(), TIMELINE_S1["duration"], "GA_scene01_test"
    else:
        scene, dur, stem = Reel(), TIMELINE_REEL["duration"], "GA_reel_issue01"
    if args.still:
        for t in args.still:
            p = OUTDIR / f"{stem}_frame_{t:05.2f}s.png"
            cv2.imwrite(str(p), cv2.cvtColor(scene.frame(t), cv2.COLOR_RGB2BGR))
            print(p)
        return

    wav = ROOT / "build" / f"{stem}.wav"
    if args.what == "scene01":
        soundscape.scene01(wav, dur, TIMELINE_S1)
    else:
        soundscape.reel(wav, dur, TIMELINE_S1, TIMELINE_REEL)
    silent = OUTDIR / f"{stem}_silent.mp4"
    encode(scene, dur, silent)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(silent), "-i", str(wav),
                    "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "256k",
                    "-movflags", "+faststart", "-shortest", str(OUTDIR / f"{stem}.mp4")], check=True)


if __name__ == "__main__":
    main()
