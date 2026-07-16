"use client";

import { useMemo } from "react";
import { groupByDay, monthMatrix, dayKey, type CalEvent } from "@/lib/espace";
import { HAIR, sameMonth, daySubhead, EventPill } from "./calendar-shared";

/**
 * The two large calendar bodies for <LiveCalendar> — the desktop month grid and the
 * agenda/list view. Split out to keep each file < 500 lines. Both scope their events
 * to the currently-viewed month so the header's month nav drives either view.
 */

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/* ───────────────────────── Agenda / list view ───────────────────────── */
export function AgendaView({
  monthEvents,
  onOpen,
}: {
  monthEvents: CalEvent[];
  onOpen: (d: Date) => void;
}) {
  const grouped = useMemo(() => groupByDay(monthEvents), [monthEvents]);
  const keys = Array.from(grouped.keys());
  return (
    <div style={{ display: "grid", gap: "1.6rem" }}>
      {keys.map((k) => {
        const list = grouped.get(k)!;
        const d = list[0].start;
        return (
          <div key={k}>
            <p
              className="overline"
              style={{ color: "var(--color-teal-deep)", marginBottom: "0.7rem" }}
            >
              {daySubhead(d)}
            </p>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 2 }}>
              {list.map((ev) => (
                <li key={ev.id}>
                  <button
                    type="button"
                    onClick={() => onOpen(ev.start)}
                    className="lc-agenda-row"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "clamp(64px, 20vw, 96px) auto 1fr",
                      alignItems: "baseline",
                      gap: "0.75rem",
                      width: "100%",
                      textAlign: "left",
                      cursor: "pointer",
                      background: "transparent",
                      border: "none",
                      borderTop: HAIR,
                      padding: "0.85rem 0.5rem",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        color: ev.isHoliday ? "var(--color-mute)" : "var(--color-ink)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {ev.allDay
                        ? "All day"
                        : ev.start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                    </span>
                    <span
                      aria-hidden="true"
                      style={{
                        width: 9,
                        height: 9,
                        borderRadius: 999,
                        marginTop: 6,
                        background: ev.isHoliday ? "var(--color-rule)" : ev.color,
                      }}
                    />
                    <span style={{ minWidth: 0 }}>
                      <span
                        className="body-base"
                        style={{
                          fontWeight: 600,
                          color: "var(--color-ink)",
                          fontStyle: ev.isHoliday ? "italic" : undefined,
                        }}
                      >
                        {ev.title}
                      </span>
                      {ev.campus && (
                        <span
                          style={{
                            marginLeft: "0.6rem",
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            letterSpacing: "0.04em",
                            textTransform: "uppercase",
                            color: "var(--color-teal-deep)",
                          }}
                        >
                          {ev.campus}
                        </span>
                      )}
                      {ev.description && (
                        <span
                          className="body-sm"
                          style={{
                            display: "block",
                            color: "var(--color-mute)",
                            marginTop: "0.15rem",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "48ch",
                          }}
                        >
                          {ev.description}
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

/* ───────────────────────── Month grid view ───────────────────────── */
export function MonthGrid({
  viewDate,
  monthEvents,
  selectedKey,
  onOpen,
}: {
  viewDate: Date;
  monthEvents: CalEvent[];
  selectedKey: string | null;
  onOpen: (d: Date) => void;
}) {
  const grouped = useMemo(() => groupByDay(monthEvents), [monthEvents]);
  const weeks = useMemo(
    () => monthMatrix(viewDate.getFullYear(), viewDate.getMonth()),
    [viewDate]
  );
  const todayKey = dayKey(new Date());

  return (
    <div style={{ border: HAIR, borderRadius: "var(--radius)", overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
        {WEEKDAYS.map((w) => (
          <div
            key={w}
            style={{
              padding: "0.65rem 0.5rem",
              textAlign: "center",
              fontSize: "0.68rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--color-mute)",
              borderBottom: HAIR,
            }}
          >
            {w}
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
        {weeks.flat().map((cell, i) => {
          const key = dayKey(cell);
          const inMonth = sameMonth(cell, viewDate);
          const isToday = key === todayKey;
          const isSelected = key === selectedKey;
          const dayEvents = grouped.get(key) ?? [];
          const shown = dayEvents.slice(0, 3);
          const extra = dayEvents.length - shown.length;
          return (
            <button
              type="button"
              key={key + i}
              onClick={() => onOpen(cell)}
              aria-label={`${cell.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}${dayEvents.length ? `, ${dayEvents.length} event${dayEvents.length > 1 ? "s" : ""}` : ""}`}
              className="lc-cell"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                minHeight: 108,
                textAlign: "left",
                cursor: "pointer",
                padding: "6px 6px 8px",
                borderRight: (i + 1) % 7 === 0 ? "none" : HAIR,
                borderBottom: i < 35 ? HAIR : "none",
                background: isSelected
                  ? "rgba(28,195,175,0.06)"
                  : inMonth
                    ? "#fff"
                    : "rgba(27,28,28,0.015)",
                opacity: inMonth ? 1 : 0.55,
              }}
            >
              <span
                style={{
                  alignSelf: "flex-start",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: 24,
                  height: 24,
                  borderRadius: 999,
                  fontSize: "0.8rem",
                  fontWeight: isToday ? 800 : 600,
                  color: isToday ? "#fff" : "var(--color-ink)",
                  background: isToday ? "var(--color-teal)" : "transparent",
                  padding: "0 6px",
                }}
              >
                {cell.getDate()}
              </span>
              <span style={{ display: "grid", gap: 2, width: "100%" }}>
                {shown.map((ev) => (
                  <EventPill key={ev.id} ev={ev} onOpen={() => onOpen(cell)} />
                ))}
                {extra > 0 && (
                  <span
                    style={{
                      fontSize: "0.66rem",
                      fontWeight: 700,
                      color: "var(--color-teal-deep)",
                      paddingLeft: 3,
                    }}
                  >
                    +{extra} more
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
