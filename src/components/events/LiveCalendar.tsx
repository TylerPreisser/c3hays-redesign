"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fetchEspaceEvents, monthMatrix, dayKey, type CalEvent } from "@/lib/espace";
import {
  Skeleton,
  ErrorState,
  Segment,
  Chip,
  DayDetail,
  sameMonth,
  HAIR,
  type CampusFilter,
  type ViewMode,
} from "./calendar-shared";
import { MonthGrid, AgendaView } from "./calendar-grid";

/**
 * <LiveCalendar> — Phase 4, EV2/Wave 3. The on-theme church calendar that replaces
 * the raw eSpace iframe. A client island (works in static-export AND CMS_LIVE): it
 * fetches the live feed in the browser on mount, caches it (shared with
 * <UpcomingEventsLive>), and renders a premium month grid (≥md) or agenda list (<md).
 *
 * States are never blank: skeleton while loading, a graceful error card with a link
 * to the full eSpace calendar, and an "empty month" message that keeps month nav.
 * Presentational sub-views live in ./calendar-shared and ./calendar-grid so each
 * file stays < 500 lines; the lc-* class hooks below are the single style source.
 */

const MONTH_YEAR = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});
const BORDER = "1px solid rgba(27,28,28,0.08)";

export default function LiveCalendar() {
  const [events, setEvents] = useState<CalEvent[] | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [viewDate, setViewDate] = useState(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), 1);
  });
  const [view, setView] = useState<ViewMode>("month");
  const [campus, setCampus] = useState<CampusFilter>("All");
  const [showHolidays, setShowHolidays] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(true);
  const [loadedKey, setLoadedKey] = useState<string | null>(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthKey = `${year}-${month}`;
  // Busy = the data we hold isn't yet for the visible month (a fetch is in flight).
  // Derived (not a setState-in-effect) so the linter/render stay clean.
  const busy = status !== "error" && loadedKey !== monthKey;

  // Fetch PER VISIBLE MONTH — exactly the 6-week grid range we render. eSpace
  // collapses recurring occurrences on wide windows (see fetchEspaceEvents), so a
  // narrow per-month window is required for weekly services etc. to appear. The
  // per-URL cache dedupes, so navigating back to a visited month is instant.
  useEffect(() => {
    let alive = true;
    const grid = monthMatrix(year, month);
    const gridStart = grid[0][0];
    const gridEnd = grid[5][6];
    fetchEspaceEvents({ start: gridStart, end: gridEnd })
      .then((evts) => {
        if (!alive) return;
        setEvents(evts);
        setStatus("ready");
        setLoadedKey(`${year}-${month}`);
      })
      .catch((err) => {
        if (!alive) return;
        console.error("[LiveCalendar] failed to load eSpace events:", err);
        setStatus("error");
      });
    return () => {
      alive = false;
    };
  }, [year, month]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // < md forces the agenda list (the grid is too cramped on phones).
  const effectiveView: ViewMode = isDesktop ? view : "list";

  const hasHolidays = useMemo(
    () => (events ?? []).some((e) => e.isHoliday),
    [events]
  );
  const campuses = useMemo(() => {
    const set = new Set<CampusFilter>();
    for (const e of events ?? []) if (e.campus) set.add(e.campus);
    return set;
  }, [events]);

  const monthEvents = useMemo(() => {
    return (events ?? []).filter((e) => {
      if (!sameMonth(e.start, viewDate)) return false;
      if (e.isHoliday && !showHolidays) return false;
      if (campus !== "All" && e.campus !== campus) return false;
      return true;
    });
  }, [events, viewDate, showHolidays, campus]);

  const selectedEvents = useMemo(() => {
    if (!selectedKey) return [];
    return monthEvents.filter((e) => dayKey(e.start) === selectedKey);
  }, [monthEvents, selectedKey]);

  // Derive the selected Date from the key (never a ref read during render).
  const selectedDate = useMemo(() => {
    if (!selectedKey) return null;
    const [y, m, d] = selectedKey.split("-").map(Number);
    return new Date(y, m - 1, d);
  }, [selectedKey]);

  function openDay(d: Date) {
    setSelectedKey(dayKey(d));
  }
  function shiftMonth(delta: number) {
    setSelectedKey(null);
    setViewDate((v) => new Date(v.getFullYear(), v.getMonth() + delta, 1));
  }
  function goToday() {
    setSelectedKey(null);
    const n = new Date();
    setViewDate(new Date(n.getFullYear(), n.getMonth(), 1));
  }

  const iconBtn: CSSProperties = { width: 40, height: 40 };

  return (
    <div
      style={{
        borderRadius: "var(--radius-md)",
        background: "#fff",
        border: BORDER,
        boxShadow: "var(--shadow-rest)",
        padding: "clamp(1.25rem, 3vw, 2rem)",
      }}
    >
      {/* Scoped styles: shimmer + hover affordances. The global reduced-motion guard
          neutralizes the animation/transitions automatically. */}
      <style>{`
        @keyframes lc-shimmer { 0% { background-position: -600px 0 } 100% { background-position: 600px 0 } }
        .lc-shimmer { background: linear-gradient(90deg, #eee 0%, #f6f6f6 40%, #eee 80%); background-size: 1200px 100%; animation: lc-shimmer 1.4s linear infinite; }
        .lc-icon-btn { display:inline-flex; align-items:center; justify-content:center; border-radius:999px; border:1px solid rgba(27,28,28,0.12); background:#fff; color:var(--color-ink); cursor:pointer; transition: color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out), background-color var(--dur-fast) var(--ease-out); }
        .lc-icon-btn:hover:not(:disabled) { color:var(--color-teal-deep); border-color:var(--color-teal); }
        .lc-icon-btn:disabled { opacity:0.4; cursor:default; }
        .lc-cell { transition: background-color var(--dur-fast) var(--ease-out); }
        .lc-cell:hover { background: rgba(28,195,175,0.05) !important; }
        .lc-pill { transition: filter var(--dur-fast) var(--ease-out); }
        .lc-pill:hover { filter: brightness(0.97); }
        .lc-agenda-row { transition: background-color var(--dur-fast) var(--ease-out); border-radius: 10px; }
        .lc-agenda-row:hover { background: var(--color-mist) !important; }
        .lc-seg { display:inline-flex; gap:2px; padding:3px; border-radius:999px; background:var(--color-mist); border:1px solid rgba(27,28,28,0.08); }
        @keyframes lc-spin { to { transform: rotate(360deg) } }
        .lc-busy { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; z-index:2; pointer-events:none; }
        .lc-spin { width:26px; height:26px; border-radius:999px; border:2.5px solid rgba(28,195,175,0.25); border-top-color:var(--color-teal); animation: lc-spin 0.7s linear infinite; }
      `}</style>

      {status === "error" ? (
        <ErrorState />
      ) : events === null ? (
        <Skeleton />
      ) : (
        <>
          {/* ── Header row ─────────────────────────────────────────── */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
            <h3 className="heading-1" style={{ color: "var(--color-ink)", margin: 0 }}>
              {MONTH_YEAR.format(viewDate)}
            </h3>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <button
                  type="button"
                  onClick={() => shiftMonth(-1)}
                  aria-label="Previous month"
                  className="lc-icon-btn"
                  style={iconBtn}
                >
                  <ChevronLeft size={19} />
                </button>
                <button
                  type="button"
                  onClick={goToday}
                  className="lc-icon-btn"
                  style={{ height: 40, padding: "0 1rem", fontSize: "0.82rem", fontWeight: 700 }}
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => shiftMonth(1)}
                  aria-label="Next month"
                  className="lc-icon-btn"
                  style={iconBtn}
                >
                  <ChevronRight size={19} />
                </button>
              </div>
              {isDesktop && (
                <div className="lc-seg" role="group" aria-label="Calendar view">
                  <Segment active={view === "month"} onClick={() => setView("month")}>
                    Month
                  </Segment>
                  <Segment active={view === "list"} onClick={() => setView("list")}>
                    List
                  </Segment>
                </div>
              )}
            </div>
          </div>

          {/* ── Filter chips ───────────────────────────────────────── */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
              marginTop: "1.1rem",
              paddingBottom: "1.25rem",
              borderBottom: HAIR,
            }}
          >
            <Chip active={campus === "All"} onClick={() => setCampus("All")}>
              All
            </Chip>
            {campuses.has("Hays") && (
              <Chip active={campus === "Hays"} onClick={() => setCampus("Hays")}>
                Hays
              </Chip>
            )}
            {campuses.has("Colby") && (
              <Chip active={campus === "Colby"} onClick={() => setCampus("Colby")}>
                Colby
              </Chip>
            )}
            {hasHolidays && (
              <Chip active={showHolidays} onClick={() => setShowHolidays((s) => !s)}>
                {showHolidays ? "Holidays: on" : "Holidays"}
              </Chip>
            )}
          </div>

          {/* ── Body ───────────────────────────────────────────────── */}
          <div style={{ marginTop: "1.4rem", position: "relative", minHeight: 120 }}>
            {busy && (
              <div className="lc-busy">
                <span className="lc-spin" role="status" aria-label="Loading events" />
              </div>
            )}
            <div
              style={{
                opacity: busy ? 0.4 : 1,
                transition: "opacity var(--dur-fast) var(--ease-out)",
                pointerEvents: busy ? "none" : undefined,
              }}
            >
              {monthEvents.length === 0 && !busy ? (
                <p
                  className="body-lg"
                  style={{ color: "var(--color-mute)", textAlign: "center", padding: "2.5rem 1rem" }}
                >
                  No events this month.
                </p>
              ) : effectiveView === "month" ? (
                <MonthGrid
                  viewDate={viewDate}
                  monthEvents={monthEvents}
                  selectedKey={selectedKey}
                  onOpen={openDay}
                />
              ) : (
                <AgendaView monthEvents={monthEvents} onOpen={openDay} />
              )}
            </div>
          </div>

          {/* ── Day detail panel ───────────────────────────────────── */}
          {selectedDate && (
            <DayDetail
              date={selectedDate}
              events={selectedEvents}
              onClose={() => setSelectedKey(null)}
            />
          )}
        </>
      )}
    </div>
  );
}
