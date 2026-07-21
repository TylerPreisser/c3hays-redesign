"use client";

import { tx, type BtnStyle } from "@/lib/home-content";

/**
 * EditorialRows — an addable "field notes / dispatches" editorial section.
 *
 * Faithful port of the round-2 EDITORIAL mockup (`.d-altrows-`): a stack of
 * alternating image/text rows with an eyebrow, per-row kicker + heading + body,
 * and a trailing text-link CTA on the last row. Decorative line-art tiles ship as
 * the default look and live inside an editable `data-cms-bg` tile so a real photo
 * (or color) can be dropped per row.
 *
 * Editor-native by construction (mirrors SermonFeature / WeeklySignup):
 *   • section container   → data-cms-bg  ("editorial-bg")   — section background
 *   • each row's tile     → data-cms-bg  ("editorial-rowN-tile") — tile background
 *   • every eyebrow/kicker/heading/body → data-cms text ("t:editorial-…")
 *   • the CTA             → data-cms-link + data-cms-link-label
 *
 * Renders purely from the generic `text` override map, so it is addable via the
 * section library (engine renderExample) and looks intentional on first drop.
 */
export interface EditorialRowsProps {
  text?: Record<string, string>;
  btnStyle?: BtnStyle;
  variant?: string;
  className?: string;
}

/** Decorative line-art marks (wheat / prairie grass / river) — the mockup tiles. */
const ART: Record<string, React.ReactNode> = {
  wheat: (
    <svg viewBox="0 0 210 250" aria-hidden="true">
      <g transform="rotate(-8 30 240)">
        <path d="M30,240 C26,180 34,120 30,70 C29,50 31,35 30,15" />
        <path d="M30,60 L18,69" /><path d="M30,60 L42,69" />
        <path d="M30,48 L20,56" /><path d="M30,48 L40,56" />
        <path d="M30,36 L21,43" /><path d="M30,36 L39,43" />
        <path d="M30,26 L22,32" /><path d="M30,26 L38,32" />
      </g>
      <g transform="rotate(3 100 240)">
        <path d="M100,240 C96,180 104,120 100,70 C99,50 101,35 100,15" />
        <path d="M100,60 L88,69" /><path d="M100,60 L112,69" />
        <path d="M100,48 L90,56" /><path d="M100,48 L110,56" />
        <path d="M100,36 L91,43" /><path d="M100,36 L109,43" />
        <path d="M100,26 L92,32" /><path d="M100,26 L108,32" />
      </g>
      <g transform="rotate(-3 170 240)">
        <path d="M170,240 C166,180 174,120 170,70 C169,50 171,35 170,15" />
        <path d="M170,60 L158,69" /><path d="M170,60 L182,69" />
        <path d="M170,48 L160,56" /><path d="M170,48 L180,56" />
        <path d="M170,36 L161,43" /><path d="M170,36 L179,43" />
        <path d="M170,26 L162,32" /><path d="M170,26 L178,32" />
      </g>
    </svg>
  ),
  grass: (
    <svg viewBox="0 0 200 220" aria-hidden="true">
      <path d="M60,210 L60,140 C58,120 55,110 50,95 C46,85 48,72 56,68 C62,65 68,70 70,82 L74,120 L78,82 C79,68 84,58 92,58 C100,58 104,68 104,82 L106,125 L110,84 C111,70 116,60 124,60 C132,60 136,70 136,85 L138,128 L150,95 C154,84 162,80 168,86 C173,91 172,100 166,112 L146,150 C140,162 138,175 138,195 L138,210" />
    </svg>
  ),
  river: (
    <svg viewBox="0 0 240 200" aria-hidden="true">
      <circle cx="200" cy="46" r="16" />
      <path d="M10,118 C40,108 70,128 100,118 C130,108 160,128 190,118 C205,113 215,116 230,118" />
      <path d="M10,140 C40,132 70,148 100,140 C130,132 160,148 190,140 C205,136 215,138 230,140" />
      <path d="M10,160 C40,155 70,165 100,160 C130,155 160,165 190,160 C205,158 215,159 230,160" />
      <path d="M30,200 C28,170 34,150 30,120" />
      <path d="M30,132 C34,128 40,128 42,122" />
      <path d="M44,200 C42,175 48,158 44,132" />
      <path d="M56,200 C55,180 59,165 56,142" />
    </svg>
  ),
};

interface RowDef { key: string; art: keyof typeof ART; rev: boolean; kicker: string; heading: string; body: string; }

const ROWS: RowDef[] = [
  {
    key: "row1", art: "wheat", rev: false,
    kicker: "Hays, Kansas",
    heading: "Row heading",
    body: "Add your text here &mdash; describe what&rsquo;s happening in this section.",
  },
  {
    key: "row2", art: "grass", rev: true,
    kicker: "Colby, Kansas",
    heading: "Row heading",
    body: "Add your text here &mdash; a short editorial paragraph you can edit.",
  },
  {
    key: "row3", art: "river", rev: false,
    kicker: "Kicker",
    heading: "Row heading",
    body: "Add your text here &mdash; a short editorial paragraph you can edit.",
  },
];

export default function EditorialRows({ text, className }: EditorialRowsProps) {
  const eyebrow = tx(text, "editorial-eyebrow", "Eyebrow");
  const ctaLabel = text?.["editorial-cta-label"] || "Find a service time";
  const ctaHref = text?.["editorial-cta-href"] || "/locations/";

  return (
    <section
      className={`edrows ${className || ""}`}
      data-cms-bg="editorial-bg"
      style={{
        background: "var(--color-paper)",
        color: "var(--color-ink)",
        fontFamily: "var(--font-sans)",
        padding: "clamp(3rem,6vw,5.5rem) clamp(1.25rem,5vw,3.5rem)",
      }}
    >
      <style>{`
        .edrows .edrows-wrap{max-width:1080px;margin:0 auto}
        .edrows-eyebrow{font-size:.78rem;letter-spacing:.18em;text-transform:uppercase;color:var(--color-teal-deep);font-weight:700;display:flex;align-items:center;gap:.6rem;margin:0 0 2.25rem}
        .edrows-eyebrow::before{content:"";width:28px;height:1px;background:var(--color-teal);display:inline-block}
        .edrows-row{display:grid;grid-template-columns:minmax(0,0.9fr) minmax(0,1.1fr);gap:clamp(2rem,5vw,4rem);align-items:center;padding:clamp(2.25rem,5vw,3.5rem) 0;border-top:1px solid var(--color-sand)}
        .edrows-row:first-of-type{border-top:none;padding-top:0}
        .edrows-row--rev .edrows-tile{order:2}
        .edrows-row--rev .edrows-text{order:1}
        .edrows-tile{border-radius:2px;aspect-ratio:4/3.1;display:flex;align-items:center;justify-content:center;overflow:hidden;position:relative;transition:transform .5s ease}
        .edrows-tile::after{content:"";position:absolute;inset:0;border:1px solid color-mix(in srgb,var(--color-stone) 25%,transparent);pointer-events:none}
        .edrows-row:hover .edrows-tile{transform:translateY(-3px)}
        .edrows-tile svg{width:62%;height:62%;color:var(--color-teal-deep);stroke:currentColor;fill:none;stroke-width:1.6;stroke-linecap:round;transition:color .5s ease,transform .7s ease}
        .edrows-row:hover .edrows-tile svg{color:var(--color-teal);transform:scale(1.045)}
        .edrows-kicker{font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;color:var(--color-stone);font-weight:700;margin:0 0 .75rem}
        .edrows-heading{font-family:var(--font-sans);font-weight:700;font-size:clamp(1.4rem,2.4vw,1.9rem);line-height:1.18;letter-spacing:-.01em;margin:0 0 .9rem;color:inherit}
        .edrows-body{font-size:1rem;line-height:1.72;color:color-mix(in srgb,var(--color-ink) 82%,var(--color-stone) 18%);margin:0;max-width:46ch}
        .edrows-btn{display:inline-flex;align-items:center;gap:.4rem;margin-top:1.4rem;font-size:.85rem;font-weight:700;color:var(--color-teal-deep);text-decoration:none;background:none;border:none;padding:0;cursor:pointer}
        .edrows-btn span.arw{display:inline-block;transition:transform .3s ease}
        .edrows-btn:hover span.arw{transform:translateX(4px)}
        @media (max-width:720px){.edrows-row,.edrows-row--rev{grid-template-columns:1fr}.edrows-row--rev .edrows-tile,.edrows-row--rev .edrows-text{order:initial}}
        @media (prefers-reduced-motion:reduce){.edrows-tile,.edrows-tile svg,.edrows-btn span.arw{transition:none}}
      `}</style>

      <div className="edrows-wrap">
        <p
          className="edrows-eyebrow"
          data-cms="t:editorial-eyebrow"
          dangerouslySetInnerHTML={{ __html: eyebrow }}
        />
        {ROWS.map((r, i) => (
          <div key={r.key} className={`edrows-row${r.rev ? " edrows-row--rev" : ""}`}>
            <div
              className="edrows-tile"
              data-cms-bg={`editorial-${r.key}-tile`}
              style={{ background: "linear-gradient(155deg, var(--color-paper-soft), var(--color-sand))" }}
            >
              {ART[r.art]}
            </div>
            <div className="edrows-text">
              <p
                className="edrows-kicker"
                data-cms={`t:editorial-${r.key}-kicker`}
                dangerouslySetInnerHTML={{ __html: tx(text, `editorial-${r.key}-kicker`, r.kicker) }}
              />
              <h3
                className="edrows-heading"
                data-cms={`t:editorial-${r.key}-heading`}
                dangerouslySetInnerHTML={{ __html: tx(text, `editorial-${r.key}-heading`, r.heading) }}
              />
              <p
                className="edrows-body"
                data-cms={`t:editorial-${r.key}-body`}
                dangerouslySetInnerHTML={{ __html: tx(text, `editorial-${r.key}-body`, r.body) }}
              />
              {i === ROWS.length - 1 && (
                <a href={ctaHref} data-cms-link="editorial-cta" className="edrows-btn">
                  <span data-cms-link-label>{ctaLabel}</span> <span className="arw" aria-hidden="true">&rarr;</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
