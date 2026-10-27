// Find the AvantGarde size + tracking that reproduce the original captions'
// ink box (cap height 654-669, CREATED BY NATURE 81-339, CURATED BY EXPERT 719-972).
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
const root = path.dirname(fileURLToPath(import.meta.url));
const { chromium } = createRequire(import.meta.url)("playwright");
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1200, height: 300 } });
await p.goto("file://" + path.join(root, "calib.html"));
await p.evaluate(() => document.fonts.load("20px AG"));
const res = await p.evaluate(() => {
  const ctx = document.getElementById("c").getContext("2d");
  function ink(text, size, track) {
    ctx.clearRect(0, 0, 1200, 200); ctx.font = `${size}px AG`; ctx.letterSpacing = `${track}px`;
    ctx.fillStyle = "#fff"; ctx.fillText(text, 10, 100);
    const d = ctx.getImageData(0, 0, 1200, 200).data; let x0 = 1e9, x1 = -1, y0 = 1e9, y1 = -1;
    for (let y = 0; y < 200; y++) for (let x = 0; x < 1200; x++) if (d[(y * 1200 + x) * 4 + 3] > 120) {
      x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    return [x1 - x0, y1 - y0];
  }
  let best = null;
  for (let s = 18; s <= 24; s += 0.25) for (let t = 0; t <= 6; t += 0.1) {
    const [w1, h] = ink("CREATED BY NATURE", s, t), [w2] = ink("CURATED BY EXPERT", s, t);
    const err = Math.abs(w1 - 258) + Math.abs(w2 - 253) + 3 * Math.abs(h - 15);
    if (!best || err < best[0]) best = [err, s, +t.toFixed(1), w1, w2, h];
  }
  const nw = [ink("BASED IN BANGKOK", best[1], best[2])[0], ink("CURATED FOR YOU", best[1], best[2])[0]];
  return { best, nw };
});
console.log(JSON.stringify(res));
await b.close();
