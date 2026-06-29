"use client";

/* ─────────────────────────────────────────────────────────────
   MOCK LIVE-STREAM ADAPTER  (labeled mock — local/internal build)

   Production replaces this single component with the real embed
   (Vimeo Live / YouTube / Mux). It deliberately makes ZERO external
   network calls so the local build is self-contained and never hits a
   third-party service. The "MOCK STREAM" chip keeps that explicit.

   Props let the page flip between the live and offline states without
   any backend — wire `isLive` to the content API in production.
   ───────────────────────────────────────────────────────────── */

import Image from "next/image";
import { useState } from "react";
import { Play, Radio } from "lucide-react";
import { assetPath } from "@/lib/asset-path";

export default function MockLiveStream({
  poster,
  isLive = false,
  nextService = "Saturday · 5:00 PM",
}: {
  poster: string;
  isLive?: boolean;
  nextService?: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ paddingBottom: "56.25%", backgroundColor: "#000", borderRadius: "var(--radius-md)" }}
    >
      {/* Poster */}
      <Image
        src={assetPath(poster)}
        alt="C3 worship — live stream"
        fill
        className="object-cover"
        style={{ opacity: playing ? 0.9 : 0.55, transition: "opacity 400ms ease" }}
        priority
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(10,10,10,0.35) 0%, rgba(10,10,10,0.78) 100%)",
        }}
      />

      {/* Mock chip — top-left */}
      <div
        className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5"
        style={{
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.18)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
        }}
      >
        <span
          className="text-[0.6875rem] font-bold uppercase tracking-[0.16em]"
          style={{ color: "rgba(255,255,255,0.7)" }}
        >
          Mock stream · local build
        </span>
      </div>

      {/* Live / offline badge — top-right */}
      <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5"
        style={{
          background: isLive ? "rgba(28,195,175,0.18)" : "rgba(255,255,255,0.06)",
          border: `1px solid ${isLive ? "rgba(28,195,175,0.5)" : "rgba(255,255,255,0.14)"}`,
        }}>
        {isLive ? (
          <>
            <span className="animate-pulse-dot w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: "#1cc3af" }} />
            <span className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-white">Live now</span>
          </>
        ) : (
          <>
            <Radio size={13} style={{ color: "rgba(255,255,255,0.55)" }} />
            <span className="text-[0.6875rem] font-bold uppercase tracking-[0.16em]" style={{ color: "rgba(255,255,255,0.55)" }}>Offline</span>
          </>
        )}
      </div>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause preview" : "Play preview"}
          className="group flex items-center justify-center transition-transform duration-300 hover:scale-105"
          style={{
            width: 84,
            height: 84,
            borderRadius: 999,
            background: "rgba(28,195,175,0.16)",
            border: "1.5px solid rgba(28,195,175,0.6)",
          }}
        >
          <Play
            size={30}
            className="ml-1 transition-colors"
            style={{ color: "#fff" }}
            fill="rgba(255,255,255,0.92)"
          />
        </button>
        <p
          className="mt-6 text-sm max-w-md"
          style={{ color: "rgba(255,255,255,0.62)" }}
        >
          {playing
            ? "Preview playing — the production build streams the live service here."
            : isLive
              ? "We're live. Press play to join the service."
              : `We're not streaming right now. Next service: ${nextService}.`}
        </p>
      </div>
    </div>
  );
}
