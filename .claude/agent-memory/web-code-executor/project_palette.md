---
name: C3 Hays Redesign Palette
description: New B&W+teal token system replacing old navy/crimson/evergreen palette
type: project
---

## Live palette (as of April 2026 rebuild)

Ink: #1b1c1c (near-black, replaces #232e2c evergreen and #10405D navy)
Teal: #1cc3af (ONLY chromatic accent, replaces navy as primary accent)
Teal deep: #179c8c (hover/pressed state)
Bone: #ffffff (primary background, replaces #f2efed)
Mist: #f6f6f6 (off-white surface for alternating sections)

**Why:** User's brand comes from celebratejesus.org, which is black/white/teal editorial. Old navy was wrong brand.

**Killed tokens:** #10405D (navy), #0a2d44 (navy-hover), #0a1f2e (ink-deep), #232e2c (evergreen), #e53539 (crimson), #f2efed (old off-white).

## Logo component

Path: `src/components/brand/Logo.tsx`
SVG inline paths for C letterform + 3 numeral. Uses `currentColor` — color is set by parent's CSS `color` property.
White on dark, ink on light. No background circle.

## What was removed

- crisis-card CSS class (988 hotline callout) — user explicitly wanted it gone
- Phone "GIVE" mockup graphic — user hated it
- Wordmark text "C3" next to logo — just the SVG mark
- Multiple redundant instances of "We exist to meet Him, grow in Him, and serve through Him" — now ONLY in MissionBlock
