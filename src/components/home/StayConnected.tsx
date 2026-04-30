"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, Phone, Smartphone, Video } from "lucide-react";
import { site } from "@/data/site";

gsap.registerPlugin(ScrollTrigger);

const connectItems = [
  {
    icon: Mail,
    title: "Email Us",
    body: "Questions? We'd love to hear from you.",
    cta: "Write to us",
    href: `mailto:${site.email}`,
  },
  {
    icon: Phone,
    title: "Call Us",
    body: "Prefer to talk? Give our office a ring.",
    cta: site.phone,
    href: `tel:${site.phone.replace(/\D/g, "")}`,
  },
  {
    icon: Smartphone,
    title: "C3 App",
    body: "Sermons, notes, giving — all in your pocket.",
    cta: "Download the app",
    href: site.appStore,
  },
  {
    icon: Video,
    title: "Past Messages",
    body: "Catch up on any message, any time.",
    cta: "Browse messages",
    href: "/messages/",
  },
];

export default function StayConnected() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".connect-heading",
        { opacity: 0, y: 28 },
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

      gsap.fromTo(
        ".connect-item",
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".connect-grid",
            start: "top 75%",
            once: true,
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    /* Dark evergreen section */
    <section ref={sectionRef} className="section" style={{ backgroundColor: "#232e2c" }}>
      <div className="container-c3">
        {/* Header */}
        <div className="connect-heading mb-16">
          <p className="overline mb-4" style={{ color: "rgba(255,255,255,0.35)" }}>
            Get Connected
          </p>
          <h2 className="display-2 text-white">
            We&apos;re here.
          </h2>
          <p className="mt-4 max-w-md" style={{ fontSize: "1.125rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>
            However you like to connect — we&apos;re ready.
          </p>
        </div>

        {/* 4-up grid — no card chrome, just icon + text */}
        <div className="connect-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
          {connectItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.title}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="connect-item group block"
              >
                {/* Icon — no background, just line icon */}
                <div className="mb-5">
                  <Icon
                    size={28}
                    className="transition-colors duration-200"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                    strokeWidth={1.5}
                  />
                </div>
                <h3
                  className="font-bold mb-2 uppercase tracking-wide text-sm transition-colors duration-200 group-hover:text-white"
                  style={{ color: "rgba(255,255,255,0.85)", letterSpacing: "0.06em" }}
                >
                  {item.title}
                </h3>
                <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.45)", lineHeight: 1.65 }}>
                  {item.body}
                </p>
                <span className="arrow-link" style={{ color: "#e53539" }}>
                  {item.cta} <span className="arrow">→</span>
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
