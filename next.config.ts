import type { NextConfig } from "next";

/**
 * GitHub Pages serves project sites at /<repo-name>/.
 * The CI workflow (.github/workflows/deploy.yml) sets NEXT_PUBLIC_BASE_PATH=/c3hays-redesign
 * for the Pages build. Local dev (no env var) renders at root for clean localhost:3000.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  images: {
    unoptimized: true,
    qualities: [75, 90],
  },
  devIndicators: false,
};

export default nextConfig;
