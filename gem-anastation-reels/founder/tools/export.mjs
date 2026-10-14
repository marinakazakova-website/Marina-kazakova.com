// Export the Founder carousel: one PNG per slide (1080×1350, sRGB) and a
// side-by-side preview sheet.
// Usage: NODE_PATH=$(npm root -g) node tools/export.mjs   (needs playwright)
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

const { chromium } = createRequire(import.meta.url)("playwright");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "output");
fs.mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ args: ["--force-color-profile=srgb"] });
const page = await browser.newPage({ viewport: { width: 4600, height: 1430 }, deviceScaleFactor: 1 });
await page.goto("file://" + path.join(root, "carousel.html"));
await page.evaluate(() => document.fonts.ready);
await page.waitForLoadState("networkidle");

const names = { s1: "01_cover", s2: "02_craft", s3: "03_expertise", s4: "04_identity" };
for (const [id, name] of Object.entries(names)) {
  await page.locator("#" + id).screenshot({ path: path.join(out, `GA_founder_${name}.png`) });
}
await page.locator(".sheet").screenshot({ path: path.join(out, "GA_founder_preview.png") });
await browser.close();
console.log("exported to", out);
