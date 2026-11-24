// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { join } from "node:path";

vi.setConfig({ testTimeout: 60_000, hookTimeout: 60_000 });
vi.mock("next/navigation", () => ({ usePathname: () => "/", useRouter: () => ({ replace() {} }), useSearchParams: () => new URLSearchParams("") }));
afterEach(() => { vi.resetModules(); vi.unstubAllGlobals(); });

/**
 * Wave 5 of the public site, what a first-time family sees. The service-times record is the repo's snapshot with Saturday
 * 5:00 PM marked to confirm (the real state on 2026-11-23); Studio's flag drives every line.
 */
async function times(tbc: boolean) {
  const { SERVICE_TIMES_SNAPSHOT } = await import("@/data/service-times.snapshot");
  const d = JSON.parse(JSON.stringify(SERVICE_TIMES_SNAPSHOT));
  for (const c of d.campuses) for (const s of c.services) for (const x of s.slots) x.tbc = false;
  if (tbc) d.campuses.find((c: any) => c.slug === "hays").services.find((s: any) => s.day === "Saturday").slots[0].tbc = true;
  return d;
}
async function wrap(d: unknown, el: React.ReactElement) {
  const { ServiceTimesProvider } = await import("@/providers/ServiceTimesProvider");
  return renderToStaticMarkup(createElement(ServiceTimesProvider as never, { value: d } as never, el));
}

describe("Connect gives the church's own routes and promises nothing", () => {
  it("no form, no 'reach out' promise; phone, email and the three church forms are links", async () => {
    const { default: ConnectClient } = await import("@/app/connect/ConnectClient");
    const html = renderToStaticMarkup(createElement(ConnectClient, { text: {}, media: {}, img: {} } as never));
    expect(html).not.toContain("<form");
    expect(html).not.toContain("reach out");
    expect(html).toContain('href="tel:7856255483"');
    expect(html).toContain('href="mailto:office@c3hays.com"');
    for (const n of ["47", "397", "258"]) expect(html).toContain(`celebration.ccbchurch.com/goto/forms/${n}/responses/new`);
  });
  it("the page title is set once", () => {
    const src = readFileSync(join(__dirname, "../src/app/connect/page.tsx"), "utf8");
    expect(src).toMatch(/title: "Connect",/);
  });
});

describe("the call-to-check line sits under the times it is about, once, from the confirm flag", () => {
  it("names the unconfirmed time and links the office number; gone once confirmed", async () => {
    const { default: Note } = await import("@/components/TimesCheckNote");
    const on = await wrap(await times(true), createElement(Note as never));
    expect(on).toContain("Saturday 5:00 PM: please call the office at");
    expect(on).toContain('href="tel:7856255483"');
    expect(on.split("to check before you come").length - 1).toBe(1);
    expect(await wrap(await times(false), createElement(Note as never))).toBe("");
  });
  it("the footer carries it only on a page that does not place it under its own times", async () => {
    const { default: Footer } = await import("@/components/layout/Footer");
    const d = await times(true);
    expect(await wrap(d, createElement(Footer as never, { globals: {} } as never))).toContain("to check before you come");
    expect(await wrap(d, createElement(Footer as never, { globals: {}, placed: true } as never))).not.toContain("to check before you come");
  });
});

describe("the home campus menu and first screen say the Sunday times", () => {
  it("each campus row prints the record's compact line, not just the unconfirmed Saturday", async () => {
    const { campus, weekendRow } = await import("@/lib/service-times-core");
    const d = await times(true);
    const line = weekendRow(campus(d, "hays"), true);
    expect(line.startsWith("Sun 8:00 AM (C3 Gym), 9:00 AM, 10:45 AM")).toBe(true); // Sunday first, C3Kids named once
    expect(line).toContain("C3Kids at 9:00 AM and 10:45 AM");
    const src = readFileSync(join(__dirname, "../src/components/home/CampusChooser.tsx"), "utf8");
    expect(src).toContain("weekendRow(campus(serviceTimes, loc.id), true)");
    expect(src).not.toContain("firstService(");
  });
  it("'This Sunday' prints every Sunday service from the record, and links to Plan a Visit", async () => {
    const { default: Line } = await import("@/components/home/ThisSundayLine");
    const html = await wrap(await times(true), createElement(Line as never));
    expect(html).toContain("This weekend");
    expect(html).toContain("Sat 5:00 PM");
    expect(html).toContain("Sun 10:00 AM");
    expect(html).toMatch(/href="\/visit\/?"/);
  });
  it("it moves to next Sunday once the last Sunday service has started", async () => {
    const { lastSundayStart, slotMinutes } = await import("@/lib/service-times-core");
    expect(slotMinutes("10:45 AM")).toBe(645);
    expect(lastSundayStart(await times(false))).toBe(645);
  });
});

describe("/events rows show that day's own times", () => {
  it("a Weekend Services row on a Sunday prints the Sunday services and no eSpace block", async () => {
    const { withStudioWeekendLine } = await import("@/lib/event-merge");
    const { weekendLine, weekendDayLine } = await import("@/lib/service-times-core");
    const d = await times(false);
    const row = (iso: string) => ({ id: iso, title: "Weekend Services", start: new Date(iso), end: new Date(iso), allDay: false, timeLabel: "8:00 AM – 12:30 PM", description: "", location: "", color: "#000", isHoliday: false });
    const [sat, sun] = withStudioWeekendLine([row("2026-12-05T23:00:00.000Z"), row("2026-12-06T14:00:00.000Z")] as never, weekendLine(d), (w) => weekendDayLine(d, w));
    expect(sat.timeLabel).toContain("Hays 5:00 PM");
    expect(sun.timeLabel).toContain("Hays 8:00 AM (C3 Gym), 9:00 AM (with C3Kids), 10:45 AM (with C3Kids)");
    expect(`${sat.timeLabel}${sun.timeLabel}`).not.toContain("12:30");
  });
});

describe("Plan a Visit's title is the visible one, and /news/ tells the truth while empty", () => {
  it("'Plan your visit' is the display h1 and 'When & where we meet' is the label under it", async () => {
    const { default: JoinPanel } = await import("@/components/visit/JoinPanel");
    const html = await wrap(await times(true), createElement(JoinPanel as never, { t: {} } as never));
    expect(html).toMatch(/<h1[^>]*class="display-1[^"]*"[^>]*>Plan your visit/);
    expect(html).toMatch(/<h2[^>]*>[^<]*When (&amp;|&)[^<]*where we meet/); expect(html).not.toMatch(/<h2[^>]*display-2/);
  });
  it("with no issue the empty card says so, with the number as a link, and drops 'on its way'", async () => {
    const { default: IssueBrowser } = await import("@/components/newsletter/IssueBrowser");
    const html = renderToStaticMarkup(createElement(IssueBrowser as never, { issues: [] } as never));
    expect(html).toContain("Nothing posted here yet");
    expect(html).toContain('href="tel:7856255483"');
    expect(html).not.toContain("on its way");
  });
});
