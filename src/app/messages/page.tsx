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
    image: "/images/bg-2.webp",
  },
  {
    title: "Resurrection Power",
    series: "Easter 2026",
    speaker: "Lead Pastor",
    date: "March 29, 2026",
    image: "/images/hero-1.webp",
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
      <section className="relative min-h-64 md:min-h-80 flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/worship.webp"
            alt="Sunday worship service"
            fill
            className="object-cover"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(10,31,46,0.94) 0%, rgba(10,31,46,0.6) 60%, rgba(10,31,46,0.2) 100%)",
            }}
          />
        </div>
        <div className="relative z-10 container-c3 pb-14 pt-28">
          <p className="overline text-[#d4a056] mb-3">Sermons</p>
          <h1 className="display-1 text-white">Watch &amp; Listen Anytime</h1>
          <p className="body-lg text-white/65 mt-4 max-w-lg">
            Miss a Sunday? Browse our full sermon archive on Vimeo, or tune
            in live this weekend.
          </p>
        </div>
      </section>

      {/* Live service times banner */}
      <div className="bg-[#10405d] text-white py-4">
        <div className="container-c3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="font-medium">Join us live:</span>
            <span className="text-white/75">Hays — Sat 5pm · Sun 8am, 9:30am, 11am</span>
            <span className="text-white/75">Colby — Sun 10am</span>
          </div>
          <Link href="/watch/" className="btn btn-gold btn-sm">
            Watch Live
          </Link>
        </div>
      </div>

      {/* Vimeo archive link */}
      <section className="section bg-[#fdfcfb]">
        <div className="container-c3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 mb-12">
            <div>
              <p className="overline text-[#10405d]/60 mb-2">Archive</p>
              <h2 className="heading-1 text-[#0e1b26]">Recent Messages</h2>
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

          {/* Message grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentMessages.map((msg) => (
              <div key={msg.title} className="card group">
                {/* Thumbnail */}
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={msg.image}
                    alt={msg.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[#0a1f2e]/40 group-hover:bg-[#0a1f2e]/60 transition-colors" />
                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 group-hover:bg-white/30 transition-colors">
                      <Play size={18} className="text-white ml-0.5" fill="white" />
                    </div>
                  </div>
                  {/* Series tag */}
                  <div className="absolute top-3 left-3">
                    <span
                      className="px-2.5 py-1 text-xs font-medium text-white bg-[#10405d]/80 backdrop-blur-sm"
                      style={{ borderRadius: "9999px" }}
                    >
                      {msg.series}
                    </span>
                  </div>
                </div>
                {/* Info */}
                <div className="p-5">
                  <h3 className="font-medium text-[#0e1b26] mb-1.5 leading-snug">
                    {msg.title}
                  </h3>
                  <p className="text-sm text-[#7a9aac]">
                    {msg.speaker} · {msg.date}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Full archive CTA */}
          <div className="mt-10 text-center">
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
