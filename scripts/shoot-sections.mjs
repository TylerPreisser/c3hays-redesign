#!/usr/bin/env node
/**
 * Section-thumbnail SHOOT harness (Website Editor v2, U4-B).
 *
 * Renders every addable example section (and each variant) via the dev/tooling
 * route /section-preview/<id>[__<variant>]/, clips a preview image of the section,
 * and emits:
 *   1. JPG assets            → <out>/section-thumbs/<key>.jpg
 *   2. a fillable TS map      → scripts/out/section-thumbnails.generated.ts
 *   3. a manifest JSON        → scripts/out/section-thumbnails.manifest.json
 *
 * The TS map is exactly the shape of c3-backend's SECTION_THUMBNAILS
 * (Record<string,string>, keyed by `id` and `id:variant`) — hand it to v2-coder
 * (U4-A) to commit, or point --out at c3-backend/public so the assets land where
 * the editor app serves them.
 *
 * USAGE:
 *   # 1. Have the site reachable (either works):
 *   #    a) npm run dev                       (BASE_URL=http://localhost:3000)
 *   #    b) npm run build && npx serve out    (static export, BASE_URL=http://localhost:3000)
 *   # 2. node scripts/shoot-sections.mjs [--base <url>] [--out <dir>]
 *
 * Playwright is resolved from the sibling c3-backend install (no new dep here),
 * falling back to a local install if present.
 */
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);
const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");

/* ── args ── */
const argv = process.argv.slice(2);
const argOf = (flag, def) => { const i = argv.indexOf(flag); return i >= 0 && argv[i + 1] ? argv[i + 1] : def; };
const BASE = (argOf("--base", process.env.BASE_URL) || "http://localhost:3000").replace(/\/$/, "");
// Default: write straight into the sibling editor app's public/ if it exists.
const SIBLING_PUBLIC = path.resolve(REPO, "../c3-backend/public");
const OUT_BASE = argOf("--out", fs.existsSync(SIBLING_PUBLIC) ? SIBLING_PUBLIC : path.join(REPO, "public"));
const THUMB_DIR = path.join(OUT_BASE, "section-thumbs");
const META_DIR = path.join(HERE, "out");

/* ── resolve playwright (sibling c3-backend, then local) ── */
function loadPlaywright() {
  const candidates = [
    path.resolve(REPO, "../c3-backend/node_modules/playwright"),
    path.resolve(REPO, "node_modules/playwright"),
    "playwright",
  ];
  for (const c of candidates) {
    try { return require(c); } catch { /* try next */ }
  }
  throw new Error("Playwright not found. Install it, or run from beside c3-backend (which has it).");
}

/* ── shoot keys, parsed from the registry (single source of truth) ── */
function readShootKeys() {
  const src = fs.readFileSync(path.join(REPO, "src/lib/section-examples.tsx"), "utf8");
  // Only the SECTION_EXAMPLES array lines: each is `{ id: "x", ... variants: [{ key: "a" }, ...] }`.
  const keys = [];
  for (const line of src.split("\n")) {
    const idm = line.match(/\bid:\s*"([A-Za-z][A-Za-z0-9]*)"/);
    if (!idm || !/variants:\s*\[/.test(line)) continue;
    const id = idm[1];
    keys.push({ key: id, id, variant: undefined });
    for (const vm of line.matchAll(/\bkey:\s*"([A-Za-z0-9-]+)"/g)) {
      keys.push({ key: `${id}:${vm[1]}`, id, variant: vm[1] });
    }
  }
  return keys;
}

const safeName = (key) => key.replace(/:/g, "__");
const urlFor = ({ id, variant }) => `${BASE}/section-preview/${variant ? `${id}__${variant}` : id}/`;

async function main() {
  const { chromium } = loadPlaywright();
  const keys = readShootKeys();
  if (keys.length === 0) throw new Error("No shoot keys parsed from section-examples.tsx");
  fs.mkdirSync(THUMB_DIR, { recursive: true });
  fs.mkdirSync(META_DIR, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
  const map = {};
  const results = [];

  for (const k of keys) {
    const url = urlFor(k);
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 20000 });
      // Section-only thumbnails: hide global site chrome so the preview shows just
      // the section (the header is position:fixed and would otherwise overlay it).
      await page.addStyleTag({ content: "header,footer{display:none!important}" });
      const section = page.locator("[data-preview-root] section").first();
      await section.waitFor({ state: "visible", timeout: 10000 });
      const box = await section.boundingBox();
      const clip = box
        ? { x: Math.max(0, box.x), y: Math.max(0, box.y), width: Math.min(1280, box.width), height: Math.min(900, box.height) }
        : undefined;
      const file = path.join(THUMB_DIR, `${safeName(k.key)}.jpg`);
      await page.screenshot({ path: file, type: "jpeg", quality: 78, clip });
      map[k.key] = `/section-thumbs/${safeName(k.key)}.jpg`;
      results.push({ key: k.key, ok: true, file });
      console.log(`  ✓ ${k.key} → ${map[k.key]}`);
    } catch (err) {
      results.push({ key: k.key, ok: false, error: String(err && err.message || err) });
      console.warn(`  ✗ ${k.key} — ${err && err.message}`);
    }
  }

  await browser.close();

  /* ── emit the fillable SECTION_THUMBNAILS map + manifest ── */
  const entries = Object.keys(map).sort().map((k) => `  ${JSON.stringify(k)}: ${JSON.stringify(map[k])},`).join("\n");
  const ts = `/**\n * GENERATED by c3hays-redesign scripts/shoot-sections.mjs — do not hand-edit.\n * Paste into c3-backend src/lib/content/section-thumbnails.ts SECTION_THUMBNAILS,\n * or copy the section-thumbs/ assets alongside. Keyed by id and id:variant.\n */\nexport const SECTION_THUMBNAILS: Record<string, string> = {\n${entries}\n};\n`;
  fs.writeFileSync(path.join(META_DIR, "section-thumbnails.generated.ts"), ts);
  fs.writeFileSync(path.join(META_DIR, "section-thumbnails.manifest.json"), JSON.stringify({ base: BASE, outDir: THUMB_DIR, map, results }, null, 2));

  const ok = results.filter((r) => r.ok).length;
  console.log(`\nShot ${ok}/${results.length} thumbnails → ${THUMB_DIR}`);
  console.log(`Map + manifest → ${META_DIR}`);
  if (ok < results.length) process.exitCode = 1;
}

main().catch((e) => { console.error(e); process.exit(1); });
