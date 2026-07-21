import { tx } from "@/lib/home-content";

/**
 * <VisitEditorial> — the /visit "editorial" section (data-section="visit-editorial").
 *
 * The alternating image/text editorial section Tyler liked, restored on-brand
 * (paper / teal / ink) and filled with REAL, grounded newcomer content — no
 * fabrication. Content is sourced from the real church:
 *   • the C3 mission / "Meet. Grow. Serve." (from @/data/site)
 *   • the two real campuses (Hays + Colby)
 *   • the real first-time-guest welcome (gift, park up front, come as you are)
 *     already published on celebratejesus.org/plan-your-visit.
 *
 * Editor-native by construction: the section container is a data-cms-bg region,
 * every kicker / heading / body is a data-cms text region, each tile is its own
 * data-cms-bg, and the trailing CTA is an editable data-cms-link + label. Server
 * component (no client state).
 */

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
  home: (
    <svg viewBox="0 0 240 220" aria-hidden="true">
      <path d="M40,120 L120,52 L200,120" />
      <path d="M64,104 L64,180 L176,180 L176,104" />
      <path d="M104,180 L104,138 L136,138 L136,180" />
      <path d="M120,52 L120,30" />
    </svg>
  ),
  compass: (
    <svg viewBox="0 0 220 220" aria-hidden="true">
      <circle cx="110" cy="110" r="82" />
      <circle cx="110" cy="110" r="6" />
      <path d="M110,44 L128,110 L110,176 L92,110 Z" />
      <path d="M110,30 L110,44" /><path d="M110,176 L110,190" />
      <path d="M30,110 L44,110" /><path d="M176,110 L190,110" />
    </svg>
  ),
};

interface RowDef {
  key: string;
  art: keyof typeof ART;
  rev: boolean;
  kicker: string;
  heading: string;
  body: string;
}

/* REAL content — grounded in the church's own mission + plan-your-visit copy. */
const ROWS: RowDef[] = [
  {
    key: "row1", art: "wheat", rev: false,
    kicker: "Meet &middot; Grow &middot; Serve",
    heading: "Come and meet with Jesus",
    body: "Jesus is central to everything we do at C3. We exist to meet with Him, grow in Him, and serve through Him &mdash; and there&rsquo;s a place for you in that story from your very first Sunday.",
  },
  {
    key: "row2", art: "home", rev: true,
    kicker: "Hays &amp; Colby",
    heading: "Two campuses, one church family",
    body: "Whether you join us in Hays or Colby, you&rsquo;ll find the same warm welcome, honest teaching straight from the Bible, and people who are genuinely glad you came.",
  },
  {
    key: "row3", art: "compass", rev: false,
    kicker: "Your first step",
    heading: "We&rsquo;ll be looking for you",
    body: "Come exactly as you are, pull up front where our team can point you in, and let us know it&rsquo;s your first time &mdash; we even have a gift waiting to say thanks for checking us out.",
  },
];

export default function VisitEditorial({ t }: { t: Record<string, string> }) {
  const eyebrow = tx(t, "visit-editorial-eyebrow", "Why C3");
  const ctaLabel = t["visit-editorial-cta-label"] || "Find a service time";
  const ctaHref = t["visit-editorial-cta-href"] || "/locations/";

  return (
    <section
      className="vised"
      data-cms-bg="visit-editorial-bg"
      style={{
        background: "var(--color-paper)",
        color: "var(--color-ink-warm)",
        fontFamily: "var(--font-sans)",
        padding: "clamp(3rem,6vw,5.5rem) clamp(1.25rem,5vw,3.5rem)",
      }}
    >
      <style>{`
        .vised .vised-wrap{max-width:1080px;margin:0 auto}
        .vised-eyebrow{font-size:.78rem;letter-spacing:.18em;text-transform:uppercase;color:var(--color-teal-deep);font-weight:700;display:flex;align-items:center;gap:.6rem;margin:0 0 2.25rem}
        .vised-eyebrow::before{content:"";width:28px;height:1px;background:var(--color-teal);display:inline-block}
        .vised-row{display:grid;grid-template-columns:minmax(0,0.9fr) minmax(0,1.1fr);gap:clamp(2rem,5vw,4rem);align-items:center;padding:clamp(2.25rem,5vw,3.5rem) 0;border-top:1px solid var(--color-sand)}
        .vised-row:first-of-type{border-top:none;padding-top:0}
        .vised-row--rev .vised-tile{order:2}
        .vised-row--rev .vised-text{order:1}
        .vised-tile{border-radius:var(--radius-md);aspect-ratio:4/3.1;display:flex;align-items:center;justify-content:center;overflow:hidden;position:relative;transition:transform .5s ease}
        .vised-tile::after{content:"";position:absolute;inset:0;border-radius:var(--radius-md);border:1px solid color-mix(in srgb,var(--color-stone) 22%,transparent);pointer-events:none}
        .vised-row:hover .vised-tile{transform:translateY(-3px)}
        .vised-tile svg{width:60%;height:60%;color:var(--color-teal-deep);stroke:currentColor;fill:none;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round;transition:color .5s ease,transform .7s ease}
        .vised-row:hover .vised-tile svg{color:var(--color-teal);transform:scale(1.045)}
        .vised-kicker{font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;color:var(--color-stone);font-weight:700;margin:0 0 .75rem}
        .vised-heading{font-family:var(--font-sans);font-weight:700;font-size:clamp(1.4rem,2.4vw,1.9rem);line-height:1.18;letter-spacing:-.01em;margin:0 0 .9rem;color:var(--color-ink-warm)}
        .vised-body{font-size:1rem;line-height:1.72;color:var(--color-stone);margin:0;max-width:46ch}
        .vised-btn{display:inline-flex;align-items:center;gap:.4rem;margin-top:1.4rem;font-size:.85rem;font-weight:700;color:var(--color-teal-deep);text-decoration:none;cursor:pointer}
        .vised-btn span.arw{display:inline-block;transition:transform .3s ease}
        .vised-btn:hover span.arw{transform:translateX(4px)}
        @media (max-width:720px){.vised-row,.vised-row--rev{grid-template-columns:1fr}.vised-row--rev .vised-tile,.vised-row--rev .vised-text{order:initial}}
        @media (prefers-reduced-motion:reduce){.vised-tile,.vised-tile svg,.vised-btn span.arw{transition:none}}
      `}</style>

      <div className="vised-wrap">
        <p
          className="vised-eyebrow"
          data-cms="t:visit-editorial-eyebrow"
          dangerouslySetInnerHTML={{ __html: eyebrow }}
        />
        {ROWS.map((r, i) => (
          <div key={r.key} className={`vised-row${r.rev ? " vised-row--rev" : ""}`}>
            <div
              className="vised-tile"
              data-cms-bg={`visit-editorial-${r.key}-tile`}
              style={{ background: "linear-gradient(155deg, var(--color-paper-soft), var(--color-sand))" }}
            >
              {ART[r.art]}
            </div>
            <div className="vised-text">
              <p
                className="vised-kicker"
                data-cms={`t:visit-editorial-${r.key}-kicker`}
                dangerouslySetInnerHTML={{ __html: tx(t, `visit-editorial-${r.key}-kicker`, r.kicker) }}
              />
              <h3
                className="vised-heading"
                data-cms={`t:visit-editorial-${r.key}-heading`}
                dangerouslySetInnerHTML={{ __html: tx(t, `visit-editorial-${r.key}-heading`, r.heading) }}
              />
              <p
                className="vised-body"
                data-cms={`t:visit-editorial-${r.key}-body`}
                dangerouslySetInnerHTML={{ __html: tx(t, `visit-editorial-${r.key}-body`, r.body) }}
              />
              {i === ROWS.length - 1 && (
                <a href={ctaHref} data-cms-link="visit-editorial-cta" className="vised-btn">
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
