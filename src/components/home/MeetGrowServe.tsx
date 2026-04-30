"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const pillars = [
  {
    word: "Meet",
    headline: "Meet with Him",
    body: "Worship is where everything begins. When we gather, we encounter the living God — in song, Scripture, prayer, and community.",
    image: "/images/congregation.webp",
    href: "/about/",
  },
  {
    word: "Grow",
    headline: "Grow in Him",
    body: "Faith grows through the Word. Through small groups, Bible study, and discipleship, we become more like Jesus every day.",
    image: "/images/gather.webp",
    href: "/messages/",
  },
  {
    word: "Serve",
    headline: "Serve through Him",
    body: "We were made to give ourselves away. Serving the church and the community is how we live out the love of Christ.",
    image: "/images/bg-1.webp",
    href: "/connect/",
  },
];

export default function MeetGrowServe() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Section heading */
      gsap.fromTo(
        ".mgs-heading",
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          },
        }
      );

      /* Tile cards stagger */
      gsap.fromTo(
        ".pillar-tile",
        { opacity: 0, y: 48 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".pillar-grid",
            start: "top 75%",
            once: true,
          },
        }
      );

      /* Image clip-path wipe reveal per tile */
      gsap.utils.toArray<HTMLElement>(".pillar-img-wrap").forEach((el, i) => {
        gsap.fromTo(
          el,
          { clipPath: "inset(0 0 100% 0)" },
          {
            clipPath: "inset(0 0 0% 0)",
            duration: 1.2,
            ease: "power4.out",
            delay: i * 0.1,
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              once: true,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    /* Light off-white section */
    <section ref={sectionRef} className="section" style={{ backgroundColor: "#f2efed" }}>
      <div className="container-c3">
        {/* Header */}
        <div className="mgs-heading mb-16 md:mb-20">
          <p className="overline mb-4" style={{ color: "rgba(35,46,44,0.45)" }}>Our Purpose</p>
          <h2 className="display-2" style={{ color: "#232e2c" }}>
            Meet. <em className="not-italic" style={{ color: "#10405D" }}>Grow.</em> Serve.
          </h2>
          <p className="mt-5 max-w-md" style={{ fontSize: "1.125rem", color: "rgba(35,46,44,0.82)", lineHeight: 1.6 }}>
            Three words that define why we exist — and how Jesus shapes every part of life at C3.
          </p>
        </div>

        {/* 3-up tile grid — single col → 2 col at 640 → 3 col at 1024 */}
        <div className="pillar-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-8">
          {pillars.map((pillar) => (
            <div key={pillar.word} className="pillar-tile group">
              {/* Image — 4:5 portrait ratio, clip-path wipe, scale on hover */}
              <div className="pillar-img-wrap relative overflow-hidden mb-6" style={{ aspectRatio: "4/5", minHeight: 320 }}>
                <Image
                  src={pillar.image}
                  alt={pillar.headline}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                {/* Hover overlay — CSS only via group-hover */}
                <div
                  className="absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                  style={{ background: "rgba(10,10,10,0.15)" }}
                />
              </div>

              {/* Text content */}
              <p className="overline mb-3" style={{ color: "#10405D" }}>{pillar.word}</p>
              <h3 className="heading-2 mb-3" style={{ color: "#232e2c" }}>{pillar.headline}</h3>
              <p className="mb-5 leading-relaxed" style={{ fontSize: "1rem", color: "rgba(35,46,44,0.82)", lineHeight: 1.65 }}>
                {pillar.body}
              </p>
              <Link
                href={pillar.href}
                className="arrow-link"
                style={{ color: "#232e2c" }}
              >
                Learn More <span className="arrow">→</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
