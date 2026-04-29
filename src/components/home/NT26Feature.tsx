"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BookOpen, ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function NT26Feature() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".nt26-content > *",
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
            once: true,
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section bg-[#0a1f2e] overflow-hidden">
      <div className="container-c3">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text */}
          <div className="nt26-content">
            <div className="flex items-center gap-2 mb-5">
              <BookOpen size={16} className="text-[#d4a056]" />
              <p className="overline text-[#d4a056]">Bible Reading Plan</p>
            </div>
            <h2 className="display-2 text-white mb-5 text-balance">
              Have you read your Bible today?
            </h2>
            <p className="body-lg text-white/65 mb-6">
              The NT26 Reading Plan takes you through the entire New Testament
              in 2026 — one chapter at a time, together as a church family. No
              experience required. Just a willing heart.
            </p>
            <p className="body-base text-white/50 mb-8">
              Join thousands reading alongside C3. We&apos;ll walk through every word
              Jesus spoke, every letter Paul wrote, and every vision John
              received — together.
            </p>
            <Link
              href="/messages/"
              className="btn btn-gold btn-lg inline-flex items-center gap-2"
            >
              Read More
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative h-80 lg:h-[480px] rounded-2xl overflow-hidden">
              <Image
                src="/images/nt26.webp"
                alt="NT26 Bible Reading Plan"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f2e]/60 to-transparent" />
            </div>
            {/* Floating badge — absolute on lg+ (where overflow is safe inside
                the wider grid container), but hidden on mobile to avoid overflow
                clipping on narrow viewports. Still shows at md+ breakpoint
                where the container is wide enough to absorb the -4 offset. */}
            <div
              className="hidden md:block absolute -bottom-4 -left-4 card-glass px-5 py-4"
              style={{ borderRadius: "1rem" }}
            >
              <p className="text-xs font-medium text-white/60 mb-0.5">Reading Plan</p>
              <p className="text-lg font-medium text-white leading-none">NT 2026</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
