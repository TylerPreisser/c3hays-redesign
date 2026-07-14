// @vitest-environment jsdom
/**
 * v7 R10 (U9) — SEQUENCE / STAGGER. An entrance preset value may carry an optional
 * ":<order>" suffix ("riseUp:2") so tagged elements enter one AFTER another ("this
 * goes, then this") — the order becomes an animation-delay. The bare preset (no order)
 * is unchanged. reveal.ts stamps the clean preset name onto data-anim and the delay
 * as inline style, so animations.css plays it and the sequence reads in order.
 *
 * RED-FIRST: stampReveals currently stamps the RAW value ("riseUp:2") and applies no delay.
 */
import { describe, it, expect, beforeEach } from "vitest";
import { stampReveals, STAGGER_STEP_MS } from "@/lib/reveal";

describe("R10 — staggered reveal ordering", () => {
  beforeEach(() => { document.body.innerHTML = ""; });

  it("splits 'preset:order' → clean data-anim + an animation-delay from the order", () => {
    document.body.innerHTML = `<p data-cms="t:a">A</p>`;
    stampReveals(document, { "t:a": "riseUp:2" });
    const el = document.querySelector('[data-cms="t:a"]') as HTMLElement;
    expect(el.getAttribute("data-anim")).toBe("riseUp"); // NOT "riseUp:2"
    expect(el.style.animationDelay).toBe(`${2 * STAGGER_STEP_MS}ms`);
  });

  it("a bare preset (no order) sets no delay", () => {
    document.body.innerHTML = `<p data-cms="t:b">B</p>`;
    stampReveals(document, { "t:b": "riseUp" });
    const el = document.querySelector('[data-cms="t:b"]') as HTMLElement;
    expect(el.getAttribute("data-anim")).toBe("riseUp");
    expect(el.style.animationDelay).toBe("");
  });

  it("a group enters in increasing-delay order", () => {
    document.body.innerHTML = `<i data-cms="t:1">1</i><i data-cms="t:2">2</i><i data-cms="t:3">3</i>`;
    stampReveals(document, { "t:1": "slideUp:1", "t:2": "slideUp:2", "t:3": "slideUp:3" });
    const d = (p: string) => (document.querySelector(`[data-cms="t:${p}"]`) as HTMLElement).style.animationDelay;
    expect(parseFloat(d("1"))).toBeLessThan(parseFloat(d("2")));
    expect(parseFloat(d("2"))).toBeLessThan(parseFloat(d("3")));
  });
});
