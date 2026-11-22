// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { createRoot } from "react-dom/client";
import { act } from "react";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

/** When the check is missing or refused, the sentence names no position and the visitor is taken to the widget. */
describe("the Turnstile prompt", () => {
  afterEach(() => { document.body.innerHTML = ""; });
  it("the sentence has no above or below", async () => {
    const { SIGNUP_ERRORS } = await import("@/components/newsletter/useSignup");
    expect(SIGNUP_ERRORS.captcha).toBe("Please complete the check, then send again.");
    expect(SIGNUP_ERRORS.captcha).not.toMatch(/\b(above|below)\b/i);
  });
  it("focus lands on the widget and it is scrolled into view when attention is asked for", async () => {
    const { default: TurnstileWidget } = await import("@/components/newsletter/TurnstileWidget");
    const scroll = vi.fn();
    (Element.prototype as unknown as { scrollIntoView: unknown }).scrollIntoView = scroll;
    const host = document.createElement("div");
    document.body.appendChild(host);
    const root = createRoot(host);
    await act(async () => { root.render(<TurnstileWidget siteKey="k" onToken={() => {}} attention={false} />); });
    expect(document.activeElement).toBe(document.body);
    await act(async () => { root.render(<TurnstileWidget siteKey="k" onToken={() => {}} attention />); });
    const box = host.querySelector("[data-turnstile]") as HTMLElement;
    expect(document.activeElement).toBe(box);
    expect(scroll).toHaveBeenCalled();
    await act(async () => root.unmount());
  });
});
