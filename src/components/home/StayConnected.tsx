"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, Phone, Smartphone, Video, Sparkles, type LucideIcon } from "lucide-react";
import { site } from "@/data/site";
import CmsIcon from "@/components/cms/CmsIcon";
import { tx, type IconStyle, type StayConnectedContent } from "@/lib/home-content";

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

/** A normalized, render-ready card — unifies the legacy connect-count tiles and
 *  the new content-driven `stayConnected.cards` collection so the two layout
 *  variants share ONE loop. */
interface RenderCard {
  reactKey: string;
  iconKey: string;         // data-cms-icon + icon[] override key
  iconName?: string;       // explicit lucide name (from a StayCard)
  iconFallback: LucideIcon;
  overline?: { path: string; html: string };
  title: { path: string; html: string };
  body: { path: string; html: string };
  cta: string;
  href: string;
}

export default function StayConnected({
  content,
  text = {},
  icon = {},
  variant,
}: {
  content?: StayConnectedContent;
  text?: Record<string, string>;
  icon?: Record<string, IconStyle>;
  variant?: string;
}) {
  const v = variant || "cards";
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

    // Fail-safe: if ScrollTrigger never fires (fast scroll, smooth-scroll quirks,
    // headless capture), force the cards visible so this section is NEVER empty.
    const failsafe = setTimeout(() => {
      gsap.set([".connect-heading", ".connect-item"], { opacity: 1, y: 0 });
    }, 1600);

    return () => {
      clearTimeout(failsafe);
      ctx.revert();
    };
  }, []);

  /* ─── card model: content-driven cards (R2) OR legacy connect-count ──────
     ADDITIVE FENCE: when `content.cards` is absent/empty, this reduces to the
     exact legacy rendering (same keys, paths, icons) so existing published
     content is byte-identical. */
  const usingCards = !!(content?.cards && content.cards.length);
  const cardCount = Math.min(6, Math.max(1, parseInt(text["connect-count"] || "") || connectItems.length));
  const renderCards: RenderCard[] = usingCards
    ? content!.cards!.map((c) => ({
        reactKey: c.id,
        iconKey: c.id,
        iconName: c.icon,
        iconFallback: Sparkles,
        overline: undefined,
        title: { path: `stayConnected.cards.${c.id}.title`, html: c.title },
        body: { path: `stayConnected.cards.${c.id}.body`, html: c.body },
        cta: c.cta || "Learn more",
        href: c.href,
      }))
    : Array.from({ length: cardCount }, (_, i) => {
        const item = connectItems[i] || { icon: Sparkles, overline: "New", title: "New card", body: "Describe this card — click any text to edit it.", cta: "Learn more", href: "/connect/" };
        return {
          reactKey: String(i),
          iconKey: `connect-${i}`,
          iconName: undefined,
          iconFallback: item.icon,
          overline: { path: `t:connect-${i}-overline`, html: tx(text, `connect-${i}-overline`, item.overline) },
          title: { path: `t:connect-${i}-title`, html: tx(text, `connect-${i}-title`, item.title) },
          body: { path: `t:connect-${i}-body`, html: tx(text, `connect-${i}-body`, item.body) },
          cta: item.cta,
          href: item.href,
        };
      });

  /* ─── VARIANT: cards (default) ───────────────────────────────────── */
  if (v === "cards") {
    return (
      /* Soft mist section — premium rounded cards */
      <section ref={sectionRef} className="section" style={{ backgroundColor: "#f6f6f6" }}>
        <div className="container-c3">
          {/* Header — heading + supporting line, centered */}
          <div className="connect-heading" style={{ marginBottom: "clamp(2rem, 4vw, 3.5rem)", maxWidth: 640 }}>
            <span data-cms="t:getintouch-eyebrow" style={{ display: "inline-block", textTransform: "uppercase", letterSpacing: "0.16em", fontSize: "0.75rem", fontWeight: 700, color: "#1cc3af", marginBottom: "1rem" }} dangerouslySetInnerHTML={{ __html: tx(text, "getintouch-eyebrow", "Connect with us") }} />
            <h2 className="display-2" data-cms="t:getintouch-heading" style={{ color: "#1b1c1c", marginBottom: "1rem" }} dangerouslySetInnerHTML={{ __html: tx(text, "getintouch-heading", "Get in Touch") }} />
            <p data-cms="t:getintouch-intro" style={{ fontSize: "1.125rem", color: "rgba(27,28,28,0.62)", lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: tx(text, "getintouch-intro", "However you want to connect, there's a way in. Reach out, catch a message, or take C3 with you.") }} />
          </div>

          {/* Rounded card grid — legacy count is editable (1–6); a published
              stayConnected.cards collection drives it when present. */}
          <div className="connect-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {renderCards.map((rc) => {
              const external = rc.href.startsWith("http");
              return (
                <a
                  key={rc.reactKey}
                  href={rc.href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="connect-item group block"
                  style={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    padding: "2rem 1.75rem",
                    background: "#ffffff",
                    border: "1px solid rgba(27,28,28,0.08)",
                    borderRadius: "var(--radius-md)",
                    transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.boxShadow = "0 18px 40px rgba(27,28,28,0.10)";
                    e.currentTarget.style.borderColor = "rgba(28,195,175,0.55)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = "rgba(27,28,28,0.08)";
                  }}
                >
                  {/* Icon in a teal-tinted rounded square (click to recolor) */}
                  <div
                    className="grid place-items-center"
                    data-cms-icon={rc.iconKey}
                    style={{ width: 52, height: 52, borderRadius: 14, background: icon[rc.iconKey]?.bg || "rgba(28,195,175,0.12)", marginBottom: "1.75rem" }}
                  >
                    <CmsIcon name={icon[rc.iconKey]?.name || rc.iconName} fallback={rc.iconFallback} size={24} strokeWidth={1.75} style={{ color: icon[rc.iconKey]?.color || "#179c8c" }} />
                  </div>

                  {/* Overline (legacy only) */}
                  {rc.overline && (
                    <span data-cms={rc.overline.path} style={{ textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "0.68rem", fontWeight: 700, color: "rgba(27,28,28,0.4)", marginBottom: "0.5rem" }} dangerouslySetInnerHTML={{ __html: rc.overline.html }} />
                  )}

                  {/* Title */}
                  <h3 className="font-bold transition-colors duration-200 group-hover:text-[#179c8c]" data-cms={rc.title.path} style={{ color: "#1b1c1c", fontSize: "1.2rem", lineHeight: 1.25, marginBottom: "0.85rem" }} dangerouslySetInnerHTML={{ __html: rc.title.html }} />

                  {/* Body */}
                  <p className="text-sm" data-cms={rc.body.path} style={{ color: "rgba(27,28,28,0.62)", lineHeight: 1.65, flex: 1, marginBottom: "1.75rem" }} dangerouslySetInnerHTML={{ __html: rc.body.html }} />

                  {/* CTA */}
                  <span className="arrow-link" style={{ color: "#179c8c", fontWeight: 600 }}>
                    {rc.cta} <span className="arrow">→</span>
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  /* ─── VARIANT: compact ───────────────────────────────────────────── */
  /* Charcoal bg, denser multi-column grid, icon inline with title,
     tighter padding — a genuinely different layout feel.             */
  return (
    <section ref={sectionRef} className="section" style={{ backgroundColor: "#1b1c1c" }}>
      <div className="container-c3">
        {/* Header — eyebrow + heading left-aligned on dark bg */}
        <div className="connect-heading" style={{ marginBottom: "clamp(1.5rem, 3vw, 2.5rem)" }}>
          <span
            data-cms="t:getintouch-eyebrow"
            style={{ display: "inline-block", textTransform: "uppercase", letterSpacing: "0.16em", fontSize: "0.7rem", fontWeight: 700, color: "#1cc3af", marginBottom: "0.6rem" }}
            dangerouslySetInnerHTML={{ __html: tx(text, "getintouch-eyebrow", "Connect with us") }}
          />
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "1.5rem" }}>
            <h2
              className="display-2"
              data-cms="t:getintouch-heading"
              style={{ color: "#ffffff", margin: 0 }}
              dangerouslySetInnerHTML={{ __html: tx(text, "getintouch-heading", "Get in Touch") }}
            />
            <p
              data-cms="t:getintouch-intro"
              style={{ fontSize: "1rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.55, margin: 0, maxWidth: 480 }}
              dangerouslySetInnerHTML={{ __html: tx(text, "getintouch-intro", "However you want to connect, there's a way in. Reach out, catch a message, or take C3 with you.") }}
            />
          </div>
        </div>

        {/* Dense grid — up to 3 cols on lg, 2 on sm; tighter padding */}
        <div className="connect-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {renderCards.map((rc) => {
            const external = rc.href.startsWith("http");
            return (
              <a
                key={rc.reactKey}
                href={rc.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="connect-item group block"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "1.25rem 1.25rem",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "var(--radius-md)",
                  transition: "background 0.2s ease, border-color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(28,195,175,0.10)";
                  e.currentTarget.style.borderColor = "rgba(28,195,175,0.40)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                }}
              >
                {/* Icon inline with overline + title — compact header row */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.875rem", marginBottom: "0.75rem" }}>
                  {/* Icon badge */}
                  <div
                    className="grid place-items-center flex-shrink-0"
                    data-cms-icon={rc.iconKey}
                    style={{ width: 40, height: 40, borderRadius: 10, background: icon[rc.iconKey]?.bg || "rgba(28,195,175,0.15)", marginTop: 2 }}
                  >
                    <CmsIcon name={icon[rc.iconKey]?.name || rc.iconName} fallback={rc.iconFallback} size={18} strokeWidth={1.75} style={{ color: icon[rc.iconKey]?.color || "#1cc3af" }} />
                  </div>

                  {/* Overline + title stacked */}
                  <div>
                    {rc.overline && (
                      <span
                        data-cms={rc.overline.path}
                        style={{ display: "block", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "0.62rem", fontWeight: 700, color: "rgba(255,255,255,0.35)", marginBottom: "0.2rem" }}
                        dangerouslySetInnerHTML={{ __html: rc.overline.html }}
                      />
                    )}
                    <h3
                      className="font-bold transition-colors duration-200 group-hover:text-[#1cc3af]"
                      data-cms={rc.title.path}
                      style={{ color: "#ffffff", fontSize: "1.05rem", lineHeight: 1.25, margin: 0 }}
                      dangerouslySetInnerHTML={{ __html: rc.title.html }}
                    />
                  </div>
                </div>

                {/* Body */}
                <p
                  className="text-sm"
                  data-cms={rc.body.path}
                  style={{ color: "rgba(255,255,255,0.45)", lineHeight: 1.6, flex: 1, marginBottom: "1rem" }}
                  dangerouslySetInnerHTML={{ __html: rc.body.html }}
                />

                {/* CTA */}
                <span className="arrow-link" style={{ color: "#1cc3af", fontWeight: 600, fontSize: "0.875rem" }}>
                  {rc.cta} <span className="arrow">→</span>
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
