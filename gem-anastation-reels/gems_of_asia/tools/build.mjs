// GEMS OF ASIA — slide 02, THE GEMSTONE MAP (1080×1350).
//
// Geography: Natural Earth admin-0 countries, 1:50m (world-atlas 2.0.2),
// projected with d3-geo (Lambert azimuthal equal-area centred on Asia).
// Every country marker is checked to fall inside its own country polygon,
// and label boxes are checked for overlaps, before the slide is written.
//
// Usage:  npm install && NODE_PATH=$(npm root -g) node tools/build.mjs
//   -> build/map.svg, slide02.html, output/GA_GemsOfAsia_02_map.png
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import path from "node:path";
import { geoAzimuthalEqualArea, geoPath, geoContains, geoGraticule10 } from "d3-geo";
import { feature, mesh } from "topojson-client";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const topo = JSON.parse(fs.readFileSync(path.join(root, "node_modules/world-atlas/countries-50m.json")));

// ---- Layout (px, 1080×1350) -------------------------------------------
const W = 1080, H = 1350;
const MAP = { top: 250, bottom: 1000 };          // visible map band (soft-faded edges)
const COLORS = { bg: "#102537", line: "#FFFFFF", turq: "#439090", gold: "#BBA375", text: "#E9E6DF" };

// Projection: centred on Asia, fitted so Afghanistan → Japan and
// China's north → Indonesia's south sit inside the band with air around.
const projection = geoAzimuthalEqualArea().rotate([-103, -22]);
projection.fitExtent([[205, MAP.top + 50], [965, MAP.bottom - 40]], {
  type: "MultiPoint",
  coordinates: [[60.5, 33], [146, 43.5], [123, 53.5], [118, -10.5], [141, -9]],
});
const pathGen = geoPath(projection);

// ---- Countries to mark ----------------------------------------------------
// [label, Natural Earth name, marker lon/lat (inside the country),
//  label offset dx, dy from the marker in px — or an absolute [x, y] label
//  position in place of dx (dy then unused) — and the text anchor]
const COUNTRIES = [
  ["China",       "China",        [103.0, 34.5],   16, -12, "start"],
  ["Japan",       "Japan",        [138.3, 36.3],   18,  30, "start"],
  ["Tajikistan",  "Tajikistan",   [71.3, 38.7],   -16, -18, "end"],
  ["Afghanistan", "Afghanistan",  [66.0, 33.5],   -16,   6, "end"],
  ["Pakistan",    "Pakistan",     [69.3, 29.0],   -22,  56, "end"],     // Arabian Sea
  ["India",       "India",        [78.5, 22.0],    14,   6, "start"],
  ["Sri Lanka",   "Sri Lanka",    [80.7, 7.8],    -36,  48, "end"],
  // Mainland South-East Asia: a left-aligned column at sea (Bay of Bengal /
  // Andaman Sea), right edge x = 462; Vietnam alone in the South China Sea.
  ["Myanmar",     "Myanmar",      [96.0, 21.5],   [462, 700], 0, "end"],
  ["Thailand",    "Thailand",     [101.0, 15.6],  [462, 746], 0, "end"],
  ["Cambodia",    "Cambodia",     [104.9, 12.7],  [462, 788], 0, "end"],
  ["Malaysia",    "Malaysia",     [102.0, 4.2],   [462, 830], 0, "end"],
  ["Vietnam",     "Vietnam",      [107.2, 16.6],   21,   8, "start"],
  ["Indonesia",   "Indonesia",    [113.5, -1.5],    0, 112, "middle"],  // Indian Ocean, below Java
  ["Philippines", "Philippines",  [121.0, 15.5],   26, -30, "start"],   // Pacific, north of Luzon
];

// ---- Geometry -------------------------------------------------------------
const countries = feature(topo, topo.objects.countries).features;
const byName = new Map(countries.map((f) => [f.properties.name, f]));
for (const [label, ne, ll] of COUNTRIES) {
  const f = byName.get(ne);
  if (!f) throw new Error(`no Natural Earth country named ${ne}`);
  if (!geoContains(f, ll)) throw new Error(`${label}: marker ${ll} is not inside ${ne}`);
}
const borders = mesh(topo, topo.objects.countries, (a, b) => a !== b);
const coast = mesh(topo, topo.objects.countries, (a, b) => a === b);
const fmt = (d) => d.replace(/(\d+\.\d)\d+/g, "$1");

// ---- Labels & overlap check -------------------------------------------------
const LABEL = { size: 18, track: 0.13 };   // AvantGarde caps
const charW = LABEL.size * (0.68 + LABEL.track);   // conservative caps width estimate
const items = COUNTRIES.map(([label, , ll, dx, dy, anchor]) => {
  const [x, y] = projection(ll);
  const [lx, ly] = Array.isArray(dx) ? dx : [x + dx, y + dy];
  const w = label.length * charW;
  const x0 = anchor === "end" ? lx - w : anchor === "middle" ? lx - w / 2 : lx;
  return { label, x, y, lx, ly, anchor, box: [x0 - 4, ly - LABEL.size, x0 + w + 4, ly + 5] };
});
for (let i = 0; i < items.length; i++) for (let j = i + 1; j < items.length; j++) {
  const a = items[i].box, b = items[j].box;
  if (a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3])
    console.warn(`WARNING labels overlap (estimate): ${items[i].label} / ${items[j].label}`);
}
for (const it of items) {
  const [x0, y0, x1, y1] = it.box;
  if (x0 < 40 || x1 > W - 40 || y0 < MAP.top || y1 > MAP.bottom)
    console.warn(`WARNING label outside the map band: ${it.label} ${it.box.map((v) => v.toFixed(0))}`);
}

for (const it of items) console.log(`${it.label.padEnd(12)} marker ${it.x.toFixed(0)},${it.y.toFixed(0)}`);

// ---- SVG ------------------------------------------------------------------
const leaders = items.map((it) => {
  const dist = Math.hypot(it.lx - it.x, it.ly - it.y);
  if (dist < 30) return "";
  // leader from the dot towards the label's near end, stopping short of the text
  const tx = it.anchor === "middle" ? it.lx : it.lx + (it.anchor === "end" ? 6 : -6);
  const ty = it.anchor === "middle" ? it.ly - LABEL.size - 4 : it.ly - LABEL.size * 0.35;
  return `<path d="M${it.x.toFixed(1)},${it.y.toFixed(1)} L${tx.toFixed(1)},${ty.toFixed(1)}" />`;
}).join("");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="fade" gradientUnits="userSpaceOnUse"
      x1="0" y1="${MAP.top}" x2="0" y2="${MAP.bottom}">
      <stop offset="0" stop-color="#fff" stop-opacity="0"/>
      <stop offset="0.09" stop-color="#fff" stop-opacity="1"/>
      <stop offset="0.91" stop-color="#fff" stop-opacity="1"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <mask id="band" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}">
      <rect x="0" y="${MAP.top}" width="${W}" height="${MAP.bottom - MAP.top}" fill="url(#fade)"/>
    </mask>
  </defs>
  <g mask="url(#band)" fill="none" stroke="${COLORS.line}" stroke-linejoin="round" stroke-linecap="round">
    <path d="${fmt(pathGen(geoGraticule10()))}" stroke-opacity="0.06" stroke-width="0.8"/>
    <path d="${fmt(pathGen(borders))}" stroke-opacity="0.42" stroke-width="0.8"/>
    <path d="${fmt(pathGen(coast))}" stroke-opacity="0.9" stroke-width="1.1"/>
  </g>
  <g stroke="${COLORS.turq}" stroke-width="1" fill="none">${leaders}</g>
  <g fill="${COLORS.turq}">${items.map((it) =>
    `<circle cx="${it.x.toFixed(1)}" cy="${it.y.toFixed(1)}" r="5.5"/>`).join("")}</g>
</svg>`;
fs.writeFileSync(path.join(root, "build/map.svg"), svg);

// ---- Slide HTML ------------------------------------------------------------
const labelsHtml = items.map((it) =>
  `<div class="label" style="${it.anchor === "end" ? `right:${(W - it.lx).toFixed(1)}px`
    : it.anchor === "middle" ? `left:${(it.lx - 150).toFixed(1)}px; width:300px; text-align:center`
    : `left:${it.lx.toFixed(1)}px`}; top:${(it.ly - LABEL.size * 0.82).toFixed(1)}px">${it.label}</div>`
).join("\n  ");

const html = `<!doctype html>
<!-- Generated by tools/build.mjs — edit the script, not this file. -->
<html lang="en"><head><meta charset="utf-8"><title>Gemstone Map</title>
<link rel="stylesheet" href="../founder/founder.css">
<style>
  body { background: #d9d6d0; }
  .slide { width: ${W}px; height: ${H}px; background: ${COLORS.bg}; position: relative; overflow: hidden; }
  .rubric { position: absolute; left: 0; width: ${W}px; top: 112px; text-align: center;
    font-family: "AvantGarde"; font-size: 17px; letter-spacing: .42em; text-indent: .42em;
    text-transform: uppercase; line-height: 1; color: ${COLORS.gold}; }
  .title { position: absolute; left: 0; width: ${W}px; top: 156px; text-align: center;
    font-family: "Didot Title"; font-size: 58px; letter-spacing: .08em; text-indent: .08em;
    text-transform: uppercase; color: ${COLORS.text}; line-height: 1; }
  .label { position: absolute; font-family: "AvantGarde"; font-size: ${LABEL.size}px; line-height: 1;
    letter-spacing: ${LABEL.track}em; text-transform: uppercase; color: ${COLORS.turq}; white-space: nowrap;
    /* cartographic halo: map lines stop short of the letters */
    text-shadow: 0 0 2px ${COLORS.bg}, 0 0 3px ${COLORS.bg}, 0 0 4px ${COLORS.bg}, 0 0 6px ${COLORS.bg}; }
  .copy { position: absolute; left: 96px; top: 1010px; width: 760px;
    font-family: "AvantGarde"; font-size: 23px; line-height: 1.6; color: rgba(233,230,223,.88); }
</style></head>
<body><section class="slide" id="s2">
  <img src="build/map.svg" width="${W}" height="${H}" style="position:absolute;left:0;top:0" alt="">
  <div class="rubric">Created by Nature</div>
  <div class="title">The Gemstone Map</div>
  ${labelsHtml}
  <p class="copy">Asia is home to an extraordinary world of gemstones — from Myanmar’s rubies
    and Sri Lanka’s sapphires to Vietnam’s spinels and Japan’s pearls. Every region
    has its own natural story.</p>
  <!-- Logo: original GA monogram + GEM ANASTATION wordmark layers, never redrawn.
       Wordmark text top at y = 1228 (the post rule for the bottom service line),
       centred on x = 540; monogram scaled uniformly (0.32) 16 px above it. -->
  <img src="build/logo_ga.png" style="position:absolute; left:${(540 - 129 * 0.32).toFixed(1)}px; top:${(1212 - 159 * 0.32).toFixed(1)}px; width:${(260 * 0.32).toFixed(1)}px" alt="GA">
  <img src="build/wordmark.png" style="position:absolute; left:370px; top:1221px" width="342" height="28" alt="Gem AnaStation">
</section></body></html>`;
fs.writeFileSync(path.join(root, "slide02.html"), html);

// ---- Export -------------------------------------------------------------------
const { chromium } = require("playwright");
const browser = await chromium.launch({ args: ["--force-color-profile=srgb"] });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
await page.goto("file://" + path.join(root, "slide02.html"));
await page.evaluate(() => document.fonts.ready);
await page.waitForLoadState("networkidle");
fs.mkdirSync(path.join(root, "output"), { recursive: true });
await page.locator("#s2").screenshot({ path: path.join(root, "output/GA_GemsOfAsia_02_map.png") });
// measured label boxes, for a precise overlap check with real font metrics
const boxes = await page.$$eval(".label", (els) => els.map((e) => {
  const r = e.getBoundingClientRect(); return [e.textContent, r.left, r.top, r.right, r.bottom];
}));
await browser.close();
for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
  const [na, ...a] = boxes[i], [nb, ...b] = boxes[j];
  if (a[0] < b[2] + 6 && b[0] < a[2] + 6 && a[1] < b[3] + 4 && b[1] < a[3] + 4)
    console.warn(`WARNING labels too close: ${na} / ${nb}`);
}
console.log("ok: 14 markers inside their countries; slide written");
