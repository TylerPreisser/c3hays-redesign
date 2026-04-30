import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { beliefs } from "@/data/beliefs";

export const metadata: Metadata = {
  title: "What We Believe",
  description:
    "The core doctrinal convictions of Celebration Community Church — rooted in Scripture, centered on Jesus.",
};

export default function BeliefsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex items-end overflow-hidden" style={{ minHeight: "50vh" }}>
        <div className="absolute inset-0">
          <Image
            src="/images/bg-1.webp"
            alt="Open Bible"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0" style={{ background: "rgba(10,10,10,0.65)" }} />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.2) 60%, transparent 100%)",
            }}
          />
        </div>
        <div className="relative z-10 container-c3 pb-16 pt-40">
          <p className="overline mb-4" style={{ color: "rgba(255,255,255,0.55)" }}>Doctrine</p>
          <h1 className="display-1 text-white">What We Believe</h1>
          <p className="body-lg mt-4 max-w-lg" style={{ color: "rgba(255,255,255,0.65)" }}>
            These are the convictions that anchor everything we do at C3 —
            rooted in Scripture, centered on Jesus.
          </p>
        </div>
      </section>

      {/* Beliefs list */}
      <section className="section" style={{ backgroundColor: "#ffffff" }}>
        <div className="container-c3">
          <div className="max-w-3xl">
            <p className="body-lg mb-14" style={{ color: "rgba(27,28,28,0.65)" }}>
              At Celebration Community Church, we hold to the historic,
              orthodox Christian faith as revealed in Scripture. These
              beliefs are not negotiable — they are the foundation of
              our community and the source of our hope.
            </p>

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
                        className="text-sm font-bold"
                        style={{ color: "#1cc3af" }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    {/* Content */}
                    <div>
                      <h2 className="heading-2 mb-4" style={{ color: "#1b1c1c" }}>
                        {belief.title}
                      </h2>
                      <p className="body-lg" style={{ color: "rgba(27,28,28,0.65)" }}>{belief.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section" style={{ backgroundColor: "#1b1c1c" }}>
        <div className="container-c3 text-center max-w-xl">
          <p className="overline mb-4" style={{ color: "rgba(255,255,255,0.35)" }}>Questions?</p>
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
