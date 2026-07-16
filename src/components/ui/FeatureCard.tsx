import type { CSSProperties, ReactNode } from "react";

/**
 * <FeatureCard> — Phase 4, Wave 0 primitive (§3.1).
 *
 * Premium, CONTAINED, EQUAL-HEIGHT feature/value card. Fixes the "tacky" bare,
 * ragged text columns (Visit V2's What-to-Expect trio, Counseling policy cards,
 * Newsletter "what's inside", Connect next-steps).
 *
 * Equal height: the card is a flex column and the body flexes to fill, so a CSS
 * grid row with `align-items: stretch` (grid default) makes every card in the row
 * the same height regardless of copy length. Contained surface: `--radius-md`
 * rounded tile, `--shadow-rest` → `--shadow-hover` bloom on hover (`.bento-tile`).
 *
 *   <FeatureCard icon={<Users/>} title="Come As You Are" body="No dress code — just come." />
 *   <FeatureCard tone="dark" title="Fees & Policies" body="…" href="/counseling" linkLabel="Learn more" />
 *
 * Server component (CSS-only hover via `.bento-tile`).
 */
export type FeatureCardTone = "light" | "dark";

export interface FeatureCardProps {
  title: ReactNode;
  body?: ReactNode;
  /** Icon node rendered in a rounded teal-tinted chip above the title. */
  icon?: ReactNode;
  /** Optional footer link (arrow-link). */
  href?: string;
  linkLabel?: ReactNode;
  /** `light` = mist tile on light sections; `dark` = glass tile on ink sections. */
  tone?: FeatureCardTone;
  /** Extra body content below `body` (e.g. a list). */
  children?: ReactNode;
  /** Emits `data-cms-bg` so the tile can be recolored in the editor. */
  bgKey?: string;
  className?: string;
  style?: CSSProperties;
}

export default function FeatureCard({
  title,
  body,
  icon,
  href,
  linkLabel,
  tone = "light",
  children,
  bgKey,
  className,
  style,
}: FeatureCardProps) {
  const dark = tone === "dark";

  const surface: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    padding: "clamp(1.75rem, 3vw, 2.5rem)",
    borderRadius: "var(--radius-md)",
    boxShadow: dark ? "none" : "var(--shadow-rest)",
    background: dark ? "rgba(255,255,255,0.06)" : "var(--color-mist)",
    border: dark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(27,28,28,0.06)",
    color: dark ? "#fff" : "var(--color-ink)",
    ...style,
  };

  const iconChip: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "3rem",
    height: "3rem",
    borderRadius: "var(--radius-sm)",
    background: dark ? "rgba(28,195,175,0.18)" : "rgba(28,195,175,0.12)",
    color: "var(--color-teal)",
    marginBottom: "var(--space-heading)",
  };

  return (
    <div
      className={["bento-tile", className].filter(Boolean).join(" ")}
      data-cms-bg={bgKey}
      style={surface}
    >
      {icon != null && <div style={iconChip} aria-hidden="true">{icon}</div>}
      <h3 className="heading-3">{title}</h3>
      {body != null && (
        <p
          className="body-base"
          style={{
            marginTop: "var(--space-eyebrow)",
            color: dark ? "rgba(255,255,255,0.72)" : "var(--color-mute)",
          }}
        >
          {body}
        </p>
      )}
      {children}
      {/* Body flexes to push any link to the bottom → equal-height cards align. */}
      <div style={{ flex: 1 }} />
      {href && (
        <a
          href={href}
          className="arrow-link"
          style={{
            marginTop: "var(--space-cta)",
            color: "var(--color-teal-deep)",
          }}
        >
          {linkLabel ?? "Learn more"}
          <span className="arrow" aria-hidden="true">→</span>
        </a>
      )}
    </div>
  );
}
