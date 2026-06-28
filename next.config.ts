import type { NextConfig } from "next";

/**
 * GitHub Pages serves project sites at /<repo-name>/.
 * The CI workflow (.github/workflows/deploy.yml) sets NEXT_PUBLIC_BASE_PATH=/c3hays-redesign
 * for the Pages build. Local dev (no env var) renders at root for clean localhost:3000.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

// CMS_LIVE=1 runs the site as a live, server-rendered app that consumes C3 Studio
// (the CMS) for real back-and-forth. Unset (default) keeps the static export used
// by the GitHub Pages / Cloudflare CI build — that pipeline is untouched.
const cmsLive = process.env.CMS_LIVE === "1";

const nextConfig: NextConfig = {
  output: cmsLive ? undefined : "export",
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
