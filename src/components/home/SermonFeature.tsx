"use client";

import Image from "next/image";
import { tx, imgCss, type BtnStyle, type ImgStyle } from "@/lib/home-content";
import { assetPath } from "@/lib/asset-path";
import { btnCss } from "./Hero";

/**
 * SermonFeature — an addable "latest message" spotlight. Generic + editable:
 * the thumbnail is a `data-cms-img` region, all copy is `data-cms` text, and the
 * CTA is a standard editable button. Defaults read like a real weekend message so
 * a freshly-added block looks intentional.
 *
 * Variants:
 *   spotlight — (default) large image left, copy right
 *   split     — 50/50 with a dark copy panel
 */
export default function SermonFeature({
  text,
  img,
  btnStyle,
  variant,
}: {
  text?: Record<string, string>;
  img?: Record<string, ImgStyle>;
  btnStyle?: BtnStyle;
  variant?: string;
}) {
  const v = variant || "spotlight";
  const src = assetPath(text?.["sermon.image"] || "/images/gather.webp");

  const Media = (
    <div
      data-cms-img="sermon.image"
      style={{ position: "relative", flex: "1 1 460px", minWidth: 280, aspectRatio: "16 / 10", borderRadius: "var(--radius-md,1.25rem)", overflow: "hidden" }}
    >
      <Image src={src} alt="" fill sizes="(max-width:768px) 100vw, 50vw" style={{ objectFit: "cover", ...imgCss(img?.["sermon.image"]) }} />
      <span aria-hidden style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
        <span style={{ width: 74, height: 74, borderRadius: 999, background: "rgba(28,195,175,0.92)", display: "grid", placeItems: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.35)" }}>
          <span style={{ width: 0, height: 0, borderTop: "13px solid transparent", borderBottom: "13px solid transparent", borderLeft: "22px solid #042e29", marginLeft: 5 }} />
        </span>
      </span>
    </div>
  );

  const Copy = (
    <div style={{ flex: "1 1 380px", minWidth: 280, display: "flex", flexDirection: "column", justifyContent: "center", gap: "0.9rem" }}>
      <span data-cms="t:sermon-eyebrow" style={{ textTransform: "uppercase", letterSpacing: "0.2em", fontSize: "0.72rem", fontWeight: 700, color: "#1cc3af" }}
        dangerouslySetInnerHTML={{ __html: tx(text, "sermon-eyebrow", "This weekend&rsquo;s message") }} />
      <h2 data-cms="t:sermon-title" className="display-2 text-white" style={{ margin: 0, lineHeight: 1.05 }}
        dangerouslySetInnerHTML={{ __html: tx(text, "sermon-title", "The Way, the Truth &amp; the Life") }} />
      <p data-cms="t:sermon-meta" style={{ color: "#1cc3af", fontWeight: 600, margin: 0 }}
        dangerouslySetInnerHTML={{ __html: tx(text, "sermon-meta", "Pastor &bull; John 14 &bull; 38 min") }} />
      <p data-cms="t:sermon-body" className="body-lg" style={{ color: "rgba(255,255,255,0.72)", maxWidth: 520, margin: 0 }}
        dangerouslySetInnerHTML={{ __html: tx(text, "sermon-body", "Missed the weekend? Catch this message and every series on demand &mdash; anytime, anywhere.") }} />
      <a href={text?.["sermon.cta-href"] || "/messages/"} data-cms-link="sermon.cta" className="btn"
        style={btnCss(btnStyle) || { background: "#1cc3af", color: "#042e29", borderRadius: 999, fontWeight: 700, padding: "0.9rem 1.9rem", marginTop: "0.35rem", alignSelf: "flex-start" }}>
        <span data-cms-link-label>{text?.["sermon.cta-label"] || "Watch Now"}</span>
      </a>
    </div>
  );

  if (v === "split") {
    return (
      <section className="section" style={{ backgroundColor: "#1b1c1c", padding: 0 }}>
        <div style={{ display: "flex", flexWrap: "wrap", minHeight: "clamp(320px,42vw,520px)" }}>
          <div style={{ flex: "1 1 50%", position: "relative", minHeight: 260 }}>{Media}</div>
          <div style={{ flex: "1 1 50%", padding: "clamp(2rem,5vw,4.5rem)", display: "flex", background: "#252727" }}>{Copy}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="section" style={{ backgroundColor: "#1b1c1c" }}>
      <div className="container-c3" style={{ display: "flex", flexWrap: "wrap", gap: "clamp(1.5rem,4vw,3.5rem)", alignItems: "center" }}>
        {Media}
        {Copy}
      </div>
    </section>
  );
}
