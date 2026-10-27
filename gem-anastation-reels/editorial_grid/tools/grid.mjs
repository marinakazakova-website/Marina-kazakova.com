// GA / NATURE · GEMSTONE · IDENTITY / EDITORIAL GRID — master template.
// 1080×1350: four 540×675 tiles (2×2, no gaps) filling the canvas; website
// line ivory, centred on the canvas over the bottom tiles, text top 1228
// (house rule). Plaque text Didot caps 40 px, tracking 0.10 em, line pitch
// 51 px, gold, centred in the plaque tile.
// Per set: three photos (tools/crop.py), plaque colour, text colour, words.
// Usage: python3 tools/crop.py <set> && NODE_PATH=$(npm root -g) node tools/grid.mjs <set>
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import path from "node:path";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SETS = {
  green_tourmaline: { plaque: "#7888AA", ink: "#D6BF94", words: ["Nature", "Gemstone", "Identity"] },
  lavender_spinel:  { plaque: "#D6B7BC", ink: "#FFFBFB", words: ["Nature", "Gemstone", "Identity"] },
  // light plaque: dark ink, and the website line in the same dark ink so it reads
  dark_rhodolite:   { plaque: "#E7E7E7", ink: "#1E1515", url: "dark", words: ["Nature", "Gemstone", "Identity"] },
};
const id = process.argv[2] || "green_tourmaline", S = SETS[id];
// STORY=1 → 1080×1920, tiles 540×960, website line text top 1744 (Stories rule)
const STORY = process.env.STORY === "1", TH = STORY ? 960 : 675, H = TH * 2, SFX = STORY ? "_story" : "";
const html = `<!doctype html><html><head><meta charset="utf-8">
<style>
  @font-face { font-family: "DidotR"; src: url(../brand/fonts_licensed/Didot-Regular.ttf); }
  body { margin: 0; }
  #page { position: relative; width: 1080px; height: ${H}px; overflow: hidden; background: ${S.plaque}; }
  .t { position: absolute; width: 540px; height: ${TH}px; display: block; }
  .words { position: absolute; left: 0; top: ${TH}px; width: 540px; height: ${TH}px; display: flex; flex-direction: column;
    justify-content: center; align-items: center; font-family: "DidotR"; font-size: 40px; line-height: 51px;
    letter-spacing: .10em; text-indent: .10em; text-transform: uppercase; color: ${S.ink}; }
</style></head><body><section id="page">
  <img class="t" style="left:0;top:0" src="build/${id}_human${SFX}.jpg" alt="">
  <img class="t" style="left:540px;top:0" src="build/${id}_nature${SFX}.jpg" alt="">
  <div class="words">${S.words.map((w) => `<div>${w}</div>`).join("")}</div>
  <img class="t" style="left:540px;top:${TH}px" src="build/${id}_gem${SFX}.jpg" alt="">
  <img src="build/url_${S.url === "dark" ? "dark_ink" : "ivory"}.png" style="position:absolute; left:375px; top:${STORY ? 1739 : 1223}px" width="351" height="23" alt="">
</section></body></html>`;
fs.writeFileSync(path.join(root, `grid_${id}${SFX}.html`), html);
const { chromium } = createRequire(import.meta.url)("playwright");
const b = await chromium.launch({ args: ["--force-color-profile=srgb"] });
const pg = await b.newPage({ viewport: { width: 1080, height: H } });
await pg.goto("file://" + path.join(root, `grid_${id}${SFX}.html`));
await pg.evaluate(() => document.fonts.ready);
await pg.locator("#page").screenshot({ path: path.join(root, `output/${STORY ? "stories/" : ""}GA_EditorialGrid_${id}${SFX}.png`) });
await b.close();
console.log("written", id, SFX);
