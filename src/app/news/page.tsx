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
 * Formerly a client redirect stub (→ /newsletter → /visit), which is why the editor's
 * "News" resolved to Visit content. It is now a REAL editor-native content page.
 *
 * Composed via <PageComposer> from two sections — ids coordinated with the c3-backend
 * page-sections default for /news:
 *   • weekly-hero → image band: LEFT-aligned header over the photo (#8) + a RIGHT-side
 *     editor-native newsletter-signup OVERLAY (<WeeklySignup>, #9) — heading/body/field/
 *     button/image all independently editable, and the signup FUNCTIONS.
 *   • weekly-list → the filterable issue browser.
 *
 * Round-2 #10: the old bottom "Get it in your inbox" InboxTile is GONE (replaced by the
 * hero overlay). Every section bg (rail), card bg (data-cms-bg), heading/body (<Tx>) and
 * button (data-cms-link + label) is editable. Export-safe: no server redirect.
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
                {/* LEFT — header, left-aligned over the image (#8). Explicit white text
                    for legibility over the scrim; each line an independent <Tx>. */}
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

                {/* RIGHT — editor-native signup OVERLAY (#9). */}
                <WeeklySignup text={t} />
              </div>
            </div>
          </section>
        );
      case "weekly-list":
        return (
          <Section
            /* #6c: retheme off the muddy tan (--color-paper-soft) to the clean premium
               on-brand paper (teal/paper/ink), consistent with the rest of the site —
               a crisp warm-white field so the white issue cards + teal accents read
               premium instead of beige. */
            style={{ backgroundColor: "var(--color-paper)", color: "var(--color-ink)" }}
            bgKey="weekly-list-bg"
          >
            <div style={{ width: `min(100% - 2 * ${GUTTER}, 1600px)`, marginInline: "auto" }}>
              {/* Round-3 de-dupe: the redundant "Browse The C3 Weekly" SectionHeader
                  (eyebrow "Past issues" + title + lead) is REMOVED — the hero already
                  titles the page. The lower section now shows ONLY the filters + list.
                  IssueBrowser (and its filter controls) are untouched. */}
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

  return <PageComposer sections={visible} bgFill={ov.bgFill} anim={ov.anim} render={render} />;
}
