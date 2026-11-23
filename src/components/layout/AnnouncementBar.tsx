"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const KEEP_MS = 30 * 24 * 3600 * 1000; // a closed bar stays closed for 30 days
const keyOf = (id: string) => `c3-announcement-closed:${id}`;

/**
 * The announcement bar. On a phone it is one line (title and link; the body is on the full-width layouts), and a visitor can
 * close it: the choice is remembered in this browser for 30 days. The editor's canvas never shows the close button.
 */
export default function AnnouncementBar({
  announcement,
  pickAttrs,
  canDismiss,
}: {
  announcement: { id: string; title: string; eyebrow?: string; body: string; linkLabel?: string; linkUrl?: string };
  pickAttrs?: Record<string, string>;
  canDismiss: boolean;
}) {
  const [closed, setClosed] = useState(false);
  useEffect(() => {
    try {
      const at = Number(localStorage.getItem(keyOf(announcement.id)));
      if (at && Date.now() - at < KEEP_MS) setClosed(true);
    } catch {}
  }, [announcement.id]);
  if (closed) return null;
  return (
    <div role="region" aria-label="Announcement" data-announcement {...pickAttrs} style={{ background: "#0f3f3a", color: "#fff", position: "relative" }}>
      <p className="container-c3 body-sm announcement-line" style={{ margin: 0, padding: "0.2rem 0", paddingRight: canDismiss ? "2.75rem" : undefined, display: "flex", flexWrap: "wrap", gap: "0.1rem 0.75rem", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        {announcement.eyebrow && <span className="announcement-extra" data-announcement-eyebrow style={{ color: "rgba(255,255,255,0.86)" }}>{announcement.eyebrow}</span>}
        <strong>{announcement.title}</strong>
        {announcement.body && <span className="announcement-extra" style={{ color: "rgba(255,255,255,0.86)" }}>{announcement.body}</span>}
        {announcement.linkUrl && (
          <a href={announcement.linkUrl} style={{ color: "#7ff0e0", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: 3, display: "inline-flex", alignItems: "center", minHeight: 44, padding: "0 0.25rem" }}>
            {announcement.linkLabel || "Learn more"}
          </a>
        )}
      </p>
      {canDismiss && (
        <button
          type="button"
          aria-label="Close this announcement"
          onClick={() => { try { localStorage.setItem(keyOf(announcement.id), String(Date.now())); } catch {} setClosed(true); }}
          style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 44, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff", background: "transparent", border: 0, cursor: "pointer" }}
        >
          <X size={18} aria-hidden="true" />
        </button>
      )}
      <style>{`@media (max-width: 599px) { .announcement-extra { display: none; } }`}</style>
    </div>
  );
}
