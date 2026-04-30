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
    overline: "Email",
    title: "Write to Us",
    body: "Questions, prayer requests, or just want to say hello — our team reads every message.",
    cta: "Send an email",
    href: `mailto:${site.email}`,
  },
  {
    icon: Phone,
    overline: "Phone",
    title: "Give Us a Call",
    body: "Prefer to talk? Our office is happy to help Mon–Fri during regular business hours.",
    cta: site.phone,
    href: `tel:${site.phone.replace(/\D/g, "")}`,
  },
  {
    icon: Video,
    overline: "Sermons",
    title: "Past Messages",
    body: "Catch up on any message, any series — anytime you want, as many times as you want.",
    cta: "Browse messages",
    href: "/messages/",
  },
  {
    icon: Smartphone,
    overline: "App",
    title: "C3 App",
    body: "Sermons, sermon notes, giving, and more — all in your pocket wherever you go.",
    cta: "Download the app",
    href: site.appStore,
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
    /* White section — clean editorial */
    <section ref={sectionRef} className="section" style={{ backgroundColor: "#ffffff" }}>
      <div className="container-c3">
        {/* Header */}
        <div className="connect-heading mb-16">
          <p className="overline mb-4" style={{ color: "rgba(27,28,28,0.4)" }}>
            Get Connected
          </p>
          <h2 className="display-2" style={{ color: "#1b1c1c" }}>
            We&apos;re here for you.
          </h2>
          <p className="mt-4 max-w-md" style={{ fontSize: "1.125rem", color: "rgba(27,28,28,0.65)", lineHeight: 1.6 }}>
            However you prefer to connect — we&apos;re ready.
          </p>
        </div>

        {/* 4-up flat tile grid — no phone mockup, no glassy effects */}
        <div className="connect-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          style={{ border: "1px solid rgba(27,28,28,0.1)" }}>
          {connectItems.map((item, i) => {
            const Icon = item.icon;
            const isLastInRow = i === connectItems.length - 1;
            return (
              <a
                key={item.title}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="connect-item group block transition-colors duration-200"
                style={{
                  padding: "3rem 2rem",
                  minHeight: "360px",
                  display: "flex",
                  flexDirection: "column",
                  borderRight: isLastInRow ? "none" : "1px solid rgba(27,28,28,0.1)",
                }}
              >
                {/* Icon */}
                <div className="mb-8">
                  <Icon
                    size={26}
                    strokeWidth={1.5}
                    style={{ color: "#1cc3af" }}
                  />
                </div>

                {/* Overline */}
                <p className="overline mb-3" style={{ color: "rgba(27,28,28,0.4)" }}>
                  {item.overline}
                </p>

                {/* Title */}
                <h3
                  className="font-bold mb-4 transition-colors duration-200 group-hover:text-[#1cc3af]"
                  style={{ color: "#1b1c1c", fontSize: "1.125rem", lineHeight: 1.3 }}
                >
                  {item.title}
                </h3>

                {/* Body */}
                <p className="text-sm mb-8" style={{ color: "rgba(27,28,28,0.65)", lineHeight: 1.65, flex: 1 }}>
                  {item.body}
                </p>

                {/* Arrow link */}
                <span className="arrow-link" style={{ color: "#1b1c1c" }}>
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
