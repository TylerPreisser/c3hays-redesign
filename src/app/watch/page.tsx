import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { assetPath } from "@/lib/asset-path";
import MockLiveStream from "@/components/watch/MockLiveStream";

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
            src={assetPath("/images/gather.webp")}
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
          {/* Labeled MOCK live-stream adapter — zero external calls.
              Production swaps this for the real Vimeo/Mux embed. */}
          <MockLiveStream poster="/images/congregation.webp" isLive={false} nextService="Saturday · 5:00 PM" />

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
      <section className="py-16" style={{ backgroundColor: "#1b1c1c", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="container-c3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 max-w-2xl"
            style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
            <div className="p-8 border-b border-white/10 md:border-b-0 md:border-r md:border-white/10">
              <p className="font-bold text-xs uppercase tracking-widest mb-5" style={{ color: "#1cc3af" }}>Hays</p>
              <div className="flex flex-col gap-2 text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                <p>Saturday — 5:00 PM</p>
                <p>Sunday — 8:00 AM</p>
                <p>Sunday — 9:30 AM</p>
                <p>Sunday — 11:00 AM</p>
              </div>
            </div>
            <div className="p-8">
              <p className="font-bold text-xs uppercase tracking-widest mb-5" style={{ color: "#1cc3af" }}>Colby</p>
              <div className="flex flex-col gap-2 text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                <p>Sunday — 10:00 AM</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent messages */}
      <section className="section" style={{ backgroundColor: "#ffffff" }}>
        <div className="container-c3">
          <div className="mb-12">
            <h2 className="heading-1" style={{ color: "#1b1c1c" }}>Catch Up</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {recentMessages.map((msg) => (
              <div key={msg.title} className="group cursor-pointer">
                <div className="relative overflow-hidden mb-5" style={{ height: 200 }}>
                  <Image
                    src={assetPath(msg.image)}
                    alt={msg.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
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
                <h3 className="font-bold mb-1" style={{ color: "#1b1c1c", fontSize: "1rem" }}>{msg.title}</h3>
                <p className="text-sm" style={{ color: "rgba(27,28,28,0.5)" }}>
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
