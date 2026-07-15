import { tx } from "@/lib/home-content";

/**
 * About → "Our Values" — REDESIGNED (P3).
 *
 * Tyler's note: the old version ("Scripture First / Generosity / Every Generation"
 * in a generic 3-column icon-card grid) looked like a bad template AND wasn't the
 * church's real framework. This replaces it with C3's ACTUAL on-brand values: the
 * three-fold mission from celebratejesus.org — "We exist to meet with Him, grow in
 * Him, and serve through Him."
 *
 * Layout is deliberately editorial, not a boxed-card cliché: an oversized display
 * verb per value, a teal index + hairline rule, and generous vertical rhythm on a
 * dark canvas. Every string is CMS-editable via `tx`.
 */
const VALUE_DEFAULTS = [
  {
    id: "meet",
    word: "Meet",
    line: "meet with Him",
    body: "We gather to welcome the presence of God — meeting with Him together in worship, prayer, and His Word.",
  },
  {
    id: "grow",
    word: "Grow",
    line: "grow in Him",
    body: "We grow in Him — rooted in Scripture and shaped by community, becoming more like Jesus one step at a time.",
  },
  {
    id: "serve",
    word: "Serve",
    line: "serve through Him",
    body: "We serve through Him — carrying His love beyond our walls into Hays, Colby, and to the ends of the earth.",
  },
];

export default function OurValues({
  text,
}: {
  text?: Record<string, string>;
}) {
  return (
    <section
      className="section"
      style={{ backgroundColor: "#1b1c1c", overflow: "hidden" }}
    >
      <div className="container-c3">
        {/* Header — generous space below before the values */}
        <div
          className="max-w-2xl"
          style={{ marginBottom: "clamp(3.5rem, 7vw, 6rem)" }}
        >
          <p
            className="overline mb-5"
            style={{ color: "#1cc3af" }}
            data-cms="t:about-values-eyebrow"
            dangerouslySetInnerHTML={{
              __html: tx(text, "about-values-eyebrow", "What We Live By"),
            }}
          />
          <h2
            className="display-2 text-white mb-6"
            data-cms="t:about-values-title"
            dangerouslySetInnerHTML={{
              __html: tx(text, "about-values-title", "Our Values"),
            }}
          />
          <p
            className="body-lg"
            style={{ color: "rgba(255,255,255,0.62)", lineHeight: 1.7 }}
            data-cms="t:about-values-lead"
            dangerouslySetInnerHTML={{
              __html: tx(
                text,
                "about-values-lead",
                "Jesus is central to everything we do. We exist to <em class=\"not-italic\" style=\"color:#1cc3af\">meet</em> with Him, <em class=\"not-italic\" style=\"color:#1cc3af\">grow</em> in Him, and <em class=\"not-italic\" style=\"color:#1cc3af\">serve</em> through Him."
              ),
            }}
          />
        </div>

        {/* Editorial value rows */}
        <div className="flex flex-col">
          {VALUE_DEFAULTS.map((v, i) => (
            <div
              key={v.id}
              className="values-row group grid grid-cols-1 md:grid-cols-12 items-baseline"
              style={{
                gap: "clamp(1.25rem, 3vw, 3rem)",
                paddingTop: "clamp(2.25rem, 4vw, 3.5rem)",
                paddingBottom: "clamp(2.25rem, 4vw, 3.5rem)",
                borderTop: "1px solid rgba(255,255,255,0.12)",
                borderBottom:
                  i === VALUE_DEFAULTS.length - 1
                    ? "1px solid rgba(255,255,255,0.12)"
                    : undefined,
              }}
            >
              {/* Index */}
              <div className="md:col-span-1">
                <span
                  className="tabular-nums"
                  style={{
                    color: "#1cc3af",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Oversized verb */}
              <div className="md:col-span-5">
                <h3
                  className="text-white"
                  data-cms={`t:about-value-${v.id}-word`}
                  style={{
                    fontFamily: "var(--font-display, inherit)",
                    fontWeight: 800,
                    lineHeight: 0.95,
                    letterSpacing: "-0.02em",
                    fontSize: "clamp(2.75rem, 6vw, 5rem)",
                    margin: 0,
                  }}
                  dangerouslySetInnerHTML={{
                    __html: tx(text, `about-value-${v.id}-word`, v.word),
                  }}
                />
                <span
                  className="block mt-3"
                  style={{
                    color: "#1cc3af",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    letterSpacing: "0.01em",
                  }}
                  data-cms={`t:about-value-${v.id}-line`}
                  dangerouslySetInnerHTML={{
                    __html: tx(text, `about-value-${v.id}-line`, `We exist to ${v.line}.`),
                  }}
                />
              </div>

              {/* Body */}
              <div className="md:col-span-6">
                <p
                  className="body-lg"
                  style={{
                    color: "rgba(255,255,255,0.66)",
                    lineHeight: 1.7,
                    maxWidth: "46ch",
                    margin: 0,
                  }}
                  data-cms={`t:about-value-${v.id}-body`}
                  dangerouslySetInnerHTML={{
                    __html: tx(text, `about-value-${v.id}-body`, v.body),
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
