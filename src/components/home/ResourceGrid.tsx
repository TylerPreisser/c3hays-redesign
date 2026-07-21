"use client";

import { useState } from "react";
import { tx } from "@/lib/home-content";

/**
 * ResourceGrid — an addable "resources" card grid (sermons / articles / guides /
 * downloads). Faithful port of the round-3 CARDS & GRIDS "Resource Grid" mockup
 * (`.d-cards-resource`): a header with an eyebrow + heading and a row of filter
 * chips, then a grid with one large featured card (2×2, animated audio
 * wave) plus four small resource cards (colored type tag, title, sub, CTA foot).
 *
 * The mockup filters with a pure-CSS radio hack; here the chips are real React
 * buttons driving `useState`, so clicking a chip actually filters the visible
 * cards (accessible via aria-pressed). Featured card shows only under "All".
 *
 * Editor-native by construction (mirrors EditorialRows / SermonFeature):
 *   • section container      → data-cms-bg  ("resource-bg")
 *   • featured art region    → data-cms-bg  ("resource-feat-bg")
 *   • each small card        → data-cms-bg  ("resource-cardN-bg")
 *   • eyebrow / title / chips / per-card type+title+sub → data-cms text ("t:resource-…")
 *   • featured + per-card link → data-cms-link + data-cms-link-label
 *
 * Renders purely from the generic `text` override map, so it is addable via the
 * section library and looks intentional on first drop.
 */
export interface ResourceGridProps {
  text?: Record<string, string>;
  btnStyle?: import("@/lib/home-content").BtnStyle;
  variant?: string;
  className?: string;
}

interface ChipDef { key: string; label: string; cat: string | null }
const CHIPS: ChipDef[] = [
  { key: "all", label: "All", cat: null },
  { key: "sermons", label: "Sermons", cat: "sermon" },
  { key: "articles", label: "Articles", cat: "article" },
  { key: "guides", label: "Guides", cat: "guide" },
];

interface CardDef {
  key: string;
  k: "sermon" | "article" | "guide";
  tag: string;
  title: string;
  sub: string;
  foot: string;
  arrow: string;
  href: string;
}
const CARDS: CardDef[] = [
  {
    key: "card1", k: "sermon", tag: "Sermon",
    title: "Resource title",
    sub: "Add a short description here.",
    foot: "Watch", arrow: "&rarr;", href: "/messages/",
  },
  {
    key: "card2", k: "article", tag: "Article",
    title: "Resource title",
    sub: "Add a short description here.",
    foot: "Read", arrow: "&rarr;", href: "/articles/",
  },
  {
    key: "card3", k: "guide", tag: "Download",
    title: "Resource title",
    sub: "Add a short description here.",
    foot: "Download", arrow: "&darr;", href: "/downloads/",
  },
  {
    key: "card4", k: "guide", tag: "Guide",
    title: "Resource title",
    sub: "Add a short description here.",
    foot: "Download", arrow: "&darr;", href: "/downloads/",
  },
];

export default function ResourceGrid({ text, className }: ResourceGridProps) {
  const [active, setActive] = useState<string>("all");
  const activeCat = CHIPS.find((c) => c.key === active)?.cat ?? null;
  const showFeatured = activeCat === null;
  const visibleCards = activeCat === null ? CARDS : CARDS.filter((c) => c.k === activeCat);

  return (
    <section
      className={`resgrid ${className || ""}`}
      data-cms-bg="resource-bg"
      style={{
        background: "var(--color-paper-soft)",
        color: "var(--color-ink)",
        fontFamily: "var(--font-sans)",
        padding: "clamp(56px,8vw,112px) clamp(20px,5vw,64px)",
      }}
    >
      <style>{`
        .resgrid *{box-sizing:border-box}
        .resgrid .resgrid-inner{max-width:1200px;margin:0 auto}
        .resgrid-head{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:24px;margin-bottom:clamp(32px,4vw,52px)}
        .resgrid-eyebrow{font-size:.72rem;letter-spacing:.22em;text-transform:uppercase;font-weight:700;color:var(--color-teal-deep);margin:0 0 14px}
        .resgrid-title{font-size:clamp(1.9rem,4vw,3rem);line-height:1.04;letter-spacing:-.03em;font-weight:800;margin:0;max-width:16ch}
        .resgrid-filters{display:flex;gap:8px;flex-wrap:wrap}
        .resgrid-chip{font-size:.82rem;font-weight:700;padding:9px 18px;border-radius:999px;border:1px solid var(--color-sand);background:#fff;color:var(--color-stone);cursor:pointer;font-family:inherit;transition:background .3s,color .3s,border-color .3s}
        .resgrid-chip:hover{border-color:var(--color-teal)}
        .resgrid-chip.is-active{background:var(--color-ink);color:var(--color-paper);border-color:var(--color-ink)}
        .resgrid-chip:focus-visible{outline:3px solid var(--color-teal);outline-offset:3px}
        .resgrid-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:clamp(14px,1.5vw,20px)}
        .resgrid-feat{grid-column:span 2;grid-row:span 2;display:flex;flex-direction:column;background:var(--color-ink-warm);color:var(--color-paper);border-radius:24px;overflow:hidden;text-decoration:none;transition:transform .4s cubic-bezier(.2,.7,.2,1),box-shadow .4s ease;box-shadow:0 1px 2px rgba(27,28,28,.05)}
        .resgrid-feat:hover{transform:translateY(-6px);box-shadow:0 30px 60px -26px rgba(27,28,28,.5)}
        .resgrid-feat:focus-visible,.resgrid-card:focus-visible{outline:3px solid var(--color-teal);outline-offset:3px}
        .resgrid-featart{position:relative;flex:1;min-height:180px;background:linear-gradient(150deg,var(--color-teal-deep),var(--color-teal) 120%);display:flex;align-items:center;justify-content:center}
        .resgrid-wave{display:flex;align-items:center;gap:7px;height:64px}
        .resgrid-wave i{width:7px;border-radius:99px;background:rgba(250,247,242,.92);animation:resgrid-wave 1.4s ease-in-out infinite}
        .resgrid-wave i:nth-child(1){height:26%;animation-delay:0s}.resgrid-wave i:nth-child(2){height:64%;animation-delay:.1s}.resgrid-wave i:nth-child(3){height:96%;animation-delay:.2s}.resgrid-wave i:nth-child(4){height:48%;animation-delay:.3s}.resgrid-wave i:nth-child(5){height:80%;animation-delay:.4s}.resgrid-wave i:nth-child(6){height:38%;animation-delay:.5s}.resgrid-wave i:nth-child(7){height:60%;animation-delay:.6s}
        @keyframes resgrid-wave{0%,100%{transform:scaleY(.5)}50%{transform:scaleY(1)}}
        .resgrid-featbody{padding:clamp(22px,2.5vw,32px);display:flex;flex-direction:column;gap:10px}
        .resgrid-kind{font-size:.7rem;letter-spacing:.16em;text-transform:uppercase;font-weight:700;color:var(--color-teal)}
        .resgrid-featbody h3{font-size:clamp(1.4rem,2.4vw,1.9rem);letter-spacing:-.02em;font-weight:800;margin:0;line-height:1.1}
        .resgrid-featbody p{font-size:.95rem;line-height:1.55;color:rgba(250,247,242,.66);margin:0}
        .resgrid-meta{display:inline-flex;align-items:center;gap:9px;font-size:.82rem;font-weight:600;color:rgba(250,247,242,.8);margin-top:4px}
        .resgrid-dot{width:9px;height:9px;border-radius:50%;background:var(--color-teal);box-shadow:0 0 0 4px rgba(28,195,175,.25)}
        .resgrid-card{display:flex;flex-direction:column;gap:9px;background:#fff;border:1px solid var(--color-sand);border-radius:20px;padding:22px;text-decoration:none;color:inherit;transition:transform .4s cubic-bezier(.2,.7,.2,1),box-shadow .4s ease,border-color .4s ease}
        .resgrid-card:hover{transform:translateY(-6px);box-shadow:0 22px 44px -22px rgba(27,28,28,.28);border-color:transparent}
        .resgrid-tag{align-self:flex-start;font-size:.66rem;letter-spacing:.1em;text-transform:uppercase;font-weight:700;padding:5px 11px;border-radius:7px}
        .resgrid-tag[data-k="sermon"]{background:rgba(28,195,175,.15);color:var(--color-teal-deep)}
        .resgrid-tag[data-k="article"]{background:rgba(26,24,21,.08);color:var(--color-ink)}
        .resgrid-tag[data-k="guide"]{background:rgba(23,156,140,.12);color:var(--color-teal-deep)}
        .resgrid-card h4{font-size:1.08rem;line-height:1.2;letter-spacing:-.015em;font-weight:800;margin:0}
        .resgrid-sub{font-size:.88rem;line-height:1.45;color:var(--color-stone);margin:0;flex:1}
        .resgrid-foot{font-size:.8rem;font-weight:700;color:var(--color-ink);display:inline-flex;align-items:center;gap:7px}
        .resgrid-foot em{font-style:normal;color:var(--color-teal-deep);transition:transform .35s cubic-bezier(.2,.7,.2,1)}
        .resgrid-card:hover .resgrid-foot em{transform:translateX(5px)}
        @media(max-width:900px){.resgrid-grid{grid-template-columns:repeat(2,1fr)}.resgrid-feat{grid-column:span 2;grid-row:auto}}
        @media(max-width:560px){.resgrid-grid{grid-template-columns:1fr}.resgrid-feat{grid-column:span 1}}
        @media(prefers-reduced-motion:reduce){.resgrid-feat,.resgrid-card,.resgrid-foot em{transition:none}.resgrid-wave i{animation:none}}
      `}</style>

      <div className="resgrid-inner">
        <header className="resgrid-head">
          <div>
            <p
              className="resgrid-eyebrow"
              data-cms="t:resource-eyebrow"
              dangerouslySetInnerHTML={{ __html: tx(text, "resource-eyebrow", "Resources") }}
            />
            <h2
              className="resgrid-title"
              data-cms="t:resource-title"
              dangerouslySetInnerHTML={{ __html: tx(text, "resource-title", "Something to carry into your week.") }}
            />
          </div>
          <div className="resgrid-filters" role="group" aria-label="Filter resources">
            {CHIPS.map((c) => (
              <button
                key={c.key}
                type="button"
                className={`resgrid-chip${active === c.key ? " is-active" : ""}`}
                aria-pressed={active === c.key}
                onClick={() => setActive(c.key)}
                data-cms={`t:resource-chip-${c.key}`}
                dangerouslySetInnerHTML={{ __html: tx(text, `resource-chip-${c.key}`, c.label) }}
              />
            ))}
          </div>
        </header>

        <div className="resgrid-grid">
          {showFeatured && (
            <a
              className="resgrid-feat"
              href={text?.["resource-feat-href"] || "#"}
              data-cms-link="resource-feat"
            >
              <div className="resgrid-featart" data-cms-bg="resource-feat-bg" aria-hidden="true">
                <span className="resgrid-wave">
                  <i /><i /><i /><i /><i /><i /><i />
                </span>
              </div>
              <div className="resgrid-featbody">
                <span
                  className="resgrid-kind"
                  data-cms="t:resource-feat-kind"
                  dangerouslySetInnerHTML={{ __html: tx(text, "resource-feat-kind", "Featured &middot; Latest") }}
                />
                <h3
                  data-cms="t:resource-feat-title"
                  dangerouslySetInnerHTML={{ __html: tx(text, "resource-feat-title", "Resource title") }}
                />
                <p
                  data-cms="t:resource-feat-body"
                  dangerouslySetInnerHTML={{
                    __html: tx(
                      text,
                      "resource-feat-body",
                      "Add your text here &mdash; a short summary of this featured resource.",
                    ),
                  }}
                />
                <span className="resgrid-meta">
                  <span className="resgrid-dot" aria-hidden="true" />
                  <span data-cms-link-label>{text?.["resource-feat-label"] || "New this week"}</span>
                </span>
              </div>
            </a>
          )}

          {visibleCards.map((c) => (
            <a
              key={c.key}
              className="resgrid-card"
              href={text?.[`resource-${c.key}-href`] || c.href}
              data-cms-link={`resource-${c.key}`}
              data-cms-bg={`resource-${c.key}-bg`}
            >
              <span
                className="resgrid-tag"
                data-k={c.k}
                data-cms={`t:resource-${c.key}-tag`}
                dangerouslySetInnerHTML={{ __html: tx(text, `resource-${c.key}-tag`, c.tag) }}
              />
              <h4
                data-cms={`t:resource-${c.key}-title`}
                dangerouslySetInnerHTML={{ __html: tx(text, `resource-${c.key}-title`, c.title) }}
              />
              <p
                className="resgrid-sub"
                data-cms={`t:resource-${c.key}-sub`}
                dangerouslySetInnerHTML={{ __html: tx(text, `resource-${c.key}-sub`, c.sub) }}
              />
              <span className="resgrid-foot">
                <span data-cms-link-label>{text?.[`resource-${c.key}-label`] || c.foot.replace(/&middot;/g, "·")}</span>{" "}
                <em aria-hidden="true" dangerouslySetInnerHTML={{ __html: c.arrow }} />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
