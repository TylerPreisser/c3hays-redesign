import Link from "next/link";
import { MapPin } from "lucide-react";
import { site } from "@/data/site";
import Logo from "@/components/brand/Logo";
import NewsletterForm from "./NewsletterForm";
import type { CMSOverrides } from "@/lib/cms";
import { tx } from "@/lib/home-content";

/**
 * Footer — shared on every page and FULLY editable in C3 Studio. Every text and
 * link is tagged with a `g:` (global) data-cms id, so edits made here apply
 * site-wide. Content comes from the global overrides bag (falls back to the
 * hand-built defaults when the CMS is off).
 */
export default function Footer({ globals = {} }: { globals?: CMSOverrides }) {
  const year = 2026;
  const t = globals.text || {};
  const m = globals.media || {}; // v3 (R4): editable logo sources by globals key

  const exploreLinks = [
    { id: "footer-explore-0", label: "About", href: "/about/" },
    { id: "footer-explore-1", label: "Locations", href: "/locations/" },
    { id: "footer-explore-2", label: "Messages", href: "/messages/" },
    { id: "footer-explore-3", label: "News", href: "/news/" },
    { id: "footer-explore-4", label: "Watch Live", href: "/watch/" },
    { id: "footer-explore-5", label: "Counseling", href: "/counseling/" },
    { id: "footer-explore-6", label: "Connect", href: "/connect/" },
    { id: "footer-explore-7", label: "Plan a Visit", href: "/visit/" },
    { id: "footer-explore-8", label: "Give", href: "/give/" },
  ];
  const legalLinks = [
    { id: "footer-legal-0", label: "Privacy", href: "/privacy/" },
    { id: "footer-legal-1", label: "Terms", href: "/terms/" },
    { id: "footer-legal-2", label: "Accessibility", href: "/accessibility/" },
  ];
  const campuses = [
    { id: "hays", name: "Hays", addr: [`${site.address.street}`, `${site.address.city}, ${site.address.state} ${site.address.zip}`], times: "Sat 5 PM · Sun 8, 9:30, 11 AM" },
    { id: "colby", name: "Colby", addr: ["1923 S Range", "Colby, KS 67701"], times: "Sun 10:00 AM" },
  ];

  /** A footer link whose label + destination are editable on the page. The
   *  data-cms-link carries the `g:` scope so the editor saves to site globals;
   *  the stored override keys stay un-prefixed. */
  const FLink = ({ id, label, href }: { id: string; label: string; href: string }) => (
    <Link href={t[`${id}-href`] || href} data-cms-link={`g:${id}`} className="text-sm hover:text-white transition-colors duration-150" style={{ color: "rgba(255,255,255,0.65)" }}>
      <span data-cms-link-label>{tx(t, `${id}-label`, label)}</span>
    </Link>
  );

  return (
    <footer data-cms-bg="g:footer" style={{ backgroundColor: "#1b1c1c", color: "rgba(255,255,255,0.75)" }}>
      <div aria-hidden style={{ height: 3, background: "linear-gradient(90deg, transparent, #1cc3af 30%, #1cc3af 70%, transparent)" }} />
      <div className="container-c3" style={{ paddingTop: "6rem", paddingBottom: "4rem" }}>
        <div
          className="
            flex flex-col items-center text-center gap-12
            md:grid md:grid-cols-2 md:items-start md:text-left md:gap-x-10 md:gap-y-12
            lg:grid lg:grid-cols-12 lg:items-start lg:text-left lg:gap-x-10 lg:gap-y-0
          "
        >
          {/* Block 1 — Brand */}
          <div className="lg:col-span-4 max-w-xs md:max-w-none">
            <Link href="/" className="inline-block mb-6" aria-label="C3 Home"><Logo size={48} variant="light" cmsKey="g:logo-light" srcOverride={m["logo-light"]} /></Link>
            <p className="text-base font-semibold mb-4" data-cms="g:footer-brand" style={{ color: "rgba(255,255,255,0.92)" }} dangerouslySetInnerHTML={{ __html: tx(t, "footer-brand", "Celebration Community Church") }} />
            <p className="text-sm leading-relaxed mb-6 mx-auto md:mx-0" data-cms="g:footer-tagline" style={{ color: "rgba(255,255,255,0.50)", maxWidth: "22rem" }} dangerouslySetInnerHTML={{ __html: tx(t, "footer-tagline", "One church family in two places across northwest Kansas — for everyone, just as you are.") }} />
            <div className="flex flex-col gap-2">
              <a href={t["footer-phone-href"] || `tel:${site.phone.replace(/\D/g, "")}`} data-cms-link="g:footer-phone" className="text-sm hover:text-white transition-colors duration-150" style={{ color: "rgba(255,255,255,0.55)" }}>
                <span data-cms-link-label>{tx(t, "footer-phone-label", site.phone)}</span>
              </a>
              <a href={t["footer-email-href"] || `mailto:${site.email}`} data-cms-link="g:footer-email" className="text-sm hover:text-white transition-colors duration-150" style={{ color: "rgba(255,255,255,0.55)" }}>
                <span data-cms-link-label>{tx(t, "footer-email-label", site.email)}</span>
              </a>
            </div>
          </div>

          {/* Block 2 — Explore */}
          <div className="lg:col-span-2">
            <FooterHeading id="footer-explore-head" text={t}>Explore</FooterHeading>
            <ul className="flex flex-col gap-3">
              {exploreLinks.map((l) => <li key={l.id}><FLink {...l} /></li>)}
            </ul>
          </div>

          {/* Block 3 — Campuses */}
          <div className="lg:col-span-3 w-full max-w-xs md:max-w-none">
            <FooterHeading id="footer-campuses-head" text={t}>Campuses</FooterHeading>
            <div className="flex flex-col gap-6">
              {campuses.map((c) => (
                <div key={c.id} className="flex gap-3 justify-center md:justify-start text-center md:text-left">
                  <MapPin size={16} className="mt-0.5 shrink-0" style={{ color: "var(--color-teal)" }} aria-hidden="true" />
                  <div>
                    <p className="text-sm font-bold mb-1" data-cms={`g:footer-campus-${c.id}-name`} style={{ color: "rgba(255,255,255,0.92)" }} dangerouslySetInnerHTML={{ __html: tx(t, `footer-campus-${c.id}-name`, c.name) }} />
                    <address className="not-italic text-sm leading-snug mb-1.5" data-cms={`g:footer-campus-${c.id}-addr`} style={{ color: "rgba(255,255,255,0.48)" }} dangerouslySetInnerHTML={{ __html: tx(t, `footer-campus-${c.id}-addr`, `${c.addr[0]}<br/>${c.addr[1]}`) }} />
                    <p className="text-xs" data-cms={`g:footer-campus-${c.id}-times`} style={{ color: "rgba(255,255,255,0.55)" }} dangerouslySetInnerHTML={{ __html: tx(t, `footer-campus-${c.id}-times`, c.times) }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Block 4 — Newsletter + social */}
          <div className="lg:col-span-3 w-full max-w-sm md:max-w-none">
            <FooterHeading id="footer-news-head" text={t}>Stay in the loop</FooterHeading>
            <p className="text-sm mb-5" data-cms="g:footer-news-blurb" style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.65 }} dangerouslySetInnerHTML={{ __html: tx(t, "footer-news-blurb", "Sermon notes and what's happening at C3 — in your inbox.") }} />
            <NewsletterForm />
            <div className="flex items-center justify-center md:justify-start gap-3 mt-7">
              <SocialLink t={t} id="footer-social-facebook" href={site.social.facebook} label="Facebook"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg></SocialLink>
              <SocialLink t={t} id="footer-social-instagram" href={site.social.instagram} label="Instagram"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg></SocialLink>
              <SocialLink t={t} id="footer-social-youtube" href={site.social.youtube} label="YouTube"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" /><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" /></svg></SocialLink>
              <SocialLink t={t} id="footer-social-vimeo" href={site.social.vimeo} label="Vimeo"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="23 7 16 12 23 17 23 7" /><rect width="15" height="14" x="1" y="5" rx="2" ry="2" /></svg></SocialLink>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.10)", paddingTop: "2rem" }}>
        <div className="container-c3 pb-8 text-xs flex flex-col items-center gap-2 md:flex-row md:items-center md:justify-between md:gap-4" style={{ color: "rgba(255,255,255,0.40)" }}>
          <p data-cms="g:footer-copyright" dangerouslySetInnerHTML={{ __html: tx(t, "footer-copyright", `© ${year} Celebration Community Church · All Rights Reserved`) }} />
          <div className="flex items-center gap-5">
            {legalLinks.map((l) => (
              <Link key={l.id} href={t[`${l.id}-href`] || l.href} data-cms-link={`g:${l.id}`} className="hover:text-white transition-colors duration-150" style={{ color: "rgba(255,255,255,0.40)" }}>
                <span data-cms-link-label>{tx(t, `${l.id}-label`, l.label)}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterHeading({ id, text, children }: { id: string; text: Record<string, string>; children: string }) {
  return (
    <p className="text-xs font-bold uppercase tracking-[0.16em] mb-5" data-cms={`g:${id}`} style={{ color: "rgba(255,255,255,0.40)" }} dangerouslySetInnerHTML={{ __html: tx(text, id, children) }} />
  );
}

/** v3 (R4): social links are editable — the destination URL comes from the globals
 *  override (t[`${id}-href`]) when set, and the anchor is tagged data-cms-link so
 *  staff can point each icon at the church's real profile from the editor. */
function SocialLink({ t, id, href, label, children }: { t: Record<string, string>; id: string; href: string; label: string; children: React.ReactNode }) {
  return (
    <a href={t[`${id}-href`] || href} target="_blank" rel="noopener noreferrer" aria-label={label} data-cms-link={`g:${id}`} className="footer-social w-10 h-10 flex items-center justify-center">
      {children}
    </a>
  );
}
