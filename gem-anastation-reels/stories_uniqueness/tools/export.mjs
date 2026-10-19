// Export the Uniqueness Stories: one sRGB PNG per story (1080×1920) and a
// side-by-side preview. Usage: NODE_PATH=$(npm root -g) node tools/export.mjs
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

const { chromium } = createRequire(import.meta.url)("playwright");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "output");
fs.mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ args: ["--force-color-profile=srgb"] });
const page = await browser.newPage({ viewport: { width: 3600, height: 2000 }, deviceScaleFactor: 1 });
await page.goto("file://" + path.join(root, "stories.html"));
await page.evaluate(() => document.fonts.ready);
await page.waitForLoadState("networkidle");

const names = { s1: "GA_Story_01_Nature", s2: "GA_Story_02_Expert", s3: "GA_Story_03_Connect" };
for (const [id, name] of Object.entries(names)) {
  await page.locator("#" + id).screenshot({ path: path.join(out, `${name}.png`) });
}
await page.locator(".sheet").screenshot({ path: path.join(out, "GA_Stories_Uniqueness_preview.png") });
await browser.close();
console.log("exported to", out);
