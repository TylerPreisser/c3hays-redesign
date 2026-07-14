/**
 * Website Editor v6 — R7: the ONE curated FONT_CATALOG.
 *
 * Previously three lists drifted independently: the layout.tsx Google-Fonts <link>,
 * the EditBridge inline font picker, and the admin Inspector BTN_FONTS. If a picker
 * offered a font the <link> didn't load, users picked a font that silently rendered
 * as a fallback. This catalog is the single source of truth — the <link> href, the
 * EditBridge picker, and (hand-mirrored) the admin Inspector all DERIVE from it, so
 * "offered" can never exceed "loaded".
 *
 * `load` says how a family becomes available:
 *   - "google" → fetched by the generated Google-Fonts <link> (needs `google` spec)
 *   - "next"   → loaded by next/font in layout.tsx (e.g. Hanken Grotesk, the base UI font)
 *   - "system" → always present (Georgia, Courier) — no network load
 * The admin backend hand-mirrors this file (src/lib/content/fonts.ts); keep them identical.
 */
export type FontLoad = "google" | "next" | "system";
export interface FontDef {
  /** The CSS font-family value applied via execCommand/inline styles. */
  css: string;
  /** Human label shown in the picker (rendered in its own face). */
  name: string;
  load: FontLoad;
  /** Google Fonts `family=` spec (only when load === "google"). */
  google?: string;
}

export const FONT_CATALOG: FontDef[] = [
  { css: "'Hanken Grotesk', sans-serif", name: "Hanken Grotesk", load: "next" },
  { css: "Inter, sans-serif", name: "Inter", load: "google", google: "Inter:wght@400;600;700" },
  { css: "'Space Grotesk', sans-serif", name: "Space Grotesk", load: "google", google: "Space+Grotesk:wght@400;500;700" },
  { css: "Sora, sans-serif", name: "Sora", load: "google", google: "Sora:wght@400;600;700" },
  { css: "Montserrat, sans-serif", name: "Montserrat", load: "google", google: "Montserrat:wght@400;600;700" },
  { css: "Poppins, sans-serif", name: "Poppins", load: "google", google: "Poppins:wght@400;600;700" },
  { css: "'Work Sans', sans-serif", name: "Work Sans", load: "google", google: "Work+Sans:wght@400;600;700" },
  { css: "Raleway, sans-serif", name: "Raleway", load: "google", google: "Raleway:wght@400;600;700" },
  { css: "Oswald, sans-serif", name: "Oswald", load: "google", google: "Oswald:wght@400;600" },
  { css: "'Bebas Neue', sans-serif", name: "Bebas Neue", load: "google", google: "Bebas+Neue" },
  { css: "'Archivo Black', sans-serif", name: "Archivo Black", load: "google", google: "Archivo+Black" },
  { css: "Fraunces, serif", name: "Fraunces", load: "google", google: "Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400" },
  { css: "Lora, serif", name: "Lora", load: "google", google: "Lora:ital,wght@0,400;0,700;1,400" },
  { css: "'Playfair Display', serif", name: "Playfair Display", load: "google", google: "Playfair+Display:ital,wght@0,400;0,700;1,400" },
  { css: "'DM Serif Display', serif", name: "DM Serif Display", load: "google", google: "DM+Serif+Display" },
  { css: "Merriweather, serif", name: "Merriweather", load: "google", google: "Merriweather:wght@400;700" },
  { css: "'Roboto Slab', serif", name: "Roboto Slab", load: "google", google: "Roboto+Slab:wght@400;700" },
  { css: "Georgia, serif", name: "Georgia", load: "system" },
  { css: "'Caveat', cursive", name: "Caveat", load: "google", google: "Caveat:wght@400;700" },
  { css: "'Pacifico', cursive", name: "Pacifico", load: "google", google: "Pacifico" },
  { css: "'Courier New', monospace", name: "Courier", load: "system" },
];

/** The [css, name] pairs the on-page (EditBridge) + admin (Inspector) pickers show. */
export const FONT_PICKER: [string, string][] = FONT_CATALOG.map((f) => [f.css, f.name]);

/** Build the single Google-Fonts stylesheet href from the catalog — only the
 *  google-loaded families, so the <link> and the pickers can never disagree. */
export function buildGoogleFontsHref(catalog: FontDef[] = FONT_CATALOG): string {
  const families = catalog.filter((f) => f.load === "google" && f.google).map((f) => `family=${f.google}`);
  return `https://fonts.googleapis.com/css2?${families.join("&")}&display=swap`;
}
