"use client";

import { useServiceTimes } from "@/providers/ServiceTimesProvider";
import { weekendLine } from "@/lib/service-times-core";

/**
 * "When we meet", from Studio's service-times record (the one every page reads), so it never depends on the church's
 * calendar feed answering. The weekend rows of that feed are corrected from the same record.
 */
export default function WeekendLine({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const line = weekendLine(useServiceTimes());
  if (!line) return null;
  return (
    <p className={className} data-weekend-line style={style}>
      <strong>When we meet.</strong> {line}
    </p>
  );
}
