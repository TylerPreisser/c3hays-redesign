import type { Metadata } from "next";
import Image from "next/image";
import { getCMSPage } from "@/lib/cms";
import { tx, imgCss } from "@/lib/home-content";
import { assetPath } from "@/lib/asset-path";
import ConnectClient from "./ConnectClient";

export const metadata: Metadata = {
  title: "Connect | C3 Hays",
  description:
    "Take your next step at C3 — new here, looking for community, want to serve, or just want to say hi. We'd love to hear from you.",
};

export default async function ConnectPage() {
  const ov = (await getCMSPage("/connect")) || {};
  const t = ov.text || {};
  const media = ov.media || {};

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section
        className="relative flex items-end overflow-hidden"
        style={{ minHeight: "56vh" }}
      >
        {/* Background image — CMS-swappable */}
        <div
          className="absolute inset-0"
          data-cms-img="connect-hero-bg"
          style={{ borderRadius: 0 }}
        >
          <Image
            src={assetPath(media["connect-hero-bg"] || "/images/congregation.webp")}
            alt="C3 congregation worshipping together"
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={imgCss(ov.img?.["connect-hero-bg"])}
          />
          {/* Dark base scrim */}
          <div
            className="absolute inset-0"
            style={{ background: "rgba(10,10,10,0.55)" }}
          />
          {/* Bottom-to-top gradient for text legibility */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.3) 55%, transparent 100%)",
            }}
          />
        </div>

        {/* Hero copy */}
        <div className="relative z-10 container-c3 pb-16 pt-44">
          {/* Eyebrow */}
          <p
            className="overline"
            style={{
              display: "inline-block",
              color: "var(--color-teal)",
              marginBottom: "1rem",
            }}
            data-cms="t:connect-hero-eyebrow"
            dangerouslySetInnerHTML={{
              __html: tx(t, "connect-hero-eyebrow", "C3 Church"),
            }}
          />
          <h1
            className="display-1 text-white"
            data-cms="t:connect-hero-heading"
            dangerouslySetInnerHTML={{
              __html: tx(t, "connect-hero-heading", "Let&rsquo;s connect."),
            }}
          />
          <p
            className="body-lg mt-4 max-w-xl"
            style={{ color: "rgba(255,255,255,0.72)" }}
            data-cms="t:connect-hero-body"
            dangerouslySetInnerHTML={{
              __html: tx(
                t,
                "connect-hero-body",
                "However you&rsquo;re arriving, there&rsquo;s a next step for you &mdash; and a real person ready to take it with you."
              ),
            }}
          />
        </div>
      </section>

      {/* ── Interactive sections (intent cards + form) ─────────── */}
      <ConnectClient text={t} />
    </>
  );
}
