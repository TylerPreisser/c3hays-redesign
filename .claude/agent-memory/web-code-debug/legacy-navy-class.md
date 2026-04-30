---
name: Legacy navy class is harmless
description: .btn-outline-navy is a CSS alias mapping to ink, not actual navy color usage
type: project
---

The class `.btn-outline-navy` (defined in `src/app/globals.css` ~line 269) is a legacy alias kept around so existing page code doesn't break after the navy/crimson palette was removed. It maps to `var(--color-ink)` (#1b1c1c).

**Why:** When the palette was reset to ink+white+teal, removing every `btn-outline-navy` reference across 7+ page files would have been churn. The CSS alias preserves the visual outcome (dark outline button) without forcing rename of every consumer.

**How to apply:** When auditing for navy color regressions, ignore matches on `.btn-outline-navy` unless the CSS rule itself uses `#10405D`. Grep for hex values, not class names. Genuine palette regressions show up as hex codes in `style={{}}` or CSS rule values, not as class names.
