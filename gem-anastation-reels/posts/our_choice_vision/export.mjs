// NODE_PATH=$(npm root -g) node export.mjs -> output/GA_OurChoiceVision.png
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
const root = path.dirname(fileURLToPath(import.meta.url));
const { chromium } = createRequire(import.meta.url)("playwright");
const b = await chromium.launch({ args: ["--force-color-profile=srgb"] });
const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
await p.goto("file://" + path.join(root, "layout.html"));
await p.evaluate(() => document.fonts.ready);
await p.waitForLoadState("networkidle");
await p.locator("#s").screenshot({ path: path.join(root, "output/GA_OurChoiceVision.png") });
await b.close();
console.log("written output/GA_OurChoiceVision.png");
