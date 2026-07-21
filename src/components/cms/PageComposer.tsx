import { buildBgCss } from "@/lib/backgrounds";
import RevealPlayer from "@/components/cms/RevealPlayer";
import type { SectionMeta } from "@/lib/home-content";

/**
 * PageComposer — the reusable Layer-2 section composer (generalized from home).
 *
 * Given a page's ordered `sections`, its per-tile `bgFill` map, its per-element
 * `anim` map, and a `render(id, variant)` that returns the component for a section
 * id, this emits — for ANY route — exactly what src/app/page.tsx emitted for home:
 *   • one scoped <style> from `buildBgCss(sections, bgFill)` (per-section bg +
 *     per-tile data-cms-bg fills),
 *   • the <RevealPlayer> entrance runtime, and
 *   • a `<div data-section={id}>` wrapper around each VISIBLE section's render.
 *
 * The `data-section` wrappers + scoped stylesheet are what let the editor rail
 * (SectionDock) add / reorder / hide / recolor sections on a page. There is NO
 * `known` allow-list here on purpose: the page's own `render()` returns `null` for
 * ids it doesn't handle, so a page controls its own vocabulary. Server component.
 */
export interface PageComposerProps {
  /** The page's ordered section list (id + visibility + optional bg/variant). */
  sections: SectionMeta[];
  /** Per-tile background fills keyed by data-cms-bg id. */
  bgFill?: Record<string, string>;
  /** Per-element entrance animations keyed by data-cms path → preset. */
  anim?: Record<string, string>;
  /** Render the component for a section id (with its chosen style variant). */
  render: (id: string, variant?: string) => React.ReactNode;
}

/** True when a stored bg value is an image (a `url(...)` shorthand), which is the
 *  only kind that renders as a continuous SPAN layer (colors/gradients don't span). */
const isImageBg = (bg?: string): boolean => !!bg && /^\s*url\(/i.test(bg);

export default function PageComposer({ sections, bgFill, anim, render }: PageComposerProps) {
  const visible = sections.filter((s) => s.visible);
  // Per-section AND per-tile background overrides → ONE scoped stylesheet (no
  // component edits). buildBgCss is the shared primitive mirrored from c3-backend.
  // It SKIPS sections covered by a span leader, so the span layer below is the only
  // paint of that shared image (no per-section repeat = no seam).
  const bgCss = buildBgCss(sections, bgFill ?? {});

  // Build the section wrappers, honoring `bgSpan`: a leader with an image bg + span>0
  // wraps itself and the next `span` visible sections inside ONE positioned group that
  // carries a SINGLE background image behind them all — that one cover-sized layer
  // spanning the whole group's height is what makes the image seamless (no per-section
  // seam). Members render transparently on top. Non-spanned sections render as before,
  // so pages that don't use bgSpan are byte-identical to the previous behavior.
  const wrappers: React.ReactNode[] = [];
  for (let i = 0; i < visible.length; i++) {
    const s = visible[i];
    const span = Math.max(0, Math.floor(Number(s.bgSpan) || 0));
    if (span > 0 && isImageBg(s.bg)) {
      const members = visible.slice(i, Math.min(i + span + 1, visible.length));
      wrappers.push(
        <div key={s.id} style={{ position: "relative" }}>
          {/* ONE continuous background image behind the whole group (cover-sized over
              the combined height → seamless, no glitch line between the sections). */}
          <div
            aria-hidden
            style={{ position: "absolute", inset: 0, zIndex: 0, background: s.bg, backgroundSize: "cover", backgroundPosition: "center" }}
          />
          {members.map((m) => (
            <div key={m.id} data-section={m.id} style={{ position: "relative", zIndex: 1 }}>
              {render(m.id, m.variant)}
            </div>
          ))}
        </div>
      );
      i += members.length - 1; // advance past the grouped members (no double-render)
    } else {
      wrappers.push(
        <div key={s.id} data-section={s.id}>
          {render(s.id, s.variant)}
        </div>
      );
    }
  }

  return (
    <>
      {bgCss && <style dangerouslySetInnerHTML={{ __html: bgCss }} />}
      {/* Play per-element entrance animations for this page's content. */}
      <RevealPlayer anim={anim ?? {}} />
      {wrappers}
    </>
  );
}
