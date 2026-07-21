"use client";

import { useMemo, useState } from "react";
import { Search, Play, Inbox } from "lucide-react";
import type { PastMessage } from "@/data/messages";

/**
 * <PastMessagesGrid> — searchable / filterable PAST MESSAGES archive.
 *
 * Modeled on <IssueBrowser>: a client component with a useState SEARCH box (over
 * card titles + tags) and a YEAR facet filter (chips derived from the data). Each
 * card links out to the real C3 YouTube channel (youtube.com/@c3hays) in a new tab.
 *
 * Dark section (#1b1c1c) with #252727 cards + teal accents + white text — mirrors
 * the rest of the /messages page. Cards are authored/editable via src/data/messages.ts.
 *
 * Honest states (never a silent blank):
 *  - No messages seeded → compact "archive lives on YouTube" note.
 *  - Filters match none  → compact "no messages match" note + clear affordance.
 */
export interface PastMessagesGridProps {
  messages: PastMessage[];
  /** Fallback channel link for the empty state. */
  channelHref: string;
}

export default function PastMessagesGrid({ messages, channelHref }: PastMessagesGridProps) {
  const [query, setQuery] = useState("");
  const [year, setYear] = useState<string>("all"); // "all" | message.year

  // Year facets = distinct years, newest first.
  const years = useMemo(
    () => Array.from(new Set(messages.map((m) => m.year))).sort((a, b) => (a < b ? 1 : -1)),
    [messages]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return messages
      .filter((m) => (year === "all" ? true : m.year === year))
      .filter((m) => {
        if (!q) return true;
        const hay = [m.title, m.dateLabel, ...m.tags].join(" ").toLowerCase();
        return hay.includes(q);
      });
  }, [messages, query, year]);

  // Truly empty (no messages seeded) — honest, on-brand state.
  if (messages.length === 0) {
    return (
      <div
        className="flex items-center gap-4"
        style={{
          padding: "1.5rem 1.75rem",
          borderRadius: "var(--radius-md)",
          background: "#252727",
          border: "1px solid rgba(255,255,255,0.10)",
        }}
      >
        <span
          className="inline-flex items-center justify-center shrink-0"
          style={{
            width: "2.75rem",
            height: "2.75rem",
            borderRadius: "var(--radius-sm)",
            background: "rgba(28,195,175,0.14)",
            color: "var(--color-teal)",
          }}
          aria-hidden="true"
        >
          <Inbox size={20} />
        </span>
        <p className="body-base" style={{ color: "rgba(255,255,255,0.75)" }}>
          The full message archive lives on{" "}
          <a
            href={channelHref}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--color-teal)", fontWeight: 600 }}
          >
            YouTube
          </a>
          . New messages are added every weekend.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Controls: search + year facets */}
      <div className="flex flex-col gap-4" style={{ marginBottom: "2rem" }}>
        <div className="relative" style={{ maxWidth: 420 }}>
          <Search
            size={17}
            style={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
              color: "rgba(255,255,255,0.4)",
            }}
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search messages…"
            aria-label="Search past messages"
            style={{
              width: "100%",
              padding: "0.8rem 1rem 0.8rem 2.6rem",
              borderRadius: "var(--radius-pill)",
              border: "1px solid rgba(255,255,255,0.16)",
              background: "#252727",
              color: "#fff",
              fontSize: "0.9rem",
            }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by year">
          <span
            className="body-sm"
            style={{ color: "rgba(255,255,255,0.66)", fontWeight: 600, marginRight: 4 }}
          >
            Year:
          </span>
          <FacetChip active={year === "all"} onClick={() => setYear("all")}>
            All
          </FacetChip>
          {years.map((y) => (
            <FacetChip key={y} active={year === y} onClick={() => setYear(y)}>
              {y}
            </FacetChip>
          ))}
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div
          style={{
            padding: "1.5rem 1.75rem",
            borderRadius: "var(--radius-md)",
            background: "#252727",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <p className="body-base" style={{ color: "rgba(255,255,255,0.75)" }}>
            No messages match{" "}
            {query ? (
              <>
                &ldquo;<strong style={{ color: "#fff" }}>{query}</strong>&rdquo;
              </>
            ) : (
              "that year"
            )}
            .{" "}
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setYear("all");
              }}
              className="arrow-link"
              style={{ color: "var(--color-teal)", fontWeight: 600 }}
            >
              Clear filters
            </button>
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "clamp(16px, 2vw, 28px)",
            gridTemplateColumns: "repeat(auto-fit, minmax(clamp(240px, 22vw, 320px), 1fr))",
          }}
        >
          {filtered.map((m) => (
            <a
              key={m.id}
              href={m.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                background: "#252727",
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.10)",
                textDecoration: "none",
                transition: "transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = "rgba(28,195,175,0.55)";
                e.currentTarget.style.boxShadow = "0 18px 40px -20px rgba(0,0,0,0.7)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)";
                e.currentTarget.style.boxShadow = "none";
              }}
              aria-label={`Watch ${m.title} — ${m.dateLabel} on YouTube`}
            >
              {/* Thumbnail band with a play affordance */}
              <div
                className="relative flex items-center justify-center"
                style={{
                  aspectRatio: "16 / 9",
                  background:
                    "linear-gradient(135deg, rgba(28,195,175,0.20) 0%, rgba(23,156,140,0.10) 55%, rgba(255,255,255,0.03) 100%)",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <span
                  className="inline-flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{
                    width: "3.25rem",
                    height: "3.25rem",
                    borderRadius: 999,
                    background: "var(--color-teal)",
                    color: "#08312c",
                  }}
                  aria-hidden="true"
                >
                  <Play size={22} style={{ marginLeft: 2 }} fill="currentColor" />
                </span>
                <span
                  style={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    padding: "0.3rem 0.7rem",
                    borderRadius: 999,
                    background: "rgba(10,10,10,0.55)",
                    color: "#fff",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  YouTube
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "1.35rem 1.5rem" }}>
                <span
                  style={{
                    fontSize: "0.74rem",
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.6)",
                    marginBottom: 8,
                  }}
                >
                  {m.dateLabel}
                </span>
                <h3
                  className="heading-3"
                  style={{ color: "#fff", fontSize: "1.2rem", marginBottom: 8 }}
                >
                  {m.title}
                </h3>
                <div style={{ flex: 1 }} />
                {m.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2" style={{ marginTop: 14 }}>
                    {m.tags.map((tp) => (
                      <span
                        key={tp}
                        style={{
                          fontSize: "0.68rem",
                          fontWeight: 600,
                          padding: "0.25rem 0.65rem",
                          borderRadius: 999,
                          background: "rgba(28,195,175,0.12)",
                          color: "var(--color-teal)",
                        }}
                      >
                        {tp}
                      </span>
                    ))}
                  </div>
                )}
                <span
                  className="arrow-link"
                  style={{ marginTop: 16, color: "var(--color-teal)", fontWeight: 600, fontSize: "0.85rem" }}
                >
                  Watch on YouTube
                  <span className="arrow" aria-hidden="true">→</span>
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function FacetChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={{
        fontSize: "0.8rem",
        fontWeight: 600,
        padding: "0.45rem 0.95rem",
        borderRadius: 999,
        cursor: "pointer",
        border: active ? "1px solid var(--color-teal)" : "1px solid rgba(255,255,255,0.16)",
        background: active ? "var(--color-teal)" : "transparent",
        color: active ? "#08312c" : "rgba(255,255,255,0.72)",
        transition: "all 0.15s ease",
      }}
    >
      {children}
    </button>
  );
}
