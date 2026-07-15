/**
 * G3 drift-guard: NO public page may be orphaned from the nav.
 *
 * Every hand-built public route on disk (`src/app/**` page.tsx) MUST be reachable from
 * the site navigation — either a top-level `navItems` entry, a dropdown CHILD, or an
 * intentional CTA (Home via the logo, Plan-a-Visit and Give via the header CTAs). If a
 * new page is added without wiring it into the nav (or the intentional-CTA allowlist),
 * this test FAILS — so a page can never silently drop out of the nav again.
 *
 * (Mirrors the c3-backend v4-r5 STATIC_ROUTES drift-guard: derive the truth from the
 * filesystem and assert the hand-maintained list stays in lockstep.)
 */
import { describe, it, expect } from "vitest";
import { readdirSync, existsSync } from "fs";
import path from "path";
import { navItems, ctaItem } from "@/data/navigation";

const APP_DIR = path.resolve(process.cwd(), "src/app");

/** Normalize any href/route to a slash-less, no-trailing-slash key ("/about/" → "/about"). */
const norm = (href: string) => {
  const p = href.split("?")[0].replace(/\/+$/, "");
  return p === "" ? "/" : p;
};

/** Recursively collect every public route that has a page.tsx, excluding dynamic
 *  segments ([slug]), route groups ((...)), and the internal /section-preview surface. */
function diskRoutes(dir = APP_DIR, prefix = ""): string[] {
  const out: string[] = [];
  if (existsSync(path.join(dir, "page.tsx"))) out.push(prefix === "" ? "/" : prefix);
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const name = entry.name;
    if (name.startsWith("[") || name.startsWith("(")) continue; // dynamic / route group
    if (name === "section-preview") continue; // internal editor-thumbnail render surface
    out.push(...diskRoutes(path.join(dir, name), `${prefix}/${name}`));
  }
  return out;
}

/** Every href reachable from the nav: top-level items + dropdown children. */
function navHrefs(): Set<string> {
  const s = new Set<string>();
  for (const item of navItems) {
    s.add(norm(item.href));
    for (const child of item.children || []) s.add(norm(child.href));
  }
  return s;
}

// Reachable WITHOUT a nav-bar link: Home (the logo) + the header CTAs (Plan a Visit, Give).
const INTENTIONAL_CTA = new Set(["/", "/visit", norm(ctaItem.href)]);

describe("G3 — no public page is orphaned from the nav", () => {
  const reachable = new Set<string>([...navHrefs(), ...INTENTIONAL_CTA]);
  const routes = diskRoutes().map(norm);

  it.each(routes)("route %s is reachable from the nav (or an intentional CTA)", (route) => {
    expect(reachable.has(route)).toBe(true);
  });

  it("Give is wired into the nav (the ctaItem is actually surfaced)", () => {
    // ctaItem.href must be in the intentional-CTA allowlist AND a real page must exist.
    expect(INTENTIONAL_CTA.has(norm(ctaItem.href))).toBe(true);
    expect(diskRoutes().map(norm)).toContain(norm(ctaItem.href));
  });
});
