#!/usr/bin/env node
// Usage: node scripts/check-service-times.mjs <base-url>
// Fetches home and the Hays page, strips markup, and checks the visible text against the oracle in
// regression/service-times/expected.json: every oracle time and qualifier present, no other clock time, and no
// forbidden time. Exit 1 on any miss. Footer text is part of every page, so this covers the footer too.
import { readFileSync } from "node:fs";
const base = (process.argv[2] || "http://localhost:4410").replace(/\/$/, "");
const exp = JSON.parse(readFileSync(new URL("../regression/service-times/expected.json", import.meta.url), "utf8"));
const want = new Set(exp.campuses.flatMap((c) => c.services.flatMap((s) => s.slots.map((x) => x.time))));
const norm = (t) => t.replace(/\s+/g, " ").trim().toUpperCase();
const CLOCK = /\b(\d{1,2})(?::(\d{2}))?\s?([AP])\.?M\b/gi;
let bad = 0;
for (const path of ["/", "/locations/hays/"]) {
  const html = await (await fetch(base + path)).text();
  const text = html
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/&amp;/g, "&");
  const found = new Set([...text.matchAll(CLOCK)].map((m) => `${m[1]}:${m[2] || "00"} ${m[3].toUpperCase()}M`));
  const problems = [];
  for (const t of want) if (!found.has(t)) problems.push(`missing ${t}`);
  for (const t of found) if (!want.has(t)) problems.push(`unexpected ${t}`);
  for (const f of exp.forbidden) if (text.includes(f)) problems.push(`forbidden ${f} present`);
  for (const q of ["(C3 Gym)", "with C3Kids"]) if (!text.includes(q)) problems.push(`missing qualifier ${q}`);
  console.log(`${path}: ${problems.length ? "FAIL" : "ok"} (found ${[...found].sort().join(", ")})`);
  for (const p of problems) console.log(`   - ${p}`);
  bad += problems.length;
}
process.exit(bad ? 1 : 0);
