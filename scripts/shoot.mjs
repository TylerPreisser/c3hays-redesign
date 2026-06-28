// C3 visual + functional audit harness.
// Loads every route at mobile/tablet/desktop, scrolls to trigger scroll animations,
// captures full-page screenshots, and records console errors, failed requests,
// horizontal-overflow defects, and broken internal links.
//
// Run:  NODE_PATH=<playwright node_modules> node scripts/shoot.mjs [label]
// Output: screenshots/<label>/<breakpoint>/<route>.png  + screenshots/<label>/report.json

import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
// Import Playwright from the global npx cache without polluting project node_modules.
const require = createRequire(import.meta.url);
const { chromium } = require(
  process.env.PLAYWRIGHT_PATH ||
    "/Users/tylerpreisser/.npm/_npx/e41f203b7505f1fb/node_modules/playwright"
);

const BASE = process.env.BASE_URL || "http://localhost:4321";
const LABEL = process.argv[2] || "run";
const OUT = join(process.cwd(), "screenshots", LABEL);

const ROUTES = [
  ["home", "/"],
  ["about", "/about"],
  ["visit", "/visit"],
  ["beliefs", "/beliefs"],
  ["locations", "/locations"],
  ["locations-hays", "/locations/hays"],
  ["locations-colby", "/locations/colby"],
  ["messages", "/messages"],
  ["watch", "/watch"],
  ["counseling", "/counseling"],
  ["connect", "/connect"],
  ["give", "/give"],
  ["not-found", "/this-page-does-not-exist"],
];

const BREAKPOINTS = [
  ["mobile", 390, 844],
  ["tablet", 834, 1112],
  ["desktop", 1440, 900],
];

async function autoScroll(page) {
  // Drive TRUSTED wheel events via the mouse so Lenis (which hijacks scroll on
  // desktop via transforms) actually advances and fires GSAP ScrollTrigger
  // reveals + next/image lazy loading — exactly as a real user scrolling.
  const docHeight = await page.evaluate(
    () => Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
  );
  const vh = (await page.viewportSize()).height;
  const steps = Math.ceil((docHeight + vh) / (vh * 0.7)) + 2;
  await page.mouse.move(200, 200);
  for (let i = 0; i < steps; i++) {
    await page.mouse.wheel(0, vh * 0.7);
    await page.waitForTimeout(150); // let Lenis ease + ScrollTrigger fire
  }
  await page.waitForTimeout(400);
  // Ease back to top so the captured fold matches a fresh load.
  for (let i = 0; i < steps + 2; i++) {
    await page.mouse.wheel(0, -vh);
    await page.waitForTimeout(40);
  }
  await page.waitForTimeout(500);
  // Wait for fonts + every image to finish (lazy images now have src set).
  await page.evaluate(async () => {
    if (document.fonts && document.fonts.ready) { try { await document.fonts.ready; } catch {} }
    await Promise.all(
      [...document.images].map((img) =>
        img.complete && img.naturalWidth > 0
          ? Promise.resolve()
          : new Promise((res) => {
              const done = () => res();
              img.addEventListener("load", done, { once: true });
              img.addEventListener("error", done, { once: true });
              setTimeout(done, 4000);
            })
      )
    );
  });
  await page.waitForTimeout(400);
}

const report = { label: LABEL, base: BASE, started: new Date().toISOString(), pages: [] };

const browser = await chromium.launch();
for (const [bpName, w, h] of BREAKPOINTS) {
  const context = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 2,
  });
  for (const [name, path] of ROUTES) {
    const page = await context.newPage();
    const errors = [];
    const failed = [];
    const harness = [];
    // Dev-only noise that does not exist in the production static export.
    const isDevNoise = (t) =>
      /WebSocket is already in CLOSING|HMR|hot-update|__nextjs|_next\/static\/chunks\/.*\.hot/.test(t);
    page.on("console", (m) => {
      if (m.type() === "error" && !isDevNoise(m.text())) errors.push(m.text());
    });
    page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));
    page.on("requestfailed", (r) => {
      const t = `${r.failure()?.errorText} ${r.url()}`;
      // Ignore aborted same-origin Next.js <Link> prefetches cancelled on page close.
      const prefetchNoise = /ERR_ABORTED/.test(t) && t.includes(BASE);
      if (!isDevNoise(t) && !prefetchNoise) failed.push(t);
    });
    let status = 0;
    try {
      const resp = await page.goto(BASE + path, {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      });
      status = resp ? resp.status() : 0;
      await page.waitForLoadState("load").catch(() => {});
      await page.waitForTimeout(900); // let client hydrate + Lenis settle
      try { await autoScroll(page); } catch (e) { harness.push("SCROLL: " + e.message); }
    } catch (e) {
      harness.push("NAV: " + e.message);
    }

    // Horizontal overflow check (the classic layout defect).
    let overflow = { scrollW: 0, clientW: 0, overflowing: false, offenders: [] };
    try {
    overflow = await page.evaluate(() => {
      const de = document.documentElement;
      const scrollW = de.scrollWorstW = Math.max(de.scrollWidth, document.body.scrollWidth);
      const clientW = de.clientWidth;
      const offenders = [];
      if (scrollW > clientW + 1) {
        for (const el of document.querySelectorAll("*")) {
          const r = el.getBoundingClientRect();
          if (r.right > clientW + 2 || r.left < -2) {
            offenders.push({
              tag: el.tagName.toLowerCase(),
              cls: (el.className && el.className.toString().slice(0, 60)) || "",
              right: Math.round(r.right),
              left: Math.round(r.left),
            });
          }
        }
      }
      return { scrollW, clientW, overflowing: scrollW > clientW + 1, offenders: offenders.slice(0, 8) };
    });
    } catch (e) { harness.push("OVF: " + e.message); }

    // Collect internal links (home only, to dedupe link-check work).
    let links = [];
    if (name === "home" && bpName === "desktop") {
      links = await page.evaluate(() =>
        [...new Set([...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")))]
          .filter((h) => h && !h.startsWith("http") && !h.startsWith("#") && !h.startsWith("mailto") && !h.startsWith("tel"))
      );
    }

    const file = join(OUT, bpName, `${name}.png`);
    mkdirSync(dirname(file), { recursive: true });
    try {
      await page.screenshot({ path: file, fullPage: true });
    } catch (e) {
      harness.push("SHOT: " + e.message);
    }

    report.pages.push({
      route: path, name, breakpoint: bpName, status,
      errors, failed, harness, overflow, links,
      shot: file.replace(process.cwd() + "/", ""),
    });
    const flag = errors.length || failed.length || overflow.overflowing ? "⚠" : "✓";
    console.log(`${flag} [${bpName}] ${path}  status=${status} err=${errors.length} ovf=${overflow.overflowing}`);
    await page.close();
  }
  await context.close();
}
await browser.close();

mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, "report.json"), JSON.stringify(report, null, 2));

// Summary
const totErr = report.pages.reduce((a, p) => a + p.errors.length, 0);
const totFail = report.pages.reduce((a, p) => a + p.failed.length, 0);
const totOvf = report.pages.filter((p) => p.overflow.overflowing).length;
console.log(`\n=== ${LABEL}: ${report.pages.length} shots | ${totErr} console errors | ${totFail} failed requests | ${totOvf} overflow defects ===`);
writeFileSync(join(OUT, "summary.txt"),
  `${LABEL}\nshots=${report.pages.length} consoleErrors=${totErr} failedReq=${totFail} overflowDefects=${totOvf}\n`);
