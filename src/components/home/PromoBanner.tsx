"use client";

import Link from "next/link";
import { tx, type BtnStyle } from "@/lib/home-content";
import { btnCss } from "./Hero";

/**
 * PromoBanner — a premium, generic announcement band that C3 Studio can add,
 * reorder, hide, recolor, and edit inline. All copy lives in the generic `text`
 * override map (so it's editable on-page with no bespoke fields), and the CTA is
 * a standard editable button. Defaults read like a real church announcement so a
 * freshly-added banner looks intentional, not empty.
 *
 * Variants:
 *   band     — (default) current bold full-width band with glow
 *   split    — text on the left half / CTA on the right half, contrasting halves
 *   centered — everything centered, large headline, generous whitespace
 */
export default function PromoBanner({
  text,
  btnStyle,
  variant,
}: {
  text?: Record<string, string>;
  btnStyle?: BtnStyle;
  variant?: string;
}) {
  const v = variant || "band";

  /* ─── band (default — must match original markup exactly) ─── */
  if (v === "band") {
    return (
      <section
        className="section"
        style={{ backgroundColor: "var(--color-teal-deep, #042e29)", position: "relative", overflow: "hidden" }}
      >
        {/* soft brand glow */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(120% 100% at 85% 0%, rgba(28,195,175,0.28), transparent 60%)",
            pointerEvents: "none",
          }}
        />
        <div
          className="container-c3"
          style={{
            position: "relative",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "clamp(1.25rem,4vw,3rem)",
            justifyContent: "space-between",
          }}
        >
          <div style={{ maxWidth: 720, minWidth: 280 }}>
            <span
              data-cms="t:promo-eyebrow"
              style={{
                display: "inline-block",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                fontSize: "0.72rem",
                fontWeight: 700,
                color: "#1cc3af",
                marginBottom: "0.8rem",
              }}
              dangerouslySetInnerHTML={{ __html: tx(text, "promo-eyebrow", "Don&rsquo;t miss it") }}
            />
            <h2
              data-cms="t:promo-heading"
              className="display-2 text-white"
              style={{ margin: "0 0 0.9rem", lineHeight: 1.05 }}
              dangerouslySetInnerHTML={{ __html: tx(text, "promo-heading", "Something new is happening at C3.") }}
            />
            <p
              data-cms="t:promo-body"
              className="body-lg"
              style={{ color: "rgba(255,255,255,0.72)", maxWidth: 560 }}
              dangerouslySetInnerHTML={{
                __html: tx(
                  text,
                  "promo-body",
                  "Add your event, series, or seasonal announcement here. Click any text to edit it, and use the button to point people where they need to go."
                ),
              }}
            />
          </div>
          <Link
            href={text?.["promo.cta-href"] || "/connect/"}
            data-cms-link="promo.cta"
            className="btn"
            style={
              btnCss(btnStyle) || {
                background: "#1cc3af",
                color: "#042e29",
                borderRadius: 999,
                fontWeight: 700,
                padding: "0.9rem 1.8rem",
              }
            }
          >
            <span data-cms-link-label>{text?.["promo.cta-label"] || "Learn more"}</span>
          </Link>
        </div>
      </section>
    );
  }

  /* ─── split — text left half / CTA right half, contrasting halves ─── */
  if (v === "split") {
    return (
      <section
        className="section"
        style={{ backgroundColor: "#1b1c1c", position: "relative", overflow: "hidden", padding: 0 }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            minHeight: "clamp(200px,28vw,360px)",
          }}
        >
          {/* Left half — charcoal, copy */}
          <div
            style={{
              flex: "1 1 55%",
              backgroundColor: "#1b1c1c",
              padding: "clamp(2.5rem,5vw,4.5rem) clamp(1.5rem,4vw,4rem)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "0.75rem",
            }}
          >
            <span
              data-cms="t:promo-eyebrow"
              style={{
                display: "inline-block",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                fontSize: "0.72rem",
                fontWeight: 700,
                color: "#1cc3af",
              }}
              dangerouslySetInnerHTML={{ __html: tx(text, "promo-eyebrow", "Don&rsquo;t miss it") }}
            />
            <h2
              data-cms="t:promo-heading"
              className="display-2 text-white"
              style={{ margin: 0, lineHeight: 1.05 }}
              dangerouslySetInnerHTML={{ __html: tx(text, "promo-heading", "Something new is happening at C3.") }}
            />
            <p
              data-cms="t:promo-body"
              className="body-lg"
              style={{ color: "rgba(255,255,255,0.68)", maxWidth: 520, margin: "0.25rem 0 0" }}
              dangerouslySetInnerHTML={{
                __html: tx(
                  text,
                  "promo-body",
                  "Add your event, series, or seasonal announcement here. Click any text to edit it, and use the button to point people where they need to go."
                ),
              }}
            />
          </div>

          {/* Right half — teal, CTA */}
          <div
            style={{
              flex: "1 1 45%",
              backgroundColor: "#1cc3af",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "clamp(2.5rem,5vw,4.5rem) clamp(1.5rem,4vw,3rem)",
              gap: "1.5rem",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* subtle radial highlight */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                background: "radial-gradient(80% 80% at 60% 30%, rgba(255,255,255,0.18), transparent 70%)",
                pointerEvents: "none",
              }}
            />
            <p
              style={{
                color: "#042e29",
                fontWeight: 700,
                fontSize: "clamp(1rem,2vw,1.2rem)",
                textAlign: "center",
                maxWidth: 280,
                margin: 0,
                lineHeight: 1.3,
                position: "relative",
              }}
            >
              Ready to take the next step?
            </p>
            <Link
              href={text?.["promo.cta-href"] || "/connect/"}
              data-cms-link="promo.cta"
              className="btn"
              style={
                btnCss(btnStyle) || {
                  background: "#042e29",
                  color: "#1cc3af",
                  borderRadius: 999,
                  fontWeight: 700,
                  padding: "0.9rem 2rem",
                  position: "relative",
                  whiteSpace: "nowrap",
                }
              }
            >
              <span data-cms-link-label>{text?.["promo.cta-label"] || "Learn more"}</span>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  /* ─── centered — everything centered, big headline, generous whitespace ─── */
  return (
    <section
      className="section"
      style={{
        backgroundColor: "var(--color-teal-deep, #042e29)",
        position: "relative",
        overflow: "hidden",
        padding: "clamp(4rem,8vw,8rem) 1.5rem",
      }}
    >
      {/* ambient glow rings */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(70% 70% at 50% 50%, rgba(28,195,175,0.22), transparent 65%), radial-gradient(40% 40% at 50% 100%, rgba(28,195,175,0.12), transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        className="container-c3"
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "clamp(1rem,3vw,1.75rem)",
        }}
      >
        <span
          data-cms="t:promo-eyebrow"
          style={{
            display: "inline-block",
            textTransform: "uppercase",
            letterSpacing: "0.22em",
            fontSize: "0.72rem",
            fontWeight: 700,
            color: "#1cc3af",
            borderBottom: "1.5px solid rgba(28,195,175,0.35)",
            paddingBottom: "0.3rem",
          }}
          dangerouslySetInnerHTML={{ __html: tx(text, "promo-eyebrow", "Don&rsquo;t miss it") }}
        />
        <h2
          data-cms="t:promo-heading"
          className="display-1 text-white"
          style={{ margin: 0, lineHeight: 1.02, maxWidth: "18ch" }}
          dangerouslySetInnerHTML={{ __html: tx(text, "promo-heading", "Something new is happening at C3.") }}
        />
        <p
          data-cms="t:promo-body"
          className="body-lg"
          style={{ color: "rgba(255,255,255,0.70)", maxWidth: 560, margin: 0 }}
          dangerouslySetInnerHTML={{
            __html: tx(
              text,
              "promo-body",
              "Add your event, series, or seasonal announcement here. Click any text to edit it, and use the button to point people where they need to go."
            ),
          }}
        />
        <Link
          href={text?.["promo.cta-href"] || "/connect/"}
          data-cms-link="promo.cta"
          className="btn"
          style={
            btnCss(btnStyle) || {
              background: "#1cc3af",
              color: "#042e29",
              borderRadius: 999,
              fontWeight: 700,
              padding: "1rem 2.2rem",
              marginTop: "0.5rem",
            }
          }
        >
          <span data-cms-link-label>{text?.["promo.cta-label"] || "Learn more"}</span>
        </Link>
      </div>
    </section>
  );
}
