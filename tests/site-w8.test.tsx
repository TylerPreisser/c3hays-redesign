// @vitest-environment jsdom
process.env.TZ = "America/Chicago";
import { describe, it, expect, vi, afterEach } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

vi.setConfig({ testTimeout: 60_000, hookTimeout: 60_000 });
vi.mock("next/navigation", () => ({ usePathname: () => "/", useRouter: () => ({ replace() {} }), useSearchParams: () => new URLSearchParams("") }));
afterEach(() => { vi.useRealTimers(); vi.resetModules(); });

/** Wave 8 of the public site. Church time is Central; the test machine's own zone is set to it so a wall-clock Date means what the page means. */
async function record(tbc = true) {
  const { SERVICE_TIMES_SNAPSHOT } = await import("@/data/service-times.snapshot");
  const d = JSON.parse(JSON.stringify(SERVICE_TIMES_SNAPSHOT));
  for (const c of d.campuses) for (const s of c.services) for (const x of s.slots) x.tbc = false;
  if (tbc) d.campuses.find((c: any) => c.slug === "hays").services.find((s: any) => s.day === "Saturday").slots[0].tbc = true;
  return d;
}
const row = (y: number, m: number, d: number, h: number) => ({ id: `${y}-${m}-${d}`, title: "Weekend Services", start: new Date(y, m - 1, d, h), end: new Date(y, m - 1, d, h + 1), allDay: false, timeLabel: "", description: "", campus: "Hays", location: "", color: "#000", isHoliday: false });

describe("the Sunday card stays in Upcoming until the last service of the day has started", () => {
  it("at 8:05 and 9:40 it is still there; at 10:50 it is gone; Saturday's card stays until 5:00 PM", async () => {
    const { withStudioWeekendLine } = await import("@/lib/event-merge");
    const { upcomingEvents } = await import("@/lib/espace");
    const { weekendLine, weekendDayLine, lastStartOfWeekday } = await import("@/lib/service-times-core");
    const d = await record();
    const rows = withStudioWeekendLine([row(2026, 11, 28, 17), row(2026, 11, 29, 8)] as never, weekendLine(d), (w) => weekendDayLine(d, w), (w) => lastStartOfWeekday(d, w));
    const at = (h: number, m: number, day = 29) => { vi.useFakeTimers({ toFake: ["Date"] }); vi.setSystemTime(new Date(2026, 10, day, h, m)); return upcomingEvents(rows, 3).map((e) => e.start.getDate()); };
    expect(at(8, 5)).toEqual([29]);
    expect(at(9, 40)).toEqual([29]);
    expect(at(10, 44)).toEqual([29]);
    expect(at(10, 50)).toEqual([]);
    expect(at(16, 0, 28)).toEqual([28, 29]);
    expect(at(17, 5, 28)).toEqual([29]);
  });
});

describe("the call line sits under the times on /locations/ and /connect/, and the footer then keeps quiet", () => {
  it("both pages render it from the record; confirmed times leave none", async () => {
    const { ServiceTimesProvider } = await import("@/providers/ServiceTimesProvider");
    const { default: Connect } = await import("@/app/connect/ConnectClient");
    const wrap = async (tbc: boolean) => renderToStaticMarkup(createElement(ServiceTimesProvider as never, { value: await record(tbc) } as never, createElement(Connect as never, { text: {}, media: {}, img: {} } as never)));
    expect(await wrap(true)).toContain("to check before you come");
    expect(await wrap(false)).not.toContain("to check before you come");
    const fs = await import("node:fs");
    const loc = fs.readFileSync(`${__dirname}/../src/app/locations/page.tsx`, "utf8");
    expect(loc).toContain("<TimesCheckNote");
    const layout = fs.readFileSync(`${__dirname}/../src/app/layout.tsx`, "utf8");
    expect(layout).toMatch(/PAGES_WITH_OWN_TIMES_NOTE = new Set\([^)]*"\/locations"[^)]*"\/connect"/);
  });
});

describe("a card with no link of its own says what the button does", () => {
  it("'Open the church calendar'; an event with a registration link keeps 'Event details'", async () => {
    const { default: Grid } = await import("@/components/events/UpcomingEventsGrid");
    const ev = (id: string, url?: string) => ({ ...row(2026, 12, 1, 19), id, title: "Cornhole League", registerUrl: url });
    const plain = renderToStaticMarkup(createElement(Grid as never, { events: [ev("a")] } as never));
    expect(plain).toContain("Open the church calendar");
    expect(plain).not.toContain("Event details");
    const reg = renderToStaticMarkup(createElement(Grid as never, { events: [ev("b", "https://example.org/register")] } as never));
    expect(reg).toContain("Event details");
  });
});
