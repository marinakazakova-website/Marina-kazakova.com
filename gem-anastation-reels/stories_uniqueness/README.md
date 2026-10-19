# Stories — The Uniqueness of Every Gemstone / Our Approach

Three Stories, 1080 × 1920, G.A. Gemstone Zine.

| File | Story |
|---|---|
| `output/GA_Story_01_Nature.png` | Created by Nature — minimal cover on the brand gradient, original GA monogram only |
| `output/GA_Story_02_Expert.png` | Curated by Expert — photo DSCF4197 + ivory text field |
| `output/GA_Story_03_Connect.png` | You Connect — brand gradient, typographic |
| `output/GA_Stories_Uniqueness_preview.png` | All three side by side |

House rule applied: rubric centred at y = 140 (AvantGarde caps 17 px,
0.42 em; gold on dark), website line text top y = 1744, side margins 96 px,
main type above y = 1670. Story 03 has no rubric.

Edit copy and positions in `stories.html` (shared system: `../founder/founder.css`).
```
python3 tools/logo_layer.py -60 --mono # original GA monogram, transparent
NODE_PATH=$(npm root -g) node tools/export.mjs
```
