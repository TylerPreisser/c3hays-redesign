import { HOME_DEFAULTS } from "@/lib/home-content";
import { SECTION_EXAMPLES, renderExample } from "@/lib/section-examples";

/**
 * Section preview route — the render surface for the thumbnail SHOOT harness
 * (scripts/shoot-sections.mjs). Each addable example section (and each of its
 * variants) gets its own URL so Playwright can render it in isolation and clip a
 * preview image of the top-level <section>.
 *
 * Slug format:  `<id>`  or  `<id>__<variant>`  (":" is URL-unsafe, so "__").
 * This route is dev/tooling-only chrome; it renders from HOME_DEFAULTS so the
 * thumbnail shows each section's canonical, on-brand default content.
 */
export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  const slugs: string[] = [];
  for (const s of SECTION_EXAMPLES) {
    slugs.push(s.id);
    for (const v of s.variants) slugs.push(`${s.id}__${v.key}`);
  }
  return slugs.map((slug) => ({ slug }));
}

export default async function SectionPreview({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [id, variant] = slug.split("__");
  return (
    <div data-preview-root data-preview-key={variant ? `${id}:${variant}` : id}>
      {renderExample(id, HOME_DEFAULTS, variant)}
    </div>
  );
}
