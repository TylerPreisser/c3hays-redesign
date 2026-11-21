import type { NextConfig } from "next";
import { securityHeaders, studioOrigin } from "./src/lib/security-headers";

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
  // Inlined at build so /robots.txt (staging only) knows the build is a no-index one.
  env: { SITE_NOINDEX: process.env.SITE_NOINDEX === "1" ? "1" : "" },
  // Security headers (CSP with Studio's origin in frame-ancestors, Referrer-Policy, HSTS, nosniff). Applied by the
  // CMS_LIVE server runtime; a static export cannot send headers (the live Worker is the deployed shape).
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders({ studio: studioOrigin(), dev: process.env.NODE_ENV !== "production", noindex: process.env.SITE_NOINDEX === "1", build: process.env.SITE_BUILD_ID }) }];
  },
  // /beliefs merged into /about (item #2). Redirect old links + the section-preview
  // so nothing 404s. Honored in the CMS_LIVE server runtime (the deployed site); the
  // static-export CI build ignores redirects with a warning (that pipeline is separate).
  async redirects() {
    return [
      { source: "/beliefs", destination: "/about", permanent: true },
    ];
  },
};

export default nextConfig;
