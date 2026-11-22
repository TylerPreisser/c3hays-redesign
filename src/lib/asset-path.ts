/**
 * Prefix a public-asset path with the GitHub Pages basePath when running
 * in a CI build that sets NEXT_PUBLIC_BASE_PATH. Local dev has no basePath
 * (env var unset), so this is a no-op there.
 *
 * Use this for any hard-coded `/images/...` or `/brand/...` references
 * passed to <Image src> or to background-image inline styles. Next.js
 * does NOT auto-prefix these — only routes and _next/* artifacts get
 * basePath/assetPrefix treatment.
 */
import { MEDIA_PREFIX, uploadKey } from "@/lib/media-path";

export const assetPath = (path: string): string => {
  if (!path) return path;
  // A photo uploaded in Studio is served by this site, never loaded from Studio (src/lib/media-path.ts).
  const up = uploadKey(path);
  if (up) return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/media/${MEDIA_PREFIX}/${up}`;
  // Already an absolute URL (http(s)://, protocol-relative, or data:) → leave it.
  if (/^(https?:)?\/\//i.test(path) || path.startsWith("data:")) return path;
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${normalized}`;
};
