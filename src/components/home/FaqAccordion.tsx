"use client";

import { tx } from "@/lib/home-content";

/**
 * FaqAccordion — an addable "common questions" section. Uses native <details>/
 * <summary> so it works with zero JS (and stays static-export safe). Generic +
 * editable: each question and answer is a `data-cms` text region. Defaults answer
 * the real questions a first-time church guest asks.
 *
 * Variants:
 *   list  — (default) single-column stacked accordion
 *   split — intro copy on the left, questions on the right
 */
export default function FaqAccordion({
  text,
  variant,
}: {
  text?: Record<string, string>;
  variant?: string;
}) {
  const v = variant || "list";
  const faqs = [
    { k: "a", q: "What should I wear?", a: "Come as you are &mdash; you&rsquo;ll see everything from jeans to Sunday best. There&rsquo;s no dress code here." },
    { k: "b", q: "What about my kids?", a: "C3 Kids runs during every service with safe, fun, age-specific environments for birth through 5th grade." },
    { k: "c", q: "How long is a service?", a: "About 70 minutes &mdash; worship, a practical message from the Bible, and a chance to connect." },
    { k: "d", q: "Where do I park?", a: "Look for our team in bright vests &mdash; they&rsquo;ll point you to guest parking right by the main entrance." },
  ];

  const Item = ({ k, q, a }: { k: string; q: string; a: string }) => (
    <details style={{ background: "#252727", borderRadius: "var(--radius,1rem)", border: "1px solid rgba(255,255,255,0.06)", padding: "1rem 1.25rem" }}>
      <summary style={{ color: "#fff", fontWeight: 700, fontSize: "1.05rem", cursor: "pointer", listStyle: "none", display: "flex", justifyContent: "space-between", gap: "1rem" }}>
        <span data-cms={`t:faq-${k}-q`} dangerouslySetInnerHTML={{ __html: tx(text, `faq-${k}-q`, q) }} />
        <span aria-hidden style={{ color: "#1cc3af", flex: "0 0 auto" }}>+</span>
      </summary>
      <p data-cms={`t:faq-${k}-a`} style={{ color: "rgba(255,255,255,0.72)", margin: "0.75rem 0 0", lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: tx(text, `faq-${k}-a`, a) }} />
    </details>
  );

  const list = (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {faqs.map((f) => <Item key={f.k} k={f.k} q={f.q} a={f.a} />)}
    </div>
  );

  if (v === "split") {
    return (
      <section className="section" style={{ backgroundColor: "#1b1c1c" }}>
        <div className="container-c3" style={{ display: "flex", flexWrap: "wrap", gap: "clamp(1.75rem,4vw,3.5rem)" }}>
          <div style={{ flex: "1 1 300px" }}>
            <span data-cms="t:faq-eyebrow" style={{ textTransform: "uppercase", letterSpacing: "0.2em", fontSize: "0.72rem", fontWeight: 700, color: "#1cc3af" }}
              dangerouslySetInnerHTML={{ __html: tx(text, "faq-eyebrow", "First time here?") }} />
            <h2 data-cms="t:faq-heading" className="display-2 text-white" style={{ margin: "0.6rem 0 0.75rem" }}
              dangerouslySetInnerHTML={{ __html: tx(text, "faq-heading", "Questions, answered") }} />
            <p data-cms="t:faq-intro" className="body-lg" style={{ color: "rgba(255,255,255,0.7)", maxWidth: 420 }}
              dangerouslySetInnerHTML={{ __html: tx(text, "faq-intro", "Everything you need to know before your first visit. Still curious? We&rsquo;d love to hear from you.") }} />
          </div>
          <div style={{ flex: "1 1 380px" }}>{list}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="section" style={{ backgroundColor: "#1b1c1c" }}>
      <div className="container-c3" style={{ maxWidth: 760 }}>
        <div style={{ textAlign: "center", marginBottom: "clamp(2rem,5vw,3rem)" }}>
          <span data-cms="t:faq-eyebrow" style={{ textTransform: "uppercase", letterSpacing: "0.2em", fontSize: "0.72rem", fontWeight: 700, color: "#1cc3af" }}
            dangerouslySetInnerHTML={{ __html: tx(text, "faq-eyebrow", "First time here?") }} />
          <h2 data-cms="t:faq-heading" className="display-2 text-white" style={{ margin: "0.6rem 0 0" }}
            dangerouslySetInnerHTML={{ __html: tx(text, "faq-heading", "Questions, answered") }} />
        </div>
        {list}
      </div>
    </section>
  );
}
