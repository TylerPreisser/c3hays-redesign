import type { Metadata } from "next";
import Image from "next/image";
import { Navigation } from "lucide-react";
import { locations } from "@/data/locations";
import { assetPath } from "@/lib/asset-path";
import { getPageContent } from "@/lib/cms";
import { isCmsLive } from "@/lib/cms-live";
import { tx, imgCss, parseSections, type SectionMeta } from "@/lib/home-content";
import PageComposer from "@/components/cms/PageComposer";
import Section from "@/components/ui/Section";
import Stack from "@/components/ui/Stack";
import ServiceTimes from "@/components/home/ServiceTimes";

export const metadata: Metadata = {
  title: "Locations",
  description:
    "Find a Celebration Community Church campus near you — Hays and Colby, Kansas.",
};

/**
 * /locations — rebuilt to the editor-native SECTION contract (like /visit, /news).
 *
 * Composed via <PageComposer> from two editor-native sections whose ids are canonical:
 *   • locations-hero     → inline hero <section> (background image + eyebrow/heading/sub)
 *   • locations-campuses → the campus-cards <Section> (section header + 2-up campus cards
 *     with per-campus name/address/times + Directions links)
 *
 * PageComposer wraps each visible section in its own `<div data-section={id}>` and injects
 * the scoped per-section background stylesheet, so the editor rail can add / reorder / hide /
 * recolor these sections. All existing data-cms tagging is preserved byte-for-byte.
 *
 * Server component; reads CMS overrides (DRAFT under CMS_LIVE preview, PUBLISHED otherwise).
 */
const PAGE_DEFAULT_SECTIONS: SectionMeta[] = [
  { id: "locations-hero", visible: true },
  { id: "locations-campuses", visible: true },
  { id: "serviceTimes", visible: true },
];

export const dynamic = "force-dynamic";

export default async function LocationsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Finding 2: forward the editor's ?preview token under CMS_LIVE so the editor
  // preview reflects DRAFT (published in export / public).
  const cmsLive = isCmsLive();
  const sp = cmsLive && searchParams ? await searchParams : {};
  const preview = typeof sp.preview === "string" ? sp.preview : undefined;
  const ov = (await getPageContent("/locations", preview)) || {};
  const t = ov.text || {};
  const media = ov.media || {};
  const sections = parseSections(ov.sections, PAGE_DEFAULT_SECTIONS);

  const render = (id: string): React.ReactNode => {
    switch (id) {
      case "locations-hero":
        return (
          /* ── Hero ── */
          <section className="relative flex items-end overflow-hidden" style={{ minHeight: "62vh" }}>
            {/* Background image */}
            <div
              className="absolute inset-0"
              data-cms-img="locations-hero-bg"
              style={{ borderRadius: 0 }}
            >
              <Image
                src={assetPath(media["locations-hero-bg"] || "/images/exterior.webp")}
                alt="C3 campus exterior"
                fill
                priority
                sizes="100vw"
                className="object-cover"
                style={imgCss(ov.img?.["locations-hero-bg"])}
              />
            </div>

            {/* Gradient scrims */}
            <div
              className="absolute inset-0"
              style={{ background: "rgba(10,10,10,0.48)" }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.25) 55%, transparent 100%)",
              }}
            />

            {/* Content */}
            <div className="relative z-10 container-c3 pb-16 pt-40">
              <Stack gap="heading">
                <Stack gap="eyebrow">
                  {/* Eyebrow */}
                  <p
                    className="overline"
                    data-cms="t:locations-hero-eyebrow"
                    style={{ color: "var(--color-teal)" }}
                    dangerouslySetInnerHTML={{
                      __html: tx(t, "locations-hero-eyebrow", "Our Campuses"),
                    }}
                  />

                  {/* Headline */}
                  <h1
                    className="display-1 text-white"
                    data-cms="t:locations-hero-heading"
                    style={{ maxWidth: 720 }}
                    dangerouslySetInnerHTML={{
                      __html: tx(t, "locations-hero-heading", "Two campuses. One church family."),
                    }}
                  />
                </Stack>

                {/* Subheading */}
                <p
                  className="body-lg"
                  data-cms="t:locations-hero-sub"
                  style={{ color: "rgba(255,255,255,0.68)", maxWidth: 500 }}
                  dangerouslySetInnerHTML={{
                    __html: tx(
                      t,
                      "locations-hero-sub",
                      "You&rsquo;re welcome at both. Come just as you are this weekend."
                    ),
                  }}
                />
              </Stack>
            </div>
          </section>
        );
      case "locations-campuses":
        return (
          /* ── Campus cards ── */
          <Section tone="white" container>
            {/* #5: the redundant lower "Find your campus." header + intro is REMOVED —
                the hero above ("Two campuses. One church family.") already titles the
                page, so this section now shows ONLY the campus cards. */}

            {/* 2-up campus cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {locations.map((loc) => (
                <div
                  key={loc.id}
                  className="group relative overflow-hidden"
                  style={{ height: 520, borderRadius: "var(--radius-md)" }}
                >
                  {/* Campus image — CMS-editable */}
                  <div
                    className="absolute inset-0"
                    data-cms-img={`locations-campus-${loc.id}-img`}
                    style={{ borderRadius: "var(--radius-md)" }}
                  >
                    <Image
                      src={assetPath(media[`locations-campus-${loc.id}-img`] || loc.image)}
                      alt={`C3 ${loc.name} campus`}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      style={imgCss(ov.img?.[`locations-campus-${loc.id}-img`])}
                    />
                  </div>

                  {/* Gradient scrim */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.55) 45%, rgba(10,10,10,0.12) 80%, transparent 100%)",
                    }}
                  />

                  {/* Card content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
                    <Stack gap="cta">
                      <Stack gap="eyebrow">
                        {/* Campus name */}
                        <h3
                          className="heading-1 text-white"
                          data-cms={`t:locations-campus-${loc.id}-name`}
                          dangerouslySetInnerHTML={{
                            __html: tx(t, `locations-campus-${loc.id}-name`, loc.name),
                          }}
                        />

                        {/* Address */}
                        <p
                          className="body-sm"
                          data-cms={`t:locations-campus-${loc.id}-address`}
                          style={{ color: "rgba(255,255,255,0.68)" }}
                          dangerouslySetInnerHTML={{
                            __html: tx(
                              t,
                              `locations-campus-${loc.id}-address`,
                              `${loc.street}, ${loc.city}, ${loc.state} ${loc.zip}`
                            ),
                          }}
                        />

                        {/* Service times */}
                        <div
                          className="body-sm"
                          data-cms={`t:locations-campus-${loc.id}-times`}
                          style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}
                          dangerouslySetInnerHTML={{
                            __html: tx(
                              t,
                              `locations-campus-${loc.id}-times`,
                              loc.services
                                .map((s) => `${s.day}: ${s.times.join(" &middot; ")}`)
                                .join("<br/>")
                            ),
                          }}
                        />
                      </Stack>

                      {/* Directions button (Directions-only — no campus-details filler) */}
                      <a
                        href={t[`locations-campus-${loc.id}-dir-href`] || loc.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cms-link={`locations-campus-${loc.id}-dir`}
                        className="btn btn-primary inline-flex items-center gap-2 self-start"
                      >
                        <Navigation size={15} aria-hidden="true" />
                        <span data-cms-link-label>
                          {tx(t, `locations-campus-${loc.id}-dir-label`, "Directions")}
                        </span>
                      </a>
                    </Stack>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        );
      case "serviceTimes":
        return <ServiceTimes text={t} />;
      default:
        return null;
    }
  };

  const known = new Set(["locations-hero", "locations-campuses", "serviceTimes"]);
  const visible = sections.filter((s) => known.has(s.id));

  return <PageComposer sections={visible} bgFill={ov.bgFill} anim={ov.anim} render={render} />;
}
