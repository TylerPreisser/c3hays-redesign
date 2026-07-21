"use client";

import { useState } from "react";
import { tx, type BtnStyle } from "@/lib/home-content";

/**
 * CampusMap — an addable "interactive campus map" navigation section.
 *
 * Faithful port of the round-2 NAVIGATE mockup (`.d-campusmap-`): a stylized,
 * illustrated SVG map (I-70 corridor, Big Creek, highway shield, mile ticks) with
 * two interactive campus pins (Hays / Colby). Selecting a pin swaps the info panel
 * beside the map to that campus's address, service times, and parking notes.
 *
 * The mockup drove selection with a CSS radio/`:checked ~` hack; here it is
 * reimplemented with React `useState` so it keeps working once componentized —
 * the pins are real <button aria-pressed> controls, keyboard-focusable, and the
 * whole thing respects prefers-reduced-motion.
 *
 * Editor-native by construction (mirrors EditorialRows):
 *   • section container → data-cms-bg  ("campusmap-bg")     — section background
 *   • the map panel     → data-cms-bg  ("campusmap-map-bg") — illustrated map tile
 *   • every eyebrow/heading/body/pin-tag/card field → data-cms text ("t:campusmap-…")
 *
 * Renders purely from the generic `text` override map, so it is addable via the
 * section library and looks intentional on first drop.
 */
export interface CampusMapProps {
  text?: Record<string, string>;
  btnStyle?: BtnStyle;
  variant?: string;
  className?: string;
}

interface CardRow { field: string; icon: "pin" | "clock" | "car"; label: string; value: string; }
interface Campus {
  id: "hays" | "colby";
  tag: string;
  sub: string;
  title: string;
  /** pin position on the illustrated map, as % of the mapbox */
  left: string;
  top: string;
  rows: CardRow[];
}

const ICONS: Record<CardRow["icon"], React.ReactNode> = {
  pin: (
    <svg className="campusmap-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.4" />
    </svg>
  ),
  clock: (
    <svg className="campusmap-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  ),
  car: (
    <svg className="campusmap-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="7" width="18" height="12" rx="2" />
      <path d="M7 7V5.5A2.5 2.5 0 0 1 9.5 3h5A2.5 2.5 0 0 1 17 5.5V7" />
    </svg>
  ),
};

const CAMPUSES: Campus[] = [
  {
    id: "hays",
    tag: "Hays Campus",
    sub: "Hays Campus",
    title: "C3 Church &mdash; Hays",
    left: "76%",
    top: "38%",
    rows: [
      { field: "address", icon: "pin", label: "Address", value: "5790 230th Ave, Hays, KS" },
      { field: "times", icon: "clock", label: "Service Times", value: "Saturdays 5:00 PM &middot; Sundays 8:00, 9:30 &amp; 11:00 AM" },
      { field: "parking", icon: "car", label: "Parking", value: "Add details" },
    ],
  },
  {
    id: "colby",
    tag: "Colby Campus",
    sub: "Colby Campus",
    title: "C3 Church &mdash; Colby",
    left: "18%",
    top: "68%",
    rows: [
      { field: "address", icon: "pin", label: "Address", value: "1923 S Range, Colby, KS" },
      { field: "times", icon: "clock", label: "Service Times", value: "Sundays 10:00 AM" },
      { field: "parking", icon: "car", label: "Parking", value: "Add details" },
    ],
  },
];

export default function CampusMap({ text, className }: CampusMapProps) {
  const [selected, setSelected] = useState<"hays" | "colby">("hays");
  const active = CAMPUSES.find((c) => c.id === selected) ?? CAMPUSES[0];

  return (
    <section
      className={`campusmap-root ${className || ""}`}
      data-cms-bg="campusmap-bg"
      style={{
        background: "var(--color-ink)",
        color: "var(--color-paper)",
        fontFamily: "var(--font-sans)",
        padding: "clamp(3rem,6vw,5.5rem) clamp(1.25rem,5vw,4rem)",
        position: "relative",
        overflow: "hidden",
        isolation: "isolate",
      }}
    >
      <style>{`
        .campusmap-root{--campusmap-gap:clamp(1.5rem,3vw,3rem);max-width:100%}
        .campusmap-root *{box-sizing:border-box}
        .campusmap-root img,.campusmap-root svg{max-width:100%}
        .campusmap-head{max-width:64rem;margin:0 0 2.25rem;position:relative;z-index:2}
        .campusmap-eyebrow{font-size:.72rem;letter-spacing:.22em;text-transform:uppercase;color:var(--color-teal);font-weight:700;display:block;margin-bottom:.75rem}
        .campusmap-heading{font-size:clamp(1.8rem,3.4vw,2.8rem);line-height:1.05;font-weight:700;margin:0 0 .85rem;letter-spacing:-.01em}
        .campusmap-body{font-size:1.05rem;line-height:1.55;color:var(--color-sand);max-width:42rem;margin:0}

        .campusmap-wrap{position:relative;display:grid;grid-template-columns:1.5fr 1fr;gap:var(--campusmap-gap);align-items:stretch;width:100%;min-width:0}

        .campusmap-mapbox{position:relative;border-radius:1.1rem;overflow:hidden;border:1px solid rgba(250,247,242,.12);background:linear-gradient(160deg,#12302c 0%,var(--color-ink) 62%);min-height:380px;min-width:0;width:100%}
        .campusmap-svg{position:absolute;inset:0;width:100%;height:100%;display:block}

        .campusmap-pin{position:absolute;transform:translate(-50%,-100%);display:flex;flex-direction:column;align-items:center;cursor:pointer;z-index:3;background:none;border:0;padding:0;font-family:inherit}
        .campusmap-pin:focus-visible{outline:2px solid var(--color-teal);outline-offset:4px;border-radius:.3rem}
        .campusmap-pin-dot{width:1.15rem;height:1.15rem;border-radius:50% 50% 50% 0;background:var(--color-teal);transform:rotate(-45deg);box-shadow:0 0 0 4px rgba(28,195,175,.22);transition:background .2s ease,box-shadow .2s ease,transform .2s ease}
        .campusmap-pin-tag{margin-top:.5rem;font-size:.7rem;letter-spacing:.06em;text-transform:uppercase;font-weight:700;color:var(--color-paper);background:rgba(27,28,28,.72);padding:.3rem .6rem;border-radius:.4rem;white-space:nowrap;opacity:0;transform:translateY(4px);transition:opacity .18s ease,transform .18s ease;pointer-events:none}
        .campusmap-pin:hover .campusmap-pin-tag,.campusmap-pin:focus-visible .campusmap-pin-tag,.campusmap-pin[aria-pressed="true"] .campusmap-pin-tag{opacity:1;transform:translateY(0)}
        .campusmap-pin:hover .campusmap-pin-dot,.campusmap-pin:focus-visible .campusmap-pin-dot{transform:rotate(-45deg) scale(1.18)}
        .campusmap-pin[aria-pressed="true"] .campusmap-pin-dot{background:var(--color-paper);box-shadow:0 0 0 5px rgba(28,195,175,.55)}

        .campusmap-cards{position:relative;display:flex;flex-direction:column;min-width:0;width:100%}
        .campusmap-card{display:flex;flex-direction:column;gap:1rem;background:var(--color-paper);color:var(--color-ink);border-radius:1.1rem;padding:clamp(1.4rem,2.6vw,2rem);height:100%}
        .campusmap-card-title{font-size:1.3rem;font-weight:700;margin:0;letter-spacing:-.01em}
        .campusmap-card-sub{font-size:.78rem;text-transform:uppercase;letter-spacing:.14em;color:var(--color-teal-deep);font-weight:700;margin:0 0 -.5rem}
        .campusmap-card-row{display:flex;gap:.8rem;align-items:flex-start;font-size:.94rem;line-height:1.45;color:var(--color-ink)}
        .campusmap-card-row strong{display:block;font-size:.72rem;text-transform:uppercase;letter-spacing:.1em;color:var(--color-stone);margin-bottom:.15rem;font-weight:700}
        .campusmap-card-icon{flex:none;width:1.3rem;height:1.3rem;color:var(--color-teal-deep);margin-top:.1rem}

        /* Bug #6 fix: reflow to a single stacked column on narrow screens (map above, details below) */
        @media (max-width:820px){
          .campusmap-wrap{grid-template-columns:1fr;gap:1.5rem}
          .campusmap-mapbox{min-height:0;aspect-ratio:16/10;width:100%}
          .campusmap-cards{width:100%}
          .campusmap-card{height:auto;width:100%}
          .campusmap-card-row{word-break:break-word;overflow-wrap:anywhere}
        }
        @media (max-width:480px){
          .campusmap-mapbox{aspect-ratio:4/3}
        }

        @media (prefers-reduced-motion:reduce){.campusmap-pin-dot,.campusmap-pin-tag{transition:none}}
      `}</style>

      <div className="campusmap-head">
        <span
          className="campusmap-eyebrow"
          data-cms="t:campusmap-eyebrow"
          dangerouslySetInnerHTML={{ __html: tx(text, "campusmap-eyebrow", "Find us") }}
        />
        <h2
          className="campusmap-heading"
          data-cms="t:campusmap-heading"
          dangerouslySetInnerHTML={{ __html: tx(text, "campusmap-heading", "Our Campuses") }}
        />
        <p
          className="campusmap-body"
          data-cms="t:campusmap-body"
          dangerouslySetInnerHTML={{ __html: tx(text, "campusmap-body", "C3 sits along the I-70 corridor in northwest Kansas &mdash; Hays to the east, Colby about an hour west. Select a pin to see service times, address, and where to park.") }}
        />
      </div>

      <div className="campusmap-wrap">
        <div className="campusmap-mapbox" data-cms-bg="campusmap-map-bg">
          <svg className="campusmap-svg" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
            <defs>
              <linearGradient id="campusmap-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#0f2422" />
                <stop offset="1" stopColor="#1b1c1c" />
              </linearGradient>
              <pattern id="campusmap-fieldpat" width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(20)">
                <line x1="0" y1="0" x2="0" y2="26" stroke="#faf7f2" strokeOpacity="0.05" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="1000" height="500" fill="url(#campusmap-sky)" />
            <rect width="1000" height="500" fill="url(#campusmap-fieldpat)" />

            {/* Big Creek, winding near Hays */}
            <path d="M 980 40 C 880 120, 900 200, 820 260 C 760 305, 790 360, 720 420 C 680 450, 690 480, 640 500" fill="none" stroke="#179c8c" strokeOpacity="0.55" strokeWidth="7" strokeLinecap="round" />
            <path d="M 980 40 C 880 120, 900 200, 820 260 C 760 305, 790 360, 720 420 C 680 450, 690 480, 640 500" fill="none" stroke="#1cc3af" strokeOpacity="0.25" strokeWidth="16" strokeLinecap="round" />

            {/* I-70 corridor */}
            <line x1="60" y1="262" x2="940" y2="230" stroke="#8c857a" strokeWidth="10" strokeLinecap="round" opacity="0.5" />
            <line x1="60" y1="262" x2="940" y2="230" stroke="#faf7f2" strokeWidth="2" strokeDasharray="14 12" opacity="0.8" />
            {/* mile ticks */}
            <g stroke="#faf7f2" strokeOpacity="0.35" strokeWidth="2">
              <line x1="180" y1="248" x2="180" y2="264" />
              <line x1="320" y1="242" x2="320" y2="258" />
              <line x1="460" y1="238" x2="460" y2="254" />
              <line x1="600" y1="236" x2="600" y2="252" />
              <line x1="740" y1="232" x2="740" y2="248" />
            </g>

            {/* highway shield */}
            <g transform="translate(430,300)">
              <rect x="-26" y="-20" width="52" height="42" rx="7" fill="#faf7f2" opacity="0.92" />
              <text x="0" y="8" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="700" fontSize="22" fill="#1b1c1c">70</text>
            </g>

            {/* Colby road spur */}
            <path d="M 180 262 L 178 340" stroke="#8c857a" strokeOpacity="0.5" strokeWidth="6" strokeLinecap="round" />
            {/* Hays road spur */}
            <path d="M 760 234 L 762 190" stroke="#8c857a" strokeOpacity="0.5" strokeWidth="6" strokeLinecap="round" />
          </svg>

          {CAMPUSES.map((c) => (
            <button
              key={c.id}
              type="button"
              className="campusmap-pin"
              style={{ left: c.left, top: c.top }}
              aria-pressed={selected === c.id}
              aria-label={`Show ${c.sub} details`}
              onClick={() => setSelected(c.id)}
            >
              <span
                className="campusmap-pin-tag"
                data-cms={`t:campusmap-${c.id}-tag`}
                dangerouslySetInnerHTML={{ __html: tx(text, `campusmap-${c.id}-tag`, c.tag) }}
              />
              <span className="campusmap-pin-dot" aria-hidden="true" />
            </button>
          ))}
        </div>

        <div className="campusmap-cards">
          <div className="campusmap-card" role="region" aria-live="polite">
            <p
              className="campusmap-card-sub"
              data-cms={`t:campusmap-${active.id}-sub`}
              dangerouslySetInnerHTML={{ __html: tx(text, `campusmap-${active.id}-sub`, active.sub) }}
            />
            <h3
              className="campusmap-card-title"
              data-cms={`t:campusmap-${active.id}-title`}
              dangerouslySetInnerHTML={{ __html: tx(text, `campusmap-${active.id}-title`, active.title) }}
            />
            {active.rows.map((row) => (
              <div key={row.field} className="campusmap-card-row">
                {ICONS[row.icon]}
                <div>
                  <strong
                    data-cms={`t:campusmap-${active.id}-${row.field}-label`}
                    dangerouslySetInnerHTML={{ __html: tx(text, `campusmap-${active.id}-${row.field}-label`, row.label) }}
                  />
                  <span
                    data-cms={`t:campusmap-${active.id}-${row.field}-value`}
                    dangerouslySetInnerHTML={{ __html: tx(text, `campusmap-${active.id}-${row.field}-value`, row.value) }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
