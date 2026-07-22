import { tx } from "@/lib/home-content";

/**
 * StickySplit — a reusable ADDABLE library section (the layout Tyler liked on /about's
 * "What We Believe"): a LEFT column (eyebrow + heading + intro) that stays PINNED while
 * the RIGHT column scrolls through a numbered list of points. Fully editor-native: the
 * section wraps in <div data-section> (via PageComposer), and every string is a
 * data-cms text region so each column + point is editable in place. On mobile the two
 * columns stack. Content is generic placeholder copy the user replaces per page.
 *
 * Server component (CSS `position:sticky`, no JS).
 */
const DEFAULT_POINTS = [
  { title: "First point", body: "Describe this point in your church's voice. Click any text to edit it right here." },
  { title: "Second point", body: "A short paragraph explaining this idea. The heading on the left stays pinned as you read." },
  { title: "Third point", body: "Keep each point focused and scannable — the right column scrolls independently." },
  { title: "Fourth point", body: "Add or edit as many points as you like; the sticky intro anchors the whole section." },
];

export default function StickySplit({ text = {} }: { text?: Record<string, string> }) {
  return (
    <section className="section" style={{ backgroundColor: "var(--color-paper)" }}>
      <div className="container-c3">
        <div className="flex flex-col lg:flex-row lg:gap-20 xl:gap-28">

          {/* LEFT — pinned heading + intro. */}
          <aside className="lg:w-96 shrink-0 mb-12 lg:mb-0">
            <div className="lg:sticky lg:top-32">
              <p
                className="overline"
                style={{ color: "#1cc3af", marginBottom: "1rem" }}
                data-cms="t:stickySplit-eyebrow"
                dangerouslySetInnerHTML={{ __html: tx(text, "stickySplit-eyebrow", "Section") }}
              />
              <h2
                className="display-2"
                style={{ color: "#1b1c1c", marginBottom: "1rem" }}
                data-cms="t:stickySplit-heading"
                dangerouslySetInnerHTML={{ __html: tx(text, "stickySplit-heading", "A pinned heading") }}
              />
              <p
                className="body-lg"
                style={{ color: "rgba(27,28,28,0.65)", lineHeight: 1.7 }}
                data-cms="t:stickySplit-body"
                dangerouslySetInnerHTML={{
                  __html: tx(text, "stickySplit-body", "This intro stays in place while the points on the right scroll past it."),
                }}
              />
              <div
                className="hidden lg:block"
                style={{ width: 40, height: 3, borderRadius: 2, background: "#1cc3af", marginTop: "1.5rem" }}
              />
            </div>
          </aside>

          {/* RIGHT — the points scroll past the pinned left column. */}
          <div className="flex-1 min-w-0 flex flex-col gap-0">
            {DEFAULT_POINTS.map((p, i) => (
              <div
                key={i}
                className={`pb-10 ${i === 0 ? "" : "pt-10"}`}
                style={{ borderBottom: "1px solid rgba(27,28,28,0.10)" }}
              >
                <div className="flex gap-6 md:gap-10">
                  <div className="shrink-0 pt-1">
                    <span className="text-sm font-bold tabular-nums" style={{ color: "#1cc3af", letterSpacing: "0.02em" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className="heading-2 mb-3"
                      style={{ color: "#1b1c1c" }}
                      data-cms={`t:stickySplit-point-${i}-title`}
                      dangerouslySetInnerHTML={{ __html: tx(text, `stickySplit-point-${i}-title`, p.title) }}
                    />
                    <p
                      className="body-lg"
                      style={{ color: "rgba(27,28,28,0.68)", lineHeight: 1.75 }}
                      data-cms={`t:stickySplit-point-${i}-body`}
                      dangerouslySetInnerHTML={{ __html: tx(text, `stickySplit-point-${i}-body`, p.body) }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
