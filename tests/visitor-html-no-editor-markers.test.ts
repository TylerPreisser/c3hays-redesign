// @vitest-environment node
import { describe, it, expect, vi, afterEach } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// These render whole pages and the root layout (a cold import of every component): allow for a loaded machine.
vi.setConfig({ testTimeout: 120_000 });
vi.mock("next/navigation", () => ({ usePathname: () => "/", useRouter: () => ({}), useSearchParams: () => new URLSearchParams(), notFound: () => { throw new Error("not-found"); } }));
vi.mock("next/font/google", () => ({ Hanken_Grotesk: () => ({ variable: "font-x", className: "font-x" }) }));

/**
 * The editor's select-only markers (`data-cms-pick`) are drawn only on the editor's canvas (the request carries the preview
 * token). The public HTML of every page type, with the root layout around it, carries none.
 */
const locations = JSON.parse(readFileSync(join(__dirname, "fixtures/studio-locations.json"), "utf8")).locations;
const PAGES: Record<string, string> = {
  Home: "@/app/page", About: "@/app/about/page", Connect: "@/app/connect/page", Counseling: "@/app/counseling/page", Events: "@/app/events/page",
  Give: "@/app/give/page", "Hays campus": "@/app/locations/hays/page", "Colby campus": "@/app/locations/colby/page", Locations: "@/app/locations/page",
  Messages: "@/app/messages/page", News: "@/app/news/page", Search: "@/app/search/page", Visit: "@/app/visit/page", Watch: "@/app/watch/page",
};
const announcements = [{ id: "ann_2", title: "App is live", body: "", surface: "web", priority: 2, active: true, starts_at: null, ends_at: null, created_at: "2026-07-24T00:00:00Z" }];

function studio() {
  vi.stubGlobal("fetch", vi.fn(async (url: string) => {
    const p = new URL(url).pathname;
    const body: Record<string, unknown> = { "/api/content/locations": locations, "/api/content/announcements": announcements, "/api/content/navigation": [{ id: "m1", label: "Start Here", href: "/visit/" }] };
    return { ok: p in body, json: async () => body[p] ?? {} } as Response;
  }));
  vi.stubEnv("NEXT_PUBLIC_CMS_URL", "https://studio.example.test");
}
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); vi.doUnmock("next/headers"); vi.resetModules(); });

async function render(modPath: string, edit: boolean) {
  vi.resetModules();
  if (edit) {
    vi.stubEnv("CMS_LIVE", "1");
    vi.doMock("next/headers", () => ({ headers: async () => new Headers({ "x-c3-preview": "tok", "x-c3-path": "/" }) }));
  }
  const Layout = (await import("@/app/layout")).default;
  const mod = await import(/* @vite-ignore */ modPath);
  const page = await (mod.default as (p: object) => Promise<React.ReactElement>)({ searchParams: Promise.resolve(edit ? { preview: "tok" } : {}), params: Promise.resolve({}) });
  return renderToStaticMarkup(await Layout({ children: page }));
}

describe("a visitor's HTML carries no editor marker", () => {
  it.each(Object.entries(PAGES))("%s", async (_name, modPath) => {
    studio();
    const html = await render(modPath, false);
    expect(html).toContain("<footer"); // the layout rendered around the page
    expect(html).not.toContain("data-cms-pick");
  });
  it("the same pages on the editor's canvas do carry them (the guard can fail)", async () => {
    studio();
    const html = await render(PAGES.Home, true);
    expect(html).toContain('data-cms-pick="nav:menu"');
    expect(html).toContain('data-cms-pick="announcement:ann_2"');
    expect(await render(PAGES["Hays campus"], true)).toContain('data-cms-pick="fact:service_times:hays"');
  });
});
