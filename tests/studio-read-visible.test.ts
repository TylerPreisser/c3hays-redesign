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
});
