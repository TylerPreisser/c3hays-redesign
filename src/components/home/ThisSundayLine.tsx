"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { useServiceTimes } from "@/providers/ServiceTimesProvider";
import { lastSundayStart, weekendRows } from "@/lib/service-times-core";
import { churchWallParts } from "@/lib/church-time";
import TimesCheckNote from "@/components/TimesCheckNote";

/**
 * The weekend on the home first screen, in one short row per campus from the same record every page reads, with the page's one
 * call-to-check line directly under it. Saturday is given as a time. It says "This weekend" until the last Sunday service has
 * started in church time, then "Next weekend". It links to Plan a Visit.
 */
export default function ThisSundayLine({ tone = "light" }: { tone?: "light" | "dark" }) {
  const times = useServiceTimes();
  const rows = weekendRows(times);
  const last = lastSundayStart(times);
  // "This weekend" on the server and first paint; once the page is live it reads church time and may say "Next weekend".
  const pastLast = useSyncExternalStore(
    () => () => {},
    () => {
      const p = churchWallParts(new Date());
      if (!p || last === null) return false;
      return new Date(Date.UTC(p.year, p.month - 1, p.day)).getUTCDay() === 0 && p.hour * 60 + p.minute >= last;
    },
    () => false,
  );
  if (rows.length === 0) return null;
  const color = tone === "light" ? "rgba(255,255,255,0.92)" : "var(--color-ink)";
  return (
    <div data-this-sunday style={{ color, maxWidth: "36rem" }}>
      <Link href="/visit/" style={{ color: "inherit", textDecoration: "none", display: "block" }}>
        <strong style={{ display: "block", fontSize: "0.8rem", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "0.35rem" }}>{pastLast ? "Next weekend" : "This weekend"}</strong>
        {rows.map((r) => (
          <p key={r.name} style={{ margin: "0 0 0.3rem", fontSize: "1rem", lineHeight: 1.5 }}>
            <strong>{r.name}</strong> {"\u00b7"} {r.text}
          </p>
        ))}
      </Link>
      <TimesCheckNote className="text-sm" style={{ margin: "0.5rem 0 0", color: tone === "light" ? "rgba(255,255,255,0.82)" : "rgba(27,28,28,0.78)" }} />
    </div>
  );
}
