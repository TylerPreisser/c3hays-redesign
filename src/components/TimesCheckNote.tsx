"use client";

import { useServiceTimes } from "@/providers/ServiceTimesProvider";
import { unconfirmedLabels, type ServiceTimesData } from "@/lib/service-times-core";
import { site } from "@/data/site";

/**
 * The page's one "please call to check" line, printed directly under the times it is about and naming them
 * ("Saturday 5:00 PM and Colby 10:00 AM: please call ..."). Drawn from Studio's "to confirm" flag, so it is gone from every
 * page the moment a staff member confirms the time. `scope`: "all" (a page that lists both campuses) or one campus slug.
 */
export default function TimesCheckNote({ scope = "all", data, className, style }: { scope?: "all" | string; data?: ServiceTimesData; className?: string; style?: React.CSSProperties }) {
  const fromContext = useServiceTimes();
  const names = unconfirmedLabels(data ?? fromContext, scope);
  if (names.length === 0) return null;
  const tel = `tel:${site.phone.replace(/\D/g, "")}`;
  return (
    <p className={className} data-times-check style={style}>
      {names.join(" and ")}: please call the office at{" "}
      <a href={tel} style={{ textDecoration: "underline", fontWeight: 600, display: "inline-block", padding: "0.5rem 0" }}>{site.phone}</a>
      {" "}to check before you come.
    </p>
  );
}
