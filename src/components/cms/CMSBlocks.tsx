/* eslint-disable @typescript-eslint/no-explicit-any -- CMS block content is dynamic, untyped JSON from C3 Studio; `any` is the pragmatic shape here. */
import type { ReactNode } from "react";
import type { CMSBlock } from "@/lib/cms";
import { assetPath } from "@/lib/asset-path";

/**
 * Renders C3 Studio content blocks using THIS site's design tokens (globals.css
 * @theme vars) and type scale, so CMS-driven sections look native to the site.
 * Server component (no hooks) — fetched live in dev for true back-and-forth.
 */

type Ctx = { sermons: any[]; events: any[]; locations: any[] };
const img = (s?: string) => (s ? assetPath(s) : "");

// Helper components declared at module scope (not inside render) so they keep a
// stable identity across renders.
const Section = ({ children, dark, mist, pad = "5rem 1.5rem" }: { children: ReactNode; dark?: boolean; mist?: boolean; pad?: string }) => (
  <section style={{ padding: pad, background: dark ? "var(--color-ink)" : mist ? "var(--color-mist)" : "var(--color-bone)", color: dark ? "#fff" : "var(--color-ink)" }}>
    <div style={{ maxWidth: 1140, margin: "0 auto" }}>{children}</div>
  </section>
);
const H2 = ({ children, light }: { children: ReactNode; light?: boolean }) => (
  <h2 className="display-1" style={{ marginBottom: "1.5rem", color: light ? "#fff" : "var(--color-ink)" }}>{children}</h2>
);
const Btn = ({ label, href }: { label?: string; href?: string }) =>
  label ? <a href={href || "#"} style={{ display: "inline-block", marginTop: "1.5rem", background: "var(--color-teal)", color: "#042e29", fontWeight: 700, padding: ".85rem 1.6rem", borderRadius: "0.25rem", textDecoration: "none" }}>{label}</a> : null;

export default function CMSBlocks({ blocks, ctx }: { blocks: CMSBlock[]; ctx: Ctx }) {
  return <>{blocks.map((b) => <Block key={b.id} block={b} ctx={ctx} />)}</>;
}

function Block({ block, ctx }: { block: CMSBlock; ctx: Ctx }) {
  const c = block.content as Record<string, any>;

  switch (block.component_type) {
    case "hero":
      return (
        <section style={{ position: "relative", minHeight: "78vh", display: "grid", placeItems: c.align === "left" ? "center start" : "center", color: "#fff", overflow: "hidden", padding: "6rem 1.5rem" }}>
          {c.image && <img src={img(c.image)} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(27,28,28,.35), rgba(27,28,28,.65))" }} />
          <div style={{ position: "relative", maxWidth: 860, textAlign: c.align === "left" ? "left" : "center" }}>
            {c.eyebrow && <div style={{ textTransform: "uppercase", letterSpacing: ".18em", fontSize: ".8rem", fontWeight: 700, color: "var(--color-teal)", marginBottom: 18 }}>{c.eyebrow}</div>}
            <h1 className="display-hero" style={{ color: "#fff" }}>{c.heading}</h1>
            {c.subheading && <p style={{ marginTop: 20, fontSize: "1.3rem", opacity: 0.95, maxWidth: 640, marginInline: c.align === "left" ? 0 : "auto" }}>{c.subheading}</p>}
            <Btn label={c.cta_label} href={c.cta_url} />
          </div>
        </section>
      );
    case "announcement_banner":
      return (
        <div style={{ background: "var(--color-teal)", color: "#042e29", padding: "1rem 1.5rem", textAlign: "center", fontWeight: 600 }}>
          {c.text} {c.link_label && <a href={c.link_url || "#"} style={{ color: "#042e29", marginLeft: 8, textDecoration: "underline" }}>{c.link_label} →</a>}
        </div>
      );
    case "rich_text":
      return <Section>{c.heading && <H2>{c.heading}</H2>}<p style={{ fontSize: "1.25rem", color: "var(--color-mute)", maxWidth: 760, whiteSpace: "pre-wrap" }}>{c.body}</p></Section>;
    case "image_text":
      return (
        <Section>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center", direction: c.image_side === "right" ? "rtl" : "ltr" }}>
            <img src={img(c.image)} alt="" style={{ width: "100%", borderRadius: 8, objectFit: "cover", aspectRatio: "4/3", direction: "ltr" }} />
            <div style={{ direction: "ltr" }}><H2>{c.heading}</H2><p style={{ fontSize: "1.2rem", color: "var(--color-mute)" }}>{c.body}</p></div>
          </div>
        </Section>
      );
    case "card_grid":
      return (
        <Section mist>
          {c.heading && <H2>{c.heading}</H2>}
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min((c.cards || []).length || 1, 3)}, 1fr)`, gap: 24 }}>
            {(c.cards || []).map((card: any, i: number) => (
              <div key={i} style={{ background: "var(--color-bone)", borderRadius: 8, padding: "2rem" }}>
                <div style={{ width: 40, height: 4, background: "var(--color-teal)", borderRadius: 2, marginBottom: 18 }} />
                <h3 className="heading-1" style={{ marginBottom: 10 }}>{card.title}</h3>
                <p style={{ color: "var(--color-mute)" }}>{card.body}</p>
              </div>
            ))}
          </div>
        </Section>
      );
    case "stat_row":
      return (
        <Section dark>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${(c.stats || []).length || 1}, 1fr)`, gap: 24, textAlign: "center" }}>
            {(c.stats || []).map((s: any, i: number) => (
              <div key={i}><div className="display-1" style={{ color: "var(--color-teal)" }}>{s.value}</div><div style={{ color: "#cfd2d2", marginTop: 6 }}>{s.label}</div></div>
            ))}
          </div>
        </Section>
      );
    case "sermon_list": {
      const items = [...(ctx.sermons || [])].slice(0, c.limit || 3);
      return (
        <Section>
          <H2>{c.heading || "Messages"}</H2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 24 }}>
            {items.map((s: any) => (
              <div key={s.id} style={{ borderRadius: 8, overflow: "hidden", border: "1px solid var(--color-rule)" }}>
                <div style={{ aspectRatio: "16/9", background: `url(https://img.youtube.com/vi/${s.youtube_video_id}/hqdefault.jpg) center/cover, var(--color-ink)` }} />
                <div style={{ padding: "1.1rem" }}><div style={{ fontWeight: 700 }}>{s.title}</div><div style={{ color: "var(--color-mute)", fontSize: ".9rem", marginTop: 4 }}>{s.speaker} · {s.date}</div></div>
              </div>
            ))}
          </div>
        </Section>
      );
    }
    case "event_list": {
      const items = [...(ctx.events || [])].slice(0, c.limit || 4);
      return (
        <Section mist>
          <H2>{c.heading || "Events"}</H2>
          <div style={{ display: "grid", gap: 14 }}>
            {items.map((e: any) => {
              const d = new Date(e.start_date);
              return (
                <div key={e.id} style={{ background: "var(--color-bone)", borderRadius: 8, padding: "1.2rem 1.4rem", display: "flex", gap: 22, alignItems: "center" }}>
                  <div style={{ textAlign: "center", minWidth: 56 }}>
                    <div style={{ color: "var(--color-teal)", fontWeight: 800, fontSize: "1.7rem", lineHeight: 1 }}>{d.getDate()}</div>
                    <div style={{ fontSize: ".75rem", textTransform: "uppercase", color: "var(--color-mute)" }}>{d.toLocaleString("en", { month: "short" })}</div>
                  </div>
                  <div><div style={{ fontWeight: 700, fontSize: "1.1rem" }}>{e.title}</div><div style={{ color: "var(--color-mute)" }}>{e.location} · {d.toLocaleString("en", { hour: "numeric", minute: "2-digit" })}</div></div>
                </div>
              );
            })}
          </div>
        </Section>
      );
    }
    case "location_card":
      return (
        <Section>
          <H2>{c.heading || "Locations"}</H2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 24 }}>
            {(ctx.locations || []).map((l: any) => (
              <div key={l.id} style={{ borderRadius: 8, overflow: "hidden", border: "1px solid var(--color-rule)" }}>
                <div style={{ aspectRatio: "16/9", background: `url(${img(l.image)}) center/cover, var(--color-mist)` }} />
                <div style={{ padding: "1.4rem" }}>
                  <h3 className="heading-1">{l.name}</h3>
                  <div style={{ color: "var(--color-mute)", margin: "6px 0 12px" }}>{l.street}, {l.city}, {l.state}</div>
                  {(l.services || []).map((s: any, i: number) => <div key={i} style={{ fontSize: ".95rem" }}><b>{s.day}:</b> {s.times.join(", ")}</div>)}
                </div>
              </div>
            ))}
          </div>
        </Section>
      );
    case "give_cta":
    case "cta":
      return (
        <Section dark={block.component_type === "give_cta"} mist={block.component_type === "cta"} pad="5rem 1.5rem">
          <div style={{ textAlign: "center" }}>
            <h2 className="display-1" style={{ color: block.component_type === "give_cta" ? "#fff" : "var(--color-ink)" }}>{c.heading}</h2>
            <Btn label={c.cta_label} href={c.cta_url} />
          </div>
        </Section>
      );
    case "scripture":
      return (
        <Section mist pad="5rem 1.5rem">
          <div style={{ textAlign: "center", maxWidth: 820, margin: "0 auto" }}>
            <p className="display-2" style={{ fontStyle: "italic" }}>&ldquo;{c.text}&rdquo;</p>
            <div style={{ color: "var(--color-teal)", fontWeight: 700, marginTop: 18 }}>{c.reference}</div>
          </div>
        </Section>
      );
    case "video_embed":
      return (
        <Section>
          {c.heading && <H2>{c.heading}</H2>}
          <div style={{ aspectRatio: "16/9", borderRadius: 8, overflow: "hidden", background: "var(--color-ink)" }}>
            {c.youtube_video_id ? <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${c.youtube_video_id}`} title="video" style={{ border: 0 }} allowFullScreen /> : null}
          </div>
        </Section>
      );
    case "spacer":
      return <div style={{ height: ({ sm: 32, md: 64, lg: 96, xl: 140 } as any)[c.size] || 64 }} />;
    default:
      return null;
  }
}
