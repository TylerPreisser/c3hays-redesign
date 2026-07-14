"use client";

import { tx } from "@/lib/home-content";
import { bleedBg } from "@/lib/section-bleed";

/**
 * Testimonial — an addable "story from our church family" quote block. Generic +
 * editable: the quote and attribution are `data-cms` text regions. Defaults read
 * like a real member story so a freshly-added block looks intentional.
 *
 * Variants:
 *   centered — (default) large centered quote on dark
 *   panel    — quote inside a teal-accented card
 */
export default function Testimonial({
  text,
  variant,
}: {
  text?: Record<string, string>;
  variant?: string;
}) {
  const v = variant || "centered";
  const quote = "C3 is where our family found a home. We walked in as strangers and left knowing we belonged.";
  const name = "The Andersons";
  const detail = "Members since 2021";

  if (v === "panel") {
    return (
      <section className="section" style={{ background: bleedBg("#252727") }}>
        <div className="container-c3" style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ maxWidth: 720, width: "100%", background: "#1b1c1c", border: "2px solid #1cc3af", borderRadius: "var(--radius-md,1.25rem)", padding: "clamp(2.25rem,5vw,3.5rem)", textAlign: "center" }}>
            <span aria-hidden style={{ display: "block", color: "#1cc3af", fontSize: "3rem", lineHeight: 1, fontWeight: 800, marginBottom: "0.5rem" }}>&ldquo;</span>
            <p data-cms="t:testimonial-quote" style={{ color: "#fff", fontSize: "clamp(1.35rem,3vw,1.85rem)", fontWeight: 600, lineHeight: 1.4, margin: "0 0 1.5rem" }}
              dangerouslySetInnerHTML={{ __html: tx(text, "testimonial-quote", quote) }} />
            <span data-cms="t:testimonial-name" style={{ display: "block", color: "#1cc3af", fontWeight: 700 }} dangerouslySetInnerHTML={{ __html: tx(text, "testimonial-name", name) }} />
            <span data-cms="t:testimonial-detail" style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "0.9rem" }} dangerouslySetInnerHTML={{ __html: tx(text, "testimonial-detail", detail) }} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section" style={{ background: bleedBg("#1b1c1c"), textAlign: "center" }}>
      <div className="container-c3" style={{ maxWidth: 860 }}>
        <p className="overline" style={{ color: "#1cc3af", marginBottom: "var(--s-6, 24px)" }}>From our church family</p>
        <span aria-hidden style={{ display: "block", color: "#1cc3af", fontSize: "clamp(3rem,7vw,5rem)", lineHeight: 0.8, fontWeight: 800, marginBottom: "1rem" }}>&ldquo;</span>
        <p data-cms="t:testimonial-quote" className="text-balance" style={{ color: "#fff", fontSize: "clamp(1.6rem,4vw,2.6rem)", fontWeight: 600, lineHeight: 1.3, margin: "0 0 1.75rem", letterSpacing: "-0.01em" }}
          dangerouslySetInnerHTML={{ __html: tx(text, "testimonial-quote", quote) }} />
        <span data-cms="t:testimonial-name" style={{ display: "block", color: "#1cc3af", fontWeight: 700, fontSize: "1.05rem" }} dangerouslySetInnerHTML={{ __html: tx(text, "testimonial-name", name) }} />
        <span data-cms="t:testimonial-detail" style={{ display: "block", color: "rgba(255,255,255,0.6)" }} dangerouslySetInnerHTML={{ __html: tx(text, "testimonial-detail", detail) }} />
      </div>
    </section>
  );
}
