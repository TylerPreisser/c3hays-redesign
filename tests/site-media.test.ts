// @vitest-environment node
import { describe, it, expect, vi, afterEach } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

// These render whole pages (a cold import of every component): allow for a loaded machine.
vi.setConfig({ testTimeout: 60_000 });
vi.mock("next/navigation", () => ({ usePathname: () => "/", useRouter: () => ({}), useSearchParams: () => new URLSearchParams() }));
vi.mock("next/font/google", () => ({ Hanken_Grotesk: () => ({ variable: "font-x", className: "font-x" }) }));

/**
 * A visitor's browser talks only to the website's origin. A photo uploaded in Studio is stored as a Studio address
 * (relative or absolute) and reaches visitors as /media/<name>, which this site fetches from Studio over the same
 * service binding the content reads use.
 */
const STUDIO = "https://c3-studio-staging.preissersolutions.com";
const KEY = "aB3dEfGhIj-sunday-crowd.jpg";
const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3, 4]);

afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); vi.resetModules(); });

describe("an uploaded image's address is the site's own", () => {
  it.each([
    [`/api/media/site/${KEY}`],
    [`/uploads/site/${KEY}`],
    [`${STUDIO}/api/media/site/${KEY}`],
    [`${STUDIO}/uploads/site/${KEY}`],
    [`https://c3-studio.tylerpreisser.workers.dev/api/media/site/${KEY}`],
  ])("%s becomes /media/site/<name>", async (v) => {
    vi.stubEnv("NEXT_PUBLIC_CMS_URL", STUDIO);
    const { assetPath } = await import("@/lib/asset-path");
    expect(assetPath(v)).toBe(`/media/site/${KEY}`);
  });
  it("anything else is left alone: site files, other hosts, look-alike hosts, Studio paths that are not uploads", async () => {
    vi.stubEnv("NEXT_PUBLIC_CMS_URL", STUDIO);
    const { assetPath } = await import("@/lib/asset-path");
    for (const v of ["/images/exterior.webp", "https://images.example.org/x.jpg", `${STUDIO}.evil.example/api/media/site/${KEY}`, `https://evil.example/api/media/site/${KEY}`,
      `${STUDIO}/api/content/home`, `${STUDIO}/api/media/site/a/b`, "/api/media/site/../x.jpg", "data:image/png;base64,AAAA",
      // only the one fixed prefix is a website image: no prefix, another prefix, a different case, a doubled prefix
      `/api/media/${KEY}`, `/api/media/private/${KEY}`, `/api/media/SITE/${KEY}`, `/api/media/site/site/${KEY}`, `${STUDIO}/api/media/${KEY}`]) {
      expect(assetPath(v), v).toBe(v);
    }
  });
  it("a CSS background value is rewritten too, and only its Studio uploads", async () => {
    vi.stubEnv("NEXT_PUBLIC_CMS_URL", STUDIO);
    const { mediaInCss } = await import("@/lib/media-path");
    expect(mediaInCss(`url("${STUDIO}/api/media/site/${KEY}") center / cover no-repeat`)).toBe(`url("/media/site/${KEY}") center / cover no-repeat`);
    expect(mediaInCss('url("https://images.example.org/x.jpg") center / cover')).toBe('url("https://images.example.org/x.jpg") center / cover');
    const { buildBgCss } = await import("@/lib/backgrounds");
    expect(mediaInCss(buildBgCss([], { "home.hero": `url("${STUDIO}/api/media/site/${KEY}") center / cover no-repeat` }))).toContain(`/media/site/${KEY}`);
    expect(mediaInCss(buildBgCss([], { "home.hero": `url("${STUDIO}/api/media/site/${KEY}") center / cover no-repeat` }))).not.toContain(STUDIO);
  });
  it("a published Hays hero photo that was uploaded renders /media/site/<name>, and no Studio address", async () => {
    vi.stubEnv("NEXT_PUBLIC_CMS_URL", STUDIO);
    vi.stubGlobal("fetch", vi.fn(async (url: string) => {
      const u = new URL(url);
      const body: unknown = /^\/api\/content\/page\//.test(u.pathname) ? { media: { "hays-hero-img": `${STUDIO}/api/media/site/${KEY}` } } : u.pathname === "/api/content/locations" ? [] : {};
      return { ok: true, json: async () => body } as Response;
    }));
    vi.resetModules();
    const mod = await import("@/app/locations/hays/page");
    const html = renderToStaticMarkup(await (mod.default as (p: object) => Promise<React.ReactElement>)({}));
    const plainHtml = html.replace(/%2F/gi, "/"); // the image element's srcset carries the address URL-encoded
    expect(plainHtml).toContain(`/media/site/${KEY}`);
    expect(plainHtml).not.toContain("c3-studio-staging");
  });
});

describe("GET /media/site/<name> serves the image from Studio, through the content transport", () => {
  async function route(opts: { upstream?: (url: string, init?: RequestInit) => Response; key?: string; path?: string[]; method?: string; headers?: Record<string, string> } = {}) {
    const seen: { url: string; init?: RequestInit }[] = [];
    vi.stubEnv("NEXT_PUBLIC_CMS_URL", STUDIO);
    vi.stubEnv("SITE_FORWARD_SECRET", "site-forward-secret-0123456789abcdef");
    vi.stubGlobal("fetch", vi.fn(async (url: string, init?: RequestInit) => {
      seen.push({ url, init });
      return (opts.upstream ?? (() => new Response(PNG, { status: 200, headers: { "content-type": "image/png", "content-length": String(PNG.length) } })))(url, init);
    }));
    vi.resetModules();
    const { GET, HEAD } = await import("@/app/media/[...path]/route");
    const path = opts.path ?? ["site", opts.key ?? KEY];
    const req = new Request(`https://site.test/media/${path.map(encodeURIComponent).join("/")}`, { method: opts.method ?? "GET", headers: opts.headers });
    const res = await ((opts.method === "HEAD" ? HEAD : GET) as (r: Request, c: { params: Promise<{ path: string[] }> }) => Promise<Response>)(req, { params: Promise.resolve({ path }) });
    return { res, seen };
  }
  it("returns the bytes with the image type, nosniff and a long cache for a never-rewritten name", async () => {
    const { res, seen } = await route();
    expect(res.status).toBe(200);
    expect(new Uint8Array(await res.arrayBuffer())).toEqual(PNG);
    expect(res.headers.get("content-type")).toBe("image/png");
    expect(res.headers.get("x-content-type-options")).toBe("nosniff");
    expect(res.headers.get("cache-control")).toMatch(/max-age=31536000.*immutable/);
    expect(res.headers.get("content-length")).toBe(String(PNG.length));
    expect(seen).toHaveLength(1);
    expect(seen[0].url).toBe(`${STUDIO}/api/media/site/${KEY}`); // the host comes from config, the prefix is the one fixed value, the path is built here
    expect(new Headers(seen[0].init?.headers).get("x-c3-forward-secret")).toBe("site-forward-secret-0123456789abcdef");
  });
  it("a plain name without a random prefix gets a short cache", async () => {
    const { res } = await route({ key: "hero.png" });
    expect(res.headers.get("cache-control")).toMatch(/max-age=300/);
    expect(res.headers.get("cache-control")).not.toMatch(/immutable/);
  });
  it("refuses any shape but the one fixed prefix plus a name, without asking Studio", async () => {
    for (const path of [[], [KEY], ["private", KEY], ["SITE", KEY], ["site"], ["site", "site", KEY], ["site", "a", "b"], ["", KEY], ["site/x", KEY], ["site", "private/x.jpg"], [".", KEY], ["..", KEY], ["site", ".."], ["%73ite", KEY]]) {
      const { res, seen } = await route({ path });
      expect(res.status, JSON.stringify(path)).toBe(404);
      expect(seen, JSON.stringify(path)).toHaveLength(0);
    }
  });
  it("refuses traversal, encoded slashes, dot-only, empty and over-long names without asking Studio", async () => {
    for (const key of ["..", ".", "../auth/staging-persona", "a/b", "a\\b", "%2e%2e", "a%00b", "", "a".repeat(121), "a b", "x?y=1"]) {
      const { res, seen } = await route({ key });
      expect(res.status, JSON.stringify(key)).toBe(404);
      expect(seen, JSON.stringify(key)).toHaveLength(0);
    }
  });
  it("refuses an SVG, and anything that is not an allowed image type, whatever Studio says", async () => {
    for (const type of ["image/svg+xml", "text/html", "application/json", "application/octet-stream", "image/x-icon", "text/html; charset=utf-8", ""]) {
      const { res } = await route({ upstream: () => new Response("<svg onload=alert(1)/>", { status: 200, headers: type ? { "content-type": type } : {} }) });
      expect(res.status, type).toBe(404);
      expect(await res.text()).not.toContain("svg");
    }
    for (const type of ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif", "image/png; charset=binary"]) {
      expect((await route({ upstream: () => new Response(PNG, { status: 200, headers: { "content-type": type } }) })).res.status, type).toBe(200);
    }
  });
  it("404 for what Studio does not have, a plain body for anything it said, 502 for an outage", async () => {
    const miss = await route({ upstream: () => new Response(JSON.stringify({ error: "Not found", stack: "secret" }), { status: 404, headers: { "content-type": "application/json" } }) });
    expect(miss.res.status).toBe(404);
    expect(await miss.res.text()).not.toMatch(/secret|stack|Not found"/);
    const denied = await route({ upstream: () => new Response("<html>Access login</html>", { status: 403 }) });
    expect(denied.res.status).toBe(404);
    expect(await denied.res.text()).not.toContain("login");
    const down = await route({ upstream: () => new Response("boom secret", { status: 500 }) });
    expect(down.res.status).toBe(502);
    expect(await down.res.text()).not.toContain("secret");
    const thrown = await route({ upstream: () => { throw new Error("network secret"); } });
    expect(thrown.res.status).toBe(502);
    expect(await thrown.res.text()).not.toContain("secret");
  });
  it("a range request is answered with the whole image (200), never a partial or an upstream range", async () => {
    const { res, seen } = await route({ headers: { range: "bytes=0-3" } });
    expect(res.status).toBe(200);
    expect(res.headers.get("accept-ranges")).toBe("none");
    expect(new Headers(seen[0].init?.headers).get("range")).toBeNull();
    expect(new Uint8Array(await res.arrayBuffer())).toEqual(PNG);
  });
  it("a HEAD is answered with the headers and no body", async () => {
    const { res } = await route({ method: "HEAD" });
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("image/png");
    expect((await res.arrayBuffer()).byteLength).toBe(0);
  });
  it("without a Studio configured there is nothing to fetch: 404", async () => {
    vi.stubEnv("NEXT_PUBLIC_CMS_URL", "");
    vi.stubGlobal("fetch", vi.fn());
    vi.resetModules();
    const { GET } = await import("@/app/media/[...path]/route");
    const res = await GET(new Request("https://site.test/media/site/x.png"), { params: Promise.resolve({ path: ["site", "x.png"] }) });
    expect(res.status).toBe(404);
    expect(fetch).not.toHaveBeenCalled();
  });
});
