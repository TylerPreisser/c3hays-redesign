// @vitest-environment node
import { describe, it, expect, vi, afterEach } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";

// These render whole pages and the root layout (a cold import of every component): allow for a loaded machine.
vi.setConfig({ testTimeout: 60_000 });
vi.mock("next/navigation", () => ({ usePathname: () => "/", useRouter: () => ({}), useSearchParams: () => new URLSearchParams() }));
vi.mock("next/font/google", () => ({ Hanken_Grotesk: () => ({ variable: "font-x", className: "font-x" }) }));

/**
 * A phone, email or address staff TYPED over the built-in one is what a visitor gets: the printed words, the tel: and
 * mailto: behind them, and the structured data. Each case publishes a text override on the real `t:` path and reads the
 * public HTML.
 */
const PHONE = "(555) 010-0199", TEL = "tel:5550100199";
const EMAIL = "typed-office@example.org";
const STREET = "1 Typed Way", CSZ = "Typedville, KS 67000";
const COLBY = "9 Colby Typed<br />Colby, KS 67701";

function studio(pages: Record<string, Record<string, string>>, globals: Record<string, string> = {}) {
  vi.stubGlobal("fetch", vi.fn(async (url: string) => {
    const u = new URL(url);
    const m = /^\/api\/content\/page\/(.+)$/.exec(u.pathname);
    let body: unknown = {};
    if (m) body = { text: pages[decodeURIComponent(m[1])] ?? {} };
    else if (u.pathname === "/api/content/globals") body = { text: globals };
    return { ok: true, json: async () => body } as Response;
  }));
  vi.stubEnv("NEXT_PUBLIC_CMS_URL", "https://studio.example.test");
}
async function page(modPath: string) {
  vi.resetModules();
  const mod = await import(/* @vite-ignore */ modPath);
  return renderToStaticMarkup(await (mod.default as (p: object) => Promise<React.ReactElement>)({ searchParams: Promise.resolve({}) }));
}
async function layout() {
  vi.resetModules();
  const Layout = (await import("@/app/layout")).default;
  const html = renderToStaticMarkup(await Layout({ children: createElement("main", null, "x") }));
  const ld = JSON.parse(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/.exec(html)![1]);
  return { html, ld };
}
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

describe("a typed phone number reaches visitors, with its tel: link", () => {
  it("Hays page", async () => {
    studio({ "/locations/hays": { "hays-contact-phone": PHONE } });
    const html = await page("@/app/locations/hays/page");
    expect(html).toContain(PHONE);
    expect(html).toContain(`href="${TEL}"`);
    expect(html).not.toContain('href="tel:7856255483"');
  });
  it("Connect page", async () => {
    studio({ "/connect": { "connect-phone-label": PHONE } });
    const html = await page("@/app/connect/page");
    expect(html).toContain(PHONE);
    expect(html).toContain(`href="${TEL}"`);
  });
  it("footer on every page, and the structured data", async () => {
    studio({}, { "footer-phone-label": PHONE });
    const { html, ld } = await layout();
    expect(html).toContain(PHONE);
    expect(html).toContain(`href="${TEL}"`);
    expect(ld.telephone).toBe("5550100199");
  });
  it("an explicit typed link still wins over the label", async () => {
    studio({}, { "footer-phone-label": PHONE, "footer-phone-href": "tel:+15550000000" });
    expect((await layout()).html).toContain('href="tel:+15550000000"');
  });
});

describe("a typed email address reaches visitors, with its mailto: link", () => {
  it("Hays page", async () => {
    studio({ "/locations/hays": { "hays-contact-email": EMAIL } });
    const html = await page("@/app/locations/hays/page");
    expect(html).toContain(EMAIL);
    expect(html).toContain(`href="mailto:${EMAIL}"`);
  });
  it("Connect page", async () => {
    studio({ "/connect": { "connect-email-label": EMAIL } });
    const html = await page("@/app/connect/page");
    expect(html).toContain(EMAIL);
    expect(html).toContain(`href="mailto:${EMAIL}"`);
  });
  it("footer, and the structured data", async () => {
    studio({}, { "footer-email-label": EMAIL });
    const { html, ld } = await layout();
    expect(html).toContain(`href="mailto:${EMAIL}"`);
    expect(ld.email).toBe(EMAIL);
  });
  it("text that is not an email address keeps the built-in link (the words still show)", async () => {
    studio({ "/locations/hays": { "hays-contact-email": "ask at the front desk" } });
    const html = await page("@/app/locations/hays/page");
    expect(html).toContain("ask at the front desk");
    expect(html).toContain('href="mailto:office@c3hays.com"');
  });
});

describe("a typed address reaches visitors", () => {
  it("Hays page", async () => {
    studio({ "/locations/hays": { "hays-address-street": STREET, "hays-address-citystatezip": CSZ } });
    const html = await page("@/app/locations/hays/page");
    expect(html).toContain(STREET);
    expect(html).toContain(CSZ);
  });
  it("Colby page", async () => {
    studio({ "/locations/colby": { "colby-address": COLBY } });
    expect(await page("@/app/locations/colby/page")).toContain("9 Colby Typed");
  });
  it("Plan a Visit, both campuses", async () => {
    studio({ "/visit": { "visit-campus-hays-address": "7 Visit Hays Rd", "visit-campus-colby-address": "8 Visit Colby Rd" } });
    const html = await page("@/app/visit/page");
    expect(html).toContain("7 Visit Hays Rd");
    expect(html).toContain("8 Visit Colby Rd");
  });
  it("footer, and the structured data follow the typed Hays address", async () => {
    studio({}, { "footer-campus-hays-addr": `${STREET}<br/>${CSZ}`, "footer-campus-colby-addr": COLBY });
    const { html, ld } = await layout();
    expect(html).toContain(STREET);
    expect(html).toContain("9 Colby Typed");
    expect(ld.address).toMatchObject({ streetAddress: STREET, addressLocality: "Typedville", addressRegion: "KS", postalCode: "67000" });
  });
  it("structured data cannot be broken out of its script tag by typed text", async () => {
    studio({}, { "footer-phone-label": "</script><script>alert(1)</script> 555 010 0199" });
    const { html } = await layout();
    expect(html).not.toContain("</script><script>alert(1)");
  });
});
