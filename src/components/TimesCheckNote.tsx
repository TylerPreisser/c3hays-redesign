"use client";

import { useServiceTimes } from "@/providers/ServiceTimesProvider";
import { anyUnconfirmed, CHECK_NOTE } from "@/lib/service-times-core";

/**
 * The page's one "please call to check" line. Rendered once, in the footer every page carries, and only while Studio
 * has a time marked "to confirm"; confirming it in Studio clears the line everywhere at once.
 */
export default function TimesCheckNote() {
  if (!anyUnconfirmed(useServiceTimes())) return null;
  return <p data-times-check-note>{CHECK_NOTE}</p>;
}
