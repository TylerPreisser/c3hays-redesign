// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { createRoot } from "react-dom/client";
import { act, createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
vi.setConfig({ testTimeout: 60_000, hookTimeout: 60_000 });
vi.mock("next/navigation", () => ({ usePathname: () => "/", useRouter: () => ({ replace() {} }), useSearchParams: () => new URLSearchParams("") }));
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); document.body.innerHTML = ""; document.documentElement.removeAttribute("data-cal-failed"); vi.resetModules(); });

/** Wave 6 of the public site, from the record (the repo's snapshot of Studio's times) and the church's real eSpace row shape. */
async function snapshot() {
  const { SERVICE_TIMES_SNAPSHOT } = await import("@/data/service-times.snapshot");
  return JSON.parse(JSON.stringify(SERVICE_TIMES_SNAPSHOT));
}
const row = (iso: string) => ({ id: iso, title: "Weekend Services", start: new Date(iso), end: new Date(iso), allDay: false, timeLabel: "8:00 AM – 12:30 PM", description: "", campus: "Hays", location: "", color: "#000", isHoliday: false });

describe("the weekend line gives Saturday as a time, one row per campus", () => {
  it("Hays leads with Saturday, names C3Kids once; Colby is its own row; the campus panel leads with Sunday", async () => {
    const { weekendRows, weekendRow, campus } = await import("@/lib/service-times-core");
    const d = await snapshot();
    const rows = weekendRows(d);
    expect(rows[0]).toEqual({ name: "Hays", text: "Sat 5:00 PM · Sun 8:00 AM (C3 Gym), 9:00 AM, 10:45 AM · C3Kids at 9:00 AM and 10:45 AM" });
    expect(rows[1]).toEqual({ name: "Colby", text: "Sun 10:00 AM" });
    expect(weekendRow(campus(d, "hays"), true).startsWith("Sun 8:00 AM")).toBe(true);
    expect(weekendRow(campus(d, "hays"), true).endsWith("Sat 5:00 PM")).toBe(true);
  });
  it("the home block reads 'This weekend' with both rows and the Saturday time outside the call line", async () => {
    const { ServiceTimesProvider } = await import("@/providers/ServiceTimesProvider");
    const { default: Line } = await import("@/components/home/ThisSundayLine");
    const html = renderToStaticMarkup(createElement(ServiceTimesProvider as never, { value: await snapshot() } as never, createElement(Line as never)));
    expect(html).toContain("This weekend");
    expect(html).toMatch(/Hays<\/strong> · Sat 5:00 PM/);
    expect(html).toMatch(/Colby<\/strong> · Sun 10:00 AM/);
  });
});

describe("/events/ Sunday card is whole, for both campuses, with no calendar entry for the wrong block", () => {
  it("the Sunday row is tagged Hays + Colby and flagged; the Saturday row stays Hays", async () => {
    const { withStudioWeekendLine } = await import("@/lib/event-merge");
    const { weekendLine, weekendDayLine } = await import("@/lib/service-times-core");
    const d = await snapshot();
    const [sat, sun] = withStudioWeekendLine([row("2026-12-05T23:00:00.000Z"), row("2026-12-06T14:00:00.000Z")] as never, weekendLine(d), (w) => weekendDayLine(d, w));
    expect(sun.campusTag).toBe("Hays + Colby");
    expect(sat.campusTag).toBeUndefined();
    expect(sun.isWeekend && sat.isWeekend).toBe(true);
  });
  it("its card text is not clamped and has no Add to calendar; another event keeps both", async () => {
    const { default: Grid } = await import("@/components/events/UpcomingEventsGrid");
    const { withStudioWeekendLine } = await import("@/lib/event-merge");
    const { weekendLine, weekendDayLine } = await import("@/lib/service-times-core");
    const d = await snapshot();
    const [sun] = withStudioWeekendLine([row("2026-12-06T14:00:00.000Z")] as never, weekendLine(d), (w) => weekendDayLine(d, w));
    const other = { ...row("2026-12-07T01:00:00.000Z"), id: "cornhole", title: "Cornhole League" };
    const week = renderToStaticMarkup(createElement(Grid as never, { events: [sun] } as never));
    expect(week).toContain("Colby 10:00 AM");
    expect(week).toContain("Hays + Colby");
    const clamps = (h: string) => h.split("-webkit-line-clamp").length - 1;
    expect(clamps(week)).toBe(1); // the title only; the text is whole
    expect(week).not.toContain("Add to calendar");
    const ev = renderToStaticMarkup(createElement(Grid as never, { events: [other] } as never));
    expect(ev).toContain("Add to calendar");
    expect(clamps(ev)).toBe(2);
  });
});

describe("a failed calendar shows it is trying, and stops promising a calendar below", () => {
  it("Try again goes busy for at least 600 ms, then reports; the lead under the heading is hidden by the flag", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("network"); }));
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.resetModules();
    const Upcoming = (await import("@/components/events/UpcomingEventsLive")).default;
    const Calendar = (await import("@/components/events/LiveCalendar")).default;
    const host = document.createElement("div");
    document.body.appendChild(host);
    const root = createRoot(host);
    await act(async () => { root.render(createElement("div", null, createElement(Upcoming), createElement(Calendar))); });
    await act(async () => { await Promise.resolve(); });
    await act(async () => { await Promise.resolve(); });
    expect(document.documentElement.hasAttribute("data-cal-failed")).toBe(true);
    const btn = () => host.querySelector("button.btn-outline") as HTMLButtonElement;
    expect(btn().textContent).toBe("Try again");
    await act(async () => { btn().click(); });
    await act(async () => { await Promise.resolve(); });
    expect(btn().textContent).toBe("Trying…");
    expect(btn().disabled).toBe(true);
    expect(btn().getAttribute("aria-busy")).toBe("true");
    await act(async () => { await new Promise((r) => setTimeout(r, 300)); });
    expect(btn().textContent).toBe("Trying…"); // still busy before 600 ms
    await act(async () => { await new Promise((r) => setTimeout(r, 500)); });
    expect(btn().textContent).toBe("Try again");
    expect(host.textContent).toContain("Still can’t reach our calendar");
    await act(async () => root.unmount());
  });
});
