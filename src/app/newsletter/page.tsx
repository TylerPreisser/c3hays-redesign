import type { Metadata } from "next";
import Image from "next/image";
import { Calendar, BookOpen, Users, Smartphone } from "lucide-react";
import { assetPath } from "@/lib/asset-path";
import { getCMSPage } from "@/lib/cms";
import { tx, imgCss } from "@/lib/home-content";
import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";
import Stack from "@/components/ui/Stack";
import FeatureCard from "@/components/ui/FeatureCard";
import InboxTile from "@/components/newsletter/InboxTile";
import IssueBrowser from "@/components/newsletter/IssueBrowser";
import { newsletterIssues } from "@/data/news";

/* Brand marks as inline SVGs (this lucide build ships no brand icons — matches the
   Footer's inline-SVG convention). currentColor drives the fill. */
function YoutubeIcon({ size = 24, style }: { size?: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={style}>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#fff" />
    </svg>
  );
}
function FacebookIcon({ size = 24, style }: { size?: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={style}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
function InstagramIcon({ size = 24, style }: { size?: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={style}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export const metadata: Metadata = {
  title: "The C3 Weekly Newsletter",
  description:
    "The C3 Weekly — a short note each week with what's coming up, new messages, and ways to connect at Celebration Community Church.",
};

/* Real "stay connected" channels (from the content inventory). */
const CHANNELS = [
  { id: "app", Icon: Smartphone, label: "C3 App", meta: "iPhone & Android", href: "https://apps.apple.com/us/app/c3-hays/id1028509278" },
  { id: "youtube", Icon: YoutubeIcon, label: "YouTube", meta: "@c3hays", href: "https://www.youtube.com/@c3hays" },
  { id: "facebook", Icon: FacebookIcon, label: "Facebook", meta: "/c3hays", href: "https://facebook.com/c3hays" },
  { id: "instagram", Icon: InstagramIcon, label: "Instagram", meta: "@c3hays", href: "https://instagram.com/c3hays" },
];

const INSIDE = [
  { Icon: Calendar, defaultTitle: "What's coming up", defaultBody: "The week ahead — services, events, and gatherings across both campuses." },
  { Icon: BookOpen, defaultTitle: "This week's message", defaultBody: "A link to the latest sermon and where we are in our current series." },
  { Icon: Users, defaultTitle: "Ways to get involved", defaultBody: "Next steps to serve, join a group, and connect with the C3 family." },
];

export default async function NewsletterPage() {
  const ov = (await getCMSPage("/newsletter")) || {};
  const t = ov.text || {};
  const media = ov.media || {};

  return (
    <>
      {/* ── Hero (NL1) ───────────────────────────────────────────── */}
      <section className="relative flex items-end overflow-hidden" style={{ minHeight: "54vh" }}>
        <div className="absolute inset-0" data-cms-img="newsletter-hero-img">
          <Image
            src={assetPath(media["newsletter-hero-img"] || "/images/community.webp")}
            alt="C3 church family"
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={imgCss(ov.img?.["newsletter-hero-img"])}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(10,10,10,0.32) 0%, rgba(10,10,10,0.5) 50%, rgba(10,10,10,0.9) 100%)",
            }}
          />
        </div>
        <div className="relative z-10 container-c3 pb-16 pt-44">
          <Stack gap="heading" style={{ maxWidth: 640 }}>
            <Stack gap="eyebrow">
              <p
                className="overline"
                style={{ color: "#1cc3af" }}
                data-cms="t:newsletter-hero-eyebrow"
                dangerouslySetInnerHTML={{ __html: tx(t, "newsletter-hero-eyebrow", "Newsletter") }}
              />
              <h1
                className="display-1 text-white text-balance"
                data-cms="t:newsletter-hero-heading"
                dangerouslySetInnerHTML={{ __html: tx(t, "newsletter-hero-heading", "The C3 Weekly") }}
              />
            </Stack>
            <p
              className="body-lg max-w-xl"
              style={{ color: "rgba(255,255,255,0.68)" }}
              data-cms="t:newsletter-hero-body"
              dangerouslySetInnerHTML={{
                __html: tx(
                  t,
                  "newsletter-hero-body",
                  "A short note each week &mdash; what&rsquo;s coming up, this week&rsquo;s message, and simple ways to take your next step."
                ),
              }}
            />
          </Stack>
        </div>
      </section>

      {/* ── More ways to keep up (NL4 — moved to TOP) ────────────── */}
      <Section tone="mist" size="sm" container>
        <SectionHeader
          eyebrow={
            <span
              data-cms="t:newsletter-stay-eyebrow"
              dangerouslySetInnerHTML={{ __html: tx(t, "newsletter-stay-eyebrow", "Stay connected") }}
            />
          }
          title={
            <span
              data-cms="t:newsletter-stay-heading"
              dangerouslySetInnerHTML={{ __html: tx(t, "newsletter-stay-heading", "More ways to keep up with C3") }}
            />
          }
          lead={
            <span
              data-cms="t:newsletter-stay-lead"
              dangerouslySetInnerHTML={{
                __html: tx(t, "newsletter-stay-lead", "Follow along wherever you already are &mdash; the app, video, and social.")
              }}
            />
          }
          style={{ marginBottom: "var(--space-block)" }}
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {CHANNELS.map((c) => {
            const Icon = c.Icon;
            return (
              <a
                key={c.id}
                href={t[`newsletter-channel-${c.id}-href`] || c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="bento-tile group flex items-center gap-3.5"
                style={{
                  padding: "1.15rem 1.35rem",
                  borderRadius: "var(--radius-md)",
                  background: "#fff",
                  border: "1px solid rgba(27,28,28,0.07)",
                  boxShadow: "var(--shadow-rest)",
                  color: "var(--color-ink)",
                }}
              >
                <span
                  className="inline-flex items-center justify-center shrink-0"
                  style={{ width: "2.75rem", height: "2.75rem", borderRadius: "var(--radius-sm)", background: "rgba(28,195,175,0.1)", color: "var(--color-teal)" }}
                  aria-hidden="true"
                >
                  <Icon size={22} />
                </span>
                <span className="flex flex-col" style={{ minWidth: 0 }}>
                  <span style={{ fontWeight: 700, fontSize: "0.95rem", lineHeight: 1.2 }}>
                    {tx(t, `newsletter-channel-${c.id}-label`, c.label)}
                  </span>
                  <span style={{ fontSize: "0.78rem", color: "var(--color-mute)" }}>{c.meta}</span>
                </span>
              </a>
            );
          })}
        </div>
      </Section>

      {/* ── What's inside (FeatureCard trio) ─────────────────────── */}
      <Section tone="white" container>
        <SectionHeader
          eyebrow={
            <span
              data-cms="t:newsletter-inside-eyebrow"
              dangerouslySetInnerHTML={{ __html: tx(t, "newsletter-inside-eyebrow", "Every week") }}
            />
          }
          title={
            <span
              data-cms="t:newsletter-inside-heading"
              dangerouslySetInnerHTML={{ __html: tx(t, "newsletter-inside-heading", "What&rsquo;s inside") }}
            />
          }
          style={{ marginBottom: "var(--space-block)" }}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {INSIDE.map((item, i) => {
            const Icon = item.Icon;
            return (
              <FeatureCard
                key={i}
                icon={<Icon size={22} />}
                title={
                  <span
                    data-cms={`t:newsletter-inside-${i}-title`}
                    dangerouslySetInnerHTML={{ __html: tx(t, `newsletter-inside-${i}-title`, item.defaultTitle) }}
                  />
                }
                body={
                  <span
                    data-cms={`t:newsletter-inside-${i}-body`}
                    dangerouslySetInnerHTML={{ __html: tx(t, `newsletter-inside-${i}-body`, item.defaultBody) }}
                  />
                }
              />
            );
          })}
        </div>
      </Section>

      {/* ── Browse the issues (NL5/NL6) + InboxTile aside (NL2) ──── */}
      <Section tone="mist" container>
        <SectionHeader
          eyebrow={
            <span
              data-cms="t:newsletter-issues-eyebrow"
              dangerouslySetInnerHTML={{ __html: tx(t, "newsletter-issues-eyebrow", "The archive") }}
            />
          }
          title={
            <span
              data-cms="t:newsletter-issues-heading"
              dangerouslySetInnerHTML={{ __html: tx(t, "newsletter-issues-heading", "Browse The C3 Weekly") }}
            />
          }
          lead={
            <span
              data-cms="t:newsletter-issues-lead"
              dangerouslySetInnerHTML={{
                __html: tx(t, "newsletter-issues-lead", "Filter by week or search a topic &mdash; then open any issue to read it in full.")
              }}
            />
          }
          style={{ marginBottom: "var(--space-block)" }}
        />
        <div className="flex flex-col gap-10 lg:grid lg:gap-10 lg:items-start lg:[grid-template-columns:minmax(0,1fr)_320px]">
          <IssueBrowser issues={newsletterIssues} />
          <InboxTile
            title={
                <span
                  data-cms="t:newsletter-sub-heading"
                  dangerouslySetInnerHTML={{ __html: tx(t, "newsletter-sub-heading", "Get it in your inbox") }}
                />
              }
              body={
                <span
                  data-cms="t:newsletter-sub-body"
                  dangerouslySetInnerHTML={{
                    __html: tx(t, "newsletter-sub-body", "One short email each week &mdash; what&rsquo;s coming up, this week&rsquo;s message, and simple next steps.")
                  }}
                />
              }
            />
        </div>
      </Section>
    </>
  );
}
