import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getHomeContent } from "@/lib/cms";
import { fromStudioHome } from "@/lib/home-content";
import { buildBgCss } from "@/lib/backgrounds";
import { renderExample } from "@/lib/section-examples";

/**
 * LIVE single-section preview — the render surface for the editor's right-rail
 * live-thumbnail iframes (c3-backend SectionRail / StylePicker).
 *
 * Unlike the sibling `/section-preview/[slug]` route (a BUILD-TIME static shoot
 * surface that renders each section from HOME_DEFAULTS for the jpg harness), THIS
 * index route renders ONE section from the LIVE DRAFT — text, images, background,
 * variant, layout — exactly as `src/app/page.tsx` renders it on the real homepage.
 * The editor embeds it scaled-down per card, so every rail thumbnail is a TRUE
 * live preview, never a baked screenshot.
 *
 *   URL:  /section-preview?section=<id>&variant=<v>&preview=<token>&cmsEdit=0
 *
 * DRAFT ISOLATION (mirrors the homepage contract): a `preview` token is FORWARDED
 * to c3-backend's draft endpoint, which is the SOLE gate (it mints + validates the
 * token; we never see the secret). No token / a forged/expired token ⇒ PUBLISHED
 * content, never an error — fail-closed, identical to getHomeContent's guarantee.
 *
 * CHROMELESS: the root layout wraps every route in Header/Footer; a scoped stylesheet
 * hides them so the embed shows ONLY the section (no site header bleeding into the
 * thumbnail). The `variant` query param wins over the draft's stored variant so the
 * StylePicker can preview a variant the user hasn't committed yet.
 */

// CMS_LIVE resolution — RUNTIME source of truth is the CLOUDFLARE env, NOT process.env.
// On the Worker, wrangler `vars` land on getCloudflareContext().env; process.env.CMS_LIVE
// is EMPTY at runtime (the same gotcha that bit DEMO_MODE). getCloudflareContext() throws
// outside a request/opennext context (static-export `next build`, vitest) → wrap + fall
// back to process.env (unset in export) so the route stays export-safe: no Cloudflare
// context ⇒ cmsLive=false ⇒ searchParams untouched ⇒ no forced-dynamic. Mirrors
// c3-backend's isDemoMode().
function isCmsLive(): boolean {
  try {
    const env = getCloudflareContext().env as { CMS_LIVE?: string } | undefined;
    if (env && "CMS_LIVE" in env && env.CMS_LIVE === "1") return true;
  } catch {
    // no Cloudflare context (export build / vitest / plain node) → fall through
  }
  return process.env.CMS_LIVE === "1";
}

// Match the homepage's export-safety contract: searchParams are read ONLY under the
// CMS_LIVE server runtime. In the static-export build CMS_LIVE is unset, so we never
// touch searchParams (that would force dynamic rendering and break `output: export`).
// The route is a no-op in export (the published public site has no editor); it only
// does real work behind CMS_LIVE, which is where the editor points its preview iframes.
const CHROMELESS_CSS = `
  header, footer, [data-site-header], [data-site-footer] { display: none !important; }
  main { padding: 0 !important; margin: 0 !important; }
  html, body { background: #fff !important; overflow: hidden !important; }
  /* Kill entrance-animation opacity:0 start states so a thumbnail is never blank. */
  [data-anim] { opacity: 1 !important; transform: none !important; }
`;

export default async function LiveSectionPreview({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
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
