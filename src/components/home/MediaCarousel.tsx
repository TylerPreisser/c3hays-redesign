"use client";

import { useCallback, useRef, useState } from "react";
import { tx, type BtnStyle } from "@/lib/home-content";

/**
 * MediaCarousel — an addable horizontally-scrolling media rail.
 *
 * Faithful port of the round-2 MEDIA / "Media Carousel" mockup (`.d-mcarousel-`):
 * an eyebrow + heading, a row of filter tabs (All / Podcast / Video / Playlist),
 * and a scroll-snapping track of media cards (mesh-art tile + badge + play glyph +
 * title/meta) flanked by prev / next arrow controls.
 *
 * The mockup drove both the filter tabs and the arrows purely with CSS
 * (hidden radios + `:target` anchors). Componentized here that stops working, so
 * the interactivity is reimplemented in React:
 *   • filter tabs        → useState(activeFilter); non-matching cards dim/desaturate
 *   • prev / next arrows  → a ref on the track + scrollBy(±card width), smooth
 *     unless prefers-reduced-motion; scroll-snap is retained for touch/trackpad.
 * Both are real, keyboard-focusable <button>s with aria state, so tab + enter/space
 * work and screen readers announce the active filter.
 *
 * Editor-native by construction (mirrors EditorialRows / SermonFeature):
 *   • section container   → data-cms-bg  ("mcarousel-bg")            — section background
 *   • each card's art tile → data-cms-bg ("mcarousel-slideN-bg")     — per-card tile background
 *   • eyebrow / heading / tab labels / card title + meta → data-cms text ("t:mcarousel-…")
 *
 * Renders purely from the generic `text` override map, so it is addable via the
 * section library (engine renderExample) and looks intentional on first drop.
 */
export interface MediaCarouselProps {
  text?: Record<string, string>;
  btnStyle?: BtnStyle;
  variant?: string;
  className?: string;
}

type Kind = "podcast" | "video" | "playlist";

interface CardDef {
  key: string;
  kind: Kind;
  href: string;
  art: string; // background for the mesh-art tile
  badge: string;
  title: string;
  meta1: string;
  meta2: string;
}

/** Per-card mesh-art backgrounds — translated verbatim from the mockup art--1..7. */
const CARDS: CardDef[] = [
  {
    key: "slide1", kind: "podcast", href: "#ep42",
    art: "radial-gradient(110% 100% at 20% 10%, rgba(28,195,175,.6), transparent 55%), linear-gradient(160deg,#123330,#1a1815 70%)",
    badge: "Podcast", title: "The Plains Podcast Ep. 42: Rooted Q&amp;A",
    meta1: "Pastor Jared Kessler", meta2: "52 min",
  },
  {
    key: "slide2", kind: "video", href: "#replay-prodigal1",
    art: "radial-gradient(100% 100% at 80% 90%, rgba(233,226,214,.4), transparent 55%), linear-gradient(150deg,#1a1815,#23413d 70%)",
    badge: "Video", title: "Sunday Replay: Prodigal Week 1",
    meta1: "Hays Campus", meta2: "38 min",
  },
  {
    key: "slide3", kind: "playlist", href: "#advent-collection",
    art: "radial-gradient(90% 90% at 30% 90%, rgba(250,247,242,.35), transparent 55%), linear-gradient(160deg,#2a1f14,#1a1815 70%)",
    badge: "Playlist", title: "Advent Collection",
    meta1: "Full series", meta2: "4 messages",
  },
  {
    key: "slide4", kind: "podcast", href: "#ep41",
    art: "radial-gradient(100% 100% at 70% 10%, rgba(28,195,175,.5), transparent 55%), linear-gradient(160deg,#1a1815,#123330 70%)",
    badge: "Podcast", title: "The Plains Podcast Ep. 41: Ruth&rsquo;s Courage",
    meta1: "Pastor Micah Doerr", meta2: "47 min",
  },
  {
    key: "slide5", kind: "video", href: "#colby-baptism",
    art: "radial-gradient(100% 100% at 20% 90%, rgba(233,226,214,.45), transparent 55%), linear-gradient(150deg,#3a2f22,#1a1815 70%)",
    badge: "Video", title: "Colby Campus Baptism Sunday",
    meta1: "Colby Campus", meta2: "22 min",
  },
  {
    key: "slide6", kind: "playlist", href: "#everyday-faith-full",
    art: "radial-gradient(90% 90% at 80% 20%, rgba(250,247,242,.3), transparent 55%), linear-gradient(160deg,#1a1815,#2a2018 70%)",
    badge: "Playlist", title: "Everyday Faith: Full Series",
    meta1: "Full series", meta2: "5 messages",
  },
  {
    key: "slide7", kind: "podcast", href: "#ep40",
    art: "radial-gradient(110% 100% at 30% 100%, rgba(28,195,175,.55), transparent 55%), linear-gradient(160deg,#0d1a18,#1a1815 70%)",
    badge: "Podcast", title: "The Plains Podcast Ep. 40: Kings &amp; Kingdoms Kickoff",
    meta1: "Pastor Jared Kessler", meta2: "55 min",
  },
];

interface FilterDef { id: "all" | Kind; label: string }
const FILTERS: FilterDef[] = [
  { id: "all", label: "All" },
  { id: "podcast", label: "Podcast" },
  { id: "video", label: "Video" },
  { id: "playlist", label: "Playlist" },
];

export default function MediaCarousel({ text, className }: MediaCarouselProps) {
  const [filter, setFilter] = useState<"all" | Kind>("all");
  const trackRef = useRef<HTMLDivElement | null>(null);

  const scrollByCards = useCallback((dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const first = track.querySelector<HTMLElement>(".mcarousel-card");
    // Advance by one card width + gap (~1.1rem); fall back to 288px.
    const step = first ? first.getBoundingClientRect().width + 18 : 288;
    track.scrollBy({ left: dir * step, behavior: reduce ? "auto" : "smooth" });
  }, []);

  return (
    <section
      className={`mcarousel-root ${className || ""}`}
      data-cms-bg="mcarousel-bg"
      style={{
        position: "relative",
        padding: "clamp(2.5rem,5vw,5rem) 0",
        background: "var(--color-ink-warm)",
        color: "var(--color-paper)",
        fontFamily: "var(--font-sans)",
        overflow: "hidden",
      }}
    >
      <style>{`
        .mcarousel-root .mcarousel-head{
          max-width:1120px;margin:0 auto 1.75rem;padding:0 clamp(1.25rem,4vw,3.5rem);
          display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:1rem;
        }
        .mcarousel-eyebrow{font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;font-weight:700;color:var(--color-teal);margin:0}
        .mcarousel-heading{margin:.3rem 0 0;font-size:clamp(1.5rem,3vw,2.1rem);font-weight:700;letter-spacing:-.01em}

        .mcarousel-tabs{display:flex;gap:.4rem;flex-wrap:wrap}
        .mcarousel-tab{
          font-size:.7rem;letter-spacing:.05em;text-transform:uppercase;padding:.5em 1em;border-radius:999px;
          border:1px solid rgba(250,247,242,.2);cursor:pointer;transition:background .25s,border-color .25s,color .25s;
          color:var(--color-paper);background:transparent;font-family:var(--font-sans);
        }
        .mcarousel-tab:hover{border-color:var(--color-teal)}
        .mcarousel-tab:focus-visible{outline:2px solid var(--color-teal);outline-offset:2px}
        .mcarousel-tab[aria-pressed="true"]{background:var(--color-teal);border-color:var(--color-teal);color:var(--color-ink);font-weight:700}

        .mcarousel-viewport{position:relative}
        .mcarousel-track{
          display:flex;gap:1.1rem;overflow-x:auto;scroll-snap-type:x mandatory;scroll-behavior:smooth;
          padding:.5rem clamp(1.25rem,4vw,3.5rem) 1.5rem;scrollbar-width:thin;
        }
        .mcarousel-track::-webkit-scrollbar{height:6px}
        .mcarousel-track::-webkit-scrollbar-thumb{background:rgba(250,247,242,.25);border-radius:3px}

        .mcarousel-card{
          scroll-snap-align:start;flex:0 0 auto;width:min(78vw,272px);border-radius:16px;overflow:hidden;
          text-decoration:none;color:inherit;display:flex;flex-direction:column;
          background:rgba(250,247,242,.04);border:1px solid rgba(250,247,242,.12);
          transition:transform .35s cubic-bezier(.16,1,.3,1),border-color .35s,opacity .3s,filter .3s;
        }
        .mcarousel-card:hover{transform:translateY(-6px);border-color:var(--color-teal)}
        .mcarousel-card:focus-visible{outline:2px solid var(--color-teal);outline-offset:2px}
        .mcarousel-card.is-dimmed{opacity:.28;filter:grayscale(.7);transform:scale(.96)}

        .mcarousel-art{position:relative;aspect-ratio:4/3}
        .mcarousel-badge{
          position:absolute;left:10px;top:10px;font-size:.6rem;letter-spacing:.1em;text-transform:uppercase;
          font-weight:800;padding:.3em .6em;border-radius:6px;
        }
        .mcarousel-card--podcast .mcarousel-badge{background:var(--color-teal);color:var(--color-ink)}
        .mcarousel-card--video .mcarousel-badge{background:var(--color-sand);color:var(--color-ink)}
        .mcarousel-card--playlist .mcarousel-badge{background:var(--color-paper);color:var(--color-ink)}
        .mcarousel-play{
          position:absolute;right:10px;bottom:10px;width:30px;height:30px;border-radius:50%;
          background:rgba(250,247,242,.92);color:var(--color-ink);display:flex;align-items:center;justify-content:center;
          font-size:.6rem;transition:transform .3s cubic-bezier(.34,1.56,.64,1);
        }
        .mcarousel-card:hover .mcarousel-play{transform:scale(1.15);background:var(--color-teal)}

        .mcarousel-cbody{padding:.9rem 1rem 1.1rem;display:flex;flex-direction:column;gap:.35rem;flex:1}
        .mcarousel-title{margin:0;font-size:.92rem;font-weight:700;line-height:1.3}
        .mcarousel-meta{margin:auto 0 0;font-size:.72rem;color:var(--color-stone);display:flex;justify-content:space-between;gap:.5rem}

        .mcarousel-nav{
          position:absolute;top:calc(44% - 19px);width:38px;height:38px;border-radius:50%;
          background:rgba(250,247,242,.1);border:1px solid rgba(250,247,242,.25);color:var(--color-paper);
          display:flex;align-items:center;justify-content:center;font-size:1.2rem;cursor:pointer;
          backdrop-filter:blur(6px);transition:background .25s,color .25s;z-index:2;line-height:1;font-family:var(--font-sans);
        }
        .mcarousel-nav:hover{background:var(--color-teal);color:var(--color-ink)}
        .mcarousel-nav:focus-visible{outline:2px solid var(--color-teal);outline-offset:2px}
        .mcarousel-nav--prev{left:clamp(.25rem,2vw,1rem)}
        .mcarousel-nav--next{right:clamp(.25rem,2vw,1rem)}
        @media (max-width:640px){.mcarousel-nav{display:none}}

        @media (prefers-reduced-motion: reduce){
          .mcarousel-card,.mcarousel-play,.mcarousel-track{transition-duration:.01ms !important;scroll-behavior:auto !important}
        }
      `}</style>

      <div className="mcarousel-head">
        <div>
          <p
            className="mcarousel-eyebrow"
            data-cms="t:mcarousel-eyebrow"
            dangerouslySetInnerHTML={{ __html: tx(text, "mcarousel-eyebrow", "Listen Anywhere") }}
          />
          <h3
            className="mcarousel-heading"
            data-cms="t:mcarousel-heading"
            dangerouslySetInnerHTML={{ __html: tx(text, "mcarousel-heading", "The Plains Podcast &amp; more") }}
          />
        </div>
        <div className="mcarousel-tabs" role="group" aria-label="Filter media">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className="mcarousel-tab"
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
              data-cms={`t:mcarousel-tab-${f.id}`}
              dangerouslySetInnerHTML={{ __html: tx(text, `mcarousel-tab-${f.id}`, f.label) }}
            />
          ))}
        </div>
      </div>

      <div className="mcarousel-viewport">
        <button
          type="button"
          className="mcarousel-nav mcarousel-nav--prev"
          aria-label="Scroll to previous media"
          onClick={() => scrollByCards(-1)}
        >
          &#8249;
        </button>

        <div className="mcarousel-track" ref={trackRef}>
          {CARDS.map((c) => {
            const dimmed = filter !== "all" && c.kind !== filter;
            return (
              <a
                key={c.key}
                href={c.href}
                className={`mcarousel-card mcarousel-card--${c.kind}${dimmed ? " is-dimmed" : ""}`}
                aria-hidden={dimmed || undefined}
                tabIndex={dimmed ? -1 : undefined}
              >
                <div
                  className="mcarousel-art"
                  data-cms-bg={`mcarousel-${c.key}-bg`}
                  style={{ background: c.art }}
                >
                  <span
                    className="mcarousel-badge"
                    data-cms={`t:mcarousel-${c.key}-badge`}
                    dangerouslySetInnerHTML={{ __html: tx(text, `mcarousel-${c.key}-badge`, c.badge) }}
                  />
                  <span className="mcarousel-play" aria-hidden="true">&#9654;</span>
                </div>
                <div className="mcarousel-cbody">
                  <p
                    className="mcarousel-title"
                    data-cms={`t:mcarousel-${c.key}-title`}
                    dangerouslySetInnerHTML={{ __html: tx(text, `mcarousel-${c.key}-title`, c.title) }}
                  />
                  <p className="mcarousel-meta">
                    <span
                      data-cms={`t:mcarousel-${c.key}-meta1`}
                      dangerouslySetInnerHTML={{ __html: tx(text, `mcarousel-${c.key}-meta1`, c.meta1) }}
                    />
                    <span
                      data-cms={`t:mcarousel-${c.key}-meta2`}
                      dangerouslySetInnerHTML={{ __html: tx(text, `mcarousel-${c.key}-meta2`, c.meta2) }}
                    />
                  </p>
                </div>
              </a>
            );
          })}
        </div>

        <button
          type="button"
          className="mcarousel-nav mcarousel-nav--next"
          aria-label="Scroll to next media"
          onClick={() => scrollByCards(1)}
        >
          &#8250;
        </button>
      </div>
    </section>
  );
}
