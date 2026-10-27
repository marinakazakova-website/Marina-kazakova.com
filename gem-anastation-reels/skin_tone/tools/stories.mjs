// GEMSTONE & SKIN TONE — Stories 01 (intro) and 06 (final / CTA), 1080×1920.
// One series: the brand gradient (sources/brand_gradient_story.webp, trimmed and cover-fitted), centred
// Didot caps headline in ivory, AvantGarde line under it, one gold accent
// (01: a short gold hairline; 06: the CTA line), website line ivory at the
// Stories rule (text top 1744). Type kept inside y 250–1670.
// Usage: NODE_PATH=$(npm root -g) node tools/stories.mjs
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import path from "node:path";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const STORIES = {
  "01_intro": {
    // green sampled from the cover Story's leaves (#1F4224), deepened at the edges
    bg: "#1F4224", edge: "#0F2414",
    body: `<h1>Color is<br>personal</h1><div class="accent"></div><p>So is the gemstone you choose.</p>`,
  },
  "06_final": {
    bg: "#174B39", edge: "#0B2A1F",
    body: `<h1>Which gemstone<br>is yours?</h1><p>Let’s discover the colors<br>that feel like you.</p><div class="cta">DM us to explore</div>`,
  },
};
const { chromium } = createRequire(import.meta.url)("playwright");
const b = await chromium.launch({ args: ["--force-color-profile=srgb"] });
const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
fs.mkdirSync(path.join(root, "output/stories"), { recursive: true });
for (const [id, S] of Object.entries(STORIES)) {
  const html = `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="../founder/founder.css"><style>
  @font-face { font-family: "DidotR"; src: url(../brand/fonts_licensed/Didot-Regular.ttf); }
  body { margin: 0; }
  #page { position: relative; width: 1080px; height: 1920px; overflow: hidden;
    background: url(build/gradient_story.png); }
  .block { position: absolute; left: 96px; width: 888px; top: 0; height: 1840px; display: flex; flex-direction: column;
    justify-content: center; align-items: center; text-align: center; }
  h1 { margin: 0; font-family: "DidotR"; font-weight: 400; font-size: 96px; line-height: 1.08; letter-spacing: .04em;
    text-indent: .04em; text-transform: uppercase; color: #F3EEE5; }
  .accent { width: 64px; height: 1px; background: #BBA375; margin: 56px 0 0; }
  p { margin: 48px 0 0; font-family: "AvantGarde"; font-size: 28px; line-height: 1.5; color: rgba(243,238,229,.86); }
  .accent + p { margin-top: 44px; }
  .cta { margin-top: 72px; font-family: "AvantGarde"; font-size: 20px; letter-spacing: .32em; text-indent: .32em;
    text-transform: uppercase; color: #BBA375; }
</style></head><body><section id="page"><div class="block">${S.body}</div>
  <img src="build/url_ivory.png" style="position:absolute; left:375px; top:1739px" width="351" height="23" alt="">
</section></body></html>`;
  fs.writeFileSync(path.join(root, `story_${id}.html`), html);
  await pg.goto("file://" + path.join(root, `story_${id}.html`));
  await pg.evaluate(() => document.fonts.ready);
  await pg.locator("#page").screenshot({ path: path.join(root, `output/stories/GA_SkinTone_${id}_story.png`) });
  console.log("written", id);
}
await b.close();
