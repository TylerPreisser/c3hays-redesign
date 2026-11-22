// @vitest-environment node
import { describe, it, expect, vi, afterEach } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// These render whole pages and the root layout (a cold import of every component): allow for a loaded machine.
vi.setConfig({ testTimeout: 60_000 });

vi.mock("next/navigation", () => ({ usePathname: () => "/", useRouter: () => ({}), useSearchParams: () => new URLSearchParams() }));
vi.mock("next/font/google", () => ({ Hanken_Grotesk: () => ({ variable: "font-x", className: "font-x" }) }));

/** Studio's published announcements, as the public feed serves them (seed shape): an always-on one and a dated one. */
const day = (n: number) => new Date(Date.now() + n * 86400000).toISOString().slice(0, 10);
const ANNOUNCEMENTS = [
  { id: "ann_2", title: "App is live", body: "Download the C3 app.", link_label: "Get the app", link_url: "https://example.org/app", surface: "web", priority: 2, active: true, starts_at: null, ends_at: null, created_at: "2026-07-24T00:00:00.000Z" },
  { id: "ann_1", title: "Marriage Night", body: "Wed 2 Dec · 6:30 pm", link_label: "Sign up", link_url: "/events/", surface: "web", priority: 1, active: true, starts_at: day(-1), ends_at: day(10), created_at: "2026-11-21T12:00:00.000Z" },
  { id: "ann_old", title: "Last month", body: "", surface: "web", priority: 9, active: true, starts_at: day(-30), ends_at: day(-20), created_at: "2026-10-01T00:00:00.000Z" },
];
const locations = JSON.parse(readFileSync(join(__dirname, "fixtures/studio-locations.json"), "utf8")).locations;

function studio() {
  vi.stubGlobal("fetch", vi.fn(async (url: string) => {
    const p = new URL(url).pathname;
    const body: Record<string, unknown> = {
      "/api/content/announcements": ANNOUNCEMENTS,
      "/api/content/locations": locations,
      "/api/content/navigation": [{ id: "m1", label: "Start Here", href: "/visit/" }],
    };
    return { ok: p in body, json: async () => body[p] ?? {} } as Response;
  }));
  vi.stubEnv("NEXT_PUBLIC_CMS_URL", "https://studio.example.test");
}
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); vi.resetModules(); });

describe("announcements on every page, Home included", () => {
  it("the root layout a visitor gets carries every announcement that is on, the one that started first leading, none that ended", async () => {
    studio();
    vi.resetModules();
    const Layout = (await import("@/app/layout")).default;
    const html = renderToStaticMarkup(await Layout({ children: createElement("main", null, "home") }));
    expect(html).toContain("Marriage Night");
    expect(html).toContain("App is live");
    expect(html).not.toContain("Last month");
    // a notice's priority number does not rank it: the always-on one (priority 2) does not hide the dated one
    expect(html.indexOf("App is live")).toBeLessThan(html.indexOf("Marriage Night"));
    expect(html).toContain('data-cms-pick="announcement:ann_1"');
    expect(html).toContain('data-cms-pick="announcement:ann_2"');
    expect(html).toContain('data-cms-pick="nav:menu"');
  });
  it("order: started first, then newest; an ended or future one is never shown", async () => {
    const { currentAnnouncements } = await import("@/lib/announcements");
    const mk = (id: string, o: object) => ({ id, title: id, body: "", surface: "web", active: true, ...o });
    const out = currentAnnouncements([
      mk("new", { starts_at: "2026-11-01", created_at: "2026-11-02" }),
      mk("old", { starts_at: "2026-10-01", created_at: "2026-10-01" }),
      mk("tie-newer", { starts_at: "2026-11-01", created_at: "2026-11-05" }),
      mk("future", { starts_at: "2026-12-01" }),
      mk("ended", { starts_at: "2026-09-01", ends_at: "2026-11-10" }),
    ], "2026-11-21");
    expect(out.map((a) => a.id)).toEqual(["old", "tie-newer", "new"]);
  });
});

describe("service-time lines are facts, not text", () => {
  it("the Home campus line renders from the campus record and is a select-only marker", async () => {
    studio();
    vi.resetModules();
    const { default: LocationsSection } = await import("@/components/home/LocationsSection");
    const { ServiceTimesProvider } = await import("@/providers/ServiceTimesProvider");
    const { resolveTimes } = await import("@/lib/service-times-core");
    const { SERVICE_TIMES_SNAPSHOT } = await import("@/data/service-times.snapshot");
    const times = resolveTimes(locations, SERVICE_TIMES_SNAPSHOT);
    const html = renderToStaticMarkup(createElement(ServiceTimesProvider as never, { value: times } as never, createElement(LocationsSection as never, { text: { "campus-hays-info": "Sunday 11:00 PM typed by hand" }, btn: {} } as never)));
    expect(html).toContain('data-cms-pick="t:campus-hays-info"');
    expect(html).not.toContain('data-cms="t:campus-hays-info"');
    expect(html).not.toContain("typed by hand");
    expect(html).toMatch(/Sunday[^<]*9:00 AM/);
  });
});

describe("campus pages are named sections", () => {
  async function page(slug: "hays" | "colby") {
    studio();
    vi.resetModules();
    const mod = await import(slug === "hays" ? "@/app/locations/hays/page" : "@/app/locations/colby/page");
    return renderToStaticMarkup(await (mod.default as (p: object) => Promise<React.ReactElement>)({}));
  }
  it.each([
    ["hays", ["hays-hero", "hays-details", "hays-team"]],
    ["colby", ["colby-hero", "colby-details", "colby-team", "colby-visit"]],
  ] as const)("%s has its sections with plain names", async (slug, ids) => {
    const html = await page(slug);
    const found = [...html.matchAll(/data-section="([^"]+)" data-section-name="([^"]+)"/g)].map((m) => m[1]);
    expect(found).toEqual(ids);
    expect(html).toContain('data-section-name="Meet the team"');
    expect(html).not.toMatch(/data-section-name="(Body|Hero|Ondemand)"/);
  });
  it("every section the site draws has a plain name: no code words", async () => {
    const { SECTION_NAMES, sectionName } = await import("@/lib/section-names");
    for (const [id, name] of Object.entries(SECTION_NAMES)) {
      expect(name, id).toMatch(/^[A-Z][A-Za-z ,.']+$/);
      expect(name, id).not.toMatch(/[a-z][A-Z]/);
    }
    expect(sectionName("watch-ondemand")).toBe("Past services");
    expect(sectionName("someNewThing")).toBe("Some new thing");
  });
});

describe("an unconfirmed service time says so wherever times are listed", () => {
  const withTbc = (on: boolean) => {
    const recs = JSON.parse(JSON.stringify(locations));
    const sat = recs.find((l: any) => l.slug === "hays").services[0].slots[0];
    if (on) sat.tbc = true;
    return recs;
  };
  async function places(recs: unknown[]) {
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_CMS_URL", "https://studio.example.test");
    const { resolveTimes } = await import("@/lib/service-times-core");
    const { SERVICE_TIMES_SNAPSHOT } = await import("@/data/service-times.snapshot");
    const times = resolveTimes(recs, SERVICE_TIMES_SNAPSHOT);
    const { ServiceTimesProvider } = await import("@/providers/ServiceTimesProvider");
    const wrap = (el: React.ReactElement) => renderToStaticMarkup(createElement(ServiceTimesProvider as never, { value: times } as never, el));
    const home = wrap(createElement((await import("@/components/home/LocationsSection")).default as never, { text: {}, btn: {} } as never));
    const footer = wrap(createElement((await import("@/components/layout/Footer")).default as never, { globals: {} } as never));
    const visit = wrap(createElement((await import("@/components/visit/JoinPanel")).default as never, { t: {}, text: {}, media: {}, img: {}, btn: {} } as never));
    vi.stubGlobal("fetch", vi.fn(async (url: string) => ({ ok: true, json: async () => (String(url).endsWith("/api/content/locations") ? recs : {}) }) as Response));
    vi.resetModules();
    const hays = renderToStaticMarkup(await ((await import("@/app/locations/hays/page")).default as (p: object) => Promise<React.ReactElement>)({}));
    return { home, footer, visit, hays };
  }
  it("a campus with one unconfirmed slot shows the note on Home, the campus page, the footer and Plan a Visit", async () => {
    const p = await places(withTbc(true));
    for (const [name, html] of Object.entries(p)) expect(html, name).toContain("5:00 PM (time to be confirmed)");
  });
  it("confirmed, and a record without the field, show no note", async () => {
    const p = await places(withTbc(false));
    for (const [name, html] of Object.entries(p)) { expect(html, name).not.toContain("to be confirmed"); expect(html, name).toContain("5:00 PM"); }
  });
});
