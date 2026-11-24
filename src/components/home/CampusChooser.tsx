"use client";

/* Campus chooser — the Church-on-the-Move "Find a Church" move, reskinned to C3.
   A rounded pill that opens a small panel to pick your campus (Hays / Colby).
   Works on dark hero backgrounds. Keyboard + click-away accessible. */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, MapPin } from "lucide-react";
import { useServiceTimes } from "@/providers/ServiceTimesProvider";
import { campus, weekendRow } from "@/lib/service-times-core";
import { locations } from "@/data/locations";
import { btnCss } from "./btn-css";
import type { BtnStyle } from "@/lib/home-content";

export default function CampusChooser({
  variant = "light",
  id = "findcampus",
  text = {},
  btn = {},
}: {
  /** "light" = white pill (on dark hero) · "teal" = filled accent pill */
  variant?: "light" | "teal";
  /** unique CMS id (lets the hero + locations choosers be edited independently) */
  id?: string;
  text?: Record<string, string>;
  btn?: Record<string, BtnStyle>;
}) {
  const serviceTimes = useServiceTimes();
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  // The panel is as wide as the screen allows (340 at most, 16 px gutters) and is slid sideways until it sits inside the screen.
  const [shift, setShift] = useState(0);
  useLayoutEffect(() => {
    if (!open || !ref.current) return;
    const place = () => {
      const vw = document.documentElement.clientWidth;
      const w = Math.min(340, vw - 32);
      const left = ref.current!.getBoundingClientRect().left;
      setShift(Math.max(16 - left, Math.min(0, vw - 16 - w - left)));
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [open]);

  // v8 D2: in the C3 Studio editor (?cmsEdit=1 inside the iframe) the disclosure
  // toggle competes with EditBridge's click-to-SELECT — clicking "Find your campus"
  // opened the dropdown instead of selecting the button, so the button looked
  // uneditable. Detect edit mode and suppress the toggle so the click falls through
  // to EditBridge, which selects this [data-cms-link] like any other button.
  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search);
      setEditMode(q.get("cmsEdit") === "1" && window.parent !== window);
    } catch { /* SSR / sandboxed — stay live */ }
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pill =
    variant === "teal"
      ? { background: "var(--color-teal)", color: "#fff", border: "2px solid var(--color-teal)" }
      : { background: "#fff", color: "var(--color-ink)", border: "2px solid #fff" };

  return (
    <div ref={ref} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => { if (editMode) return; setOpen((o) => !o); }}
        aria-haspopup="true"
        aria-expanded={open}
        data-cms-link={id}
        className="inline-flex items-center gap-2 font-bold transition-transform duration-200 hover:-translate-y-0.5"
        style={{
          ...pill,
          borderRadius: 999,
          padding: "1rem 1.6rem",
          fontSize: "0.9375rem",
          ...(btnCss(btn[id]) || {}),
        }}
      >
        <span data-cms-link-label>{text[`${id}-label`] || "Find your campus"}</span>
        <ChevronDown
          size={18}
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 200ms ease" }}
        />
      </button>

      {open && (
        <div
          ref={panelRef}
          data-campus-panel
          className="absolute z-30 mt-3 left-0"
          style={{
            width: "min(340px, calc(100vw - 32px))",
            transform: `translateX(${shift}px)`,
            background: "#fff",
            borderRadius: "var(--radius-md)",
            boxShadow: "0 24px 60px rgba(10,10,10,0.28)",
            overflow: "hidden",
          }}
        >
          {locations.map((loc, i) => (
            <Link
              key={loc.id}
              href={text[`${id}-item-${loc.id}-href`] || `/locations/${loc.slug}/`}
              data-cms-link={`${id}-item-${loc.id}`}
              className="flex items-center gap-3 px-5 py-4 transition-colors duration-150 hover:bg-[#f6f6f6]"
              style={{
                borderTop: i === 0 ? "none" : "1px solid rgba(27,28,28,0.08)",
                textAlign: "left",
              }}
            >
              <span
                className="shrink-0 grid place-items-center"
                style={{
                  width: 38, height: 38, borderRadius: 999,
                  background: "rgba(28,195,175,0.12)", color: "var(--color-teal)",
                }}
              >
                <MapPin size={17} />
              </span>
              <span className="min-w-0">
                <span className="block font-bold leading-tight" data-cms-link-label style={{ color: "var(--color-ink)" }}>
                  {loc.name}
                </span>
                <span className="block text-sm" style={{ color: "rgba(27,28,28,0.7)", lineHeight: 1.4 }}>
                  {loc.city}, {loc.state} ·{" "}
                  {weekendRow(campus(serviceTimes, loc.id), true)}
                </span>
              </span>
              <ChevronDown size={16} className="ml-auto -rotate-90 shrink-0" style={{ color: "rgba(27,28,28,0.35)" }} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
