// GEMS IN EVERY COLOR — colour pages (1080×1350). One template, one entry per
// colour in PAGES. Stone photos: transparent cut-outs in sources/ (real photos
// supplied by the client; white backgrounds removed with
// ../gems_of_asia/tools/cutout_gems.py — stones never altered).
// Usage: NODE_PATH=$(npm root -g) node tools/build.mjs [green]
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import path from "node:path";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const PAGES = {
  green: {
    title: "Green", color: "#2F6B4F", sub: "Green is not just emerald.",
    stones: ["Emerald", "Green Tourmaline", "Peridot", "Tsavorite", "Demantoid"],
  },
};
const id = process.argv[2] || "green";
const P = PAGES[id];
const file = (n) => `sources/${id}_${n.toLowerCase().replace(/ /g, "_")}.png`;
const missing = P.stones.map(file).filter((f) => !fs.existsSync(path.join(root, f)));
if (missing.length) console.warn("MISSING stone photos (empty slots):\n  " + missing.join("\n  "));

// Grid 3 + 2: 230 px stone boxes; row 1 at x centres 228 / 540 / 852, row 2 at 384 / 696.
const D = 230, rows = [[228, 540, 852], [384, 696]], tops = [560, 900];
let k = 0;
const cells = rows.map((xs, r) => xs.map((cx) => {
  const n = P.stones[k++], f = file(n), has = fs.existsSync(path.join(root, f));
  return `<figure class="stone" style="left:${cx - 140}px; top:${tops[r]}px">
    <div class="pic">${has ? `<img src="${f}" alt="${n}">` : ""}</div><figcaption>${n}</figcaption></figure>`;
}).join("\n")).join("\n");

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Gems in Every Color — ${P.title}</title>
<link rel="stylesheet" href="../founder/founder.css">
<style>
  @font-face { font-family: "Didot"; src: url(../brand/fonts_licensed/Didot-Regular.ttf); }
  body { margin: 0; }
  .slide { position: relative; width: 1080px; height: 1350px; background: var(--ivory); overflow: hidden; }
  .rubric { position: absolute; left: 0; width: 1080px; top: 112px; text-align: center; font-family: "AvantGarde";
    font-size: 17px; letter-spacing: .42em; text-indent: .42em; text-transform: uppercase; line-height: 1; color: #2D5240; }
  .title { position: absolute; left: 92px; top: 214px; font-family: "Didot"; font-size: 170px; line-height: 1;
    letter-spacing: .01em; text-transform: uppercase; color: ${P.color}; }
  .sub { position: absolute; left: 96px; top: 420px; font-family: "AvantGarde"; font-size: 19px;
    letter-spacing: .3em; text-transform: uppercase; color: #102537; }
  .stone { position: absolute; margin: 0; width: 280px; text-align: center; }
  .pic { width: ${D}px; height: ${D}px; margin: 0 auto; display: flex; align-items: center; justify-content: center; }
  .pic img { max-width: 100%; max-height: 100%; filter: drop-shadow(0 14px 14px rgba(16,37,55,.18)); }
  .pic:empty { border: 1px dashed rgba(16,37,55,.25); border-radius: 50%; }
  figcaption { margin-top: 22px; font-family: "AvantGarde"; font-size: 22px; color: #102537; }
</style></head><body><section class="slide" id="page">
  <div class="rubric">Created by Nature</div>
  <div class="title">${P.title}</div>
  <div class="sub">${P.sub}</div>
  ${cells}
  <img src="build/url_on_light.png" style="position:absolute; left:375px; top:1223px" width="351" height="23" alt="www.gemanastation.com">
</section></body></html>`;
fs.writeFileSync(path.join(root, `page_${id}.html`), html);

const { chromium } = createRequire(import.meta.url)("playwright");
const b = await chromium.launch({ args: ["--force-color-profile=srgb"] });
const pg = await b.newPage({ viewport: { width: 1080, height: 1350 } });
await pg.goto("file://" + path.join(root, `page_${id}.html`));
await pg.evaluate(() => document.fonts.ready);
await pg.waitForLoadState("networkidle");
const out = missing.length ? `build/draft_${id}.png` : `output/GA_GemsInEveryColor_${id}.png`;
await pg.locator("#page").screenshot({ path: path.join(root, out) });
await b.close();
console.log("written", out);
