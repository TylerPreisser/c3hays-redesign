import type { CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export interface GiveCardProps {
  /**
   * `data-cms-bg` id — makes THIS tile's background independently recolorable in
   * C3 Studio (contract §1 thing #2). Every card that owns a surface carries one.
   */
  bgKey: string;
  /** Optional teal keyline icon — the shared motif that ties every give tile together. */
  icon?: LucideIcon;
  children: ReactNode;
  style?: CSSProperties;
}

/**
 * GiveCard — the ONE card language used by BOTH give-impact (the "why" facets) and
 * give-ways (the "how" methods). Extracting it guarantees the two sections share an
 * identical tile chrome — bone surface, clay hairline, the 30px feature radius, one
 * resting shadow, and the teal icon chip — which is what makes /give read as a single
 * visual system instead of three disjoint blocks.
 *
 * Presentational only: the caller supplies its own <Tx> heads/bodies and <EditableLink>
 * buttons as children, so text + links stay editable per-card by construction. The tile's
 * background is editable via `data-cms-bg={bgKey}`.
 *
 * Server component.
 */
export default function GiveCard({ bgKey, icon: Icon, children, style }: GiveCardProps) {
  return (
    <div
      data-cms-bg={bgKey}
      className="flex flex-col"
      style={{
        height: "100%",
        background: "var(--color-bone)",
        border: "1px solid rgba(27,28,28,0.08)",
        borderRadius: "var(--radius-md)",
        padding: "clamp(1.75rem, 3vw, 2.25rem)",
        boxShadow: "var(--shadow-rest)",
        ...style,
      }}
    >
      {Icon && (
        <div
          aria-hidden
          className="grid place-items-center"
          style={{
            width: 52,
            height: 52,
            borderRadius: 16,
            background: "rgba(28,195,175,0.12)",
            marginBottom: "var(--s-6)",
          }}
        >
          <Icon size={24} strokeWidth={1.75} style={{ color: "var(--color-teal-deep)" }} />
        </div>
      )}
      {children}
    </div>
  );
}
