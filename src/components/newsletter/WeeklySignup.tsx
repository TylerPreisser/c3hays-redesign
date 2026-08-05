"use client";

import { useState, type CSSProperties } from "react";
import { Check } from "lucide-react";
import { tx } from "@/lib/home-content";

/**
 * <WeeklySignup> — the editor-native C3 Weekly newsletter signup (round-3).
 *
 * MINIMAL + TRANSPARENT: just an editable email field + a "Sign Up" button, laid
 * directly over the hero photo (NO white card surface, NO icon box, NO heading /
 * subtext block). It reads legibly on a dark hero photo AND on a light standalone
 * section via the `tone` prop.
 *
 * Editable in C3 Studio, by construction:
 *   • button → data-cms-link + the required data-cms-link-label span
 *   • container bg → data-cms-bg (defaults transparent — no opaque card)
 *
 * The field placeholder is the ONE part with no on-canvas handle, and that is a known
 * consequence of a ruling, not an oversight. It used to be surfaced as a visible <Tx>
 * label above the input — the workaround for attributes not being DOM-scannable — but
 * item #6b removed that label because it printed "your@email.com" directly above an
 * input already placeheld with "your@email.com". `weekly-signup-placeholder` is still
 * read here, so a value set through the content API renders; there is simply no region
 * to click to originate one. Do NOT "fix" this with an sr-only <Tx>: EditBridge edits
 * regions in place and a 1px-clipped region cannot be clicked, so that would look like
 * a handle without being one. If the placeholder needs to be authorable, it needs an
 * attribute-editing path in Studio (cross-repo), not another hidden node here.
 *
 * FUNCTIONAL: client-side email validation + a success state (no external endpoint
 * exists in the static-export build; the submit is structured so a real subscribe
 * POST can be dropped into `onSubmit`). Renders purely from the generic `text`
 * override map, so it is ALSO addable via the section library (engine renderExample).
 */
export interface WeeklySignupProps {
  /** CMS page/global text override bag. */
  text?: Record<string, string>;
  /** data-cms-bg key for the (transparent-by-default) container background. */
  bgKey?: string;
  /** Legibility context: "onDark" (over the hero photo, default) or "onLight"
   *  (standalone on a light section). Affects only label/text color — never the
   *  editable content. */
  tone?: "onDark" | "onLight";
  className?: string;
  style?: CSSProperties;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function WeeklySignup({ text = {}, bgKey = "weekly-signup-card", tone = "onDark", className, style }: WeeklySignupProps) {
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

  const onLight = tone === "onLight";
  const labelShadow = onLight ? undefined : "0 1px 3px rgba(0,0,0,0.55)";
  const doneColor = onLight ? "var(--color-teal-deep)" : "#fff";
  const errColor = onLight ? "#c0392b" : "#ffd7d0";

  // TRANSPARENT: no card surface (no bg/border/shadow/padding) — just the field
  // + button. Container keeps data-cms-bg so a bg can still be set in the editor,
  // but defaults transparent so it lays cleanly over the photo.
  const surface: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    background: "transparent",
    ...style,
  };

  return (
    <div className={className} data-cms-bg={bgKey} style={surface} aria-label="Subscribe to The C3 Weekly">
      {status === "done" ? (
        <p className="body-base inline-flex items-center gap-2" style={{ color: doneColor, fontWeight: 600, textShadow: labelShadow }} role="status">
          <Check size={18} /> You&rsquo;re on the list, watch your inbox.
        </p>
      ) : (
        <form className="flex flex-col gap-2.5 w-full min-w-0" onSubmit={onSubmit} noValidate>
          {/* #6b: the redundant visible "your@email.com" label ABOVE the field is REMOVED
              (it duplicated the input's own placeholder). The field keeps a screen-reader
              label via aria-label, and the placeholder is still driven by the
              `weekly-signup-placeholder` text key below — no visible duplication. */}
          <div className="flex flex-col sm:flex-row gap-2.5 w-full min-w-0">
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
            {/* Editable button: data-cms-link + required data-cms-link-label span. */}
            <button type="submit" data-cms-link="weekly-signup-cta" className="btn btn-primary">
              <span data-cms-link-label>{ctaLabel}</span>
            </button>
          </div>
          {status === "error" && (
            <span className="body-sm" style={{ color: errColor, textShadow: labelShadow }} role="alert">
              Please enter a valid email address.
            </span>
          )}
        </form>
      )}
    </div>
  );
}
