import { notFound } from "next/navigation";
import { getPageContent, getCMSScreen, getCMSBundle } from "@/lib/cms";
import { isCmsLive } from "@/lib/cms-live";

/**
 * Website Editor v4 — R5: generic renderer for CMS-authored pages (a Screen).
 *
 * The hand-built pages (/about, /messages, …) keep their own components; this
 * dynamic route only catches slugs WITHOUT a static route — i.e. pages created in
 * the editor. It renders an editable title + body from the page's overrides
 * (`text["page-title"]` / `text["page-body"]`, the same draft-overrides plumbing
 * every page uses), so a page created in C3 Studio renders here immediately and is
 * inline-editable via EditBridge (mounted in the root layout).
 *
 * output:export fence: under CMS_LIVE (the editor preview) output is NOT "export",
 * so draft pages render dynamically. For the published static export,
 * generateStaticParams enumerates the PUBLISHED web screens (excluding hand-built
 * routes to avoid a build conflict); with the CMS off it returns [] — the existing
 * export/CI build is untouched.
 */

// Slugs that already have a hand-built route — never render them generically
// (a published web screen with one of these slugs is excluded from the export set
// to avoid a static-route build collision).
//
// FOLLOW-UP (tracked): derive this from the filesystem (the app/ route dirs) so it
// can't drift. Until then, a deterministic drift-catch guards it:
// c3-backend/tests/website-editor-v4-r5-static-routes.test.ts asserts this set
// equals the actual hand-built routes and FAILS if a hand route is added/removed
// without updating this list.
export const STATIC_ROUTES = new Set([
  "about", "beliefs", "visit", "locations", "messages", "news", "watch", "counseling", "connect", "give",
  "events", "newsletter", "section-preview",
]);

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const bundle = await getCMSBundle().catch(() => null);
  return (bundle?.screens || [])
    .filter((s) => (s.surface === "web" || s.surface === "both") && typeof s.slug === "string" && s.slug.startsWith("/"))
    .map((s) => s.slug.replace(/^\/+/, ""))
    .filter((seg) => seg && !STATIC_ROUTES.has(seg))
    .map((slug) => ({ slug }));
}

export default async function GenericPage({
  params, searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const cmsLive = isCmsLive();
  const { slug } = await params;
  const sp = cmsLive && searchParams ? await searchParams : {};
  const preview = typeof sp.preview === "string" ? sp.preview : undefined;
  const path = `/${slug}`;

  const [ov, screen] = await Promise.all([
    getPageContent(path, preview).catch(() => null),
    getCMSScreen(path).catch(() => null),
  ]);

  // A real CMS page has a seeded title override (or a published screen title).
  // An unknown slug has neither → 404 (never render an empty page).
  const title = ov?.text?.["page-title"] || screen?.screen?.title;
  if (!title) notFound();
  const body = ov?.text?.["page-body"] || "";

  return (
    <main style={{ minHeight: "60vh" }}>
      <section data-section={slug} style={{ padding: "clamp(4rem, 10vw, 8rem) 1.25rem" }}>
        <div style={{ maxWidth: "48rem", margin: "0 auto" }}>
          <h1 data-cms="t:page-title" style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.02em" }}
            dangerouslySetInnerHTML={{ __html: title }} />
          <div data-cms="t:page-body" style={{ marginTop: "1.5rem", fontSize: "1.125rem", lineHeight: 1.7, color: "#3a3b3b" }}
            dangerouslySetInnerHTML={{ __html: body || "Write something about this page." }} />
        </div>
      </section>
    </main>
  );
}
