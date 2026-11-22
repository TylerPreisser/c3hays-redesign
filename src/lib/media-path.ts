/**
 * Uploaded media. A visitor's browser talks only to this site's origin, so a photo that staff uploaded in Studio is
 * never loaded from Studio: its stored address (a relative Studio path, or an absolute address on a known Studio
 * origin) is rewritten to this site's own `/media/<name>` route, which fetches it from Studio server-side.
 * Pure and client-safe: no server imports.
 */
import { STUDIO_ORIGINS } from "@/lib/security-headers";

/**
 * A website image's stored name, exactly as Studio makes it: 22 random characters and one allowed extension. Anything else
 * (another length, another extension, a path, a dot-only name) is not a website image.
 */
export const MEDIA_NAME = /^[A-Za-z0-9_-]{22}\.(?:jpg|png|webp|avif|gif)$/;
/**
 * Studio serves website images ONLY under this one fixed prefix (everything else in its bucket is private). The prefix is a
 * constant here: never read from a request, never part of the address a visitor sees (`/media/<name>`).
 */
export const MEDIA_PREFIX = "site";
const UPLOAD_PATH = new RegExp(`^/api/media/${MEDIA_PREFIX}/([A-Za-z0-9_-]{22}\\.(?:jpg|png|webp|avif|gif))$`);

/** The Studio origins this build knows: both fixed ones, and the one the build is configured with. */
export function studioOrigins(): string[] {
  const out = new Set<string>(Object.values(STUDIO_ORIGINS));
  for (const v of [process.env.NEXT_PUBLIC_CMS_URL, process.env.NEXT_PUBLIC_STUDIO_ORIGIN]) {
    if (!v) continue;
    try { out.add(new URL(v).origin); } catch { /* not an address: ignore */ }
  }
  return [...out];
}

/** The stored name when `value` is a website image on Studio (`/api/media/site/<name>`, relative or on a known Studio origin), else null. */
export function uploadKey(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const v = value.trim();
  if (!v || v.length > 2000) return null;
  let path = v;
  if (/^https?:\/\//i.test(v)) {
    let u: URL;
    try { u = new URL(v); } catch { return null; }
    if (u.username || u.password || u.search || u.hash || !studioOrigins().includes(u.origin)) return null;
    path = u.pathname;
  } else if (!v.startsWith("/") || v.startsWith("//") || /[?#\\]/.test(v)) return null;
  const m = UPLOAD_PATH.exec(path);
  return m && MEDIA_NAME.test(m[1]) ? m[1] : null;
}

/** An image value as the site serves it: `/media/site/<name>` for a Studio upload, anything else unchanged. */
export function mediaSrc<T extends string | undefined | null>(value: T): T | string {
  const k = uploadKey(value);
  return k ? `/media/${k}` : value;
}

/** Every `url(...)` in a CSS value that is a Studio upload, rewritten the same way; the rest of the value is untouched. */
export function mediaInCss(css: string): string {
  return css.replace(/url\(\s*(["']?)([^"')]+)\1\s*\)/gi, (whole, q: string, u: string) => {
    const k = uploadKey(u);
    return k ? `url(${q}/media/${k}${q})` : whole;
  });
}
