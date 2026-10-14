# Gem AnaStation — Editorial Brand Reel (Issue 01)

Instagram Reels film built from the five original 4:5 layouts.
Output: 1080 × 1920, 9:16, 30 fps, H.264 MP4, AAC 48 kHz.

## Status
- [x] Scene 01 — CREATED BY NATURE (test fragment, 6.0 s) — approved
- [x] Scenes 02–05 — gradient editorial pages
- [x] Full reel, 26.0 s — `output/GA_reel_issue01.mp4` (sound) and
      `output/GA_reel_issue01_silent.mp4`, laid out to the house rule below;
      storyboard `output/GA_reel_issue01_storyboard.jpg`
- [x] Static Stories, 5 × 1080×1920 — `output/stories/GA_story_01–05` (PNG master + JPG for upload);
      re-build with `python3 tools/stories.py`

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
  extract_gradient.py layouts 02-05 -> clean gradient plate + one layer per text line
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
python3 tools/extract_gradient.py
python3 tools/render.py reel                  # full reel: MP4 with sound + silent (~8 min)
python3 tools/render.py scene01               # Scene 01 test fragment
python3 tools/render.py reel --still 7.6 21.5 # PNG frames at given times
```
All timings and positions are at the top of `tools/render.py`:
`TIMELINE_S1` / `LAYOUT_S1` (Scene 01), `TIMELINE_REEL` / `LAYOUT_GRAD`
(Scenes 02–05). Changing a number there and re-running is the whole edit
cycle; the soundtrack follows the same timeline automatically.

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

## Full reel timeline
| Time (s) | Scene | Event |
|---|---|---|
| 0.0–5.5 | 01 Created by Nature | As approved (above) |
| 5.4–6.9 | → 02 | Type dissolves; the forest defocuses into the brand gradient; the website line stays |
| 6.5–11.6 | 02 Gem AnaStation | Heading, then body lines written left to right; hold to read |
| 11.5–16.0 | 03 Our Mission | Same grammar; soft darkening of the light into the next page |
| 16.1–20.8 | 04 Our Approach | Same grammar |
| 20.8–25.8 | 05 Philosophy | Nature creates / Expert curates / Human connects, one by one; fade to black |

Gradient pages: the clean plate is rebuilt from real pixels (the four
layouts share an identical background), then animated with a very slow
drift, a travelling turquoise (#439090) light and faint refraction caustics.

Sound: original synthesis (`tools/soundscape.py`) — forest air and leaves
that thin out when the gradient arrives, a low organic texture that grows
to the finale, glass-like accents on headings and on each philosophy line,
a deep resolving tone on "Human connects". About −15 LUFS, peaks < −1.5 dBFS.

## Service lines — house rule (shared with the Founder series)
| Format | Top rubric (text top) | Website line (text top) | Axis |
|---|---|---|---|
| Post 1080×1350 | y ≈ 112 | y = 1228 (127 px from the bottom) | x = 540 |
| Stories / reel 1080×1920 | y = 139 | y = 1744 (181 px from the bottom = 127 × 1920/1350) | x = 540 |

Main type stays between y = 250 and y = 1500; the monogram block is centred
at y ≈ 900. The forest layout's website line is shifted 12 px right so it
stands on the 540 axis like the others.

Reel note: in the Reels feed the caption, username and audio line cover the
bottom ~420 px, so the website line at y = 1744 sits under them there. The
previous reel, with the line at y = 1485 inside the Reels-safe area, is kept as
`output/GA_reel_issue01_v1_reels-zone.mp4` (+ `_silent`).
