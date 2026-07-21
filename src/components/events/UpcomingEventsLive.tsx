"use client";

import { useEffect, useMemo, useState } from "react";
import UpcomingEventsGrid from "@/components/events/UpcomingEventsGrid";
import { fetchEspaceEvents, upcomingEvents, type CalEvent } from "@/lib/espace";

/**
 * <UpcomingEventsLive> — Phase 4, EV2/Wave 3 (editor-native rebuild). Replaces the
 * hardcoded fake UPCOMING array on /events with the live eSpace feed. A client island
 * that shares the SAME cached network request as <LiveCalendar> (fetchEspaceEvents
 * dedupes by URL), takes the next 3 real-first events, and renders the premium
 * <UpcomingEventsGrid>.
 *
 * Never shows fake events: while loading it paints 3 skeleton cards; on error or an
 * empty feed it hides the grid and leaves a quiet pointer to the full calendar below.
 *
 * EDITABILITY: the island itself only fetches + tracks state; the editor-native card
 * markup (data-cms / data-cms-bg / data-cms-img / data-cms-link) lives in
 * <UpcomingEventsGrid>. The page passes its CMS `text`/`media` override bags through
 * so persisted card edits render (positional, index-keyed — see the grid's note).
 */

const GRID: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "clamp(1.25rem, 3vw, 2rem)",
  alignItems: "stretch",
};

/** Dark-surface skeleton matching EventCard's contained-tile silhouette. */
function SkeletonCard() {
  return (
    <div
      aria-hidden="true"
      style={{
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
        background: "#252727",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div style={{ aspectRatio: "3 / 2", background: "rgba(255,255,255,0.05)" }} />
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

export interface UpcomingEventsLiveProps {
  /** Page text overrides — persisted card edits (title/date/detail/campus/CTA). */
  text?: Record<string, string>;
  /** Page media overrides — a swapped image src per `events-upcoming-${i}-img` key. */
  media?: Record<string, string>;
}

export default function UpcomingEventsLive({ text, media }: UpcomingEventsLiveProps) {
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

  return <UpcomingEventsGrid events={top} text={text} media={media} />;
}
