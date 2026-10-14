# G.A. Gemstone Zine — Issue 01 — FOUNDER carousel

Four Instagram carousel slides, 1080 × 1350 (4:5), sRGB PNG.
Status: **preview for approval** — final export after sign-off.

| File | Slide |
|---|---|
| `output/GA_founder_01_cover.png` | 01 Cover — supplied file, untouched |
| `output/GA_founder_02_craft.png` | 02 Craft |
| `output/GA_founder_03_expertise.png` | 03 Expertise |
| `output/GA_founder_04_identity.png` | 04 Identity / closing statement |
| `output/GA_founder_preview.png` | All four side by side |

## Editable source
- `carousel.html` — all copy, type sizes, colours (CSS variables) and positions.
- `tools/grade.py` — photo colour grade (parameters at the top).
- `tools/url_tints.py` — website line, reused from the earlier GA layouts.
- `tools/export.mjs` — exports the PNGs and the preview.

```
python3 tools/grade.py
python3 tools/url_tints.py
NODE_PATH=$(npm root -g) node tools/export.mjs
```

## Fonts
The licensed brand fonts were not supplied, so free equivalents are used:

| Brand font | Stand-in | Note |
|---|---|---|
| Didot (italic headlines, caps title) | Bodoni Moda | same Didone class, high contrast |
| AvantGarde (body) | URW Gothic | metric clone of ITC Avant Garde Gothic |
| Consolas (editorial marks) | Inconsolata | designed as a Consolas counterpart |

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
