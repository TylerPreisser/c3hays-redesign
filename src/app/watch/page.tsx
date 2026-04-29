import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";

export const metadata: Metadata = {
  title: "Watch Live",
  description:
    "Watch Celebration Community Church live online. Services Saturday 5 PM and Sunday 8, 9:30, and 11 AM.",
};

const recentMessages = [
  {
    title: "The God Who Sees",
    series: "Genesis",
    date: "April 27, 2026",
    image: "/images/worship.webp",
  },
  {
    title: "Faith Over Fear",
    series: "Matthew",
    date: "April 20, 2026",
    image: "/images/congregation.webp",
  },
  {
    title: "What Love Looks Like",
    series: "1 Corinthians 13",
    date: "April 13, 2026",
    image: "/images/gather.webp",
  },
];

export default function WatchPage() {
  return (
    <>
      {/* Page header */}
      <section className="bg-[#0a1f2e] pt-24 pb-12">
        <div className="container-c3">
          <p className="overline text-[#d4a056] mb-3">Online</p>
          <h1 className="display-1 text-white mb-4">Watch C3 Live</h1>
          <p className="body-lg text-white/65 max-w-lg">
            Join us online every weekend. Services stream live — and you can
            catch any past message on demand.
          </p>
        </div>
      </section>

      {/* Live player */}
      <section className="bg-[#050f16]">
        <div className="container-c3 py-8">
          {/* Vimeo embed */}
          <div
            className="relative w-full overflow-hidden rounded-2xl bg-[#0a1f2e]"
            style={{ paddingBottom: "56.25%" }}
          >
            <iframe
              src="https://vimeo.com/event/1/embed"
              className="absolute inset-0 w-full h-full"
              title="C3 Live Stream"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
            {/* Offline fallback — shown by CSS only when iframe fails to load */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
              <div className="w-16 h-16 rounded-full bg-[#10405d]/60 flex items-center justify-center mb-5">
                <Play size={24} className="text-white ml-1" />
              </div>
              <p className="text-white/50 text-sm max-w-sm">
                Join us live: Saturdays 5 PM · Sundays 8 AM, 9:30 AM &amp; 11 AM
                (Hays) · Sundays 10 AM (Colby)
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="https://vimeo.com/c3hays"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
            >
              Watch on Vimeo
            </a>
            <Link href="/messages/" className="btn btn-outline btn-sm">
              Browse All Messages
            </Link>
          </div>
        </div>
      </section>

      {/* Service times */}
      <section className="bg-[#0a1f2e] py-12 border-t border-white/6">
        <div className="container-c3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl">
            <div className="card-glass p-6">
              <p className="overline text-[#d4a056] mb-3">Hays</p>
              <div className="flex flex-col gap-1.5 text-sm text-white/70">
                <p>Saturday — 5:00 PM</p>
                <p>Sunday — 8:00 AM</p>
                <p>Sunday — 9:30 AM</p>
                <p>Sunday — 11:00 AM</p>
              </div>
            </div>
            <div className="card-glass p-6">
              <p className="overline text-[#d4a056] mb-3">Colby</p>
              <div className="flex flex-col gap-1.5 text-sm text-white/70">
                <p>Sunday — 10:00 AM</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent messages */}
      <section className="section bg-[#f7f4ef]">
        <div className="container-c3">
          <div className="mb-10">
            <p className="overline text-[#10405d]/60 mb-2">Recent</p>
            <h2 className="heading-1 text-[#0e1b26]">Catch Up</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {recentMessages.map((msg) => (
              <div key={msg.title} className="card group">
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={msg.image}
                    alt={msg.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[#0a1f2e]/40 flex items-center justify-center group-hover:bg-[#0a1f2e]/60 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                      <Play size={18} className="text-white ml-0.5" fill="white" />
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-medium text-[#0e1b26] mb-1">{msg.title}</h3>
                  <p className="text-sm text-[#7a9aac]">
                    {msg.series} · {msg.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/messages/" className="btn btn-primary btn-lg">
              All Messages
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
