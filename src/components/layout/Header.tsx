"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navItems } from "@/data/navigation";
import Logo from "@/components/brand/Logo";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
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

  const isScrolled = scrolled;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          isScrolled ? "nav-solid" : "nav-transparent"
        }`}
        style={{ paddingTop: "env(safe-area-inset-top)" }}
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

          {/* Desktop Nav — centered text links */}
          <ul className="hidden lg:flex items-center gap-1" role="list">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="nav-link-underline block px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-colors duration-200"
                  style={{
                    color: isScrolled ? "rgba(27,28,28,0.7)" : "rgba(255,255,255,0.82)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = isScrolled ? "#1b1c1c" : "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = isScrolled ? "rgba(27,28,28,0.7)" : "rgba(255,255,255,0.82)";
                  }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop right: single primary CTA — Plan a Visit (Give removed from nav) */}
          <div className="hidden lg:flex items-center">
            <Link href="/visit/" className="btn btn-primary btn-sm">
              Plan a Visit
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden flex items-center justify-center w-11 h-11 transition-colors duration-200"
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

      {/* Mobile drawer — full-screen ink overlay */}
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
                {navItems.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.1, duration: 0.3, ease: "easeOut" }}
                  >
                    <Link
                      href={item.href}
                      className="block py-4 text-2xl font-bold text-white/80 hover:text-white transition-colors border-b border-white/8"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                className="mt-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45, duration: 0.3 }}
              >
                <Link
                  href="/visit/"
                  className="btn btn-primary btn-lg w-full text-center"
                  onClick={() => setMobileOpen(false)}
                >
                  Plan a Visit
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
