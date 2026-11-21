/**
 * Service times are Studio data. Two guards:
 *  1. No clock-time literal in any string, template or JSX text under src/ except the generated snapshot
 *     (comments are ignored). Put a "9:30 AM" back in a component and this fails.
 *  2. Studio's records, and the snapshot when Studio is down or sends junk, both render the church's own line
 *     (oracle: regression/service-times/, taken from celebratejesus.org).
 */
import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import ts from "typescript";
import { resolveTimes, fullLine } from "@/lib/service-times-core";
import { SERVICE_TIMES_SNAPSHOT } from "@/data/service-times.snapshot";

const ROOT = join(__dirname, "..");
const ALLOWED = new Set(["src/data/service-times.snapshot.ts"]);
// A clock time is a number with am/pm. Bare "3:16" (scripture) and "00:00" (a player timer) are not service times.
const CLOCK = /\b\d{1,2}(?::\d{2})?\s?[ap]\.?m\b/i;

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? files(p) : /\.tsx?$/.test(n) ? [p] : [];
  });
}

/** Text a reader could see or a component could print: string/template literals and JSX text, never comments. */
export function literalsOf(source: string, name = "x.tsx"): string[] {
  const sf = ts.createSourceFile(name, source, ts.ScriptTarget.Latest, true, name.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const out: string[] = [];
  const walk = (n: ts.Node) => {
    if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n) || ts.isTemplateHead(n) || ts.isTemplateMiddle(n) || ts.isTemplateTail(n) || ts.isJsxText(n)) out.push(n.text);
    ts.forEachChild(n, walk);
  };
  walk(sf);
  return out;
}

describe("service times", () => {
  it("no clock-time literal outside the data path", () => {
    const hits: string[] = [];
    for (const f of files(join(ROOT, "src"))) {
      const rel = relative(ROOT, f);
      if (ALLOWED.has(rel)) continue;
      for (const lit of literalsOf(readFileSync(f, "utf8"), f)) if (CLOCK.test(lit)) hits.push(`${rel}: ${lit.slice(0, 70)}`);
    }
    expect(hits).toEqual([]);
  });

  it("the scanner sees a literal put back (guard is live)", () => {
    expect(literalsOf('const a = "Sundays at 9:30am"; const b = <p>Sat 5 PM</p>;').filter((l) => CLOCK.test(l)).length).toBe(2);
    expect(literalsOf('// 9:30 AM in a comment\nconst a = 1;').filter((l) => CLOCK.test(l))).toEqual([]);
  });

  const oracle = JSON.parse(readFileSync(join(ROOT, "regression/service-times/expected.json"), "utf8"));
  it("Studio's records render the church's line", () => {
    const fixture = JSON.parse(readFileSync(join(ROOT, "tests/fixtures/studio-locations.json"), "utf8"));
    expect(fullLine(resolveTimes(fixture.locations, SERVICE_TIMES_SNAPSHOT))).toBe(oracle.oracleLine);
  });
  it("Studio down or sending junk falls back to the snapshot, which is the church's line", () => {
    for (const bad of [null, [], [{ slug: "hays", services: [{ day: "Sunday", times: ["soon"] }] }]]) {
      expect(fullLine(resolveTimes(bad, SERVICE_TIMES_SNAPSHOT))).toBe(oracle.oracleLine);
    }
  });
});
