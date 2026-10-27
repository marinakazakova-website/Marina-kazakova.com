// GA — FOUNDER'S CHOICE, full-bleed variant (no portrait): one background
// carrying the stones photo and its glow over the whole page. Same title,
// text and website rules as the split template (tools/card.mjs).
// Usage: python3 tools/tourmaline_bg.py && NODE_PATH=$(npm root -g) node tools/card_full.mjs tourmaline
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import path from "node:path";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CARDS = {
  tourmaline: {
    n: "02", title: "TOURMALINE", bg: "build/bg_tourmaline.png", noteTop: 470, noteW: 690,
    note: "“What I love about tourmaline is its incredible range of colours. Many tourmalines are more accessible than other precious gemstones, yet just as beautiful in jewellery. You can create an entire jewellery wardrobe with tourmalines in different shades, each piece expressing a different mood and&nbsp;style.”",
  },
};
const id = process.argv[2] || "tourmaline", C = CARDS[id];
const html = `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="../founder/founder.css"><style>
  @font-face { font-family: "DidotB"; src: url(../brand/fonts_licensed/Didot-Bold.ttf); }
  body { margin: 0; }
  #page { position: relative; width: 1080px; height: 1350px; overflow: hidden; background: url(${C.bg}); }
  .title { position: absolute; left: 0; width: 1080px; text-align: center; font-family: "DidotB"; font-size: 106px;
    line-height: 1; letter-spacing: .03em; text-indent: .03em; color: #BBA375; white-space: nowrap; }
  .note { position: absolute; left: ${540 - C.noteW / 2}px; width: ${C.noteW}px; top: ${C.noteTop}px; text-align: center;
    font-family: "AvantGarde"; font-size: 20.5px; line-height: 25px; color: #fff; }
</style></head><body><section id="page">
  <div class="title" id="t">${C.title}</div><div class="note">${C.note}</div>
  <img src="build/url_ivory.png" style="position:absolute; left:375px; top:1223px" width="351" height="23" alt="">
</section></body></html>`;
fs.writeFileSync(path.join(root, `card_${id}.html`), html);
const { chromium } = createRequire(import.meta.url)("playwright");
const b = await chromium.launch({ args: ["--force-color-profile=srgb"] });
const pg = await b.newPage({ viewport: { width: 1080, height: 1350 } });
await pg.goto("file://" + path.join(root, `card_${id}.html`));
await pg.evaluate(() => document.fonts.ready);
const off = await pg.evaluate(() => { const c = document.createElement("canvas").getContext("2d"); c.font = "106px DidotB";
  const m = c.measureText("T"); return m.fontBoundingBoxAscent - m.actualBoundingBoxAscent; });
await pg.evaluate((y) => { document.getElementById("t").style.top = y + "px"; }, 320 - off);
const out = `output/GA_FoundersChoice_${C.n}_${id}.png`;
await pg.locator("#page").screenshot({ path: path.join(root, out) });
await b.close();
console.log("written", out);
