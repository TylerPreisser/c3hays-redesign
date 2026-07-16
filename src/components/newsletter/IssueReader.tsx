"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { X, Clock, ArrowLeft } from "lucide-react";
import { assetPath } from "@/lib/asset-path";
import type { NewsletterIssue } from "@/data/news";

/**
 * <IssueReader> — Phase 4, NL6.
 *
 * The beautiful, custom single-issue display. Opened from <IssueBrowser> when a
 * reader clicks an issue card; renders as an accessible modal dialog over a
 * dimmed backdrop with an on-theme "editorial" reading layout: cover image,
 * issue meta, title, topic chips, and the issue sections.
 *
 * A11y: role="dialog" + aria-modal, Escape to close, backdrop click to close,
 * body scroll lock while open, focus moved to the panel.
 */
export interface IssueReaderProps {
  issue: NewsletterIssue;
  onClose: () => void;
}

function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function IssueReader({ issue, onClose }: IssueReaderProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div
      role="presentation"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "clamp(0.75rem, 4vw, 3rem)",
        overflowY: "auto",
        background: "rgba(10,10,10,0.62)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="issue-reader-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 720,
          background: "#fff",
          borderRadius: "var(--radius-md)",
          overflow: "hidden",
          boxShadow: "0 40px 120px rgba(10,10,10,0.5)",
          outline: "none",
        }}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close issue"
          className="inline-flex items-center justify-center"
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            zIndex: 2,
            width: "2.5rem",
            height: "2.5rem",
            borderRadius: 999,
            background: "rgba(10,10,10,0.55)",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <X size={18} />
        </button>

        {/* Cover */}
        {issue.image && (
          <div className="relative" style={{ aspectRatio: "16 / 9", background: "var(--color-mist)" }}>
            <Image
              src={assetPath(issue.image)}
              alt=""
              fill
              sizes="(max-width: 720px) 100vw, 720px"
              className="object-cover"
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(10,10,10,0) 40%, rgba(10,10,10,0.55) 100%)",
              }}
            />
          </div>
        )}

        {/* Body */}
        <div style={{ padding: "clamp(1.75rem, 4vw, 3rem)" }}>
          <button
            type="button"
            onClick={onClose}
            className="arrow-link"
            style={{ color: "var(--color-teal-deep)", marginBottom: "1.5rem", fontSize: "0.85rem" }}
          >
            <ArrowLeft size={15} style={{ marginRight: 4 }} />
            All issues
          </button>

          <div
            className="flex items-center flex-wrap gap-x-4 gap-y-1"
            style={{ color: "var(--color-mute)", fontSize: "0.82rem", fontWeight: 600, marginBottom: "0.9rem" }}
          >
            <span style={{ color: "var(--color-teal-deep)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Issue No. {issue.number}
            </span>
            <span>{formatDate(issue.date)}</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock size={14} /> {issue.readMinutes} min read
            </span>
          </div>

          <h2
            id="issue-reader-title"
            className="display-2"
            style={{ color: "var(--color-ink)", marginBottom: "1rem" }}
          >
            {issue.title}
          </h2>

          <div className="flex flex-wrap gap-2" style={{ marginBottom: "2rem" }}>
            {issue.topics.map((tp) => (
              <span
                key={tp}
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  padding: "0.3rem 0.75rem",
                  borderRadius: 999,
                  background: "rgba(28,195,175,0.1)",
                  color: "var(--color-teal-deep)",
                }}
              >
                {tp}
              </span>
            ))}
          </div>

          <div className="flex flex-col" style={{ gap: "var(--space-block)" }}>
            {issue.sections.map((s, i) => (
              <div key={i}>
                <h3
                  className="heading-3"
                  style={{ color: "var(--color-ink)", fontSize: "1.15rem", marginBottom: "0.6rem" }}
                >
                  {s.heading}
                </h3>
                <p
                  className="body-base"
                  style={{ color: "var(--color-mute)", lineHeight: 1.7 }}
                  dangerouslySetInnerHTML={{ __html: s.body }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
