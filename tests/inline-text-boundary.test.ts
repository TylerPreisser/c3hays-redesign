// @vitest-environment node
import { describe, it, expect } from "vitest";
import { sanitizeInlineHtml } from "@/lib/inline-html";
import { tx, txTimesSafe, fromStudioHome } from "@/lib/home-content";
import { buildBgCss } from "@/lib/backgrounds";

/** Text and styles from Studio are read through an allow-list before they are set as HTML or put in a <style>. */
describe("text from Studio", () => {
  it("keeps the markup the editor makes and drops everything else", () => {
    const ok = 'Join <b>us</b> in <em style="color:#1cc3af;font-style:italic">Hays</em>, <a href="/visit/">plan a visit</a><br>';
    expect(sanitizeInlineHtml(ok)).toBe(ok);
    expect(sanitizeInlineHtml("Watch &amp; Listen")).toBe("Watch &amp; Listen");
    const bad = sanitizeInlineHtml('Hi<img src=x onerror="n()"><script>n()</script><a href="javascript:n()" onclick="n()">go</a><span style="background:url(x);color:red">t</span> <iframe src="//e"></iframe>');
    // only the elements that were allowed come out as elements; the rest is text
    expect([...bad.matchAll(/<\/?([a-z0-9]+)/gi)].map((m) => m[1].toLowerCase()).every((n) => n === "a" || n === "span")).toBe(true);
    expect(bad).not.toMatch(/<a[^>]*(javascript:|onclick)|<[^>]*url\(/i);
    expect(bad).toContain("go");
    expect(bad).toContain('style="color:red"');
  });

  it("every path a text value takes to a page goes through it: text bag, home content, clock-time lines", () => {
    expect(tx({ k: "A<img src=x onerror=n()>" }, "k", "fb")).not.toContain("<img");
    expect(tx({}, "k", "<b>built-in</b>")).toBe("<b>built-in</b>"); // the code's own fallback is untouched
    expect(txTimesSafe({ k: "Join <svg onload=n()>us</svg>" }, "k", "fb")).not.toContain("svg");
    const c = fromStudioHome({
      hero: { heading: "H<script>n()</script>" },
      meetGrowServe: { pillars: [{ id: "a", headline: "P<img src=x>", body: "B<iframe src=//e></iframe>" }] },
      stayConnected: { cards: [{ id: "c1", title: "T<script>n()</script>", body: "b", icon: "i", href: "/" }] },
    });
    const all = JSON.stringify([c.hero, c.meetGrowServe, c.stayConnected]);
    expect(all).not.toMatch(/<script|<img|<iframe/);
  });

  it("a background value cannot close its rule or the style element", () => {
    const css = buildBgCss(
      [{ id: 's1', visible: true, bg: 'red}</style><script>n()</script>' }, { id: 's2', visible: true, bg: 'url("data:image/png;base64,AAAA") center / cover' }],
      { "g:footer": "#1b1c1c", 'x"]{}</style>': "red", "g:evil": "red;}</style>" },
    );
    expect(css).not.toMatch(/<\/style|<script/);
    expect(css).toContain("#1b1c1c");
    expect(css).toContain("data:image/png;base64,AAAA");
    expect(css).not.toContain("evil");
  });
});
