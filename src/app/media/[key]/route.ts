import { cmsConfigured, cmsForward } from "@/lib/cms";
import { IMMUTABLE_KEY, MEDIA_KEY } from "@/lib/media-path";

/**
 * GET /media/<name>: an image staff uploaded in Studio, served from THIS origin so a visitor's browser never talks to
 * Studio (the content-security policy is not widened, and on staging Studio sits behind a sign-in no visitor has).
 *
 * The object is fetched from Studio's upload route over the same transport the content reads use (the CMS service
 * binding first, with the shared secret). The upstream host is never taken from the request: only the name is, and
 * only in a fixed shape (one segment, plain characters, no dot-only name, 120 at most); the path is built here.
 * Only jpeg, png, webp, avif and gif go out (SVG can carry script); anything else, and anything Studio does not have,
 * is a plain 404 with no upstream body. A range request is answered with the whole image (200, `accept-ranges: none`).
 */
export const dynamic = "force-dynamic";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"]);
const CACHE_LONG = "public, max-age=31536000, immutable"; // a stored name with Studio's random id is never rewritten
const CACHE_SHORT = "public, max-age=300";

const plain = (status: number) =>
  new Response(status === 404 ? "Not found" : "Unavailable", { status, headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store", "x-content-type-options": "nosniff" } });

async function serve(method: "GET" | "HEAD", key: string): Promise<Response> {
  if (!MEDIA_KEY.test(key) || !cmsConfigured()) return plain(404); // a bad name, or no Studio to fetch from
  let up: Response;
  try {
    up = await cmsForward(`/api/media/${key}`, { method, cache: "no-store", signal: AbortSignal.timeout(8000) });
  } catch {
    return plain(502); // Studio did not answer
  }
  if (up.status >= 500) return plain(502);
  if (up.status !== 200) return plain(404);
  const type = (up.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
  if (!ALLOWED.has(type)) return plain(404);
  const headers: Record<string, string> = {
    "content-type": type,
    "x-content-type-options": "nosniff",
    "content-security-policy": "default-src 'none'; sandbox",
    "cache-control": IMMUTABLE_KEY.test(key) ? CACHE_LONG : CACHE_SHORT,
    "accept-ranges": "none",
  };
  const len = up.headers.get("content-length");
  if (len && /^\d+$/.test(len)) headers["content-length"] = len;
  return new Response(method === "HEAD" ? null : up.body, { status: 200, headers });
}

export async function GET(_req: Request, ctx: { params: Promise<{ key: string }> }) {
  return serve("GET", (await ctx.params).key);
}
export async function HEAD(_req: Request, ctx: { params: Promise<{ key: string }> }) {
  return serve("HEAD", (await ctx.params).key);
}
