import type { FreeOffset } from "@/lib/cms";

/**
 * FreeOffsetStyle — renders DRAG-ANYWHERE per-element offsets as ONE scoped <style>.
 *
 * Drag-anywhere lets the editor grab ANY existing in-flow element (button / text /
 * image / icon) and nudge it to a new spot. Rather than re-parent the element, we
 * persist a pixel OFFSET keyed by that element's OWN data-cms* attribute selector
 * (e.g. `[data-cms="hero.title"]`) and apply it with `transform: translate(x,y)`.
 *
 * This one stylesheet is emitted server-side on BOTH surfaces:
 *   • preview  → the page fetches DRAFT overrides, so a just-dragged element shows its
 *                offset the instant the iframe reloads (no postMessage round-trip needed),
 *   • public   → the page fetches PUBLISHED overrides, so the move ships to the live site.
 *
 * SECURITY: the key is a CSS selector persisted through the editor. We ONLY emit keys
 * that match the exact `[data-cms*="…"]` shape our own EditBridge produces, and the
 * quoted value may not contain `"{}<>\` — so nothing can break out of the rule/selector
 * and inject arbitrary CSS. Anything else is dropped. Empty/absent map ⇒ renders nothing.
 */
const SEL_OK = /^\[data-cms(?:-link|-img|-icon)?="[^"{}<>\\]+"\]$/;

export default function FreeOffsetStyle({ offsets }: { offsets?: Record<string, FreeOffset> }) {
  if (!offsets || typeof offsets !== "object") return null;
  const rules: string[] = [];
  for (const [sel, off] of Object.entries(offsets)) {
    if (!SEL_OK.test(sel)) continue;
    if (!off || typeof off !== "object") continue;
    const x = Number(off.x) || 0;
    const y = Number(off.y) || 0;
    if (x === 0 && y === 0) continue;
    // position:relative so translate has a stable box; will-change hints the compositor.
    rules.push(
      `${sel}{transform:translate(${x}px,${y}px)!important;position:relative;z-index:1;}`,
    );
  }
  if (rules.length === 0) return null;
  return <style data-cms-free-offsets="" dangerouslySetInnerHTML={{ __html: rules.join("\n") }} />;
}
