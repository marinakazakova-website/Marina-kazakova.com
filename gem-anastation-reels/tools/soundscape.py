"""Organic ambient / nature soundscape, synthesised from scratch.

No samples or third-party recordings are used, so the audio is fully owned
and cleared for commercial use. Layers:
  - air & wind: filtered noise with slow, travelling gusts (stereo)
  - canopy: soft high rustle in irregular grains
  - texture: a low resonant drone that opens up over the scene
  - accents: glassy, inharmonic "mineral" tones on each text reveal
  - space: a long synthetic reverb tail
"""
import wave

import numpy as np
from scipy import signal

SR = 48000


def _noise(n, rng):
    return rng.standard_normal(n).astype(np.float64)


def _env(t, a, b, attack, release):
    """0 -> 1 between a and a+attack, hold, 1 -> 0 from b-release to b."""
    up = np.clip((t - a) / attack, 0, 1)
    down = np.clip((b - t) / release, 0, 1)
    e = np.minimum(up, down)
    return e * e * (3 - 2 * e)


def _bp(x, lo, hi, order=2):
    sos = signal.butter(order, [lo, hi], btype="band", fs=SR, output="sos")
    return signal.sosfilt(sos, x)


def _lp(x, f, order=2):
    return signal.sosfilt(signal.butter(order, f, fs=SR, output="sos"), x)


def _hp(x, f, order=2):
    return signal.sosfilt(signal.butter(order, f, btype="high", fs=SR, output="sos"), x)


def wind(n, t, rng, pan_seed):
    """Two bands of air whose loudness follows slow gusts."""
    r = np.random.default_rng(pan_seed)
    g = np.zeros_like(t)
    for f, ph, a in [(0.07, r.uniform(0, 6), 0.5), (0.13, r.uniform(0, 6), 0.3), (0.31, r.uniform(0, 6), 0.2)]:
        g += a * np.sin(2 * np.pi * f * t + ph)
    gust = 0.55 + 0.45 * g
    low = _lp(_noise(n, rng), 380) * 1.4
    mid = _bp(_noise(n, rng), 500, 1800) * 0.45
    return (low + mid * gust) * gust


def rustle(n, t, rng):
    """Leaves: high band noise gated by sparse soft grains."""
    hi = _bp(_noise(n, rng), 3200, 9000)
    grains = np.zeros(n)
    for start in rng.uniform(0, t[-1], int(t[-1] * 9)):
        i = int(start * SR)
        L = int(rng.uniform(0.05, 0.25) * SR)
        if i + L < n:
            grains[i:i + L] += np.hanning(L) * rng.uniform(0.2, 1.0)
    grains = _lp(grains, 30)
    return hi * (0.25 + grains)


def drone(n, t, swell):
    """Low organic texture: detuned partials on D with slow beating, opened
    by a filter as the scene develops. Deliberately not a chord or melody."""
    out = np.zeros(n)
    for f, a in [(73.42, 1.0), (110.0, 0.55), (146.83, 0.35), (220.0, 0.18), (329.6, 0.08)]:
        for det in (-0.35, 0.35):
            ph = np.random.default_rng(int(f * 10 + det * 100)).uniform(0, 6.28)
            out += a * np.sin(2 * np.pi * (f + det) * t + ph)
    out *= 0.6 + 0.4 * np.sin(2 * np.pi * 0.11 * t) ** 2
    return _lp(out, 900) * swell


def mineral(n, t, at, base, length, rng, level=1.0):
    """A soft glassy tone: inharmonic partials, gentle attack, long decay."""
    out = np.zeros(n)
    tt = t - at
    on = tt >= 0
    for ratio, a, dec in [(1.0, 1.0, 1.0), (2.756, 0.45, 0.55), (5.404, 0.18, 0.3), (8.93, 0.06, 0.18)]:
        f = base * ratio
        env = np.where(on, (1 - np.exp(-np.clip(tt, 0, None) / 0.06)) *
                       np.exp(-np.clip(tt, 0, None) / (length * dec)), 0)
        out += a * env * np.sin(2 * np.pi * f * tt + rng.uniform(0, 6.28))
    return out * level


def reverb(x, rng, seconds=3.2):
    L = int(seconds * SR)
    tt = np.arange(L) / SR
    ir = np.stack([_noise(L, rng), _noise(L, rng)], 1) * np.exp(-tt / (seconds / 6.5))[:, None]
    ir[:, 0] = _lp(ir[:, 0], 6500)
    ir[:, 1] = _lp(ir[:, 1], 6000)
    ir /= np.sqrt((ir ** 2).sum(0))
    return np.stack([signal.fftconvolve(x[:, c], ir[:, c])[:len(x)] for c in range(2)], 1)


def soft_limit(x, knee=0.6, ceiling=0.84):
    """Gentle limiter: transparent below the knee, rounds peaks off above it
    and never exceeds the ceiling (-1.5 dBFS)."""
    a = np.abs(x)
    room = ceiling - knee
    y = np.where(a > knee, knee + room * np.tanh((a - knee) / room), a)
    return np.sign(x) * y


def write_wav(path, x):
    x = np.clip(x, -1, 1)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((x * 32767).astype("<i2").tobytes())


def scene01(path, duration, tl, seed=11):
    rng = np.random.default_rng(seed)
    n = int(duration * SR)
    t = np.arange(n) / SR

    bed = np.stack([wind(n, t, rng, 1), wind(n, t, rng, 2)], 1) * 0.16
    bed += np.stack([rustle(n, t, rng), rustle(n, t, rng)], 1) * 0.05
    swell = np.clip(t / duration, 0, 1) ** 1.3
    d = drone(n, t, swell) * 0.07
    bed += np.stack([d, d], 1)

    acc = np.zeros((n, 2))
    # (element, base pitch Hz, decay s, level, pan -1..1)
    for name, base, length, lvl, pan in [
        ("created_by_nature", 1318.5, 1.6, 0.05, -0.35),
        ("logo_ga", 587.3, 3.2, 0.09, 0.0),
        ("wordmark", 1760.0, 1.4, 0.035, 0.25),
        ("descriptor", 2217.5, 1.1, 0.025, -0.2),
        ("url", 2637.0, 1.0, 0.02, 0.3),
    ]:
        tone = mineral(n, t, tl[name][0] + 0.15, base, length, rng, lvl)
        acc[:, 0] += tone * (1 - pan) / 2
        acc[:, 1] += tone * (1 + pan) / 2
    # A breath of air rising into the logo.
    a0 = tl["logo_ga"][0]
    breath = _bp(_noise(n, rng), 700, 4000) * _env(t, a0 - 1.2, a0 + 0.4, 1.4, 0.4) * 0.05
    acc += np.stack([breath, breath], 1)

    wet = reverb(acc + bed * 0.3, rng)
    mix = bed + acc * 0.55 + wet * 0.7
    mix *= _env(t, 0, duration, 1.2, 0.6)[:, None]
    mix = _hp(mix.T, 35).T
    mix *= 0.72 / np.max(np.abs(mix))         # about -15 LUFS, peak -3 dBFS
    write_wav(path, mix)


def reel(path, duration, tl1, tl, seed=11):
    """Full reel: Scene 01's forest, then the air thins into a quieter,
    mineral space for the editorial pages; the low texture grows towards the
    philosophy lines and resolves into silence."""
    rng = np.random.default_rng(seed)
    n = int(duration * SR)
    t = np.arange(n) / SR
    a, b = tl["to_gradient"]

    # Forest: wind stays as air (lower), the leaf rustle leaves with the trees.
    forest = np.clip((b + 0.6 - t) / (b + 0.6 - a), 0, 1)
    wind_lvl = 0.35 + 0.65 * forest
    bed = np.stack([wind(n, t, rng, 1), wind(n, t, rng, 2)], 1) * 0.16 * wind_lvl[:, None]
    bed += np.stack([rustle(n, t, rng), rustle(n, t, rng)], 1) * 0.05 * forest[:, None]

    # Low texture develops across the whole film, fuller in the finale.
    swell = np.clip(t / tl["s5"]["in"][2], 0, 1) ** 1.2
    d = drone(n, t, 0.35 + 0.65 * swell) * 0.07
    bed += np.stack([d, d], 1)
    # From Our Approach on, an airy resonant shimmer joins the low texture.
    air = _bp(_noise(n, rng), 1800, 2600, order=3) * _env(t, tl["s4"]["in"] - 1, duration, 3.0, 2.0) * 0.05
    bed += np.stack([air, _bp(_noise(n, rng), 1800, 2600, order=3) * _env(t, tl["s4"]["in"] - 1, duration, 3.0, 2.0) * 0.05], 1)

    # (time, pitch Hz, decay s, level, pan): D-major-pentatonic glass tones.
    events = [
        (tl1["created_by_nature"][0], 1318.5, 1.6, 0.05, -0.35),
        (tl1["logo_ga"][0], 587.3, 3.2, 0.09, 0.0),
        (tl1["wordmark"][0], 1760.0, 1.4, 0.035, 0.25),
        (tl1["descriptor"][0], 2217.5, 1.1, 0.025, -0.2),
        (tl1["url"][0], 2637.0, 1.0, 0.02, 0.3),
        (tl["s2"]["in"], 880.0, 2.2, 0.05, -0.15),
        (tl["s3"]["in"], 987.8, 2.2, 0.05, 0.15),
        (tl["s4"]["in"], 740.0, 2.4, 0.05, -0.1),
        (tl["s5"]["in"][0], 587.3, 2.6, 0.06, -0.25),
        (tl["s5"]["in"][1], 740.0, 2.6, 0.06, 0.25),
        (tl["s5"]["in"][2], 880.0, 3.6, 0.07, 0.0),
    ]
    # Body lines: a barely-there glint as each line is written.
    hi = [2349.3, 2637.0, 2960.0, 3520.0, 3951.1]
    for k, count in (("s2", 5), ("s3", 4), ("s4", 4)):
        for i in range(count):
            at = tl[k]["in"] + tl["line_delay"] + i * tl["stagger"]
            events.append((at, hi[(i + len(k)) % len(hi)], 0.7, 0.008, (-1) ** i * 0.4))

    acc = np.zeros((n, 2))
    for at, base, length, lvl, pan in events:
        tone = mineral(n, t, at + 0.15, base, length, rng, lvl)
        acc[:, 0] += tone * (1 - pan) / 2
        acc[:, 1] += tone * (1 + pan) / 2
    # Resolution under the last philosophy line: a deep, slow bloom on D.
    t3 = tl["s5"]["in"][2]
    bloom = mineral(n, t, t3 + 0.1, 146.83, 4.0, rng, 0.10)
    acc += np.stack([bloom, bloom], 1)
    # Breath of air rising into the logo, and into the gradient.
    for a0, lvl in ((tl1["logo_ga"][0], 0.05), (a + 0.4, 0.035)):
        br = _bp(_noise(n, rng), 700, 4000) * _env(t, a0 - 1.2, a0 + 0.4, 1.4, 0.4) * lvl
        acc += np.stack([br, br], 1)

    wet = reverb(acc + bed * 0.3, rng)
    mix = bed + acc * 0.55 + wet * 0.7
    e0, e1 = tl["end_fade"]
    mix *= _env(t, 0, e1 + 0.2, 1.2, (e1 + 0.2) - e0)[:, None]
    mix = _hp(mix.T, 35).T
    # The quiet editorial pages pull the average down, so the reel is set
    # ~2.7 dB hotter than Scene 01 and its glass-tone peaks are rounded off:
    # about -15 LUFS integrated, peaks under -1.5 dBFS.
    mix *= 0.98 / np.max(np.abs(mix))
    write_wav(path, soft_limit(mix))
