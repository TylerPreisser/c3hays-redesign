// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { createRoot } from "react-dom/client";
import { act, createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
vi.setConfig({ testTimeout: 60_000, hookTimeout: 60_000 });
vi.mock("next/navigation", () => ({ usePathname: () => "/", useRouter: () => ({ replace() {} }), useSearchParams: () => new URLSearchParams("") }));
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); document.body.innerHTML = ""; vi.resetModules(); });

/**
 * Wave 7 of the public site. The Pushpay handles are the church's own, from its /give page (content inventory) and src/data/site.ts:
 * Hays 4390326549, Colby celebratejesus, Online 4553051606. Which one is the church's main account is the church's to say.
 */
const base = { goal: 0, raised: null, currency: "USD" };

describe("a gift goes to the campus the member chose", () => {
  it("'Give Now' opens the campus choice on the page, and no campus's page is reached from it", async () => {
    const { default: Hero } = await import("@/app/give/GiveHero");
    const html = renderToStaticMarkup(createElement(Hero as never, { t: {}, media: {}, img: {} } as never));
    expect(html).toMatch(/href="#give-ways"[^>]*>[^<]*(<[^>]+>)*[^<]*Give Now/);
    expect(html).not.toContain("pushpay.com");
  });
  it("a campaign's button goes to the campus that owns it; one with no campus goes to the choice; a link staff typed for it is kept", async () => {
    const { campaignGiveHref } = await import("@/lib/announcements");
    const colbyPage = "https://pushpay.com/g/celebratejesus";
    expect(campaignGiveHref({ ...base, id: "a", title: "A", giveUrl: colbyPage, campusId: "hays" })).toBe("https://pushpay.com/g/4390326549?r=monthly");
    expect(campaignGiveHref({ ...base, id: "b", title: "B", giveUrl: colbyPage, campusId: "colby" })).toBe("https://pushpay.com/g/celebratejesus?r=monthly");
    expect(campaignGiveHref({ ...base, id: "c", title: "C", giveUrl: colbyPage })).toBe("#give-ways");
    expect(campaignGiveHref({ ...base, id: "d", title: "D", giveUrl: "https://pushpay.com/g/some-fund-page" })).toBe("https://pushpay.com/g/some-fund-page");
  });
  it("Studio's campaign campus is read", async () => {
    const { cleanCampaigns } = await import("@/lib/announcements");
    const out = cleanCampaigns([{ id: "x", title: "Roof", status: "active", goal_amount: 1, give_url: "https://pushpay.com/g/celebratejesus", campus_id: "hays" }], "2026-11-24");
    expect(out[0].campusId).toBe("hays");
  });
});

describe("a stalled calendar reaches the failure block", () => {
  it("the request is given up after 10 seconds, with words while it waits", async () => {
    vi.useFakeTimers();
    vi.stubGlobal("fetch", vi.fn((_u: string, init?: RequestInit) => new Promise((_res, rej) => { init?.signal?.addEventListener("abort", () => rej(new DOMException("aborted", "AbortError"))); })));
    vi.spyOn(console, "error").mockImplementation(() => {});
    const Upcoming = (await import("@/components/events/UpcomingEventsLive")).default;
    const host = document.createElement("div");
    document.body.appendChild(host);
    const root = createRoot(host);
    await act(async () => { root.render(createElement(Upcoming)); });
    expect(host.textContent).toContain("Loading the calendar");
    await act(async () => { await vi.advanceTimersByTimeAsync(9_000); });
    expect(host.textContent).toContain("Loading the calendar");
    await act(async () => { await vi.advanceTimersByTimeAsync(2_000); });
    expect(host.textContent).toContain("Our calendar did not load.");
    expect(host.querySelector("button.btn-outline")?.textContent).toBe("Try again");
    await act(async () => root.unmount());
  });
});

describe("the calendar list opens on today", () => {
  it("days already gone sit behind one 'Earlier this month' row; a tap shows them", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-11-23T18:00:00.000Z"));
    const { AgendaView } = await import("@/components/events/calendar-grid");
    const ev = (id: string, day: number) => ({ id, title: `E${id}`, start: new Date(2026, 10, day, 10), end: new Date(2026, 10, day, 11), allDay: false, timeLabel: "10:00 AM", description: "", location: "", color: "#000", isHoliday: false });
    const host = document.createElement("div");
    document.body.appendChild(host);
    const root = createRoot(host);
    await act(async () => { root.render(createElement(AgendaView as never, { monthEvents: [ev("1", 1), ev("2", 8), ev("3", 24)], onOpen() {} } as never)); });
    expect(host.textContent).toContain("Earlier this month (2 days)");
    expect(host.textContent).not.toContain("E1");
    expect(host.textContent).toContain("E3");
    expect(host.querySelector("[data-agenda-first]")?.textContent).toContain("E3");
    await act(async () => { (host.querySelector("button.lc-agenda-row") as HTMLButtonElement).click(); });
    expect(host.textContent).toContain("E1");
    await act(async () => root.unmount());
  });
});

describe("the footer links to Events even when Studio's menu does not carry it", () => {
  it("adds Events before Give", async () => {
    const { default: Footer } = await import("@/components/layout/Footer");
    const html = renderToStaticMarkup(createElement(Footer as never, { globals: {}, menu: [{ id: "a", label: "About", href: "/about/" }] } as never));
    expect(html).toMatch(/href="\/events\/?"[^>]*>Events/);
  });
});
