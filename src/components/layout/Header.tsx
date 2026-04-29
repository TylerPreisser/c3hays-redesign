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

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* The header uses padding-top: env(safe-area-inset-top) so the nav bar
          clears the Dynamic Island / notch on iPhone 14 Pro+. The fixed
          positioning + viewport-fit=cover in layout.tsx makes this necessary. */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "nav-glass" : "nav-transparent"
        }`}
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <nav className="container-c3 flex items-center justify-between h-16 lg:h-[4.5rem]">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 text-white shrink-0"
            aria-label={site.name}
          >
            <Image
              src="/brand/logo.png"
              alt={`${site.short} logo`}
              width={36}
              height={36}
              className="w-9 h-9 object-contain"
              priority
            />
            <span className="hidden sm:block text-base font-medium text-white">
              C3
            </span>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-1" role="list">
            {navItems.map((item) => (
              <li key={item.href} className="relative">
                {item.children ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(item.href)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      className="flex items-center gap-1 px-3.5 py-2 text-sm font-medium text-white/85 hover:text-white transition-colors duration-150 rounded-md"
                      aria-expanded={openDropdown === item.href}
                      aria-haspopup="true"
                    >
                      {item.label}
                      <ChevronDown
                        size={14}
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
                          className="absolute top-full left-0 mt-1 min-w-44 bg-[#0a1f2e] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                        >
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block px-4 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/8 transition-colors duration-150"
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
                    className="block px-3.5 py-2 text-sm font-medium text-white/85 hover:text-white transition-colors duration-150 rounded-md"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/visit/"
              className="text-sm font-medium text-white/80 hover:text-white transition-colors px-3.5 py-2"
            >
              Plan a Visit
            </Link>
            <Link href={ctaItem.href} className="btn btn-gold btn-sm">
              {ctaItem.label}
            </Link>
          </div>

          {/* Mobile Hamburger — min 44x44px touch target per Apple HIG */}
          <button
            className="lg:hidden flex items-center justify-center w-11 h-11 text-white/90 hover:text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-40 bg-[#0a1f2e] flex flex-col"
            style={{
              // Pad the drawer for Dynamic Island (top) and home indicator (bottom)
              paddingTop: "env(safe-area-inset-top)",
              paddingBottom: "env(safe-area-inset-bottom)",
            }}
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <div className="flex items-center justify-between h-16 container-c3 border-b border-white/8">
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
                <span className="font-medium text-sm">C3</span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center w-11 h-11 text-white/80 hover:text-white"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto container-c3 py-8">
              <ul className="flex flex-col gap-1" role="list">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block py-3 text-lg font-medium text-white/85 hover:text-white transition-colors border-b border-white/6"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                    {item.children && (
                      <ul className="pl-4 mt-1 mb-2">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className="block py-2 text-sm text-white/60 hover:text-white/90 transition-colors"
                              onClick={() => setMobileOpen(false)}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
                <li>
                  <Link
                    href="/visit/"
                    className="block py-3 text-lg font-medium text-white/85 hover:text-white transition-colors border-b border-white/6"
                    onClick={() => setMobileOpen(false)}
                  >
                    Plan a Visit
                  </Link>
                </li>
              </ul>

              <div className="mt-8 flex flex-col gap-3">
                <Link
                  href={ctaItem.href}
                  className="btn btn-gold btn-lg text-center"
                  onClick={() => setMobileOpen(false)}
                >
                  {ctaItem.label}
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
