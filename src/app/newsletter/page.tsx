"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

/**
 * /newsletter → /news/ redirect.
 *
 * "The C3 Weekly" now lives at its OWN page, /news. This legacy route forwards there
 * (SEO / back-compat) so the old /newsletter link and the editor's "News" resolve to
 * the real C3 Weekly content — NOT the old Visit page (reversing the redirect-orphan
 * chain news → newsletter → the-visit-page that made the editor's "News" show Visit).
 *
 * Robust for BOTH build modes (next.config redirects are ignored by output:export):
 *   1. client-side router.replace("/news/") in useEffect (SPA nav, no history entry),
 *   2. a <meta httpEquiv="refresh"> so a static export / no-JS load still forwards,
 *   3. a visible fallback link if neither fires.
 */
const TARGET = "/news/";

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
            The C3 Weekly
          </p>
          <h1 className="display-2 text-balance" style={{ marginBottom: "var(--space-heading)" }}>
            Taking you to The C3 Weekly&hellip;
          </h1>
          <p className="body-lg" style={{ color: "var(--color-stone)" }}>
            If you aren&rsquo;t redirected automatically,{" "}
            <Link href={TARGET} style={{ color: "var(--color-teal-deep)", fontWeight: 600, textDecoration: "underline" }}>
              continue to The C3 Weekly
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
