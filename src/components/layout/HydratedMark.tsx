"use client";

import { useEffect } from "react";

/** Marks <html> once the page's script has run, which ends the visible-by-default fallback in the layout's head (see REVEAL_FALLBACK_CSS). */
export default function HydratedMark() {
  useEffect(() => { document.documentElement.classList.add("hydrated"); }, []);
  return null;
}
