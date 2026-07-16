"use client";

import { useEffect, useMemo, useState } from "react";
import EventCard from "@/components/events/EventCard";
import {
  fetchEspaceEvents,
  upcomingEvents,
  ESPACE_FULL_CALENDAR_URL,
  type CalEvent,
} from "@/lib/espace";

/**
 * <UpcomingEventsLive> — Phase 4, EV2/Wave 3. Replaces the hardcoded fake UPCOMING
 * array on /events with the live eSpace feed. A client island that shares the SAME
 * cached network request as <LiveCalendar> (fetchEspaceEvents dedupes by URL), takes
 * the next 3 real-first events, and renders the existing premium <EventCard> grid.
 *
 * Never shows fake events: while loading it paints 3 skeleton cards; on error or an
 * empty feed it hides the grid and leaves a quiet pointer to the full calendar below.
 */

const GRID: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "clamp(1.25rem, 3vw, 2rem)",
  alignItems: "stretch",
};

function detailLine(ev: CalEvent): string {
  const desc = ev.description ? ev.description.trim() : "";
  const clipped = desc.length > 60 ? `${desc.slice(0, 60).trimEnd()}…` : desc;
  return clipped ? `${ev.timeLabel} · ${clipped}` : ev.timeLabel;
}

function campusLabel(ev: CalEvent): string {
  if (ev.campus) return `${ev.campus} campus`;
  return ev.isHoliday ? "Holiday" : "Both campuses";
}

/** Dark-surface skeleton matching EventCard's contained-tile silhouette. */
function SkeletonCard() {
  return (
    <div
      aria-hidden="true"
      style={{
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
        background: "var(--color-ink-soft)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div style={{ aspectRatio: "4 / 5", background: "rgba(255,255,255,0.05)" }} />
      <div style={{ padding: "clamp(1.25rem, 2.4vw, 1.6rem)", display: "grid", gap: "0.7rem" }}>
        <div style={{ height: 22, width: "70%", borderRadius: 6, background: "rgba(255,255,255,0.10)" }} />
        <div style={{ height: 14, width: "90%", borderRadius: 6, background: "rgba(255,255,255,0.06)" }} />
        <div style={{ height: 24, width: "40%", borderRadius: 999, background: "rgba(255,255,255,0.06)", marginTop: "0.6rem" }} />
      </div>
    </div>
  );
}

function Note() {
  return (
    <p
      className="body-base"
      style={{ color: "rgba(255,255,255,0.6)", textAlign: "center" }}
    >
      See the full calendar below.
    </p>
  );
}

export default function UpcomingEventsLive() {
  const [events, setEvents] = useState<CalEvent[] | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let alive = true;
    // ~3-month forward window (today → +92d). eSpace collapses recurring occurrences
    // on wide windows, so a narrow window is required for real weekly events to
    // surface here instead of only future-dated national holidays.
    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + 92);
    fetchEspaceEvents({ start, end })
      .then((evts) => {
        if (!alive) return;
        setEvents(evts);
        setStatus("ready");
      })
      .catch((err) => {
        if (!alive) return;
        console.error("[UpcomingEventsLive] failed to load eSpace events:", err);
        setStatus("error");
      });
    return () => {
      alive = false;
    };
  }, []);

  const top = useMemo(
    () => (events ? upcomingEvents(events, 3) : []),
    [events]
  );

  if (status === "loading") {
    return (
      <div style={GRID}>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (status === "error" || top.length === 0) {
    return <Note />;
  }

  return (
    <div style={GRID}>
      {top.map((ev) => (
        <EventCard
          key={ev.id}
          href={ev.registerUrl || ESPACE_FULL_CALENDAR_URL}
          imageAlt={ev.title}
          month={ev.start.toLocaleDateString("en-US", { month: "short" }).toUpperCase()}
          day={String(ev.start.getDate()).padStart(2, "0")}
          title={ev.title}
          detail={detailLine(ev)}
          campus={campusLabel(ev)}
        />
      ))}
    </div>
  );
}
