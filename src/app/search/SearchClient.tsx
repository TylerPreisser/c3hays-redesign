"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { highlightWords, searchEntries, type SearchEntry } from "@/lib/search-index";
import { site } from "@/data/site";

const ANSWERS = [
  { href: "/visit/", label: "Plan a visit" },
  { href: "/locations/hays/", label: "Hays campus" },
  { href: "/locations/colby/", label: "Colby campus" },
];
function Answers() {
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: "0.75rem 0 0", display: "flex", flexWrap: "wrap", gap: "0.5rem 1.25rem" }}>
      {ANSWERS.map((a) => <li key={a.href}><Link href={a.href} prefetch={false} style={{ color: "#0b5f57", fontWeight: 700, display: "inline-block", padding: "0.6rem 0" }}>{a.label}</Link></li>)}
      <li><a href={`tel:${site.phone.replace(/\D/g, "")}`} style={{ color: "#0b5f57", fontWeight: 700, display: "inline-block", padding: "0.6rem 0" }}>Call {site.phone}</a></li>
    </ul>
  );
}
/** An excerpt with the searched words in bold. */
function Excerpt({ text, words }: { text: string; words: string[] }) {
  if (!words.length) return <>{text}</>;
  const re = new RegExp(`(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  return <>{text.split(re).map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>))}</>;
}

/** The box and the results. The index comes from the server; filtering happens here so it works in a static export too. */
export default function SearchClient({ index }: { index: SearchEntry[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const q = params.get("q") ?? "";
  const [draft, setDraft] = useState(q);
  useEffect(() => setDraft(q), [q]);
  const results = searchEntries(index, q);
  const submitted = q.trim().length > 0;
  const words = highlightWords(q);
  const shown = q.length > 60 ? `${q.slice(0, 60)}…` : q; // a pasted paragraph must not stretch the page

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
          maxLength={100}
          autoComplete="off"
          style={{ flex: "1 1 16rem", minHeight: 48, padding: "0 1.1rem", borderRadius: 999, border: "1px solid rgba(27,28,28,0.35)", fontSize: "1rem", background: "#fff", color: "#1b1c1c" }}
        />
        <button type="submit" className="btn btn-primary" style={{ minHeight: 48, color: "#0b2f2a" }}>Search</button>
      </form>
      <div role="status" aria-live="polite" style={{ marginTop: "1.5rem" }}>
        {submitted && (
          <p className="body-base" style={{ color: "#3a3b3b", margin: 0, overflowWrap: "anywhere" }}>
            {results.length === 0 ? <>Nothing matched &ldquo;{shown}&rdquo;. Looking for service times, kids or directions?</> : `${results.length} ${results.length === 1 ? "result" : "results"} for “${q}”`}
          </p>
        )}
      </div>
      {(!submitted || results.length === 0) && <Answers />}
      {results.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, margin: "1rem 0 0", display: "grid", gap: "0.75rem" }}>
          {results.map((r) => (
            <li key={r.href} style={{ background: "#fff", border: "1px solid rgba(27,28,28,0.12)", borderRadius: "var(--radius-md)" }}>
              <Link href={r.href} prefetch={false} style={{ display: "block", padding: "1rem 1.25rem", textDecoration: "none", color: "#1b1c1c" }}>
                <span className="body-sm" style={{ color: "#0f766e", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>{r.kind}</span>
                <span className="heading-3" style={{ display: "block", margin: "0.15rem 0 0" }}>{r.title}</span>
                {r.excerpt && <span className="body-sm" style={{ display: "block", marginTop: "0.35rem", color: "#3a3b3b" }}><Excerpt text={r.excerpt} words={words} /></span>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
