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
 *
 * D169 RECONCILIATION (2026-08-05): this asserted `/\.cms-sel::after/` — an
 * implementation detail commit 1523e83 Item 2 deliberately retired ("selection outline
 * is now a fixed overlay ring glued to the element's live bounding rect every frame
 * (rAF) — pixel-accurate regardless of positioning/overflow context, replacing the
 * offset-prone ::after"). Grepping for the retired selector failed the guard on a page
 * whose affordance is entirely intact. The R9 guarantee was never "the ants live on
 * .cms-sel::after"; it is "BOTH affordances are the same animated ants, the hover one
 * is a click-through ::after overlay, and reduced-motion stills them". Asserted on both
 * surfaces below, so dropping the ants from either one now fails loudly.
 */
const SRC = fs.readFileSync(path.join(process.cwd(), "src/components/cms/EditBridge.tsx"), "utf8");

const NORM = SRC.replace(/\s+/g, " ");
/**
 * Both rule bodies, matched by regex rather than indexOf: the stylesheet NAMES both
 * selectors in its own comments before it uses them, so a bare substring search lands
 * in prose. `[^{}]*` lets the hover match ride the whole comma-separated selector list
 * while refusing to cross a rule boundary.
 */
const HOVER_ANTS = (NORM.match(/\[data-cms\]:hover::after[^{}]*\{[^}]*\}/) || [""])[0];
const SEL_RING = (NORM.match(/#c3-sel-ring\{[^}]*\}/) || [""])[0];

describe("v6 R9 — animated marching-ants editor outline", () => {
  it("defines the traveling keyframes both affordances animate with", () => {
    expect(SRC).toMatch(/@keyframes c3ants/);
    expect(SRC).toMatch(/animation:\s*c3ants/);
  });

  it("the HOVER affordance is a click-through ::after ants overlay", () => {
    // Hover ants ride an ::after on every tagged kind. pointer-events:none is what
    // stops the overlay covering the element's own background or eating its clicks.
    expect(HOVER_ANTS).toMatch(/repeating-linear-gradient/);
    expect(HOVER_ANTS).toMatch(/pointer-events:\s*none/);
    expect(HOVER_ANTS).toMatch(/animation:\s*c3ants/);
  });

  it("the SELECTED affordance is the fixed overlay ring, animated with the same ants", () => {
    // ITEM 2: a #c3-sel-ring div positioned in JS from getBoundingClientRect, NOT an
    // ::after — so no author pseudo-element and no ancestor overflow can touch it.
    expect(SEL_RING).toMatch(/position:\s*fixed/);
    expect(SEL_RING).toMatch(/pointer-events:\s*none/);
    expect(SEL_RING).toMatch(/repeating-linear-gradient/);
    expect(SEL_RING).toMatch(/animation:\s*c3ants/);
  });

  it("honors prefers-reduced-motion — BOTH affordances are stilled", () => {
    const norm = SRC.replace(/\s+/g, " ");
    expect(norm).toMatch(/prefers-reduced-motion: reduce/);
    expect(norm).toMatch(/@media \(prefers-reduced-motion: reduce\)\{ #c3-sel-ring\{ animation:none/);
    expect(norm).toMatch(
      /@media \(prefers-reduced-motion: reduce\)\{ \[data-cms\]:hover::after[^}]*\{ animation:none/,
    );
  });

  it("retires the old static box-shadow ring affordance", () => {
    // the previous approach ringed elements with box-shadow:0 0 0 Npx — gone now.
    expect(SRC).not.toMatch(/\[data-cms\]:hover\{[^}]*box-shadow:0 0 0 2px/);
  });
});
