/**
 * Website Editor v6 — R6 (6b): the reveal STAMPING logic (pure, testable).
 *
 * The editor stores per-element entrance animations as a map keyed by the element's
 * RAW data-cms path (HomeContent.anim / globals.anim). On the live site the player
 * stamps `data-anim="<preset>"` onto the matching element so the CSS in animations.css
 * can play it on viewport-enter. Kept as a pure DOM function so it can be unit-tested
 * without a browser/IntersectionObserver.
 *
 * COMPOSITE TILE rule: attributes are tried data-cms-bg FIRST, so a tile whose whole
 * subtree should ride ONE reveal is stamped on its data-cms-bg CONTAINER — not each
 * child. First match wins per path.
 */

/** Attribute families a stored anim path can address, in priority order. A section
 *  (keyed by its id) is stamped on its `data-section` wrapper so the WHOLE section
 *  rides one reveal; a tile on its `data-cms-bg` container; individual elements on
 *  their data-cms-* attribute. */
export const REVEAL_ATTRS = ["data-cms-bg", "data-cms-img", "data-cms-link", "data-cms-icon", "data-cms", "data-section"] as const;

/** v7 R10: per-step delay for a staggered SEQUENCE. An anim value may carry an optional
 *  ":<order>" suffix ("riseUp:2"); the order N becomes an animation-delay of N*step so
 *  tagged elements enter one after another ("this goes, then this"). */
export const STAGGER_STEP_MS = 90;

/** CSS.escape fallback for attribute-value selectors (jsdom/older engines). */
function esc(v: string): string {
  const g = globalThis as unknown as { CSS?: { escape?: (s: string) => string } };
  if (g.CSS?.escape) return g.CSS.escape(v);
  return v.replace(/["\\\]]/g, "\\$&");
}

/**
 * Stamp `data-anim` onto the element addressed by each path in `animMap`.
 * - empty/falsy preset ("none" was cleared to "") is skipped.
 * - the FIRST matching element (bg container preferred) is stamped, once.
 * Returns the elements that were stamped.
 */
export function stampReveals(root: ParentNode, animMap: Record<string, string> | undefined | null): Element[] {
  if (!animMap) return [];
  const stamped: Element[] = [];
  for (const [path, raw] of Object.entries(animMap)) {
    if (!raw || typeof raw !== "string") continue;
    // v7 R10: an optional ":<order>" suffix sequences the element. Stamp the CLEAN preset
    // name (so animations.css matches) and, when ordered, an animation-delay = order*step.
    const ci = raw.indexOf(":");
    const preset = ci >= 0 ? raw.slice(0, ci) : raw;
    const order = ci >= 0 ? Number(raw.slice(ci + 1)) : NaN;
    if (!preset) continue;
    const selector = REVEAL_ATTRS.map((a) => `[${a}="${esc(path)}"]`).join(",");
    const el = root.querySelector(selector);
    if (el && !el.hasAttribute("data-anim")) {
      el.setAttribute("data-anim", preset);
      if (Number.isFinite(order) && order > 0) {
        (el as HTMLElement).style.animationDelay = `${order * STAGGER_STEP_MS}ms`;
        el.setAttribute("data-anim-order", String(order));
      }
      stamped.push(el);
    }
  }
  return stamped;
}
