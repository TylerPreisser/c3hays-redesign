import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SmoothScrollProvider from "@/providers/SmoothScrollProvider";
import { site } from "@/data/site";

// viewport-fit=cover enables env(safe-area-inset-*) for notched/Dynamic Island devices
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
        url: "/images/hero-2.webp",
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
    icon: "/brand/favicon.png",
    apple: "/brand/logo.png",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="/fonts/untitled-sans-regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/untitled-sans-medium.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <SmoothScrollProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
