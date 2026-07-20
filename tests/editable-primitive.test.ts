// @vitest-environment jsdom
/**
 * Contract guard for the shared editability primitive (Phase-5 generalizable fix).
 *
 * The editor makes an element click-to-edit IFF it carries data-cms (text) or
 * data-cms-link + a data-cms-link-label span (links). This locks that the
 * <Editable>/<Tx>/<EditableLink> primitives ALWAYS emit those hooks, so any
 * authored content routed through them is editable-by-construction — the guard
 * against the Events/EventCard "silently non-editable" regression recurring.
 */
import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Editable, Tx, EditableLink } from "@/components/cms/Editable";

describe("Editable/Tx primitive emits the data-cms editor contract", () => {
  it("emits data-cms with the t: scope by default and renders the fallback", () => {
    const html = renderToStaticMarkup(Editable({ k: "events-heading", fallback: "Upcoming Events" }));
    expect(html).toContain('data-cms="t:events-heading"');
    expect(html).toContain("Upcoming Events");
  });

  it("uses the g: scope when scope='g' (globals)", () => {
    const html = renderToStaticMarkup(Editable({ scope: "g", k: "footer-brand", fallback: "C3" }));
    expect(html).toContain('data-cms="g:footer-brand"');
  });

  it("prefers the CMS override over the fallback", () => {
    const html = renderToStaticMarkup(
      Editable({ text: { "events-heading": "This Week at C3" }, k: "events-heading", fallback: "Upcoming Events" }),
    );
    expect(html).toContain("This Week at C3");
    expect(html).not.toContain("Upcoming Events");
  });

  it("Tx is the same primitive (alias)", () => {
    expect(Tx).toBe(Editable);
  });

  it("EditableLink emits data-cms-link AND the required data-cms-link-label span", () => {
    const html = renderToStaticMarkup(
      EditableLink({ k: "events.cta", href: "/connect/", label: "See All Events" }),
    );
    expect(html).toContain('data-cms-link="events.cta"');
    expect(html).toContain("data-cms-link-label");
    expect(html).toContain("See All Events");
    expect(html).toContain('href="/connect/"');
  });

  it("EditableLink honors href/label overrides from the CMS bag", () => {
    const html = renderToStaticMarkup(
      EditableLink({
        text: { "events.cta-href": "/events/", "events.cta-label": "All Events" },
        k: "events.cta",
        href: "/connect/",
        label: "See All Events",
      }),
    );
    expect(html).toContain('href="/events/"');
    expect(html).toContain("All Events");
  });
});
