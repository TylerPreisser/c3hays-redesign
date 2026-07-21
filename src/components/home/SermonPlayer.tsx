"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { tx, type BtnStyle } from "@/lib/home-content";

/**
 * SermonPlayer — an addable "sermon audio player" media section.
 *
 * Faithful port of the round-2 MEDIA mockup (`.d-splayer-`): a square series-art
 * panel (mesh + grain + series tag + center play button) beside an info panel with
 * eyebrow / title / speaker+scripture meta, a scrubber (track, fill, thumb, chapter
 * ticks, current/total times) and a transport row (back-15, play/pause, forward-15,
 * speed).
 *
 * The play/pause + scrub interactions are re-implemented as REAL React state — a
 * setInterval "progress clock" animates the fill and thumb along the track (a mock;
 * there is no real audio). Back/forward nudge the progress by 15s; the speed control
 * cycles 1× / 1.25× / 1.5× and scales the clock. Everything respects
 * `prefers-reduced-motion` (the decorative transitions collapse; the clock still runs).
 *
 * Editor-native by construction (mirrors EditorialRows / SermonFeature):
 *   • section container → data-cms-bg  ("splayer-bg")     — section background
 *   • art panel         → data-cms-bg  ("splayer-art-bg") — series-art tile background
 *   • every eyebrow/tag/title/meta/time → data-cms text ("t:splayer-…")
 *
 * Renders purely from the generic `text` override map, so it is addable via the
 * section library (engine renderExample) and looks intentional on first drop.
 */
export interface SermonPlayerProps {
  text?: Record<string, string>;
  btnStyle?: BtnStyle;
  variant?: string;
  className?: string;
}

/** Total sermon length (38:10) used to map progress % ↔ a displayed timestamp. */
const TOTAL_SECONDS = 38 * 60 + 10; // 2290
/** Default playhead (14:22 → ≈37.6%, matching the mockup's static fill). */
const INITIAL_SECONDS = 14 * 60 + 22; // 862
const INITIAL_PROGRESS = (INITIAL_SECONDS / TOTAL_SECONDS) * 100;

/** Chapter-marker positions along the track (percent), from the mockup. */
const CHAPTERS = [18, 42, 67, 85];
/** Playback-speed cycle. */
const SPEEDS = [1, 1.25, 1.5] as const;

const clamp = (n: number) => Math.min(100, Math.max(0, n));

function formatTime(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds));
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

const PlayIcon = ({ size = 20 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const PauseIcon = ({ size = 20 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
    <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
  </svg>
);

export default function SermonPlayer({ text, className }: SermonPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(INITIAL_PROGRESS);
  const [speedIndex, setSpeedIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const speed = SPEEDS[speedIndex];

  // Progress clock — advances the (mock) playhead while playing. Scaled by speed
  // so the fill/thumb visibly scan the track. Recreated when speed changes.
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setProgress((p) => {
        const next = p + 0.5 * speed;
        if (next >= 100) {
          setPlaying(false);
          return 100;
        }
        return next;
      });
    }, 220);
    return () => window.clearInterval(id);
  }, [playing, speed]);

  const togglePlay = useCallback(() => {
    setProgress((p) => (p >= 100 ? 0 : p));
    setPlaying((p) => !p);
  }, []);

  const nudge = useCallback((deltaSeconds: number) => {
    setProgress((p) => clamp(p + (deltaSeconds / TOTAL_SECONDS) * 100));
  }, []);

  const cycleSpeed = useCallback(() => {
    setSpeedIndex((i) => (i + 1) % SPEEDS.length);
  }, []);

  const seekFromClientX = useCallback((clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return;
    setProgress(clamp(((clientX - rect.left) / rect.width) * 100));
  }, []);

  const onTrackKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      switch (e.key) {
        case "ArrowLeft":
        case "ArrowDown":
          e.preventDefault();
          setProgress((p) => clamp(p - 2));
          break;
        case "ArrowRight":
        case "ArrowUp":
          e.preventDefault();
          setProgress((p) => clamp(p + 2));
          break;
        case "Home":
          e.preventDefault();
          setProgress(0);
          break;
        case "End":
          e.preventDefault();
          setProgress(100);
          break;
        default:
          break;
      }
    },
    []
  );

  const currentLabel = formatTime((progress / 100) * TOTAL_SECONDS);
  const totalLabel = tx(text, "splayer-time-total", "00:00");
  const speedLabel = `${speed}×`;

  return (
    <section
      className={`splayer-root ${className || ""}`}
      data-cms-bg="splayer-bg"
      style={{
        background: "var(--color-ink)",
        color: "var(--color-paper)",
        fontFamily: "var(--font-sans)",
      }}
    >
      <style>{`
        .splayer-root{
          position:relative; overflow:hidden;
          padding:clamp(2.5rem,5vw,5rem) clamp(1.25rem,4vw,3.5rem);
        }
        .splayer-root .splayer-inner{
          position:relative; z-index:1;
          max-width:940px; margin:0 auto;
          display:grid; grid-template-columns:minmax(200px,320px) 1fr;
          gap:clamp(1.5rem,4vw,3rem); align-items:center;
        }
        @media (max-width:720px){ .splayer-root .splayer-inner{ grid-template-columns:1fr; } }

        .splayer-root .splayer-art{
          position:relative; aspect-ratio:1/1; border-radius:18px; overflow:hidden;
          isolation:isolate; box-shadow:0 30px 60px -22px rgba(0,0,0,.6);
          background:var(--color-ink);
        }
        .splayer-root .splayer-mesh{
          position:absolute; inset:0; background-size:150% 150%; background-position:28% 32%;
          background-image:
            radial-gradient(120% 100% at 15% 10%, rgba(28,195,175,.85), transparent 55%),
            radial-gradient(90% 90% at 85% 20%, rgba(23,156,140,.9), transparent 60%),
            radial-gradient(100% 120% at 50% 100%, rgba(26,24,21,.95), transparent 65%),
            linear-gradient(155deg,#123330,#0d1a18 60%,#1b1c1c);
          transition:background-position 1.4s cubic-bezier(.16,1,.3,1), transform 1.4s cubic-bezier(.16,1,.3,1);
        }
        .splayer-root .splayer-art:hover .splayer-mesh,
        .splayer-root .splayer-art:focus-within .splayer-mesh{
          background-position:70% 62%; transform:scale(1.06);
        }
        .splayer-root .splayer-grain{
          position:absolute; inset:0; opacity:.12; mix-blend-mode:overlay;
          background-image:repeating-linear-gradient(0deg, rgba(255,255,255,.4) 0 1px, transparent 1px 3px);
        }
        .splayer-root .splayer-series-tag{
          position:absolute; left:14px; top:14px; z-index:2;
          font-size:.65rem; letter-spacing:.14em; text-transform:uppercase;
          padding:.35em .75em; border-radius:999px; color:var(--color-paper);
          background:rgba(250,247,242,.14); backdrop-filter:blur(6px);
          border:1px solid rgba(250,247,242,.22);
        }
        .splayer-root .splayer-play{
          position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); z-index:2;
          width:64px; height:64px; border-radius:50%; border:none; cursor:pointer;
          display:flex; align-items:center; justify-content:center;
          background:var(--color-paper); color:var(--color-ink);
          box-shadow:0 8px 24px rgba(0,0,0,.4);
          transition:transform .3s cubic-bezier(.34,1.56,.64,1), background .3s, color .3s;
        }
        .splayer-root .splayer-play svg{ margin-left:3px; }
        .splayer-root .splayer-play.is-playing svg{ margin-left:0; }
        .splayer-root .splayer-play:hover{ transform:translate(-50%,-50%) scale(1.12); background:var(--color-teal); }
        .splayer-root .splayer-play:active{ transform:translate(-50%,-50%) scale(.94); }
        .splayer-root .splayer-play:focus-visible{ outline:2px solid var(--color-teal); outline-offset:3px; }

        .splayer-root .splayer-info{ display:flex; flex-direction:column; gap:.85rem; }
        .splayer-root .splayer-eyebrow{ font-size:.72rem; letter-spacing:.16em; text-transform:uppercase; color:var(--color-teal); font-weight:600; }
        .splayer-root .splayer-title{ margin:0; font-size:clamp(1.6rem,3.4vw,2.4rem); font-weight:700; letter-spacing:-.01em; line-height:1.05; }
        .splayer-root .splayer-meta{ margin:0; display:flex; gap:.55em; align-items:baseline; color:var(--color-sand); font-size:.95rem; flex-wrap:wrap; }
        .splayer-root .splayer-ref{ font-family:"Iowan Old Style",Palatino,Georgia,serif; font-style:italic; color:var(--color-paper); opacity:.85; }
        .splayer-root .splayer-dot{ opacity:.5; }

        .splayer-root .splayer-scrub{ margin-top:.35rem; }
        .splayer-root .splayer-track{ position:relative; height:5px; border-radius:3px; background:rgba(250,247,242,.16); cursor:pointer; }
        .splayer-root .splayer-track:focus-visible{ outline:2px solid var(--color-teal); outline-offset:4px; }
        .splayer-root .splayer-fill{
          position:absolute; inset:0 auto 0 0; border-radius:3px;
          background:linear-gradient(90deg, var(--color-teal-deep), var(--color-teal));
          transition:width .22s ease;
        }
        .splayer-root .splayer-thumb{
          position:absolute; top:50%; width:13px; height:13px; border-radius:50%;
          background:var(--color-paper); transform:translate(-50%,-50%);
          box-shadow:0 0 0 4px rgba(28,195,175,.25); transition:left .22s ease;
        }
        .splayer-root .splayer-chapters span{
          position:absolute; top:50%; width:2px; height:9px; border-radius:1px;
          background:rgba(26,24,21,.55); transform:translate(-50%,-50%);
        }

        .splayer-root .splayer-times{ display:flex; justify-content:space-between; font-size:.75rem; color:var(--color-stone); margin-top:.4rem; font-variant-numeric:tabular-nums; }

        .splayer-root .splayer-controls{ display:flex; align-items:center; gap:.65rem; margin-top:.2rem; }
        .splayer-root .splayer-ctrl{
          border:1px solid rgba(250,247,242,.25); background:transparent; color:var(--color-paper);
          font-size:.72rem; letter-spacing:.03em; padding:.5em .8em; border-radius:999px; cursor:pointer;
          transition:background .25s, border-color .25s; font-family:var(--font-sans);
        }
        .splayer-root .splayer-ctrl:hover{ background:rgba(250,247,242,.12); border-color:var(--color-teal); }
        .splayer-root .splayer-ctrl:focus-visible{ outline:2px solid var(--color-teal); outline-offset:2px; }
        .splayer-root .splayer-ctrl--main{ width:34px; height:34px; padding:0; display:flex; align-items:center; justify-content:center; background:var(--color-teal); border-color:var(--color-teal); color:var(--color-ink); }
        .splayer-root .splayer-ctrl--main:hover{ background:var(--color-paper); }
        .splayer-root .splayer-speed{
          margin-left:auto; font-size:.72rem; color:var(--color-stone);
          border:1px solid rgba(250,247,242,.2); background:transparent;
          padding:.4em .7em; border-radius:999px; cursor:pointer; font-family:var(--font-sans);
          transition:background .25s, border-color .25s, color .25s;
        }
        .splayer-root .splayer-speed:hover{ color:var(--color-paper); border-color:var(--color-teal); }
        .splayer-root .splayer-speed:focus-visible{ outline:2px solid var(--color-teal); outline-offset:2px; }

        @media (prefers-reduced-motion: reduce){
          .splayer-root .splayer-mesh,
          .splayer-root .splayer-fill,
          .splayer-root .splayer-thumb,
          .splayer-root .splayer-play,
          .splayer-root .splayer-ctrl,
          .splayer-root .splayer-speed{ transition-duration:.01ms !important; animation:none !important; }
        }
      `}</style>

      <div className="splayer-inner">
        <div className="splayer-art" data-cms-bg="splayer-art-bg">
          <div className="splayer-mesh" aria-hidden="true" />
          <div className="splayer-grain" aria-hidden="true" />
          <span
            className="splayer-series-tag"
            data-cms="t:splayer-series-tag"
            dangerouslySetInnerHTML={{ __html: tx(text, "splayer-series-tag", "Series &middot; Series title") }}
          />
          <button
            type="button"
            className={`splayer-play${playing ? " is-playing" : ""}`}
            aria-label={playing ? "Pause sermon" : "Play sermon"}
            aria-pressed={playing}
            onClick={togglePlay}
          >
            {playing ? <PauseIcon size={20} /> : <PlayIcon size={20} />}
          </button>
        </div>

        <div className="splayer-info">
          <span
            className="splayer-eyebrow"
            data-cms="t:splayer-eyebrow"
            dangerouslySetInnerHTML={{ __html: tx(text, "splayer-eyebrow", "C3 Church &middot; Hays Campus") }}
          />
          <h3
            className="splayer-title"
            data-cms="t:splayer-title"
            dangerouslySetInnerHTML={{ __html: tx(text, "splayer-title", "Message title") }}
          />
          <p className="splayer-meta">
            <span
              className="splayer-speaker"
              data-cms="t:splayer-speaker"
              dangerouslySetInnerHTML={{ __html: tx(text, "splayer-speaker", "Speaker name") }}
            />
            <span className="splayer-dot" aria-hidden="true">&middot;</span>
            <span
              className="splayer-ref"
              data-cms="t:splayer-ref"
              dangerouslySetInnerHTML={{ __html: tx(text, "splayer-ref", "Scripture reference") }}
            />
          </p>

          <div className="splayer-scrub">
            <div
              ref={trackRef}
              className="splayer-track"
              role="slider"
              tabIndex={0}
              aria-label="Seek sermon"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress)}
              aria-valuetext={`${currentLabel} of ${totalLabel}`}
              onKeyDown={onTrackKeyDown}
              onPointerDown={(e) => seekFromClientX(e.clientX)}
            >
              <div className="splayer-fill" style={{ width: `${progress}%` }} />
              <div className="splayer-thumb" style={{ left: `${progress}%` }} />
              <div className="splayer-chapters" aria-hidden="true">
                {CHAPTERS.map((left) => (
                  <span key={left} style={{ left: `${left}%` }} />
                ))}
              </div>
            </div>
            <div className="splayer-times">
              <span data-cms="t:splayer-time-current">{currentLabel}</span>
              <span
                data-cms="t:splayer-time-total"
                dangerouslySetInnerHTML={{ __html: totalLabel }}
              />
            </div>
          </div>

          <div className="splayer-controls">
            <button
              type="button"
              className="splayer-ctrl"
              aria-label="Back 15 seconds"
              onClick={() => nudge(-15)}
            >
              &minus;15
            </button>
            <button
              type="button"
              className="splayer-ctrl splayer-ctrl--main"
              aria-label={playing ? "Pause" : "Play"}
              aria-pressed={playing}
              onClick={togglePlay}
            >
              {playing ? <PauseIcon size={14} /> : <PlayIcon size={14} />}
            </button>
            <button
              type="button"
              className="splayer-ctrl"
              aria-label="Forward 15 seconds"
              onClick={() => nudge(15)}
            >
              +15
            </button>
            <button
              type="button"
              className="splayer-speed"
              aria-label={`Playback speed ${speedLabel}, tap to change`}
              onClick={cycleSpeed}
            >
              {speedLabel}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
