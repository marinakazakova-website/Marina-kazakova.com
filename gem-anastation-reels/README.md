# Gem AnaStation — Editorial Brand Reel (Issue 01)

Instagram Reels film built from the five original 4:5 layouts.
Output: 1080 × 1920, 9:16, 30 fps, H.264 MP4, AAC 48 kHz.

## Status
- [x] Scene 01 — CREATED BY NATURE (test fragment, 6.0 s) — **awaiting approval**
- [ ] Scenes 02–05 — gradient editorial slides
- [ ] Full reel (~25 s), with and without sound

## Principle
No text or logo is re-typeset or AI-generated. Every gold pixel comes from
the supplied layouts: they are separated into transparent layers and
re-composited over an animated background. The forest behind the type is
restored with real texture from the same photograph (no generative fill).

## Structure
```
sources/   original layouts (01–05), untouched
tools/
  extract_forest.py  layout 01 -> clean forest plate + logo/type layers
  render.py          scene timeline, layout, camera, foliage motion, encode
  soundscape.py      synthesised organic-ambient score (no samples: fully owned,
                     cleared for commercial use)
build/layers/        extracted layers (PNG with alpha) — regenerable
output/              rendered films and preview frames
```

## Re-render
```
pip install numpy scipy opencv-python-headless pillow   # + ffmpeg
python3 tools/extract_forest.py
python3 tools/render.py scene01               # MP4 with sound + silent
python3 tools/render.py scene01 --still 5.8   # one frame as PNG
```
Timings (`TIMELINE_S1`) and positions in the 9:16 frame (`LAYOUT_S1`) are
at the top of `tools/render.py`.

## Scene 01 timeline
| Time (s) | Event |
|---|---|
| 0.0–1.6 | Forest opens from black; wind in the canopy, slow push-in begins |
| 1.3–2.7 | CREATED BY NATURE resolves from soft focus |
| 2.5–4.0 | GA monogram fades in (opacity only — never scaled or distorted) |
| 2.9–4.6 | One soft light pass across the monogram, like light inside a stone |
| 3.4–4.5 | GEM ANASTATION |
| 4.1–5.3 | NATURE • GEMSTONE • IDENTITY, then the website |
| 5.3–6.0 | Hold |

## Safe zone
Type sits between y = 300 and y = 1500 (Reels UI covers the bottom ~420 px
and the top bar); the monogram block is centred at y ≈ 900.
