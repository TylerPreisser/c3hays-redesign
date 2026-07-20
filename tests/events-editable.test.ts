// @vitest-environment jsdom
/**
 * /events EDITOR-NATIVE REBUILD GUARD (contract §1, §4 "Events cards non-editable").
 *
 * Root cause the rebuild fixes: <UpcomingEventsLive> rendered <EventCard> WITHOUT a
 * `cmsKey`, and EventCard only emits `data-cms` when `cmsKey` is passed — so the
 * "Upcoming Events" cards were non-editable by construction. This test locks the
 * fixed shape:
 *   (a) /events composes via PageComposer → emits EXACTLY the 3 required
 *       `data-section` wrappers (events-hero / events-upcoming / events-calendar),
 *       matching c3-backend defaultSectionsForSlug("/events");
 *   (b) every upcoming card is fully editor-native: title text (data-cms), its own
 *       card background (data-cms-bg), a swappable image (data-cms-img), and an
 *       editable CTA (data-cms-link WITH the mandatory data-cms-link-label span).
 *
 * The cards are a client island (<UpcomingEventsLive> paints skeletons until the live
 * eSpace feed resolves), so the READY-state markup is asserted on the pure
 * presentational grid the island delegates to (<UpcomingEventsGrid>), fed sample
 * events — the exact JSX the editor sees once data loads.
 */
import { describe, it, expect, beforeAll } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import type { CalEvent } from "@/lib/espace";

/** Return the `data-cms-link` keys whose element has NO `data-cms-link-label`
 *  descendant (collapsed cards). Empty ⇒ all links carry a label span. */
function collapsedLinkKeys(html: string): string[] {
  const host = document.createElement("div");
  host.innerHTML = html;
  return Array.from(host.querySelectorAll("[data-cms-link]"))
    .filter((el) => !el.querySelector("[data-cms-link-label]"))
    .map((el) => el.getAttribute("data-cms-link") || "(unnamed)");
}

/** All values of `attr` present in `html`. */
function attrValues(html: string, attr: string): string[] {
  const host = document.createElement("div");
  host.innerHTML = html;
  return Array.from(host.querySelectorAll(`[${attr}]`)).map(
    (el) => el.getAttribute(attr) || "",
  );
}

function sampleEvent(i: number, title: string): CalEvent {
  const start = new Date(Date.now() + (i + 1) * 86_400_000);
  const end = new Date(start.getTime() + 90 * 60_000);
  return {
    id: `sample-${i}`,
    title,
    start,
    end,
    allDay: false,
    timeLabel: "7:00 PM",
    description: "Come and join the C3 family for this gathering.",
    campus: "Hays",
    location: "Hays campus",
    color: "#1cc3af",
    isHoliday: false,
    registerUrl: "https://example.com/register",
  };
}

let pageHtml = "";
let gridHtml = "";
let authoredHtml = "";

beforeAll(async () => {
  // LiveCalendar/UpcomingEventsLive pull gsap-adjacent modules that read matchMedia
  // at eval; jsdom lacks it. Stub before dynamic import (mirrors the home guard).
  if (typeof window !== "undefined" && !window.matchMedia) {
    // @ts-expect-error minimal jsdom stub
    window.matchMedia = () => ({ matches: false, media: "", onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent() { return false; } });
  }

  const { default: EventsPage } = await import("@/app/events/page");
  // Async server component; with no CMS configured it renders defaults via PageComposer.
  pageHtml = renderToStaticMarkup(await EventsPage({}));

  const { default: UpcomingEventsGrid } = await import(
    "@/components/events/UpcomingEventsGrid"
  );
  const events = [sampleEvent(0, "Baptism Sunday"), sampleEvent(1, "Student Night")];
  gridHtml = renderToStaticMarkup(
    createElement(UpcomingEventsGrid, { events, text: {}, media: {} }),
  );

  // Round-2 authored path: server-rendered, add/removable, structured data-cms paths.
  const { default: UpcomingEventsAuthored } = await import(
    "@/components/events/UpcomingEventsAuthored"
  );
  const cards = [
    { id: "aa", title: "Baptism Sunday", month: "JUL", day: "20", detail: "Both services", campus: "Both campuses" },
    { id: "bb", title: "Student Night", month: "AUG", day: "01", detail: "Grades 6-12", campus: "Hays campus" },
  ];
  authoredHtml = renderToStaticMarkup(
    createElement(UpcomingEventsAuthored, { cards, text: {}, media: {} }),
  );
});

describe("/events composes into the 3 required editor-native sections", () => {
  it("emits exactly the events-hero / events-upcoming / events-calendar data-section wrappers", () => {
    const ids = attrValues(pageHtml, "data-section");
    expect(ids).toEqual(["events-hero", "events-upcoming", "events-calendar"]);
  });
});

describe("upcoming cards are editor-native (contract §1 a–e)", () => {
  it("each card exposes editable title text (data-cms)", () => {
    expect(gridHtml).toContain('data-cms="t:events-upcoming-0-title"');
    expect(gridHtml).toContain('data-cms="t:events-upcoming-1-title"');
  });

  it("each card container has its OWN card background handle (data-cms-bg)", () => {
    const bgKeys = attrValues(gridHtml, "data-cms-bg");
    expect(bgKeys).toContain("events-upcoming-0-bg");
    expect(bgKeys).toContain("events-upcoming-1-bg");
  });

  it("each card has a swappable image (data-cms-img) rendering a real asset", () => {
    const imgKeys = attrValues(gridHtml, "data-cms-img");
    expect(imgKeys).toContain("events-upcoming-0-img");
    expect(imgKeys).toContain("events-upcoming-1-img");
    // A real asset is rendered (not just the gradient fallback).
    expect(gridHtml).toContain("worship.webp");
  });

  it("each card CTA is an editable link with the mandatory label span", () => {
    const linkKeys = attrValues(gridHtml, "data-cms-link");
    expect(linkKeys).toContain("events-upcoming-0-cta");
    expect(linkKeys).toContain("events-upcoming-1-cta");
    // Editable-by-construction invariant: NO collapsed (label-less) links.
    expect(collapsedLinkKeys(gridHtml)).toEqual([]);
  });
});

describe("authored events cards support true-edit + add/remove (round-2)", () => {
  it("wraps the list in the add/remove anchor data-cms-list=events.cards", () => {
    expect(attrValues(authoredHtml, "data-cms-list")).toContain("events.cards");
  });

  it("renders each field as a STRUCTURED data-cms path (router target), not a t: key", () => {
    // These are what the editor's events.cards.<id>.<field> router persists.
    expect(authoredHtml).toContain('data-cms="events.cards.aa.title"');
    expect(authoredHtml).toContain('data-cms="events.cards.aa.month"');
    expect(authoredHtml).toContain('data-cms="events.cards.aa.day"');
    expect(authoredHtml).toContain('data-cms="events.cards.aa.detail"');
    expect(authoredHtml).toContain('data-cms="events.cards.aa.campus"');
    expect(authoredHtml).toContain('data-cms="events.cards.bb.title"');
    // The authored field value renders verbatim (persisted content), no t: scope leak.
    expect(authoredHtml).not.toContain('data-cms="t:events-card');
  });

  it("gives each card its own bg handle and swappable image", () => {
    const bg = attrValues(authoredHtml, "data-cms-bg");
    expect(bg).toContain("events-card-aa-bg");
    expect(bg).toContain("events-card-bb-bg");
    const img = attrValues(authoredHtml, "data-cms-img");
    expect(img).toContain("events-card-aa-img");
    expect(img).toContain("events-card-bb-img");
  });

  it("gives each card an editable CTA link with a label span (no collapse)", () => {
    const links = attrValues(authoredHtml, "data-cms-link");
    expect(links).toContain("events.cards.aa.cta");
    expect(links).toContain("events.cards.bb.cta");
    expect(collapsedLinkKeys(authoredHtml)).toEqual([]);
  });
});

describe("parseEventCards defensive boundary", () => {
  it("returns [] with no authored cards (⇒ live fallback) and skips garbage", async () => {
    const { parseEventCards } = await import("@/components/events/events-content");
    expect(parseEventCards(undefined)).toEqual([]);
    expect(parseEventCards({})).toEqual([]);
    expect(parseEventCards({ cards: "nope" })).toEqual([]);
    // Missing/blank id or non-object entries are skipped; valid ones survive.
    const parsed = parseEventCards({ cards: [null, { title: "no id" }, { id: "ok", title: "Kept" }] });
    expect(parsed.map((c) => c.id)).toEqual(["ok"]);
    expect(parsed[0].title).toBe("Kept");
  });
});
