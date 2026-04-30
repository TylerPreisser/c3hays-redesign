"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function GiveSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".give-content > *",
        { opacity: 0, y: 32 },
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
    /* Full-bleed dark image section */
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ minHeight: "60vh" }}
    >
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
            background: "linear-gradient(180deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.82) 100%)",
          }}
        />
      </div>

      {/* Content — centered vertically */}
      <div className="relative z-10 section container-c3 flex flex-col items-center justify-center text-center">
        <div className="give-content max-w-2xl">
          <p className="overline mb-6" style={{ color: "rgba(255,255,255,0.45)" }}>
            Generosity
          </p>
          <h2 className="display-2 text-white mb-6 text-balance">
            Your giving is{" "}
            <em className="not-italic" style={{ color: "#1cc3af" }}>changing</em>{" "}
            the world.
          </h2>
          <p className="mb-10 max-w-lg mx-auto" style={{ fontSize: "1.125rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.65 }}>
            At C3 we understand that God owns everything. We invite you to join
            us in stewardship — generously giving toward what God values.
          </p>
          <Link href="/give/" className="btn btn-primary btn-lg">
            Give Now
          </Link>
        </div>
      </div>
    </section>
  );
}
