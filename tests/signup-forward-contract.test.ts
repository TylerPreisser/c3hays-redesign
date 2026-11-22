// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * What the site forwards to Studio's POST /api/comms/subscribe. The body is checked against
 * tests/fixtures/signup-forward-body.json, the SAME file Studio's own contract test accepts, so the field names
 * (`turnstile_token`, as Studio's route and /api/submissions read it) cannot drift apart again.
 */
const FIXTURE = JSON.parse(readFileSync(join(__dirname, "fixtures/signup-forward-body.json"), "utf8"));
const sent: { url: string; init: RequestInit }[] = [];
let studioStatus = 201;

async function post(body: unknown) {
  vi.resetModules();
  vi.doMock("@/lib/cms", () => ({
    cmsForward: async (path: string, init: RequestInit) => { sent.push({ url: path, init }); return new Response("{}", { status: studioStatus }); },
  }));
  const { POST } = await import("@/app/api/newsletter/subscribe/route");
  return POST(new NextRequest("https://site.test/api/newsletter/subscribe", {
    method: "POST",
    headers: { origin: "https://site.test", "content-type": "application/json", "cf-connecting-ip": "203.0.113.9" },
    body: JSON.stringify(body),
  }));
}
// what the browser form posts to this site (useSignup.ts)
const FORM = { email: FIXTURE.email, name: FIXTURE.name, turnstile_token: FIXTURE.turnstile_token, company: "" };

beforeEach(() => { sent.length = 0; studioStatus = 201; process.env.SITE_FORWARD_SECRET = "test-secret-0123456789abcdef"; });
afterEach(() => { vi.resetModules(); vi.unstubAllGlobals(); delete process.env.SITE_FORWARD_SECRET; });

describe("the signup forwarded to Studio", () => {
  it("is exactly the shared fixture", async () => {
    expect((await post(FORM)).status).toBe(201);
    expect(JSON.parse(String(sent[0].init.body))).toEqual(FIXTURE);
  });
  it("tells the visitor in a plain sentence when Studio refuses the check or is unavailable", async () => {
    studioStatus = 403;
    const refused = await post(FORM);
    expect(refused.status).toBe(400);
    expect((await refused.json()).code).toBe("captcha_failed");
    studioStatus = 503;
    const down = await post(FORM);
    expect(down.status).toBe(502);
    const { SIGNUP_ERRORS } = await import("@/components/newsletter/useSignup");
    expect(SIGNUP_ERRORS.captcha).toMatch(/\w+ \w+ \w+/);
    expect(SIGNUP_ERRORS.failed).toMatch(/try again/i);
  });
});
