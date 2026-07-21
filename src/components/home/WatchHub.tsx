"use client";

import { useState } from "react";
import { tx, type BtnStyle } from "@/lib/home-content";

/**
 * WatchHub — an addable "Watch & Listen Hub" media section.
 *
 * Faithful port of the round-2 MEDIA "Watch / Listen Hub" mockup (`.d-whub-`):
 * a two-panel split — a left "watch" video tile (mesh art, play button, progress
 * ticks, caption) beside a right "listen" panel (animated waveform, now-playing
 * card, scrollable episode list). Selecting an episode row swaps the now-playing
 * card and highlights the active row.
 *
 * LAYOUT FIX (bug in the mockup): the right panel overlapped the left. Rebuilt as
 * a clean CSS grid — two equal columns (`grid-template-columns:1fr 1fr`) with a
 * gap and `min-width:0` on each child so neither panel can overflow into or sit on
 * top of the other; it collapses to a single column at <=820px. No absolutely
 * positioned overlapping panels.
 *
 * INTERACTIVITY: the mockup switched episodes via a CSS `:checked` radio hack.
 * That is reimplemented here with React `useState` so the toggle truly works and
 * stays accessible (real <button> rows, `aria-pressed`, `aria-current`).
 *
 * Editor-native by construction (mirrors EditorialRows / SermonFeature):
 *   • section container → data-cms-bg  ("whub-bg")          — section background
 *   • left watch tile   → data-cms-bg  ("whub-watch-bg")    — video mesh art
 *   • right listen panel→ data-cms-bg  ("whub-listen-bg")   — listen panel bg
 *   • every eyebrow/heading/caption/episode text → data-cms text ("t:whub-…")
 */
export interface WatchHubProps {
  text?: Record<string, string>;
  btnStyle?: BtnStyle;
  variant?: string;
  className?: string;
}

interface EpisodeDef {
  key: string;
  title: string;
  ref: string;
  panelMeta: string; // speaker prefix shown before the ref in the now-playing card
  panelDur: string;
  rowMeta: string; // speaker · campus shown in the list row
  dur: string;
}

const EPISODES: EpisodeDef[] = [
  {
    key: "ep1",
    title: "Message title",
    ref: "Scripture reference",
    panelMeta: "Speaker name",
    panelDur: "00:00",
    rowMeta: "Hays",
    dur: "00:00",
  },
  {
    key: "ep2",
    title: "Message title",
    ref: "Scripture reference",
    panelMeta: "Speaker name",
    panelDur: "00:00",
    rowMeta: "Colby",
    dur: "00:00",
  },
  {
    key: "ep3",
    title: "Message title",
    ref: "Scripture reference",
    panelMeta: "Speaker name",
    panelDur: "00:00",
    rowMeta: "Hays",
    dur: "00:00",
  },
  {
    key: "ep4",
    title: "Message title",
    ref: "Scripture reference",
    panelMeta: "Speaker name",
    panelDur: "00:00",
    rowMeta: "Hays",
    dur: "00:00",
  },
  {
    key: "ep5",
    title: "Message title",
    ref: "Scripture reference",
    panelMeta: "Speaker name",
    panelDur: "00:00",
    rowMeta: "Colby",
    dur: "00:00",
  },
];

/** Waveform bars — height factor + animation-delay, from the mockup. */
const WAVE: Array<{ h: number; d: string }> = [
  { h: 0.5, d: "-1.1s" }, { h: 0.8, d: "-.4s" }, { h: 0.35, d: "-1.6s" },
  { h: 0.9, d: "-.8s" }, { h: 0.6, d: "-1.3s" }, { h: 0.4, d: "-.2s" },
  { h: 0.85, d: "-1.5s" }, { h: 0.55, d: "-.6s" }, { h: 0.7, d: "-1.0s" },
  { h: 0.3, d: "-.3s" }, { h: 0.9, d: "-1.4s" }, { h: 0.5, d: "-.7s" },
  { h: 0.65, d: "-1.2s" }, { h: 0.4, d: "-.5s" }, { h: 0.8, d: "-1.6s" },
  { h: 0.5, d: "-.1s" }, { h: 0.7, d: "-.9s" }, { h: 0.35, d: "-1.3s" },
  { h: 0.85, d: "-.4s" }, { h: 0.55, d: "-1.1s" },
];

export default function WatchHub({ text, className }: WatchHubProps) {
  const [active, setActive] = useState(0);
  const activeEp = EPISODES[active];

  return (
    <section
      className={`whub-root ${className || ""}`}
      data-cms-bg="whub-bg"
      style={{
        position: "relative",
        background: "var(--color-paper)",
        color: "var(--color-ink)",
        fontFamily: "var(--font-sans)",
        padding: "clamp(2.5rem,5vw,5rem) clamp(1.25rem,4vw,3.5rem)",
      }}
    >
      <style>{`
        .whub-root .whub-head{max-width:960px;margin:0 auto 2.25rem}
        .whub-eyebrow{font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;color:var(--color-teal-deep);font-weight:700}
        .whub-heading{margin:.4rem 0 0;font-size:clamp(1.5rem,3vw,2.2rem);font-weight:700;letter-spacing:-.01em;max-width:26ch;color:inherit}

        /* --- LAYOUT FIX: two clean grid columns, no overlap --- */
        .whub-grid{
          max-width:1000px;margin:0 auto;display:grid;
          grid-template-columns:1fr 1fr;gap:clamp(1.5rem,4vw,2.5rem);align-items:start;
        }
        .whub-grid > *{min-width:0}
        @media (max-width:820px){ .whub-grid{ grid-template-columns:1fr; } }

        .whub-video{
          position:relative;border-radius:16px;overflow:hidden;aspect-ratio:16/11;isolation:isolate;
          box-shadow:0 24px 50px -24px rgba(27,28,28,.35);min-height:260px;
        }
        .whub-video-mesh{
          position:absolute;inset:0;transition:transform 1s cubic-bezier(.16,1,.3,1);
          background:
            radial-gradient(90% 90% at 20% 15%, rgba(28,195,175,.55), transparent 60%),
            radial-gradient(100% 100% at 90% 90%, rgba(233,226,214,.45), transparent 55%),
            linear-gradient(160deg,#1b1c1c,#23413d 70%);
        }
        .whub-video:hover .whub-video-mesh{ transform:scale(1.06); }
        .whub-chip{
          position:absolute;left:14px;top:14px;z-index:2;background:rgba(250,247,242,.92);color:var(--color-ink);
          font-size:.62rem;letter-spacing:.12em;text-transform:uppercase;font-weight:800;
          padding:.35em .7em;border-radius:999px;
        }
        .whub-campus{
          position:absolute;right:14px;top:14px;z-index:2;font-size:.62rem;letter-spacing:.1em;text-transform:uppercase;
          color:var(--color-paper);background:rgba(27,28,28,.4);padding:.35em .7em;border-radius:999px;backdrop-filter:blur(4px);
        }
        .whub-play{
          position:absolute;left:50%;top:44%;transform:translate(-50%,-50%);z-index:2;
          width:58px;height:58px;border-radius:50%;border:none;cursor:pointer;
          background:var(--color-paper);color:var(--color-ink);display:flex;align-items:center;justify-content:center;
          box-shadow:0 10px 26px rgba(0,0,0,.35);transition:transform .3s cubic-bezier(.34,1.56,.64,1),background .3s;
        }
        .whub-play svg{ margin-left:3px; }
        .whub-play:hover{ transform:translate(-50%,-50%) scale(1.12); background:var(--color-teal); }
        .whub-ticks{ position:absolute;left:14px;right:14px;bottom:38px;display:flex;gap:4px;z-index:2; }
        .whub-ticks span{ flex:1;height:3px;border-radius:2px;background:rgba(250,247,242,.28); }
        .whub-ticks span:nth-child(-n+3){ background:var(--color-teal); }
        .whub-video-caption{
          position:absolute;left:14px;bottom:12px;right:14px;z-index:2;margin:0;
          color:var(--color-paper);font-size:.78rem;opacity:.9;
        }

        .whub-listen{
          position:relative;display:flex;flex-direction:column;gap:.9rem;
          background:var(--color-paper-soft);border:1px solid var(--color-sand);border-radius:16px;padding:1.25rem;
        }
        .whub-wave{ display:flex;align-items:flex-end;gap:3px;height:40px; }
        .whub-wave span{
          flex:1;border-radius:2px;transform-origin:bottom;height:calc(var(--h,.5) * 100%);
          background:linear-gradient(180deg, var(--color-teal), var(--color-teal-deep));
          animation:whub-bounce 1.7s ease-in-out infinite;
        }
        @keyframes whub-bounce{ 0%,100%{ transform:scaleY(.55); } 50%{ transform:scaleY(1); } }

        .whub-nowplaying{ border-top:1px solid var(--color-sand);border-bottom:1px solid var(--color-sand);padding:.75rem 0; }
        .whub-np-label{ display:block;font-size:.62rem;letter-spacing:.14em;text-transform:uppercase;color:var(--color-teal-deep);font-weight:700;margin-bottom:.3rem; }
        .whub-panel-title{ margin:0;font-weight:700;font-size:1.02rem;color:inherit; }
        .whub-panel-meta{ margin:.15rem 0 0;color:var(--color-stone);font-size:.78rem; }
        .whub-panel-ref{ font-family:"Iowan Old Style",Palatino,Georgia,serif;font-style:italic;color:var(--color-teal-deep); }

        .whub-list{ list-style:none;margin:0;padding:0 .3rem 0 0;display:flex;flex-direction:column;gap:.3rem;max-height:220px;overflow-y:auto; }
        .whub-list::-webkit-scrollbar{ width:6px; }
        .whub-list::-webkit-scrollbar-thumb{ background:var(--color-sand);border-radius:3px; }
        .whub-row{
          width:100%;text-align:left;background:transparent;border:none;font-family:inherit;color:inherit;
          display:flex;align-items:center;justify-content:space-between;gap:.75rem;
          padding:.55em .7em;border-radius:10px;cursor:pointer;transition:background .2s,color .2s;
        }
        .whub-row:hover{ background:rgba(28,195,175,.1); }
        .whub-row-text{ display:flex;flex-direction:column;gap:.1rem; }
        .whub-row-title{ font-size:.84rem;font-weight:600; }
        .whub-row-meta{ font-size:.7rem;color:var(--color-stone); }
        .whub-row-dur{ font-size:.74rem;color:var(--color-teal-deep);font-variant-numeric:tabular-nums;flex-shrink:0; }
        .whub-row.is-active{ background:var(--color-ink);color:var(--color-paper); }
        .whub-row.is-active .whub-row-meta{ color:var(--color-sand); }
        .whub-row.is-active .whub-row-dur{ color:var(--color-teal); }
        .whub-row:focus-visible{ outline:2px solid var(--color-teal);outline-offset:2px; }

        @media (prefers-reduced-motion: reduce){
          .whub-wave span{ animation:none;transform:scaleY(.7); }
          .whub-video-mesh, .whub-play{ transition-duration:.01ms !important; }
        }
      `}</style>

      <div className="whub-head">
        <span
          className="whub-eyebrow"
          data-cms="t:whub-eyebrow"
          dangerouslySetInnerHTML={{ __html: tx(text, "whub-eyebrow", "Watch &amp; Listen") }}
        />
        <h3
          className="whub-heading"
          data-cms="t:whub-heading"
          dangerouslySetInnerHTML={{ __html: tx(text, "whub-heading", "Catch up on the latest from Hays &amp; Colby") }}
        />
      </div>

      <div className="whub-grid">
        {/* LEFT — watch panel */}
        <div className="whub-video" data-cms-bg="whub-watch-bg">
          <div className="whub-video-mesh" aria-hidden="true" />
          <span
            className="whub-chip"
            data-cms="t:whub-chip"
            dangerouslySetInnerHTML={{ __html: tx(text, "whub-chip", "Replay") }}
          />
          <span
            className="whub-campus"
            data-cms="t:whub-campus"
            dangerouslySetInnerHTML={{ __html: tx(text, "whub-campus", "Hays Campus") }}
          />
          <button className="whub-play" type="button" aria-label="Play video">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
          </button>
          <div className="whub-ticks" aria-hidden="true">
            <span /><span /><span /><span /><span /><span /><span /><span />
          </div>
          <p
            className="whub-video-caption"
            data-cms="t:whub-video-caption"
            dangerouslySetInnerHTML={{ __html: tx(text, "whub-video-caption", "Message title &middot; Campus &middot; 00:00") }}
          />
        </div>

        {/* RIGHT — listen panel */}
        <div className="whub-listen" data-cms-bg="whub-listen-bg">
          <div className="whub-wave" aria-hidden="true">
            {WAVE.map((w, i) => (
              <span key={i} style={{ ["--h" as string]: String(w.h), animationDelay: w.d }} />
            ))}
          </div>

          <div className="whub-nowplaying">
            <span
              className="whub-np-label"
              data-cms="t:whub-np-label"
              dangerouslySetInnerHTML={{ __html: tx(text, "whub-np-label", "Now Playing") }}
            />
            <p
              className="whub-panel-title"
              data-cms={`t:whub-${activeEp.key}-title`}
              dangerouslySetInnerHTML={{ __html: tx(text, `whub-${activeEp.key}-title`, activeEp.title) }}
            />
            <p className="whub-panel-meta">
              <span
                data-cms={`t:whub-${activeEp.key}-panel-meta`}
                dangerouslySetInnerHTML={{ __html: tx(text, `whub-${activeEp.key}-panel-meta`, activeEp.panelMeta) }}
              />
              {" "}&middot;{" "}
              <span
                className="whub-panel-ref"
                data-cms={`t:whub-${activeEp.key}-ref`}
                dangerouslySetInnerHTML={{ __html: tx(text, `whub-${activeEp.key}-ref`, activeEp.ref) }}
              />
              {" "}&middot;{" "}
              <span
                data-cms={`t:whub-${activeEp.key}-dur`}
                dangerouslySetInnerHTML={{ __html: tx(text, `whub-${activeEp.key}-dur`, activeEp.panelDur) }}
              />
            </p>
          </div>

          <ul className="whub-list">
            {EPISODES.map((ep, i) => (
              <li key={ep.key}>
                <button
                  type="button"
                  className={`whub-row${i === active ? " is-active" : ""}`}
                  aria-pressed={i === active}
                  aria-current={i === active ? "true" : undefined}
                  onClick={() => setActive(i)}
                >
                  <span className="whub-row-text">
                    <span
                      className="whub-row-title"
                      data-cms={`t:whub-${ep.key}-title`}
                      dangerouslySetInnerHTML={{ __html: tx(text, `whub-${ep.key}-title`, ep.title) }}
                    />
                    <span
                      className="whub-row-meta"
                      data-cms={`t:whub-${ep.key}-row-meta`}
                      dangerouslySetInnerHTML={{ __html: tx(text, `whub-${ep.key}-row-meta`, ep.rowMeta) }}
                    />
                  </span>
                  <span
                    className="whub-row-dur"
                    data-cms={`t:whub-${ep.key}-row-dur`}
                    dangerouslySetInnerHTML={{ __html: tx(text, `whub-${ep.key}-row-dur`, ep.dur) }}
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
