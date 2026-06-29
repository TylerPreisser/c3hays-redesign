import Link from "next/link";
import { site } from "@/data/site";
import Logo from "@/components/brand/Logo";
import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  const year = 2026;

  return (
    <footer style={{ backgroundColor: "#1b1c1c", color: "rgba(255,255,255,0.75)" }}>
      {/* ── Mobile-first stack — switches to 4-col grid at lg ── */}
      <div
        className="container-c3"
        style={{ paddingTop: "6rem", paddingBottom: "4rem" }}
      >
        <div
          className="
            flex flex-col items-center text-center gap-16
            lg:grid lg:grid-cols-12 lg:items-start lg:text-left lg:gap-x-10 lg:gap-y-0
          "
        >
          {/* Block 1 — Brand mark + church name + contact */}
          <div className="lg:col-span-4 max-w-xs lg:max-w-none">
            <Link
              href="/"
              className="inline-block mb-6"
              aria-label="C3 Home"
            >
              <Logo size={48} variant="light" />
            </Link>
            <p
              className="text-base font-semibold mb-4"
              style={{ color: "rgba(255,255,255,0.92)" }}
            >
              Celebration Community Church
            </p>
            <p
              className="text-sm leading-relaxed mb-6 mx-auto lg:mx-0"
              style={{ color: "rgba(255,255,255,0.50)", maxWidth: "22rem" }}
            >
              One church family in two places across northwest Kansas —
              for everyone, just as you are.
            </p>
            <div className="flex flex-col gap-2">
              <a
                href={`tel:${site.phone.replace(/\D/g, "")}`}
                className="text-sm hover:text-white transition-colors duration-150"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                {site.phone}
              </a>
              <a
                href={`mailto:${site.email}`}
                className="text-sm hover:text-white transition-colors duration-150"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                {site.email}
              </a>
            </div>
          </div>

          {/* Block 2 — Explore links (Give lives here only) */}
          <div className="lg:col-span-3">
            <FooterHeading>Explore</FooterHeading>
            <ul className="flex flex-col gap-3">
              {[
                { label: "About", href: "/about/" },
                { label: "Locations", href: "/locations/" },
                { label: "Messages", href: "/messages/" },
                { label: "Watch Live", href: "/watch/" },
                { label: "Counseling", href: "/counseling/" },
                { label: "Connect", href: "/connect/" },
                { label: "Plan a Visit", href: "/visit/" },
                { label: "Give", href: "/give/" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors duration-150"
                    style={{ color: "rgba(255,255,255,0.65)" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Block 3 — Both campuses */}
          <div className="lg:col-span-2 w-full max-w-xs lg:max-w-none">
            <FooterHeading>Campuses</FooterHeading>
            <div className="mb-6">
              <p
                className="text-sm font-bold mb-1.5"
                style={{ color: "rgba(255,255,255,0.90)" }}
              >
                Hays
              </p>
              <address
                className="not-italic text-sm leading-snug mb-2"
                style={{ color: "rgba(255,255,255,0.48)" }}
              >
                {site.address.street}
                <br />
                {site.address.city}, {site.address.state} {site.address.zip}
              </address>
              <div
                className="text-sm space-y-0.5"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                <p>Sat 5:00 PM</p>
                <p>Sun 8 · 9:30 · 11 AM</p>
              </div>
            </div>

            <div>
              <p
                className="text-sm font-bold mb-1.5"
                style={{ color: "rgba(255,255,255,0.90)" }}
              >
                Colby
              </p>
              <address
                className="not-italic text-sm leading-snug mb-2"
                style={{ color: "rgba(255,255,255,0.48)" }}
              >
                1923 S Range
                <br />
                Colby, KS 67701
              </address>
              <div
                className="text-sm"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                <p>Sun 10:00 AM</p>
              </div>
            </div>
          </div>

          {/* Block 4 — Newsletter + social */}
          <div className="lg:col-span-3 w-full max-w-sm lg:max-w-none">
            <FooterHeading>Stay in the loop</FooterHeading>
            <p
              className="text-sm mb-5"
              style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.65 }}
            >
              Sermon notes and what&apos;s happening at C3 — in your inbox.
            </p>
            <NewsletterForm />

            {/* Social row — centered on mobile, left on desktop */}
            <div className="flex items-center justify-center lg:justify-start gap-3 mt-7">
              <SocialLink href={site.social.facebook} label="Facebook">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </SocialLink>
              <SocialLink href={site.social.instagram} label="Instagram">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </SocialLink>
              <SocialLink href={site.social.youtube} label="YouTube">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                  <polygon
                    points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"
                    fill="white"
                  />
                </svg>
              </SocialLink>
              <SocialLink href={site.social.vimeo} label="Vimeo">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polygon points="23 7 16 12 23 17 23 7" />
                  <rect width="15" height="14" x="1" y="5" rx="2" ry="2" />
                </svg>
              </SocialLink>
              <SocialLink href={site.social.podcast} label="Podcast">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 2a7 7 0 0 1 7 7v1a7 7 0 0 1-14 0V9a7 7 0 0 1 7-7zm0 2a5 5 0 0 0-5 5v1a5 5 0 0 0 10 0V9a5 5 0 0 0-5-5zM8 21h8m-4-4v4" />
                  <path d="M12 17v4M8 21h8" />
                </svg>
              </SocialLink>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar — stacked centered on mobile, three-col on desktop ── */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.10)",
          paddingTop: "2rem",
        }}
      >
        <div
          className="
            container-c3 pb-8 text-xs
            flex flex-col items-center gap-2
            md:flex-row md:items-center md:justify-between md:gap-4
          "
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

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-xs font-bold uppercase tracking-[0.16em] mb-5"
      style={{ color: "rgba(255,255,255,0.40)" }}
    >
      {children}
    </p>
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
