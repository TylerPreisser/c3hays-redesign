---
name: C3 Hays Component & CSS Patterns
description: Component conventions, CSS utility classes, data flow used in the project
type: project
---

## CSS utility classes (globals.css)

- `.container-c3` — max-width 1280px, responsive padding
- `.section` — 6/8/10rem top+bottom padding at sm/md/lg
- `.btn`, `.btn-primary`, `.btn-outline`, `.btn-outline-navy` — sharp-edged buttons (border-radius: 0)
- `.btn-primary` → teal (#1cc3af) fill
- `.overline` — 0.75rem, 600 weight, 0.18em tracking, uppercase
- `.display-hero`, `.display-1`, `.display-2`, `.heading-1/2/3` — type scale
- `.section-dark` → #1b1c1c background; `.section-light` → #ffffff
- `.input-c3` — bottom-border-only input (no top/side borders), focus turns teal
- `.nav-transparent` / `.nav-solid` — header scroll states
- `.nav-link-underline` — pseudo-element underline animates from left to right on hover
- `.footer-social` — 36x36 icon button, teal on hover

## Live stream toggle

`src/components/home/Hero.tsx` line 9: `const isLive = false;`
Set to `true` to show teal banner strip at top of hero with pulsing dot + "Watch Live →" link.

## Navigation data

`src/data/navigation.ts` — navItems array drives both desktop nav and mobile drawer
`src/data/site.ts` — site name, address, phone, email, social URLs, giving URLs

## Header behavior

Fixed position. Transparent on hero (white text+logo). Scrolled past 60px → white background + ink text. Logo uses `currentColor` inherited from parent `style={{ color: ... }}`.

## Mission statement rule

THE SENTENCE "We exist to meet with Him, grow in Him, and serve through Him" APPEARS EXACTLY ONCE in rendered UI: `MissionBlock.tsx`. Also in `site.ts` data field (required). Nowhere else.
