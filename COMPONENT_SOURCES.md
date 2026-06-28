# COMPONENT_SOURCES.md — What was mined from the COTM donor, and what was reskinned

**Donor:** `~/Downloads/churchonthemove.com (1)/` — a saved (HTTrack-style) capture of churchonthemove.com. It is a **WordPress / Divi** site (Hustle, Smush, FontAwesome, AddThis, GA/GTM, YouTube/Vimeo embeds). It is rendered HTML/CSS/JS + asset mirror, **not** a clean component library.

**How it was used:** as a **structural + aesthetic reference**, not a code-lift source. Hand-porting Divi/WordPress markup into a React 19 / Tailwind v4 codebase would import bloat and COTM branding — counter to the brief ("COTM supplies structure; C3 supplies the look; no COTM branding survives"). The C3 codebase had already absorbed COTM's structural DNA in prior rounds (the design system in `globals.css` explicitly references "CotM scale" and "sharp-edged CotM style"). This session continued that adaptation.

## Structure / patterns adopted from COTM (already in the C3 build, reskinned to C3)
| COTM pattern | C3 adaptation | C3 reskin applied |
|---|---|---|
| Confident multi-campus church platform | Hays + Colby campuses, campus index + detail pages | C3 names, addresses, service times; teal accent |
| Bold full-bleed hero with invitation energy | `Hero` (worship photo, ken-burns, word-stagger headline) | "Welcome home." voice; C3 photos; teal CTA |
| Clear location + service-time blocks | `LocationsSection`, Watch service-times grid, footer | C3 campuses/times; sharp 0-radius cards |
| Watch / Listen | `/watch`, `/messages` | C3 sermon mocks; **Vimeo embed → labeled local mock player** |
| Get Involved / Groups / Connect | `/connect` connect-card | C3 form, teal focus states |
| Give | `/give` three-ways + by-campus | C3 Pushpay links (mock), C3 copy |
| Account portal (giving/prayer/volunteer) | App territory (`C3ChurchApp`) — website links out | n/a this session |
| Generous vertical section scale | `.section` 6/8/10rem rhythm | tightened/balanced this session |
| Sharp-edged buttons, uppercase tracking | `.btn` system | teal fills, square corners |

## Adapted / refined this session
- **Mock live-stream player** (`/watch`) — replaces COTM-style live Vimeo `<iframe>` with a self-contained, labeled mock (poster + status + play affordance). Structure echoes a broadcast player; zero external calls. _Labeled "Mock stream · local build."_
- **Vertical-rhythm & balance pass** — removed stranded/empty space on Give + Watch + About toward Apple-grade intentional negative space.

## COTM design themes ACTUALLY ported this pass (after re-screenshotting the LIVE site)
> Earlier in the session I under-delivered here — I treated COTM as "structure already absorbed" and didn't actually mine it. I then captured the **live** churchonthemove.com (`scripts/shoot-cotm.mjs` → `screenshots/cotm-live/`), studied it, and brought its distinctive design DNA into C3, reskinned. Side-by-side in `screenshots/cotm-comparison/`.

| COTM theme (observed on live site) | What I built into C3 | Reskin to C3 |
|---|---|---|
| **"Find a Church" dropdown pill in the hero** (their multi-campus chooser) | **`CampusChooser`** component — a hero pill "Find your campus ⌄" that opens a panel to pick **Hays / Colby** (service time + link to each campus) | C3 white pill on the dark worship hero; teal markers/icons; C3 campuses |
| **"Our Churches" page**: stylized hand-drawn metro map with campus markers + a bold colored "Find A Church" card | Reworked the home **"Our churches."** section: a **stylized northwest-Kansas SVG map** with **Colby + Hays** markers on the **I-70** corridor, beside a dark **"Find your campus"** chooser card | C3 B&W+teal map, C3 cities, I-70 (the real road linking both campuses) |
| **Soft rounded cards + fully-rounded pill buttons** everywhere (their signature friendly/simple feel) | Shifted the whole design system: `--radius` 0 → rounded (1–1.25rem cards), **`.btn` → pill (999px)**, sentence-case labels, rounded image tiles, inputs, mock player | Same C3 palette/type; just softened the geometry |
| **Modular photo-card sections, each with one clear pill CTA** | Home tiles, campus cards, connect, "we're here for you" — rounded cards with pill CTAs | C3 photography + teal CTAs |
| **Sentence-case, friendly button copy** ("Find a Church", "Learn More") | Removed all-caps/wide-tracking on buttons → sentence case | "Find your campus", "Plan Your Visit", "Campus Info" |

What I deliberately did NOT copy: COTM's orange/multi-color palette, their logo/wordmark, their photography, their Divi/WordPress markup, their YouTube/analytics embeds. C3 keeps B&W + teal, Hanken Grotesk, the interlocked-C mark, and its own photos.

## Explicitly NOT carried over from COTM (reskin integrity)
- No COTM logo, wordmark, colors (their orange/photography style), fonts, or copy.
- No Divi/WordPress markup, Hustle popups, AddThis, FontAwesome kit, GA/GTM, DoubleClick, or any tracker.
- No external CDN/script dependencies — C3 stays a clean static export.

**Result:** COTM informs the _shape_ (IA, section types, full-bleed confidence, service-time clarity); 100% of the _look_ is C3 (B&W + teal, Hanken Grotesk, interlocked-C mark, "Welcome home." voice).
