"use client";

import * as Icons from "lucide-react";
import { tx, type IconStyle } from "@/lib/home-content";

/**
 * MinistriesGrid — an addable "there's a place for everyone" grid of ministry
 * tiles (Kids, Youth, Groups, Worship, …). Generic + editable: each tile's icon
 * is a `data-cms-icon` region and its title/blurb are `data-cms` text, so staff
 * swap glyphs and copy in place. Defaults read like a real church's ministries.
 *
 * Variants:
 *   grid — (default) responsive card grid
 *   list — compact two-column list rows
 */
export default function MinistriesGrid({
  text,
  icon,
  variant,
}: {
  text?: Record<string, string>;
  icon?: Record<string, IconStyle>;
  variant?: string;
}) {
  const v = variant || "grid";
  const tiles = [
    { k: "a", icon: "Baby", title: "C3 Kids", blurb: "Safe, fun, Bible-based environments for birth&ndash;5th grade." },
    { k: "b", icon: "Flame", title: "Students", blurb: "Middle &amp; high schoolers growing in faith and friendship." },
    { k: "c", icon: "Users", title: "Groups", blurb: "Do life together in a group that meets near you." },
    { k: "d", icon: "Music", title: "Worship", blurb: "Use your gifts on the worship and production teams." },
  ];
  const Glyph = ({ k, name }: { k: string; name: string }) => {
    const chosen = icon?.[`ministries.${k}`]?.name || name;
    const C = (Icons as unknown as Record<string, React.ComponentType<{ size?: number }>>)[chosen] || Icons.Square;
    return (
      <span data-cms-icon={`ministries.${k}`}
        style={{ display: "grid", placeItems: "center", width: 52, height: 52, borderRadius: "var(--radius,1rem)", background: icon?.[`ministries.${k}`]?.bg || "rgba(28,195,175,0.14)", color: icon?.[`ministries.${k}`]?.color || "#1cc3af" }}>
        <C size={26} />
      </span>
    );
  };

  const Head = (
    <div style={{ textAlign: "center", marginBottom: "clamp(2rem,5vw,3.25rem)" }}>
      <span data-cms="t:ministries-eyebrow" style={{ textTransform: "uppercase", letterSpacing: "0.2em", fontSize: "0.72rem", fontWeight: 700, color: "#1cc3af" }}
        dangerouslySetInnerHTML={{ __html: tx(text, "ministries-eyebrow", "Get involved") }} />
      <h2 data-cms="t:ministries-heading" className="display-2 text-white" style={{ margin: "0.6rem 0 0" }}
        dangerouslySetInnerHTML={{ __html: tx(text, "ministries-heading", "Find your people") }} />
    </div>
  );

  if (v === "list") {
    return (
      <section className="section" style={{ backgroundColor: "#1b1c1c" }}>
        <div className="container-c3">
          {Head}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "0.9rem" }}>
            {tiles.map((t) => (
              <div key={t.k} data-cms-bg={`tile:ministries.${t.k}`} style={{ display: "flex", gap: "1rem", alignItems: "center", background: "#252727", borderRadius: "var(--radius,1rem)", padding: "1rem 1.25rem", border: "1px solid rgba(255,255,255,0.06)" }}>
                <Glyph k={t.k} name={t.icon} />
                <div style={{ minWidth: 0 }}>
                  <span data-cms={`t:ministries-${t.k}-title`} style={{ display: "block", color: "#fff", fontWeight: 700, fontSize: "1.1rem" }} dangerouslySetInnerHTML={{ __html: tx(text, `ministries-${t.k}-title`, t.title) }} />
                  <span data-cms={`t:ministries-${t.k}-blurb`} style={{ display: "block", color: "rgba(255,255,255,0.7)" }} dangerouslySetInnerHTML={{ __html: tx(text, `ministries-${t.k}-blurb`, t.blurb) }} />
                </div>
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "clamp(1rem,3vw,1.75rem)" }}>
          {tiles.map((t) => (
            <div key={t.k} data-cms-bg={`tile:ministries.${t.k}`} style={{ background: "#252727", borderRadius: "var(--radius-md,1.25rem)", padding: "clamp(1.5rem,3vw,2rem)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ marginBottom: "1.1rem" }}><Glyph k={t.k} name={t.icon} /></div>
              <h3 data-cms={`t:ministries-${t.k}-title`} style={{ color: "#fff", fontWeight: 700, fontSize: "1.25rem", margin: "0 0 0.4rem" }} dangerouslySetInnerHTML={{ __html: tx(text, `ministries-${t.k}-title`, t.title) }} />
              <p data-cms={`t:ministries-${t.k}-blurb`} style={{ color: "rgba(255,255,255,0.7)", margin: 0 }} dangerouslySetInnerHTML={{ __html: tx(text, `ministries-${t.k}-blurb`, t.blurb) }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
