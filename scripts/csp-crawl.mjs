#!/usr/bin/env node
// Crawl every page type of the BUILT Worker in a real browser and fail on anything the browser's own policy or network
// refuses: a `securitypolicyviolation` event, a console CSP message, a failed request, a same-origin 4xx/5xx
// (except the one 404 this crawl expects), or a page error.
//
// Why: the Content-Security-Policy is built in src/lib/security-headers.ts and sent by the built Worker; a unit test of the
// header string cannot tell that the page's own browser code fetches an origin the policy forbids. This does.
//
//   CMS_LIVE=1 NEXT_PUBLIC_CMS_URL=http://127.0.0.1:4673 npm run cf:build     (the same build smoke-workerd.mjs runs)
//   node scripts/csp-crawl.mjs [--port 4652] [--studio-port 4673] [--dir <built tree>] [--shots <dir>]
//
// It starts two things and stops both by process group: `wrangler dev --local` on the built Worker (config written to a
// temp dir: staging's vars, no service binding, so the site reads scripts/fake-studio.mjs over the public-URL path) and
// the fake Studio. Third parties are stubbed at the network layer (page.route) with empty valid answers, so the check does
// not depend on the internet; the browser still applies the page's CSP BEFORE the request is routed, so a blocked origin
// is reported whatever the stub. The church's eSpace calendar answers a fixed payload that includes a registration link.
// Playwright is found in this repo's node_modules, a sibling c3-backend, or the npx cache; none found is a FAIL.
// Exit 0 = clean. Exit 1 = findings (each printed).
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(`--${n}`); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
const PORT = Number(opt("port", "4652"));
const STUDIO_PORT = Number(opt("studio-port", "4673"));
const REPO = resolve(opt("dir", fileURLToPath(new URL("..", import.meta.url))));
const SHOTS = opt("shots", ""); // a folder: also save stills of /events (1440, 1366, 390)
const MODE = opt("mode", "espace"); // the events mode the fake Studio serves: espace | studio
const ORIGIN = `http://127.0.0.1:${PORT}`;
const BOOT_MS = 180_000;

function findPlaywright() {
  const cands = [join(REPO, "node_modules/playwright"), join(REPO, "../c3-backend/node_modules/playwright"), join(REPO, "../../../../c3-backend/node_modules/playwright")];
  const npx = join(homedir(), ".npm/_npx");
  if (existsSync(npx)) for (const d of readdirSync(npx)) cands.push(join(npx, d, "node_modules/playwright"));
  // the first copy whose browser is actually installed (several versions can sit in the npx cache)
  for (const c of cands) {
    if (!existsSync(join(c, "package.json"))) continue;
    try { const pw = createRequire(import.meta.url)(c); if (existsSync(pw.chromium.executablePath())) return c; } catch {}
  }
  return undefined;
}

const TMP = mkdtempSync(join(tmpdir(), "c3site-csp-crawl-"));
const children = [];
const stopAll = () => { for (const c of children) { try { process.kill(-c.pid, "SIGTERM"); } catch {} } };
process.on("exit", () => { stopAll(); rmSync(TMP, { recursive: true, force: true }); });
for (const s of ["SIGINT", "SIGTERM"]) process.on(s, () => process.exit(130));

if (!existsSync(join(REPO, ".open-next", "worker.js"))) { console.log("FAIL no .open-next/worker.js: build first (see the header of this file)"); process.exit(1); }
const pwPath = findPlaywright();
if (!pwPath) { console.log("FAIL Playwright not found (node_modules, ../c3-backend/node_modules or ~/.npm/_npx): this check cannot run, so it fails"); process.exit(1); }
const { chromium } = createRequire(import.meta.url)(pwPath);

// ── the worker: staging's vars, no service binding ──
const wr = readFileSync(join(REPO, "wrangler.jsonc"), "utf8");
const siteKey = (wr.match(/"env"[\s\S]*?"TURNSTILE_SITE_KEY":\s*"(0x[^"]+)"/) || [])[1] || "";
writeFileSync(join(TMP, "wrangler.jsonc"), JSON.stringify({
  name: "c3hays-csp-crawl", main: join(REPO, ".open-next/worker.js"), compatibility_date: "2025-03-25", compatibility_flags: ["nodejs_compat"],
  assets: { directory: join(REPO, ".open-next/assets"), binding: "ASSETS" },
  vars: { CMS_LIVE: "1", NODE_ENV: "production", TURNSTILE_SITE_KEY: siteKey },
}));

function launch(cmd, argv, opts) {
  const log = [];
  const c = spawn(cmd, argv, { detached: true, stdio: ["ignore", "pipe", "pipe"], ...opts });
  c.stdout.on("data", (b) => log.push(b.toString()));
  c.stderr.on("data", (b) => log.push(b.toString()));
  children.push(c);
  return { c, text: () => log.join("").replace(/\x1b\[[0-9;]*m/g, "") };
}
async function until(fn, what, ms) {
  const t0 = Date.now();
  while (!(await fn())) { if (Date.now() - t0 > ms) throw new Error(`${what} not ready after ${ms} ms`); await new Promise((r) => setTimeout(r, 250)); }
}

const findings = [];
const note = (page, kind, detail) => { findings.push({ page, kind, detail: String(detail).slice(0, 240) }); };

// what a page's third parties get instead of the internet
const ESPACE_PAYLOAD = (() => {
  const day = (n) => { const d = new Date(Date.now() + n * 86400000); return d.toISOString().slice(0, 10); };
  const ev = (n, h, title, extra = {}) => ({ Title: title, locCodes: "C3Hays - ", start: `${day(n)}T${h}:00:00.0000000`, end: `${day(n)}T${String(+h + 1).padStart(2, "0")}:30:00.0000000`, allDay: false, StartTime: "", EventStartTime: `${+h > 12 ? +h - 12 : +h}:00 ${+h >= 12 ? "PM" : "AM"}`, EventEndTime: `${+h + 1 > 12 ? +h - 11 : +h + 1}:30 ${+h + 1 >= 12 ? "PM" : "AM"}`, IsHoliday: false, url: "", ...extra });
  // the event with a registration link is the soonest, so it is in the Upcoming strip whatever else is merged in
  return [ev(1, "17", "Registration Night", { url: "https://example.org/register/crawl" }), ev(2, "19", "Cornhole League"), ev(3, "18", "Marriage Night"), ev(4, "08", "Weekend Services")];
})();
const PNG = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGNgYGD4DwABBAEAHtbwVAAAAABJRU5ErkJggg==", "base64");
async function stub(route) {
  const req = route.request();
  const u = new URL(req.url());
  if (u.hostname === "127.0.0.1" || u.hostname === "localhost") return route.continue();
  const t = req.resourceType();
  if (/espace\.cool$/.test(u.hostname) && /GetFullCalendarEvents/.test(u.pathname)) return route.fulfill({ status: 200, contentType: "application/json", headers: { "access-control-allow-origin": "*" }, body: JSON.stringify(ESPACE_PAYLOAD) });
  const cors = { "access-control-allow-origin": "*" };
  if (t === "document") return route.fulfill({ status: 200, contentType: "text/html", body: "<!doctype html><title>stub</title>" });
  if (t === "script") return route.fulfill({ status: 200, contentType: "application/javascript", headers: cors, body: "" });
  if (t === "stylesheet") return route.fulfill({ status: 200, contentType: "text/css", headers: cors, body: "" });
  if (t === "image") return route.fulfill({ status: 200, contentType: "image/png", headers: cors, body: PNG });
  if (t === "font") return route.fulfill({ status: 200, contentType: "font/woff2", headers: cors, body: Buffer.alloc(0) });
  return route.fulfill({ status: 200, contentType: "application/json", headers: cors, body: "{}" });
}

const PAGES = [
  ["home", "/"], ["hays campus", "/locations/hays/"], ["colby campus", "/locations/colby/"], ["events", "/events/"], ["news", "/news/"],
  ["article (a message)", "/messages/srm_1/"], ["about", "/about/"], ["give", "/give/"], ["contact (connect)", "/connect/"], ["search", "/search/"],
  ["signup form (visit)", "/visit/"], ["messages", "/messages/"], ["watch", "/watch/"], ["media image", "/media/aB3dEfGhIjKlMnOpQr_-Zz.png"],
  ["edit-mode canvas", "/?preview=crawl-token&cmsEdit=1"], ["not found page", "/nope-xyz/"],
];
const EXPECT = { "/media/aB3dEfGhIjKlMnOpQr_-Zz.png": 404, "/nope-xyz/": 404 }; // the media route's plain 404 (Studio has no such file) and the site's 404 page

try {
  const studio = launch(process.execPath, [join(REPO, "scripts/fake-studio.mjs"), String(STUDIO_PORT)], { cwd: REPO, env: { ...process.env, FAKE_EVENTS_MODE: MODE } });
  await until(async () => { try { return (await fetch(`http://127.0.0.1:${STUDIO_PORT}/api/content/site`)).ok; } catch { return false; } }, "fake Studio", 20_000);
  const w = launch(join(REPO, "node_modules/.bin/wrangler"), ["dev", "-c", join(TMP, "wrangler.jsonc"), "--local", "--port", String(PORT), "--ip", "127.0.0.1", "--persist-to", join(TMP, "state"), "--show-interactive-dev-session=false"], { cwd: REPO, env: { ...process.env, CI: "1", WRANGLER_LOG_PATH: join(TMP, "wl") } });
  await until(() => { if (w.c.exitCode !== null) throw new Error(`wrangler dev exited\n${w.text().slice(-2000)}`); return /Ready on http/.test(w.text()); }, "wrangler dev", BOOT_MS);

  const browser = await chromium.launch();
  const VIEWS = [{ name: "desktop", viewport: { width: 1440, height: 900 }, mobile: false }, { name: "phone", viewport: { width: 390, height: 844 }, mobile: true }];
  if (SHOTS) { VIEWS.push({ name: "laptop", viewport: { width: 1366, height: 768 }, mobile: false }); mkdirSync(SHOTS, { recursive: true }); }
  for (const v of VIEWS) {
    const ctx = await browser.newContext({ viewport: v.viewport, isMobile: v.mobile, hasTouch: v.mobile, deviceScaleFactor: v.mobile ? 2 : 1 });
    await ctx.route("**/*", stub);
    for (const [name, path] of PAGES) {
      if (v.name === "laptop" && path !== "/events/") continue; // the extra view is for the stills only
      const label = `${name} (${v.name})`;
      const page = await ctx.newPage();
      await page.addInitScript(() => {
        window.__csp = [];
        document.addEventListener("securitypolicyviolation", (e) => window.__csp.push(`${e.violatedDirective} blocked ${e.blockedURI}`));
      });
      page.on("pageerror", (e) => note(label, "page error", e.message));
      page.on("console", (m) => { if (m.type() === "error" && /Content Security Policy|violates the following/.test(m.text())) note(label, "csp console", m.text()); });
      page.on("requestfailed", (r) => {
        const why = r.failure()?.errorText ?? "";
        if (/ERR_ABORTED/.test(why) && /[?&]_rsc=/.test(r.url())) return; // a router prefetch the page's own navigation cancelled
        note(label, "request failed", `${r.url()} ${why}`);
      });
      page.on("response", (r) => {
        const u = new URL(r.url());
        if (u.origin !== ORIGIN || r.status() < 400) return;
        if (r.url() === `${ORIGIN}${path}` && EXPECT[path] === r.status()) return;
        if (/\/favicon\.ico$/.test(u.pathname)) return;
        note(label, `http ${r.status()}`, r.url());
      });
      try {
        const res = await page.goto(`${ORIGIN}${path}`, { waitUntil: "load", timeout: 60_000 });
        const want = EXPECT[path] ?? 200;
        if (res && res.status() !== want) note(label, "status", `${res.status()} (expected ${want})`);
        // let the page's own browser code run: lazy sections, the calendar's fetch, embedded players, the signup widget
        await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)); } });
        await page.waitForTimeout(1500);
        for (const m of await page.evaluate(() => window.__csp)) note(label, "securitypolicyviolation", m);
        if (SHOTS && path === "/events/") {
          // a tall element capture lays fixed things (the sticky header, the off-screen skip link) over the middle of the picture; hide them for the still only
          await page.evaluate(() => { for (const el of document.querySelectorAll("body *")) if (getComputedStyle(el).position === "fixed") el.style.display = "none"; });
          await page.waitForTimeout(800);
          for (const sec of ["events-upcoming", "events-calendar"]) {
            const loc = page.locator(`[data-section='${sec}']`).first();
            await loc.scrollIntoViewIfNeeded(); await page.waitForTimeout(500);
            await loc.screenshot({ path: join(SHOTS, `${MODE}-${sec}-${v.name === "desktop" ? "1440" : v.name === "laptop" ? "1366" : "390"}.png`) });
          }
        }
        if (path === "/events/" && v.name === "desktop") {
          const txt = (await page.textContent("main")) || "";
          if (!/Cornhole League/.test(txt)) note(label, "events not rendered", "the church's calendar events are not on the page");
          if (!(await page.locator("a[href='https://example.org/register/crawl']").count())) note(label, "registration link", "the event with a registration link shows no link on the page");
        }
      } catch (e) { note(label, "load error", e.message); }
      await page.close();
    }
    await ctx.close();
  }
  await browser.close();
} catch (e) {
  note("harness", "error", e.message);
}
stopAll();

// the same finding on every page is one line
const seen = new Map();
for (const f of findings) { const k = `${f.kind} :: ${f.detail}`; seen.set(k, [...(seen.get(k) ?? []), f.page]); }
for (const [k, pages] of seen) console.log(`FAIL ${k}\n     on: ${[...new Set(pages)].join(", ")}`);
if (findings.length) { console.log(`csp-crawl: ${seen.size} distinct finding(s) FAILED`); process.exit(1); }
console.log(`csp-crawl: clean (${PAGES.length} pages x ${2} viewports)`);
