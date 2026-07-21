import type { CSSProperties } from "react";
import { Clock, MapPin, ArrowUpRight } from "lucide-react";
import { locations } from "@/data/locations";
import { site } from "@/data/site";
import { Tx } from "@/components/cms/Editable";
import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";

/**
 * <WeeklyConnect> — the /news "Stay Connected" section (data-section="weekly-connect").
 *
 * Replaces the old empty "issues coming soon" placeholder with REAL content only:
 * the church's genuine ways to keep up — YouTube, Facebook, Instagram, and the C3
 * Podcast — plus the real weekend service times. NOTHING is fabricated: no invented
 * articles, issues, dates, or authors. Every destination is a real, verified channel
 * pulled from @/data/site; the service times come from @/data/locations.
 *
 * Editor-native by construction: the section is a data-cms-bg region, every
 * label/description is a <Tx> text region, and every channel link is an editable
 * data-cms-link + label. On-brand paper / teal / ink. Server component.
 */

function YouTubeIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8zM9.55 15.57V8.43L15.82 12l-6.27 3.57z" />
    </svg>
  );
}
function FacebookIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
function InstagramIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
function PodcastIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2a9 9 0 0 0-9 9c0 2.6 1.1 4.9 2.9 6.5" />
      <path d="M12 2a9 9 0 0 1 9 9c0 2.6-1.1 4.9-2.9 6.5" />
      <path d="M8.5 12a3.5 3.5 0 1 1 7 0c0 1-.4 1.9-1.1 2.5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <path d="M11 13.5 9.5 22h5L13 13.5" />
    </svg>
  );
}

interface Channel {
  id: string;
  label: string;
  desc: string;
  href: string;
  Icon: ({ size }: { size?: number }) => React.ReactNode;
}

/* REAL, verified church channels only — hrefs from @/data/site. */
const CHANNELS: Channel[] = [
  {
    id: "youtube",
    label: "YouTube",
    desc: "Every weekend message, on demand — catch up anytime.",
    href: site.social.youtube,
    Icon: YouTubeIcon,
  },
  {
    id: "facebook",
    label: "Facebook",
    desc: "Join the live stream every Saturday and Sunday, plus church updates.",
    href: site.social.facebook,
    Icon: FacebookIcon,
  },
  {
    id: "instagram",
    label: "Instagram",
    desc: "Everyday moments and photos from our C3 family.",
    href: site.social.instagram,
    Icon: InstagramIcon,
  },
  {
    id: "podcast",
    label: "C3 Podcast",
    desc: "Listen to messages on the go, wherever you get your podcasts.",
    href: site.social.podcast,
    Icon: PodcastIcon,
  },
];

export default function WeeklyConnect({ t }: { t: Record<string, string> }) {
  const iconChip: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "3rem",
    height: "3rem",
    borderRadius: "var(--radius-sm)",
    background: "rgba(28,195,175,0.12)",
    color: "var(--color-teal)",
    flexShrink: 0,
  };

  return (
    <Section
      container
      style={{ backgroundColor: "var(--color-paper)", color: "var(--color-ink-warm)" }}
      bgKey="weekly-connect-bg"
    >
      <SectionHeader
        leadMaxWidth="46rem"
        style={{ marginBottom: "var(--space-block)" }}
        eyebrow={<Tx text={t} k="weekly-connect-eyebrow" fallback="Stay Connected" />}
        title={<Tx as="span" text={t} k="weekly-connect-heading" fallback="Never miss what&rsquo;s next at C3" />}
        lead={
          <Tx
            as="span"
            text={t}
            k="weekly-connect-lead"
            fallback="Subscribe above for a weekly note in your inbox &mdash; or keep up with C3 wherever you already are."
            style={{ color: "var(--color-stone)" }}
          />
        }
      />

      {/* Channel cards — real platforms, each an editable link */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: "var(--space-body)" }}>
        {CHANNELS.map(({ id, label, desc, href, Icon }) => (
          // Editor-safe pattern (mirrors /watch cards): the CARD is a data-cms-bg div,
          // its icon/label/desc are independent editable children, and ONLY the bottom
          // CTA is a real editable data-cms-link.
          <div
            key={id}
            className="group flex flex-col h-full"
            data-cms-bg={`weekly-channel-${id}-bg`}
            style={{
              padding: "clamp(1.5rem, 2.5vw, 2rem)",
              background: "var(--color-paper-soft)",
              border: "1px solid var(--color-clay-line)",
              borderRadius: "var(--radius-md)",
              boxShadow: "var(--shadow-rest)",
            }}
          >
            <div style={iconChip} aria-hidden="true">
              <Icon size={22} />
            </div>
            <Tx
              as="h3"
              text={t}
              k={`weekly-channel-${id}-label`}
              fallback={label}
              className="heading-3"
              style={{ color: "var(--color-ink-warm)", marginTop: "var(--space-heading)" }}
            />
            <Tx
              as="p"
              text={t}
              k={`weekly-channel-${id}-desc`}
              fallback={desc}
              className="body-sm"
              style={{ color: "var(--color-stone)", marginTop: "var(--space-eyebrow)", lineHeight: 1.65 }}
            />
            <a
              href={t[`weekly-channel-${id}-href`] || href}
              target="_blank"
              rel="noopener noreferrer"
              data-cms-link={`weekly-channel-${id}`}
              className="inline-flex items-center gap-1 font-semibold"
              style={{ color: "var(--color-teal-deep)", marginTop: "auto", paddingTop: "var(--space-body)", textDecoration: "none" }}
            >
              <span data-cms-link-label>{t[`weekly-channel-${id}-cta`] || `Follow on ${label}`}</span>
              <ArrowUpRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </a>
          </div>
        ))}
      </div>

      {/* Service times — real weekend gatherings, so "keeping up" always points home */}
      <div
        data-cms-bg="weekly-times-bg"
        style={{
          marginTop: "var(--space-block)",
          padding: "clamp(1.75rem, 3vw, 2.5rem)",
          background: "var(--color-paper-soft)",
          border: "1px solid var(--color-clay-line)",
          borderRadius: "var(--radius-md)",
          boxShadow: "var(--shadow-rest)",
        }}
      >
        <Tx
          as="p"
          text={t}
          k="weekly-times-eyebrow"
          fallback="Gather with us"
          className="overline"
          style={{ color: "var(--color-teal-deep)" }}
        />
        <Tx
          as="h3"
          text={t}
          k="weekly-times-heading"
          fallback="Weekend service times"
          className="heading-2"
          style={{ color: "var(--color-ink-warm)", marginTop: "var(--space-eyebrow)", marginBottom: "var(--space-heading)" }}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: "var(--space-body)" }}>
          {locations.map((loc) => (
            <div key={loc.id} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <MapPin size={15} style={{ color: "var(--color-teal)" }} className="shrink-0" aria-hidden="true" />
                <Tx
                  as="span"
                  text={t}
                  k={`weekly-times-${loc.id}-name`}
                  fallback={`${loc.name} Campus`}
                  className="font-bold text-sm uppercase tracking-widest"
                  style={{ color: "var(--color-ink-warm)" }}
                />
              </div>
              {loc.services.map((s, i) => (
                <div key={s.day} className="flex items-center gap-2">
                  <Clock size={14} style={{ color: "var(--color-stone)" }} className="shrink-0" aria-hidden="true" />
                  <Tx
                    as="span"
                    text={t}
                    k={`weekly-times-${loc.id}-service-${i}`}
                    fallback={`${s.day}: ${s.times.join(" · ")}`}
                    className="body-base"
                    style={{ color: "var(--color-stone)" }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
        <a
          href={t["weekly-times-cta-href"] || "/visit/"}
          data-cms-link="weekly-times-cta"
          className="btn btn-primary btn-sm inline-flex self-start"
          style={{ marginTop: "var(--space-body)" }}
        >
          <span data-cms-link-label>{t["weekly-times-cta-label"] || "Plan a Visit"}</span>
        </a>
      </div>
    </Section>
  );
}
