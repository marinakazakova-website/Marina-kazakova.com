// GA — FOUNDER'S CHOICE card (approved template, 1080×1350; reproduces the
// client's BLUE SAPPHIRE mock-up). Fixed: grid (top 1080×675 / bottom two
// 540×675), type hierarchy, website position. Per card: gradient photo,
// stone name, author's text, key phrase, portrait.
//  top     stone gradient photo (horizontal, darkened — tools/prepare_card.py)
//          title  Didot Bold 106 px, gold #BBA375, cap top 320, centred
//          note   AvantGarde 20.5 px / 25 px, white, centred, 3 lines from y 552
//  left    navy sampled from the gradient; key phrase Didot Italic 43 px gold,
//          left 74, last line ending above the hairline at y 1070 (x 64–466);
//          signature Didot 28 px gold, cap top 1098, second line 1132
//  right   portrait (cropped from the top only)
//  url     ivory, text top 1228, centred over the two bottom blocks
// Usage: python3 tools/prepare_card.py <id> && NODE_PATH=$(npm root -g) node tools/card.mjs <id>
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import path from "node:path";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CARDS = {
  blue_sapphire: {
    n: "01", title: "BLUE SAPPHIRE", navy: "#010929",
    note: "“Blue sapphire is one of my favourite gemstones for its depth and beauty. To me, it represents wisdom, clarity of mind and inner&nbsp;calm.”",
    phrase: "“Blue sapphire is a symbol of inner calm and wisdom for&nbsp;GA.”",
  },
};
const id = process.argv[2] || "blue_sapphire", C = CARDS[id];
const html = `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="../founder/founder.css"><style>
  @font-face { font-family: "DidotB"; src: url(../brand/fonts_licensed/Didot-Bold.ttf); }
  @font-face { font-family: "DidotR"; src: url(../brand/fonts_licensed/Didot-Regular.ttf); }
  @font-face { font-family: "DidotI"; src: url(../brand/fonts_licensed/Didot-Italic.ttf); }
  body { margin: 0; }
  #page { position: relative; width: 1080px; height: 1350px; overflow: hidden; background: ${C.navy}; }
  .top { position: absolute; left: 0; top: 0; width: 1080px; height: 675px; background: url(build/top_${id}.png); }
  .title { position: absolute; left: 0; width: 1080px; text-align: center; font-family: "DidotB"; font-size: 106px;
    line-height: 1; letter-spacing: .03em; text-indent: .03em; color: #BBA375; white-space: nowrap; }
  .note { position: absolute; left: 255px; width: 570px; top: 546px; text-align: center; font-family: "AvantGarde";
    font-size: 20.5px; line-height: 25px; color: #fff; }
  .phrase { position: absolute; left: 74px; width: 400px; bottom: ${1350 - 1030}px; margin: 0; font-family: "DidotI";
    font-size: 43px; line-height: 49px; color: #BBA375; }
  .hair { position: absolute; left: 64px; width: 402px; top: 1070px; height: 1px; background: rgba(187,163,117,.75); }
  .sign { position: absolute; left: 75px; top: 1091px; font-family: "DidotR"; font-size: 28px; line-height: 34px; color: #BBA375; }
  .portrait { position: absolute; left: 540px; top: 675px; width: 540px; height: 675px; }
</style></head><body><section id="page">
  <div class="top"><div class="title" id="t">${C.title}</div><div class="note">${C.note}</div></div>
  <p class="phrase">${C.phrase}</p>
  <div class="hair"></div>
  <div class="sign">Anastasia<br>Founder, Gem Expert</div>
  <img class="portrait" src="build/portrait.jpg" alt="Anastasia">
  <img src="build/url_ivory.png" style="position:absolute; left:375px; top:1223px" width="351" height="23" alt="">
</section></body></html>`;
fs.writeFileSync(path.join(root, `card_${id}.html`), html);
const { chromium } = createRequire(import.meta.url)("playwright");
const b = await chromium.launch({ args: ["--force-color-profile=srgb"] });
const pg = await b.newPage({ viewport: { width: 1080, height: 1350 } });
await pg.goto("file://" + path.join(root, `card_${id}.html`));
await pg.evaluate(() => document.fonts.ready);
const off = await pg.evaluate(() => { const c = document.createElement("canvas").getContext("2d"); c.font = "106px DidotB";
  const m = c.measureText("B"); return m.fontBoundingBoxAscent - m.actualBoundingBoxAscent; });
await pg.evaluate((y) => { document.getElementById("t").style.top = y + "px"; }, 320 - off);
const out = `output/GA_FoundersChoice_${C.n}_${id}.png`;
await pg.locator("#page").screenshot({ path: path.join(root, out) });
await b.close();
console.log("written", out);
