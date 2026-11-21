import type { CSSProperties } from "react";
import type { BtnStyle } from "@/lib/home-content";

/** Build inline button CSS from an editable button style (overrides the class). */
export function btnCss(b?: BtnStyle): CSSProperties | undefined {
  if (!b) return undefined;
  return {
    background: b.variant === "outline" ? "transparent" : b.bg,
    color: b.variant === "outline" ? b.bg : b.color,
    border: b.variant === "outline" ? `2px solid ${b.bg}` : "none",
    borderRadius: b.radius,
    fontFamily: b.font || undefined,
  };
}
