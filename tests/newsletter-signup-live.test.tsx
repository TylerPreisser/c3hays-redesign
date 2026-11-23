// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

// The signup form stays in the code behind NEWSLETTER_SIGNUP_LIVE; with it switched on it is the working form.
vi.mock("@/lib/newsletter-signup", async (orig) => ({ ...(await orig<typeof import("@/lib/newsletter-signup")>()), NEWSLETTER_SIGNUP_LIVE: true }));

describe("newsletter signup switched on", () => {
  it("the footer form says what happens, is required, posts, and uses one name", async () => {
    const { default: Form } = await import("@/components/layout/NewsletterForm");
    const { SignupConfigProvider } = await import("@/providers/SignupConfigProvider");
    const html = renderToStaticMarkup(createElement(SignupConfigProvider as never, { turnstileSiteKey: "k" } as never, createElement(Form)));
    expect(html).not.toContain("does not subscribe");
    expect(html).toContain("the church office will add you to C3 News");
    expect(html).toContain('method="post"');
    expect(html).toContain('action="/api/newsletter/subscribe"');
    expect(html).toMatch(/<input[^>]*type="email"[^>]*required|<input[^>]*required[^>]*type="email"/);
    expect(html).not.toContain("C3 Weekly");
  });
});
