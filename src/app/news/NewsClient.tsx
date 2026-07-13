"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { assetPath } from "@/lib/asset-path";
import { newsCategories, type NewsItem } from "@/data/news";
import NewsletterForm from "@/components/layout/NewsletterForm";

type Range = "all" | "week" | "month" | "older";
const RANGES: { key: Range; label: string }[] = [
  { key: "week", label: "This week" },
  { key: "month", label: "This month" },
  { key: "older", label: "Earlier" },
  { key: "all", label: "All" },
];

// "today" baseline for the demo data
const TODAY = new Date("2026-06-29T00:00:00");
const daysAgo = (iso: string) => Math.floor((TODAY.getTime() - new Date(iso + "T00:00:00").getTime()) / 86400000);

export default function NewsClient({ items }: { items: NewsItem[] }) {
  const [range, setRange] = useState<Range>("month");
  const [cat, setCat] = useState<string>("All");

  const filtered = useMemo(() => {
    return items
      .filter((n) => (cat === "All" ? true : n.category === cat))
      .filter((n) => {
        const d = daysAgo(n.date);
        if (range === "week") return d <= 7;
        if (range === "month") return d <= 31;
        if (range === "older") return d > 31;
        return true;
      })
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [items, range, cat]);

  return (
    <>
      {/* Header */}
      <section className="section" style={{ backgroundColor: "#1b1c1c", paddingBottom: "clamp(2.5rem,5vw,3.5rem)" }}>
        <div className="container-c3">
          <span style={{ textTransform: "uppercase", letterSpacing: "0.16em", fontSize: "0.75rem", fontWeight: 700, color: "#1cc3af" }}>What&apos;s happening</span>
          <h1 className="display-1 text-white" style={{ margin: "0.75rem 0 1rem" }}>News at C3</h1>
          <p className="body-lg" style={{ color: "rgba(255,255,255,0.6)", maxWidth: 620 }}>
            The latest from across both campuses — events, messages, and announcements. Filter by date to look back as far as you like.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section style={{ backgroundColor: "#fff", borderBottom: "1px solid rgba(27,28,28,0.08)", position: "sticky", top: 0, zIndex: 20 }}>
        <div className="container-c3" style={{ paddingTop: "1rem", paddingBottom: "1rem", display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
          <div style={{ display: "inline-flex", background: "#f6f6f6", borderRadius: 999, padding: 4 }}>
            {RANGES.map((r) => (
              <button key={r.key} onClick={() => setRange(r.key)}
                style={{ border: "none", cursor: "pointer", borderRadius: 999, padding: "0.5rem 1rem", fontSize: ".85rem", fontWeight: 600,
                  background: range === r.key ? "var(--color-teal)" : "transparent", color: range === r.key ? "#042e29" : "rgba(27,28,28,0.6)" }}>
                {r.label}
              </button>
            ))}
          </div>
          <div style={{ marginLeft: "auto", display: "flex", flexWrap: "wrap", gap: 8 }}>
            {newsCategories.map((c) => (
              <button key={c} onClick={() => setCat(c)}
                style={{ border: `1px solid ${cat === c ? "var(--color-teal)" : "rgba(27,28,28,0.14)"}`, background: cat === c ? "rgba(28,195,175,0.1)" : "#fff",
                  color: cat === c ? "var(--color-teal-deep)" : "rgba(27,28,28,0.6)", cursor: "pointer", borderRadius: 999, padding: "0.4rem 0.85rem", fontSize: ".8rem", fontWeight: 600 }}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="section" style={{ backgroundColor: "#f6f6f6" }}>
        <div className="container-c3">
          {filtered.length === 0 ? (
            <p style={{ color: "rgba(27,28,28,0.55)", textAlign: "center", padding: "3rem 0" }}>Nothing in this range — try “All”.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((n) => (
                <Link key={n.id} href={n.href} className="group block" style={{ background: "#fff", borderRadius: "var(--radius-md)", overflow: "hidden", border: "1px solid rgba(27,28,28,0.08)" }}>
                  <div className="relative overflow-hidden" style={{ aspectRatio: "16/10" }}>
                    <Image src={assetPath(n.image)} alt={n.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    <span style={{ position: "absolute", top: 12, left: 12, background: "var(--color-teal)", color: "#042e29", fontSize: ".68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", padding: "0.25rem 0.6rem", borderRadius: 999 }}>{n.category}</span>
                  </div>
                  <div style={{ padding: "1.4rem" }}>
                    <p style={{ fontSize: ".72rem", color: "rgba(27,28,28,0.45)", fontWeight: 600, marginBottom: 8 }}>
                      {new Date(n.date + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </p>
                    <h3 className="heading-2 group-hover:text-[#179c8c] transition-colors" style={{ fontSize: "1.2rem", marginBottom: 8, color: "#1b1c1c" }}>{n.title}</h3>
                    <p style={{ fontSize: ".9rem", color: "rgba(27,28,28,0.62)", lineHeight: 1.6 }}>{n.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="section" style={{ backgroundColor: "#fff" }}>
        <div className="container-c3" style={{ maxWidth: 560, textAlign: "center" }}>
          <span style={{ textTransform: "uppercase", letterSpacing: "0.16em", fontSize: "0.75rem", fontWeight: 700, color: "#1cc3af" }}>Stay in the loop</span>
          <h2 className="display-2" style={{ margin: "0.75rem 0 1rem", color: "#1b1c1c" }}>Get C3 news in your inbox</h2>
          <p className="body-base" style={{ color: "rgba(27,28,28,0.6)", marginBottom: "1.75rem" }}>The week&apos;s happenings, new messages, and what&apos;s coming up — sent straight to you.</p>
          <div style={{ maxWidth: 420, margin: "0 auto" }}><NewsletterForm /></div>
        </div>
      </section>
    </>
  );
}
