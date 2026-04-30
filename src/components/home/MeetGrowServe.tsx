"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { assetPath } from "@/lib/asset-path";

gsap.registerPlugin(ScrollTrigger);

const pillars = [
  {
    word: "About",
    headline: "Who We Are",
    body: "A church family in Hays and Colby, Kansas — where everyone is welcome, just as you are.",
    image: "/images/congregation.webp",
    href: "/about/",
  },
  {
    word: "Messages",
    headline: "Watch & Listen",
    body: "Catch up on any message, any series — anytime, anywhere. New sermons every week.",
    image: "/images/gather.webp",
    href: "/messages/",
  },
  {
    word: "Connect",
    headline: "Connect with Us",
    body: "Whether you're new or have been here a while, there's a place for you. Let us know how to help.",
    image: "/images/exterior.webp",
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
    /* White section */
    <section ref={sectionRef} className="section" style={{ backgroundColor: "#ffffff" }}>
      <div className="container-c3">
        {/* Header */}
        <div className="mgs-heading mb-16 md:mb-20">
          <p className="overline mb-5" style={{ color: "rgba(27,28,28,0.4)" }}>
            Take a Next Step
          </p>
          <h2 className="display-2" style={{ color: "#1b1c1c" }}>
            Find your place at C3.
          </h2>
        </div>

        {/* 3-up tile grid */}
        <div className="pillar-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-8">
          {pillars.map((pillar) => (
            <div key={pillar.word} className="pillar-tile group">
              {/* Image — 4:5 portrait ratio, clip-path wipe, scale on hover */}
              <div className="pillar-img-wrap relative overflow-hidden mb-6" style={{ aspectRatio: "4/5", minHeight: 320 }}>
                <Image
                  src={assetPath(pillar.image)}
                  alt={pillar.headline}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                <div
                  className="absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                  style={{ background: "rgba(10,10,10,0.15)" }}
                />
              </div>

              {/* Text content */}
              <p className="overline mb-3" style={{ color: "#1cc3af" }}>{pillar.word}</p>
              <h3 className="heading-2 mb-4" style={{ color: "#1b1c1c" }}>{pillar.headline}</h3>
              <p className="mb-5 leading-relaxed" style={{ fontSize: "1rem", color: "rgba(27,28,28,0.80)", lineHeight: 1.65 }}>
                {pillar.body}
              </p>
              <Link
                href={pillar.href}
                className="arrow-link"
                style={{ color: "#1b1c1c" }}
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
