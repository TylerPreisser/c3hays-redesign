"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Heart, ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function GiveSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".give-content > *",
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
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
    <section ref={sectionRef} className="relative overflow-hidden min-h-80">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/worship.webp"
          alt="Worship service"
          fill
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(105deg, rgba(10,31,46,0.96) 0%, rgba(10,31,46,0.88) 45%, rgba(16,64,93,0.75) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 section container-c3">
        <div className="give-content max-w-xl">
          <div className="flex items-center gap-2 mb-5">
            <Heart size={16} className="text-[#d4a056]" strokeWidth={1.75} />
            <p className="overline text-[#d4a056]">Generosity</p>
          </div>
          <h2 className="display-2 text-white mb-5 text-balance">
            Your giving is changing the world.
          </h2>
          <p className="body-lg text-white/65 mb-8 max-w-md">
            At C3 we understand that God owns everything. We invite you to join
            us in stewardship — generously giving toward what God values.
          </p>
          <Link
            href="/give/"
            className="btn btn-gold btn-lg inline-flex items-center gap-2"
          >
            Give Now
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
