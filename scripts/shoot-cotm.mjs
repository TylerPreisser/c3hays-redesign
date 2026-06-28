// Capture the LIVE Church on the Move site for design reference (research only).
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
const require = createRequire(import.meta.url);
const { chromium } = require("/Users/tylerpreisser/.npm/_npx/e41f203b7505f1fb/node_modules/playwright");

const OUT = join(process.cwd(), "screenshots", "cotm-live");
const PAGES = [
  ["home", "https://www.churchonthemove.com/"],
  ["locations", "https://www.churchonthemove.com/locations"],
  ["watch", "https://www.churchonthemove.com/watchonline"],
  ["next", "https://www.churchonthemove.com/nextmove"],
  ["smallgroups", "https://www.churchonthemove.com/smallgroups"],
];
const BPS = [["desktop", 1440, 900], ["mobile", 390, 844]];

const browser = await chromium.launch();
for (const [bp, w, h] of BPS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1.5 });
  for (const [name, url] of PAGES) {
    const page = await ctx.newPage();
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
      await page.waitForTimeout(2500);
      // scroll to load lazy content
      await page.evaluate(async () => {
        await new Promise((r) => { let y = 0; const t = setInterval(() => { window.scrollBy(0, 800); y += 800; if (y > document.body.scrollHeight) { clearInterval(t); r(); } }, 120); });
      });
      await page.waitForTimeout(1500);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(800);
      const file = join(OUT, bp, `${name}.png`);
      mkdirSync(join(OUT, bp), { recursive: true });
      await page.screenshot({ path: file, fullPage: true });
      console.log(`✓ [${bp}] ${name} ${url}`);
    } catch (e) {
      console.log(`✗ [${bp}] ${name} — ${e.message.slice(0, 80)}`);
    }
    await page.close();
  }
  await ctx.close();
}
await browser.close();
console.log("done → screenshots/cotm-live/");
