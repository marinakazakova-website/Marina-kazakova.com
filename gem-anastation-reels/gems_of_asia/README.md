# GEMS OF ASIA — carousel, slide 02: THE GEMSTONE MAP

1080 × 1350 (4:5). Output: `output/GA_GemsOfAsia_02_map.png`.

## Geography
- Natural Earth admin-0 countries, 1:50m (npm `world-atlas` 2.0.2, public
  domain data), projected with `d3-geo`: Lambert azimuthal equal-area
  centred on 103°E 22°N (true shapes and areas for the whole region).
- Boundaries follow Natural Earth's de facto lines (incl. Kashmir).
- Markers mark countries, not deposits. The build fails if any marker is
  not inside its own country polygon.

## Design
| Element | Spec |
|---|---|
| Background | #102537, flat |
| Coastlines | white, 1.1 px, 90 % |
| Borders | white, 0.8 px, 42 % |
| Graticule | white, 6 % (barely visible atlas grid) |
| Map area | y 296–893, full width (client-marked); nothing of the map leaves it |
| Markers | #439090 |
| Country names | #BBA375, AvantGarde caps 20 px, 0.12 em, with a background-coloured halo |
| Rubric | CREATED BY NATURE — post rule: centred, y = 112, AvantGarde 17 px, 0.42 em, #B4996C |
| Title | THE GEMSTONE MAP — Didot caps 58 px, off-white |
| Copy | AvantGarde 23 px / 1.6, x = 96 |
| Website line | WWW.GEMANASTATION.COM — post rule: text top y = 1228, x 382–695, #B4996C (no logo on this slide) |

Mainland South-East Asia (Myanmar, Thailand, Vietnam, Cambodia, Malaysia)
is labelled in one right-aligned column in the Indian Ocean with thin,
non-crossing leaders; positions are in `COUNTRIES` in the script.

## Build
```
npm install
NODE_PATH=$(npm root -g) node tools/build.mjs   # needs playwright
```

# Slide 03: SOUTHEAST ASIA / PART I

Output: `output/GA_GemsOfAsia_03_southeast_asia_I.png`. Build:
`python3 tools/cutout_gems.py && NODE_PATH=$(npm root -g) node tools/build03.mjs`.

- Top 648 px (48 %): client landscape photo, navy legibility veil, real
  outlines of Thailand, Vietnam and Cambodia (Natural Earth, Mercator),
  filled #439090 at 38 %, markers #439090, labels off-land with leaders.
- Bottom: ivory field, Didot caps heading, AvantGarde copy, three client
  gem photos (white background removed by `tools/cutout_gems.py`, stone
  untouched) in 216 px discs; country #439090, mineral in Didot italic.
- Website line on the post rule (y = 1228), gold arrow on the right margin.
