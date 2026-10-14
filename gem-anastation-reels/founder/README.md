# G.A. Gemstone Zine — Issue 01 — FOUNDER carousel

Four Instagram carousel slides, 1080 × 1350 (4:5), sRGB PNG.
Status: **revision 2** — client comments applied (editorial marks removed,
slide 04 signature in one left-aligned column, FOUNDER STORY added to the cover).

| File | Slide |
|---|---|
| `output/GA_founder_01_cover.png` | 01 Cover — supplied file; only the FOUNDER STORY line added (centred on x = 540) |
| `output/GA_founder_02_craft.png` | 02 Craft |
| `output/GA_founder_03_expertise.png` | 03 Expertise |
| `output/GA_founder_04_identity.png` | 04 Identity / closing statement |
| `output/GA_founder_preview.png` | All four side by side |

## Stories (1080 × 1920)
`output/stories/GA_founder_story_01_cover.png` … `_04_identity.png` and
`GA_founder_story_preview.png`. Same system as the carousel, re-proportioned
for 9:16: taller photo bands, type inside the Stories safe zone; the website
line keeps the post's bottom margin scaled to 9:16 (y = 1739, 181 px from the
bottom edge).
Cover: the approved cover is kept whole and bottom-aligned; the plain studio
wall above it is extended tonally (`tools/extend_cover.py`, no generative
fill — the seam differs by < 1 level). FOUNDER STORY sits at the top of the
frame (y = 140), inside the Stories profile-bar zone by client choice.

## Editable source
- `founder.css` — shared type, colours (CSS variables) and components.
- `carousel.html` / `stories.html` — copy and positions per format.
- `tools/extend_cover.py` — 9:16 cover for Stories.
- `tools/grade.py` — photo colour grade (parameters at the top).
- `tools/url_tints.py` — website line, reused from the earlier GA layouts.
- `tools/export.mjs` — exports the PNGs and the preview.

```
python3 tools/grade.py
python3 tools/url_tints.py
python3 tools/extend_cover.py
NODE_PATH=$(npm root -g) node tools/export.mjs carousel
NODE_PATH=$(npm root -g) node tools/export.mjs stories
```

## Fonts
The licensed brand fonts were not supplied, so free equivalents are used:

| Brand font | Stand-in | Note |
|---|---|---|
| Didot (italic headlines, caps title) | Bodoni Moda | same Didone class, high contrast |
| AvantGarde (body) | URW Gothic | metric clone of ITC Avant Garde Gothic |
| Consolas (signature details, slide 04) | Inconsolata | designed as a Consolas counterpart |

To use the originals, put the font files in `fonts/` and point the
`@font-face` rules at the top of `carousel.html` to them.

## Design decisions
- Headline green `#2D5240` is sampled from the cover's ANASTASIA, so the
  story reads as a continuation of the cover.
- Ivory text field `#F3EEE5`; Champagne Gold `#B4996C` from the guide,
  deepened to `#8E7550` for marks and the website line on ivory (contrast).
- Slides 02 and 03 mirror each other (headline left/body right, then
  headline right/body left) for a page-turn rhythm.
- Slide 04 uses the same brand gradient as the earlier Issue 01 posts.
- Website line: the exact rendered URL from the earlier layouts, same
  position (y = 1223) on every slide.
