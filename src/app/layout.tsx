import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import EditBridge from "@/components/cms/EditBridge";
import SmoothScrollProvider from "@/providers/SmoothScrollProvider";
import { site } from "@/data/site";
import { assetPath } from "@/lib/asset-path";
import { getCMSGlobals } from "@/lib/cms";
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
  icons: {
    icon: assetPath("/brand/favicon.png"),
    apple: assetPath("/brand/logo.png"),
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Church",
  name: site.name,
  alternateName: site.short,
  description: site.mission,
  url: "https://celebratejesus.org",
  telephone: site.phone,
  email: site.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressRegion: site.address.state,
    postalCode: site.address.zip,
    addressCountry: "US",
  },
  sameAs: [
    site.social.facebook,
    site.social.instagram,
    site.social.youtube,
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch shared (footer/header/nav) overrides once and feed both bars.
  const globals = (await getCMSGlobals()) || {};
  return (
    <html lang="en" suppressHydrationWarning className={hankenGrotesk.variable}>
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {/* v3 (R4): global element backgrounds (footer, etc.) → one scoped stylesheet,
            painted from the shared globals overrides (buildBgCss, !important). */}
        {globals.bgFill && Object.keys(globals.bgFill).length > 0 && (
          <style dangerouslySetInnerHTML={{ __html: buildBgCss([], globals.bgFill) }} />
        )}
        {/* On-page editor bridge — mounted globally so EVERY page (not just Home)
            is click-to-edit when loaded in C3 Studio with ?cmsEdit=1. */}
        <EditBridge />
        <SmoothScrollProvider>
          <Header globals={globals} />
          <main>{children}</main>
          <Footer globals={globals} />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
