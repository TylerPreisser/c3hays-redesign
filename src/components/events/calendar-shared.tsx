"use client";

import { ArrowUpRight, X, MapPin, Clock } from "lucide-react";
import { ESPACE_FULL_CALENDAR_URL, type CalEvent } from "@/lib/espace";

/**
 * Shared primitives for <LiveCalendar> (Phase 4, EV2/Wave 3) — helpers, tokens and
 * the smaller presentational atoms (skeleton, error, pill, segmented control, chip,
 * day-detail panel). Split out of LiveCalendar.tsx to keep every file < 500 lines.
 * The class-name hooks (lc-*) are injected once by <LiveCalendar>'s scoped <style>.
 */

export type CampusFilter = "All" | "Hays" | "Colby";
export type ViewMode = "month" | "list";

export const BORDER = "1px solid rgba(27,28,28,0.08)";
export const HAIR = "1px solid rgba(27,28,28,0.06)";

/** #rgb / #rrggbb → "r,g,b" so we can build tinted rgba() surfaces. */
export function rgbTriplet(hex: string): string {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

export function sameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

/** "Sat · Jul 20" agenda subhead. */
export function daySubhead(d: Date): string {
  const wd = d.toLocaleDateString("en-US", { weekday: "short" });
  const mon = d.toLocaleDateString("en-US", { month: "short" });
  return `${wd} · ${mon} ${d.getDate()}`;
}

/* ───────────────────────── Loading skeleton ───────────────────────── */
export function Skeleton() {
  return (
    <div style={{ display: "grid", gap: "0.9rem", minWidth: 0 }}>
      <p role="status" className="body-base" style={{ margin: 0, color: "var(--color-mute)" }}>Loading the calendar&hellip;</p>
      <div aria-hidden="true" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "1rem" }}>
        <div className="lc-shimmer" style={{ height: 34, width: "min(220px, 100%)", borderRadius: 10 }} />
        <div className="lc-shimmer" style={{ height: 34, width: "min(200px, 100%)", borderRadius: 999 }} />
      </div>
      <div
        aria-hidden="true"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
          gap: 8,
          marginTop: "0.75rem",
        }}
      >
        {Array.from({ length: 42 }).map((_, i) => (
          <div
            key={i}
            className="lc-shimmer"
            style={{ aspectRatio: "1 / 1", borderRadius: 12, minHeight: 0 }}
          />
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────── Error state ───────────────────────── */
export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  // The Upcoming block above already says the calendar did not load and offers Try again; this one only points at the full calendar.
  void onRetry;
  return (
    <div style={{ textAlign: "center", padding: "clamp(1.5rem, 4vw, 2.5rem) 1rem" }}>
      <a href={ESPACE_FULL_CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
        Open the full calendar
        <ArrowUpRight size={18} />
      </a>
    </div>
  );
}

/* ───────────────────────── Event pill (month grid) ───────────────────────── */
// Rendered INSIDE the day-cell <button> (see MonthGrid). A <button> nested in a
// <button> is invalid HTML → a React hydration warning ("cannot be a descendant of"),
// so each pill is a <span>, not a button. The day cell is the single interactive
// control that opens the day; the pill click still bubbles to it (and calls onOpen
// directly), so behavior is unchanged while the markup is now valid.
export function EventPill({ ev, onOpen }: { ev: CalEvent; onOpen: () => void }) {
  if (ev.isHoliday) {
    return (
      <span
        onClick={onOpen}
        title={ev.title}
        style={{
          display: "block",
          width: "100%",
          textAlign: "left",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: "1px 2px",
          fontSize: "0.68rem",
          lineHeight: 1.3,
          color: "var(--color-mute)",
          fontStyle: "italic",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {ev.title}
      </span>
    );
  }
  const rgb = rgbTriplet(ev.color);
  return (
    <span
      onClick={onOpen}
      title={ev.title}
      className="lc-pill"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        width: "100%",
        textAlign: "left",
        cursor: "pointer",
        padding: "3px 6px",
        borderRadius: 7,
        border: `1px solid rgba(${rgb}, 0.28)`,
        background: `rgba(${rgb}, 0.12)`,
        borderLeft: `3px solid ${ev.color}`,
        color: "var(--color-ink)",
        overflow: "hidden",
      }}
    >
      <span
        style={{
          flex: 1,
          minWidth: 0,
          fontSize: "0.7rem",
          fontWeight: 600,
          lineHeight: 1.25,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {ev.title}
      </span>
      {!ev.allDay && (
        <span
          style={{
            fontSize: "0.6rem",
            fontWeight: 600,
            color: "var(--color-mute)",
            whiteSpace: "nowrap",
          }}
        >
          {ev.start.toLocaleTimeString("en-US", { hour: "numeric" }).replace(" ", "")}
        </span>
      )}
    </span>
  );
}

/* ───────────────────────── Segmented / chip controls ───────────────────────── */
export function Segment({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={{
        border: "none",
        cursor: "pointer",
        borderRadius: 999,
        padding: "0.4rem 0.95rem",
        fontSize: "0.8rem",
        fontWeight: 700,
        letterSpacing: "0.01em",
        color: active ? "#fff" : "var(--color-mute)",
        background: active ? "var(--color-ink)" : "transparent",
        transition:
          "background-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)",
      }}
    >
      {children}
    </button>
  );
}

export function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="lc-chip"
      style={{
        cursor: "pointer",
        borderRadius: 999,
        padding: "0.4rem 0.9rem",
        fontSize: "0.78rem",
        fontWeight: 700,
        border: active ? "1px solid var(--color-teal)" : "1px solid rgba(27,28,28,0.14)",
        color: active ? "var(--color-teal-deep)" : "var(--color-mute)",
        background: active ? "rgba(28,195,175,0.10)" : "transparent",
        transition: "all var(--dur-fast) var(--ease-out)",
      }}
    >
      {children}
    </button>
  );
}

/* ───────────────────────── Day detail panel ───────────────────────── */
export function DayDetail({
  date,
  events,
  onClose,
}: {
  date: Date;
  events: CalEvent[];
  onClose: () => void;
}) {
  return (
    <div
      style={{
        marginTop: "1.25rem",
        border: BORDER,
        borderRadius: "var(--radius)",
        background: "var(--color-mist)",
        padding: "clamp(1.1rem, 2.5vw, 1.6rem)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <h3 className="heading-3" style={{ color: "var(--color-ink)" }}>
          {date.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </h3>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close day details"
          className="lc-icon-btn"
          style={{ width: 34, height: 34 }}
        >
          <X size={17} />
        </button>
      </div>
      {events.length === 0 ? (
        <p className="body-base" style={{ color: "var(--color-mute)", marginTop: "0.75rem" }}>
          Nothing scheduled this day.
        </p>
      ) : (
        <ul style={{ listStyle: "none", margin: "1rem 0 0", padding: 0, display: "grid", gap: "0.9rem" }}>
          {events.map((ev) => (
            <li
              key={ev.id}
              style={{
                display: "grid",
                gap: "0.35rem",
                paddingLeft: "0.9rem",
                borderLeft: `3px solid ${ev.isHoliday ? "var(--color-rule)" : ev.color}`,
              }}
            >
              <span className="body-lg" style={{ fontWeight: 600, color: "var(--color-ink)" }}>
                {ev.title}
              </span>
              <span
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.4rem 1rem",
                  fontSize: "0.85rem",
                  color: "var(--color-mute)",
                }}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                  <Clock size={13} /> {ev.timeLabel}
                </span>
                {(ev.campus || ev.location) && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <MapPin size={13} /> {ev.campus ? `${ev.campus} campus` : ev.location}
                  </span>
                )}
              </span>
              {ev.description && ev.description !== ev.timeLabel && (
                <span className="body-sm" style={{ color: "var(--color-mute)" }}>
                  {ev.description}
                </span>
              )}
              {ev.registerUrl && (
                <a
                  href={ev.registerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="arrow-link"
                  style={{ color: "var(--color-teal-deep)", marginTop: "0.15rem" }}
                >
                  Register
                  <ArrowUpRight size={15} />
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
