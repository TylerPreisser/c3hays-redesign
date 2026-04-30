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
      {/* Hero */}
      <section className="relative flex items-end overflow-hidden" style={{ minHeight: "50vh" }}>
        <div className="absolute inset-0">
          <Image
            src="/images/worship.webp"
            alt="C3 live worship service"
            fill
            className="object-cover"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(10,10,10,0.35) 0%, rgba(10,10,10,0.55) 60%, rgba(10,10,10,0.85) 100%)",
            }}
          />
        </div>
        <div className="relative z-10 container-c3 pb-16 pt-40">
          <p className="overline mb-4" style={{ color: "rgba(255,255,255,0.55)" }}>Online</p>
          <h1 className="display-1 text-white mb-4">Watch C3 Live</h1>
          <p className="body-lg max-w-lg" style={{ color: "rgba(255,255,255,0.65)" }}>
            Join us online every weekend. Services stream live — and you can
            catch any past message on demand.
          </p>
        </div>
      </section>

      {/* Live player */}
      <section style={{ backgroundColor: "#0a0a0a", paddingTop: "2rem", paddingBottom: "3rem" }}>
        <div className="container-c3">
          <div
            className="relative w-full overflow-hidden"
            style={{ paddingBottom: "56.25%", borderRadius: 0 }}
          >
            <iframe
              src="https://vimeo.com/event/1/embed"
              className="absolute inset-0 w-full h-full"
              title="C3 Live Stream"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
            {/* Offline fallback */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
              <div
                className="w-16 h-16 flex items-center justify-center mb-5"
                style={{ background: "rgba(229,53,57,0.2)", border: "1px solid rgba(229,53,57,0.4)" }}
              >
                <Play size={24} className="text-white ml-1" />
              </div>
              <p className="text-sm max-w-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
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
      <section className="py-16" style={{ backgroundColor: "#232e2c", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="container-c3">
          <p className="overline mb-8" style={{ color: "rgba(255,255,255,0.35)" }}>Service Times</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 max-w-2xl"
            style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
            {/* On mobile (single column) use a bottom border; on md+ it becomes a right border between columns */}
            <div className="p-8 border-b border-white/10 md:border-b-0 md:border-r md:border-white/10">
              <p className="font-bold text-xs uppercase tracking-widest mb-5" style={{ color: "#10405D" }}>Hays</p>
              <div className="flex flex-col gap-2 text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                <p>Saturday — 5:00 PM</p>
                <p>Sunday — 8:00 AM</p>
                <p>Sunday — 9:30 AM</p>
                <p>Sunday — 11:00 AM</p>
              </div>
            </div>
            <div className="p-8">
              <p className="font-bold text-xs uppercase tracking-widest mb-5" style={{ color: "#10405D" }}>Colby</p>
              <div className="flex flex-col gap-2 text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                <p>Sunday — 10:00 AM</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent messages */}
      <section className="section" style={{ backgroundColor: "#f2efed" }}>
        <div className="container-c3">
          <div className="mb-12">
            <p className="overline mb-2" style={{ color: "rgba(35,46,44,0.45)" }}>Recent</p>
            <h2 className="heading-1" style={{ color: "#232e2c" }}>Catch Up</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {recentMessages.map((msg) => (
              <div key={msg.title} className="group cursor-pointer">
                <div className="relative overflow-hidden mb-5" style={{ height: 200 }}>
                  <Image
                    src={msg.image}
                    alt={msg.title}
                    fill
                    className="object-cover transition-transform duration-600 group-hover:scale-[1.04]"
                  />
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ background: "rgba(10,10,10,0.4)" }}
                  >
                    <div
                      className="w-12 h-12 flex items-center justify-center border border-white/40"
                      style={{ background: "rgba(255,255,255,0.12)" }}
                    >
                      <Play size={18} className="text-white ml-0.5" fill="white" />
                    </div>
                  </div>
                </div>
                <h3 className="font-bold mb-1" style={{ color: "#232e2c", fontSize: "1rem" }}>{msg.title}</h3>
                <p className="text-sm" style={{ color: "rgba(35,46,44,0.5)" }}>
                  {msg.series} · {msg.date}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/messages/" className="btn btn-primary btn-lg">
              All Messages
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
