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
    h2: "Three countries. Distinctive gems.",
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
    h2: "From rubies to ocean pearls.",
    copy: "From Myanmar’s celebrated rubies and spinels to the ocean pearls of Malaysia, Indonesia and the Philippines — Southeast Asia reveals a remarkable diversity of natural treasures.",
    gems: [
      { country: "Myanmar",     stone: "Red Ruby",               file: "sources/gem_myanmar_red_ruby.png" },
      { country: "Malaysia",    stone: "Marine Pearl",           file: "sources/gem_malaysia_marine_pearl.png" },
      { country: "Indonesia",   stone: "South Sea Pearl",        file: "sources/gem_indonesia_south_sea_pearl.png" },
      { country: "Philippines", stone: "Golden<br>South Sea Pearl", file: "sources/gem_philippines_golden_south_sea_pearl.png" },
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
const W = 1080, H = 1350, PHOTO_H = 648;                // 48 % of the height
const C = { navy: "#102537", turq: "#439090", gold: "#BBA375", ivory: "#F3EEE5", ink: "#1C1C1C" };

// Map: the region's countries fitted into the right part of the photo band.
const all = feature(topo, topo.objects.countries).features;
const pick = R.countries.map((n) => all.find((f) => f.properties.name === n));
const projection = geoMercator().fitExtent(R.mapBox, { type: "FeatureCollection", features: pick });
const pg = geoPath(projection);
const fmt = (d) => d.replace(/(\d+\.\d)\d+/g, "$1");
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
  return { n, x, y, lx, ly: y + dy, anchor, leader: Array.isArray(dx) };
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
fs.writeFileSync(path.join(root, `build/map${ID}.svg`), svg);

const labels = marks.map((m) => `<div class="mlabel" style="${m.anchor === "end"
  ? `right:${(W - m.lx).toFixed(1)}px` : `left:${m.lx.toFixed(1)}px`}; top:${(m.ly - 16).toFixed(1)}px">${m.n}</div>`).join("\n  ");

// Gems: circles spread across the 96 px margins (3 → 216 px, 4 → 196 px).
const n = GEMS.length, GEM_D = n === 3 ? 216 : 196, GEM_TOP = 900;
const pitch = n === 3 ? 312 : (888 - GEM_D) / (n - 1);   // 3: approved slide 03 rhythm
const centers = GEMS.map((_, i) => 540 + (i - (n - 1) / 2) * pitch);
const CAP_W = n === 3 ? GEM_D : pitch - 8;
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
  body { background: #d9d6d0; }
  .slide { width: ${W}px; height: ${H}px; background: ${C.ivory}; position: relative; overflow: hidden; }
  .band { position: absolute; left: 0; top: 0; width: ${W}px; height: ${PHOTO_H}px; overflow: hidden; background: ${C.navy}; }
  .band > img.photo { width: 100%; height: 100%; object-fit: cover; object-position: ${PHOTO_POSITION}; display: block; }
  /* legibility veil over the photo: darker on the left (title) and at the top */
  .veil { position: absolute; inset: 0;
    background: linear-gradient(90deg, rgba(16,37,55,.62) 0%, rgba(16,37,55,.40) 45%, rgba(16,37,55,.34) 100%); }
  .title { position: absolute; left: 96px; top: 80px; font-family: "Didot Title"; color: #F4F1EA;
    font-size: 58px; line-height: 1.06; letter-spacing: .05em; text-transform: uppercase; }
  .title .part { display: block; margin-top: 18px; font-family: "AvantGarde"; font-size: 18px;
    letter-spacing: .42em; color: ${C.gold}; }
  .mlabel { position: absolute; font-family: "AvantGarde"; font-size: 20px; line-height: 1; letter-spacing: .12em;
    text-transform: uppercase; color: #7CCBC6; font-weight: 600; white-space: nowrap;
    text-shadow: 0 0 8px rgba(16,37,55,.95), 0 0 3px rgba(16,37,55,.95), 0 0 1px rgba(16,37,55,1); }
  .rule { position: absolute; left: 0; top: ${PHOTO_H}px; width: ${W}px; height: 1px; background: ${C.navy}; opacity: .5; }
  .h2 { position: absolute; left: 96px; top: 700px; width: 900px; font-family: "Didot Title"; color: ${C.navy};
    font-size: 40px; line-height: 1.15; letter-spacing: .05em; text-transform: uppercase; }
  .copy { position: absolute; left: 96px; top: 768px; width: 860px; font-family: "AvantGarde";
    font-size: 22px; line-height: 1.55; color: ${C.ink}; }
  .gem { position: absolute; margin: 0; width: ${CAP_W}px; text-align: center; }
  .disc { width: ${GEM_D}px; height: ${GEM_D}px; border-radius: 50%; overflow: hidden; margin: 0 auto;
    background: #EAE4D9; box-shadow: inset 0 0 0 1px rgba(16,37,55,.12); }
  .disc { display: flex; align-items: center; justify-content: center; }
  .disc img { width: 76%; height: 76%; object-fit: contain; display: block;
    filter: drop-shadow(0 6px 10px rgba(16,37,55,.18)); }
  figcaption { margin-top: 18px; }
  .country { display: block; font-family: "AvantGarde"; font-size: 16px; letter-spacing: .3em; text-indent: .3em;
    text-transform: uppercase; color: ${C.turq}; }
  .stone { display: block; margin-top: 8px; font-family: "Didot Italic"; font-style: italic; font-size: ${n === 3 ? 26 : 24}px; ${n === 3 ? "" : "line-height: 1.12; "}color: ${C.navy}; }
  .arrow { position: absolute; left: 932px; top: 1228px; }
</style></head>
<body><section class="slide" id="s3">
  <div class="band">
    ${fs.existsSync(path.join(root, PHOTO)) ? `<img class="photo" src="${PHOTO}" alt="">` : ""}
    <div class="veil"></div>
    <img src="build/map${ID}.svg" width="${W}" height="${PHOTO_H}" style="position:absolute;left:0;top:0" alt="">
    <div class="title">${R.title}<span class="part">${R.part}</span></div>
    ${labels}
  </div>
  <div class="rule"></div>

  <h2 class="h2">${R.h2}</h2>
  <p class="copy">${R.copy}</p>

  ${gemsHtml}

  <img src="build/url_on_light.png" style="position:absolute; left:375px; top:1223px" width="351" height="23" alt="www.gemanastation.com">
  <!-- next-slide cue, on the website line's height, right margin -->
  <svg class="arrow" width="52" height="14" viewBox="0 0 52 14"><path d="M0 7 H50 M43 1 L50 7 L43 13"
    fill="none" stroke="${C.gold}" stroke-width="1.4"/></svg>
</section></body></html>`;
fs.writeFileSync(path.join(root, `slide${ID}.html`), html);

const { chromium } = require("playwright");
const browser = await chromium.launch({ args: ["--force-color-profile=srgb"] });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
await page.goto("file://" + path.join(root, `slide${ID}.html`));
await page.evaluate(() => document.fonts.ready);
await page.waitForLoadState("networkidle");
const out = missing.length ? `build/draft_${ID}.png` : `output/${R.out}`;
await page.locator("#s3").screenshot({ path: path.join(root, out) });
await browser.close();
console.log("written", out);
