# Gem AnaStation — brand passport

The shared foundation for every Gem AnaStation project (SMM, presentation,
print). Read this first. Everything here was approved in the SMM work
(Issue 01, October 2026): the reel, the Stories, the Founder carousel.

## Brand
Independent colored-gemstone and bespoke jewelry brand, founded in Bangkok.
Founder: Anastasia — gem expert & founder.
Mission: open the world of colored gemstones to people and help each person
find their own — a gemstone as a conscious personal choice, not a symbol of luxury.
Philosophy: **Nature creates · Expert curates · Human connects.**
Descriptor: NATURE • GEMSTONE • IDENTITY. Website: www.gemanastation.com
Editorial series: G.A. Gemstone Zine (Issue 01 / October 2026).

## Style
Contemporary luxury editorial, independent magazine; refined typography,
quiet confidence; deep natural colors, gold type, a lot of air, minimalism.
Never: template Instagram cards, commercial-jewelry clichés, decorative
overload, heavy shadows under text, acid colors, cold pure white fields,
glitch / flash / bounce, 3D logo spins, slide-flip transitions.

## Colour
Design palette (visual guide):

| Name | HEX |
|---|---|
| Turquoise | #439090 |
| Slate Blue Grey | #4F5E6D |
| Deep Teal | #1A4043 |
| Dark Blue Grey | #213643 |
| Dark Petrol | #15343B |
| Midnight Navy | #102537 |

Text: Black, White, **Champagne Gold #B4996C** (sampled from the guide).
Working colours established in the SMM work:

| Use | HEX |
|---|---|
| Gold on dark backgrounds | #B4996C |
| Gold deepened for ivory backgrounds (contrast) | #8E7550 |
| Title green (from the Founder cover, "ANASTASIA") | #2D5240 |
| Warm ivory text field | #F3EEE5 |
| Body text on ivory | #1C1C1C |

## Type
| Role | Brand font | Stand-in in `fonts/` (until the licensed files arrive) |
|---|---|---|
| Titles | Didot (also Aquila, Santa Catarina decorative) | Bodoni Moda (Regular / Italic) — same Didone class |
| Text | AvantGarde | URW Gothic (Book / Demi) — metric clone of ITC Avant Garde |
| Small technical / editorial marks | Consolas | Inconsolata |

Italic Didone for editorial headlines; Didone caps with tracking for
statements; AvantGarde caps with wide tracking (≈ 0.4 em) for rubrics and
the website line. Never re-typeset text that exists in a supplied layout —
reuse the rendered original.

## Assets (`assets/`)
| File | What |
|---|---|
| `gradient_dark_4x5.png` | The brand gradient, clean (1080×1350), rebuilt from the original layouts |
| `forest_clean_4x5.png` | Forest photograph without type (1080×1350) |
| `logo_ga_extracted.png` | GA monogram, transparent, extracted from a layout — 260 px wide, **screen only**; a vector logo (SVG/PDF) is still needed for print and large slides |
| `url_on_dark.png` / `url_on_light.png` | The website line exactly as set in the layouts, tinted for dark / ivory |
| `visual_guide.webp` | The official visual guide (InstaZine) |

## Service lines — house rule
| Format | Top rubric (text top) | Website line (text top) | Axis |
|---|---|---|---|
| Post 1080×1350 | y ≈ 112 | y = 1228 (127 px from the bottom, 9.4 %) | centred, x = 540 |
| Stories 1080×1920 | y = 139 | y = 1744 (181 px from the bottom = 127 × 1920/1350) | centred, x = 540 |

Side margins 96 px. Signature blocks: one left-aligned column. No page
numbers, chapter numbers or rubric codes on finished layouts.
Stories: keep main type between y = 250 and y = 1670.
Reels: the feed covers the bottom ~420 px (caption, account, audio), so in a
reel meant for the Reels feed keep the website line at y ≈ 1485.

## Photography grade
Global tonal operations only (see `../founder/tools/grade.py`): saturation
slightly down with skin and stones protected, whites brought down to ivory
with a soft shoulder, gentle warmth in the highlights only, softer mid
contrast, deep shadows kept, fine grain. Never alter hands, stones, tools
or sketches; never generate objects.

## Where the SMM work lives
`../` — reel and Stories tools (`tools/`), outputs (`output/`);
`../founder/` — Founder carousel and Stories (HTML/CSS + export script).

## Didot (licensed)
Headings use Apple Didot (Regular / Italic / Bold), supplied by the client.
The font files live in `brand/fonts_licensed/` locally and are git-ignored —
they are licensed with the client's Mac and must not be published. To rebuild
in a fresh session, extract them again from the client's `Didot.ttc`
(`fontTools.ttLib.TTCollection`) into that folder.

## Covers — type 1 title (rule)
The main message on a type-1 cover (GEMS OF ASIA, MY TOP 3 GEMS …) is always
the same size on every cover: Apple Didot Bold 106 px, tracking 0.025 em,
centred, one line. Position follows the photo (top on a landscape, under the
stone on a stone shot). If a title would not fit the width at that size,
shorten the wording rather than shrink the type.

## Template — GA · FOUNDER'S CHOICE (approved, BLUE SAPPHIRE)
Builder: `founders_choice/tools/prepare_card.py` + `tools/card.mjs` (one entry
per stone in CARDS). Fixed: top block 1080×675 (stone gradient photo turned
horizontal, darkened; title Didot Bold 106 px gold #BBA375, cap top 320;
author's text AvantGarde 20.5 px white, centred, under the title), bottom two
blocks 540×675 with no gaps (left: navy sampled from the gradient, key phrase
Didot Italic 43 px gold, gold hairline at y 1070, signature Didot 28 px gold
"Anastasia / Founder, Gem Expert"; right: portrait cropped from the top),
website line ivory, centred at the bottom over both blocks (text top 1228).
Per card only: gradient photo, stone name, author's text, key phrase, photo.

## Template — GA / NATURE · GEMSTONE · IDENTITY / EDITORIAL GRID
Builder: `editorial_grid/tools/crop.py` + `tools/grid.mjs` (one entry per set).
1080×1350: four equal 540×675 tiles, 2×2, no gaps, filling the whole canvas
(human top-left, nature top-right, colour plaque bottom-left, gemstone
bottom-right). No extra strips. Plaque words Didot caps 40 px, tracking
0.10 em, line pitch 51 px, gold, centred in the plaque tile.
Website line ivory, centred on the canvas over the bottom tiles, text top
1228. Per set: three photos (4:5
crops chosen to keep the client's framing), plaque colour, text colour, words.
