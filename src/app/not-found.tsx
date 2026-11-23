import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { assetPath } from "@/lib/asset-path";
import { site } from "@/data/site";

// The browser tab and a screen reader must not call this the home page.
export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section
      className="relative flex items-center justify-center overflow-hidden"
      style={{ minHeight: "100dvh" }}
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src={assetPath("/images/hero-2.webp")}
          alt="C3 worship"
          fill
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "rgba(10,10,10,0.78)" }}
        />
      </div>

      <div className="relative z-10 container-c3 text-center py-20">
        <h1 className="display-1 text-white mb-5">Page not found</h1>
        <p className="body-lg mb-12 max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.65)" }}>
          That page doesn&apos;t exist, but you&apos;re still welcome here.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/" className="btn btn-primary btn-lg">
            Go Home
          </Link>
          <Link href="/visit/" className="btn btn-outline btn-lg">
            Plan a Visit
          </Link>
        </div>
        <p className="body-base mt-10" style={{ color: "rgba(255,255,255,0.78)" }}>
          Looking for a campus?{" "}
          <Link href="/locations/hays/" className="underline">Hays</Link>
          {" · "}
          <Link href="/locations/colby/" className="underline">Colby</Link>
          {" · "}
          <Link href="/search/" className="underline">Search the site</Link>
          {" · "}
          Call the office at <a href={`tel:${site.phone.replace(/\D/g, "")}`} className="underline">{site.phone}</a>
        </p>
      </div>
    </section>
  );
}
