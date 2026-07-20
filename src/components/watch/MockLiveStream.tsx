"use client";

/* ─────────────────────────────────────────────────────────────
   MOCK LIVE-STREAM ADAPTER  (labeled mock — local/internal build)

   Production replaces this single component with the real embed
   (YouTube / Facebook Live). It deliberately makes ZERO external
   network calls so the local build is self-contained and never hits a
   third-party service. The "MOCK STREAM" chip keeps that explicit.

   Props let the page flip between the live and offline states without
   any backend — wire `isLive` to the content API in production.
   ───────────────────────────────────────────────────────────── */

import Image from "next/image";
import { useState } from "react";
import { Play, Radio } from "lucide-react";
import { assetPath } from "@/lib/asset-path";
import { Tx } from "@/components/cms/Editable";

export default function MockLiveStream({
  poster,
  isLive = false,
  nextService = "Saturday · 5:00 PM",
  text,
}: {
  poster: string;
  isLive?: boolean;
  nextService?: string;
  /** CMS text override bag — authored labels/copy render editable via <Tx>. */
  text?: Record<string, string>;
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
        <Tx
          as="span"
          text={text}
          k="watch-stream-mock-label"
          fallback="Mock stream &middot; local build"
          className="text-[0.6875rem] font-bold uppercase tracking-[0.16em]"
          style={{ color: "rgba(255,255,255,0.7)" }}
        />
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
            <Tx as="span" text={text} k="watch-stream-live-label" fallback="Live now" className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-white" />
          </>
        ) : (
          <>
            <Radio size={13} style={{ color: "rgba(255,255,255,0.55)" }} />
            <Tx as="span" text={text} k="watch-stream-offline-label" fallback="Offline" className="text-[0.6875rem] font-bold uppercase tracking-[0.16em]" style={{ color: "rgba(255,255,255,0.55)" }} />
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
          {playing ? (
            <Tx
              as="span"
              text={text}
              k="watch-stream-msg-playing"
              fallback="Preview playing &mdash; the production build streams the live service here."
            />
          ) : isLive ? (
            <Tx
              as="span"
              text={text}
              k="watch-stream-msg-live"
              fallback="We&rsquo;re live. Press play to join the service."
            />
          ) : (
            <>
              <Tx
                as="span"
                text={text}
                k="watch-stream-msg-offline"
                fallback="We&rsquo;re not streaming right now. Next service:"
              />{" "}
              {nextService}.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
