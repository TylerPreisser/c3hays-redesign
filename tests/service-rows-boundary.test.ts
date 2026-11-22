// @vitest-environment node
import { describe, it, expect, vi, afterEach } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// These render whole pages and the root layout (a cold import of every component): allow for a loaded machine.
vi.setConfig({ testTimeout: 60_000 });

/**
 * Service rows from Studio are read at the boundary: a `day` must be a weekday name and a `room` is plain text.
 * The input is the shape of Studio's published locations (tests/fixtures/studio-locations.json) with one row
 * carrying markup in `day` and in a slot's `room`.
 */
const fixture = JSON.parse(readFileSync(join(__dirname, "fixtures/studio-locations.json"), "utf8")).locations as any[];

function studioWith(mutate: (locs: any[]) => void) {
  const locs = JSON.parse(JSON.stringify(fixture));
  mutate(locs);
  vi.stubGlobal("fetch", vi.fn(async (url: string) => ({
    ok: true,
    json: async () => (String(url).endsWith("/api/content/locations") ? locs : {}),
  }) as Response));
}
async function pageHtml(path: "hays" | "colby") {
  vi.resetModules();
  vi.stubEnv("NEXT_PUBLIC_CMS_URL", "https://studio.example.test");
  const mod = await import(path === "hays" ? "@/app/locations/hays/page" : "@/app/locations/colby/page");
  const el = await (mod.default as (p: object) => Promise<React.ReactElement>)({});
  return renderToStaticMarkup(el);
}

describe("service rows from Studio", () => {
  afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

  it.each(["hays", "colby"] as const)("%s page: a row whose day is not a weekday name falls back to the built-in times", async (slug) => {
    studioWith((locs) => {
      const c = locs.find((l) => l.slug === slug);
      c.services[c.services.length - 1].day = 'Sunday<img src=x data-probe="1">';
      c.services[c.services.length - 1].slots[0].room = '<b data-probe="2">Gym</b>';
    });
    const html = await pageHtml(slug);
    expect(html).not.toContain("data-probe");
    expect(html).not.toContain("<img src=x");
    expect(html).toMatch(/Sundays? at/); // the built-in sentence is still there
  });

  it("a plain weekday name in any case, and a plain room, are kept", async () => {
    const { normalizeCampus } = await import("@/lib/service-times-core");
    const c = normalizeCampus({ slug: "hays", name: "Hays", services: [{ day: " sUNday ", slots: [{ time: "9:00 AM", room: "C3 Gym", kids: false }] }] });
    expect(c?.services[0].day).toBe("Sunday");
    expect(c?.services[0].slots[0].room).toBe("C3 Gym");
  });
});
