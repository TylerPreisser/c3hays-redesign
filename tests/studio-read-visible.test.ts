// @vitest-environment node
import { describe, it, expect, vi, afterEach } from "vitest";

/**
 * Studio answering with a login page (the sign-in redirect, followed to its HTML) or a refusal must be
 * reported as "fallback", never as "studio": the site then silently serves its built-in content.
 */
const BASE = "https://studio.example.test";
async function load() {
  vi.resetModules();
  vi.stubEnv("NEXT_PUBLIC_CMS_URL", BASE);
  return import("@/lib/cms");
}
const html = () => ({ ok: true, status: 200, headers: new Headers({ "content-type": "text/html" }), json: async () => { throw new SyntaxError("Unexpected token <"); } }) as unknown as Response;
const refused = () => ({ ok: false, status: 403, headers: new Headers(), json: async () => ({}) }) as unknown as Response;
const good = () => ({ ok: true, status: 200, headers: new Headers({ "content-type": "application/json" }), json: async () => ({ name: "C3" }) }) as unknown as Response;

afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); vi.restoreAllMocks(); });

describe("the site says whether it read Studio", () => {
  it("a login page where JSON is expected is fallback", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => html()));
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { studioContentState } = await load();
    expect(await studioContentState(0)).toBe("fallback");
    expect(warn).toHaveBeenCalled();
  });
  it("a refusal is fallback", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => refused()));
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const { studioContentState } = await load();
    expect(await studioContentState(0)).toBe("fallback");
  });
  it("a JSON answer is studio", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => good()));
    const { studioContentState } = await load();
    expect(await studioContentState(0)).toBe("studio");
  });

  // Studio's staging wall: no shared secret in the header, no content.
  const SECRET = "site-forward-secret-0123456789abcdef";
  const wall = () => vi.fn(async (_u: string, init?: RequestInit) => {
    const h = new Headers(init?.headers);
    return h.get("x-c3-forward-secret") === SECRET ? good() : refused();
  });
  it("with the secret bound, reads carry it and Studio answers: studio", async () => {
    vi.stubEnv("SITE_FORWARD_SECRET", SECRET);
    const f = wall();
    vi.stubGlobal("fetch", f);
    const { studioContentState, getCMSLocations } = await load();
    expect(await studioContentState(0)).toBe("studio");
    expect(await getCMSLocations()).toEqual({ name: "C3" });
    expect(new Headers((f.mock.calls[0][1] as RequestInit).headers).get("x-c3-forward-secret")).toBe(SECRET);
  });
  it("with no secret bound, the wall answers 403: fallback, a log line, and the content read is null", async () => {
    vi.stubEnv("SITE_FORWARD_SECRET", "");
    vi.stubGlobal("fetch", wall());
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { studioContentState, getCMSLocations } = await load();
    expect(await studioContentState(0)).toBe("fallback");
    expect(await getCMSLocations()).toBeNull();
    expect(warn.mock.calls.flat().join(" ")).toMatch(/\[c3-content\] fallback/);
  });
  it("never logs the secret", async () => {
    vi.stubEnv("SITE_FORWARD_SECRET", SECRET);
    vi.stubGlobal("fetch", vi.fn(async () => refused()));
    const out: string[] = [];
    for (const k of ["warn", "error", "log"] as const) vi.spyOn(console, k).mockImplementation((...a) => { out.push(a.join(" ")); });
    const { studioContentState } = await load();
    await studioContentState(0);
    expect(out.join("\n")).not.toContain(SECRET);
  });
});
