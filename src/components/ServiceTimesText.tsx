"use client";

import { Clock } from "lucide-react";
import { useServiceTimes } from "@/providers/ServiceTimesProvider";
import { campus, dayLine, kidsTimes, slotLabel, TIMES_TBA } from "@/lib/service-times-core";

/**
 * A campus's service times from Studio's records (the root layout feeds the provider), for server components that
 * stay synchronous. `compact`: "Sat 5:00 PM · Sun ..." in one run; `rows`: one clock row per day; `kids`: the times of the services that run C3Kids.
 */
export default function ServiceTimesText({
  campus: slug,
  as = "compact",
  className,
  rowClassName = "flex items-center gap-2",
  iconColor,
  textClassName = "body-base",
  textColor,
}: {
  campus: string;
  as?: "compact" | "rows" | "kids";
  className?: string;
  rowClassName?: string;
  iconColor?: string;
  textClassName?: string;
  textColor?: string;
}) {
  const c = campus(useServiceTimes(), slug);
  if (as === "kids") return <span className={className} data-service-times={slug}>{kidsTimes(c)}</span>;
  if (c.services.length === 0) {
    return as === "compact"
      ? <span className={className} data-service-times={slug}>{TIMES_TBA}</span>
      : <div className={rowClassName} data-service-times={slug}><Clock size={14} style={{ color: iconColor }} className="shrink-0" aria-hidden="true" /><span className={textClassName} style={{ color: textColor }}>{TIMES_TBA}</span></div>;
  }
  if (as === "compact") {
    // Each time stays on one line ("9:00 AM (with C3Kids)" never breaks between the time and AM).
    return (
      <span className={className} data-service-times={slug}>
        {c.services.map((sv, i) => (
          <span key={sv.day}>
            {i > 0 && " · "}
            {sv.day.slice(0, 3)}{" "}
            {sv.slots.map((x, j) => (
              <span key={j}>
                <span style={{ whiteSpace: "nowrap" }}>{slotLabel(x)}{j < sv.slots.length - 1 ? "," : ""}</span>{" "}
              </span>
            ))}
          </span>
        ))}
      </span>
    );
  }
  return (
    <>
      {c.services.map((sv) => (
        <div key={sv.day} className={rowClassName} data-service-times={slug}>
          <Clock size={14} style={{ color: iconColor }} className="shrink-0" aria-hidden="true" />
          <span className={textClassName} style={{ color: textColor }}>{dayLine(sv)}</span>
        </div>
      ))}
    </>
  );
}
