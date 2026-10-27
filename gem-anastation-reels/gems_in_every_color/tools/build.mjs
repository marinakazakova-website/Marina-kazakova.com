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
    // [name, mineral species] — the point of the page: five different minerals.
    stones: [["Emerald", "Beryl"], ["Green Tourmaline", "Tourmaline"], ["Peridot", "Olivine"],
             ["Tsavorite", "Grossular garnet"], ["Demantoid", "Andradite garnet"]],
  },
  red: {
    title: "Red", color: "#8C1D2C", sub: "Red is not just ruby.",
    stones: [["Ruby", "Corundum"], ["Red Spinel", "Spinel"], ["Red Garnet", "Almandine garnet"],
             ["Rubellite", "Tourmaline"], ["Red Beryl", "Beryl"]],
  },
};
const id = process.argv[2] || "green";
const P = PAGES[id];
const file = (n) => `sources/${id}_${n.toLowerCase().replace(/ /g, "_")}.png`;
const missing = P.stones.map(([n]) => file(n)).filter((f) => !fs.existsSync(path.join(root, f)));
if (missing.length) console.warn("MISSING stone photos (empty slots):\n  " + missing.join("\n  "));

// Vertical column: stone box 136 px centred at x 380, hairline at x 506,
// name + mineral to the right of it; five rows, 152 px pitch from y 408.
const D = 136, X = 380, TOP = 408, PITCH = 152;
const cells = P.stones.map(([n, m], i) => {
  const f = file(n), has = fs.existsSync(path.join(root, f)), y = TOP + i * PITCH;
  return `<div class="pic" style="left:${X - D / 2}px; top:${y}px">${has ? `<img src="${f}" alt="${n}">` : ""}</div>
  <div class="bar" style="top:${y + 30}px"></div>
  <div class="name" style="top:${y + 36}px">${n}</div>
  <div class="min" style="top:${y + 70}px">${m}</div>`;
}).join("\n");

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Gems in Every Color — ${P.title}</title>
<link rel="stylesheet" href="../founder/founder.css">
<style>
  @font-face { font-family: "Didot"; src: url(../brand/fonts_licensed/Didot-Regular.ttf); }
  body { margin: 0; }
  @font-face { font-family: "Didot Italic"; src: url(../brand/fonts_licensed/Didot-Italic.ttf); }
  .slide { position: relative; width: 1080px; height: 1350px; overflow: hidden;
    background: radial-gradient(ellipse 90% 70% at 50% 42%, #EDEFF1 0%, #E3E6E9 60%, #D9DDE1 100%); }
  .rubric { position: absolute; left: 0; width: 1080px; top: 112px; text-align: center; font-family: "AvantGarde";
    font-size: 17px; letter-spacing: .42em; text-indent: .42em; text-transform: uppercase; line-height: 1; color: #102537; }
  .title { position: absolute; left: 0; width: 1080px; top: 176px; text-align: center; font-family: "Didot";
    font-size: 128px; line-height: 1; letter-spacing: .04em; text-indent: .04em; text-transform: uppercase; color: ${P.color}; }
  .sub { position: absolute; left: 0; width: 1080px; top: 330px; text-align: center; font-family: "AvantGarde";
    font-size: 17px; letter-spacing: .32em; text-indent: .32em; text-transform: uppercase; color: #102537; }
  .pic { position: absolute; width: ${D}px; height: ${D}px; display: flex; align-items: center; justify-content: center; }
  .pic img { max-width: 100%; max-height: 100%; filter: drop-shadow(0 12px 12px rgba(16,37,55,.20)); }
  .pic:empty { border: 1px dashed rgba(16,37,55,.25); border-radius: 50%; box-sizing: border-box; }
  .bar { position: absolute; left: 506px; width: 1px; height: 76px; background: rgba(16,37,55,.45); }
  .name { position: absolute; left: 536px; font-family: "AvantGarde"; font-size: 20px; letter-spacing: .24em;
    text-transform: uppercase; line-height: 1; color: #102537; }
  .min { position: absolute; left: 536px; font-family: "Didot Italic"; font-size: 27px; line-height: 1; color: #4F5E6D; }
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
