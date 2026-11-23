// @vitest-environment node
import { describe, it, expect, vi, afterEach } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * The website half of the golden scenario (regression/event-reach-marriage-night): Studio's published Marriage Night, Wed 2 Dec
 * 2026 6:30 PM Central, merged with the church's real eSpace feed, which already lists the same occasion.
 * ORACLE for the day and time: the church's own newsletter words (see PROVENANCE.md). The rest is a characterization.
 */
const DIR = join(__dirname, "../regression/event-reach-marriage-night");
const STUDIO = JSON.parse(readFileSync(join(DIR, "events.json"), "utf8"));
const ESPACE = JSON.parse(readFileSync(join(DIR, "espace-sample.json"), "utf8"));
const ORIGINAL_TZ = process.env.TZ;
afterEach(() => { vi.unstubAllGlobals(); if (ORIGINAL_TZ === undefined) delete process.env.TZ; else process.env.TZ = ORIGINAL_TZ; vi.resetModules(); });

describe.each(["UTC", "Asia/Tokyo"])("the golden scenario with the process in %s", (zone) => {
  async function merged() {
    process.env.TZ = zone;
    vi.resetModules();
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: true, json: async () => ESPACE }) as Response));
    const { fetchEspaceEvents } = await import("@/lib/espace");
    const { allStudioEvents } = await import("@/lib/studio-events");
    const { mergeEvents, studioToCalEvent } = await import("@/lib/event-merge");
    const espace = await fetchEspaceEvents({ start: new Date(2026, 10, 29), end: new Date(2026, 11, 13) });
    return mergeEvents(allStudioEvents(STUDIO).map(studioToCalEvent), espace);
  }
  it("the occasion eSpace also lists is one card, the Studio one, on Wednesday 2 December at 6:30 PM", async () => {
    const out = await merged();
    const nights = out.filter((e) => e.title === "Marriage Night");
    expect(nights).toHaveLength(1);
    expect(nights[0].id).toBe("studio-evt_3f9a1c2b7d10");
    expect(nights[0].whenLabel).toBe("Wednesday, December 2 · 6:30 PM");
    expect([nights[0].start.getMonth(), nights[0].start.getDate(), nights[0].start.getHours(), nights[0].start.getMinutes()]).toEqual([11, 2, 18, 30]);
  });
  it("it sits in start order among the church's other events and nothing else is lost", async () => {
    const out = await merged();
    const times = out.map((e) => e.start.getTime());
    expect(times).toEqual([...times].sort((a, b) => a - b));
    expect(out).toHaveLength(ESPACE.length); // one Studio event replaced its eSpace twin: same count
    expect(out.map((e) => e.title)).toContain("Center Stage Theatre Performance");
  });
});
