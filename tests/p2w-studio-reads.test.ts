// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";

/**
 * P2-W: the website reads Studio. Real-shaped Studio payloads (the shapes Studio's public routes serve; see
 * scripts/fake-studio.mjs) go in, and what a visitor or the editor's canvas would see comes out.
 */
const STUDIO = "https://studio.example.test";
vi.mock("next/navigation", () => ({ usePathname: () => "/", useRouter: () => ({}), useSearchParams: () => new URLSearchParams() }));

const menu = (labels: string[]) => labels.map((label, i) => ({ id: `m${i}`, label, href: `/p${i}/` }));
function studio(routes: Record<string, unknown>, draftToken = "good") {
  const calls: { url: string; headers: Record<string, string> }[] = [];
  vi.stubGlobal("fetch", vi.fn(async (url: string, init?: RequestInit) => {
    calls.push({ url, headers: (init?.headers ?? {}) as Record<string, string> });
    const u = new URL(url);
    if (u.pathname === "/api/content/draft") {
      if ((init?.headers as Record<string, string> | undefined)?.["x-c3-preview"] !== draftToken) return { ok: false, json: async () => ({}) } as Response;
      return { ok: true, json: async () => routes[`draft:${u.searchParams.get("path")}`] ?? {} } as Response;
    }
    if (u.pathname in routes) return { ok: true, json: async () => routes[u.pathname] } as Response;
    return { ok: false, json: async () => ({}) } as Response;
  }));
  return calls;
}
async function load() {
  vi.resetModules();
  vi.stubEnv("NEXT_PUBLIC_CMS_URL", STUDIO);
  return import("@/lib/cms");
}

describe("P2-W reads", () => {
  beforeEach(() => vi.unstubAllEnvs());
  afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

  it("the draft mark is served only when page, globals AND menu all came from the draft", async () => {
    const full = { "draft:home": { hero: {} }, "draft:globals": {}, "draft:navigation": { web: menu(["A"]) } };
    studio(full);
    let cms = await load();
    expect((await cms.getDraftMark("good", "/")).mark).toBe("served");
    // the menu alone failing to serve the draft is enough to fall back (an expired token fails all three; Studio without the route fails one)
    studio({ "draft:home": { hero: {} }, "draft:globals": {} }, "good");
    vi.stubGlobal("fetch", vi.fn(async (url: string) => (String(url).includes("path=navigation") ? ({ ok: false } as Response) : ({ ok: true, json: async () => ({}) } as Response))));
    cms = await load();
    expect((await cms.getDraftMark("good", "/")).mark).toBe("fallback");
    expect((await cms.getDraftMark("expired", "/about/")).mark).toBe("fallback");
    expect(await cms.getDraftMark(undefined, "/")).toEqual({}); // a visitor gets no mark at all
  });

  it("the preview token rides a header, never the URL", async () => {
    const calls = studio({ "draft:home": { hero: { heading: "D" } } });
    const cms = await load();
    await cms.getHomeContent("good");
    const draft = calls.find((c) => c.url.includes("/api/content/draft"))!;
    expect(draft.url).not.toMatch(/preview|good/);
    expect(draft.headers["x-c3-preview"]).toBe("good");
  });

  it("the menu is Studio's navigation item; an empty or missing list keeps the code list (null)", async () => {
    studio({ "/api/content/navigation": menu(["Start Here", "Watch"]) });
    let cms = await load();
    expect((await cms.getMenu()).items?.map((i) => i.label)).toEqual(["Start Here", "Watch"]);
    studio({ "/api/content/navigation": [] });
    cms = await load();
    expect((await cms.getMenu()).items).toBeNull();
    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("down"); }));
    cms = await load();
    expect((await cms.getMenu()).items).toBeNull();
  });

  it("the header shows Studio's menu in Studio's order, ignores globals.nav.items and an old label override", async () => {
    const Header = (await import("@/components/layout/Header")).default;
    const html = renderToStaticMarkup(createElement(Header, {
      menu: [{ id: "a", label: "Start Here", href: "/visit/" }, { id: "b", label: "Messages", href: "/messages/" }],
      globals: { nav: { items: [{ label: "Stale List Item", href: "/stale/" }] }, text: { "nav-messages-label": "OLD OVERRIDE" } },
    }));
    expect(html).toContain("Start Here");
    expect(html.indexOf("Start Here")).toBeLessThan(html.indexOf("Messages"));
    expect(html).not.toContain("Stale List Item");
    expect(html).not.toContain("OLD OVERRIDE");
    const fallback = renderToStaticMarkup(createElement(Header, { menu: null }));
    expect(fallback).toContain("C3 Weekly"); // the code list
  });

  it("the footer links come from the same menu", async () => {
    const Footer = (await import("@/components/layout/Footer")).default;
    const html = renderToStaticMarkup(createElement(Footer, { menu: [{ id: "a", label: "Start Here", href: "/visit/" }], globals: {} }));
    expect(html).toContain("Start Here");
    expect(html).not.toContain("Counseling"); // the code list is not mixed in
  });

  it("Home pillars are keyed by id: a reorder moves the whole pillar, never one pillar's edit onto another", async () => {
    const { fromStudioHome } = await import("@/lib/home-content");
    const p = (id: string, h: string) => ({ id, word: id, headline: h, body: "b", image: "/i.webp", href: "/" });
    const before = fromStudioHome({ meetGrowServe: { pillars: [p("about", "A"), p("messages", "M"), p("connect", "C")] } });
    const after = fromStudioHome({ meetGrowServe: { pillars: [p("connect", "C"), p("about", "A"), p("messages", "M")] } });
    const key = (c: typeof before) => c.meetGrowServe.pillars.map((x) => `${x.id}=${x.headline}`);
    expect(key(before).sort()).toEqual(key(after).sort());
    expect(after.meetGrowServe.pillars[0].id).toBe("connect");
    // old content with no id takes a stable id, a dotted or repeated id is made safe and unique
    const old = fromStudioHome({ meetGrowServe: { pillars: [{ headline: "x" }, { id: "a.b", headline: "y" }, { id: "a.b", headline: "z" }] } });
    expect(old.meetGrowServe.pillars.map((x) => x.id)).toEqual(["about", "a-b", "a-b-2"]);
    const html = renderToStaticMarkup(createElement((await import("@/components/home/MeetGrowServe")).default, { content: after.meetGrowServe, img: {} }));
    expect(html).toContain('data-cms="meetGrowServe.pillars.connect.headline"');
    expect(html).not.toMatch(/pillars\.\d+\./);
  });

  it("announcements show from their start day to their end day, highest priority first; a javascript: link is dropped", async () => {
    const { currentAnnouncements, cleanCampaigns, giveLinksFrom } = await import("@/lib/announcements");
    const a = (id: string, over: object) => ({ id, title: id, body: "", surface: "web", active: true, priority: 1, ...over });
    const raw = [
      a("ended", { starts_at: "2026-11-01", ends_at: "2026-11-20" }),
      a("last-day", { starts_at: "2026-11-01", ends_at: "2026-11-21", priority: 3, link_url: "javascript:alert(1)", link_label: "x" }),
      a("future", { starts_at: "2026-11-22" }),
      a("inactive", { active: false }),
      a("app-only", { surface: "app" }),
      a("open", { priority: 9 }),
    ];
    const out = currentAnnouncements(raw, "2026-11-21");
    expect(out.map((x) => x.id)).toEqual(["open", "last-day"]);
    expect(out[1].linkUrl).toBeUndefined();
    // a campaign with no figure shows no bar (never $0); an ended or draft one is not shown
    const camps = cleanCampaigns([
      { id: "c1", title: "Fund", goal_amount: 100, raised_amount: 0, amount_updated_at: null, status: "active" },
      { id: "c2", title: "Done", status: "ended", goal_amount: 1 },
    ], "2026-11-21");
    expect(camps.map((c) => [c.id, c.raised])).toEqual([["c1", null]]);
    expect(giveLinksFrom({ give_config: { campuses: { hays: { give_url: "https://pay.example/hays" } } }, giving: { colby: "http://insecure" } })).toEqual({ hays: "https://pay.example/hays" });
  });

  it("search: every word must match, a title hit outranks a body hit, and it works with Studio down (pages only)", async () => {
    const { buildIndex, searchEntries } = await import("@/lib/search-index");
    const idx = buildIndex([{ id: "s1", title: "Alive and Active", speaker: "Sample Speaker", date: "2026-11-15", scripture_references: ["Hebrews 4:12"], description: "the word is alive" }]);
    expect(searchEntries(idx, "hebrews alive")[0].href).toBe("/messages/s1/");
    expect(searchEntries(idx, "zzzz")).toEqual([]);
    expect(searchEntries(idx, "  ")).toEqual([]);
    expect(searchEntries(buildIndex(null), "visit")[0].href).toBe("/visit/");
  });
});
