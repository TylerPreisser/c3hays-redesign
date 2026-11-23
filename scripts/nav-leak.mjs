#!/usr/bin/env node
// Client-navigation leak check in a real browser: home -> another page -> home, N times, through the site's own links (no reloads).
// After each lap it counts the document/window/body event listeners still attached (addEventListener minus removeEventListener,
// by type) and the page's timers (setInterval/setTimeout still pending). The numbers must not grow lap over lap: a GSAP
// ScrollTrigger, Lenis or timer that is not killed on unmount shows here. Read-only GETs.
//   PLAYWRIGHT_DIR=<dir> node scripts/nav-leak.mjs <origin> [laps=10]
import { createRequire } from "node:module";
const origin = (process.argv[2] || "").replace(/\/$/, "");
const laps = Number(process.argv[3] || 10);
if (!origin || !process.env.PLAYWRIGHT_DIR) { console.log("FAIL usage: PLAYWRIGHT_DIR=<dir> node scripts/nav-leak.mjs <origin> [laps]"); process.exit(1); }
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_DIR + "/node_modules/playwright");
// PLANT_LEAK=1 proves the check can fail: every client navigation then leaks one new window listener and one interval, and the run must exit 1.
const PLANT = process.env.PLANT_LEAK === "1";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
await p.addInitScript((PLANT_FLAG) => {
  // a listener is live from its first add until its remove; adding the same function twice is one listener (the browser dedupes), so key by identity
  const live = new Map(); // fn -> Set of "target:type:capture"
  const name = (t) => (t === window ? "window" : t === document ? "document" : t === document.body ? "body" : t === document.documentElement ? "html" : null);
  const add = EventTarget.prototype.addEventListener, rem = EventTarget.prototype.removeEventListener;
  const cap = (o) => (o === true || (o && o.capture) ? "c" : "");
  EventTarget.prototype.addEventListener = function (ty, f, o) { if (name(this) && f) { if (!live.has(f)) live.set(f, new Set()); live.get(f).add(`${name(this)}:${ty}:${cap(o)}`); } return add.call(this, ty, f, o); };
  EventTarget.prototype.removeEventListener = function (ty, f, o) { if (name(this) && f && live.has(f)) { live.get(f).delete(`${name(this)}:${ty}:${cap(o)}`); if (!live.get(f).size) live.delete(f); } return rem.call(this, ty, f, o); };
  const timers = new Set(); const si = window.setInterval, ci = window.clearInterval;
  window.setInterval = function (...a) { const id = si.apply(this, a); timers.add(id); return id; };
  window.clearInterval = function (id) { timers.delete(id); return ci.call(this, id); };
  if (PLANT_FLAG) {
    const ps = history.pushState.bind(history);
    history.pushState = function (...a) { window.addEventListener("resize", () => void a.length); window.setInterval(() => {}, 60000); return ps(...a); };
  }
  window.__leak = () => { const by = {}; for (const set of live.values()) for (const k of set) by[k] = (by[k] || 0) + 1; return { listeners: Object.values(by).reduce((a, b) => a + b, 0), intervals: timers.size, byKey: by, pins: document.querySelectorAll(".pin-spacer").length }; };
}, PLANT);
const go = async (href, test) => { await p.locator(`a[href='${href}'], a[href='${href}/']`).filter({ visible: true }).first().click({ timeout: 15000 }); await p.waitForFunction(test, null, { timeout: 15000 }); await p.waitForTimeout(1200); };
await p.goto(origin + "/", { waitUntil: "load" }); await p.waitForTimeout(3000);
const rows = [];
for (let i = 0; i <= laps; i++) {
  if (i > 0) {
    await go("/watch", () => location.pathname.startsWith("/watch"));
    await p.evaluate(() => window.scrollTo(0, 600)); await p.waitForTimeout(400);
    await go("/", () => location.pathname === "/");
    await p.evaluate(() => window.scrollTo(0, 900)); await p.waitForTimeout(400);
  }
  rows.push(await p.evaluate(() => window.__leak()));
}
await b.close();
for (const [i, r] of rows.entries()) console.log(`lap ${i}: listeners ${r.listeners}, intervals ${r.intervals}, pin-spacers ${r.pins}`);
const first = rows[1] ?? rows[0], last = rows[rows.length - 1];
const grew = last.listeners > first.listeners || last.intervals > first.intervals || last.pins > first.pins;
if (grew) { const g = Object.entries(last.byKey).filter(([k, v]) => v > (first.byKey[k] || 0)).slice(0, 8); console.log("FAIL grew:", JSON.stringify(g)); process.exit(1); }
console.log(`nav-leak: no growth over ${laps} laps (lap 1 -> lap ${laps}: listeners ${first.listeners} -> ${last.listeners}, intervals ${first.intervals} -> ${last.intervals})`);
