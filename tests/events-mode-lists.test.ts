// @vitest-environment node
import { describe, it, expect, vi, afterEach } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

vi.setConfig({ testTimeout: 120_000 });
vi.mock("next/navigation", () => ({ usePathname: () => "/events", useRouter: () => ({}), useSearchParams: () => new URLSearchParams() }));
vi.mock("next/font/google", () => ({ Hanken_Grotesk: () => ({ variable: "font-x", className: "font-x" }) }));

/** The mode setting and the two reads the /events page makes in `studio` mode, against a fake Studio. */
const EVENT = { id: "evt_1", title: "Marriage Night", start_date: "2026-12-03T00:30:00.000Z", end_date: null, all_day: false, status: "scheduled" };
function studio(routes: Record<string, unknown> | "down") {
  vi.stubEnv("NEXT_PUBLIC_CMS_URL", "https://studio.example.test");
  vi.stubGlobal("fetch", vi.fn(async (url: string) => {
    if (routes === "down") throw new Error("network");
    const p = new URL(url).pathname;
    return { ok: p in routes, json: async () => routes[p] ?? {} } as Response;
  }));
}
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); vi.resetModules(); });

describe("the events mode", () => {
  it.each([[undefined, "espace"], ["espace", "espace"], ["studio", "studio"], ["STUDIO", "espace"], [true, "espace"], [null, "espace"], ["", "espace"]])("events_on_website %j is %s", async (v, want) => {
    studio({ "/api/content/site": v === undefined ? {} : { events_on_website: v } });
    const { getEventsMode } = await import("@/lib/studio-events");
    expect(await getEventsMode()).toBe(want);
  });
  it("Studio not answering, or answering with something else, is espace (fail closed)", async () => {
    const { getEventsMode } = await import("@/lib/studio-events");
    studio("down");
    expect(await getEventsMode()).toBe("espace");
    studio({});
    expect(await getEventsMode()).toBe("espace");
    studio({ "/api/content/site": "<html>login</html>" });
    expect(await getEventsMode()).toBe("espace");
  });
});

describe("the two reads in studio mode", () => {
  it("the full list for the calendar, the church-day list for the Upcoming strip", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-12-03T01:00:00.000Z")); // Wed 2 Dec 7:00 PM in Hays, after the event started
    studio({ "/api/content/events": [EVENT, { ...EVENT, id: "evt_old", start_date: "2026-11-01T18:00:00.000Z" }] });
    const { getStudioEventLists } = await import("@/lib/studio-events");
    const lists = await getStudioEventLists();
    expect(lists.all.map((e) => e.id)).toEqual(["evt_old", "evt_1"]); // no past filter
    expect(lists.upcoming.map((e) => e.id)).toEqual(["evt_1"]); // still Wed 2 Dec at the church
    vi.useRealTimers();
  });
  it("Studio answering nothing gives empty lists, never a failure", async () => {
    studio("down");
    const { getStudioEventLists } = await import("@/lib/studio-events");
    expect(await getStudioEventLists()).toEqual({ all: [], upcoming: [] });
  });
  it("a cancelled or malformed record is skipped", async () => {
    studio({ "/api/content/events": [{ ...EVENT, status: "cancelled" }, { id: 5 }, null, "x", { ...EVENT, id: "evt_2", start_date: "soon" }, EVENT] });
    const { allStudioEvents } = await import("@/lib/studio-events");
    const { getStudioEventLists } = await import("@/lib/studio-events");
    expect((await getStudioEventLists()).all.map((e) => e.id)).toEqual(["evt_1"]);
    expect(allStudioEvents("nope")).toEqual([]);
  });
});

describe("/events renders in both modes, whatever Studio says", () => {
  async function page() {
    vi.resetModules();
    const mod = await import("@/app/events/page");
    return renderToStaticMarkup(await (mod.default as (p: object) => Promise<React.ReactElement>)({}));
  }
  it("studio mode with Studio published events: the page renders its sections", async () => {
    studio({ "/api/content/site": { events_on_website: "studio" }, "/api/content/events": [EVENT] });
    const html = await page();
    expect(html).toContain("Upcoming Events");
    expect(html).toContain("The C3 calendar");
  });
  it("studio mode with Studio down after the setting was read: still renders", async () => {
    let n = 0;
    vi.stubEnv("NEXT_PUBLIC_CMS_URL", "https://studio.example.test");
    vi.stubGlobal("fetch", vi.fn(async (url: string) => {
      n++;
      const p = new URL(url).pathname;
      if (p === "/api/content/site") return { ok: true, json: async () => ({ events_on_website: "studio" }) } as Response;
      throw new Error("network");
    }));
    const html = await page();
    expect(html).toContain("Upcoming Events");
    expect(n).toBeGreaterThan(0);
  });
});
