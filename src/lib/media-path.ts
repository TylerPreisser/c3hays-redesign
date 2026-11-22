/**
 * Uploaded media. A visitor's browser talks only to this site's origin, so a photo that staff uploaded in Studio is
 * never loaded from Studio: its stored address (a relative Studio path, or an absolute address on a known Studio
 * origin) is rewritten to this site's own `/media/<name>` route, which fetches it from Studio server-side.
 * Pure and client-safe: no server imports.
 */
import { STUDIO_ORIGINS } from "@/lib/security-headers";

/** A stored upload name: what Studio's `mediaKey` makes (random id + plain file name). Never dot-only, one segment. */
export const MEDIA_KEY = /^(?!\.+$)[A-Za-z0-9._-]{1,120}$/;
/**
 * Website images live under ONE fixed key prefix in Studio's bucket (everything else there is private). A stored upload
 * is `<prefix>/<name>`: exactly one prefix segment, this value and no other, then a name. The caller never chooses it.
 */
export const MEDIA_PREFIX = "site";
/** The two places Studio keeps an upload: its public serve route and the local-dev static folder. */
const UPLOAD_PATH = new RegExp(`^/(?:api/media|uploads)/${MEDIA_PREFIX}/([A-Za-z0-9._-]{1,120})$`);
/** A stored name that starts with Studio's random id is never rewritten, so its bytes never change. */
export const IMMUTABLE_KEY = /^[A-Za-z0-9_-]{10}-/;

/** The Studio origins this build knows: both fixed ones, and the one the build is configured with. */
export function studioOrigins(): string[] {
  const out = new Set<string>(Object.values(STUDIO_ORIGINS));
  for (const v of [process.env.NEXT_PUBLIC_CMS_URL, process.env.NEXT_PUBLIC_STUDIO_ORIGIN]) {
    if (!v) continue;
    try { out.add(new URL(v).origin); } catch { /* not an address: ignore */ }
  }
  return [...out];
}

/** The name (after the fixed prefix) when `value` is a Studio upload (relative path, or absolute on a known Studio origin), else null. */
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
  return m && MEDIA_KEY.test(m[1]) ? m[1] : null;
}

/** An image value as the site serves it: `/media/site/<name>` for a Studio upload, anything else unchanged. */
export function mediaSrc<T extends string | undefined | null>(value: T): T | string {
  const k = uploadKey(value);
  return k ? `/media/${MEDIA_PREFIX}/${k}` : value;
}

/** Every `url(...)` in a CSS value that is a Studio upload, rewritten the same way; the rest of the value is untouched. */
export function mediaInCss(css: string): string {
  return css.replace(/url\(\s*(["']?)([^"')]+)\1\s*\)/gi, (whole, q: string, u: string) => {
    const k = uploadKey(u);
    return k ? `url(${q}/media/${MEDIA_PREFIX}/${k}${q})` : whole;
  });
}
