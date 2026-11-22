/**
 * Edge contract of the public site: security headers, the staging environment, the signup route.
 * Each guards something a stranger or the editor would hit: a CSP that blocks Studio's canvas or the bridge's
 * <style>, a staging site reading production, a signup that takes an address with no Turnstile token.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { NextRequest } from "next/server";
import { contentSecurityPolicy, securityHeaders, studioOrigin, STUDIO_ORIGINS } from "@/lib/security-headers";

const wrangler = JSON.parse(readFileSync(join(__dirname, "../wrangler.jsonc"), "utf8").replace(/^\s*\/\/.*$/gm, ""));

describe("security headers", () => {
  it("frames only Studio's origin of the same environment, and still allows the bridge's inline <style>", () => {
    const csp = contentSecurityPolicy({ studio: STUDIO_ORIGINS.staging });
    expect(csp).toMatch(/frame-ancestors https:\/\/c3-studio-staging\.preissersolutions\.com(;|$)/);
    expect(csp).not.toContain(STUDIO_ORIGINS.production);
    expect(csp).toMatch(/style-src [^;]*'unsafe-inline'/);
    expect(csp).toContain("https://challenges.cloudflare.com");
    expect(csp).toMatch(/connect-src [^;]*https:\/\/app\.espace\.cool(;| )/); // the calendar fetch, exactly this origin
    expect(csp).not.toMatch(/connect-src [^;]*(\*|https:( |;|$))/);
    expect(csp).toContain("object-src 'none'");
  });
  it("sends Referrer-Policy strict-origin-when-cross-origin", () => {
    const h = Object.fromEntries(securityHeaders({ studio: STUDIO_ORIGINS.production }).map((x) => [x.key, x.value]));
    expect(h["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
    expect(h["X-Content-Type-Options"]).toBe("nosniff");
  });
  it("no-index and build headers are staging-only: absent unless asked for", () => {
    const keys = (o: Parameters<typeof securityHeaders>[0]) => securityHeaders(o).map((x) => x.key);
    expect(keys({ studio: STUDIO_ORIGINS.production })).not.toContain("X-Robots-Tag");
    expect(keys({ studio: STUDIO_ORIGINS.production })).not.toContain("X-C3-Build");
    const h = Object.fromEntries(securityHeaders({ studio: STUDIO_ORIGINS.staging, noindex: true, build: "abc-1" }).map((x) => [x.key, x.value]));
    expect(h["X-Robots-Tag"]).toBe("noindex, nofollow");
    expect(h["X-C3-Build"]).toBe("abc-1");
  });
  it("STUDIO_ORIGIN picks the environment and a junk value fails the build", () => {
    expect(studioOrigin({ STUDIO_ORIGIN: `${STUDIO_ORIGINS.staging}/` })).toBe(STUDIO_ORIGINS.staging);
    expect(studioOrigin({})).toBe(STUDIO_ORIGINS.production);
    expect(() => studioOrigin({ STUDIO_ORIGIN: "not a url" })).toThrow();
  });
});

describe("wrangler staging", () => {
  it("staging's CMS binding is c3-studio-staging; the preview address stays production", () => {
    expect(wrangler.env.staging.services).toEqual([{ binding: "CMS", service: "c3-studio-staging" }]);
    expect(wrangler.services).toEqual([{ binding: "CMS", service: "c3-studio" }]);
    expect(wrangler.name).toBe("c3hays-live");
  });
});

describe("signup route", () => {
  const sent: { url: string; init: RequestInit }[] = [];
  beforeEach(() => {
    process.env.NEXT_PUBLIC_CMS_URL = "";
    process.env.SITE_FORWARD_SECRET = "test-secret";
    sent.length = 0;
  });
  afterEach(() => { vi.resetModules(); vi.unstubAllGlobals(); delete process.env.SITE_FORWARD_SECRET; });

  async function post(body: unknown, headers: Record<string, string> = {}) {
    vi.resetModules();
    vi.doMock("@/lib/cms", () => ({
      cmsForward: async (path: string, init: RequestInit) => { sent.push({ url: path, init }); return new Response("{}", { status: 201 }); },
    }));
    const { POST } = await import("@/app/api/newsletter/subscribe/route");
    return POST(new NextRequest("https://site.test/api/newsletter/subscribe", {
      method: "POST",
      headers: { origin: "https://site.test", "content-type": "application/json", "cf-connecting-ip": "203.0.113.9", ...headers },
      body: JSON.stringify(body),
    }));
  }

  it("refuses an address with no Turnstile token and sends nothing to Studio", async () => {
    const res = await post({ email: "a@example.org" });
    expect(res.status).toBe(400);
    expect((await res.json()).code).toBe("captcha_required");
    expect(sent).toEqual([]);
  });
  it("forwards a signup with the token, the visitor's ip and the forward secret", async () => {
    const res = await post({ email: "a@example.org", turnstile_token: "tok" });
    expect(res.status).toBe(201);
    const h = sent[0].init.headers as Record<string, string>;
    expect(sent[0].url).toBe("/api/comms/subscribe");
    expect(h["x-c3-client-ip"]).toBe("203.0.113.9");
    expect(h["x-c3-forward-secret"]).toBe("test-secret");
    expect(JSON.parse(String(sent[0].init.body))).toMatchObject({ email: "a@example.org", turnstile_token: "tok" });
  });
  it("refuses a cross-origin post and fails closed with no forward secret", async () => {
    expect((await post({ email: "a@example.org", turnstile_token: "t" }, { origin: "https://evil.test" })).status).toBe(403);
    delete process.env.SITE_FORWARD_SECRET;
    expect((await post({ email: "a@example.org", turnstile_token: "t" })).status).toBe(503);
    expect(sent).toEqual([]);
  });
});
