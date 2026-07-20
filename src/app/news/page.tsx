import type { Metadata } from "next";
import { getCMSPage } from "@/lib/cms";
import { parseSections, type SectionMeta } from "@/lib/home-content";
import { Tx, EditableLink } from "@/components/cms/Editable";
import PageComposer from "@/components/cms/PageComposer";
import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";
import InboxTile from "@/components/newsletter/InboxTile";
import IssueBrowser from "@/components/newsletter/IssueBrowser";
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
 * "News" resolved to Visit content. It is now a REAL editor-native content page: the
 * Browse-C3-Weekly experience moved off /visit lives here.
 *
 * Composed via <PageComposer> from two sections — ids coordinated with the c3-backend
 * page-sections default the queen will add for /news:
 *   • weekly-hero → intro + subscribe CTA
 *   • weekly-list → the filterable issue browser + inbox subscribe tile
 *
 * Every section bg (rail), card bg (data-cms-bg), heading/body (<Tx>) and button
 * (<EditableLink>) is editable. Export-safe: no server redirect, no client-router hop.
 */
const PAGE_DEFAULT_SECTIONS: SectionMeta[] = [
  { id: "weekly-hero", visible: true },
  { id: "weekly-list", visible: true },
];

/* Responsive gutter for the wide Browse container (mirrors .container-c3 padding). */
const GUTTER = "clamp(1.25rem, 5vw, 3rem)";

export default async function NewsPage() {
  const ov = (await getCMSPage("/news")) || {};
  const t = ov.text || {};
  const sections = parseSections(ov.sections, PAGE_DEFAULT_SECTIONS);

  const render = (id: string): React.ReactNode => {
    switch (id) {
      case "weekly-hero":
        return (
          <Section
            container
            centered
            maxWidth="52rem"
            style={{ backgroundColor: "var(--color-paper)", color: "var(--color-ink-warm)" }}
            bgKey="weekly-hero-bg"
          >
            <div data-cms-bg="weekly-hero-card">
              <SectionHeader
                align="center"
                titleAs="h1"
                eyebrow={<Tx text={t} k="weekly-hero-eyebrow" fallback="The C3 Weekly" />}
                title={<Tx text={t} k="weekly-hero-heading" fallback="This week at C3." />}
                lead={
                  <Tx
                    text={t}
                    k="weekly-hero-lead"
                    fallback="One short email each week &mdash; what&rsquo;s coming up, this week&rsquo;s message, and simple next steps. Browse past issues below or get it in your inbox."
                  />
                }
                style={{ marginBottom: "var(--space-block)" }}
              />
              <div className="flex flex-wrap gap-5 justify-center">
                <EditableLink
                  text={t}
                  k="weekly-hero-primary"
                  href="#subscribe"
                  label="Get it in your inbox"
                  className="btn btn-primary btn-lg"
                />
                <EditableLink
                  text={t}
                  k="weekly-hero-secondary"
                  href="/messages/"
                  label="Watch this week's message"
                  className="btn btn-outline-navy btn-lg"
                />
              </div>
            </div>
          </Section>
        );
      case "weekly-list":
        return (
          <Section
            style={{ backgroundColor: "var(--color-paper-soft)", color: "var(--color-ink-warm)" }}
            bgKey="weekly-list-bg"
          >
            <div style={{ width: `min(100% - 2 * ${GUTTER}, 1600px)`, marginInline: "auto" }}>
              <SectionHeader
                eyebrow={<Tx text={t} k="weekly-list-eyebrow" fallback="Past issues" />}
                title={<Tx text={t} k="weekly-list-heading" fallback="Browse The C3 Weekly" />}
                lead={
                  <Tx
                    text={t}
                    k="weekly-list-lead"
                    fallback="Filter by week or search a topic &mdash; then open any issue to read it in full."
                  />
                }
                style={{ marginBottom: "var(--space-block)" }}
              />

              <IssueBrowser issues={newsletterIssues} />

              {/* Subscribe — get The C3 Weekly in your inbox. */}
              <div
                id="subscribe"
                data-cms-bg="weekly-subscribe-card"
                style={{ maxWidth: "34rem", marginInline: "auto", marginTop: "var(--space-block)" }}
              >
                <InboxTile
                  sticky={false}
                  title={<Tx text={t} k="weekly-sub-heading" fallback="Get it in your inbox" />}
                  body={
                    <Tx
                      text={t}
                      k="weekly-sub-body"
                      fallback="One short email each week &mdash; what&rsquo;s coming up, this week&rsquo;s message, and simple next steps."
                    />
                  }
                />
              </div>
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
