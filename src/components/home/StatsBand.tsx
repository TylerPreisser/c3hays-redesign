"use client";

import { tx } from "@/lib/home-content";
import { bleedBg } from "@/lib/section-bleed";

/**
 * StatsBand — an addable "God is at work" impact-numbers band. Generic + editable:
 * every figure and label is a `data-cms` text region. Defaults read like a real
 * church's yearly snapshot so a freshly-added block looks intentional.
 *
 * Variants:
 *   band  — (default) teal-deep band, figures inline
 *   cards — figures in separate charcoal cards
 */
export default function StatsBand({
  text,
  variant,
}: {
  text?: Record<string, string>;
  variant?: string;
}) {
  const v = variant || "band";
  const stats = [
    { k: "a", figure: "2", label: "Campuses &mdash; Hays &amp; Colby" },
    { k: "b", figure: "1,200+", label: "Gathering each weekend" },
    { k: "c", figure: "40+", label: "Small groups" },
    { k: "d", figure: "150", label: "Serving on a team" },
  ];

  if (v === "cards") {
    return (
      <section className="section" style={{ background: bleedBg("#1b1c1c") }}>
        <div className="container-c3">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "clamp(1rem,3vw,1.75rem)" }}>
            {stats.map((s) => (
              <div key={s.k} style={{ textAlign: "center", background: "#252727", borderRadius: "var(--radius-md,1.25rem)", padding: "clamp(1.75rem,4vw,2.5rem) 1rem", border: "1px solid rgba(255,255,255,0.06)" }}>
                <span data-cms={`t:stats-${s.k}-figure`} style={{ display: "block", color: "#1cc3af", fontWeight: 800, fontSize: "clamp(2.25rem,5vw,3.25rem)", lineHeight: 1 }} dangerouslySetInnerHTML={{ __html: tx(text, `stats-${s.k}-figure`, s.figure) }} />
                <span data-cms={`t:stats-${s.k}-label`} style={{ display: "block", color: "rgba(255,255,255,0.72)", marginTop: "0.6rem" }} dangerouslySetInnerHTML={{ __html: tx(text, `stats-${s.k}-label`, s.label) }} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section" style={{ backgroundColor: "var(--color-teal-deep,#042e29)", position: "relative", overflow: "hidden" }}>
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 100% at 50% 0%, rgba(28,195,175,0.22), transparent 60%)", pointerEvents: "none" }} />
      <div className="container-c3" style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "clamp(1.5rem,4vw,2.5rem)", textAlign: "center" }}>
        {stats.map((s) => (
          <div key={s.k}>
            <span data-cms={`t:stats-${s.k}-figure`} style={{ display: "block", color: "#fff", fontWeight: 800, fontSize: "clamp(2.5rem,6vw,4rem)", lineHeight: 1 }} dangerouslySetInnerHTML={{ __html: tx(text, `stats-${s.k}-figure`, s.figure) }} />
            <span data-cms={`t:stats-${s.k}-label`} style={{ display: "block", color: "rgba(255,255,255,0.8)", marginTop: "0.6rem", fontWeight: 500 }} dangerouslySetInnerHTML={{ __html: tx(text, `stats-${s.k}-label`, s.label) }} />
          </div>
        ))}
      </div>
    </section>
  );
}
