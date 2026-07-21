/**
 * Website Editor v3 — background primitive (R2 sections + R3 tiles).
 *
 * ONE persisted string carries a color, a gradient, OR an image, because all
 * three are valid CSS `background` shorthand values. The editor stores that
 * string per section (`SectionMeta.bg`) or per tagged element (`bgFill[path]`),
 * and the LIVE SITE injects a single scoped stylesheet built here — so making a
 * new tile editable is a one-attribute (`data-cms-bg`) diff, never a rewrite of
 * that tile's inline styles.
 *
 * MIRROR of c3-backend/src/lib/content/backgrounds.ts (byte-identical logic;
 * separate Next package — same hand-mirror convention as home.ts ↔ home-content.ts).
 * Keep the two in lockstep; a drift test in c3-backend guards it.
 */
import type { SectionMeta } from "./home-content";

/** path (data-cms-bg id) → CSS `background` value (color | gradient | url(...)). */
export type BgFill = Record<string, string>;
export type BgKind = "color" | "gradient" | "image";

/**
 * Compose a CSS `background` shorthand from a picker choice. An image is wrapped
 * as `url(...) center / cover no-repeat` so it fills the box (a bare `url()`
 * tiles at natural size — a real defect); color/gradient are already valid.
 */
export function bgValue(kind: BgKind, input: string): string {
  const v = (input || "").trim();
  if (!v) return ""; // empty ⇒ clear the override (fall back to design default)
  if (kind === "image") return `url("${v}") center / cover no-repeat`;
  return v;
}

/** Classify a stored value so the picker re-opens on the tab that made it. */
export function bgKindOf(value: string | undefined): BgKind {
  if (!value) return "color";
  if (/^url\(/i.test(value.trim())) return "image";
  if (/gradient\(/i.test(value)) return "gradient";
  return "color";
}

/** The raw URL inside a `url("…")` background value (for re-opening the picker). */
export function imageUrlOf(value: string | undefined): string {
  const m = value ? /url\(\s*["']?([^"')]+)["']?\s*\)/i.exec(value) : null;
  return m ? m[1] : "";
}

/**
 * Build the scoped stylesheet the site injects. Emits, for every visible section
 * with a bg and every tagged tile in `bgFill`, a `background:<v> !important` rule.
 * `!important` beats components' inline `background:#fff` AND the JS hover handlers
 * (both non-important) so the override always wins. Generalizable — never keyed
 * to a specific section/tile id.
 */
export function buildBgCss(
  sections: Pick<SectionMeta, "id" | "visible" | "bg" | "bgSpan">[] = [],
  bgFill: BgFill = {},
): string {
  const rules: string[] = [];
  // A section with bgSpan>0 paints ONE continuous background across itself and the
  // next N visible sections (rendered by PageComposer's span wrapper), so those
  // covered sections are skipped here to avoid a repeated (seamed) per-section paint.
  const vis = sections.filter((s) => s && s.visible !== false);
  const covered = new Set<string>();
  vis.forEach((s, i) => {
    const span = Math.max(0, Math.floor(Number(s.bgSpan) || 0));
    if (span > 0 && s.bg) {
      for (let k = 0; k <= span && i + k < vis.length; k++) covered.add(vis[i + k].id);
    }
  });
  for (const s of vis) {
    if (s.bg && !covered.has(s.id)) {
      rules.push(`[data-section="${s.id}"]>*{background:${s.bg} !important}`);
    }
  }
  for (const [key, val] of Object.entries(bgFill || {})) {
    if (val) rules.push(`[data-cms-bg="${key}"]{background:${val} !important}`);
  }
  return rules.join("");
}

/** Move a section one slot up (-1) or down (+1) in the canvas order, clamped. */
export function moveSection(sections: SectionMeta[], id: string, dir: -1 | 1): SectionMeta[] {
  const i = sections.findIndex((s) => s.id === id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= sections.length) return sections; // no-op at the ends / unknown id
  const next = sections.slice();
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

/** Delete a section from the canvas (splice out of the order; re-addable via the library). */
export function removeSection(sections: SectionMeta[], id: string): SectionMeta[] {
  return sections.filter((s) => s.id !== id);
}
