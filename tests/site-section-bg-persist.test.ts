// @vitest-environment node
/**
 * SITE side of the section-background persistence bug (Symptom 2).
 *
 * On reload, the SITE's SSR preview render must reflect the editor's saved section
 * background. The editor's content API returns each section with a `bg` field
 * (e.g. mission.bg = "#1cc3af"); the site must thread that `bg` from the API
 * response through `getHomeContent` → `fromStudioHome` → `buildBgCss` so the SSR
 * `<style>` carries `[data-section="mission"]>*{background:#1cc3af !important}`.
 *
 * RED-FIRST intent: if the site dropped `sections[].bg` anywhere on the read path,
 * the emitted CSS would carry NO `[data-section="mission"]` rule and the reload
 * would keep the published inline color — exactly the live symptom.
 *
 * Field-name contract (aligned with editor coder bgfix-editor): `sections[].bg`.
 */
import { describe, it, expect, vi, afterEach } from "vitest";
import { fromStudioHome } from "@/lib/home-content";
import { buildBgCss } from "@/lib/backgrounds";

const EDITOR = "https://c3-studio.example.workers.dev";

/** Re-import cms.ts fresh with NEXT_PUBLIC_CMS_URL set (captured at module load). */
async function loadCms(cmsUrl: string) {
  vi.resetModules();
  vi.stubEnv("NEXT_PUBLIC_CMS_URL", cmsUrl);
  return import("@/lib/cms");
}

/** Editor content-API response shape: a section carrying a saved background. */
const API_RESPONSE = {
  sections: [
    { id: "hero", visible: true },
    { id: "mission", visible: true, bg: "#1cc3af" },
    { id: "meetGrowServe", visible: true },
  ],
};

function mockFetch(json: unknown) {
  const fn = vi.fn(async () => ({ ok: true, json: async () => json }) as Response);
  vi.stubGlobal("fetch", fn);
  return fn;
}

afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

describe("SITE — section bg persists from the content API into the SSR stylesheet", () => {
  it("getHomeContent(preview) yields a mission section carrying bg, and buildBgCss emits its rule", async () => {
    mockFetch(API_RESPONSE); // draft endpoint returns the saved section bg
    const cms = await loadCms(EDITOR);

    // 1) The site's read of the editor draft must not drop sections[].bg.
    const raw = await cms.getHomeContent("tok-abc");
    const c = fromStudioHome(raw);
    const mission = c.sections.find((s) => s.id === "mission");
    expect(mission).toBeTruthy();
    expect(mission!.bg).toBe("#1cc3af");

    // 2) The exact SSR rule page.tsx paints must include the section background.
    const css = buildBgCss(c.sections, c.bgFill);
    expect(css).toContain('[data-section="mission"]>*{background:#1cc3af !important}');
  });

  it("published read (no preview) also threads sections[].bg through to the stylesheet", async () => {
    mockFetch(API_RESPONSE);
    const cms = await loadCms(EDITOR);
    const c = fromStudioHome(await cms.getHomeContent());
    expect(buildBgCss(c.sections, c.bgFill)).toContain(
      '[data-section="mission"]>*{background:#1cc3af !important}',
    );
  });
});
