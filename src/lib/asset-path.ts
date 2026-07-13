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
export const assetPath = (path: string): string => {
  if (!path) return path;
  // Already an absolute URL (http(s)://, protocol-relative, or data:) → leave it.
  if (/^(https?:)?\/\//i.test(path) || path.startsWith("data:")) return path;
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${normalized}`;
};
