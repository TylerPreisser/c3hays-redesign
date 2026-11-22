import { plainText, telHref, mailHref, postalFromTyped } from "@/lib/contact-facts";
import { tx } from "@/lib/home-content";
import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import "./animations.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import EditBridge from "@/components/cms/EditBridge";
import FreeOffsetStyle from "@/components/cms/FreeOffsetStyle";
import RevealPlayer from "@/components/cms/RevealPlayer";
import SmoothScrollProvider from "@/providers/SmoothScrollProvider";
import { site } from "@/data/site";
import { assetPath } from "@/lib/asset-path";
import { headers } from "next/headers";
import { getGlobalsContent, getMenu, getDraftMark } from "@/lib/cms";
import { getAnnouncements, MAX_BANNERS } from "@/lib/announcements";
import { isCmsLive } from "@/lib/cms-live";
import { getServiceTimes } from "@/lib/service-times";
import { ServiceTimesProvider } from "@/providers/ServiceTimesProvider";
import { SignupConfigProvider } from "@/providers/SignupConfigProvider";
import { getTurnstileSiteKey } from "@/lib/signup-config";
import { buildBgCss } from "@/lib/backgrounds";
import { buildGoogleFontsHref } from "@/lib/fonts";

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hanken",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: {
    default: `${site.name} | ${site.tagline}`,
    template: `%s | ${site.short} Hays`,
  },
  description: site.mission,
  metadataBase: new URL("https://celebratejesus.org"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://celebratejesus.org",
    siteName: site.name,
    title: `${site.name} | ${site.tagline}`,
    description: site.mission,
    images: [
      {
        url: assetPath("/images/hero-2.webp"),
        width: 1200,
        height: 630,
        alt: `${site.name} congregation`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | ${site.tagline}`,
    description: site.mission,
  },
  // Favicon/app icons come from the app-dir file convention (src/app/favicon.ico +
  // icon.png + apple-icon.png — the C3 monogram badge), so Next emits correct,
  // basePath-aware <link> tags and /favicon.ico is served. No manual icons here.
};

/** The church's structured data. Phone, email and the Hays address follow what staff typed in the footer, so a visible number never disagrees with it. */
function jsonLdFor(text: Record<string, string>) {
  const phone = plainText(tx(text, "footer-phone-label", site.phone));
  const email = plainText(tx(text, "footer-email-label", site.email));
  const typedAddr = text["footer-campus-hays-addr"] ? postalFromTyped(tx(text, "footer-campus-hays-addr", "")) : null;
  return {
    "@context": "https://schema.org",
    "@type": "Church",
    name: site.name,
    alternateName: site.short,
    description: site.mission,
    url: "https://celebratejesus.org",
    telephone: telHref(phone, site.phone).slice(4),
    email: mailHref(email, site.email).slice(7),
    address: {
      "@type": "PostalAddress",
      streetAddress: typedAddr?.streetAddress ?? site.address.street,
      addressLocality: typedAddr?.addressLocality ?? site.address.city,
      addressRegion: typedAddr?.addressRegion ?? site.address.state,
      postalCode: typedAddr?.postalCode ?? site.address.zip,
      addressCountry: "US",
    },
    sameAs: [
      site.social.facebook,
      site.social.instagram,
      site.social.youtube,
    ],
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch shared (footer/header/nav) overrides once and feed both bars.
  // In edit mode the canvas carries the editor's preview token (handed over by src/proxy.ts): the header, footer and
  // menu are then read from the DRAFT too, so the canvas shows draft words everywhere. A static export has no request
  // to read, so the headers are touched only by the live server build.
  let preview: string | undefined;
  let pathname = "/";
  if (isCmsLive()) {
    const h = await headers();
    preview = h.get("x-c3-preview") || undefined;
    pathname = h.get("x-c3-path") || "/";
  }
  const [globalsRaw, menu, draft, announcements] = await Promise.all([getGlobalsContent(preview), getMenu(preview), getDraftMark(preview, pathname), getAnnouncements()]);
  const globals = globalsRaw || {};
  const serviceTimes = await getServiceTimes();
  return (
    <html lang="en" suppressHydrationWarning className={hankenGrotesk.variable} data-cms-draft={draft.mark} data-cms-asof={draft.asOf}>
      <head>
        {/* Font library — selectable in the C3 Studio editor; loaded so the live
            site renders whatever font staff choose. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* v6 R7: the href is GENERATED from the shared FONT_CATALOG, so the fonts
            the editor offers and the fonts the site loads can never drift apart. */}
        <link href={buildGoogleFontsHref()} rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFor(globals.text || {})).replace(/</g, "\\u003c") }}
        />
      </head>
      <body>
        {/* v3 (R4): global element backgrounds (footer, etc.) → one scoped stylesheet,
            painted from the shared globals overrides (buildBgCss, !important). */}
        {globals.bgFill && Object.keys(globals.bgFill).length > 0 && (
          <style dangerouslySetInnerHTML={{ __html: buildBgCss([], globals.bgFill) }} />
        )}
        {/* Drag-anywhere: offsets for GLOBAL elements (footer/header/nav), applied on
            every page as a transform:translate stylesheet (preview + published). */}
        <FreeOffsetStyle offsets={globals.freeOffsets} />
        {/* On-page editor bridge — mounted globally so EVERY page (not just Home)
            is click-to-edit when loaded in C3 Studio with ?cmsEdit=1. */}
        <EditBridge />
        {/* v6 R6 (6b): entrance-reveal player for global elements (footer/header).
            Home-page element reveals feed content.anim into a RevealPlayer in page.tsx. */}
        <RevealPlayer anim={globals.anim} />
        <ServiceTimesProvider value={serviceTimes}>
          <SignupConfigProvider turnstileSiteKey={getTurnstileSiteKey()}>
            <SmoothScrollProvider>
              <a href="#main" className="skip-link">Skip to main content</a>
              <Header globals={globals} menu={menu.items} announcements={announcements.slice(0, MAX_BANNERS)} />
              <main id="main" tabIndex={-1}>{children}</main>
              <Footer globals={globals} menu={menu.items} />
            </SmoothScrollProvider>
          </SignupConfigProvider>
        </ServiceTimesProvider>
      </body>
    </html>
  );
}
