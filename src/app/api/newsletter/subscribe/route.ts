import { NextRequest, NextResponse } from "next/server";
import { cmsForward } from "@/lib/cms";
import { getForwardSecret } from "@/lib/signup-config";

/**
 * POST /api/newsletter/subscribe: the site's own signup route.
 *
 * The browser posts here (same origin); this route posts to Studio over the `CMS` binding and adds the two headers
 * Studio's public-form guard reads: `x-c3-client-ip` (the visitor, so Studio's rate limit keys on the person and not
 * on this Worker) and `x-c3-forward-secret` (proves the first header came from this site). Studio verifies the
 * Turnstile token; this route only refuses a request that has none, and fails closed when the secret is not set.
 * The answer never says whether an address was already known.
 */
export const dynamic = "force-dynamic";

const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;
const MAX_BODY = 4096;

const reply = (status: number, body: Record<string, unknown>) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (!origin || origin !== req.nextUrl.origin) return reply(403, { code: "bad_origin" });
  if (Number(req.headers.get("content-length") || 0) > MAX_BODY) return reply(413, { code: "too_large" });

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body !== "object") return reply(400, { code: "bad_request" });

  // A field no person fills in. A bot that did gets the same answer a person would and nothing is sent.
  if (typeof body.company === "string" && body.company.trim() !== "") return reply(201, { ok: true });

  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!EMAIL.test(email) || email.length > 254) return reply(400, { code: "invalid_email" });

  const token = typeof body.turnstile_token === "string" ? body.turnstile_token : "";
  if (!token || token.length > 2048) return reply(400, { code: "captcha_required" });

  const secret = getForwardSecret();
  if (!secret) {
    console.error("[newsletter signup] SITE_FORWARD_SECRET is not set; refusing");
    return reply(503, { code: "unavailable" });
  }

  const ip = req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const name = typeof body.name === "string" ? body.name.slice(0, 200) : undefined;
  try {
    const res = await cmsForward("/api/comms/subscribe", {
      method: "POST",
      headers: { "content-type": "application/json", "x-c3-client-ip": ip, "x-c3-forward-secret": secret },
      body: JSON.stringify({ email, name, turnstile_token: token, company: "" }), // Studio's field name (tests/fixtures/signup-forward-body.json)
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) return reply(201, { ok: true });
    if (res.status === 429) return reply(429, { code: "rate_limited" });
    if (res.status === 403) return reply(400, { code: "captcha_failed" }); // Studio refused the Turnstile check: the form says so in a sentence
    if (res.status === 400) {
      const j = (await res.json().catch(() => ({}))) as { code?: string };
      return reply(400, { code: j.code === "invalid_email" ? "invalid_email" : "captcha_failed" });
    }
    console.error(`[newsletter signup] Studio answered ${res.status}`);
    return reply(502, { code: "unavailable" });
  } catch {
    return reply(502, { code: "unavailable" });
  }
}
