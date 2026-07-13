"use client";

import { tx, type BtnStyle } from "@/lib/home-content";
import { btnCss } from "./Hero";

/**
 * EventsStrip — an addable "what's coming up" section. Generic + editable: each
 * event row is a set of `data-cms` text regions, so staff edit the date / title /
 * detail in place with no bespoke fields. Defaults read like real church events.
 *
 * Variants:
 *   cards — (default) three event cards in a responsive grid
 *   list  — a stacked agenda-style list with date chips
 */
export default function EventsStrip({
  text,
  btnStyle,
  variant,
}: {
  text?: Record<string, string>;
  btnStyle?: BtnStyle;
  variant?: string;
}) {
  const v = variant || "cards";
  const events = [
    { k: "a", month: "JUL", day: "20", title: "Baptism Sunday", detail: "Both services &bull; Take your next step" },
    { k: "b", month: "JUL", day: "26", title: "Youth Summer Night", detail: "Fri 7:00pm &bull; Grades 6&ndash;12" },
    { k: "c", month: "AUG", day: "03", title: "Newcomers Lunch", detail: "After 11:00am &bull; Meet the team" },
  ];

  const Head = (
    <div style={{ textAlign: "center", marginBottom: "clamp(2rem,5vw,3.25rem)" }}>
      <span data-cms="t:events-eyebrow" style={{ textTransform: "uppercase", letterSpacing: "0.2em", fontSize: "0.72rem", fontWeight: 700, color: "#1cc3af" }}
        dangerouslySetInnerHTML={{ __html: tx(text, "events-eyebrow", "Mark your calendar") }} />
      <h2 data-cms="t:events-heading" className="display-2 text-white" style={{ margin: "0.6rem 0 0" }}
        dangerouslySetInnerHTML={{ __html: tx(text, "events-heading", "Upcoming Events") }} />
    </div>
  );

  const Cta = (
    <div style={{ textAlign: "center", marginTop: "clamp(2rem,4vw,3rem)" }}>
      <a href={text?.["events.cta-href"] || "/connect/"} data-cms-link="events.cta" className="btn"
        style={btnCss(btnStyle) || { background: "#1cc3af", color: "#042e29", borderRadius: 999, fontWeight: 700, padding: "0.9rem 1.9rem" }}>
        <span data-cms-link-label>{text?.["events.cta-label"] || "See All Events"}</span>
      </a>
    </div>
  );

  if (v === "list") {
    return (
      <section className="section" style={{ backgroundColor: "#1b1c1c" }}>
        <div className="container-c3" style={{ maxWidth: 780 }}>
          {Head}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
            {events.map((e) => (
              <div key={e.k} style={{ display: "flex", alignItems: "center", gap: "1.25rem", background: "#252727", borderRadius: "var(--radius,1rem)", padding: "1rem 1.25rem", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ flex: "0 0 auto", textAlign: "center", background: "#1cc3af", color: "#042e29", borderRadius: "var(--radius-sm,0.625rem)", padding: "0.5rem 0.75rem", minWidth: 60 }}>
                  <span data-cms={`t:events-${e.k}-month`} style={{ display: "block", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.08em" }} dangerouslySetInnerHTML={{ __html: tx(text, `events-${e.k}-month`, e.month) }} />
                  <span data-cms={`t:events-${e.k}-day`} style={{ display: "block", fontSize: "1.4rem", fontWeight: 800, lineHeight: 1 }} dangerouslySetInnerHTML={{ __html: tx(text, `events-${e.k}-day`, e.day) }} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <span data-cms={`t:events-${e.k}-title`} style={{ display: "block", color: "#fff", fontWeight: 700, fontSize: "1.1rem" }} dangerouslySetInnerHTML={{ __html: tx(text, `events-${e.k}-title`, e.title) }} />
                  <span data-cms={`t:events-${e.k}-detail`} style={{ display: "block", color: "rgba(255,255,255,0.7)" }} dangerouslySetInnerHTML={{ __html: tx(text, `events-${e.k}-detail`, e.detail) }} />
                </div>
              </div>
            ))}
          </div>
          {Cta}
        </div>
      </section>
    );
  }

  return (
    <section className="section" style={{ backgroundColor: "#1b1c1c" }}>
      <div className="container-c3">
        {Head}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "clamp(1rem,3vw,1.75rem)" }}>
          {events.map((e) => (
            <div key={e.k} style={{ background: "#252727", borderRadius: "var(--radius-md,1.25rem)", padding: "clamp(1.5rem,3vw,2rem)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", background: "#1cc3af", color: "#042e29", borderRadius: "var(--radius-sm,0.625rem)", padding: "0.5rem 0.85rem", marginBottom: "1rem" }}>
                <span data-cms={`t:events-${e.k}-month`} style={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.08em" }} dangerouslySetInnerHTML={{ __html: tx(text, `events-${e.k}-month`, e.month) }} />
                <span data-cms={`t:events-${e.k}-day`} style={{ fontSize: "1.6rem", fontWeight: 800, lineHeight: 1 }} dangerouslySetInnerHTML={{ __html: tx(text, `events-${e.k}-day`, e.day) }} />
              </div>
              <h3 data-cms={`t:events-${e.k}-title`} style={{ color: "#fff", fontWeight: 700, fontSize: "1.3rem", margin: "0 0 0.35rem" }} dangerouslySetInnerHTML={{ __html: tx(text, `events-${e.k}-title`, e.title) }} />
              <p data-cms={`t:events-${e.k}-detail`} style={{ color: "rgba(255,255,255,0.7)", margin: 0 }} dangerouslySetInnerHTML={{ __html: tx(text, `events-${e.k}-detail`, e.detail) }} />
            </div>
          ))}
        </div>
        {Cta}
      </div>
    </section>
  );
}
