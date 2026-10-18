# Gem AnaStation — Brand Pitch Deck

Luxury editorial layout of the approved GA_PITCH DECK (10 slides, 16:9, 1920 × 1080).
Brand foundation: `../gem-anastation-reels/brand/BRAND.md` + GA_Identity.pdf.

## Status
- [x] Stage 1 — analysis of the three sources
- [x] Stage 2 — design system (below, tokens in `src/deck.css`)
- [x] Stage 3 — test slides 02 ABOUT BRAND, 06 OUR METHOD, 07 OUR PRODUCT — **awaiting approval**
- [ ] Stage 4 — remaining slides 01, 03, 04, 05, 08, 09, 10
- [ ] Stage 5 — PPTX build (same coordinates) + PDF, full check

## Files
```
src/deck.html, deck.css    HTML/CSS master, every element absolutely positioned
assets/logo_ga_gold.png    gold GA logo from GA_Identity p.1 (1209 px source)
assets/gradients/          brand gradients from GA_Identity p.1/p.10 (originals) + built surfaces
fonts/licensed/            Didot, AvantGarde — client-licensed, NOT in git (public repo)
fonts/                     Inconsolata (Consolas stand-in), URW Gothic (ё/Ё only)
tools/export.mjs           HTML → output/GA_slide_XX.png + output/GA_pitch_deck.pdf
tools/surfaces.py          gradient surfaces (rotate 9:16 → 16:9, soften, fine grain)
tools/repair_avantgarde.py makes the 1992 AvantGarde.ttf loadable (cmap rewrite only)
```
Re-build: put the client's `Didot.ttc` and `AvantGarde.ttf` into `fonts/licensed/`, then
```
pip install fonttools pillow numpy
python3 tools/repair_avantgarde.py          # also split Didot.ttc → Didot-Regular/Italic/Bold.ttf
python3 tools/surfaces.py
NODE_PATH=$(npm root -g) node tools/export.mjs
```

## Design system
**Grid.** 12 columns, margins 96, gutter 24, column 122 (step 146). Column *k* starts at
x = 96 + (k−1)·146. Content band y 128 → 952; above and below it only navigation.

**Navigation** (every slide, never covered): `GA | SECTION` top-left, AvantGarde 14, tracking .3 em;
`NN / 11` top-right, Consolas 14; `CREATED BY NATURE` bottom centre, AvantGarde 14, tracking .4 em.
All at 56 px from the edge, gold on dark, Deep Navy on light surfaces.

**Type.**
| Role | Font | Size |
|---|---|---|
| Latin display (titles, leads) | Didot Regular | 56–68 |
| Latin statement caps | Didot Regular, caps, tracking .1 em | 60 |
| Cyrillic display (quotes, names) | Didot **Bold** — the only Didot face with Cyrillic | 30–40 |
| Numerals | Didot **Italic** — lining figures (Regular has old-style only) | 88–150 |
| Rubrics | AvantGarde caps, tracking .3 em | 15–22 |
| Body | AvantGarde | 18–22, leading 1.5 |
| Technical | Consolas caps, tracking .2 em | 12–14 |

**Colour.** Surfaces: Deep Navy (base), Dark Petrol, Deep Teal, Blue Grey, Muted Gold
#B4996C (contrast block), brand gradients. Text: gold, white (86 % for body), Deep Navy on gold.

**Image placeholders.** `.ph` box: palette fill, gold hairline frame inset 20 px,
label `IMAGE PLACEHOLDER` + size. A photo dropped in as `<img>` fills it with
`object-fit: cover`, so the composition never changes.

## Open points (reported to the client, not changed)
- Folios read `01/11 … 10/11` for 10 slides; source also mixes `01/11` and `02 / 11` — unified to `NN / 11`.
- Source has `2 — BESPOKE JEWELRY`; the brief has `02` — set as `02`.
- Years of expertise differ: slide 02 «Более 18 лет», slide 03 «20+», slide 05 «20 лет».
- Fonts: Didot Regular/Italic have no Cyrillic; AvantGarde has no ё/Ё and no →;
  Consolas, Aquila, Santa Catarina not supplied.
