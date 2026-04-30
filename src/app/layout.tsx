import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SmoothScrollProvider from "@/providers/SmoothScrollProvider";
import { site } from "@/data/site";

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hanken",
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bricolage",
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
    <html lang="en" suppressHydrationWarning className={`${hankenGrotesk.variable} ${bricolage.variable}`}>
      <head>
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
