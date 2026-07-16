import type { CSSProperties, ReactNode } from "react";

/**
 * <Stack> — Phase 4, Wave 0 primitive (§2.4).
 *
 * A flex column whose vertical spacing comes from the named rhythm tokens via
 * `gap` — NOT margins. Because it uses `gap`, it is completely immune to the S1
 * margin-reset bug (layered reset zeroing `mb-*`), and every eyebrow→title→body→cta
 * group reads identically everywhere. Replaces the scattered `mb-*` / inline-margin
 * spacing that pages hand-rolled.
 *
 *   <Stack gap="body">…</Stack>   // 24px between children
 *   <Stack gap="cta" align="center">…</Stack>
 *
 * Server component.
 */
export type StackGap = "eyebrow" | "heading" | "body" | "cta" | "block";
export type StackAlign = "start" | "center" | "end" | "stretch";

const ALIGN: Record<StackAlign, string> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  stretch: "stretch",
};

export interface StackProps {
  children: ReactNode;
  /** Vertical gap, drawn from the `--space-*` rhythm tokens. Default: `body`. */
  gap?: StackGap;
  /** Cross-axis alignment. `center` also centers text. Default: `start`. */
  align?: StackAlign;
  className?: string;
  style?: CSSProperties;
  as?: "div" | "section" | "header" | "li" | "article";
}

export default function Stack({
  children,
  gap = "body",
  align = "start",
  className,
  style,
  as: Tag = "div",
}: StackProps) {
  return (
    <Tag
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: ALIGN[align],
        textAlign: align === "center" ? "center" : undefined,
        gap: `var(--space-${gap})`,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
