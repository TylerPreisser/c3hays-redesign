"use client";

import * as Icons from "lucide-react";
import { tx, type IconStyle } from "@/lib/home-content";

/**
 * NextSteps — an addable "your next step at C3" path. Generic + editable: each
 * step's icon is a `data-cms-icon` region and its title/blurb are `data-cms` text.
 * Defaults describe the real first-time-guest journey (Visit → Connect → Grow →
 * Serve) so a freshly-added block looks intentional.
 *
 * Variants:
 *   steps — (default) numbered horizontal path
 *   cards — four equal action cards
 */
export default function NextSteps({
  text,
  icon,
  variant,
}: {
  text?: Record<string, string>;
  icon?: Record<string, IconStyle>;
  variant?: string;
}) {
  const v = variant || "steps";
  const steps = [
    { k: "a", icon: "MapPin", title: "Visit", blurb: "Join us this weekend &mdash; we&rsquo;ll save you a seat." },
    { k: "b", icon: "Hand", title: "Connect", blurb: "Say hello at the Welcome Center after any service." },
    { k: "c", icon: "Users", title: "Grow", blurb: "Join a group and do life with others." },
    { k: "d", icon: "Heart", title: "Serve", blurb: "Use your gifts to make a difference." },
  ];
  const Glyph = ({ k, name }: { k: string; name: string }) => {
    const chosen = icon?.[`nextSteps.${k}`]?.name || name;
    const C = (Icons as unknown as Record<string, React.ComponentType<{ size?: number }>>)[chosen] || Icons.Square;
    return (
      <span data-cms-icon={`nextSteps.${k}`} style={{ display: "grid", placeItems: "center", width: 56, height: 56, borderRadius: 999, background: icon?.[`nextSteps.${k}`]?.bg || "#1cc3af", color: icon?.[`nextSteps.${k}`]?.color || "#042e29" }}>
        <C size={26} />
      </span>
    );
  };

  const Head = (
    <div style={{ textAlign: "center", marginBottom: "clamp(2rem,5vw,3.25rem)" }}>
      <span data-cms="t:nextSteps-eyebrow" style={{ textTransform: "uppercase", letterSpacing: "0.2em", fontSize: "0.72rem", fontWeight: 700, color: "#1cc3af" }}
        dangerouslySetInnerHTML={{ __html: tx(text, "nextSteps-eyebrow", "Not sure where to start?") }} />
      <h2 data-cms="t:nextSteps-heading" className="display-2 text-white" style={{ margin: "0.6rem 0 0" }}
        dangerouslySetInnerHTML={{ __html: tx(text, "nextSteps-heading", "Your next step") }} />
    </div>
  );

  if (v === "cards") {
    return (
      <section className="section" style={{ backgroundColor: "#1b1c1c" }}>
        <div className="container-c3">
          {Head}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "clamp(1rem,3vw,1.75rem)" }}>
            {steps.map((s) => (
              <div key={s.k} style={{ textAlign: "center", background: "#252727", borderRadius: "var(--radius-md,1.25rem)", padding: "clamp(1.75rem,3vw,2.25rem)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.1rem" }}><Glyph k={s.k} name={s.icon} /></div>
                <h3 data-cms={`t:nextSteps-${s.k}-title`} style={{ color: "#fff", fontWeight: 700, fontSize: "1.2rem", margin: "0 0 0.4rem" }} dangerouslySetInnerHTML={{ __html: tx(text, `nextSteps-${s.k}-title`, s.title) }} />
                <p data-cms={`t:nextSteps-${s.k}-blurb`} style={{ color: "rgba(255,255,255,0.7)", margin: 0 }} dangerouslySetInnerHTML={{ __html: tx(text, `nextSteps-${s.k}-blurb`, s.blurb) }} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section" style={{ backgroundColor: "#1b1c1c" }}>
      <div className="container-c3">
        {Head}
        {/* v7 R3: a genuine NUMBERED path — a small step index badge on each icon
            conveys the sequence cleanly; the old floating "→" (which poked out beside
            each icon and read unfinished) is gone. */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "clamp(1.75rem,4vw,3rem)" }}>
          {steps.map((s, i) => (
            <div key={s.k} style={{ position: "relative", flex: "1 1 190px", maxWidth: 236, textAlign: "center" }}>
              <div style={{ position: "relative", display: "inline-flex", justifyContent: "center", marginBottom: "1.2rem" }}>
                <Glyph k={s.k} name={s.icon} />
                <span aria-hidden style={{ position: "absolute", top: -6, right: -6, minWidth: 22, height: 22, padding: "0 5px", borderRadius: 999, background: "#1b1c1c", border: "1.5px solid #1cc3af", color: "#1cc3af", fontSize: "0.72rem", fontWeight: 800, display: "grid", placeItems: "center", lineHeight: 1 }}>{i + 1}</span>
              </div>
              <h3 data-cms={`t:nextSteps-${s.k}-title`} style={{ color: "#fff", fontWeight: 700, fontSize: "1.25rem", letterSpacing: "-0.01em", margin: "0 0 0.45rem" }} dangerouslySetInnerHTML={{ __html: tx(text, `nextSteps-${s.k}-title`, s.title) }} />
              <p data-cms={`t:nextSteps-${s.k}-blurb`} style={{ color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: 1.6, maxWidth: 210, marginInline: "auto" }} dangerouslySetInnerHTML={{ __html: tx(text, `nextSteps-${s.k}-blurb`, s.blurb) }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
