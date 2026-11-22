// @vitest-environment node
import { describe, it, expect, vi, afterEach } from "vitest";

/**
 * Every day and time goes through the church's zone, whatever zone the process is in (check 13 of the event-reach design).
 */
const ORIGINAL_TZ = process.env.TZ;
afterEach(() => { vi.useRealTimers(); if (ORIGINAL_TZ === undefined) delete process.env.TZ; else process.env.TZ = ORIGINAL_TZ; vi.resetModules(); });

const ev = (o: Record<string, unknown>) => ({ id: "evt_1", title: "Marriage Night", start_date: "2026-11-26T00:30:00.000Z", end_date: null, all_day: false, status: "scheduled", ...o });

describe.each(["UTC", "Asia/Tokyo"])("with the process in %s", (zone) => {
  it("00:30 UTC on 26 Nov is Wednesday 25 Nov, 6:30 PM at the church", async () => {
    process.env.TZ = zone;
    vi.resetModules();
    const { allStudioEvents } = await import("@/lib/studio-events");
    const { studioToCalEvent } = await import("@/lib/event-merge");
    const c = studioToCalEvent(allStudioEvents([ev({})])[0]);
    expect(c.whenLabel).toBe("Wednesday, November 25 · 6:30 PM");
    expect(c.timeLabel).toBe("6:30 PM");
    expect([c.start.getFullYear(), c.start.getMonth(), c.start.getDate(), c.start.getHours(), c.start.getMinutes()]).toEqual([2026, 10, 25, 18, 30]);
  });

  it("an all-day event stays listed through the evening of its day at the church, and goes the next morning", async () => {
    process.env.TZ = zone;
    vi.resetModules();
    const { upcomingStudioEvents } = await import("@/lib/studio-events");
    const { churchToday } = await import("@/lib/church-time");
    const raw = [ev({ id: "evt_allday", title: "Community Meal", start_date: "2026-12-05", end_date: null, all_day: true })];
    // 7:00 PM in Hays on 5 Dec is 01:00 UTC on 6 Dec
    expect(churchToday(new Date("2026-12-06T01:00:00.000Z"))).toBe("2026-12-05");
    expect(upcomingStudioEvents(raw, churchToday(new Date("2026-12-06T01:00:00.000Z"))).map((e) => e.id)).toEqual(["evt_allday"]);
    expect(upcomingStudioEvents(raw, churchToday(new Date("2026-12-06T06:00:00.000Z"))).map((e) => e.id)).toEqual([]); // 00:00 on the 6th at the church
  });

  it("a timed event is kept through its church day, even after it has started, and dropped the next day", async () => {
    process.env.TZ = zone;
    vi.resetModules();
    const { upcomingStudioEvents } = await import("@/lib/studio-events");
    const raw = [ev({})]; // Wed 25 Nov 18:30
    expect(upcomingStudioEvents(raw, "2026-11-25").map((e) => e.id)).toEqual(["evt_1"]);
    expect(upcomingStudioEvents(raw, "2026-11-26")).toEqual([]);
  });

  it("the full list has no limit and no past filter: the 13th event is in the list", async () => {
    process.env.TZ = zone;
    vi.resetModules();
    const { allStudioEvents, upcomingStudioEvents } = await import("@/lib/studio-events");
    const raw = Array.from({ length: 13 }, (_, i) => ev({ id: `evt_${i + 1}`, title: `Gathering ${i + 1}`, start_date: `2026-12-${String(i + 2).padStart(2, "0")}T18:00:00.000Z` }));
    expect(allStudioEvents(raw)).toHaveLength(13);
    expect(upcomingStudioEvents(raw, "2026-11-01")).toHaveLength(12); // the Upcoming strip keeps its limit
    expect(allStudioEvents([...raw, ev({ id: "evt_past", start_date: "2020-01-01T18:00:00.000Z" })])).toHaveLength(14);
  });
});
