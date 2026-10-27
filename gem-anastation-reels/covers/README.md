# G.A. Gemstone Zine — photographic cover template (1080 × 1350)

A cover = full-bleed photo + title + website line. Nothing else: no frames,
panels, gradient plates, logo or rubric.

## Fixed parameters
| Element | Spec |
|---|---|
| Photo | full bleed, uniform scale to 1080 wide, vertical crop only (`tools/prepare.py`) |
| Title | GFS Didot caps, 114 px, tracking 0.035 em, one line, centred on x = 540 (optically: trailing tracking offset by text-indent) |
| Title position | cap top y = 200, baseline ≈ y = 280 (CSS top 185 px, line-height 1) |
| Title width | ≈ 850 px for GEMS OF ASIA; longer titles: lower the size until the line fits 888 px (96 px margins), never wrap |
| Title colour | navy #102537 on light / mid-tone skies; on a dark sky use ivory #F3EEE5 |
| Website line | WWW.GEMANASTATION.COM, the approved rendered line, text top y = 1228, x 382–695 (centred) |
| Website colour | per photo: mean colour of the band behind it (y 1205–1255, x 360–720) moved 45 % toward ivory if that band is dark (luminance < 0.5), toward navy if light; 90 % opacity |

Measured from the approved sketches: their guide lines sit at y 112 and
y 1228 (the post service-line rule); title cap height 74–81 px, width ≈ 834 px.

## Files
- `output/GA_Cover_GemsOfAsia_river.png` — website line #A3A097
- `output/GA_Cover_GemsOfAsia_mountain.png` — website line #88958F

New cover: add the photo and crop offset to `COVERS` in `tools/prepare.py`,
a `<section class="cover">` in `covers.html`, then
`python3 tools/prepare.py && NODE_PATH=$(npm root -g) node tools/export.mjs`.
