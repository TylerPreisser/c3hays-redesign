"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navItems } from "@/data/navigation";
import Logo from "@/components/brand/Logo";
import type { CMSOverrides } from "@/lib/cms";
import { tx } from "@/lib/home-content";
import { btnCss } from "@/components/home/Hero";

const navKey = (href: string) => href.replace(/\//g, "") || "home";

export default function Header({ globals = {} }: { globals?: CMSOverrides }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const t = globals.text || {};
  const nav = globals.nav || {};
  // Nav items come from the editor's nav config when set, else the code defaults.
  const navList = nav.items && nav.items.length ? nav.items : navItems.map((n) => ({ label: n.label, href: n.href }));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // iOS scroll-lock: position:fixed + capture scrollY prevents bounce-scroll
  useEffect(() => {
    if (mobileOpen) {
      const scrollY = window.scrollY;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
    } else {
      const scrollY = parseInt(document.body.style.top || "0", 10) * -1;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      if (scrollY) window.scrollTo(0, scrollY);
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    };
  }, [mobileOpen]);

  // Nav scroll effect override: auto (default) | always solid | always transparent.
  const isScrolled = nav.effect === "solid" ? true : nav.effect === "transparent" ? false : scrolled;
  const navColor = nav.color;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          isScrolled ? "nav-solid" : "nav-transparent"
        }`}
        style={{
          paddingTop: "env(safe-area-inset-top)",
          ...(nav.font ? { fontFamily: nav.font } : {}),
          ...(nav.bg && isScrolled ? { backgroundColor: nav.bg } : {}),
        }}
      >
        <nav className="container-c3 flex items-center justify-between h-16 lg:h-[4.5rem]">

          {/* Logo — light on transparent dark hero, dark on scrolled white header */}
          <Link
            href="/"
            aria-label="C3 — Celebration Community Church — Home"
            className="shrink-0 flex items-center"
          >
            <Logo size={38} variant={isScrolled ? "dark" : "light"} />
          </Link>

          {/* Desktop Nav — visible from md (768px) up; tighter spacing at md, full at lg */}
          <ul className="hidden md:flex items-center gap-0 lg:gap-1" role="list">
            {navList.map((item) => {
              const k = navKey(item.href);
              const base = navColor || (isScrolled ? "rgba(27,28,28,0.7)" : "rgba(255,255,255,0.82)");
              const hover = navColor || (isScrolled ? "#1b1c1c" : "#ffffff");
              return (
              <li key={item.href}>
                <Link
                  href={t[`nav-${k}-href`] || item.href}
                  data-cms-link={`g:nav-${k}`}
                  className="nav-link-underline block px-2 py-2 lg:px-4 text-[0.65rem] lg:text-xs font-semibold uppercase tracking-[0.1em] lg:tracking-[0.12em] transition-colors duration-200"
                  style={{ color: base }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = hover; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = base; }}
                >
                  <span data-cms-link-label>{tx(t, `nav-${k}-label`, item.label)}</span>
                </Link>
              </li>
            );})}
          </ul>

          {/* Desktop right: single primary CTA — Plan a Visit */}
          <div className="hidden md:flex items-center">
            <Link href={t["nav-cta-href"] || "/visit/"} data-cms-link="g:nav-cta" className="btn btn-primary btn-sm text-[0.75rem] lg:text-[0.8125rem] px-4 lg:px-[1.85rem]" style={btnCss(globals.btn?.["nav-cta"] as never)}>
              <span data-cms-link-label>{tx(t, "nav-cta-label", "Plan a Visit")}</span>
            </Link>
          </div>

          {/* Mobile hamburger — only on small phones (below md/768px) */}
          <button
            className="md:hidden flex items-center justify-center w-11 h-11 transition-colors duration-200"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            style={{
              color: isScrolled ? "#1b1c1c" : "#ffffff",
              transition: "color 200ms cubic-bezier(0.33, 0, 0.19, 1)",
            }}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </header>

      {/* Mobile drawer — full-screen ink overlay (phones only, below md/768px) */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="fixed inset-0 z-40 flex flex-col"
            style={{
              backgroundColor: "#1b1c1c",
              paddingTop: "env(safe-area-inset-top)",
              paddingBottom: "env(safe-area-inset-bottom)",
            }}
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            {/* Mobile header row */}
            <div className="flex items-center justify-between h-16 container-c3 border-b border-white/10">
              <Link
                href="/"
                className="flex items-center"
                onClick={() => setMobileOpen(false)}
                aria-label="C3 Home"
              >
                <Logo size={34} variant="light" />
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center w-11 h-11 text-white/70 hover:text-white transition-colors"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 overflow-y-auto container-c3 py-10">
              <ul className="flex flex-col" role="list">
                {navList.map((item, i) => {
                  const k = navKey(item.href);
                  return (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.1, duration: 0.3, ease: "easeOut" }}
                  >
                    <Link
                      href={t[`nav-${k}-href`] || item.href}
                      data-cms-link={`g:nav-${k}`}
                      className="block py-4 text-2xl font-bold text-white/80 hover:text-white transition-colors border-b border-white/8"
                      onClick={() => setMobileOpen(false)}
                    >
                      <span data-cms-link-label>{tx(t, `nav-${k}-label`, item.label)}</span>
                    </Link>
                  </motion.li>
                );})}
              </ul>

              <motion.div
                className="mt-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45, duration: 0.3 }}
              >
                <Link
                  href={t["nav-cta-href"] || "/visit/"}
                  data-cms-link="g:nav-cta"
                  className="btn btn-primary btn-lg w-full text-center"
                  onClick={() => setMobileOpen(false)}
                >
                  <span data-cms-link-label>{tx(t, "nav-cta-label", "Plan a Visit")}</span>
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
