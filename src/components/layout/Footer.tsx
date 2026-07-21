import Link from "next/link";
import { MapPin } from "lucide-react";
import { site } from "@/data/site";
import Logo from "@/components/brand/Logo";
import NewsletterForm from "./NewsletterForm";
import type { CMSOverrides } from "@/lib/cms";
import { tx } from "@/lib/home-content";

/**
 * Footer — shared on every page and FULLY editable in C3 Studio (v6 R3 redesign).
 *
 * PREMIUM redesign + THREE options, selected by a single globals key
 * `footer-variant` (read from the existing globals.text bag → NO model shape
 * change, 3-TS parity untouched):
 *   • "editorial" (default) — Editorial Dark: ink canvas entered via a soft
 *     gradient bleed, oversized brand, calm 12-col link grid, slim teal hairline,
 *     generous 96px (--s-24) top air. Refines the prior footer to design-standard.
 *   • "bigcta" — a "Plan your visit" pre-footer CTA band that flows straight into
 *     the dark link footer as ONE seamless unit (strong church conversion ending).
 *   • "minimal" — centered logo, one tagline line, a single row of links + social,
 *     campuses collapsed to one line. Lightest weight, for lean pages.
 *
 * Every text and link is tagged with a `g:` (global) data-cms id so edits apply
 * site-wide. R8: the contact items (phone, email), footer links and social are
 * `data-cms-link` so their label + destination are BOTH editable — same as any
 * other text. Content comes from the global overrides bag (falls back to the
 * hand-built defaults when the CMS is off).
 */
export default function Footer({ globals = {} }: { globals?: CMSOverrides }) {
  const t = globals.text || {};
  const m = globals.media || {}; // v3 (R4): editable logo sources by globals key
  const variant = (t["footer-variant"] || "editorial").toLowerCase();

  if (variant === "minimal") return <FooterMinimal t={t} m={m} />;
  if (variant === "bigcta") return <FooterEditorial t={t} m={m} preCta />;
  return <FooterEditorial t={t} m={m} />;
}

/* ─────────────────────────────────────────────────────────────────────────
   Shared editable data (one id space → content persists across variant swaps)
   ───────────────────────────────────────────────────────────────────────── */
const YEAR = 2026;

const EXPLORE_LINKS = [
  { id: "footer-explore-0", label: "About", href: "/about/" },
  { id: "footer-explore-1", label: "Locations", href: "/locations/" },
  { id: "footer-explore-2", label: "Messages", href: "/messages/" },
  { id: "footer-explore-3", label: "C3 Weekly", href: "/news/" },
  { id: "footer-explore-4", label: "Events", href: "/events/" },
  { id: "footer-explore-5", label: "Watch Live", href: "/watch/" },
  { id: "footer-explore-6", label: "Counseling", href: "/counseling/" },
  { id: "footer-explore-7", label: "Connect", href: "/connect/" },
  { id: "footer-explore-8", label: "Plan a Visit", href: "/visit/" },
  { id: "footer-explore-9", label: "Give", href: "/give/" },
];
const LEGAL_LINKS = [
  { id: "footer-legal-0", label: "Privacy", href: "/privacy/" },
  { id: "footer-legal-1", label: "Terms", href: "/terms/" },
  { id: "footer-legal-2", label: "Accessibility", href: "/accessibility/" },
];
const CAMPUSES = [
  { id: "hays", name: "Hays", addr: [`${site.address.street}`, `${site.address.city}, ${site.address.state} ${site.address.zip}`], times: "Sat 5 PM · Sun 8, 9:30, 11 AM" },
  { id: "colby", name: "Colby", addr: ["1923 S Range", "Colby, KS 67701"], times: "Sun 10:00 AM" },
];

type TextBag = Record<string, string>;
type MediaBag = Record<string, string>;

/** R8: a footer link whose label + destination are BOTH editable on the page. */
function FLink({ t, id, label, href, tone = "muted" }: { t: TextBag; id: string; label: string; href: string; tone?: "muted" | "bright" }) {
  const color = tone === "bright" ? "rgba(255,255,255,0.80)" : "rgba(255,255,255,0.60)";
  return (
    <Link href={t[`${id}-href`] || href} prefetch={false} data-cms-link={`g:${id}`} className="footer-link" style={{ color, transition: "color var(--dur-fast) var(--ease-out)" }}>
      <span data-cms-link-label>{tx(t, `${id}-label`, label)}</span>
    </Link>
  );
}

function FooterHeading({ id, t, children }: { id: string; t: TextBag; children: string }) {
  return (
    <p className="overline mb-5" data-cms={`g:${id}`} style={{ color: "rgba(255,255,255,0.42)" }} dangerouslySetInnerHTML={{ __html: tx(t, id, children) }} />
  );
}

/** R8: social links are editable — destination from the override, tagged data-cms-link. */
function SocialRow({ t }: { t: TextBag }) {
  const Social = ({ id, href, label, children }: { id: string; href: string; label: string; children: React.ReactNode }) => (
    <a href={t[`${id}-href`] || href} target="_blank" rel="noopener noreferrer" aria-label={label} data-cms-link={`g:${id}`} className="footer-social w-10 h-10 flex items-center justify-center">
      {children}
    </a>
  );
  return (
    <div className="flex items-center justify-center md:justify-start gap-3">
      <Social id="footer-social-facebook" href={site.social.facebook} label="Facebook"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg></Social>
      <Social id="footer-social-instagram" href={site.social.instagram} label="Instagram"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg></Social>
      <Social id="footer-social-youtube" href={site.social.youtube} label="YouTube"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8zM9.55 15.57V8.43L15.82 12l-6.27 3.57z" /></svg></Social>
      {/* Real social bar (verified platforms): Facebook · Instagram · YouTube. */}
    </div>
  );
}

/** The gradient BLEED that eases the page's bone/haze canvas into the ink footer —
 *  seamless, no hard seam (design standard §1.6). */
function GradientBleed() {
  return <div aria-hidden style={{ height: "var(--s-16, 64px)", background: "linear-gradient(180deg, rgba(27,28,28,0) 0%, rgba(27,28,28,0.6) 55%, #1b1c1c 100%)" }} />;
}

function BottomBar({ t }: { t: TextBag }) {
  return (
    <div style={{ borderTop: "1px solid rgba(255,255,255,0.10)", paddingTop: "var(--s-8, 32px)" }}>
      <div className="container-c3 pb-8 text-xs flex flex-col items-center gap-2 md:flex-row md:items-center md:justify-between md:gap-4" style={{ color: "rgba(255,255,255,0.40)" }}>
        <p data-cms="g:footer-copyright" dangerouslySetInnerHTML={{ __html: tx(t, "footer-copyright", `© ${YEAR} Celebration Community Church · All Rights Reserved`) }} />
        <div className="flex items-center gap-5">
          {LEGAL_LINKS.map((l) => <FLink key={l.id} t={t} {...l} />)}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   VARIANT: Editorial Dark (default) — optional Big-CTA pre-band (preCta)
   ───────────────────────────────────────────────────────────────────────── */
function FooterEditorial({ t, m, preCta = false }: { t: TextBag; m: MediaBag; preCta?: boolean }) {
  return (
    <footer data-cms-bg="g:footer" style={{ backgroundColor: "#1b1c1c", color: "rgba(255,255,255,0.75)" }}>
      {/* Seamless entry from the page canvas */}
      <GradientBleed />

      {/* Big-CTA pre-band — full-bleed teal "Plan your visit" moment that flows
          STRAIGHT into the dark link footer as ONE unit: flush bottom (no gap,
          bottom corners squared) sits directly on the footer, and the hairline is
          dropped in this mode since the teal→ink meeting IS the transition. */}
      {preCta && (
        <div style={{ position: "relative", overflow: "hidden", background: "linear-gradient(135deg, #179c8c 0%, #1cc3af 100%)", padding: "clamp(3rem, 7vw, 5rem) clamp(1.5rem, 5vw, 3rem)", textAlign: "center" }}>
          <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(80% 90% at 50% 0%, rgba(255,255,255,0.20), transparent 65%)", pointerEvents: "none" }} />
          <p className="overline" data-cms="g:footer-cta-eyebrow" style={{ color: "#042e29", position: "relative" }} dangerouslySetInnerHTML={{ __html: tx(t, "footer-cta-eyebrow", "New here?") }} />
          <h2 className="display-1" data-cms="g:footer-cta-heading" style={{ color: "#fff", margin: "var(--s-3, 12px) 0 var(--s-6, 24px)", position: "relative" }} dangerouslySetInnerHTML={{ __html: tx(t, "footer-cta-heading", "Plan your first visit") }} />
          <Link href={t["footer-cta-href"] || "/visit/"} prefetch={false} data-cms-link="g:footer-cta" className="btn" style={{ position: "relative", background: "#042e29", color: "#fff", borderRadius: "var(--radius-pill, 999px)", fontWeight: 700, padding: "0.95rem 2.2rem" }}>
            <span data-cms-link-label>{tx(t, "footer-cta-label", "What to expect")}</span>
          </Link>
        </div>
      )}

      {/* v8 D4: the 2px teal hairline that used to sit mid-footer is REMOVED (Tyler
          confirmed with the user). The GradientBleed above already carries the page →
          ink transition, so the footer reads clean with no stray teal line. */}

      <div className="container-c3" style={{ paddingTop: "var(--s-24, 96px)", paddingBottom: "var(--s-16, 64px)" }}>
        <div className="flex flex-col items-center text-center gap-12 md:grid md:grid-cols-2 md:items-start md:text-left md:gap-x-10 md:gap-y-12 lg:grid-cols-12 lg:gap-y-0">
          {/* Brand — oversized wordmark + contact */}
          <div className="lg:col-span-4 max-w-xs md:max-w-none">
            <Link href="/" prefetch={false} className="inline-block mb-6" aria-label="C3 Home"><Logo size={56} variant="light" cmsKey="g:logo-light" srcOverride={m["logo-light"]} /></Link>
            <p className="heading-3 mb-4" data-cms="g:footer-brand" style={{ color: "rgba(255,255,255,0.95)" }} dangerouslySetInnerHTML={{ __html: tx(t, "footer-brand", "Celebration Community Church") }} />
            <p className="body-sm leading-relaxed mb-6 mx-auto md:mx-0" data-cms="g:footer-tagline" style={{ color: "rgba(255,255,255,0.52)", maxWidth: "22rem" }} dangerouslySetInnerHTML={{ __html: tx(t, "footer-tagline", "One church family in two places across northwest Kansas — for everyone, just as you are.") }} />
            <div className="flex flex-col gap-2 items-center md:items-start">
              {/* ITEM 5: phone/email are EDITABLE TEXT that carries a link — the inner
                  label is the editable [data-cms] node, and the <a> keeps real
                  navigation while exposing its destination via data-cms-href (read by
                  EditBridge's cms:focus → hrefPath). Clicking selects the text (not the
                  "Edit button" panel); the anchor no longer carries data-cms-link. */}
              <a href={t["footer-phone-href"] || `tel:${site.phone.replace(/\D/g, "")}`} data-cms-href="g:footer-phone" className="footer-link body-sm" style={{ color: "rgba(255,255,255,0.60)", transition: "color var(--dur-fast) var(--ease-out)" }}>
                <span data-cms="t:footer-phone-label">{tx(t, "footer-phone-label", site.phone)}</span>
              </a>
              <a href={t["footer-email-href"] || `mailto:${site.email}`} data-cms-href="g:footer-email" className="footer-link body-sm" style={{ color: "rgba(255,255,255,0.60)", transition: "color var(--dur-fast) var(--ease-out)" }}>
                <span data-cms="t:footer-email-label">{tx(t, "footer-email-label", site.email)}</span>
              </a>
            </div>
          </div>

          {/* Explore */}
          <div className="lg:col-span-2">
            <FooterHeading id="footer-explore-head" t={t}>Explore</FooterHeading>
            <ul className="flex flex-col gap-3 body-sm">
              {EXPLORE_LINKS.map((l) => <li key={l.id}><FLink t={t} {...l} /></li>)}
            </ul>
          </div>

          {/* Campuses */}
          <div className="lg:col-span-3 w-full max-w-xs md:max-w-none">
            <FooterHeading id="footer-campuses-head" t={t}>Campuses</FooterHeading>
            <div className="flex flex-col gap-6">
              {CAMPUSES.map((c) => (
                <div key={c.id} className="flex gap-3 justify-center md:justify-start text-center md:text-left">
                  <MapPin size={16} className="mt-0.5 shrink-0" style={{ color: "var(--color-teal)" }} aria-hidden="true" />
                  <div>
                    <p className="body-sm font-bold mb-1" data-cms={`g:footer-campus-${c.id}-name`} style={{ color: "rgba(255,255,255,0.92)" }} dangerouslySetInnerHTML={{ __html: tx(t, `footer-campus-${c.id}-name`, c.name) }} />
                    <address className="not-italic body-sm leading-snug mb-1.5" data-cms={`g:footer-campus-${c.id}-addr`} style={{ color: "rgba(255,255,255,0.48)" }} dangerouslySetInnerHTML={{ __html: tx(t, `footer-campus-${c.id}-addr`, `${c.addr[0]}<br/>${c.addr[1]}`) }} />
                    <p className="text-xs" data-cms={`g:footer-campus-${c.id}-times`} style={{ color: "rgba(255,255,255,0.55)" }} dangerouslySetInnerHTML={{ __html: tx(t, `footer-campus-${c.id}-times`, c.times) }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter + social */}
          <div className="lg:col-span-3 w-full max-w-sm md:max-w-none">
            <FooterHeading id="footer-news-head" t={t}>Stay in the loop</FooterHeading>
            <p className="body-sm" data-cms="g:footer-news-blurb" style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.65 }} dangerouslySetInnerHTML={{ __html: tx(t, "footer-news-blurb", "The C3 Weekly — what's happening at C3, straight to your inbox.") }} />
            {/* v8 P3: widen the cramped blurb→form gap. The blurb is a <p>, and globals.css
               has an UNLAYERED `p{margin:0}` reset that beats Tailwind's layered `mb-*`
               utility, so `mb-5`/`mb-8` on the blurb compute to 0 (verified live). The
               effective, codebase-idiomatic fix is a spacing wrapper on the NEXT element —
               matching the sibling `<div className="mt-7"><SocialRow/></div>` below. */}
            <div className="mt-7"><NewsletterForm /></div>
            <div className="mt-7"><SocialRow t={t} /></div>
          </div>
        </div>
      </div>

      <BottomBar t={t} />
    </footer>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   VARIANT: Minimal Centered — lean, single row of links + social
   ───────────────────────────────────────────────────────────────────────── */
function FooterMinimal({ t, m }: { t: TextBag; m: MediaBag }) {
  return (
    <footer data-cms-bg="g:footer" style={{ backgroundColor: "#1b1c1c", color: "rgba(255,255,255,0.75)" }}>
      <GradientBleed />
      {/* v8 D4: teal hairline removed here too (see FooterEditorial) — clean footer. */}

      <div className="container-c3" style={{ paddingTop: "var(--s-24, 96px)", paddingBottom: "var(--s-12, 48px)", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--s-8, 32px)" }}>
        <Link href="/" prefetch={false} aria-label="C3 Home"><Logo size={56} variant="light" cmsKey="g:logo-light" srcOverride={m["logo-light"]} /></Link>

        <p className="body-lg" data-cms="g:footer-tagline" style={{ color: "rgba(255,255,255,0.60)", maxWidth: "42ch", margin: 0 }} dangerouslySetInnerHTML={{ __html: tx(t, "footer-tagline", "One church family in two places across northwest Kansas — for everyone, just as you are.") }} />

        {/* Single row of primary links */}
        <nav className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3 body-sm">
          {EXPLORE_LINKS.slice(0, 6).map((l) => <FLink key={l.id} t={t} {...l} tone="bright" />)}
        </nav>

        {/* Campuses collapsed to one line */}
        <p className="body-sm" data-cms="g:footer-campus-line" style={{ color: "rgba(255,255,255,0.50)", margin: 0 }} dangerouslySetInnerHTML={{ __html: tx(t, "footer-campus-line", "Hays, KS · Colby, KS") }} />

        <SocialRow t={t} />
      </div>

      <BottomBar t={t} />
    </footer>
  );
}
