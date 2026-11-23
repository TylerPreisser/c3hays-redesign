"use client";

import { useEffect, useMemo, useState } from "react";
import UpcomingEventsGrid from "@/components/events/UpcomingEventsGrid";
import { fetchEspaceEvents, upcomingEvents, type CalEvent } from "@/lib/espace";
import { studioToCalEvent, upcomingMerged, withStudioWeekendLine, withoutInternalEvents } from "@/lib/event-merge";
import { useServiceTimes } from "@/providers/ServiceTimesProvider";
import { weekendLine } from "@/lib/service-times-core";
import { ESPACE_FULL_CALENDAR_URL } from "@/lib/espace";
import type { StudioEvent } from "@/lib/studio-events";

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

/** Dark-surface skeleton matching EventCard's IMAGE-LESS tile silhouette: a teal date
 *  chip at the top, then title / detail / campus lines (no photo area). */
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
      <div style={{ padding: "clamp(1.25rem, 2.4vw, 1.6rem)", display: "grid", gap: "0.7rem" }}>
        <div style={{ height: 46, width: 54, borderRadius: "var(--radius-sm)", background: "rgba(28,195,175,0.35)" }} />
        <div style={{ height: 22, width: "70%", borderRadius: 6, background: "rgba(255,255,255,0.10)", marginTop: "0.3rem" }} />
        <div style={{ height: 14, width: "90%", borderRadius: 6, background: "rgba(255,255,255,0.06)" }} />
        <div style={{ height: 24, width: "40%", borderRadius: 999, background: "rgba(255,255,255,0.06)", marginTop: "0.6rem" }} />
      </div>
    </div>
  );
}

function Note({ onRetry }: { onRetry: () => void }) {
  return (
    <div style={{ textAlign: "center" }}>
      <p className="body-base" style={{ color: "rgba(255,255,255,0.78)", margin: 0 }}>
        The live calendar is slow right now. The full calendar is just below.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", justifyContent: "center", marginTop: "1rem" }}>
        <button type="button" className="btn btn-outline" onClick={onRetry} style={{ minHeight: 44 }}>Try again</button>
        <a href={ESPACE_FULL_CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ minHeight: 44 }}>Open the full calendar</a>
      </div>
    </div>
  );
}

export interface UpcomingEventsLiveProps {
  /** Page text overrides — persisted card edits (title/date/detail/campus/CTA). */
  text?: Record<string, string>;
  /** Page media overrides — a swapped image src per `events-upcoming-${i}-img` key. */
  media?: Record<string, string>;
  /**
   * Studio's events still to come (kept through their church day), given only in `studio` mode. Mapped here, in the browser,
   * because each carries the church's wall clock in a Date made in the zone it runs in. Merged with eSpace's; if eSpace
   * cannot be reached the Studio events still show.
   */
  studio?: StudioEvent[];
}

export default function UpcomingEventsLive({ text, media, studio }: UpcomingEventsLiveProps) {
  const studioCal = useMemo(() => (studio ?? []).map(studioToCalEvent), [studio]);
  const [events, setEvents] = useState<CalEvent[] | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [attempt, setAttempt] = useState(0);
  const times = useServiceTimes();

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
  }, [attempt]);

  const top = useMemo(() => {
    // Weekend Services rows say Studio's times, not eSpace's free text; staff set-up jobs are not shown to visitors
    const clean = events ? withoutInternalEvents(withStudioWeekendLine(events, weekendLine(times))) : null;
    return studioCal.length > 0 ? upcomingMerged(studioCal, clean ?? [], 3) : clean ? upcomingEvents(clean, 3) : [];
  }, [events, studioCal, times]);

  if (status === "loading") {
    return (
      <div style={GRID}>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if ((status === "error" && studioCal.length === 0) || top.length === 0) {
    return <Note onRetry={() => { setStatus("loading"); setAttempt((n) => n + 1); }} />;
  }

  return <UpcomingEventsGrid events={top} text={text} media={media} />;
}
