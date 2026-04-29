"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, Phone, Smartphone, Video } from "lucide-react";
import { site } from "@/data/site";

gsap.registerPlugin(ScrollTrigger);

const connectCards = [
  {
    icon: Mail,
    title: "Email Us",
    body: "Questions? We'd love to hear from you.",
    cta: "Write to us",
    href: `mailto:${site.email}`,
    color: "#d4a056",
    colorBg: "rgba(212,160,86,0.1)",
  },
  {
    icon: Phone,
    title: "Call Us",
    body: "Prefer to talk? Give our office a ring.",
    cta: site.phone,
    href: `tel:${site.phone.replace(/\D/g, "")}`,
    color: "#10405d",
    colorBg: "rgba(16,64,93,0.08)",
  },
  {
    icon: Smartphone,
    title: "C3 App",
    body: "Sermons, notes, giving — all in your pocket.",
    cta: "Download the app",
    href: site.appStore,
    color: "#3a89b8",
    colorBg: "rgba(58,137,184,0.1)",
  },
  {
    icon: Video,
    title: "Past Messages",
    body: "Catch up on any message, any time.",
    cta: "Browse messages",
    href: "/messages/",
    color: "#185577",
    colorBg: "rgba(24,85,119,0.08)",
  },
];

export default function StayConnected() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".connect-card",
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 68%",
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
        <div className="max-w-xl mb-14">
          <p className="overline text-[#10405d]/60 mb-3">Get Connected</p>
          <h2 className="display-2 text-[#0e1b26]">Stay close.</h2>
          <p className="body-lg text-[#3d5566] mt-4">
            However you like to connect — we&apos;re here.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {connectCards.map((card) => {
            const Icon = card.icon;
            return (
              <a
                key={card.title}
                href={card.href}
                target={card.href.startsWith("http") ? "_blank" : undefined}
                rel={card.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="connect-card card p-6 block group"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: card.colorBg }}
                >
                  <Icon size={20} style={{ color: card.color }} strokeWidth={1.75} />
                </div>
                <h3 className="font-medium text-[#0e1b26] mb-2">{card.title}</h3>
                <p className="text-sm text-[#3d5566] leading-relaxed mb-4">
                  {card.body}
                </p>
                <span
                  className="text-sm font-medium transition-colors duration-150"
                  style={{ color: card.color }}
                >
                  {card.cta} →
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
