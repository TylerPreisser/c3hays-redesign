// @vitest-environment node
/**
 * P3 About/Beliefs — the "What We Believe" page must carry the celebratejesus.org
 * Statement of Faith VERBATIM (all 14 sections, exact wording). This locks the data
 * so a future paraphrase (the old copy said "one eternal, all-knowing... God") can't
 * silently regress the doctrine.
 *
 * RED-FIRST: before this change beliefs.ts had 11 paraphrased items with a single
 * `body` string and no `About the Father` / `Second Coming` / `Ordinances` sections.
 */
import { describe, it, expect } from "vitest";
import { beliefs } from "@/data/beliefs";

describe("Statement of Faith — verbatim", () => {
  it("has all 14 sections in site order", () => {
    expect(beliefs.map((b) => b.id)).toEqual([
      "god",
      "father",
      "jesus",
      "holy-spirit",
      "bible",
      "humanity",
      "salvation",
      "eternity",
      "second-coming",
      "church",
      "marriage",
      "ordinances",
      "baptism",
      "communion",
    ]);
  });

  it("every section has at least one non-empty paragraph", () => {
    for (const b of beliefs) {
      expect(Array.isArray(b.paragraphs)).toBe(true);
      expect(b.paragraphs.length).toBeGreaterThan(0);
      for (const p of b.paragraphs) expect(p.trim().length).toBeGreaterThan(0);
    }
  });

  const flat = (id: string) => beliefs.find((b) => b.id === id)!.paragraphs.join(" ");

  it("God — verbatim opening + Trinity language", () => {
    expect(flat("god")).toContain(
      "We believe in one true and eternal God, unchanging, unchangeable."
    );
    expect(flat("god")).toContain("the relationship described by the term");
  });

  it("Marriage — verbatim (between a man and a woman)", () => {
    expect(flat("marriage")).toBe(
      "We believe God created marriage to be between a man and a woman, to be a life-long commitment, and that the foundation of marriage is Christ; designed to be a reflection of His love."
    );
  });

  it("Communion — verbatim crackers and juice", () => {
    expect(flat("communion")).toContain(
      "crackers and juice symbolize Christ’s body broken and His blood shed on our behalf"
    );
  });

  it("Bible — verbatim God-breathed authority", () => {
    expect(flat("bible")).toContain("We take Biblical truth very seriously.");
    expect(flat("bible")).toContain("without error in the original writings");
  });

  it("does NOT contain the old paraphrased copy", () => {
    const all = beliefs.flatMap((b) => b.paragraphs).join(" ");
    expect(all).not.toContain("one eternal, all-knowing, all-powerful, and all-wise God");
    expect(all).not.toContain("sacred covenant between one man and one woman");
  });
});
