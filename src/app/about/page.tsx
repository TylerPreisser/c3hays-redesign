import type { Metadata } from "next";
import Image from "next/image";
import { getPageContent } from "@/lib/cms";
import { isCmsLive } from "@/lib/cms-live";
import { parseSections, tx, imgCss, exampleContentShim, type SectionMeta } from "@/lib/home-content";
import { isExampleSection, renderExample, SECTION_EXAMPLE_IDS } from "@/lib/section-examples";
import { assetPath } from "@/lib/asset-path";
import { beliefs } from "@/data/beliefs";
import OurValues from "@/components/about/OurValues";
import StaffGrid from "@/components/about/StaffGrid";
import BeliefsAccordion from "@/components/beliefs/BeliefsAccordion";
import Stack from "@/components/ui/Stack";
import PageComposer from "@/components/cms/PageComposer";

export const metadata: Metadata = {
  title: "About",
  description:
    "Who we are and what we believe at Celebration Community Church, a church family in Hays and Colby, Kansas.",
};

/**
 * /about — the merged About + What We Believe page (item #2).
 *
 * ONE page composed via <PageComposer> from FIVE editor-native sections. The former
 * standalone /beliefs page was folded in as the `about-believe` section (its doctrine
 * is verbatim-real from celebratejesus.org /about "The Essentials We Believe"), and
 * /beliefs now 301-redirects here (next.config). The old "A relationship, not religion"
 * block (`about-story`) was REMOVED entirely per Tyler — replaced by a clean, real
 * "Who We Are" section.
 *
 *   • about-hero    → inline image hero (real mission subhead)
 *   • about-who     → "Who We Are" (id="who-we-are") — real about.json copy
 *   • about-values  → <OurValues> (Meet / Grow / Serve — the real mission)
 *   • about-believe → "What We Believe" (id="what-we-believe") — the real doctrine
 *   • about-staff   → <StaffGrid> (real 14-person roster)
 *
 * CONTENT RULE: every string traces to the real corpus; nothing invented.
 * Server component; reads PUBLISHED CMS overrides (forwards ?preview under CMS_LIVE).
 */
const PAGE_DEFAULT_SECTIONS: SectionMeta[] = [
  { id: "about-hero", visible: true },
  { id: "about-values", visible: true },
  { id: "about-believe", visible: true },
  { id: "about-staff", visible: true },
];

export const dynamic = "force-dynamic";

export default async function AboutPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const cmsLive = isCmsLive();
  const sp = cmsLive && searchParams ? await searchParams : {};
  const preview = typeof sp.preview === "string" ? sp.preview : undefined;
  const ov = (await getPageContent("/about", preview)) || {};
  const t = ov.text || {};
  const media = ov.media || {};
  const shim = exampleContentShim(ov);
  const sections = parseSections(ov.sections, PAGE_DEFAULT_SECTIONS);

  // Pre-resolve each doctrine item (CMS overrides applied) once, so the desktop list
  // and the mobile <BeliefsAccordion> render identical copy from one source.
  const beliefItems = beliefs.map((b, i) => ({
    id: b.id,
    n: i + 1,
    title: tx(t, `beliefs-item-${b.id}-title`, b.title),
    paragraphs: b.paragraphs.map((para, pi) => tx(t, `beliefs-item-${b.id}-p${pi}`, para)),
  }));

  const render = (id: string, variant?: string): React.ReactNode => {
    switch (id) {
      case "about-hero":
        return (
          /* ── Hero — also the single "Who We Are" section (id anchor for the nav
              jump-link; the duplicate 2-column Who-We-Are block was removed). ────── */
          <section
            id="who-we-are"
            className="relative flex items-end overflow-hidden"
            style={{ minHeight: "clamp(480px, 62vh, 740px)", scrollMarginTop: "6rem" }}
          >
            <div className="absolute inset-0" data-cms-img="about-hero-bg" style={{ borderRadius: 0 }}>
              <Image
                src={assetPath(media["about-hero-bg"] || "/images/congregation.webp")}
                alt="C3 congregation gathered in worship"
                fill
                priority
                sizes="100vw"
                className="object-cover"
                style={imgCss(ov.img?.["about-hero-bg"])}
              />
              <div className="absolute inset-0" style={{ background: "rgba(10,10,10,0.52)" }} />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.18) 55%, transparent 100%)",
                }}
              />
            </div>

            <div className="relative z-10 container-c3 pb-20 pt-40">
              <Stack gap="heading">
                <Stack gap="eyebrow">
                  <p
                    className="overline"
                    style={{ color: "#1cc3af" }}
                    data-cms="t:about-hero-eyebrow"
                    dangerouslySetInnerHTML={{ __html: tx(t, "about-hero-eyebrow", "About Us") }}
                  />
                  <h1
                    className="display-1 text-white text-balance"
                    data-cms="t:about-hero-heading"
                    dangerouslySetInnerHTML={{ __html: tx(t, "about-hero-heading", "Who we are.") }}
                  />
                </Stack>
                <p
                  className="body-lg max-w-xl"
                  style={{ color: "rgba(255,255,255,0.68)" }}
                  data-cms="t:about-hero-subhead"
                  dangerouslySetInnerHTML={{
                    __html: tx(
                      t,
                      "about-hero-subhead",
                      "Jesus is central to everything we do at C3. We exist to meet with Him, grow in Him, and serve through Him."
                    ),
                  }}
                />
              </Stack>
            </div>
          </section>
        );

      case "about-values":
        /* ── Our Values — Meet / Grow / Serve (the real mission). ─────────────── */
        return <OurValues text={t} />;

      case "about-believe":
        return (
          /* ── What We Believe (id anchor) — STICKY-SPLIT: the left column (heading +
              intro) stays pinned while the RIGHT column scrolls through the 14
              verbatim-real doctrine points ("The Essentials We Believe"). Accordion on
              mobile. Closes with the real "Have questions?" office email. ──────── */
          <section
            id="what-we-believe"
            className="section"
            style={{ backgroundColor: "var(--color-paper)", scrollMarginTop: "6rem" }}
          >
            <div className="container-c3">
              <div className="flex flex-col lg:flex-row lg:gap-20 xl:gap-28">

                {/* LEFT — sticky heading + intro (pinned while the doctrine scrolls). */}
                <aside className="lg:w-96 shrink-0 mb-12 lg:mb-0">
                  <div className="lg:sticky lg:top-32">
                    <Stack gap="heading">
                      <Stack gap="eyebrow">
                        <p
                          className="overline"
                          style={{ color: "#1cc3af" }}
                          data-cms="t:about-believe-eyebrow"
                          dangerouslySetInnerHTML={{ __html: tx(t, "about-believe-eyebrow", "What We Believe") }}
                        />
                        <h2
                          className="display-2"
                          style={{ color: "#1b1c1c" }}
                          data-cms="t:about-believe-title"
                          dangerouslySetInnerHTML={{ __html: tx(t, "about-believe-title", "The Essentials We Believe") }}
                        />
                      </Stack>
                      <p
                        className="body-lg"
                        style={{ color: "rgba(27,28,28,0.65)", lineHeight: 1.7 }}
                        data-cms="t:about-believe-body"
                        dangerouslySetInnerHTML={{
                          __html: tx(
                            t,
                            "about-believe-body",
                            "These are the essentials we believe at Celebration Community Church."
                          ),
                        }}
                      />
                      <div
                        className="hidden lg:block"
                        style={{ width: 40, height: 3, borderRadius: 2, background: "#1cc3af" }}
                      />
                    </Stack>
                  </div>
                </aside>

                {/* RIGHT — the 14 doctrine points scroll past the pinned left column. */}
                <div className="flex-1 min-w-0">
                  {/* Mobile (<lg): accessible tap-to-expand accordion. */}
                  <div className="lg:hidden">
                    <BeliefsAccordion items={beliefItems} />
                  </div>

                  {/* Desktop (lg+): numbered always-open list. */}
                  <div className="hidden lg:flex flex-col gap-0">
                    {beliefs.map((belief, i) => (
                      <div
                        key={belief.id}
                        className={`pb-10 group ${i === 0 ? "" : "pt-10"}`}
                        style={{ borderBottom: "1px solid rgba(27,28,28,0.10)" }}
                      >
                        <div className="flex gap-6 md:gap-10">
                          <div className="shrink-0 pt-1">
                            <span
                              className="text-sm font-bold tabular-nums"
                              style={{ color: "#1cc3af", letterSpacing: "0.02em" }}
                            >
                              {String(i + 1).padStart(2, "0")}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3
                              className="heading-2 mb-4"
                              data-cms={`t:beliefs-item-${belief.id}-title`}
                              style={{ color: "#1b1c1c" }}
                              dangerouslySetInnerHTML={{ __html: tx(t, `beliefs-item-${belief.id}-title`, belief.title) }}
                            />
                            <div className="flex flex-col gap-4">
                              {belief.paragraphs.map((para, pi) => (
                                <p
                                  key={pi}
                                  className="body-lg"
                                  data-cms={`t:beliefs-item-${belief.id}-p${pi}`}
                                  style={{ color: "rgba(27,28,28,0.68)", lineHeight: 1.75 }}
                                  dangerouslySetInnerHTML={{ __html: tx(t, `beliefs-item-${belief.id}-p${pi}`, para) }}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Real "Have questions?" closer. */}
                  <p
                    className="body-base mt-12"
                    style={{ color: "rgba(27,28,28,0.65)" }}
                    data-cms="t:about-believe-questions"
                    dangerouslySetInnerHTML={{
                      __html: tx(
                        t,
                        "about-believe-questions",
                        'For any questions regarding our statement of beliefs, please email <a href="mailto:office@celebratejesus.org" style="color:#1cc3af;font-weight:600">office@celebratejesus.org</a>.'
                      ),
                    }}
                  />
                </div>

              </div>
            </div>
          </section>
        );

      case "about-staff":
        /* ── Meet Our Staff — real 14-person roster ────────────────────────── */
        return <StaffGrid text={t} img={ov.img} />;

      default:
        return isExampleSection(id) ? renderExample(id, shim, variant) : null;
    }
  };

  const known = new Set(["about-hero", "about-values", "about-believe", "about-staff", ...SECTION_EXAMPLE_IDS]);
  const visible = sections.filter((s) => known.has(s.id));

  return (
    <PageComposer
      sections={visible}
      bgFill={ov.bgFill}
      anim={ov.anim}
      render={render}
      freeEls={ov.freeEls}
      freeOffsets={ov.freeOffsets}
    />
  );
}
