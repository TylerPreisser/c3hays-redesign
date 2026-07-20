"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarPlus, Check } from "lucide-react";
import {
  downloadICS,
  googleCalendarUrl,
  outlookCalendarUrl,
  type CalendarEvent,
} from "@/lib/calendar";

/**
 * <AddToCalendar> — per-event "Add to calendar" control. A small button that opens
 * a menu with three real actions: Apple / ICS (.ics download), Google Calendar, and
 * Outlook / Microsoft 365 (both open the provider's "create event" flow).
 *
 * Live-event safe: this is pure per-event action UI (no authored/editable text tied
 * to a positional row), so it composes with the live eSpace feed without any CMS
 * keys. It is a self-contained interactive island, rendered as a SIBLING of the card
 * link (never nested inside the card's <a>, which would be invalid HTML).
 */
export default function AddToCalendar({
  event,
  className,
  align = "left",
}: {
  event: CalendarEvent;
  className?: string;
  /** Which edge the menu anchors to. */
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const menuItem: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
    width: "100%",
    padding: "0.6rem 0.85rem",
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "#fff",
    background: "transparent",
    border: "none",
    borderRadius: "var(--radius-sm)",
    textAlign: "left",
    textDecoration: "none",
    cursor: "pointer",
  };

  return (
    <div
      ref={rootRef}
      className={className}
      style={{ position: "relative", display: "inline-block" }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.45rem",
          fontSize: "0.78rem",
          fontWeight: 700,
          letterSpacing: "0.02em",
          color: "var(--color-teal)",
          background: "rgba(28,195,175,0.12)",
          border: "1px solid rgba(28,195,175,0.28)",
          borderRadius: "999px",
          padding: "0.4rem 0.85rem",
          cursor: "pointer",
        }}
      >
        <CalendarPlus size={15} aria-hidden="true" />
        Add to calendar
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Add to calendar"
          style={{
            position: "absolute",
            top: "calc(100% + 0.4rem)",
            ...(align === "right" ? { right: 0 } : { left: 0 }),
            zIndex: 20,
            minWidth: 208,
            padding: "0.35rem",
            background: "var(--color-ink-soft, #1b1c1c)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-hover)",
          }}
        >
          <button
            type="button"
            role="menuitem"
            style={menuItem}
            onClick={() => {
              downloadICS(event);
              setDownloaded(true);
              setOpen(false);
              setTimeout(() => setDownloaded(false), 2500);
            }}
          >
            {downloaded ? <Check size={16} aria-hidden="true" /> : <span aria-hidden="true">🍎</span>}
            {downloaded ? "Downloaded" : "Apple / ICS (.ics)"}
          </button>
          <a
            role="menuitem"
            style={menuItem}
            href={googleCalendarUrl(event)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
          >
            <span aria-hidden="true">📅</span>
            Google Calendar
          </a>
          <a
            role="menuitem"
            style={menuItem}
            href={outlookCalendarUrl(event)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
          >
            <span aria-hidden="true">📆</span>
            Outlook / Microsoft
          </a>
        </div>
      )}
    </div>
  );
}
