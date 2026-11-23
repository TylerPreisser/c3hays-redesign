// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { createRoot } from "react-dom/client";
import { act } from "react";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

/** The two client islands against a fake eSpace feed and the Studio list they are handed, per mode. */
const ESPACE = [
  { Title: "Cornhole League", start: "2026-12-07T19:00:00.0000000", end: "2026-12-07T20:30:00.0000000", allDay: false, locCodes: "C3Hays - ", EventStartTime: "7:00 PM", EventEndTime: "8:30 PM", IsHoliday: false },
  { Title: "Marriage Night", start: "2026-12-02T18:30:00.0000000", end: "2026-12-02T20:00:00.0000000", allDay: false, locCodes: "C3Hays - ", EventStartTime: "6:30 PM", EventEndTime: "8:00 PM", IsHoliday: false },
  { Title: "Weekend Services", start: "2026-12-05T17:00:00.0000000", end: "2026-12-05T18:15:00.0000000", allDay: false, locCodes: "C3Hays - ", EventStartTime: "5:00 PM", EventEndTime: "6:15 PM", IsHoliday: false },
];
const STUDIO = [
  { id: "evt_1", title: "Marriage Night", start: "2026-12-03T00:30:00.000Z", allDay: false, location: "C3 Hays" },
  { id: "evt_2", title: "Baptism Sunday", start: "2026-12-06T16:00:00.000Z", allDay: false },
];
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); document.body.innerHTML = ""; vi.resetModules(); });

async function mount(el: (m: { Upcoming: any; Calendar: any }) => React.ReactElement, feed: "ok" | "down") {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-12-01T18:00:00.000Z"));
  vi.stubGlobal("fetch", vi.fn(async () => { if (feed === "down") throw new Error("network"); return { ok: true, json: async () => ESPACE } as Response; }));
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.resetModules();
  const { default: Upcoming } = await import("@/components/events/UpcomingEventsLive");
  const { default: Calendar } = await import("@/components/events/LiveCalendar");
  const host = document.createElement("div");
  document.body.appendChild(host);
  const root = createRoot(host);
  await act(async () => { root.render(el({ Upcoming, Calendar })); });
  await act(async () => { await Promise.resolve(); });
  await act(async () => { await Promise.resolve(); });
  return { host, root };
}
const titles = (host: HTMLElement) => Array.from(host.querySelectorAll("article h3, article [data-cms$='-title']")).map((n) => (n.textContent || "").trim());

describe("Upcoming strip", () => {
  it("espace mode (no Studio list): eSpace's next three, as always", async () => {
    const { host, root } = await mount(({ Upcoming }) => <Upcoming />, "ok");
    expect((host.textContent || "")).toContain("Marriage Night");
    expect(host.textContent).not.toContain("Baptism Sunday");
    await act(async () => root.unmount());
  });
  it("studio mode: merged and ordered, the occasion in both feeds is one card, and the Studio card says the weekday and time", async () => {
    const { host, root } = await mount(({ Upcoming }) => <Upcoming studio={STUDIO} />, "ok");
    const text = host.textContent || "";
    expect((text.match(/Marriage Night/g) || []).length).toBe(1);
    expect(text).toContain("Wednesday, December 2 · 6:30 PM");
    expect(text).toContain("Baptism Sunday");
    expect(text.indexOf("Marriage Night")).toBeLessThan(text.indexOf("Weekend Services"));
    expect(text.indexOf("Weekend Services")).toBeLessThan(text.indexOf("Baptism Sunday")); // Sat 5 Dec 5 PM before Sun 6 Dec 10 AM
    expect(host.querySelectorAll("article").length).toBe(3);
    await act(async () => root.unmount());
  });
  it("studio mode with eSpace down: the Studio events still show", async () => {
    const { host, root } = await mount(({ Upcoming }) => <Upcoming studio={STUDIO} />, "down");
    expect(host.textContent).toContain("Marriage Night");
    expect(host.textContent).toContain("Baptism Sunday");
    await act(async () => root.unmount());
  });
  it("espace mode with eSpace down: today's quiet pointer to the calendar", async () => {
    const { host, root } = await mount(({ Upcoming }) => <Upcoming />, "down");
    expect(host.textContent).toContain("Our calendar did not load.");
    await act(async () => root.unmount());
  });
});

describe("calendar", () => {
  it("studio mode: Studio's events join eSpace's in the month, the twin once", async () => {
    const { host, root } = await mount(({ Calendar }) => <Calendar studio={STUDIO} />, "ok");
    const text = host.textContent || "";
    expect(text).toContain("Baptism Sunday");
    expect((text.match(/Marriage Night/g) || []).length).toBe(1);
    await act(async () => root.unmount());
  });
  it("studio mode with eSpace down: the Studio events show instead of the error card", async () => {
    const { host, root } = await mount(({ Calendar }) => <Calendar studio={STUDIO} />, "down");
    expect(host.textContent).toContain("Baptism Sunday");
    await act(async () => root.unmount());
  });
  it("espace mode with eSpace down: today's error card", async () => {
    const { host, root } = await mount(({ Calendar }) => <Calendar />, "down");
    expect(host.textContent).not.toContain("Baptism Sunday");
    await act(async () => root.unmount());
  });
});
