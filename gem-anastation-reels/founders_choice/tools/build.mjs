// MY TOP 3 GEMS | FOUNDER'S CHOICE — cover 1080×1350.
// Usage: python3 tools/prepare.py && NODE_PATH=$(npm root -g) node tools/build.mjs
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import path from "node:path";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SIZE = 74, CAP_TOP = 1078;       // title: Didot caps, cap top y
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face { font-family: "Didot"; src: url(../brand/fonts_licensed/Didot-Regular.ttf); }
  body { margin: 0; }
  #page { position: relative; width: 1080px; height: 1350px; overflow: hidden; background: url(build/photo.jpg); }
  .title { position: absolute; left: 0; width: 1080px; text-align: center; font-family: "Didot"; font-size: ${SIZE}px;
    line-height: 1; letter-spacing: .06em; text-indent: .06em; color: #174B39; white-space: nowrap; }
</style></head><body><section id="page">
  <div class="title" id="t">MY TOP 3 GEMS</div>
  <img src="build/url_cover.png" style="position:absolute; left:375px; top:1223px" width="351" height="23" alt="">
</section></body></html>`;
fs.writeFileSync(path.join(root, "cover.html"), html);
const { chromium } = createRequire(import.meta.url)("playwright");
const b = await chromium.launch({ args: ["--force-color-profile=srgb"] });
const pg = await b.newPage({ viewport: { width: 1080, height: 1350 } });
await pg.goto("file://" + path.join(root, "cover.html"));
await pg.evaluate(() => document.fonts.ready);
// place by the cap height: measure the ink of "M" and shift so cap top = CAP_TOP
const capOff = await pg.evaluate((s) => {
  const c = document.createElement("canvas").getContext("2d"); c.font = `${s}px Didot`;
  const m = c.measureText("M"); return m.fontBoundingBoxAscent - m.actualBoundingBoxAscent;
}, SIZE);
await pg.evaluate(([y]) => { document.getElementById("t").style.top = y + "px"; }, [CAP_TOP - capOff]);
await pg.locator("#page").screenshot({ path: path.join(root, "output/GA_FoundersChoice_cover.png") });
await b.close();
console.log("written output/GA_FoundersChoice_cover.png, cap offset", capOff.toFixed(1));
