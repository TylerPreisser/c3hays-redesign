import type { CSSProperties, ReactNode } from "react";
import Stack from "./Stack";

/**
 * <SectionHeader> — Phase 4, Wave 0 primitive (§2.4 / §3.7).
 *
 * The eyebrow + heading (+ optional lead) intro that ~11 sections re-implement by
 * hand. Uses `.overline` + a display heading + `.body-lg`, spaced with the rhythm
 * tokens via nested <Stack>s (gap-based, so immune to the margin-reset bug):
 *   eyebrow → heading  = --space-eyebrow
 *   heading-group → lead = --space-heading
 *
 *   <SectionHeader eyebrow="Our Story" title="Who We Are" lead="A relationship, not religion." />
 *
 * `eyebrow`/`title`/`lead` accept ReactNode, so a page can pass a node carrying its
 * own `data-cms` editor hook + `dangerouslySetInnerHTML` when CMS-driven.
 *
 * Server component.
 */
export interface SectionHeaderProps {
  title: ReactNode;
  eyebrow?: ReactNode;
  lead?: ReactNode;
  /** Center the intro (centered-measure sections). Default: left. */
  align?: "start" | "center";
  /** Heading element (default h2). */
  titleAs?: "h1" | "h2" | "h3";
  /** Display class for the heading (default `display-2`). */
  titleClassName?: string;
  /** Cap the lead's readable width (default `--measure`). */
  leadMaxWidth?: string;
  className?: string;
  style?: CSSProperties;
}

export default function SectionHeader({
  title,
  eyebrow,
  lead,
  align = "start",
  titleAs: TitleTag = "h2",
  titleClassName = "display-2",
  leadMaxWidth,
  className,
  style,
}: SectionHeaderProps) {
  return (
    <Stack gap="heading" align={align} className={className} style={style} as="header">
      <Stack gap="eyebrow" align={align}>
        {eyebrow != null && <p className="overline">{eyebrow}</p>}
        <TitleTag className={titleClassName}>{title}</TitleTag>
      </Stack>
      {lead != null && (
        <p
          className="body-lg"
          style={{
            color: "var(--color-mute)",
            maxWidth: leadMaxWidth ?? "var(--measure)",
            marginInline: align === "center" ? "auto" : undefined,
          }}
        >
          {lead}
        </p>
      )}
    </Stack>
  );
}
