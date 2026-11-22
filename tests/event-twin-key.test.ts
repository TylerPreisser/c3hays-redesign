// @vitest-environment node
import { describe, it, expect } from "vitest";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * The shared fixture regression/event-twin-key/cases.json is replayed here and, byte for byte the same file, in Studio's repo:
 * the church wall clock of an instant, the twin key of an event, and which pairs are one occasion.
 */
const FILE = join(__dirname, "../regression/event-twin-key/cases.json");
const RAW = readFileSync(FILE);
const FIX = JSON.parse(RAW.toString("utf8"));
const SHA256 = "3c18b874a4748b5c445ebbf3658a3fc51043f9960c2f6f2728a4b5756d2045fe";

describe("the shared twin-key fixture", () => {
  it("is the exact file both repos hold (pinned by sha256)", () => {
    expect(createHash("sha256").update(RAW).digest("hex")).toBe(SHA256);
  });

  it.each(FIX.instants)("church wall clock: $name", async (c: { instant: string; wall: string }) => {
    const { churchWallParts, wallDay, wallClock } = await import("@/lib/church-time");
    const p = churchWallParts(c.instant)!;
    expect(`${wallDay(p)}T${wallClock(p)}`).toBe(c.wall);
  });

  it.each(FIX.keys)("twin key: $key", async (c: { title: string; wall: string; allDay: boolean; key: string }) => {
    const { twinKey } = await import("@/lib/event-merge");
    expect(twinKey({ title: c.title, wall: c.wall, allDay: c.allDay })).toBe(c.key);
  });

  it.each(FIX.pairs)("$name", async (c: { a: Side; b: Side; result: string }) => {
    const { mergeEvents } = await import("@/lib/event-merge");
    const out = mergeEvents([cal(c.a)], [cal(c.b)]);
    expect(out.length === 1 ? "merge" : "keep_both").toBe(c.result);
    if (c.result === "merge") expect(out[0].id).toBe("studio-s"); // the Studio one is the one kept
  });
});

interface Side { source: string; title: string; wall: string; allDay: boolean; campus: "Hays" | "Colby" | null }
function cal(s: Side) {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(s.wall)!;
  const start = new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]);
  return { id: s.source === "studio" ? "studio-s" : "espace-e", title: s.title, start, end: start, allDay: s.allDay, timeLabel: "", description: "", campus: s.campus ?? undefined, location: "", color: "#1cc3af", isHoliday: false };
}
