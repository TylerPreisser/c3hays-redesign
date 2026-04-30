import Image from "next/image";

/**
 * Logo — C3 brand mark using real PNG assets.
 *
 * variant="light"  → white C3 mark on transparent bg (dark surfaces: header, footer, mobile drawer)
 * variant="dark"   → near-black C3 mark on transparent bg (light surfaces: scrolled header)
 *
 * Usage:
 *   <Logo variant="light" size={38} />  → white mark on dark header
 *   <Logo variant="dark" size={38} />   → dark mark on scrolled white header
 */

interface LogoProps {
  variant?: "light" | "dark";
  size?: number;
  className?: string;
}

export default function Logo({ variant = "dark", size = 40, className = "" }: LogoProps) {
  const src = variant === "light" ? "/brand/logo-light.png" : "/brand/logo-dark.png";
  return (
    <Image
      src={src}
      alt="C3 — Celebration Community Church"
      width={size}
      height={size}
      className={className}
      priority
    />
  );
}
