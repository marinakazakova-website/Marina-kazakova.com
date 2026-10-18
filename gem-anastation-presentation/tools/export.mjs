// Render src/deck.html → output/GA_slide_XX.png (1920×1080) + output/GA_pitch_deck.pdf
// usage: NODE_PATH=$(npm root -g) node tools/export.mjs
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

const { chromium } = createRequire(import.meta.url)("playwright");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "output");

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto("file://" + path.join(root, "src/deck.html"));
await page.evaluate(() => document.fonts.ready);

// fail loudly if a brand font did not load
const missing = await page.evaluate(() =>
  ["400 20px Didot", "italic 400 20px Didot", "700 20px Didot", "20px AvantGarde"]
    .filter((f) => !document.fonts.check(f, "Аa")));
if (missing.length) console.warn("FONT NOT LOADED:", missing);

for (const el of await page.$$("section.slide")) {
  const id = (await el.getAttribute("id")).slice(1);
  await el.screenshot({ path: path.join(out, `GA_slide_${id}.png`) });
  console.log("png", id);
}

await page.addStyleTag({ content: "html,body{background:none}.slide{margin:0}" });
await page.pdf({ path: path.join(out, "GA_pitch_deck.pdf"), width: "1920px", height: "1080px", printBackground: true });
console.log("pdf");
await browser.close();
