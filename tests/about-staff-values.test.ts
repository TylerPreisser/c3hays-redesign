// @vitest-environment jsdom
/**
 * P3 About — two of Tyler's hard requirements, locked structurally:
 *   (1) Our Values must carry the REAL on-brand C3 framework (Meet / Grow / Serve),
 *       not the old generic invented values ("Scripture First", "Generosity", ...).
 *   (2) Meet Our Staff must list the REAL 14-person leadership roster (Brant Rice =
 *       Senior Pastor), with NO placeholder ("Lead Pastor", "Pastor Lance Carter").
 *
 * We render the REAL about components to static markup and assert on content — a
 * guarantee independent of the CMS/editor. RED-FIRST: the components don't exist yet.
 */
import { describe, it, expect, beforeAll } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { staff } from "@/data/staff";

let values = "";
let staffHtml = "";

beforeAll(async () => {
  const OurValues = (await import("@/components/about/OurValues")).default;
  const StaffGrid = (await import("@/components/about/StaffGrid")).default;
  values = renderToStaticMarkup(createElement(OurValues, {}));
  staffHtml = renderToStaticMarkup(createElement(StaffGrid, {}));
});

describe("About — Our Values (Meet / Grow / Serve)", () => {
  it("shows the real three-fold C3 framework", () => {
    expect(values).toContain("Meet");
    expect(values).toContain("Grow");
    expect(values).toContain("Serve");
  });

  it("carries the verbatim mission line", () => {
    expect(values).toContain("meet with Him");
    expect(values).toContain("grow in Him");
    expect(values).toContain("serve through Him");
  });

  it("does NOT reproduce the old generic invented values", () => {
    expect(values).not.toContain("Scripture First");
    expect(values).not.toContain("Authentic Community");
    expect(values).not.toContain("Every Generation");
  });
});

describe("About — Meet Our Staff (real roster)", () => {
  it("renders all 14 real staff names", () => {
    expect(staff).toHaveLength(14);
    for (const m of staff) expect(staffHtml).toContain(m.name);
  });

  it("shows key real name→title pairings", () => {
    expect(staffHtml).toContain("Brant Rice");
    expect(staffHtml).toContain("Senior Pastor");
    expect(staffHtml).toContain("Kirby Benisch");
    expect(staffHtml).toContain("Campus Pastor");
  });

  it("groups by campus with the real labels", () => {
    expect(staffHtml).toContain("Elder Staff");
    expect(staffHtml).toContain("Hays Campus Staff");
    expect(staffHtml).toContain("Colby Campus Staff");
  });

  it("has NO placeholder people", () => {
    expect(staffHtml).not.toContain("Lance Carter");
    expect(staffHtml).not.toContain("Lead Pastor");
    expect(staffHtml).not.toContain("Worship Pastor");
  });
});
