/**
 * The editor's section rail embeds the site's `/section-preview` route in MANY small
 * iframes (one live thumbnail per section). That route is an INERT thumbnail render
 * (cmsEdit=0, `[data-anim]` forced visible), so it does NOT need the site's heavy client
 * chrome — the on-page EditBridge, the Lenis smooth-scroll runtime, the framer-motion
 * nav, or the reveal player. Stripping that chrome from this ONE route keeps each
 * thumbnail near-pure server HTML/CSS instead of a full app boot, so opening the Website
 * Editor isn't slow.
 *
 * This ONLY ever matches `/section-preview` — it never fires on any real page, so the
 * live site's chrome/behavior is unchanged. Kept as a tiny pure helper so it's shared by
 * every chrome guard and unit-testable on its own.
 */
export function isSectionPreviewPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  // usePathname() gives a basePath-stripped, query-less path; normalize the trailing
  // slash (trailingSlash:true) so `/section-preview` and `/section-preview/` both match.
  const p = pathname.split("?")[0].replace(/\/+$/, "");
  return p === "/section-preview";
}
