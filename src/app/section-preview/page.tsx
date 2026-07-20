import { getHomeContent } from "@/lib/cms";
import { isCmsLive } from "@/lib/cms-live";
import { fromStudioHome } from "@/lib/home-content";
import { buildBgCss } from "@/lib/backgrounds";
import { renderExample } from "@/lib/section-examples";
import { slugForSectionId } from "@/lib/section-preview-slug";

/**
 * LIVE single-section preview — the render surface for the editor's right-rail
 * live-thumbnail iframes (c3-backend SectionRail / LiveSectionPreview).
 *
 * Unlike the sibling `/section-preview/[slug]` route (a BUILD-TIME static shoot
 * surface that renders each HOME example section from HOME_DEFAULTS for the jpg
 * harness), THIS index route renders ONE section from the LIVE DRAFT — text, images,
 * background, layout — as the real page renders it. The editor embeds it scaled-down
 * per card, so every rail thumbnail is a TRUE live preview, never a baked screenshot.
 *
 *   URL:  /section-preview?section=<id>&variant=<v>&preview=<token>&cmsEdit=0
 *
 * TWO section families:
 *   • HOME ids (hero, mission, meetGrowServe, …, plus the R3 example library) render
 *     via renderExample() from live HomeContent — exactly as src/app/page.tsx does.
 *   • NON-HOME ids (connect-*, give-*, counseling-*, events-*, visit-*, weekly-*)
 *     are Layer-2 sections that live ONLY inside their own page's render() switch,
 *     which renderExample() knows nothing about (→ it returned null → BLANK cards).
 *     Option C: render that section's REAL page and CSS-HIDE the sibling sections, so
 *     the thumbnail is the true live section with ZERO render-logic duplication (no
 *     drift). The `?preview` token is forwarded so — with the CMS_LIVE fix — the
 *     thumbnail reflects the same DRAFT the main editor iframe shows.
 *     (Follow-up: a shared renderSectionById registry the pages ALSO call would let
 *     us render the single section in isolation; deferred to avoid churning the
 *     freshly-integrated page rebuilds.)
 *
 * DRAFT ISOLATION (mirrors the homepage contract): a `preview` token is FORWARDED to
 * c3-backend's draft endpoint, the SOLE gate (mints + validates it; we never see the
 * secret). No token / forged / expired ⇒ PUBLISHED content, never an error.
 *
 * CHROMELESS: the root layout wraps every route in Header/Footer; a scoped stylesheet
 * hides them so the embed shows ONLY the section.
 *
 * EXPORT-SAFE: searchParams are read ONLY under the CMS_LIVE server runtime (via the
 * shared isCmsLive()). In the static-export build CMS_LIVE is unset ⇒ the route is a
 * blank, chromeless, non-dynamic no-op.
 */

const CHROMELESS_CSS = `
  header, footer, [data-site-header], [data-site-footer] { display: none !important; }
  main { padding: 0 !important; margin: 0 !important; }
  html, body { background: #fff !important; overflow: hidden !important; }
  /* Kill entrance-animation opacity:0 start states so a thumbnail is never blank. */
  [data-anim] { opacity: 1 !important; transform: none !important; }
`;

type PreviewSearchParams = Promise<Record<string, string | string[] | undefined>>;
// Required props param so page signatures that take a required `{ searchParams }`
// (connect/give) stay assignable; zero-arg pages (visit/news/events) and defaulted
// ones (counseling) drop/ignore it, which TS permits.
type PageComponent = (props: { searchParams?: PreviewSearchParams }) => Promise<React.ReactNode> | React.ReactNode;

/** slug → lazy import of that page's server component (only loaded when its section is
 *  previewed, so the route never eagerly pulls all six pages). */
const PAGE_LOADERS: Record<string, () => Promise<{ default: PageComponent }>> = {
  "/connect": () => import("@/app/connect/page"),
  "/give": () => import("@/app/give/page"),
  "/counseling": () => import("@/app/counseling/page"),
  "/events": () => import("@/app/events/page"),
  "/visit": () => import("@/app/visit/page"),
  "/news": () => import("@/app/news/page"),
};

export default async function LiveSectionPreview({
  searchParams,
}: {
  searchParams?: PreviewSearchParams;
}) {
  const cmsLive = isCmsLive();
  const sp = cmsLive && searchParams ? await searchParams : {};
  const id = typeof sp.section === "string" ? sp.section : undefined;
  const preview = typeof sp.preview === "string" ? sp.preview : undefined;
  const variantParam = typeof sp.variant === "string" ? sp.variant : undefined;

  // No section id (or the export build) ⇒ render nothing but the chrome-hiding style,
  // so the route is always a valid, blank, chromeless document.
  if (!id) {
    return <style dangerouslySetInnerHTML={{ __html: CHROMELESS_CSS }} />;
  }

  // ── NON-HOME section (Option C): render its REAL page, isolate the target ──
  const slug = slugForSectionId(id);
  const loader = slug ? PAGE_LOADERS[slug] : undefined;
  if (slug && loader) {
    const { default: Page } = await loader();
    // Hide every OTHER section wrapper so only the target section shows (and floats to
    // the top of the doc, which is what the scaled iframe thumbnail captures).
    const isolateCss = `[data-section]:not([data-section="${id}"]){display:none !important}`;
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: CHROMELESS_CSS }} />
        <style dangerouslySetInnerHTML={{ __html: isolateCss }} />
        {/* Forward ONLY the preview token; the page fetches + paints its own section
            background via its PageComposer (buildBgCss), so bg reflects truthfully. */}
        <div data-preview-root data-preview-key={id} data-preview-slug={slug} data-section={id}>
          {await Page({ searchParams: Promise.resolve(preview ? { preview } : {}) })}
        </div>
      </>
    );
  }

  // ── HOME section id: render via renderExample from live HomeContent ──
  const c = fromStudioHome(await getHomeContent(preview));
  const meta = c.sections.find((s) => s.id === id);
  // Variant precedence: explicit query param (StylePicker hover) → the draft's stored
  // variant → the component default (undefined). Background comes from the draft meta.
  const variant = variantParam || meta?.variant;
  const bg = meta?.bg;

  // Paint the section background exactly like the homepage: a scoped `[data-section]>*`
  // rule via the shared buildBgCss primitive (so a recolored section reads truthfully).
  const bgCss = buildBgCss(bg ? [{ id, visible: true, bg }] : []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CHROMELESS_CSS }} />
      {bgCss && <style dangerouslySetInnerHTML={{ __html: bgCss }} />}
      <div data-preview-root data-preview-key={variant ? `${id}:${variant}` : id} data-section={id}>
        {renderExample(id, c, variant)}
      </div>
    </>
  );
}
