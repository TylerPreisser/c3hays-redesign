import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Play, ExternalLink, Mic } from "lucide-react";

export const metadata: Metadata = {
  title: "Messages",
  description:
    "Watch and listen to sermons from Celebration Community Church — anytime, anywhere.",
};

const recentMessages = [
  {
    title: "The God Who Sees",
    series: "Genesis",
    speaker: "Lead Pastor",
    date: "April 27, 2026",
    image: "/images/worship.webp",
  },
  {
    title: "Faith Over Fear",
    series: "Matthew",
    speaker: "Lead Pastor",
    date: "April 20, 2026",
    image: "/images/congregation.webp",
  },
  {
    title: "What Love Looks Like",
    series: "1 Corinthians 13",
    speaker: "Guest Speaker",
    date: "April 13, 2026",
    image: "/images/gather.webp",
  },
  {
    title: "The Prodigal Father",
    series: "Luke 15",
    speaker: "Lead Pastor",
    date: "April 6, 2026",
    image: "/images/worship.webp",
  },
  {
    title: "Resurrection Power",
    series: "Easter 2026",
    speaker: "Lead Pastor",
    date: "March 29, 2026",
    image: "/images/exterior.webp",
  },
  {
    title: "When God Speaks",
    series: "Hearing God",
    speaker: "Lead Pastor",
    date: "March 22, 2026",
    image: "/images/nt26.webp",
  },
];

export default function MessagesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex items-end overflow-hidden" style={{ minHeight: "50vh" }}>
        <div className="absolute inset-0">
          <Image
            src="/images/worship.webp"
            alt="Sunday worship service"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0" style={{ background: "rgba(10,10,10,0.62)" }} />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.2) 60%, transparent 100%)",
            }}
          />
        </div>
        <div className="relative z-10 container-c3 pb-16 pt-40">
          <p className="overline mb-4" style={{ color: "rgba(255,255,255,0.55)" }}>Sermons</p>
          <h1 className="display-1 text-white">Watch &amp; Listen</h1>
          <p className="body-lg mt-4 max-w-lg" style={{ color: "rgba(255,255,255,0.65)" }}>
            Miss a Sunday? Browse our full sermon archive on Vimeo, or tune
            in live this weekend.
          </p>
        </div>
      </section>

      {/* Live times banner */}
      <div style={{ backgroundColor: "#1b1c1c" }}>
        <div className="container-c3 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
            <span className="font-semibold text-white">Join us live:</span>
            <span>Hays — Sat 5pm · Sun 8am, 9:30am, 11am</span>
            <span>Colby — Sun 10am</span>
          </div>
          <Link href="/watch/" className="btn btn-primary btn-sm">
            Watch Live
          </Link>
        </div>
      </div>

      {/* Messages grid */}
      <section className="section" style={{ backgroundColor: "#ffffff" }}>
        <div className="container-c3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 mb-14">
            <div>
              <p className="overline mb-2" style={{ color: "rgba(27,28,28,0.4)" }}>Archive</p>
              <h2 className="heading-1" style={{ color: "#1b1c1c" }}>Recent Messages</h2>
            </div>
            <div className="flex gap-3">
              <a
                href="https://vimeo.com/c3hays"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-navy btn-sm inline-flex items-center gap-2"
              >
                <ExternalLink size={14} />
                All on Vimeo
              </a>
              <a
                href="https://anchor.fm/c3pod"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-navy btn-sm inline-flex items-center gap-2"
              >
                <Mic size={14} />
                Podcast
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentMessages.map((msg) => (
              <div key={msg.title} className="group cursor-pointer">
                {/* Thumbnail — 4:5 portrait, sharp corners */}
                <div
                  className="relative overflow-hidden mb-5"
                  style={{ aspectRatio: "4/5" }}
                >
                  <Image
                    src={msg.image}
                    alt={msg.title}
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                  />
                  <div
                    className="absolute inset-0 transition-colors duration-300"
                    style={{ background: "rgba(10,10,10,0.38)" }}
                  />
                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="w-12 h-12 flex items-center justify-center border border-white/40 transition-all duration-200 group-hover:bg-white/20"
                      style={{ background: "rgba(255,255,255,0.12)" }}
                    >
                      <Play size={18} className="text-white ml-0.5" fill="white" />
                    </div>
                  </div>
                  {/* Series tag */}
                  <div className="absolute top-3 left-3">
                    <span
                      className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider"
                      style={{ background: "#1cc3af", color: "#fff" }}
                    >
                      {msg.series}
                    </span>
                  </div>
                </div>
                {/* Info */}
                <h3 className="font-bold mb-1.5 leading-snug" style={{ color: "#1b1c1c", fontSize: "1rem" }}>
                  {msg.title}
                </h3>
                <p className="text-sm" style={{ color: "rgba(27,28,28,0.5)" }}>
                  {msg.speaker} · {msg.date}
                </p>
              </div>
            ))}
          </div>

          {/* Full archive CTA */}
          <div className="mt-14 text-center">
            <a
              href="https://vimeo.com/c3hays"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-lg inline-flex items-center gap-2"
            >
              <ExternalLink size={16} />
              View Full Archive on Vimeo
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
