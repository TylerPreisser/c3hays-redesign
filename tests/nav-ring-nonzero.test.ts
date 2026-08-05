// @vitest-environment jsdom
/**
 * v8 D3 (regression) — selecting a NAV link that ALSO owns the brand
 * `.nav-link-underline::after` must still produce a full-size marching-ants ring,
 * not the collapsed 0×2px sliver caused by the author `::after` colliding with the
 * editor's `::after`.
 *
 * D169 RECONCILIATION (2026-08-05): this used to grep the injected stylesheet for
 * `.cms-sel::after{…width:auto!important…}` and treat that as a proxy for "the rect is
 * non-zero", with the literal rectangle deferred to a Playwright probe. Commit 1523e83
 * Item 2 replaced that pseudo-element outright: the selection outline is now
 * `#c3-sel-ring`, a `position:fixed` div sized in JS from the element's live
 * getBoundingClientRect. The grep therefore failed on markup whose ring is not merely
 * intact but STRUCTURALLY IMMUNE to the collision — the ring is a body-level sibling,
 * so no author `::after` on the nav link can reach it at all.
 *
 * Which means the proxy is no longer needed. jsdom cannot LAY OUT the link, but it can
 * be TOLD what the link measures; the ring geometry is then pure arithmetic on that
 * rect, so the literal non-zero rectangle is asserted here, deterministically. The
 * hover ants (which DO still co-reside with the author `::after`) keep their CSS
 * contract in editbridge-selection-style.
 *
 * RED-FIRST for the current shape: make positionRing write a zero-size box — or revert
 * it to the `::after` approach — and the size assertions below fail.
 */
import { describe, it, expect, afterEach } from "vitest";
import { mountEditor, type EditorHarness } from "./editbridge-harness";

let h: EditorHarness | null = null;
afterEach(async () => { if (h) { await h.unmount(); h = null; } });

/** The author rule from globals.css that collapsed the old ::after ring. */
const AUTHOR_UNDERLINE =
  `.nav-link-underline::after{content:"";position:absolute;bottom:-2px;left:0;width:0;height:2px;background:var(--color-teal);}`;

/** Pin a jsdom element's measured box (jsdom lays nothing out — everything is 0×0). */
function stubRect(el: Element, box: { left: number; top: number; width: number; height: number }) {
  const { left, top, width, height } = box;
  el.getBoundingClientRect = () =>
    ({ left, top, width, height, right: left + width, bottom: top + height, x: left, y: top,
       toJSON: () => ({}) }) as DOMRect;
}

describe("D3 — nav selection ring survives the .nav-link-underline::after collision", () => {
  it("a nav link carrying the competing author ::after selects to a NON-ZERO ring", async () => {
    const author = document.createElement("style");
    author.textContent = AUTHOR_UNDERLINE;
    document.head.appendChild(author);

    h = await mountEditor(`<header><a data-cms-link="nav.home" class="nav-link-underline" href="/">Home</a></header>`);
    const link = document.querySelector('[data-cms-link="nav.home"]') as HTMLElement;
    // The real nav link at 1440: a ~92×22 text box in the sticky header.
    stubRect(link, { left: 140, top: 18, width: 92, height: 22 });

    link.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    // (1) genuinely selectable
    expect(link.classList.contains("cms-sel")).toBe(true);

    // (2) the ring is SHOWN and sized from the link's rect + the 3px bleed — i.e. the
    // literal rectangle, not the 0×2px sliver the author ::after used to impose.
    const ring = document.getElementById("c3-sel-ring") as HTMLElement;
    expect(ring).not.toBeNull();
    expect(ring.style.display).toBe("block");
    expect(ring.style.width).toBe("98px"); // 92 + 3px each side
    expect(ring.style.height).toBe("28px"); // 22 + 3px each side
    expect(ring.style.left).toBe("137px");
    expect(ring.style.top).toBe("15px");
    expect(parseFloat(ring.style.height)).toBeGreaterThan(2); // never the 2px sliver

    author.remove();
  });

  it("the ring is a body-level sibling, so no author ::after can reach it", async () => {
    // This is WHY the collision is dead rather than merely out-specified: the outline
    // is no longer a pseudo-element of the selected node, so the cascade on
    // `.nav-link-underline::after` has nothing to collide with.
    const author = document.createElement("style");
    author.textContent = AUTHOR_UNDERLINE;
    document.head.appendChild(author);

    h = await mountEditor(`<header><a data-cms-link="nav.about" class="nav-link-underline" href="/about">About</a></header>`);
    const link = document.querySelector('[data-cms-link="nav.about"]') as HTMLElement;
    stubRect(link, { left: 240, top: 18, width: 80, height: 22 });
    link.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    const ring = document.getElementById("c3-sel-ring") as HTMLElement;
    expect(ring.parentElement).toBe(document.body);
    expect(link.contains(ring)).toBe(false);
    expect(ring.style.width).toBe("86px");

    author.remove();
  });

  it("a link that genuinely measures 0×0 hides the ring instead of drawing a stray box", async () => {
    // Fail-visible, not fail-silent: an unmeasurable target must not leave a 6×6
    // padding-only box floating on the canvas with nothing under it.
    h = await mountEditor(`<header><a data-cms-link="nav.zero" href="/">Zero</a></header>`);
    const link = document.querySelector('[data-cms-link="nav.zero"]') as HTMLElement;
    stubRect(link, { left: 0, top: 0, width: 0, height: 0 });
    link.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    const ring = document.getElementById("c3-sel-ring") as HTMLElement;
    expect(ring.style.display).toBe("none");
  });
});
