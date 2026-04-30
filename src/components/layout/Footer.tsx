import Link from "next/link";
import Image from "next/image";
import { site } from "@/data/site";
import { navItems } from "@/data/navigation";
import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  const year = 2026;

  return (
    <footer style={{ backgroundColor: "#0a0a0a", color: "rgba(242,239,237,0.65)" }}>
      {/* Main footer grid */}
      <div className="container-c3 py-20 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          {/* Brand + social */}
          <div className="md:col-span-4">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <Image
                src="/brand/logo.png"
                alt="C3 logo"
                width={40}
                height={40}
                className="w-10 h-10 object-contain"
              />
              <div>
                <div className="text-white font-bold text-sm tracking-widest uppercase">C3</div>
                <div className="text-[#f2efed]/40 text-xs mt-0.5 tracking-wider uppercase">Celebration Community</div>
              </div>
            </Link>
            <address className="not-italic text-sm leading-relaxed mb-2" style={{ color: "rgba(242,239,237,0.5)" }}>
              {site.address.street}<br />
              {site.address.city}, {site.address.state} {site.address.zip}
            </address>
            <a href={`tel:${site.phone.replace(/\D/g, "")}`} className="block text-sm mb-0.5 hover:text-white transition-colors duration-150" style={{ color: "rgba(242,239,237,0.5)" }}>
              {site.phone}
            </a>
            <a href={`mailto:${site.email}`} className="block text-sm mb-6 hover:text-white transition-colors duration-150" style={{ color: "rgba(242,239,237,0.5)" }}>
              {site.email}
            </a>
            {/* Social */}
            <div className="flex items-center gap-3">
              <SocialLink href={site.social.facebook} label="Facebook">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </SocialLink>
              <SocialLink href={site.social.instagram} label="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </SocialLink>
              <SocialLink href={site.social.youtube} label="YouTube">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
                </svg>
              </SocialLink>
            </div>
          </div>

          {/* Nav links */}
          <div className="md:col-span-2 md:col-start-6">
            <p className="overline mb-5" style={{ color: "rgba(242,239,237,0.35)" }}>Explore</p>
            <ul className="flex flex-col gap-3">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm hover:text-white transition-colors duration-150"
                    style={{ color: "rgba(242,239,237,0.55)" }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/visit/"
                  className="text-sm hover:text-white transition-colors duration-150"
                  style={{ color: "rgba(242,239,237,0.55)" }}
                >
                  Plan a Visit
                </Link>
              </li>
              <li>
                <Link
                  href="/give/"
                  className="text-sm font-semibold hover:text-white transition-colors duration-150"
                  style={{ color: "#e53539" }}
                >
                  Give →
                </Link>
              </li>
            </ul>
          </div>

          {/* Campus info */}
          <div className="md:col-span-2">
            <p className="overline mb-5" style={{ color: "rgba(242,239,237,0.35)" }}>Hays Campus</p>
            <address className="not-italic text-sm leading-relaxed mb-3" style={{ color: "rgba(242,239,237,0.5)" }}>
              {site.address.street}<br />
              {site.address.city}, {site.address.state} {site.address.zip}
            </address>
            <div className="text-sm space-y-1" style={{ color: "rgba(242,239,237,0.5)" }}>
              <p>Sat 5:00 PM</p>
              <p>Sun 8:00 · 9:30 · 11:00 AM</p>
            </div>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-3">
            <p className="overline mb-5" style={{ color: "rgba(242,239,237,0.35)" }}>Stay Connected</p>
            <p className="text-sm mb-5" style={{ color: "rgba(242,239,237,0.5)" }}>
              Sermon notes, announcements, and what&apos;s happening at C3 — in your inbox.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid rgba(242,239,237,0.08)" }}>
        <div className="container-c3 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs" style={{ color: "rgba(242,239,237,0.3)" }}>
          <p>© {year} Celebration Community Church · All rights reserved</p>
          <p>Built by Tyler Preisser</p>
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
      className="footer-social w-11 h-11 flex items-center justify-center"
    >
      {children}
    </a>
  );
}
