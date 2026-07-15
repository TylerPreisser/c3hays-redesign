import type { Metadata } from "next";
import Image from "next/image";
import { Mail, Calendar, BookOpen, Users, Smartphone } from "lucide-react";
import { assetPath } from "@/lib/asset-path";
import { getCMSPage } from "@/lib/cms";
import { tx, imgCss } from "@/lib/home-content";
import NewsletterForm from "@/components/layout/NewsletterForm";

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

/** Weekly newsletter issues. Empty until the first issue ships — this page is the
 *  ready-to-fill shell (the future Beehiiv-style module drops issues in here). We do
 *  NOT fabricate an archive; when there are no issues yet, we show a subscribe-forward
 *  "on its way" state (never a bare empty string). */
interface Issue {
  id: string;
  title: string;
  date: string; // ISO
  excerpt: string;
  href: string;
  image?: string;
}
const issues: Issue[] = [];

/* Real "stay connected" channels (from the content inventory). */
const CHANNELS = [
  { id: "app", Icon: Smartphone, label: "C3 App", href: "https://apps.apple.com/us/app/c3-hays/id1028509278" },
  { id: "youtube", Icon: YoutubeIcon, label: "YouTube", href: "https://www.youtube.com/@c3hays" },
  { id: "facebook", Icon: FacebookIcon, label: "Facebook", href: "https://facebook.com/c3hays" },
  { id: "instagram", Icon: InstagramIcon, label: "Instagram", href: "https://instagram.com/c3hays" },
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
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section
        className="relative flex items-end overflow-hidden"
        style={{ minHeight: "52vh" }}
      >
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
          <p
            className="overline mb-5"
            style={{ color: "#1cc3af" }}
            data-cms="t:newsletter-hero-eyebrow"
            dangerouslySetInnerHTML={{ __html: tx(t, "newsletter-hero-eyebrow", "Newsletter") }}
          />
          <h1
            className="display-1 text-white text-balance"
            data-cms="t:newsletter-hero-heading"
            dangerouslySetInnerHTML={{ __html: tx(t, "newsletter-hero-heading", "The C3 Weekly") }}
          />
          <p
            className="body-lg mt-5 max-w-xl"
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
        </div>
      </section>

      {/* ── Subscribe ────────────────────────────────────────────── */}
      <section className="section" style={{ backgroundColor: "#f6f6f6" }}>
        <div className="container-c3">
          <div
            className="mx-auto text-center"
            style={{
              maxWidth: 620,
              background: "#fff",
              borderRadius: "var(--radius-lg, 1.5rem)",
              padding: "clamp(2rem, 5vw, 3.5rem)",
              boxShadow: "0 30px 70px rgba(10,10,10,0.07)",
              border: "1px solid rgba(27,28,28,0.06)",
            }}
          >
            <span
              className="inline-flex items-center justify-center mx-auto"
              style={{ width: 60, height: 60, borderRadius: 16, marginBottom: "1.5rem", background: "rgba(28,195,175,0.12)", color: "var(--color-teal)" }}
            >
              <Mail size={28} />
            </span>
            <h2
              className="display-2 mb-3"
              style={{ color: "#1b1c1c" }}
              data-cms="t:newsletter-sub-heading"
              dangerouslySetInnerHTML={{ __html: tx(t, "newsletter-sub-heading", "Get it in your inbox") }}
            />
            <p
              className="body-lg mb-8"
              style={{ color: "rgba(27,28,28,0.6)" }}
              data-cms="t:newsletter-sub-body"
              dangerouslySetInnerHTML={{
                __html: tx(t, "newsletter-sub-body", "One email a week. No spam, unsubscribe anytime."),
              }}
            />
            <div style={{ maxWidth: 420, margin: "0 auto" }}>
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>

      {/* ── What's inside ────────────────────────────────────────── */}
      <section className="section" style={{ backgroundColor: "#ffffff", paddingTop: "clamp(2rem,4vw,3rem)" }}>
        <div className="container-c3">
          <div className="mb-12 max-w-2xl">
            <p
              className="overline mb-4"
              style={{ color: "#1cc3af" }}
              data-cms="t:newsletter-inside-eyebrow"
              dangerouslySetInnerHTML={{ __html: tx(t, "newsletter-inside-eyebrow", "Every week") }}
            />
            <h2
              className="display-2"
              style={{ color: "#1b1c1c" }}
              data-cms="t:newsletter-inside-heading"
              dangerouslySetInnerHTML={{ __html: tx(t, "newsletter-inside-heading", "What&rsquo;s inside") }}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {INSIDE.map((item, i) => {
              const Icon = item.Icon;
              return (
                <div
                  key={i}
                  style={{ borderRadius: "var(--radius-md)", padding: "2rem", background: "#f6f6f6", border: "1px solid rgba(27,28,28,0.06)" }}
                >
                  <span
                    className="inline-flex items-center justify-center mb-5"
                    style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(28,195,175,0.12)", color: "var(--color-teal)" }}
                  >
                    <Icon size={22} />
                  </span>
                  <h3
                    className="heading-2 mb-2"
                    style={{ color: "#1b1c1c", fontSize: "1.2rem" }}
                    data-cms={`t:newsletter-inside-${i}-title`}
                    dangerouslySetInnerHTML={{ __html: tx(t, `newsletter-inside-${i}-title`, item.defaultTitle) }}
                  />
                  <p
                    className="body-base"
                    style={{ color: "rgba(27,28,28,0.6)" }}
                    data-cms={`t:newsletter-inside-${i}-body`}
                    dangerouslySetInnerHTML={{ __html: tx(t, `newsletter-inside-${i}-body`, item.defaultBody) }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Recent issues (ready-to-fill archive) ────────────────── */}
      <section className="section" style={{ backgroundColor: "#f6f6f6" }}>
        <div className="container-c3">
          <div className="mb-10 max-w-2xl">
            <p
              className="overline mb-4"
              style={{ color: "#1cc3af" }}
              data-cms="t:newsletter-archive-eyebrow"
              dangerouslySetInnerHTML={{ __html: tx(t, "newsletter-archive-eyebrow", "The archive") }}
            />
            <h2
              className="display-2"
              style={{ color: "#1b1c1c" }}
              data-cms="t:newsletter-archive-heading"
              dangerouslySetInnerHTML={{ __html: tx(t, "newsletter-archive-heading", "Recent issues") }}
            />
          </div>

          {issues.length === 0 ? (
            <div
              className="text-center"
              style={{ background: "#fff", borderRadius: "var(--radius-md)", padding: "clamp(2.5rem,6vw,4rem)", border: "1px dashed rgba(27,28,28,0.14)" }}
            >
              <h3
                className="heading-1 mb-3"
                style={{ color: "#1b1c1c" }}
                data-cms="t:newsletter-empty-heading"
                dangerouslySetInnerHTML={{ __html: tx(t, "newsletter-empty-heading", "The first issue is on its way.") }}
              />
              <p
                className="body-lg mx-auto"
                style={{ color: "rgba(27,28,28,0.6)", maxWidth: 460 }}
                data-cms="t:newsletter-empty-body"
                dangerouslySetInnerHTML={{
                  __html: tx(t, "newsletter-empty-body", "Subscribe above and you&rsquo;ll be the first to get The C3 Weekly when it lands."),
                }}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {issues.map((n) => (
                <a
                  key={n.id}
                  href={n.href}
                  className="group block"
                  style={{ background: "#fff", borderRadius: "var(--radius-md)", overflow: "hidden", border: "1px solid rgba(27,28,28,0.08)" }}
                >
                  {n.image && (
                    <div className="relative overflow-hidden" style={{ aspectRatio: "16/10" }}>
                      <Image src={assetPath(n.image)} alt={n.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                  )}
                  <div style={{ padding: "1.5rem" }}>
                    <p style={{ fontSize: ".72rem", color: "rgba(27,28,28,0.45)", fontWeight: 600, marginBottom: 8 }}>
                      {new Date(n.date + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </p>
                    <h3 className="heading-2" style={{ fontSize: "1.2rem", marginBottom: 8, color: "#1b1c1c" }}>{n.title}</h3>
                    <p style={{ fontSize: ".9rem", color: "rgba(27,28,28,0.62)", lineHeight: 1.6 }}>{n.excerpt}</p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Stay connected (real channels) ───────────────────────── */}
      <section className="section" style={{ backgroundColor: "#1b1c1c" }}>
        <div className="container-c3 text-center" style={{ maxWidth: 700 }}>
          <p
            className="overline mb-4"
            style={{ color: "#1cc3af" }}
            data-cms="t:newsletter-stay-eyebrow"
            dangerouslySetInnerHTML={{ __html: tx(t, "newsletter-stay-eyebrow", "Stay connected") }}
          />
          <h2
            className="display-2 text-white mb-8"
            data-cms="t:newsletter-stay-heading"
            dangerouslySetInnerHTML={{ __html: tx(t, "newsletter-stay-heading", "More ways to keep up with C3") }}
          />
          <div className="flex flex-wrap items-center justify-center gap-4">
            {CHANNELS.map((c) => {
              const Icon = c.Icon;
              return (
                <a
                  key={c.id}
                  href={t[`newsletter-channel-${c.id}-href`] || c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 transition-colors"
                  style={{
                    color: "#fff",
                    padding: "0.85rem 1.4rem",
                    borderRadius: 999,
                    border: "1px solid rgba(255,255,255,0.16)",
                    background: "rgba(255,255,255,0.04)",
                    fontWeight: 600,
                  }}
                >
                  <Icon size={20} style={{ color: "#1cc3af" }} />
                  {tx(t, `newsletter-channel-${c.id}-label`, c.label)}
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
