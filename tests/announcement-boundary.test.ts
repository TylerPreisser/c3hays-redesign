// @vitest-environment node
import { describe, it, expect, vi, afterEach } from "vitest";

/**
 * An announcement shows from the START of its start day through the END of its end day in the church's zone
 * (America/Chicago), whatever instant the stored timestamps carry. Studio stores the end of a 12 Dec announcement as
 * 2026-12-13T05:59:00.000Z (23:59 Central), so the date part of the UTC string is NOT the church's day.
 */
const ENDS = "2026-12-13T05:59:00.000Z"; // 12 Dec 23:59 Central
const STARTS = "2026-12-01T06:00:00.000Z"; // 1 Dec 00:00 Central
const ann = (o: object) => ({ id: "a1", title: "Baptism Sunday", body: "", surface: "web", priority: 1, active: true, starts_at: STARTS, ends_at: ENDS, created_at: "2026-11-21T00:00:00Z", ...o });

const ORIGINAL_TZ = process.env.TZ;
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); vi.unstubAllEnvs(); if (ORIGINAL_TZ === undefined) delete process.env.TZ; else process.env.TZ = ORIGINAL_TZ; vi.resetModules(); });

async function shownAt(instant: string, records: unknown[], zone: string) {
  process.env.TZ = zone;
  vi.useFakeTimers();
  vi.setSystemTime(new Date(instant));
  vi.stubEnv("NEXT_PUBLIC_CMS_URL", "https://studio.example.test");
  vi.stubGlobal("fetch", vi.fn(async (url: string) => ({ ok: new URL(url).pathname === "/api/content/announcements", json: async () => records }) as Response));
  vi.resetModules();
  const { getAnnouncements } = await import("@/lib/announcements");
  return (await getAnnouncements()).map((a) => a.id);
}

describe.each(["UTC", "Asia/Tokyo"])("with the server in %s", (zone) => {
  it("one minute before the end of the end day it still shows; one minute after, it is gone", async () => {
    expect(await shownAt("2026-12-13T05:58:00.000Z", [ann({})], zone)).toEqual(["a1"]);
    expect(await shownAt("2026-12-13T06:00:00.000Z", [ann({})], zone)).toEqual([]);
    expect(await shownAt("2026-12-13T18:00:00.000Z", [ann({})], zone)).toEqual([]); // all Sunday 13 Dec
  });
  it("it appears at the start of the start day in Chicago, not a day early or late", async () => {
    expect(await shownAt("2026-12-01T05:59:00.000Z", [ann({})], zone)).toEqual([]);
    expect(await shownAt("2026-12-01T06:00:00.000Z", [ann({})], zone)).toEqual(["a1"]);
  });
  it("summer time (UTC-5) follows the same rule", async () => {
    const r = [ann({ starts_at: "2026-07-04T05:00:00.000Z", ends_at: "2026-07-05T04:59:00.000Z" })];
    expect(await shownAt("2026-07-05T04:58:00.000Z", r, zone)).toEqual(["a1"]);
    expect(await shownAt("2026-07-05T05:00:00.000Z", r, zone)).toEqual([]);
  });
  it("a date-only value is that calendar day in Chicago; no start shows at once; no end stays until taken down", async () => {
    expect(await shownAt("2026-12-12T20:00:00.000Z", [ann({ starts_at: null, ends_at: "2026-12-12" })], zone)).toEqual(["a1"]);
    expect(await shownAt("2026-12-13T06:00:00.000Z", [ann({ starts_at: null, ends_at: "2026-12-12" })], zone)).toEqual([]);
    expect(await shownAt("2026-12-01T00:00:00.000Z", [ann({ starts_at: null, ends_at: null })], zone)).toEqual(["a1"]);
    expect(await shownAt("2030-01-01T00:00:00.000Z", [ann({ starts_at: null, ends_at: null })], zone)).toEqual(["a1"]);
  });
});
