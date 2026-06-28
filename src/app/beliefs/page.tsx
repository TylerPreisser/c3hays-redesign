import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { beliefs } from "@/data/beliefs";
import { assetPath } from "@/lib/asset-path";

export const metadata: Metadata = {
  title: "What We Believe",
  description:
    "The core doctrinal convictions of Celebration Community Church — rooted in Scripture, centered on Jesus.",
};

export default function BeliefsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex items-center overflow-hidden" style={{ minHeight: "60vh" }}>
        <div className="absolute inset-0">
          <Image
            src={assetPath("/images/worship.webp")}
            alt="Congregation in worship"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Base dark scrim */}
          <div className="absolute inset-0" style={{ background: "rgba(10,10,10,0.60)" }} />
          {/* Bottom-to-top gradient for text legibility */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.35) 55%, rgba(10,10,10,0.10) 100%)",
            }}
          />
        </div>
        <div className="relative z-10 container-c3 py-28 pt-44">
          <p className="overline mb-5" style={{ color: "#1cc3af" }}>Our Foundation</p>
          <h1 className="display-1 text-white" style={{ maxWidth: "18ch" }}>What We Believe</h1>
          <p className="body-lg mt-5 max-w-lg" style={{ color: "rgba(255,255,255,0.65)" }}>
            These are the convictions that anchor everything we do at C3 —
            rooted in Scripture, centered on Jesus.
          </p>
        </div>
      </section>

      {/* Beliefs list — sticky intro rail + scrollable items */}
      <section className="section" style={{ backgroundColor: "#ffffff" }}>
        <div className="container-c3">
          {/* Two-column layout: sticky left rail + belief items right */}
          <div className="flex flex-col lg:flex-row lg:gap-20 xl:gap-28">

            {/* ── Left rail — sticky intro ────────────────────── */}
            <aside className="lg:w-80 xl:w-96 shrink-0 mb-14 lg:mb-0">
              <div className="lg:sticky lg:top-32">
                <p className="overline mb-4" style={{ color: "#1cc3af" }}>
                  Our Convictions
                </p>
                <h2 className="heading-1 mb-6" style={{ color: "#1b1c1c" }}>
                  The beliefs that anchor us.
                </h2>
                <p className="body-base" style={{ color: "rgba(27,28,28,0.65)" }}>
                  At Celebration Community Church, we hold to the historic,
                  orthodox Christian faith as revealed in Scripture. These
                  beliefs are not negotiable — they are the foundation of
                  our community and the source of our hope.
                </p>
              </div>
            </aside>

            {/* ── Right column — belief items ─────────────────── */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col gap-0">
                {beliefs.map((belief, i) => (
                  <div
                    key={belief.id}
                    className="py-10"
                    style={{ borderBottom: "1px solid rgba(27,28,28,0.1)" }}
                  >
                    <div className="flex gap-6 md:gap-10">
                      {/* Number */}
                      <div className="shrink-0 mt-1">
                        <span
                          className="text-sm font-bold tabular-nums"
                          style={{ color: "#1cc3af" }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                      {/* Content */}
                      <div>
                        <h3 className="heading-2 mb-4" style={{ color: "#1b1c1c" }}>
                          {belief.title}
                        </h3>
                        <p className="body-lg" style={{ color: "rgba(27,28,28,0.65)" }}>{belief.body}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section" style={{ backgroundColor: "#1b1c1c" }}>
        <div className="container-c3 text-center max-w-xl">
          <h2 className="display-2 text-white mb-5">
            We&apos;d love to talk.
          </h2>
          <p className="body-lg mb-10" style={{ color: "rgba(255,255,255,0.60)" }}>
            Theology matters — and so do your questions. Reach out, or
            come visit us on a Sunday.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/connect/" className="btn btn-primary btn-lg">
              Connect With Us
            </Link>
            <Link href="/visit/" className="btn btn-outline btn-lg">
              Plan a Visit
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
