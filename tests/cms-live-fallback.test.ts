// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

/**
 * U6 (Cloudflare CMS_LIVE Worker) — the site's live-fetch + church-site SAFETY NET.
 *
 * The whole point of Option (b) is real back-and-forth: the deployed Worker SSR-fetches
 * LIVE content from the C3 Studio editor API each request. But a live church site must
 * NEVER go blank when the editor is down — so every CMS call falls back to null (→ the
 * hand-built pages render). This locks the two load-bearing contracts of `src/lib/cms.ts`:
 *
 *   1. LIVE FETCH   — when NEXT_PUBLIC_CMS_URL is set, published/draft reads hit the editor.
 *   2. SAFETY NET   — CMS unconfigured, non-200, or network error ⇒ null (static fallback),
 *                     and the preview-token is FORWARDED but its secret NEVER lives here.
 *
 * `CMS_BASE` is captured at module load (cms.ts:17), so each case stubs the env and
 * re-imports the module fresh (vi.resetModules) to exercise the configured/unconfigured
 * branches deterministically.
 */

const EDITOR = "https://c3-studio.example.workers.dev";

async function loadCms(cmsUrl?: string) {
  vi.resetModules();
  if (cmsUrl === undefined) vi.stubEnv("NEXT_PUBLIC_CMS_URL", "");
  else vi.stubEnv("NEXT_PUBLIC_CMS_URL", cmsUrl);
  return import("@/lib/cms");
}

function mockFetch(impl: (url: string) => { ok: boolean; json?: () => unknown } | Promise<never>) {
  const fn = vi.fn(async (url: string) => {
    const r = impl(url);
    if (r instanceof Promise) return r; // rejection = network error
    return { ok: r.ok, json: async () => (r.json ? r.json() : {}) } as Response;
  });
  vi.stubGlobal("fetch", fn);
  return fn;
}

describe("U6 — CMS live-fetch + church-site fallback", () => {
  beforeEach(() => vi.unstubAllEnvs());
  afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

  it("SAFETY NET: with NEXT_PUBLIC_CMS_URL unset, never fetches and returns null (static pages render)", async () => {
    const fetchFn = mockFetch(() => ({ ok: true, json: () => ({ hero: {} }) }));
    const cms = await loadCms(undefined);
    expect(await cms.getCMSBundle()).toBeNull();
    expect(await cms.getHomeContent()).toBeNull();
    expect(fetchFn).not.toHaveBeenCalled(); // export-safe: no network at all
  });

  it("LIVE FETCH: with the editor URL set, published home reads from <CMS_URL>/api/content/home", async () => {
    const fetchFn = mockFetch((url) => ({ ok: true, json: () => ({ hero: { heading: "Live from editor" } }) }));
    const cms = await loadCms(EDITOR);
    const home = await cms.getHomeContent();
    expect(home).toEqual({ hero: { heading: "Live from editor" } });
    expect(fetchFn).toHaveBeenCalledWith(`${EDITOR}/api/content/home`, expect.anything());
  });

  it("SAFETY NET: editor returns non-200 ⇒ null (fall back to hand-built content)", async () => {
    mockFetch(() => ({ ok: false }));
    const cms = await loadCms(EDITOR);
    expect(await cms.getHomeContent()).toBeNull();
    expect(await cms.getCMSBundle()).toBeNull();
  });

  it("SAFETY NET: editor unreachable (network throw) ⇒ null, never surfaces an error", async () => {
    mockFetch(() => Promise.reject(new Error("ECONNREFUSED")));
    const cms = await loadCms(EDITOR);
    await expect(cms.getHomeContent()).resolves.toBeNull();
    await expect(cms.getCMSBundle()).resolves.toBeNull();
  });

  it("PREVIEW: a valid ?preview token is FORWARDED to the editor's draft endpoint (draft wins)", async () => {
    const fetchFn = mockFetch((url) =>
      url.includes("/api/content/draft")
        ? { ok: true, json: () => ({ hero: { heading: "DRAFT copy" } }) }
        : { ok: true, json: () => ({ hero: { heading: "published" } }) },
    );
    const cms = await loadCms(EDITOR);
    const home = await cms.getHomeContent("tok-abc");
    expect(home).toEqual({ hero: { heading: "DRAFT copy" } });
    const draftCall = fetchFn.mock.calls.find((c) => String(c[0]).includes("/api/content/draft"));
    expect(draftCall).toBeTruthy();
    expect(String(draftCall![0])).toContain("path=home");
    expect(String(draftCall![0])).toContain("preview=tok-abc");
  });

  it("PREVIEW SECURITY: a forged/expired token (draft 401) falls back to PUBLISHED, never errors", async () => {
    const fetchFn = mockFetch((url) =>
      url.includes("/api/content/draft")
        ? { ok: false } // 401 from the editor (it is the sole gate)
        : { ok: true, json: () => ({ hero: { heading: "published" } }) },
    );
    const cms = await loadCms(EDITOR);
    const home = await cms.getHomeContent("forged");
    expect(home).toEqual({ hero: { heading: "published" } });
    // draft was attempted, then published served — no throw, no draft leak
    expect(fetchFn.mock.calls.some((c) => String(c[0]).includes("/api/content/draft"))).toBe(true);
  });

  it("PREVIEW: NO token ⇒ the draft endpoint is NEVER contacted (published only)", async () => {
    const fetchFn = mockFetch(() => ({ ok: true, json: () => ({ hero: {} }) }));
    const cms = await loadCms(EDITOR);
    await cms.getHomeContent(); // tokenless / public request
    expect(fetchFn.mock.calls.some((c) => String(c[0]).includes("/api/content/draft"))).toBe(false);
  });
});
