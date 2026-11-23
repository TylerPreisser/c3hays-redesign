"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { useServiceTimes } from "@/providers/ServiceTimesProvider";
import { lastSundayStart, sundayLine } from "@/lib/service-times-core";
import { churchWallParts } from "@/lib/church-time";
import TimesCheckNote from "@/components/TimesCheckNote";

/**
 * One line on the home first screen: the Sunday services, from the same record every page reads, with the page's one
 * call-to-check line directly under it. It says "This Sunday" until the last Sunday service has started in church time,
 * then "Next Sunday". It links to Plan a Visit.
 */
export default function ThisSundayLine({ tone = "light" }: { tone?: "light" | "dark" }) {
  const line = sundayLine(useServiceTimes());
  const times = useServiceTimes();
  // "This Sunday" on the server and first paint; once the page is live it reads church time and may say "Next Sunday".
  const last = lastSundayStart(times);
  const pastLast = useSyncExternalStore(
    () => () => {},
    () => {
      const p = churchWallParts(new Date());
      if (!p || last === null) return false;
      return new Date(Date.UTC(p.year, p.month - 1, p.day)).getUTCDay() === 0 && p.hour * 60 + p.minute >= last;
    },
    () => false,
  );
  const when = pastLast ? "Next Sunday" : "This Sunday";
  if (!line) return null;
  const color = tone === "light" ? "rgba(255,255,255,0.92)" : "var(--color-ink)";
  return (
    <div data-this-sunday style={{ color, maxWidth: "36rem" }}>
      <p style={{ margin: 0, fontSize: "1rem", lineHeight: 1.55 }}>
        <Link href="/visit/" style={{ color: "inherit", textDecoration: "underline", textUnderlineOffset: 3 }}>
          <strong>{when}:</strong> {line}
        </Link>
      </p>
      <TimesCheckNote className="text-sm" style={{ margin: "0.5rem 0 0", color: tone === "light" ? "rgba(255,255,255,0.82)" : "rgba(27,28,28,0.78)" }} />
    </div>
  );
}
