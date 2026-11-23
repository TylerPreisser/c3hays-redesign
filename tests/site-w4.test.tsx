// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { createRoot } from "react-dom/client";
import { act, createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
vi.setConfig({ testTimeout: 60_000, hookTimeout: 60_000 });
vi.mock("next/navigation", () => ({ usePathname: () => "/", useRouter: () => ({ replace() {} }), useSearchParams: () => new URLSearchParams(searchQ) }));
let searchQ = "";

/**
 * Wave 4 of the public site, each kept MUST as a real-shaped check: the church's real eSpace row text (captured 2026-11-22,
 * regression/event-reach-marriage-night/PROVENANCE.md names the feed) against Studio's own times.
 */
const STALE = "Services are at 8:00, 9:30 and 11:00am Children's Church is offered during the 9:30am service.";
const WEEKEND = [
  { Title: "Weekend Services", start: "2026-12-06T08:00:00.0000000", end: "2026-12-06T09:00:00.0000000", allDay: false, locCodes: "C3Hays - ", EventStartTime: "8:00 AM", EventEndTime: "9:00 AM", IsHoliday: false, description: STALE },
  { Title: "Gym Set up", start: "2026-12-05T16:30:00.0000000", end: "2026-12-05T17:00:00.0000000", allDay: false, locCodes: "C3Hays - ", EventStartTime: "4:30 PM", EventEndTime: "5:00 PM", IsHoliday: false, description: "" },
  { Title: "Cornhole League", start: "2026-12-07T19:00:00.0000000", end: "2026-12-07T20:30:00.0000000", allDay: false, locCodes: "C3Hays - ", EventStartTime: "7:00 PM", EventEndTime: "8:30 PM", IsHoliday: false, description: "" },
];
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); document.body.innerHTML = ""; vi.resetModules(); });

async function mount(el: (m: any) => React.ReactElement, feed: "ok" | "down" = "ok") {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-12-01T18:00:00.000Z"));
  vi.stubGlobal("fetch", vi.fn(async () => { if (feed === "down") throw new Error("network"); return { ok: true, json: async () => WEEKEND } as Response; }));
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.resetModules();
  const m = { Upcoming: (await import("@/components/events/UpcomingEventsLive")).default, Calendar: (await import("@/components/events/LiveCalendar")).default };
  const host = document.createElement("div");
  document.body.appendChild(host);
  const root = createRoot(host);
  await act(async () => { root.render(el(m)); });
  await act(async () => { await Promise.resolve(); });
  await act(async () => { await Promise.resolve(); });
  return { host, root };
}

describe("M1 the calendar prints Studio's times, not eSpace's free text", () => {
  it("a Weekend Services row carries Studio's line, never the 9:30 / 11:00 note; the Sunday card and the month list agree", async () => {
    const { host, root } = await mount(({ Upcoming, Calendar }) => createElement("div", null, createElement(Upcoming), createElement(Calendar)));
    const text = host.textContent || "";
    expect(text).not.toContain("9:30");
    expect(text).not.toContain("11:00");
    expect(text).toContain("10:45 AM"); // Studio's Hays Sunday times
    expect(text).toContain("Hays: Saturday 5:00 PM");
    await act(async () => root.unmount());
  });
  it("a staff set-up job is not an event for visitors (Upcoming and the calendar)", async () => {
    const { host, root } = await mount(({ Upcoming, Calendar }) => createElement("div", null, createElement(Upcoming), createElement(Calendar)));
    expect(host.textContent).not.toContain("Gym Set up");
    expect(host.textContent).toContain("Cornhole League");
    await act(async () => root.unmount());
  });
});

describe("M8 events with eSpace failing", () => {
  it("says the calendar is slow, offers Try again and the full calendar, and the weekend line still shows", async () => {
    const { default: WeekendLine } = await import("@/components/WeekendLine");
    const html = renderToStaticMarkup(createElement(WeekendLine));
    expect(html).toContain("Hays: Saturday 5:00 PM");
    expect(html).toContain("Colby: Sunday 10:00 AM");
    const m = await mount(({ Upcoming }) => createElement(Upcoming), "down");
    expect(m.host.textContent).toContain("The live calendar is slow right now.");
    expect(m.host.textContent).not.toContain("couldn");
    expect(Array.from(m.host.querySelectorAll("button")).map((b) => b.textContent)).toContain("Try again");
    expect(m.host.querySelector("a[href*='espace.cool']")).toBeTruthy();
    await act(async () => m.root.unmount());
  });
});

describe("M3 and M5 the newsletter form and the app bar", () => {
  it("while nobody at the church reads signups: no email field, no Turnstile, the call-the-office line, one name", async () => {
    const { NEWSLETTER_SIGNUP_LIVE } = await import("@/lib/newsletter-signup");
    expect(NEWSLETTER_SIGNUP_LIVE).toBe(false);
    const { default: Form } = await import("@/components/layout/NewsletterForm");
    const { default: Weekly } = await import("@/components/newsletter/WeeklySignup");
    const { SignupConfigProvider } = await import("@/providers/SignupConfigProvider");
    for (const el of [createElement(Form), createElement(Weekly)]) {
      const html = renderToStaticMarkup(createElement(SignupConfigProvider as never, { turnstileSiteKey: "k" } as never, el));
      expect(html).toContain("Want C3 News by email? Call the office at (785) 625-5483.");
      expect(html).not.toContain("<input");
      expect(html).not.toContain("<form");
      expect(html).not.toContain("does not subscribe");
      expect(html).not.toContain("C3 Weekly");
    }
  });
  it("a bare App Store front page becomes the church's app listing; a real listing and a site link are left alone", async () => {
    const { appListing } = await import("@/lib/announcements");
    const { site } = await import("@/data/site");
    expect(appListing("https://apps.apple.com/")).toBe(site.appStore);
    expect(appListing("https://apps.apple.com")).toBe(site.appStore);
    expect(appListing("https://apps.apple.com/us/")).toBe(site.appStore);
    expect(appListing("https://apps.apple.com/us/app/c3-ks/id1028509278")).toBe("https://apps.apple.com/us/app/c3-ks/id1028509278");
    expect(appListing("/connect/")).toBe("/connect/");
    expect(appListing(undefined)).toBeUndefined();
  });
});

describe("M4 search finds the kids ministry", () => {
  it.each(["C3Kids", "children", "nursery", "kids"])("%s", async (q) => {
    const { buildIndex, searchEntries } = await import("@/lib/search-index");
    const { SERVICE_TIMES_SNAPSHOT } = await import("@/data/service-times.snapshot");
    const hits = searchEntries(buildIndex(null, SERVICE_TIMES_SNAPSHOT), q);
    expect(hits.map((h) => h.href)).toContain("/locations/hays/");
    expect(hits.find((h) => h.href === "/locations/hays/")?.excerpt).toMatch(/C3Kids is available for children ages 3 through 5th grade/);
  });
  it("a miss offers times, kids and directions with the four links; a long term is cut and wraps", async () => {
    searchQ = "q=zzzz" + "x".repeat(400);
    const { buildIndex } = await import("@/lib/search-index");
    const { default: Client } = await import("@/app/search/SearchClient");
    const html = renderToStaticMarkup(createElement(Client, { index: buildIndex(null) }));
    expect(html).toContain("Looking for service times, kids or directions?");
    for (const href of ["/visit", "/locations/hays", "/locations/colby", "tel:7856255483"]) expect(html).toContain(`href="${href}"`);
    expect(html).toContain('maxLength="100"');
    expect(html).toContain("…");
    expect(html.length).toBeLessThan(6000);
    searchQ = "q=kids";
    const kids = renderToStaticMarkup(createElement(Client, { index: buildIndex(null, (await import("@/data/service-times.snapshot")).SERVICE_TIMES_SNAPSHOT) }));
    expect(kids).toContain("<strong>");
  });
});

describe("M6 M9 M10 M12 and the footer", () => {
  it("the footer links no pages that do not exist (privacy, terms, accessibility)", async () => {
    const html = renderToStaticMarkup(createElement((await import("@/components/layout/Footer")).default as never, { globals: {} } as never));
    for (const p of ["/privacy", "/terms", "/accessibility"]) expect(html).not.toContain(p);
  });
  it("Plan a Visit opens with an h1; the app and social row comes after the campus cards", async () => {
    const html = renderToStaticMarkup(createElement((await import("@/components/visit/JoinPanel")).default as never, { t: {} } as never));
    expect(html).toMatch(/<h1[^>]*>Plan your visit<\/h1>/);
    expect(html.indexOf("<h1")).toBeLessThan(html.indexOf("Get the C3 App"));
    expect(html.indexOf("Hays Campus")).toBeLessThan(html.indexOf("Get the C3 App"));
    expect(html).toContain("data-kids-line");
  });
  it("a value card says its sentence once", async () => {
    const html = renderToStaticMarkup(createElement((await import("@/components/about/OurValues")).default as never, {} as never));
    expect((html.match(/We exist to meet with Him\./g) || []).length).toBe(1);
  });
  it("the 404 page has its own title and ways on", async () => {
    const m = await import("@/app/not-found");
    expect(m.metadata.title).toBe("Page not found");
    const html = renderToStaticMarkup(createElement(m.default));
    for (const href of ["/locations/hays", "/locations/colby", "/search"]) expect(html).toContain(href);
  });
});
