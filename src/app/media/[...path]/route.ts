import { cmsConfigured, cmsForward } from "@/lib/cms";
import { IMMUTABLE_KEY, MEDIA_KEY, MEDIA_PREFIX } from "@/lib/media-path";

/**
 * GET /media/site/<name>: an image staff uploaded in Studio, served from THIS origin so a visitor's browser never talks to
 * Studio (the content-security policy is not widened, and on staging Studio sits behind a sign-in no visitor has).
 *
 * The object is fetched from Studio's upload route over the same transport the content reads use (the CMS service
 * binding first, with the shared secret). The upstream host is never taken from the request. The path is exactly the one
 * fixed prefix segment (MEDIA_PREFIX, never chosen by the caller) plus a name (one segment, plain characters, no dot-only
 * name, 120 at most); any other shape is a 404 without asking Studio, and the upstream path is built here.
 * Only jpeg, png, webp, avif and gif go out (SVG can carry script); anything else, and anything Studio does not have,
 * is a plain 404 with no upstream body. A range request is answered with the whole image (200, `accept-ranges: none`).
 */
export const dynamic = "force-dynamic";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"]);
const CACHE_LONG = "public, max-age=31536000, immutable"; // a stored name with Studio's random id is never rewritten
const CACHE_SHORT = "public, max-age=300";

const plain = (status: number) =>
  new Response(status === 404 ? "Not found" : "Unavailable", { status, headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store", "x-content-type-options": "nosniff" } });

async function serve(method: "GET" | "HEAD", path: string[]): Promise<Response> {
  const key = path[1] ?? "";
  if (path.length !== 2 || path[0] !== MEDIA_PREFIX || !MEDIA_KEY.test(key) || !cmsConfigured()) return plain(404); // a bad shape or name, or no Studio to fetch from
  let up: Response;
  try {
    up = await cmsForward(`/api/media/${MEDIA_PREFIX}/${key}`, { method, cache: "no-store", signal: AbortSignal.timeout(8000) });
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

export async function GET(_req: Request, ctx: { params: Promise<{ path: string[] }> }) {
  return serve("GET", (await ctx.params).path);
}
export async function HEAD(_req: Request, ctx: { params: Promise<{ path: string[] }> }) {
  return serve("HEAD", (await ctx.params).path);
}
