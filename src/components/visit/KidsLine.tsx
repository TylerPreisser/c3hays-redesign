"use client";

import { useServiceTimes } from "@/providers/ServiceTimesProvider";
import { campus, kidsTimes } from "@/lib/service-times-core";

/** The kids answer under the Hays times, built from the service rows that carry "with C3Kids" so it cannot disagree with them. No Colby line until the church states one. */
export default function KidsLine() {
  const kids = kidsTimes(campus(useServiceTimes(), "hays"));
  if (!kids) return null;
  return (
    <p className="body-base" data-kids-line style={{ color: "var(--color-ink)", marginTop: "var(--space-block)" }}>
      <strong>C3Kids</strong> is for children ages 3 through 5th grade, at {kids} at Hays.
    </p>
  );
}
