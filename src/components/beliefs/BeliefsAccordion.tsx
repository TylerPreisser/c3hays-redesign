"use client";

import { useState } from "react";

/**
 * <BeliefsAccordion> — Phase 4, Wave 2B (B1 mobile).
 *
 * The Statement of Faith as an accessible disclosure list for small screens
 * (`<lg`). The desktop `/beliefs` layout keeps its sticky rail + always-open list;
 * on mobile that two-column sticky pattern collapses badly, so each conviction
 * becomes a tap-to-expand accordion row instead.
 *
 * A11y: each row is a native <button> with `aria-expanded` + `aria-controls`
 * pointing at its region (`role="region"` + `aria-labelledby`). Multiple rows may
 * be open at once (friendlier than one-at-a-time for a reference document). The
 * expand/collapse uses a `grid-template-rows` 0fr→1fr transition, which respects
 * `prefers-reduced-motion` via the app-wide MotionConfig / CSS (no JS height math).
 *
 * Content is passed in PRE-RESOLVED from the server page (CMS overrides already
 * applied) so the C3 Studio editor keeps a single source of `data-cms` hooks on
 * the desktop list — this mobile view mirrors the resolved copy read-only.
 */
export interface BeliefsAccordionItem {
  id: string;
  /** 1-based display number (rendered zero-padded). */
  n: number;
  /** Resolved (possibly CMS-overridden) title HTML. */
  title: string;
  /** Resolved (possibly CMS-overridden) paragraph HTML, in order. */
  paragraphs: string[];
}

export default function BeliefsAccordion({
  items,
}: {
  items: BeliefsAccordionItem[];
}) {
  const [open, setOpen] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <ul className="flex flex-col" style={{ listStyle: "none", margin: 0, padding: 0 }}>
      {items.map((item) => {
        const isOpen = open.has(item.id);
        const btnId = `belief-btn-${item.id}`;
        const regionId = `belief-region-${item.id}`;
        return (
          <li
            key={item.id}
            style={{ borderBottom: "1px solid rgba(27,28,28,0.10)" }}
          >
            <h3 style={{ margin: 0 }}>
              <button
                id={btnId}
                type="button"
                onClick={() => toggle(item.id)}
                aria-expanded={isOpen}
                aria-controls={regionId}
                className="w-full flex items-center gap-4 text-left"
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  paddingTop: "1.25rem",
                  paddingBottom: "1.25rem",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                <span
                  className="shrink-0 tabular-nums"
                  style={{
                    color: "#1cc3af",
                    fontSize: "0.8125rem",
                    fontWeight: 700,
                    letterSpacing: "0.02em",
                  }}
                >
                  {String(item.n).padStart(2, "0")}
                </span>
                <span
                  className="heading-3 flex-1 min-w-0"
                  style={{ color: "#1b1c1c" }}
                  dangerouslySetInnerHTML={{ __html: item.title }}
                />
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="shrink-0"
                  style={{
                    width: 22,
                    height: 22,
                    color: "#1cc3af",
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.28s ease",
                  }}
                >
                  <path
                    d="M6 9l6 6 6-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </h3>

            {isOpen && (
              <div
                id={regionId}
                role="region"
                aria-labelledby={btnId}
                className="flex flex-col gap-4"
                style={{
                  paddingLeft: "calc(0.8125rem + 1rem)", // align under the title, past the number
                  paddingBottom: "1.5rem",
                }}
              >
                {item.paragraphs.map((para, pi) => (
                  <p
                    key={pi}
                    className="body-base"
                    style={{ color: "rgba(27,28,28,0.68)", lineHeight: 1.7 }}
                    dangerouslySetInnerHTML={{ __html: para }}
                  />
                ))}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
