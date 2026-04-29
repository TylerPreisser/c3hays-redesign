import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
    // Next.js 16 requires explicitly allowlisting non-default quality values.
    // Hero.tsx uses quality={90} — keep it allowed to silence the dev warning.
    qualities: [75, 90],
  },
};

export default nextConfig;
