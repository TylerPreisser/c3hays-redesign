/**
 * The News page renders only sanitised issue HTML. A raw mail copy would carry a script, a per-recipient tracking
 * link and inline handlers; none may reach the page. Newest first; an item with no HTML is not shown.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { adaptIssue, sanitizeIssueHtml } from "@/lib/news-issues";

const raw = JSON.parse(readFileSync(join(__dirname, "fixtures/studio-newsletter-issues.json"), "utf8")) as unknown[];

describe("news issues", () => {
  it("strips script, handlers, styles, tracking and unsafe links; keeps allow-listed markup", () => {
    const issue = adaptIssue(raw[1])!;
    const html = issue.sections[0].body;
    for (const bad of ["<script", "onclick", "style=", "list-manage", "javascript:", "http://insecure", "alert(1)"]) expect(html).not.toContain(bad);
    expect(html).toContain('<a href="https://example.org/page?e=abc"');
    expect(html).toContain("<b>bold</b>");
    expect(html).toContain("1 &lt; 2");
    expect(issue.date).toBe("2026-07-31");
    expect(issue.excerpt).not.toContain("alert(1)");
    expect(issue.excerpt).toContain("1 < 2");
  });
  it("drops an item with no HTML and orders by date", () => {
    const issues = raw.map(adaptIssue).filter(Boolean);
    expect(issues.map((i) => i!.id)).toEqual(["iss-older", "iss-newest"]);
  });
  it("is idempotent", () => {
    const once = sanitizeIssueHtml(String((raw[1] as { html: string }).html));
    expect(sanitizeIssueHtml(once)).toBe(once);
  });
});
