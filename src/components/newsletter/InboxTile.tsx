import type { CSSProperties, ReactNode } from "react";
import { Mail } from "lucide-react";
import NewsletterForm from "@/components/layout/NewsletterForm";

/**
 * <InboxTile> — Phase 4, NL2.
 *
 * The COMPACT subscribe tile that replaces the old giant centered "Get it in
 * your inbox" hero block. Designed to sit OFF TO THE SIDE of the issue browser
 * (a sidebar aside), not as the page centerpiece. Premium contained surface with
 * a teal-tinted mail chip, short copy, and the shared <NewsletterForm>.
 *
 * `title`/`body` accept ReactNode so the page can pass CMS-driven nodes (with
 * their own data-cms hooks); sensible defaults keep it self-sufficient.
 *
 * Server component (the form itself is the only client boundary).
 */
export interface InboxTileProps {
  title?: ReactNode;
  body?: ReactNode;
  /** Small reassurance line under the form. */
  note?: ReactNode;
  /** Sticky on tall desktop columns. Default: true. */
  sticky?: boolean;
  className?: string;
  style?: CSSProperties;
}

export default function InboxTile({
  title,
  body,
  note,
  sticky = true,
  className,
  style,
}: InboxTileProps) {
  const surface: CSSProperties = {
    position: sticky ? "sticky" : undefined,
    top: sticky ? "6rem" : undefined,
    display: "flex",
    flexDirection: "column",
    gap: "var(--space-heading)",
    padding: "clamp(1.75rem, 3vw, 2.25rem)",
    borderRadius: "var(--radius-md)",
    background: "linear-gradient(180deg, #ffffff 0%, #fbfffe 100%)",
    border: "1px solid rgba(28,195,175,0.22)",
    boxShadow: "0 20px 50px rgba(28,195,175,0.10)",
    ...style,
  };

  return (
    <aside className={className} style={surface} aria-label="Subscribe to The C3 Weekly">
      <span
        className="inline-flex items-center justify-center"
        style={{
          width: "3rem",
          height: "3rem",
          borderRadius: "var(--radius-sm)",
          background: "rgba(28,195,175,0.12)",
          color: "var(--color-teal)",
        }}
        aria-hidden="true"
      >
        <Mail size={24} />
      </span>

      <div>
        <p className="overline" style={{ color: "var(--color-teal-deep)", marginBottom: "0.5rem" }}>
          Subscribe
        </p>
        <h3 className="heading-3" style={{ color: "var(--color-ink)" }}>
          {title ?? "Get it in your inbox"}
        </h3>
        <p
          className="body-sm"
          style={{ color: "var(--color-mute)", marginTop: "0.6rem", lineHeight: 1.6 }}
        >
          {body ?? "One short email each week — what's coming up, this week's message, and simple next steps."}
        </p>
      </div>

      <NewsletterForm />

      <p className="body-sm" style={{ color: "rgba(27,28,28,0.45)", fontSize: "0.78rem" }}>
        {note ?? "No spam. Unsubscribe anytime."}
      </p>
    </aside>
  );
}
