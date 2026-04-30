/**
 * Logo — C3 letterform mark, no circle border.
 * Uses currentColor so it adapts to the parent's text color:
 *   - white on dark backgrounds (header transparent, footer, dark sections)
 *   - ink (#1b1c1c) on light backgrounds (header scrolled state)
 *
 * Usage:
 *   <Logo size={36} className="text-white" />         → white
 *   <Logo size={36} className="text-[#1b1c1c]" />     → near-black
 *   or simply inherit color from a parent style={{ color: ... }}
 */

interface LogoProps {
  size?: number;
  className?: string;
}

export default function Logo({ size = 40, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="false"
      role="img"
    >
      <title>C3 — Celebration Community Church</title>
      {/*
        Hand-drawn C + 3 letterform mark.
        The "C" is a bold open arc; the "3" sits tight to its right.
        Both use currentColor so the mark adapts to any parent text color.
      */}

      {/* C — bold open arc, open on the right */}
      <path
        d="
          M 52 18
          C 46 14, 36 12, 26 18
          C 14 25, 10 36, 12 47
          C 14 58, 22 66, 34 68
          C 42 70, 50 68, 56 63
        "
        stroke="currentColor"
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      />

      {/* 3 — two arcs sharing a center-right fulcrum point */}
      {/* Top arc of the 3 */}
      <path
        d="
          M 58 18
          C 68 20, 72 28, 64 36
          C 60 40, 60 40, 60 40
        "
        stroke="currentColor"
        strokeWidth="7.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Bottom arc of the 3 */}
      <path
        d="
          M 60 40
          C 60 40, 60 40, 64 44
          C 72 52, 68 63, 56 65
        "
        stroke="currentColor"
        strokeWidth="7.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
