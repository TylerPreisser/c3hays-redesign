import Image from "next/image";
import { assetPath } from "@/lib/asset-path";

/**
 * Logo — C3 brand mark using real PNG assets.
 *
 * variant="light"  → white C3 mark on transparent bg (dark surfaces: header, footer, mobile drawer)
 * variant="dark"   → near-black C3 mark on transparent bg (light surfaces: scrolled header)
 *
 * v3 (R4): the logo is EDITABLE. Pass `cmsKey` to expose it to the C3 Studio editor
 * (a `data-cms-img` region → click to replace via the image picker); `srcOverride`
 * (from globals.media) swaps the rendered source once staff pick a new mark. Both
 * the light and dark variants are independently settable (g:logo-light / g:logo-dark).
 */

interface LogoProps {
  variant?: "light" | "dark";
  size?: number;
  className?: string;
  cmsKey?: string;       // e.g. "g:logo-light" → makes this logo click-to-replace in the editor
  srcOverride?: string;  // globals.media["logo-light"] → the chosen replacement source
}

export default function Logo({ variant = "dark", size = 40, className = "", cmsKey, srcOverride }: LogoProps) {
  const src = srcOverride || (variant === "light" ? assetPath("/brand/logo-light.png") : assetPath("/brand/logo-dark.png"));
  const img = (
    <Image
      src={src}
      alt="C3 — Celebration Community Church"
      width={size}
      height={size}
      className={className}
      priority
      unoptimized={!!srcOverride && /^https?:\/\//.test(srcOverride)}
    />
  );
  // When editable, wrap in a tagged span so EditBridge can select it (the swap
  // itself is applied via srcOverride on the next publish).
  return cmsKey ? <span data-cms-img={cmsKey} style={{ display: "inline-flex", lineHeight: 0 }}>{img}</span> : img;
}
