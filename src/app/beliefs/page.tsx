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
      <section className="relative min-h-64 md:min-h-80 flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/bg-1.webp"
            alt="Open Bible"
            fill
            className="object-cover"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(10,31,46,0.95) 0%, rgba(10,31,46,0.6) 60%, rgba(10,31,46,0.3) 100%)",
            }}
          />
        </div>
        <div className="relative z-10 container-c3 pb-14 pt-28">
          <p className="overline text-[#d4a056] mb-3">Doctrine</p>
          <h1 className="display-1 text-white">What We Believe</h1>
          <p className="body-lg text-white/65 mt-4 max-w-lg">
            These are the convictions that anchor everything we do at C3 —
            rooted in Scripture, centered on Jesus.
          </p>
        </div>
      </section>

      {/* Beliefs */}
      <section className="section bg-[#fdfcfb]">
        <div className="container-c3">
          <div className="max-w-3xl">
            <p className="body-lg text-[#3d5566] mb-12">
              At Celebration Community Church, we hold to the historic,
              orthodox Christian faith as revealed in Scripture. These
              beliefs are not negotiable — they are the foundation of
              our community and the source of our hope.
            </p>

            <div className="flex flex-col gap-0">
              {beliefs.map((belief, i) => (
                <div
                  key={belief.id}
                  className="py-8 border-b border-[#10405d]/8 last:border-none"
                >
                  <div className="flex gap-5 md:gap-8">
                    {/* Number */}
                    <div className="shrink-0 mt-0.5">
                      <span className="text-sm font-medium text-[#7a9aac]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    {/* Content */}
                    <div>
                      <h2 className="heading-2 text-[#0e1b26] mb-3">
                        {belief.title}
                      </h2>
                      <p className="body-lg text-[#3d5566]">{belief.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section bg-[#0a1f2e]">
        <div className="container-c3 text-center max-w-xl">
          <p className="overline text-[#d4a056] mb-4">Questions?</p>
          <h2 className="display-2 text-white mb-5">
            We&apos;d love to talk.
          </h2>
          <p className="body-lg text-white/65 mb-8">
            Theology matters — and so do your questions. Reach out, or
            come visit us on a Sunday.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/connect/" className="btn btn-gold btn-lg">
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
