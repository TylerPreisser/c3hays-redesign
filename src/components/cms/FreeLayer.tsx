import type { FreeEl } from "@/lib/cms";

/**
 * FreeLayer — the render surface for DRAG-ANYWHERE freeform elements.
 *
 * Given a page's `freeEls` (persisted in PageOverrides), it paints an absolutely-
 * positioned overlay across the page content and drops each element at its stored
 * position (x as a % of page width, y as px from the page top). The overlay itself is
 * pointer-events:none so it never blocks the page beneath; each element re-enables
 * pointer events so it stays clickable (public) and grabbable (editor).
 *
 * Editor-native by construction:
 *   • text   → data-cms="free:<id>"      (EditBridge makes it contenteditable)
 *   • button → data-cms-link="free:<id>" (EditBridge opens the link inspector)
 *   • both   → data-cms-free="<id>"      (EditBridge drag handle: free-move + snap)
 *
 * On the PUBLIC site EditBridge is inert, so text simply renders and a button links.
 * Absent/empty freeEls ⇒ renders nothing (byte-identical to before for every page).
 */
export default function FreeLayer({ freeEls }: { freeEls?: FreeEl[] }) {
  const els = Array.isArray(freeEls) ? freeEls : [];
  if (els.length === 0) return null;
  return (
    <div
      data-cms-free-layer=""
      aria-hidden={false}
      style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 40 }}
    >
      {els.map((el) => {
        const common: React.CSSProperties = {
          position: "absolute",
          left: `${el.xPct}%`,
          top: `${el.yPx}px`,
          pointerEvents: "auto",
          maxWidth: "min(90%, 40rem)",
        };
        if (el.kind === "button") {
          return (
            <a
              key={el.id}
              data-cms-link={`free:${el.id}`}
              data-cms-free={el.id}
              data-cms-free-kind="button"
              href={el.href || "#"}
              style={{
                ...common,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: ".7rem 1.4rem",
                borderRadius: "999px",
                background: "var(--color-teal, #1cc3af)",
                color: "var(--color-ink, #0b0d0e)",
                fontWeight: 700,
                fontFamily: "var(--font-sans)",
                textDecoration: "none",
                boxShadow: "0 10px 26px rgba(0,0,0,.25)",
                whiteSpace: "nowrap",
              }}
            >
              <span data-cms-link-label dangerouslySetInnerHTML={{ __html: el.text || "Button" }} />
            </a>
          );
        }
        return (
          <div
            key={el.id}
            data-cms={`free:${el.id}`}
            data-cms-free={el.id}
            data-cms-free-kind="text"
            style={{
              ...common,
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
              fontSize: "clamp(1rem, 2.4vw, 1.5rem)",
              lineHeight: 1.3,
              color: "var(--color-ink, #1b1c1c)",
            }}
            dangerouslySetInnerHTML={{ __html: el.text || "Add your text" }}
          />
        );
      })}
    </div>
  );
}
