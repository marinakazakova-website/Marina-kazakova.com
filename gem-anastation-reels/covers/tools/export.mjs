// Export the covers in covers.html: one PNG per <section class="cover" id=…>.
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { chromium } = createRequire(import.meta.url)("playwright");
const browser = await chromium.launch({ args: ["--force-color-profile=srgb"] });
const page = await browser.newPage({ viewport: { width: 3600, height: 2000 }, deviceScaleFactor: 1 });
await page.goto("file://" + path.join(root, "covers.html"));
await page.evaluate(() => document.fonts.ready);
await page.waitForLoadState("networkidle");
const m = await page.$eval(".title", (e) => { const r = document.createRange(); r.selectNodeContents(e);
  const b = r.getBoundingClientRect(); return [b.left - e.closest(".cover").getBoundingClientRect().left, b.width]; });
console.log("title text box x/width:", m.map((v) => v.toFixed(1)).join(" / "));
for (const id of await page.$$eval(".cover", (els) => els.map((e) => e.id))) {
  await page.locator("#" + id).screenshot({ path: path.join(root, `output/GA_Cover_GemsOfAsia_${id}.png`) });
  console.log("written", id);
}
await browser.close();
