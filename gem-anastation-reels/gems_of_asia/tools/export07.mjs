// Export slide 07 (slide07.html) to output/GA_GemsOfAsia_07_from_asia_to_you.png
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { chromium } = createRequire(import.meta.url)("playwright");
const browser = await chromium.launch({ args: ["--force-color-profile=srgb"] });
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
await page.goto("file://" + path.join(root, "slide07.html"));
await page.evaluate(() => document.fonts.ready);
await page.waitForLoadState("networkidle");
await page.locator("#s7").screenshot({ path: path.join(root, "output/GA_GemsOfAsia_07_from_asia_to_you.png") });
await browser.close();
console.log("written output/GA_GemsOfAsia_07_from_asia_to_you.png");
