"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * /newsletter → /visit/ redirect.
 *
 * "Plan Your Visit" and "The C3 Weekly" were merged into ONE consolidated page at
 * /visit (redesign/visit). This route now redirects there.
 *
 * Robust for BOTH build modes (next.config redirects are ignored by output:export,
 * so we can't rely on them):
 *   1. client-side router.replace("/visit/") in useEffect (SPA nav, no history entry),
 *   2. a <meta httpEquiv="refresh"> so a static export / no-JS load still forwards,
 *   3. a visible fallback link if neither fires.
 */
const TARGET = "/visit/";

export default function NewsletterRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace(TARGET);
  }, [router]);

  return (
    <>
      {/* Static-export / no-JS fallback. React hoists this <meta> into <head>. */}
      <meta httpEquiv="refresh" content={`0;url=${TARGET}`} />
      <section
        className="section"
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "var(--color-paper)",
          color: "var(--color-ink-warm)",
          textAlign: "center",
        }}
      >
        <div className="container-c3">
          <p className="overline" style={{ color: "var(--color-teal-deep)", marginBottom: "var(--space-eyebrow)" }}>
            The C3 Weekly has moved
          </p>
          <h1 className="display-2 text-balance" style={{ marginBottom: "var(--space-heading)" }}>
            Taking you to Plan Your Visit&hellip;
          </h1>
          <p className="body-lg" style={{ color: "var(--color-stone)" }}>
            If you aren&rsquo;t redirected automatically,{" "}
            <a href={TARGET} style={{ color: "var(--color-teal-deep)", fontWeight: 600, textDecoration: "underline" }}>
              continue to /visit
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
