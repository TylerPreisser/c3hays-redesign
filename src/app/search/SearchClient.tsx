"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { searchEntries, type SearchEntry } from "@/lib/search-index";

/** The box and the results. The index comes from the server; filtering happens here so it works in a static export too. */
export default function SearchClient({ index }: { index: SearchEntry[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const q = params.get("q") ?? "";
  const [draft, setDraft] = useState(q);
  useEffect(() => setDraft(q), [q]);
  const results = searchEntries(index, q);
  const submitted = q.trim().length > 0;

  return (
    <>
      <form
        role="search"
        action="/search/"
        method="get"
        onSubmit={(e) => { e.preventDefault(); router.replace(draft.trim() ? `/search/?q=${encodeURIComponent(draft.trim())}` : "/search/"); }}
        style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}
      >
        <label htmlFor="site-search" className="sr-only" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>Search the site</label>
        <input
          id="site-search"
          name="q"
          type="search"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Search messages and pages"
          autoComplete="off"
          style={{ flex: "1 1 16rem", minHeight: 48, padding: "0 1.1rem", borderRadius: 999, border: "1px solid rgba(27,28,28,0.35)", fontSize: "1rem", background: "#fff", color: "#1b1c1c" }}
        />
        <button type="submit" className="btn btn-primary" style={{ minHeight: 48, color: "#0b2f2a" }}>Search</button>
      </form>
      <div role="status" aria-live="polite" style={{ marginTop: "1.5rem" }}>
        {submitted && (
          <p className="body-base" style={{ color: "#3a3b3b", margin: 0 }}>
            {results.length === 0 ? <>Nothing matched &ldquo;{q}&rdquo;. Try a single word, like a speaker&rsquo;s name or a book of the Bible.</> : `${results.length} ${results.length === 1 ? "result" : "results"} for “${q}”`}
          </p>
        )}
      </div>
      {results.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, margin: "1rem 0 0", display: "grid", gap: "0.75rem" }}>
          {results.map((r) => (
            <li key={r.href} style={{ background: "#fff", border: "1px solid rgba(27,28,28,0.12)", borderRadius: "var(--radius-md)" }}>
              <Link href={r.href} prefetch={false} style={{ display: "block", padding: "1rem 1.25rem", textDecoration: "none", color: "#1b1c1c" }}>
                <span className="body-sm" style={{ color: "#0f766e", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>{r.kind}</span>
                <span className="heading-3" style={{ display: "block", margin: "0.15rem 0 0" }}>{r.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
