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

  const Campus = ({ k, city, days }: { k: string; city: string; days: string }) => (
    <div
      style={{
        flex: "1 1 320px",
        background: "#1b1c1c",
        borderRadius: "var(--radius-md, 1.25rem)",
        padding: "clamp(1.75rem,4vw,2.75rem)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <span
        data-cms={`t:svc-${k}-city`}
        style={{ display: "block", color: "#1cc3af", fontWeight: 700, letterSpacing: "0.02em", fontSize: "clamp(1.3rem,3vw,1.9rem)", marginBottom: "0.6rem" }}
        dangerouslySetInnerHTML={{ __html: tx(text, `svc-${k}-city`, city) }}
      />
      <p
        data-cms={`t:svc-${k}-times`}
        className="body-lg"
        style={{ color: "rgba(255,255,255,0.78)", margin: 0, lineHeight: 1.6 }}
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
