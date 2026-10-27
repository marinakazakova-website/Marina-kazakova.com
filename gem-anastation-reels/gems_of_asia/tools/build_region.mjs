// GEMS OF ASIA — regional slides (photo + map / ivory + gems), 1080×1350.
// One composition system for every region; per-slide content in REGIONS.
//
// Top 48 %: landscape photo with the real outlines of Thailand, Vietnam and
// Cambodia (Natural Earth 1:50m via world-atlas, d3-geo), highlighted in
// #439090, and the title. Bottom: ivory editorial field (Founder system),
// three gemstone photographs in circles, website line on the post rule.
//
// Photos are inputs (sources/): set PHOTO and GEMS below. Missing files are
// reported, never replaced by stand-ins.
//
// Usage: NODE_PATH=$(npm root -g) node tools/build_region.mjs 03|04
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import path from "node:path";
import { geoMercator, geoPath, geoContains } from "d3-geo";
import { feature, mesh } from "topojson-client";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const topo = JSON.parse(fs.readFileSync(path.join(root, "node_modules/world-atlas/countries-50m.json")));

// ---- Regions ----------------------------------------------------------------
// markers: [country, marker lon/lat inside it, [label x] , dy, anchor]
const REGIONS = {
  "03": {
    out: "GA_GemsOfAsia_03_southeast_asia_I.png",
    photo: "sources/sea_landscape.jpg", photoPos: "50% 30%",
    title: "Southeast<br>Asia", part: "Part I",
    countries: ["Thailand", "Vietnam", "Cambodia"],
    mapBox: [[470, 60], [870, 604]],
    markers: [
      ["Thailand", [101.0, 15.6], [462], 6, "end"],
      ["Vietnam",  [107.2, 16.6], [900], 6, "start"],
      ["Cambodia", [104.9, 12.7], [900], 6, "start"],
    ],
    h2: "Three countries. Distinctive gems",
    copy: "From Thailand’s sapphires and Cambodia’s zircons to Vietnam’s remarkable spinels — each country reveals a different side of Asia’s gemstone heritage.",
    gems: [
      { country: "Thailand", stone: "Blue Sapphire", file: "sources/gem_thailand_blue_sapphire.png" },
      { country: "Vietnam",  stone: "Pink Spinel",   file: "sources/gem_vietnam_pink_spinel.png" },
      { country: "Cambodia", stone: "Blue Zircon",   file: "sources/gem_cambodia_blue_zircon.png" },
    ],
  },
  "04": {
    out: "GA_GemsOfAsia_04_southeast_asia_II.png",
    photo: "sources/sea_archipelago.jpg", photoPos: "50% 50%",
    title: "Southeast<br>Asia", part: "Part II",
    countries: ["Myanmar", "Malaysia", "Indonesia", "Philippines"],
    mapBox: [[530, 60], [1020, 612]],     // starts right of the title block
    markers: [
      ["Myanmar",     [96.0, 21.5],  [640], 66, "start"],  // below-right of Myanmar
      ["Malaysia",    [102.0, 4.2],  [500], 6, "end"],
      ["Indonesia",   [113.5, -1.5], [500], 40, "end"],
      ["Philippines", [121.0, 15.5], [862], -52, "start"], // above Luzon
    ],
    h2: "From rubies to ocean pearls",
    copy: "From Myanmar’s celebrated rubies and spinels to the ocean pearls of Malaysia, Indonesia and the Philippines — Southeast Asia reveals a remarkable diversity of natural treasures.",
    gems: [
      { country: "Myanmar",     stone: "Red Ruby",               file: "sources/gem_myanmar_red_ruby.png" },
      { country: "Malaysia",    stone: "Sea Pearl",              file: "sources/gem_malaysia_marine_pearl.png" },
      { country: "Indonesia",   stone: "South Sea Pearl",        file: "sources/gem_indonesia_south_sea_pearl.png" },
      { country: "Philippines", stone: "Golden<br>South Sea Pearl", file: "sources/gem_philippines_golden_south_sea_pearl.png" },
    ],
  },
  "05": {
    out: "GA_GemsOfAsia_05_south_central_asia.png",
    photo: "sources/sca_mountains.jpg", photoPos: "50% 40%",
    title: "South &amp;<br>Central Asia", part: "",
    countries: ["India", "Sri Lanka", "Pakistan", "Afghanistan", "Tajikistan"],
    mapBox: [[610, 48], [1010, 612]],     // right of the two-line title
    markers: [
      ["Tajikistan",  [71.3, 38.7], [1000], -14, "end"],
      ["Afghanistan", [66.0, 33.5], [580, 300], 0, "end"],   // column below the title
      ["Pakistan",    [69.3, 29.0], [580, 350], 0, "end"],
      ["India",       [78.5, 22.0], [1000], 6, "end"],
      ["Sri Lanka",   [80.7, 7.8],  [1000], 6, "end"],
    ],
    h2: "Treasures from the mountains and beyond",
    copy: "From Sri Lanka’s celebrated sapphires and India’s historic diamonds to Pakistan’s emeralds, Afghanistan’s lapis lazuli and Tajikistan’s spinels — this region holds an extraordinary gemstone heritage.",
    gemTop: 950,
    gems: [
      { country: "Sri Lanka",   stone: "Blue Sapphire", file: "sources/gem_srilanka_blue_sapphire.png" },
      { country: "India",       stone: "Diamond",       file: "sources/gem_india_diamond.png" },
      { country: "Pakistan",    stone: "Green Emerald", file: "sources/gem_pakistan_green_emerald.png" },
      { country: "Afghanistan", stone: "Lapis Lazuli",  file: "sources/gem_afghanistan_lapis_lazuli.png" },
      { country: "Tajikistan",  stone: "Pink Spinel",   file: "sources/gem_tajikistan_pink_spinel.png" },
    ],
  },
  "06": {
    out: "GA_GemsOfAsia_06_east_asia.png",
    photo: "sources/ea_karst_river.jpg", photoPos: "50% 60%",
    title: "East Asia", part: "",
    countries: ["China", "Japan"],
    mapBox: [[330, 180], [1020, 616]],    // below-right of the one-line title
    markers: [
      ["China", [103.0, 34.5], 16, 6, "start"],              // on land, no leader (as on slide 02)
      ["Japan", [138.3, 36.3], [1010, 560], 0, "end"],      // Pacific, below Japan
    ],
    h2: "From ancient jade to ocean pearls",
    copy: "From China’s treasured jade and freshwater pearls to Japan’s renowned Akoya pearls — East Asia brings together centuries of craftsmanship and the beauty of nature.",
    gems: [
      { country: "China", stone: "Nephrite Jade",    file: "sources/gem_china_nephrite_jade.png" },
      { country: "China", stone: "Freshwater Pearl", file: "sources/gem_china_freshwater_pearl.png" },
      { country: "Japan", stone: "Akoya Pearl",      file: "sources/gem_japan_akoya_pearl.png" },
    ],
  },
};
const ID = process.argv[2] || "03";
const R = REGIONS[ID];
if (!R) throw new Error(`unknown slide ${ID}`);
const PHOTO = R.photo, PHOTO_POSITION = R.photoPos, GEMS = R.gems;
const missing = [PHOTO, ...GEMS.map((g) => g.file)].filter((f) => !fs.existsSync(path.join(root, f)));
if (missing.length) console.warn("MISSING INPUTS (left empty in the draft):\n  " + missing.join("\n  "));

// ---- Layout -----------------------------------------------------------------
// STORY=1 → 1080×1920 Stories version: photo band 920 (48 %), title below the
// Stories UI zone (y ≥ 250), ivory content shifted by D, website line 1744.
const STORY = process.env.STORY === "1";
const W = 1080, H = STORY ? 1920 : 1350, PHOTO_H = STORY ? 920 : 648;   // 48 % of the height
const D = PHOTO_H - 648;                                 // ivory shift
const mapY = (y) => STORY ? 210 + y * (PHOTO_H - 250) / 648 : y;
const C = { navy: "#102537", turq: "#439090", gold: "#BBA375", ivory: "#F3EEE5", ink: "#1C1C1C" };

// Map: the region's countries fitted into the right part of the photo band.
const all = feature(topo, topo.objects.countries).features;
const pick = R.countries.map((n) => all.find((f) => f.properties.name === n));
const projection = geoMercator().fitExtent(R.mapBox.map(([x, y]) => [x, mapY(y)]), { type: "FeatureCollection", features: pick });
const pg = geoPath(projection);
const fmt = (d) => (d || "").replace(/(\d+\.\d)\d+/g, "$1");   // "" when no shared borders
const SET = new Set(R.countries);
const inner = mesh(topo, topo.objects.countries,
  (a, b) => a !== b && SET.has(a.properties.name) && SET.has(b.properties.name));
const MARKERS = R.markers;
for (const [n, ll] of MARKERS) {
  if (!geoContains(pick.find((f) => f.properties.name === n), ll)) throw new Error(`${n}: marker outside`);
}
const marks = MARKERS.map(([n, ll, dx, dy, anchor]) => {
  const [x, y] = projection(ll);
  const lx = Array.isArray(dx) ? dx[0] : x + dx;
  const ly = Array.isArray(dx) && dx.length > 1 ? mapY(dx[1]) : y + dy;   // [x, y] = absolute label position
  return { n, x, y, lx, ly, anchor, leader: Array.isArray(dx) };
});

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${PHOTO_H}" viewBox="0 0 ${W} ${PHOTO_H}">
  <g fill="${C.turq}" fill-opacity="0.38" stroke="#FFFFFF" stroke-width="2" stroke-linejoin="round">
    ${pick.map((f) => `<path d="${fmt(pg(f))}"/>`).join("\n    ")}
  </g>
  <path d="${fmt(pg(inner))}" fill="none" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="1"/>
  <g stroke="#8FD0CC" stroke-width="1">${marks.filter((m) => m.leader).map((m) =>
    `<path d="M${m.x.toFixed(1)},${m.y.toFixed(1)} L${(m.anchor === "end" ? m.lx + 10 : m.lx - 10).toFixed(1)},${(m.ly - 6).toFixed(1)}"/>`).join("")}</g>
  <g fill="${C.turq}" stroke="#FFFFFF" stroke-width="1.5">${marks.map((m) =>
    `<circle cx="${m.x.toFixed(1)}" cy="${m.y.toFixed(1)}" r="6"/>`).join("")}</g>
</svg>`;
fs.writeFileSync(path.join(root, `build/map${ID}${STORY ? "s" : ""}.svg`), svg);

const labels = marks.map((m) => `<div class="mlabel" style="${m.anchor === "end"
  ? `right:${(W - m.lx).toFixed(1)}px` : `left:${m.lx.toFixed(1)}px`}; top:${(m.ly - 16).toFixed(1)}px">${m.n}</div>`).join("\n  ");

// Gems: circles spread across the 96 px margins (3 → 216 px, 4 → 196 px).
// Gem discs: 22 % smaller than the first approved size (client, final pass);
// each disc keeps the old disc's centre line, so the row gains air below.
const n = GEMS.length, OLD_D = { 3: 216, 4: 196, 5: 156 }[n], GEM_D = Math.round(OLD_D * 0.78);
const GEM_TOP = (R.gemTop || 900) + (OLD_D - GEM_D) / 2 + D;
const pitch = n === 3 ? 312 : (888 - OLD_D) / (n - 1);   // 3: approved slide 03 rhythm
const centers = GEMS.map((_, i) => 540 + (i - (n - 1) / 2) * pitch);
const CAP_W = n === 3 ? OLD_D : pitch - 8;
const gemsHtml = GEMS.map((g, i) => {
  const has = fs.existsSync(path.join(root, g.file));
  return `<figure class="gem" style="left:${centers[i] - CAP_W / 2}px; top:${GEM_TOP}px">
    <div class="disc">${has ? `<img src="${g.file}" alt="${g.stone.replace("<br>", " ")}">` : ""}</div>
    <figcaption><span class="country">${g.country}</span><span class="stone">${g.stone}</span></figcaption>
  </figure>`;
}).join("\n  ");

const html = `<!doctype html>
<!-- Generated by tools/build_region.mjs — edit the script, not this file. -->
<html lang="en"><head><meta charset="utf-8"><title>Gems of Asia ${ID}</title>
<link rel="stylesheet" href="../founder/founder.css">
<style>
  /* Apple Didot (client-supplied, local only: ../brand/fonts_licensed, git-ignored) */
  @font-face { font-family: "GFS Didot"; src: url(../brand/fonts_licensed/Didot-Regular.ttf); }
  @font-face { font-family: "Didot Italic"; font-style: italic; src: url(../brand/fonts_licensed/Didot-Italic.ttf); }
</style>
<style>
  body { background: #d9d6d0; }
  .slide { width: ${W}px; height: ${H}px; background: ${C.ivory}; position: relative; overflow: hidden; }
  .band { position: absolute; left: 0; top: 0; width: ${W}px; height: ${PHOTO_H}px; overflow: hidden; background: ${C.navy}; }
  .band > img.photo { width: 100%; height: 100%; object-fit: cover; object-position: ${PHOTO_POSITION}; display: block; }
  /* legibility veil over the photo: darker on the left (title) and at the top */
  .veil { position: absolute; inset: 0;
    background: linear-gradient(90deg, rgba(16,37,55,.62) 0%, rgba(16,37,55,.40) 45%, rgba(16,37,55,.34) 100%); }
  .title { position: absolute; left: 96px; top: ${STORY ? 262 : 80}px; font-family: "GFS Didot"; color: #F4F1EA;
    font-size: 58px; line-height: 1.06; letter-spacing: .05em; text-transform: uppercase; }
  .title .part { display: block; margin-top: 18px; font-family: "AvantGarde"; font-size: 18px;
    letter-spacing: .42em; color: ${C.gold}; }
  .mlabel { position: absolute; font-family: "AvantGarde"; font-size: 20px; line-height: 1; letter-spacing: .12em;
    text-transform: uppercase; color: #7CCBC6; font-weight: 600; white-space: nowrap;
    text-shadow: 0 0 8px rgba(16,37,55,.95), 0 0 3px rgba(16,37,55,.95), 0 0 1px rgba(16,37,55,1); }
  .rule { position: absolute; left: 0; top: ${PHOTO_H}px; width: ${W}px; height: 1px; background: ${C.navy}; opacity: .5; }
  .textblock { position: absolute; left: 96px; top: ${700 + D}px; width: 900px; }
  /* Ivory headings: true Didot Italic (stand-in Bodoni Moda Italic), regular weight, no faux bold */
  .h2 { margin: 0 0 ${68 - 46}px; width: 900px; font-family: "Didot Italic"; font-style: italic; font-weight: 400;
    color: ${C.navy}; font-size: 40px; line-height: 1.15; letter-spacing: 0; }
  .copy { margin: 0; width: 860px; font-family: "AvantGarde";
    font-size: 22px; line-height: 1.55; color: ${C.ink}; }
  .gem { position: absolute; margin: 0; width: ${CAP_W}px; text-align: center; }
  .disc { width: ${GEM_D}px; height: ${GEM_D}px; border-radius: 50%; overflow: hidden; margin: 0 auto;
    background: #EAE4D9; box-shadow: inset 0 0 0 1px rgba(16,37,55,.12); }
  .disc { display: flex; align-items: center; justify-content: center; }
  .disc img { width: 76%; height: 76%; object-fit: contain; display: block;
    filter: drop-shadow(0 6px 10px rgba(16,37,55,.18)); }
  figcaption { margin-top: 18px; }
  .country { display: block; font-family: "AvantGarde"; font-size: ${n === 5 ? 14 : 16}px;
    letter-spacing: ${n === 5 ? ".2em" : ".3em"}; text-indent: ${n === 5 ? ".2em" : ".3em"};
    text-transform: uppercase; color: ${C.turq}; }
  .stone { display: block; margin-top: 8px; font-family: "Didot Italic"; font-style: italic; font-size: ${{ 3: 26, 4: 24, 5: 22 }[n]}px; ${n === 3 ? "" : "line-height: 1.12; "}color: ${C.navy}; }
  .arrow { position: absolute; left: 932px; top: ${STORY ? 1744 : 1228}px; }
</style></head>
<body><section class="slide" id="s3">
  <div class="band">
    ${fs.existsSync(path.join(root, PHOTO)) ? `<img class="photo" src="${PHOTO}" alt="">` : ""}
    <div class="veil"></div>
    <img src="build/map${ID}${STORY ? "s" : ""}.svg" width="${W}" height="${PHOTO_H}" style="position:absolute;left:0;top:0" alt="">
    <div class="title">${R.title}${R.part ? `<span class="part">${R.part}</span>` : ""}</div>
    ${labels}
  </div>
  <div class="rule"></div>

  <div class="textblock"><h2 class="h2">${R.h2}</h2><p class="copy">${R.copy}</p></div>

  ${gemsHtml}

  <img src="build/url_on_light.png" style="position:absolute; left:375px; top:${STORY ? 1739 : 1223}px" width="351" height="23" alt="www.gemanastation.com">
  <!-- next-slide cue, on the website line's height, right margin -->
  <svg class="arrow" width="52" height="14" viewBox="0 0 52 14"><path d="M0 7 H50 M43 1 L50 7 L43 13"
    fill="none" stroke="${C.gold}" stroke-width="1.4"/></svg>
</section></body></html>`;
fs.writeFileSync(path.join(root, `slide${ID}${STORY ? "_story" : ""}.html`), html);

const { chromium } = require("playwright");
const browser = await chromium.launch({ args: ["--force-color-profile=srgb"] });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
await page.goto("file://" + path.join(root, `slide${ID}${STORY ? "_story" : ""}.html`));
await page.evaluate(() => document.fonts.ready);
await page.waitForLoadState("networkidle");
const out = missing.length ? `build/draft_${ID}.png`
  : STORY ? `output/stories/${R.out.replace(".png", "_story.png")}` : `output/${R.out}`;
await page.locator("#s3").screenshot({ path: path.join(root, out) });
await browser.close();
console.log("written", out);
