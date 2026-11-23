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

const fixture = JSON.parse(readFileSync(join(__dirname, "fixtures/studio-locations.json"), "utf8")).locations as any[];
const clone = () => JSON.parse(JSON.stringify(fixture)) as any[];

function studio(opts: { locations?: any[]; announcements?: any[] } = {}) {
  vi.stubGlobal("fetch", vi.fn(async (url: string) => {
    const p = new URL(url).pathname;
    const body: Record<string, unknown> = {
      "/api/content/locations": opts.locations ?? fixture,
      "/api/content/announcements": opts.announcements ?? [],
      "/api/content/navigation": [{ id: "m1", label: "Start Here", href: "/visit/" }],
    };
    return { ok: p in body, json: async () => body[p] ?? {} } as Response;
  }));
  vi.stubEnv("NEXT_PUBLIC_CMS_URL", "https://studio.example.test");
}
async function pageHtml(path: "hays" | "colby", edit = false) {
  vi.resetModules();
  if (edit) vi.stubEnv("CMS_LIVE", "1"); // the editor's canvas carries ?preview=<token>; a visitor's request carries none
  const mod = await import(path === "hays" ? "@/app/locations/hays/page" : "@/app/locations/colby/page");
  return renderToStaticMarkup(await (mod.default as (p: object) => Promise<React.ReactElement>)(edit ? { searchParams: Promise.resolve({ preview: "tok" }) } : {}));
}
async function layoutHtml() {
  vi.resetModules();
  const Layout = (await import("@/app/layout")).default;
  return renderToStaticMarkup(await Layout({ children: createElement("main", null, "home") }));
}
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

/* ── W7 ─────────────────────────────────────────────────────────────────── */
describe("W7 the announcement's date line", () => {
  const ann = (o: object) => ({ id: "ann_1", title: "Baptism Sunday", body: "Come and see.", surface: "web", priority: 1, active: true, starts_at: "2000-01-01", ends_at: "2999-01-01", created_at: "2026-11-21T00:00:00Z", ...o });
  it("the eyebrow is drawn before the heading, so a screen reader meets it first", async () => {
    studio({ announcements: [ann({ eyebrow: "Wed 2 Dec" })] });
    const html = await layoutHtml();
    const bar = html.slice(html.indexOf("data-announcement"), html.indexOf("data-announcement") + 1500);
    expect(bar).toContain("Wed 2 Dec");
    expect(bar.indexOf("Wed 2 Dec")).toBeLessThan(bar.indexOf("Baptism Sunday"));
  });
  it("with start and end dates and no eyebrow nothing is invented", async () => {
    studio({ announcements: [ann({ eyebrow: undefined, starts_at: "2026-11-01", ends_at: "2999-12-02" })] });
    const html = await layoutHtml();
    const bar = html.slice(html.indexOf("data-announcement"), html.indexOf("data-announcement") + 1500);
    expect(bar).toContain("Baptism Sunday");
    expect(bar).not.toMatch(/Dec|2026-12|2999/);
    expect(bar).not.toContain("data-announcement-eyebrow");
  });
  it("an eyebrow is plain trimmed text, capped", async () => {
    const { currentAnnouncements } = await import("@/lib/announcements");
    const out = currentAnnouncements([ann({ eyebrow: "  <b>Wed</b> 2 Dec " + "x".repeat(200) })], "2026-11-22");
    expect(out[0].eyebrow!.length).toBeLessThanOrEqual(60);
    expect(out[0].eyebrow).not.toContain("<");
  });
});

/* ── W8 ─────────────────────────────────────────────────────────────────── */
describe("W8 a text that holds a time is never free-editable", () => {
  it("Hays: the times card and the paragraphs that spell the times are picks that open the times sheet", async () => {
    studio();
    expect(await pageHtml("hays")).not.toContain("data-cms-pick"); // a visitor's HTML carries no marker
    const html = await pageHtml("hays", true);
    expect(html).toContain('data-cms-pick="fact:service_times:hays"');
    for (const k of ["t:hays-details-body-1", "t:hays-details-body-2"]) expect(html).not.toContain(`data-cms="${k}"`);
    expect((html.match(/data-cms-pick="fact:service_times:hays"/g) || []).length).toBeGreaterThanOrEqual(3); // card + two paragraphs
  });
  it("Colby: the same for the card, the hero line, the details paragraph and the closing paragraph; plain prose stays editable", async () => {
    studio();
    expect(await pageHtml("colby")).not.toContain("data-cms-pick");
    const html = await pageHtml("colby", true);
    expect(html).toContain('data-cms-pick="fact:service_times:colby"');
    for (const k of ["t:colby-hero-tagline", "t:colby-details-body-1", "t:colby-cta-body"]) expect(html).not.toContain(`data-cms="${k}"`);
    expect(html).toContain('data-cms="t:colby-details-body-2"'); // "We'd love to see you this Sunday." holds no time
  });
  it("the events calendar is a pick that opens the events sheet, only on the editor's canvas", async () => {
    const { default: Calendar } = await import("@/components/events/LiveCalendar");
    const { EditModeProvider } = await import("@/providers/EditModeProvider");
    expect(renderToStaticMarkup(createElement(Calendar))).not.toContain("data-cms-pick");
    expect(renderToStaticMarkup(createElement(EditModeProvider as never, { edit: true } as never, createElement(Calendar)))).toContain('data-cms-pick="fact:events"');
  });
});

/* ── W9 ─────────────────────────────────────────────────────────────────── */
describe("W9 an empty day is dropped, not the whole record", () => {
  it("one empty day goes; the other days of the campus stay", async () => {
    const { normalizeCampus } = await import("@/lib/service-times-core");
    const c = normalizeCampus({ slug: "hays", name: "Hays", services: [{ day: "Saturday", times: [], slots: [] }, { day: "Sunday", slots: [{ time: "9:00 AM", room: null, kids: false }] }] });
    expect(c?.services.map((s) => s.day)).toEqual(["Sunday"]);
  });
  it("a tbc slot is kept and marked", async () => {
    const { normalizeCampus, anyUnconfirmed } = await import("@/lib/service-times-core");
    const c = normalizeCampus({ slug: "hays", name: "Hays", services: [{ day: "Saturday", slots: [{ time: "5:00 PM", room: null, kids: false, tbc: true }] }, { day: "Sunday", slots: [] }] });
    expect(c?.services).toHaveLength(1);
    expect(c?.services[0].slots[0].tbc).toBe(true);
    expect(anyUnconfirmed({ campuses: [c!] })).toBe(true);
  });
  it("a campus with no days left is a valid record with no days (not null)", async () => {
    const { normalizeCampus } = await import("@/lib/service-times-core");
    expect(normalizeCampus({ slug: "hays", name: "Hays", services: [{ day: "Saturday", slots: [] }, { day: "Sunday" }] })?.services).toEqual([]);
    expect(normalizeCampus({ slug: "hays", name: "Hays", services: [] })?.services).toEqual([]);
  });
  it("a real fault (a time that is not a time) still falls back to the built-in record", async () => {
    const { normalizeCampus } = await import("@/lib/service-times-core");
    expect(normalizeCampus({ slug: "hays", name: "Hays", services: [{ day: "Sunday", slots: [{ time: "soon" }] }] })).toBeNull();
  });
  it.each(["hays", "colby"] as const)("%s page with every day empty says the times are to be announced, never blank and never the built-in times", async (slug) => {
    const locs = clone();
    for (const l of locs) if (l.slug === slug) l.services = l.services.map((s: any) => ({ day: s.day, times: [], slots: [] }));
    studio({ locations: locs });
    const html = await pageHtml(slug);
    expect(html).toContain("Times to be announced");
    expect(html).not.toMatch(/\d{1,2}:\d{2} [AP]M/);
  });
  it("the Hays page with one empty day shows the other day and not the built-in Saturday", async () => {
    const locs = clone();
    const h = locs.find((l) => l.slug === "hays");
    h.services = h.services.map((s: any) => (s.day === "Saturday" ? { day: "Saturday", times: [], slots: [] } : s));
    studio({ locations: locs });
    const html = await pageHtml("hays");
    expect(html).toContain("8:00 AM");
    expect(html).not.toContain("5:00 PM");
  });
});
