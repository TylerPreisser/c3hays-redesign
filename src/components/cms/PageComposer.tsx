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

export default function PageComposer({ sections, bgFill, anim, render }: PageComposerProps) {
  const visible = sections.filter((s) => s.visible);
  // Per-section AND per-tile background overrides → ONE scoped stylesheet (no
  // component edits). buildBgCss is the shared primitive mirrored from c3-backend.
  const bgCss = buildBgCss(sections, bgFill ?? {});

  return (
    <>
      {bgCss && <style dangerouslySetInnerHTML={{ __html: bgCss }} />}
      {/* Play per-element entrance animations for this page's content. */}
      <RevealPlayer anim={anim ?? {}} />
      {visible.map((s) => (
        <div key={s.id} data-section={s.id}>
          {render(s.id, s.variant)}
        </div>
      ))}
    </>
  );
}
