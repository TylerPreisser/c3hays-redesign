import Link from "next/link";
import Image from "next/image";
import { site } from "@/data/site";
import { navItems } from "@/data/navigation";
import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  const year = 2026;

  return (
    <footer className="bg-[#0a1f2e] text-white/70">
      {/* Newsletter strip */}
      <div className="border-b border-white/8">
        <div className="container-c3 py-14">
          <div className="max-w-xl">
            <p className="overline text-[#d4a056] mb-3">Stay Connected</p>
            <h2 className="heading-2 text-white mb-2">Get weekly updates</h2>
            <p className="body-base text-white/60 mb-6">
              Sermon notes, announcements, and what&apos;s happening at C3 — delivered to your inbox.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="container-c3 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-5">
              <Image
                src="/brand/logo.png"
                alt="C3 logo"
                width={40}
                height={40}
                className="w-10 h-10 object-contain"
              />
              <div>
                <div className="text-white font-medium text-base leading-none">C3</div>
                <div className="text-white/50 text-xs mt-0.5">Celebration Community</div>
              </div>
            </Link>
            <p className="text-sm text-white/55 leading-relaxed">
              {site.mission}
            </p>
            {/* Social */}
            <div className="flex items-center gap-3 mt-6">
              <SocialLink href={site.social.facebook} label="Facebook">
                {/* Facebook */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </SocialLink>
              <SocialLink href={site.social.instagram} label="Instagram">
                {/* Instagram */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </SocialLink>
              <SocialLink href={site.social.youtube} label="YouTube">
                {/* YouTube */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
                </svg>
              </SocialLink>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <p className="overline text-white/40 mb-5">Explore</p>
            <ul className="flex flex-col gap-2.5">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/60 hover:text-white transition-colors duration-150"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/visit/"
                  className="text-sm text-white/60 hover:text-white transition-colors duration-150"
                >
                  Plan a Visit
                </Link>
              </li>
            </ul>
          </div>

          {/* Hays campus */}
          <div>
            <p className="overline text-white/40 mb-5">Hays Campus</p>
            <address className="not-italic text-sm text-white/60 leading-relaxed mb-4">
              {site.address.street}<br />
              {site.address.city}, {site.address.state} {site.address.zip}
            </address>
            <div className="text-sm text-white/60 space-y-1">
              <p>Sat 5:00 PM</p>
              <p>Sun 8:00 AM · 9:30 AM · 11:00 AM</p>
            </div>
            <a
              href={`tel:${site.phone.replace(/\D/g, "")}`}
              className="block mt-4 text-sm text-white/60 hover:text-white transition-colors"
            >
              {site.phone}
            </a>
            <a
              href={`mailto:${site.email}`}
              className="block mt-1 text-sm text-white/60 hover:text-white transition-colors"
            >
              {site.email}
            </a>
          </div>

          {/* Colby campus */}
          <div>
            <p className="overline text-white/40 mb-5">Colby Campus</p>
            <address className="not-italic text-sm text-white/60 leading-relaxed mb-4">
              1923 S Range<br />
              Colby, KS 67701
            </address>
            <div className="text-sm text-white/60">
              <p>Sun 10:00 AM</p>
            </div>
            <div className="mt-6 flex flex-col gap-2">
              <Link
                href="/give/"
                className="text-sm font-medium text-[#d4a056] hover:text-[#e0b878] transition-colors"
              >
                Give Online →
              </Link>
              <Link
                href="/connect/"
                className="text-sm font-medium text-[#d4a056] hover:text-[#e0b878] transition-colors"
              >
                Connect Card →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/6">
        <div className="container-c3 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/35">
          <p>© {year} Celebration Community Church · All rights reserved</p>
          <p>Built with care by Tyler Preisser</p>
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
  // w-11 h-11 = 44px — Apple HIG minimum touch target size for social icons
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-11 h-11 rounded-full bg-white/8 hover:bg-white/14 flex items-center justify-center text-white/60 hover:text-white transition-all duration-150"
    >
      {children}
    </a>
  );
}
