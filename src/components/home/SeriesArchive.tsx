import { tx, type BtnStyle } from "@/lib/home-content";

/**
 * SeriesArchive — an addable "sermon-series archive" grid section.
 *
 * Faithful port of the round-2 MEDIA mockup (`.d-sarchive-`): a deep-teal band
 * with an eyebrow + heading, then a responsive 3-up grid of series cards. Each
 * card is a poster-shaped link with a gradient "cover" (the editable art tile),
 * a title + scripture ref pinned top, and a hover/focus overlay that reveals a
 * chapter-scrub progress bar plus a "N messages · season" line and a "View
 * series" pill. Purely CSS-driven hover — no client state needed.
 *
 * Editor-native by construction (mirrors EditorialRows):
 *   • section container      → data-cms-bg   ("sarchive-bg")           — section background
 *   • each card's cover tile  → data-cms-bg   ("sarchive-cardN-bg")     — per-series art
 *   • the card link itself     → data-cms-link ("sarchive-cardN-link")   + data-cms-link-label pill
 *   • every eyebrow/heading/title/ref/count → data-cms text ("t:sarchive-…")
 *
 * Renders purely from the generic `text` override map, so it is addable via the
 * section library (engine renderExample) and looks intentional on first drop.
 */
export interface SeriesArchiveProps {
  text?: Record<string, string>;
  btnStyle?: BtnStyle;
  variant?: string;
  className?: string;
}

interface SeriesDef {
  key: string;
  n: number;
  href: string;
  title: string;
  ref: string;
  count: string;
  /** number of "watched" scrub segments out of SCRUB_SEGMENTS */
  active: number;
  /** default gradient for the cover tile (faithful to the mockup) */
  cover: string;
}

const SCRUB_SEGMENTS = 8;

const SERIES: SeriesDef[] = [
  {
    key: "card1", n: 1, href: "#rooted", title: "Rooted", ref: "Colossians",
    count: "6 messages &middot; Spring 2026", active: 6,
    cover: "radial-gradient(120% 100% at 20% 0%, rgba(233,226,214,.35), transparent 55%), radial-gradient(100% 100% at 80% 100%, rgba(28,195,175,.5), transparent 60%), linear-gradient(160deg,#123330,#1b1c1c 70%)",
  },
  {
    key: "card2", n: 2, href: "#ruth", title: "The Book of Ruth", ref: "Ruth",
    count: "4 messages &middot; Winter 2026", active: 4,
    cover: "radial-gradient(100% 100% at 30% 100%, rgba(233,226,214,.6), transparent 60%), radial-gradient(90% 90% at 90% 10%, rgba(140,133,122,.4), transparent 60%), linear-gradient(150deg,#3a2f22,#1b1c1c 70%)",
  },
  {
    key: "card3", n: 3, href: "#everyday-faith", title: "Everyday Faith", ref: "James",
    count: "5 messages &middot; Fall 2025", active: 5,
    cover: "radial-gradient(100% 100% at 70% 20%, rgba(250,247,242,.28), transparent 55%), linear-gradient(160deg,#33312c,#1b1c1c 70%)",
  },
  {
    key: "card4", n: 4, href: "#prodigal", title: "Prodigal", ref: "Luke 15",
    count: "3 messages &middot; Summer 2025", active: 3,
    cover: "linear-gradient(120deg, rgba(28,195,175,.5), transparent 45%), radial-gradient(90% 90% at 20% 90%, rgba(233,226,214,.22), transparent 60%), linear-gradient(160deg,#1b1c1c,#0d1a18 70%)",
  },
  {
    key: "card5", n: 5, href: "#kings-kingdoms", title: "Kings &amp; Kingdoms", ref: "1 &amp; 2 Kings",
    count: "8 messages &middot; Ongoing", active: 8,
    cover: "radial-gradient(100% 100% at 50% 0%, rgba(28,195,175,.6), transparent 55%), linear-gradient(160deg,#12201f,#1b1c1c 70%)",
  },
  {
    key: "card6", n: 6, href: "#advent", title: "Advent: Emmanuel", ref: "Isaiah &middot; Luke",
    count: "4 messages &middot; Dec 2025", active: 4,
    cover: "radial-gradient(60% 60% at 50% 30%, rgba(233,226,214,.5), transparent 60%), linear-gradient(160deg,#141a2b,#1b1c1c 70%)",
  },
];

export default function SeriesArchive({ text, className }: SeriesArchiveProps) {
  const eyebrow = tx(text, "sarchive-eyebrow", "Series Archive");
  const heading = tx(text, "sarchive-heading", "Every series, Hays to Colby");

  return (
    <section
      className={`sarchive-root ${className || ""}`}
      data-cms-bg="sarchive-bg"
      style={{
        position: "relative",
        background: "var(--color-teal-deep)",
        color: "var(--color-paper)",
        fontFamily: "var(--font-sans)",
        padding: "clamp(2.5rem,5vw,5rem) clamp(1.25rem,4vw,3.5rem)",
      }}
    >
      <style>{`
        .sarchive-root .sarchive-head{max-width:1100px;margin:0 auto 2rem}
        .sarchive-root .sarchive-eyebrow{font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;font-weight:700;color:color-mix(in srgb,var(--color-paper) 75%,transparent);margin:0}
        .sarchive-root .sarchive-heading{margin:.3rem 0 0;font-size:clamp(1.5rem,3vw,2.2rem);font-weight:700;letter-spacing:-.01em;color:inherit}
        .sarchive-root .sarchive-grid{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:repeat(3,1fr);gap:1.25rem}
        @media (max-width:900px){.sarchive-root .sarchive-grid{grid-template-columns:repeat(2,1fr)}}
        @media (max-width:560px){.sarchive-root .sarchive-grid{grid-template-columns:1fr}}
        .sarchive-root .sarchive-card{position:relative;display:block;border-radius:14px;overflow:hidden;aspect-ratio:4/5;isolation:isolate;text-decoration:none;color:inherit;box-shadow:0 20px 40px -22px rgba(0,0,0,.5);transition:transform .45s cubic-bezier(.16,1,.3,1)}
        .sarchive-root .sarchive-card:hover,.sarchive-root .sarchive-card:focus-visible{transform:translateY(-6px) scale(1.02)}
        .sarchive-root .sarchive-cover{position:absolute;inset:0;transition:transform 1.1s cubic-bezier(.16,1,.3,1)}
        .sarchive-root .sarchive-card:hover .sarchive-cover{transform:scale(1.12)}
        .sarchive-root .sarchive-info{position:absolute;left:0;right:0;top:0;padding:.9rem;background:linear-gradient(180deg,rgba(0,0,0,.5),transparent)}
        .sarchive-root .sarchive-info h4{margin:0;font-size:1.05rem;font-weight:700;color:inherit}
        .sarchive-root .sarchive-ref{margin:.15rem 0 0;font-family:var(--font-serif);font-style:italic;font-size:.8rem;color:var(--color-sand)}
        .sarchive-root .sarchive-overlay{position:absolute;inset:auto 0 0 0;padding:.85rem;display:flex;flex-direction:column;gap:.55rem;background:linear-gradient(180deg,transparent,rgba(0,0,0,.7) 55%);opacity:0;transform:translateY(8px);transition:opacity .4s,transform .4s}
        .sarchive-root .sarchive-card:hover .sarchive-overlay,.sarchive-root .sarchive-card:focus-visible .sarchive-overlay{opacity:1;transform:translateY(0)}
        .sarchive-root .sarchive-scrub{display:flex;gap:3px}
        .sarchive-root .sarchive-scrub span{flex:1;height:3px;border-radius:2px;background:rgba(250,247,242,.25);transition:background .4s}
        .sarchive-root .sarchive-scrub span.is-active{background:rgba(250,247,242,.55)}
        .sarchive-root .sarchive-scrub span:nth-child(1){transition-delay:0s}
        .sarchive-root .sarchive-scrub span:nth-child(2){transition-delay:.05s}
        .sarchive-root .sarchive-scrub span:nth-child(3){transition-delay:.1s}
        .sarchive-root .sarchive-scrub span:nth-child(4){transition-delay:.15s}
        .sarchive-root .sarchive-scrub span:nth-child(5){transition-delay:.2s}
        .sarchive-root .sarchive-scrub span:nth-child(6){transition-delay:.25s}
        .sarchive-root .sarchive-scrub span:nth-child(7){transition-delay:.3s}
        .sarchive-root .sarchive-scrub span:nth-child(8){transition-delay:.35s}
        .sarchive-root .sarchive-card:hover .sarchive-scrub span.is-active,.sarchive-root .sarchive-card:focus-visible .sarchive-scrub span.is-active{background:var(--color-teal)}
        .sarchive-root .sarchive-row{display:flex;align-items:center;justify-content:space-between;gap:.5rem;flex-wrap:wrap}
        .sarchive-root .sarchive-count{font-size:.68rem;letter-spacing:.04em;color:var(--color-paper);opacity:.85}
        .sarchive-root .sarchive-link{font-size:.68rem;font-weight:700;color:var(--color-ink);background:var(--color-paper);padding:.4em .75em;border-radius:999px;white-space:nowrap;transition:background .3s}
        .sarchive-root .sarchive-card:hover .sarchive-link{background:var(--color-teal)}
        @media (prefers-reduced-motion:reduce){.sarchive-root .sarchive-card,.sarchive-root .sarchive-cover,.sarchive-root .sarchive-overlay,.sarchive-root .sarchive-scrub span,.sarchive-root .sarchive-link{transition-duration:.01ms !important}}
      `}</style>

      <div className="sarchive-head">
        <div>
          <span
            className="sarchive-eyebrow"
            data-cms="t:sarchive-eyebrow"
            dangerouslySetInnerHTML={{ __html: eyebrow }}
          />
          <h3
            className="sarchive-heading"
            data-cms="t:sarchive-heading"
            dangerouslySetInnerHTML={{ __html: heading }}
          />
        </div>
      </div>

      <div className="sarchive-grid">
        {SERIES.map((s) => {
          const href = text?.[`sarchive-${s.key}-href`] || s.href;
          return (
            <a
              key={s.key}
              className="sarchive-card"
              href={href}
              data-cms-link={`sarchive-${s.key}-link`}
            >
              <div
                className="sarchive-cover"
                aria-hidden="true"
                data-cms-bg={`sarchive-${s.key}-bg`}
                style={{ background: s.cover }}
              />
              <div className="sarchive-info">
                <h4
                  data-cms={`t:sarchive-${s.key}-title`}
                  dangerouslySetInnerHTML={{ __html: tx(text, `sarchive-${s.key}-title`, s.title) }}
                />
                <p
                  className="sarchive-ref"
                  data-cms={`t:sarchive-${s.key}-ref`}
                  dangerouslySetInnerHTML={{ __html: tx(text, `sarchive-${s.key}-ref`, s.ref) }}
                />
              </div>
              <div className="sarchive-overlay">
                <div className="sarchive-scrub" aria-hidden="true">
                  {Array.from({ length: SCRUB_SEGMENTS }).map((_, i) => (
                    <span key={i} className={i < s.active ? "is-active" : undefined} />
                  ))}
                </div>
                <div className="sarchive-row">
                  <span
                    className="sarchive-count"
                    data-cms={`t:sarchive-${s.key}-count`}
                    dangerouslySetInnerHTML={{ __html: tx(text, `sarchive-${s.key}-count`, s.count) }}
                  />
                  <span className="sarchive-link" data-cms-link-label>
                    {text?.[`sarchive-${s.key}-link-label`] || "View series →"}
                  </span>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
