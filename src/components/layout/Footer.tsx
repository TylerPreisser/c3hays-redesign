import Link from "next/link";
import { site } from "@/data/site";
import Logo from "@/components/brand/Logo";
import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  const year = 2026;

  return (
    <footer style={{ backgroundColor: "#1b1c1c", color: "rgba(255,255,255,0.75)" }}>
      {/* ── Main footer grid ── */}
      <div className="container-c3" style={{ paddingTop: "5rem", paddingBottom: "3rem" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-10">

          {/* Col 1 — Logo + contact */}
          <div>
            <Link href="/" className="inline-block mb-4" aria-label="C3 Home">
              <Logo size={40} variant="light" />
            </Link>
            <p className="text-sm font-semibold mb-4" style={{ color: "rgba(255,255,255,0.85)" }}>
              Celebration Community Church
            </p>
            <address className="not-italic text-sm leading-snug mb-4" style={{ color: "rgba(255,255,255,0.50)" }}>
              {site.address.street}<br />
              {site.address.city}, {site.address.state} {site.address.zip}
            </address>
            <div className="flex flex-col gap-1">
              <a
                href={`tel:${site.phone.replace(/\D/g, "")}`}
                className="text-sm hover:text-white transition-colors duration-150"
                style={{ color: "rgba(255,255,255,0.50)" }}
              >
                {site.phone}
              </a>
              <a
                href={`mailto:${site.email}`}
                className="text-sm hover:text-white transition-colors duration-150"
                style={{ color: "rgba(255,255,255,0.50)" }}
              >
                {site.email}
              </a>
            </div>
          </div>

          {/* Col 2 — Explore nav links */}
          <div>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: "About", href: "/about/" },
                { label: "Locations", href: "/locations/" },
                { label: "Messages", href: "/messages/" },
                { label: "Watch Live", href: "/watch/" },
                { label: "Counseling", href: "/counseling/" },
                { label: "Plan a Visit", href: "/visit/" },
                { label: "Connect", href: "/connect/" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors duration-150"
                    style={{ color: "rgba(255,255,255,0.55)" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link
                  href="/give/"
                  className="inline-flex items-center gap-2 font-bold uppercase tracking-[0.18em] transition-colors duration-200 hover:bg-[#179c8c]"
                  style={{
                    backgroundColor: "#1cc3af",
                    color: "#ffffff",
                    fontSize: "0.6875rem",
                    padding: "0.5rem 0.875rem",
                  }}
                >
                  Give <span aria-hidden>→</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 — Worship with Us (both campuses) */}
          <div>
            {/* Hays */}
            <div className="mb-5">
              <p className="text-sm font-bold mb-1" style={{ color: "rgba(255,255,255,0.85)" }}>
                Hays Campus
              </p>
              <address className="not-italic text-sm leading-snug mb-2" style={{ color: "rgba(255,255,255,0.45)" }}>
                {site.address.street}<br />
                {site.address.city}, {site.address.state} {site.address.zip}
              </address>
              <div className="text-sm space-y-0.5" style={{ color: "rgba(255,255,255,0.55)" }}>
                <p>Sat 5:00 PM</p>
                <p>Sun 8:00 · 9:30 · 11:00 AM</p>
              </div>
            </div>

            <div className="border-t my-5" style={{ borderColor: "rgba(255,255,255,0.08)" }} />

            {/* Colby */}
            <div>
              <p className="text-sm font-bold mb-1" style={{ color: "rgba(255,255,255,0.85)" }}>
                Colby Campus
              </p>
              <address className="not-italic text-sm leading-snug mb-2" style={{ color: "rgba(255,255,255,0.45)" }}>
                1923 S Range<br />
                Colby, KS 67701
              </address>
              <div className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                <p>Sun 10:00 AM</p>
              </div>
            </div>
          </div>

          {/* Col 4 — Stay Close: newsletter + social */}
          <div>
            <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,0.70)", lineHeight: 1.65 }}>
              Sermon notes, announcements, and what&apos;s happening at C3 — in your inbox.
            </p>
            <NewsletterForm />

            {/* Social icons */}
            <div className="flex items-center gap-3 mt-6">
              <SocialLink href={site.social.facebook} label="Facebook">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </SocialLink>
              <SocialLink href={site.social.instagram} label="Instagram">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </SocialLink>
              <SocialLink href={site.social.youtube} label="YouTube">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
                  <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
                </svg>
              </SocialLink>
              <SocialLink href={site.social.vimeo} label="Vimeo">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polygon points="23 7 16 12 23 17 23 7"/>
                  <rect width="15" height="14" x="1" y="5" rx="2" ry="2"/>
                </svg>
              </SocialLink>
              <SocialLink href={site.social.podcast} label="Podcast">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2a7 7 0 0 1 7 7v1a7 7 0 0 1-14 0V9a7 7 0 0 1 7-7zm0 2a5 5 0 0 0-5 5v1a5 5 0 0 0 10 0V9a5 5 0 0 0-5-5zM8 21h8m-4-4v4"/>
                  <path d="M12 17v4M8 21h8"/>
                </svg>
              </SocialLink>
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.10)",
          paddingTop: "2rem",
        }}
      >
        <div
          className="container-c3 pb-8 flex flex-col md:flex-row items-center justify-between gap-2 text-xs"
          style={{ color: "rgba(255,255,255,0.40)" }}
        >
          <p>© {year} Celebration Community Church</p>
          <p>Built with care by Tyler Preisser</p>
          <p>All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="footer-social w-10 h-10 flex items-center justify-center"
    >
      {children}
    </a>
  );
}
