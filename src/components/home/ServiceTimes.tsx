"use client";

import { tx, type BtnStyle } from "@/lib/home-content";
import { btnCss } from "./Hero";

/**
 * ServiceTimes — an addable, on-brand "when we gather" section. Generic + fully
 * editable: every line is a `data-cms` text region and the CTA is a standard
 * editable button, so a freshly-added block reads like a real church schedule
 * (Hays + Colby, Saturday & Sunday) and needs no bespoke CMS fields.
 *
 * Variants:
 *   cards    — (default) two campus cards side-by-side
 *   band     — single centered charcoal band with the times inline
 */
export default function ServiceTimes({
  text,
  btnStyle,
  variant,
}: {
  text?: Record<string, string>;
  btnStyle?: BtnStyle;
  variant?: string;
}) {
  const v = variant || "cards";

  // v7 R3: a world-class campus card — restrained color (teal as a top accent + a soft
  // icon badge, not a loud all-teal heading), a crisp white campus name, a hairline rule,
  // and generously-set times. The single editable regions (city / times) are unchanged.
  const Campus = ({ k, city, days }: { k: string; city: string; days: string }) => (
    <div
      style={{
        flex: "1 1 320px",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(180deg,#1f2121,#191a1a)",
        borderRadius: "var(--radius-md, 1.25rem)",
        padding: "clamp(1.9rem,4vw,2.75rem)",
        border: "1px solid rgba(255,255,255,0.09)",
        boxShadow: "0 1px 0 rgba(255,255,255,0.04) inset",
      }}
    >
      <span aria-hidden style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,#1cc3af,rgba(28,195,175,0))" }} />
      <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "1.15rem" }}>
        <span aria-hidden style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, display: "grid", placeItems: "center", background: "rgba(28,195,175,0.13)", border: "1px solid rgba(28,195,175,0.22)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1cc3af" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
        </span>
        <span
          data-cms={`t:svc-${k}-city`}
          style={{ display: "block", color: "#fff", fontWeight: 700, letterSpacing: "-0.01em", fontSize: "clamp(1.25rem,3vw,1.7rem)", lineHeight: 1.1 }}
          dangerouslySetInnerHTML={{ __html: tx(text, `svc-${k}-city`, city) }}
        />
      </div>
      <div aria-hidden style={{ height: 1, background: "rgba(255,255,255,0.08)", marginBottom: "1.1rem" }} />
      <p
        data-cms={`t:svc-${k}-times`}
        style={{ color: "rgba(255,255,255,0.82)", margin: 0, fontSize: "1.075rem", lineHeight: 2, letterSpacing: "0.005em" }}
        dangerouslySetInnerHTML={{ __html: tx(text, `svc-${k}-times`, days) }}
      />
    </div>
  );

  if (v === "band") {
    return (
      <section className="section" style={{ backgroundColor: "#1b1c1c", textAlign: "center" }}>
        <div className="container-c3" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
          <span data-cms="t:svc-eyebrow" style={{ textTransform: "uppercase", letterSpacing: "0.2em", fontSize: "0.72rem", fontWeight: 700, color: "#1cc3af" }}
            dangerouslySetInnerHTML={{ __html: tx(text, "svc-eyebrow", "Plan to join us") }} />
          <h2 data-cms="t:svc-heading" className="display-2 text-white" style={{ margin: 0 }}
            dangerouslySetInnerHTML={{ __html: tx(text, "svc-heading", "Service Times") }} />
          <p data-cms="t:svc-band-times" className="body-lg" style={{ color: "rgba(255,255,255,0.75)", maxWidth: 620, margin: 0 }}
            dangerouslySetInnerHTML={{ __html: tx(text, "svc-band-times", "Hays &mdash; Saturday 6:00pm &amp; Sunday 9:00 / 11:00am &nbsp;&bull;&nbsp; Colby &mdash; Sunday 10:00am") }} />
          <a href={text?.["svc.cta-href"] || "/visit/"} data-cms-link="svc.cta" className="btn"
            style={btnCss(btnStyle) || { background: "#1cc3af", color: "#042e29", borderRadius: 999, fontWeight: 700, padding: "0.9rem 1.9rem", marginTop: "0.5rem" }}>
            <span data-cms-link-label>{text?.["svc.cta-label"] || "Plan Your Visit"}</span>
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="section" style={{ backgroundColor: "#252727" }}>
      <div className="container-c3">
        <div style={{ textAlign: "center", marginBottom: "clamp(2rem,5vw,3.5rem)" }}>
          <span data-cms="t:svc-eyebrow" style={{ textTransform: "uppercase", letterSpacing: "0.2em", fontSize: "0.72rem", fontWeight: 700, color: "#1cc3af" }}
            dangerouslySetInnerHTML={{ __html: tx(text, "svc-eyebrow", "Plan to join us") }} />
          <h2 data-cms="t:svc-heading" className="display-2 text-white" style={{ margin: "0.6rem 0 0" }}
            dangerouslySetInnerHTML={{ __html: tx(text, "svc-heading", "Service Times") }} />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(1rem,3vw,1.75rem)", justifyContent: "center" }}>
          <Campus k="a" city="Hays Campus" days="Saturday &mdash; 6:00pm<br/>Sunday &mdash; 9:00 &amp; 11:00am" />
          <Campus k="b" city="Colby Campus" days="Sunday &mdash; 10:00am" />
        </div>
        <div style={{ textAlign: "center", marginTop: "clamp(2rem,4vw,3rem)" }}>
          <a href={text?.["svc.cta-href"] || "/visit/"} data-cms-link="svc.cta" className="btn"
            style={btnCss(btnStyle) || { background: "#1cc3af", color: "#042e29", borderRadius: 999, fontWeight: 700, padding: "0.9rem 1.9rem" }}>
            <span data-cms-link-label>{text?.["svc.cta-label"] || "Plan Your Visit"}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
