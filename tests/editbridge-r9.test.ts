// @vitest-environment node
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

/**
 * Website Editor v6 — R9: the editor's hover/select affordance is an obviously-EDITOR
 * animated "marching-ants" dashed outline (not a static ring a user could mistake for
 * a normal website hover). It lives in the EditBridge stylesheet, which is injected
 * ONLY in cmsEdit mode, and must degrade to a static outline under reduced-motion.
 * The moving visual is the 1440 screenshot acceptance; this locks the CSS contract.
 */
const SRC = fs.readFileSync(path.join(process.cwd(), "src/components/cms/EditBridge.tsx"), "utf8");

describe("v6 R9 — animated marching-ants editor outline", () => {
  it("defines the traveling keyframes + a ::after overlay border", () => {
    expect(SRC).toMatch(/@keyframes c3ants/);
    expect(SRC).toMatch(/animation:\s*c3ants/);
    // the moving border is a pointer-events:none ::after (never covers bg / blocks clicks)
    expect(SRC).toMatch(/\.cms-sel::after/);
    expect(SRC).toMatch(/pointer-events:\s*none/);
  });

  it("honors prefers-reduced-motion (static fallback — animation disabled)", () => {
    expect(SRC).toMatch(/prefers-reduced-motion:\s*reduce/);
    // within the reduced-motion block, the ants animation is turned off
    const rm = SRC.slice(SRC.indexOf("prefers-reduced-motion"));
    expect(rm).toMatch(/animation:\s*none/);
  });

  it("retires the old static box-shadow ring affordance", () => {
    // the previous approach ringed elements with box-shadow:0 0 0 Npx — gone now.
    expect(SRC).not.toMatch(/\[data-cms\]:hover\{[^}]*box-shadow:0 0 0 2px/);
  });
});
