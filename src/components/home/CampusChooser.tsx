"use client";

/* Campus chooser — the Church-on-the-Move "Find a Church" move, reskinned to C3.
   A rounded pill that opens a small panel to pick your campus (Hays / Colby).
   Works on dark hero backgrounds. Keyboard + click-away accessible. */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, MapPin } from "lucide-react";
import { locations } from "@/data/locations";

export default function CampusChooser({
  variant = "light",
}: {
  /** "light" = white pill (on dark hero) · "teal" = filled accent pill */
  variant?: "light" | "teal";
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        className="inline-flex items-center gap-2 font-bold transition-transform duration-200 hover:-translate-y-0.5"
        style={{
          ...pill,
          borderRadius: 999,
          padding: "1rem 1.6rem",
          fontSize: "0.9375rem",
        }}
      >
        Find your campus
        <ChevronDown
          size={18}
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 200ms ease" }}
        />
      </button>

      {open && (
        <div
          className="absolute z-30 mt-3 left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0"
          style={{
            width: "min(92vw, 340px)",
            background: "#fff",
            borderRadius: "var(--radius-md)",
            boxShadow: "0 24px 60px rgba(10,10,10,0.28)",
            overflow: "hidden",
          }}
        >
          {locations.map((loc, i) => (
            <Link
              key={loc.id}
              href={`/locations/${loc.slug}/`}
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
                <span className="block font-bold leading-tight" style={{ color: "var(--color-ink)" }}>
                  {loc.name}
                </span>
                <span className="block text-sm truncate" style={{ color: "rgba(27,28,28,0.55)" }}>
                  {loc.city}, {loc.state} ·{" "}
                  {loc.services[0]?.day} {loc.services[0]?.times[0]}
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
