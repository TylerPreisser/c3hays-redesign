"use client";

import { tx } from "@/lib/home-content";

/**
 * ScriptureVerse — an addable "verse of the moment" block. Generic + editable: the
 * verse text and reference are `data-cms` regions. Pairs naturally with the NT26
 * reading plan. Defaults use a well-known passage so a freshly-added block looks
 * intentional.
 *
 * Variants:
 *   centered — (default) large centered verse on charcoal
 *   left     — editorial left-aligned with a teal accent bar
 */
export default function ScriptureVerse({
  text,
  variant,
}: {
  text?: Record<string, string>;
  variant?: string;
}) {
  const v = variant || "centered";
  const verse = "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.";
  const ref = "John 3:16";

  if (v === "left") {
    return (
      <section className="section" style={{ backgroundColor: "#1b1c1c" }}>
        <div className="container-c3" style={{ maxWidth: 900 }}>
          <div aria-hidden style={{ width: "4rem", height: 4, backgroundColor: "#1cc3af", borderRadius: 4, marginBottom: "2rem" }} />
          <p data-cms="t:scripture-verse" style={{ color: "#fff", fontSize: "clamp(1.75rem,4.5vw,3rem)", fontWeight: 600, lineHeight: 1.3, margin: "0 0 1.5rem", letterSpacing: "-0.01em" }}
            dangerouslySetInnerHTML={{ __html: tx(text, "scripture-verse", verse) }} />
          <span data-cms="t:scripture-ref" style={{ color: "#1cc3af", fontWeight: 700, fontSize: "1.1rem", letterSpacing: "0.02em" }} dangerouslySetInnerHTML={{ __html: tx(text, "scripture-ref", ref) }} />
        </div>
      </section>
    );
  }

  return (
    <section className="section" style={{ backgroundColor: "#252727", textAlign: "center" }}>
      <div className="container-c3" style={{ maxWidth: 860 }}>
        <p data-cms="t:scripture-verse" className="text-balance" style={{ color: "#fff", fontSize: "clamp(1.75rem,4.5vw,3.25rem)", fontWeight: 600, lineHeight: 1.3, margin: "0 0 1.5rem", letterSpacing: "-0.015em" }}
          dangerouslySetInnerHTML={{ __html: tx(text, "scripture-verse", verse) }} />
        <span data-cms="t:scripture-ref" style={{ display: "inline-block", color: "#1cc3af", fontWeight: 700, fontSize: "1.15rem", letterSpacing: "0.08em", textTransform: "uppercase" }} dangerouslySetInnerHTML={{ __html: tx(text, "scripture-ref", ref) }} />
      </div>
    </section>
  );
}
