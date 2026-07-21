"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Search, Clock, Inbox } from "lucide-react";
import { assetPath } from "@/lib/asset-path";
import type { NewsletterIssue } from "@/data/news";
import IssueReader from "./IssueReader";

/**
 * <IssueBrowser> — Phase 4, NL5 + NL6.
 *
 * A clickable, navigable way to browse The C3 Weekly: FILTER BY WEEK (date
 * facets derived from the issues) + SEARCH TOPICS (client-side over title,
 * excerpt, and topic tags). Renders premium issue cards; clicking one opens the
 * <IssueReader> modal for the full custom display.
 *
 * Honest states (never a big dashed panel, never a silent blank):
 *  - No issues at all  → a compact "first issue is on its way" note.
 *  - Filters match none → a compact "no issues match" note + clear affordance.
 */
export interface IssueBrowserProps {
  issues: NewsletterIssue[];
}

function weekLabel(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
function cardDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function IssueBrowser({ issues }: IssueBrowserProps) {
  const [query, setQuery] = useState("");
  const [week, setWeek] = useState<string>("all"); // "all" | issue.date
  const [openId, setOpenId] = useState<string | null>(null);

  // Week facets = the distinct issue dates, newest first.
  const weeks = useMemo(
    () => Array.from(new Set(issues.map((i) => i.date))).sort((a, b) => (a < b ? 1 : -1)),
    [issues]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return issues
      .filter((i) => (week === "all" ? true : i.date === week))
      .filter((i) => {
        if (!q) return true;
        const hay = [i.title, i.excerpt, ...i.topics].join(" ").toLowerCase();
        return hay.includes(q);
      })
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [issues, query, week]);

  const openIssue = openId ? issues.find((i) => i.id === openId) ?? null : null;

  // NOTE: even with zero issues seeded, we still render the SEARCH + WEEK-FILTER
  // controls (the browser is always present — never a bare "coming soon" placeholder).
  // The honest "first issue is on its way" note shows in the results area below.

  return (
    <div>
      {/* Controls: search + week facets */}
      <div className="flex flex-col gap-4" style={{ marginBottom: "2rem" }}>
        <div className="relative" style={{ maxWidth: 420 }}>
          <Search
            size={17}
            style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(27,28,28,0.4)" }}
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search topics — baptism, John, students…"
            aria-label="Search newsletter topics"
            style={{
              width: "100%",
              padding: "0.8rem 1rem 0.8rem 2.6rem",
              borderRadius: "var(--radius-pill)",
              border: "1px solid rgba(27,28,28,0.14)",
              background: "#fff",
              color: "var(--color-ink)",
              fontSize: "0.9rem",
            }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by week">
          <span className="body-sm" style={{ color: "var(--color-mute)", fontWeight: 600, marginRight: 4 }}>
            Week:
          </span>
          <FacetChip active={week === "all"} onClick={() => setWeek("all")}>
            All
          </FacetChip>
          {weeks.map((w) => (
            <FacetChip key={w} active={week === w} onClick={() => setWeek(w)}>
              {weekLabel(w)}
            </FacetChip>
          ))}
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 && issues.length === 0 ? (
        /* No issues seeded yet — honest, ready-to-fill state (controls stay above). */
        <div
          className="flex items-center gap-4"
          style={{
            padding: "1.5rem 1.75rem",
            borderRadius: "var(--radius-md)",
            background: "var(--color-mist)",
            border: "1px solid rgba(27,28,28,0.08)",
          }}
        >
          <span
            className="inline-flex items-center justify-center shrink-0"
            style={{ width: "2.75rem", height: "2.75rem", borderRadius: "var(--radius-sm)", background: "rgba(28,195,175,0.12)", color: "var(--color-teal)" }}
            aria-hidden="true"
          >
            <Inbox size={20} />
          </span>
          <p className="body-base" style={{ color: "var(--color-mute)" }}>
            The first issue of <strong style={{ color: "var(--color-ink)" }}>The C3 Weekly</strong> is
            on its way. Subscribe and you&rsquo;ll be the first to read it.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div
          style={{
            padding: "1.5rem 1.75rem",
            borderRadius: "var(--radius-md)",
            background: "var(--color-mist)",
            border: "1px solid rgba(27,28,28,0.08)",
          }}
        >
          <p className="body-base" style={{ color: "var(--color-mute)" }}>
            No issues match{" "}
            {query ? (
              <>
                &ldquo;<strong style={{ color: "var(--color-ink)" }}>{query}</strong>&rdquo;
              </>
            ) : (
              "that week"
            )}
            .{" "}
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setWeek("all");
              }}
              className="arrow-link"
              style={{ color: "var(--color-teal-deep)", fontWeight: 600 }}
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
            gridTemplateColumns:
              "repeat(auto-fit, minmax(clamp(260px, 22vw, 340px), 1fr))",
          }}
        >
          {filtered.map((issue) => (
            <button
              key={issue.id}
              type="button"
              onClick={() => setOpenId(issue.id)}
              className="bento-tile group text-left"
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                background: "#fff",
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
                border: "1px solid rgba(27,28,28,0.08)",
                boxShadow: "var(--shadow-rest)",
              }}
              aria-label={`Read Issue No. ${issue.number}: ${issue.title}`}
            >
              {issue.image && (
                <div className="relative overflow-hidden" style={{ aspectRatio: "16 / 9" }}>
                  <Image
                    src={assetPath(issue.image)}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, 400px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ objectFit: "cover" }}
                  />
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
                      background: "rgba(10,10,10,0.6)",
                      color: "#fff",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    Issue No. {issue.number}
                  </span>
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "1.5rem" }}>
                <div
                  className="flex items-center gap-3"
                  style={{ fontSize: "0.74rem", fontWeight: 600, color: "var(--color-mute)", marginBottom: 10 }}
                >
                  <span>{cardDate(issue.date)}</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock size={12} /> {issue.readMinutes} min
                  </span>
                </div>
                <h3 className="heading-3" style={{ color: "var(--color-ink)", fontSize: "1.2rem", marginBottom: 8 }}>
                  {issue.title}
                </h3>
                <p className="body-sm" style={{ color: "var(--color-mute)", lineHeight: 1.6 }}>
                  {issue.excerpt}
                </p>
                <div style={{ flex: 1 }} />
                <div className="flex flex-wrap gap-2" style={{ marginTop: 16 }}>
                  {issue.topics.map((tp) => (
                    <span
                      key={tp}
                      style={{
                        fontSize: "0.68rem",
                        fontWeight: 600,
                        padding: "0.25rem 0.65rem",
                        borderRadius: 999,
                        background: "rgba(28,195,175,0.1)",
                        color: "var(--color-teal-deep)",
                      }}
                    >
                      {tp}
                    </span>
                  ))}
                </div>
                <span
                  className="arrow-link"
                  style={{ marginTop: 16, color: "var(--color-teal-deep)", fontWeight: 600, fontSize: "0.85rem" }}
                >
                  Read issue
                  <span className="arrow" aria-hidden="true">→</span>
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {openIssue && <IssueReader issue={openIssue} onClose={() => setOpenId(null)} />}
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
        border: active ? "1px solid var(--color-teal)" : "1px solid rgba(27,28,28,0.14)",
        background: active ? "var(--color-teal)" : "#fff",
        color: active ? "#08312c" : "var(--color-mute)",
        transition: "all 0.15s ease",
      }}
    >
      {children}
    </button>
  );
}
