"use client";

import { useState, type CSSProperties } from "react";
import { Mail, Check } from "lucide-react";
import { Tx } from "@/components/cms/Editable";
import { tx } from "@/lib/home-content";

/**
 * <WeeklySignup> — the editor-native C3 Weekly newsletter signup (round-2 #9).
 *
 * A NEW, built-from-scratch editor-native component (NOT the old InboxTile). Every
 * part is independently editable in C3 Studio, by construction:
 *   • heading   → <Tx data-cms="t:weekly-signup-heading">
 *   • body      → <Tx data-cms="t:weekly-signup-body">
 *   • the field placeholder → a real <Tx> label (data-cms) that ALSO drives the
 *     input's placeholder attribute, so editing the label edits the placeholder
 *     (attributes aren't DOM-scannable, so we surface an editable label instead)
 *   • button    → data-cms-link + the required data-cms-link-label span
 *   • card bg   → data-cms-bg
 *
 * FUNCTIONAL: client-side email validation + a success state (no external endpoint
 * exists in the static-export build; the submit is structured so a real subscribe
 * POST can be dropped into `onSubmit`). Renders purely from the generic `text`
 * override map, so it is ALSO addable via the section library (engine renderExample).
 */
export interface WeeklySignupProps {
  /** CMS page/global text override bag. */
  text?: Record<string, string>;
  /** data-cms-bg key for the card background (editable tile bg). */
  bgKey?: string;
  className?: string;
  style?: CSSProperties;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function WeeklySignup({ text = {}, bgKey = "weekly-signup-card", className, style }: WeeklySignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "done">("idle");

  const placeholder = tx(text, "weekly-signup-placeholder", "your@email.com");
  const ctaLabel = text["weekly-signup-cta-label"] || "Sign Up";

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setStatus("error");
      return;
    }
    // No public subscribe endpoint in the static-export build — record success
    // client-side. Drop a real `await fetch(SUBSCRIBE_URL, …)` here when it lands.
    setStatus("done");
  };

  const surface: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "var(--space-heading)",
    padding: "clamp(1.75rem, 3vw, 2.25rem)",
    borderRadius: "var(--radius-md)",
    background: "linear-gradient(180deg, #ffffff 0%, #fbfffe 100%)",
    border: "1px solid rgba(28,195,175,0.22)",
    boxShadow: "0 20px 50px rgba(28,195,175,0.14)",
    ...style,
  };

  return (
    <div className={className} data-cms-bg={bgKey} style={surface} aria-label="Subscribe to The C3 Weekly">
      <span
        className="inline-flex items-center justify-center"
        style={{ width: "3rem", height: "3rem", borderRadius: "var(--radius-sm)", background: "rgba(28,195,175,0.12)", color: "var(--color-teal)" }}
        aria-hidden="true"
      >
        <Mail size={24} />
      </span>

      <div>
        <Tx
          text={text}
          k="weekly-signup-heading"
          fallback="Get The C3 Weekly"
          as="h3"
          className="heading-3"
          style={{ color: "var(--color-ink)" }}
        />
        <Tx
          text={text}
          k="weekly-signup-body"
          fallback="One short email each week &mdash; what&rsquo;s coming up, this week&rsquo;s message, and simple next steps."
          as="p"
          className="body-sm"
          style={{ color: "var(--color-mute)", marginTop: "0.6rem", lineHeight: 1.6 }}
        />
      </div>

      {status === "done" ? (
        <p className="body-base inline-flex items-center gap-2" style={{ color: "var(--color-teal-deep)", fontWeight: 600 }} role="status">
          <Check size={18} /> You&rsquo;re on the list — watch your inbox.
        </p>
      ) : (
        <form className="flex flex-col gap-2.5 w-full min-w-0" onSubmit={onSubmit} noValidate>
          {/* Editable field label — ALSO the input's placeholder text (editing this
              in the editor edits what the field prompts for). */}
          <Tx
            text={text}
            k="weekly-signup-placeholder"
            fallback="your@email.com"
            as="label"
            className="body-sm"
            style={{ color: "var(--color-mute)", fontWeight: 600 }}
          />
          <input
            id="weekly-signup-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder={placeholder}
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle"); }}
            className="newsletter-input w-full min-w-0"
            aria-label="Email address"
            aria-invalid={status === "error"}
          />
          {status === "error" && (
            <span className="body-sm" style={{ color: "#c0392b" }} role="alert">
              Please enter a valid email address.
            </span>
          )}
          {/* Editable button: data-cms-link + required data-cms-link-label span. */}
          <button type="submit" data-cms-link="weekly-signup-cta" className="btn btn-primary w-full">
            <span data-cms-link-label>{ctaLabel}</span>
          </button>
        </form>
      )}
    </div>
  );
}
