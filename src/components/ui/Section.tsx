import type { CSSProperties, ReactNode } from "react";

/**
 * <Section> — Phase 4, Wave 0 primitive (§2.3).
 *
 * Owns the section shell so pages stop re-declaring padding / background / container.
 * Replaces the ad-hoc `paddingTop: 0` and hand-rolled `clamp()` section overrides
 * (S3) with named, intentional options built on the existing rhythm tokens.
 *
 *   <Section tone="mist" size="default" container centered>…</Section>
 *
 * - `tone`      → the existing `.section-*` classes (light/mist/dark/black/white),
 *                 the source of the alternating light/dark rhythm.
 * - `size`      → named vertical padding drawn from `--section-y` / `--section-y-sm`
 *                 (never a raw clamp). `flush-top`/`flush-bottom`/`flush` let adjacent
 *                 sections butt together intentionally instead of colliding by accident.
 * - `container` → wraps children in `.container-c3` (the standard max-width gutter).
 * - `centered`  → the centered-measure layout (text-center, capped width, auto margins)
 *                 that About/Visit/Counseling/Locations each re-implement by hand.
 * - `bgKey`     → emits the `data-cms-bg` hook so C3 Studio can still paint the section.
 *
 * Server component (no client state) — safe to use anywhere.
 */
export type SectionTone = "light" | "mist" | "dark" | "black" | "white";
export type SectionSize =
  | "default"
  | "sm"
  | "flush-top"
  | "flush-bottom"
  | "flush";

const TONE_CLASS: Record<SectionTone, string> = {
  light: "section-light",
  mist: "section-mist",
  dark: "section-dark",
  black: "section-black",
  white: "section-white",
};

/** Named padding pairs — always a rhythm token, never a hand-picked clamp. */
function pad(size: SectionSize): { paddingTop: string; paddingBottom: string } {
  const full = "var(--section-y)";
  const sm = "var(--section-y-sm)";
  switch (size) {
    case "sm":
      return { paddingTop: sm, paddingBottom: sm };
    case "flush-top":
      return { paddingTop: "0", paddingBottom: full };
    case "flush-bottom":
      return { paddingTop: full, paddingBottom: "0" };
    case "flush":
      return { paddingTop: "0", paddingBottom: "0" };
    case "default":
    default:
      return { paddingTop: full, paddingBottom: full };
  }
}

export interface SectionProps {
  children: ReactNode;
  /** Alternating-rhythm surface. Omit for a transparent section (shows the canvas). */
  tone?: SectionTone;
  /** Named vertical padding from the rhythm tokens. Default: generous `--section-y`. */
  size?: SectionSize;
  /** Wrap children in `.container-c3` (standard max-width + gutter). */
  container?: boolean;
  /** Centered editorial measure: text-center, capped width, auto side margins. */
  centered?: boolean;
  /** Max content width when `centered` (default `--measure` ≈ 720px). */
  maxWidth?: string;
  /** Emits `data-cms-bg="<bgKey>"` so the editor can recolor this section. */
  bgKey?: string;
  id?: string;
  className?: string;
  style?: CSSProperties;
  /** Element to render (default `section`). */
  as?: "section" | "div";
}

export default function Section({
  children,
  tone,
  size = "default",
  container = false,
  centered = false,
  maxWidth,
  bgKey,
  id,
  className = "",
  style,
  as: Tag = "section",
}: SectionProps) {
  const classes = [tone ? TONE_CLASS[tone] : "", className]
    .filter(Boolean)
    .join(" ");

  const centeredStyle: CSSProperties = centered
    ? {
        textAlign: "center",
        maxWidth: maxWidth ?? "var(--measure)",
        marginInline: "auto",
      }
    : {};

  let inner: ReactNode = children;
  if (centered) {
    inner = <div style={centeredStyle}>{children}</div>;
  }
  if (container) {
    inner = <div className="container-c3">{inner}</div>;
  }

  return (
    <Tag
      id={id}
      className={classes || undefined}
      data-cms-bg={bgKey}
      style={{ ...pad(size), ...style }}
    >
      {inner}
    </Tag>
  );
}
