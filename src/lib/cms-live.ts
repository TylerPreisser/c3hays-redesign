import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * CMS_LIVE resolution — the ONE correct way, shared by every page + the
 * /section-preview route so draft-preview gating is consistent.
 *
 * RUNTIME source of truth is the CLOUDFLARE env, NOT process.env. On the Worker,
 * wrangler `vars` land on getCloudflareContext().env; `process.env.CMS_LIVE` is
 * EMPTY at runtime (the same gotcha that bit DEMO_MODE, documented in wrangler.jsonc).
 * A page that gates its `searchParams` read on `process.env.CMS_LIVE === "1"` therefore
 * computes `false` on the deployed Worker → never reads the `?preview` token → the
 * editor iframe shows PUBLISHED, not DRAFT. Routing every gate through this helper
 * fixes that.
 *
 * getCloudflareContext() THROWS outside a request/opennext context (static-export
 * `next build`, vitest, plain node) → we wrap + fall back to process.env (unset in
 * export). No Cloudflare context ⇒ cmsLive=false ⇒ searchParams untouched ⇒ no
 * forced-dynamic, so the static-export build stays export-safe. Mirrors c3-backend's
 * isDemoMode().
 */
export function isCmsLive(): boolean {
  try {
    const env = getCloudflareContext().env as { CMS_LIVE?: string } | undefined;
    if (env && "CMS_LIVE" in env && env.CMS_LIVE === "1") return true;
  } catch {
    // no Cloudflare context (export build / vitest / plain node) → fall through
  }
  return process.env.CMS_LIVE === "1";
}
