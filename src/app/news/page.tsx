import type { Metadata } from "next";
import Image from "next/image";
import { assetPath } from "@/lib/asset-path";
import { getPageContent } from "@/lib/cms";
import { isCmsLive } from "@/lib/cms-live";
import { parseSections, imgCss, type SectionMeta } from "@/lib/home-content";
import { Tx } from "@/components/cms/Editable";
import PageComposer from "@/components/cms/PageComposer";
import Section from "@/components/ui/Section";
import IssueBrowser from "@/components/newsletter/IssueBrowser";
import WeeklySignup from "@/components/newsletter/WeeklySignup";
import { newsletterIssues } from "@/data/news";

export const metadata: Metadata = {
  title: "The C3 Weekly",
  description:
    "The C3 Weekly — one short email each week from Celebration Community Church in Hays and Colby, Kansas. Browse past issues or get it in your inbox.",
};

/**
 * /news — "The C3 Weekly" (its OWN page).
 *
 * REVERTED (per Tyler): the "Stay Connected / Gather with us" WeeklyConnect block is
 * gone — it had nothing to do with this page. The newsletter ISSUE BROWSER is restored:
 * a browser that shows different weeks' newsletters with SEARCH + a WEEK FILTER
 * (<IssueBrowser>). It is fully editor-native and graceful when empty — the search +
 * week filter controls are always present (never a "coming soon" placeholder); when no
 * real issues exist yet the results area shows an honest "first issue is on its way"
 * note. NO fabricated newsletter bodies — real issues fill @/data/news when they exist.
 *
 * Composed via <PageComposer> from two sections (ids match c3-backend page-sections):
 *   • weekly-hero → image band: LEFT-aligned header over the photo + a RIGHT-side
 *     editor-native newsletter-signup OVERLAY (<WeeklySignup>) — all editable + it FUNCTIONS.
 *   • weekly-list → the filterable newsletter issue browser.
 *
 * Every section bg (rail), heading/body (<Tx>) and the signup are editable. Export-safe.
 */
const PAGE_DEFAULT_SECTIONS: SectionMeta[] = [
  { id: "weekly-hero", visible: true },
  { id: "weekly-list", visible: true },
];

/* Responsive gutter for the wide Browse container (mirrors .container-c3 padding). */
const GUTTER = "clamp(1.25rem, 5vw, 3rem)";

export const dynamic = "force-dynamic";

export default async function NewsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Finding 2: forward the editor's ?preview token under CMS_LIVE so the editor
  // preview reflects DRAFT (published in export / public).
  const cmsLive = isCmsLive();
  const sp = cmsLive && searchParams ? await searchParams : {};
  const preview = typeof sp.preview === "string" ? sp.preview : undefined;
  const ov = (await getPageContent("/news", preview)) || {};
  const t = ov.text || {};
  const media = ov.media || {};
  const sections = parseSections(ov.sections, PAGE_DEFAULT_SECTIONS);

  const render = (id: string): React.ReactNode => {
    switch (id) {
      case "weekly-hero":
        return (
          <section
            className="relative overflow-hidden"
            data-cms-bg="weekly-hero-bg"
            style={{ minHeight: "clamp(30rem, 60vh, 40rem)", display: "flex", alignItems: "center" }}
          >
            {/* Editable background photo (#8: KEEP the top image). */}
            <div className="absolute inset-0" data-cms-img="weekly-hero-photo">
              <Image
                src={assetPath(media["weekly-hero-photo"] || "/images/congregation.webp")}
                alt="The C3 Weekly"
                fill
                priority
                sizes="100vw"
                className="object-cover"
                style={imgCss(ov.img?.["weekly-hero-photo"])}
              />
            </div>
            {/* Legibility scrim (click-through so the photo stays hit-testable in the editor). */}
            <div
              className="absolute inset-0"
              aria-hidden
              style={{ background: "linear-gradient(90deg, rgba(10,12,14,0.78) 0%, rgba(10,12,14,0.55) 42%, rgba(10,12,14,0.25) 100%)", pointerEvents: "none" }}
            />

            <div className="container-c3 relative" style={{ paddingTop: "var(--section-y)", paddingBottom: "var(--section-y)", width: "100%" }}>
              <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_minmax(20rem,26rem)] gap-10 lg:gap-16 items-center">
                {/* LEFT — header, left-aligned over the image. White text over the scrim. */}
                <div data-cms-bg="weekly-hero-copy" style={{ maxWidth: "40rem" }}>
                  <Tx
                    text={t}
                    k="weekly-hero-eyebrow"
                    fallback="The C3 Weekly"
                    as="p"
                    className="overline"
                    style={{ color: "var(--color-teal)", marginBottom: "var(--space-eyebrow)" }}
                  />
                  <Tx
                    text={t}
                    k="weekly-hero-heading"
                    fallback="This week at C3."
                    as="h1"
                    className="display-1 text-balance"
                    style={{ color: "#fff", marginBottom: "var(--space-heading)" }}
                  />
                  <Tx
                    text={t}
                    k="weekly-hero-lead"
                    fallback="One short email each week &mdash; what&rsquo;s coming up, this week&rsquo;s message, and simple next steps. Sign up, or browse past issues below."
                    as="p"
                    className="body-lg"
                    style={{ color: "rgba(255,255,255,0.82)", maxWidth: "34rem", lineHeight: 1.7 }}
                  />
                </div>

                {/* RIGHT — editor-native signup OVERLAY. */}
                <WeeklySignup text={t} />
              </div>
            </div>
          </section>
        );
      case "weekly-list":
        return (
          <Section
            /* On-brand clean WHITE field (NOT tan) so the white issue cards + teal
               accents read premium — mirrors home's light sections. */
            style={{ backgroundColor: "#ffffff", color: "var(--color-ink)" }}
            bgKey="weekly-list-bg"
          >
            <div style={{ width: `min(100% - 2 * ${GUTTER}, 1600px)`, marginInline: "auto" }}>
              <IssueBrowser issues={newsletterIssues} />
            </div>
          </Section>
        );
      default:
        return null;
    }
  };

  const known = new Set(["weekly-hero", "weekly-list"]);
  const visible = sections.filter((s) => known.has(s.id));

  // Reconcile: a C3-Studio persisted list may still carry the retired "weekly-connect"
  // id (now filtered out by `known`). If the persisted list omits weekly-list, insert it
  // right after the hero so the issue browser always renders (idempotent — no dup).
  if (!visible.some((s) => s.id === "weekly-list")) {
    const i = visible.findIndex((s) => s.id === "weekly-hero");
    const item: SectionMeta = { id: "weekly-list", visible: true };
    if (i >= 0) visible.splice(i + 1, 0, item);
    else visible.push(item);
  }

  return <PageComposer sections={visible} bgFill={ov.bgFill} anim={ov.anim} render={render} />;
}
