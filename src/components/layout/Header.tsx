"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { navItems, ctaItem } from "@/data/navigation";
import { site } from "@/data/site";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
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

  useEffect(() => {
    // Lock scroll on iOS: overflow:hidden alone doesn't prevent bounce-scroll.
    // Adding position:fixed + capturing scrollY prevents the page from jumping
    // when the drawer opens, then restores scroll position on close.
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

  /* nav text color depends on scroll state:
     - transparent over hero → white text
     - solid off-white → evergreen text */
  const textColor = scrolled ? "#232e2c" : "#ffffff";
  const textMutedColor = scrolled ? "rgba(35,46,44,0.65)" : "rgba(255,255,255,0.8)";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          scrolled ? "nav-solid" : "nav-transparent"
        }`}
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <nav className="container-c3 flex items-center justify-between h-16 lg:h-[4.5rem]">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 shrink-0"
            aria-label={site.name}
            style={{ color: textColor, transition: "color 200ms cubic-bezier(0.33, 0, 0.19, 1)" }}
          >
            <Image
              src="/brand/logo.png"
              alt={`${site.short} logo`}
              width={36}
              height={36}
              className="w-9 h-9 object-contain"
              priority
            />
            <span
              className="hidden sm:block text-sm font-bold tracking-widest uppercase"
              style={{ fontWeight: 700, letterSpacing: "0.12em" }}
            >
              C3
            </span>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-2" role="list">
            {navItems.map((item) => (
              <li key={item.href} className="relative">
                {item.children ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(item.href)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      className="flex items-center gap-1 px-4 py-2 text-xs font-600 uppercase tracking-widest transition-colors duration-200"
                      style={{
                        color: openDropdown === item.href ? textColor : textMutedColor,
                        fontWeight: 600,
                        letterSpacing: "0.12em",
                        transition: "color 200ms cubic-bezier(0.33, 0, 0.19, 1)",
                      }}
                      aria-expanded={openDropdown === item.href}
                      aria-haspopup="true"
                    >
                      {item.label}
                      <ChevronDown
                        size={12}
                        className={`transition-transform duration-200 ${
                          openDropdown === item.href ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {openDropdown === item.href && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 mt-0 min-w-44 bg-[#232e2c] overflow-hidden"
                          style={{ borderRadius: 0 }}
                        >
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block px-5 py-3 text-xs font-semibold uppercase tracking-widest text-white/70 hover:text-white hover:bg-white/10 transition-colors duration-150"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="block px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-colors duration-200"
                    style={{
                      color: textMutedColor,
                      transition: "color 200ms cubic-bezier(0.33, 0, 0.19, 1)",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = textColor; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = textMutedColor; }}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/visit/"
              className="text-xs font-semibold uppercase tracking-widest transition-colors duration-200"
              style={{
                color: textMutedColor,
                transition: "color 200ms cubic-bezier(0.33, 0, 0.19, 1)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = textColor; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = textMutedColor; }}
            >
              Plan a Visit
            </Link>
            <Link
              href={ctaItem.href}
              className="btn btn-primary btn-sm"
            >
              {ctaItem.label}
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden flex items-center justify-center w-11 h-11 transition-colors duration-200"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            style={{ color: textColor }}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </header>

      {/* Mobile Menu — full-screen evergreen overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="fixed inset-0 z-40 flex flex-col"
            style={{
              backgroundColor: "#232e2c",
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
                className="flex items-center gap-2.5 text-white"
                onClick={() => setMobileOpen(false)}
              >
                <Image
                  src="/brand/logo.png"
                  alt={`${site.short} logo`}
                  width={32}
                  height={32}
                  className="w-8 h-8 object-contain"
                />
                <span className="font-bold text-xs tracking-widest uppercase">C3</span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center w-11 h-11 text-white/70 hover:text-white transition-colors"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            {/* Nav links — stagger in */}
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
                    {item.children && (
                      <ul className="pl-4 pb-2">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className="block py-2 text-sm font-semibold uppercase tracking-wider text-white/45 hover:text-white/80 transition-colors"
                              onClick={() => setMobileOpen(false)}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.li>
                ))}
                <motion.li
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.05 + 0.1, duration: 0.3, ease: "easeOut" }}
                >
                  <Link
                    href="/visit/"
                    className="block py-4 text-2xl font-bold text-white/80 hover:text-white transition-colors border-b border-white/8"
                    onClick={() => setMobileOpen(false)}
                  >
                    Plan a Visit
                  </Link>
                </motion.li>
              </ul>

              <motion.div
                className="mt-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45, duration: 0.3 }}
              >
                <Link
                  href={ctaItem.href}
                  className="btn btn-primary btn-lg w-full text-center"
                  onClick={() => setMobileOpen(false)}
                >
                  {ctaItem.label}
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
