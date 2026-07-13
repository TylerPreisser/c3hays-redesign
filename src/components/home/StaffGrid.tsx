"use client";

import Image from "next/image";
import { tx, imgCss, type ImgStyle } from "@/lib/home-content";
import { assetPath } from "@/lib/asset-path";

/**
 * StaffGrid — an addable "meet the team" grid of leader cards. Generic + editable:
 * each portrait is a `data-cms-img` region and the name/role are `data-cms` text.
 * Defaults use existing site imagery so a freshly-added block is never broken.
 *
 * Variants:
 *   grid — (default) portrait cards in a responsive grid
 *   row  — a horizontal band of circular avatars
 */
export default function StaffGrid({
  text,
  img,
  variant,
}: {
  text?: Record<string, string>;
  img?: Record<string, ImgStyle>;
  variant?: string;
}) {
  const v = variant || "grid";
  const people = [
    { k: "a", name: "Lead Pastor", role: "Teaching &amp; Vision", image: "/images/congregation.webp" },
    { k: "b", name: "Worship Pastor", role: "Worship &amp; Arts", image: "/images/worship.webp" },
    { k: "c", name: "Family Pastor", role: "Kids &amp; Students", image: "/images/gather.webp" },
    { k: "d", name: "Connections", role: "Groups &amp; Care", image: "/images/exterior.webp" },
  ];

  const Head = (
    <div style={{ textAlign: "center", marginBottom: "clamp(2rem,5vw,3.25rem)" }}>
      <span data-cms="t:staff-eyebrow" style={{ textTransform: "uppercase", letterSpacing: "0.2em", fontSize: "0.72rem", fontWeight: 700, color: "#1cc3af" }}
        dangerouslySetInnerHTML={{ __html: tx(text, "staff-eyebrow", "Here to serve you") }} />
      <h2 data-cms="t:staff-heading" className="display-2 text-white" style={{ margin: "0.6rem 0 0" }}
        dangerouslySetInnerHTML={{ __html: tx(text, "staff-heading", "Meet the Team") }} />
    </div>
  );

  if (v === "row") {
    return (
      <section className="section" style={{ backgroundColor: "#1b1c1c" }}>
        <div className="container-c3">
          {Head}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(1.25rem,4vw,2.5rem)", justifyContent: "center" }}>
            {people.map((p) => (
              <div key={p.k} style={{ textAlign: "center", width: 150 }}>
                <div data-cms-img={`staff.${p.k}`} style={{ position: "relative", width: 120, height: 120, borderRadius: 999, overflow: "hidden", margin: "0 auto 0.85rem", border: "3px solid rgba(28,195,175,0.35)" }}>
                  <Image src={assetPath(text?.[`staff.${p.k}-image`] || p.image)} alt="" fill sizes="120px" style={{ objectFit: "cover", ...imgCss(img?.[`staff.${p.k}`]) }} />
                </div>
                <span data-cms={`t:staff-${p.k}-name`} style={{ display: "block", color: "#fff", fontWeight: 700 }} dangerouslySetInnerHTML={{ __html: tx(text, `staff-${p.k}-name`, p.name) }} />
                <span data-cms={`t:staff-${p.k}-role`} style={{ display: "block", color: "#1cc3af", fontSize: "0.85rem" }} dangerouslySetInnerHTML={{ __html: tx(text, `staff-${p.k}-role`, p.role) }} />
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
          {people.map((p) => (
            <div key={p.k} style={{ background: "#252727", borderRadius: "var(--radius-md,1.25rem)", overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div data-cms-img={`staff.${p.k}`} style={{ position: "relative", aspectRatio: "1 / 1" }}>
                <Image src={assetPath(text?.[`staff.${p.k}-image`] || p.image)} alt="" fill sizes="(max-width:768px) 50vw, 25vw" style={{ objectFit: "cover", ...imgCss(img?.[`staff.${p.k}`]) }} />
              </div>
              <div style={{ padding: "1.1rem 1.25rem" }}>
                <span data-cms={`t:staff-${p.k}-name`} style={{ display: "block", color: "#fff", fontWeight: 700, fontSize: "1.1rem" }} dangerouslySetInnerHTML={{ __html: tx(text, `staff-${p.k}-name`, p.name) }} />
                <span data-cms={`t:staff-${p.k}-role`} style={{ display: "block", color: "#1cc3af", fontSize: "0.9rem" }} dangerouslySetInnerHTML={{ __html: tx(text, `staff-${p.k}-role`, p.role) }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
