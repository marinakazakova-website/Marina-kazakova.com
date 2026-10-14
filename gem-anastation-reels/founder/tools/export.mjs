// Export the Founder carousel (1080×1350) or Stories (1080×1920): one sRGB
// PNG per slide and a side-by-side preview sheet.
// Usage: NODE_PATH=$(npm root -g) node tools/export.mjs [carousel|stories]
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

const { chromium } = createRequire(import.meta.url)("playwright");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "output");
fs.mkdirSync(out, { recursive: true });

const target = process.argv[2] || "carousel";
const cfg = {
  carousel: { html: "carousel.html", prefix: "GA_founder", dir: out, h: 1430 },
  stories: { html: "stories.html", prefix: "GA_founder_story", dir: path.join(out, "stories"), h: 2000 },
}[target];
fs.mkdirSync(cfg.dir, { recursive: true });

const browser = await chromium.launch({ args: ["--force-color-profile=srgb"] });
const page = await browser.newPage({ viewport: { width: 4600, height: cfg.h }, deviceScaleFactor: 1 });
await page.goto("file://" + path.join(root, cfg.html));
await page.evaluate(() => document.fonts.ready);
await page.waitForLoadState("networkidle");

const names = { s1: "01_cover", s2: "02_craft", s3: "03_expertise", s4: "04_identity" };
for (const [id, name] of Object.entries(names)) {
  await page.locator("#" + id).screenshot({ path: path.join(cfg.dir, `${cfg.prefix}_${name}.png`) });
}
await page.locator(".sheet").screenshot({ path: path.join(cfg.dir, `${cfg.prefix}_preview.png`) });
await browser.close();
console.log("exported", target, "to", cfg.dir);
