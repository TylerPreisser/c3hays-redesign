"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HeartHandshake, Sprout, HandHeart } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const pillars = [
  {
    icon: HeartHandshake,
    word: "Meet",
    headline: "Meet with Him",
    body: "Worship is where everything begins. When we gather, we encounter the living God — in song, Scripture, prayer, and community.",
    color: "text-[#d4a056]",
    bg: "bg-[#d4a056]/10",
  },
  {
    icon: Sprout,
    word: "Grow",
    headline: "Grow in Him",
    body: "Faith grows through the Word. Through small groups, Bible study, and discipleship, we become more like Jesus every day.",
    color: "text-[#3a89b8]",
    bg: "bg-[#3a89b8]/10",
  },
  {
    icon: HandHeart,
    word: "Serve",
    headline: "Serve through Him",
    body: "We were made to give ourselves away. Serving the church and the community is how we live out the love of Christ.",
    color: "text-[#10405d]",
    bg: "bg-[#10405d]/10",
  },
];

export default function MeetGrowServe() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger-reveal cards on scroll
      gsap.fromTo(
        ".pillar-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 75%",
            once: true,
          },
        }
      );

      // Heading reveal
      gsap.fromTo(
        ".mgs-heading",
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section bg-[#f7f4ef]">
      <div className="container-c3">
        {/* Section header */}
        <div className="mgs-heading max-w-2xl mb-16">
          <p className="overline text-[#10405d]/60 mb-3">Our Purpose</p>
          <h2 className="display-2 text-[#0e1b26] text-balance">
            Meet. Grow. Serve.
          </h2>
          <p className="body-lg text-[#3d5566] mt-5 max-w-lg">
            Three words that define why we exist — and how Jesus shapes every part
            of life at C3.
          </p>
        </div>

        {/* Pillar cards */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div key={pillar.word} className="pillar-card card p-8">
                <div
                  className={`w-12 h-12 rounded-xl ${pillar.bg} flex items-center justify-center mb-6`}
                >
                  <Icon size={22} className={pillar.color} strokeWidth={1.75} />
                </div>
                <h3 className="heading-3 text-[#0e1b26] mb-3">
                  {pillar.headline}
                </h3>
                <p className="body-base text-[#3d5566] leading-relaxed">
                  {pillar.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
