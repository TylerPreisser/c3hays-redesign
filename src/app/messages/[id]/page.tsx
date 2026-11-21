import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { dateLabel, getSermons } from "@/lib/sermons";

/**
 * One message, read from Studio's published sermons. Studio only publishes a sermon that has a church video, so the
 * player is always real. A sermon Studio does not have (or Studio down) is a 404, never an invented page.
 * A static export has no Studio, so it enumerates nothing and this route exists only in the live build.
 */
export const dynamic = "force-dynamic";
export async function generateStaticParams(): Promise<{ id: string }[]> {
  return [];
}

async function find(id: string) {
  const all = await getSermons();
  return all?.find((s) => s.id === id) ?? null;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const s = await find((await params).id);
  return s ? { title: s.title, description: s.description || `A message from Celebration Community Church${s.speaker ? ` by ${s.speaker}` : ""}.` } : { title: "Message" };
}

export default async function MessagePage({ params }: { params: Promise<{ id: string }> }) {
  const s = await find((await params).id);
  if (!s) notFound();
  const when = dateLabel(s.date);
  const meta = [when, s.speaker].filter(Boolean).join(" · ");
  return (
    <>
      <section style={{ backgroundColor: "#1b1c1c", color: "#fff", paddingTop: "clamp(10.5rem, 16vw, 12rem)", paddingBottom: "clamp(2rem, 5vw, 3.5rem)" }}>
        <div className="container-c3">
          <Link href="/messages/" className="arrow-link body-sm" style={{ color: "var(--color-teal)", fontWeight: 600 }}>
            <span aria-hidden="true">←</span> All messages
          </Link>
          <h1 className="display-1 text-balance" style={{ margin: "1.25rem 0 0.75rem", maxWidth: "22ch" }}>{s.title}</h1>
          {meta && <p className="body-lg" style={{ color: "rgba(255,255,255,0.72)", margin: 0 }}>{meta}</p>}
        </div>
      </section>
      <section style={{ backgroundColor: "#1b1c1c", paddingBottom: "clamp(3rem, 8vw, 6rem)" }}>
        <div className="container-c3">
          <div style={{ maxWidth: "64rem" }}>
          {s.youtube_video_id ? (
            <div style={{ position: "relative", aspectRatio: "16 / 9", borderRadius: "var(--radius-md)", overflow: "hidden", background: "#000" }}>
              <iframe
                title={`Video: ${s.title}`}
                src={`https://www.youtube-nocookie.com/embed/${s.youtube_video_id}`}
                allow="accelerometer; encrypted-media; picture-in-picture"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
              />
            </div>
          ) : (
            <p className="body-base" style={{ color: "rgba(255,255,255,0.78)" }}>
              This message is on our{" "}
              <a href="https://www.youtube.com/@c3hays" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-teal)", fontWeight: 600 }}>YouTube channel</a>.
            </p>
          )}
          {(s.scripture_references?.length ?? 0) > 0 && (
            <p className="body-base" style={{ color: "rgba(255,255,255,0.78)", marginTop: "1.5rem" }}>
              <strong style={{ color: "#fff" }}>Scripture:</strong> {s.scripture_references!.join(", ")}
            </p>
          )}
          {s.description && <p className="body-lg" style={{ color: "rgba(255,255,255,0.85)", marginTop: "1.5rem", maxWidth: "46rem", whiteSpace: "pre-line" }}>{s.description}</p>}
          </div>
        </div>
      </section>
    </>
  );
}
