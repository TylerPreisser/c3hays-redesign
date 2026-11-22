// @vitest-environment node
import { describe, it, expect, vi, afterEach } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

// Renders the whole /events page (a cold import of every component): allow for a loaded machine.
vi.setConfig({ testTimeout: 120_000 });
vi.mock("next/navigation", () => ({ usePathname: () => "/events", useRouter: () => ({}), useSearchParams: () => new URLSearchParams() }));
vi.mock("next/font/google", () => ({ Hanken_Grotesk: () => ({ variable: "font-x", className: "font-x" }) }));

/**
 * What a visitor gets on /events in the default mode (`espace`) must not change. The page's markup was captured before the
 * events-reach work (regression/events-espace-mode/events.html); every run renders it again and compares byte for byte.
 * The fake Studio answers with a published event on purpose: in this mode it must make no difference.
 * CHARACTERIZATION: "what the page is today"; a change here is surfaced for review.
 */
const FILE = join(__dirname, "../regression/events-espace-mode/events.html");
const STUDIO_EVENTS = [
  { id: "evt_3f9a1c2b7d10", title: "Marriage Night", description: "", location: "C3 Hays", address: null, start_date: "2026-12-03T00:30:00.000Z", end_date: null, all_day: false, registration_enabled: true, image_url: null, category: "marriage_night", status: "scheduled", created_at: "2026-11-22T00:00:00.000Z", updated_at: "2026-11-22T00:00:00.000Z" },
];

afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); vi.resetModules(); });

async function render(site: Record<string, unknown>) {
  vi.stubEnv("NEXT_PUBLIC_CMS_URL", "https://studio.example.test");
  vi.stubGlobal("fetch", vi.fn(async (url: string) => {
    const p = new URL(url).pathname;
    const body: Record<string, unknown> = { "/api/content/events": STUDIO_EVENTS, "/api/content/site": site };
    return { ok: p in body, json: async () => body[p] ?? {} } as Response;
  }));
  vi.resetModules();
  const mod = await import("@/app/events/page");
  return renderToStaticMarkup(await (mod.default as (p: object) => Promise<React.ReactElement>)({}));
}

describe("/events in mode espace is today's page", () => {
  it.each([["no setting", {}], ["espace", { events_on_website: "espace" }], ["an unknown value", { events_on_website: "nonsense" }], ["studio is not honoured here without Studio's say-so", { events_on_website: 7 }]])("%s", async (_n, site) => {
    const html = await render(site as Record<string, unknown>);
    if (process.env.UPDATE_EVENTS_BASELINE === "1" && !existsSync(FILE)) writeFileSync(FILE, html);
    expect(html).toBe(readFileSync(FILE, "utf8"));
    expect(html).not.toContain("Marriage Night");
  });
});
