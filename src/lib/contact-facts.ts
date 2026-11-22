import { tx } from "@/lib/home-content";

/**
 * A phone number, an email address or a street address that staff typed over the built-in one is what visitors get: the
 * words, the `tel:` / `mailto:` behind them and the structured data all follow the typed value. These helpers turn the
 * typed (allow-listed HTML) text back into plain text for the places that cannot hold markup.
 */
export function plainText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'")
    .replace(/[ \t]+/g, " ").replace(/ ?\n ?/g, "\n").trim();
}

/** `tel:` for a phone as typed (digits, and a leading +); the built-in `fallback` number when the typed text holds no phone number. */
export function telHref(typedHtml: string, fallback: string): string {
  const raw = plainText(typedHtml);
  const digits = raw.replace(/[^0-9]/g, "");
  if (digits.length < 7 || digits.length > 15) return `tel:${fallback.replace(/\D/g, "")}`;
  return `tel:${raw.trim().startsWith("+") ? "+" : ""}${digits}`;
}

const EMAIL = /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']{2,}$/;
/** `mailto:` for an address as typed; the built-in one when the typed text is not an email address. */
export function mailHref(typedHtml: string, fallback: string): string {
  const raw = plainText(typedHtml);
  return EMAIL.test(raw) ? `mailto:${raw}` : `mailto:${fallback}`;
}

/** The typed value of a text key (or the built-in), as the page prints it, and its plain form. */
export function typed(text: Record<string, string> | undefined, key: string, fallback: string): string {
  return tx(text, key, fallback);
}

/** A two-line typed address ("street<br>City, ST 12345") as a PostalAddress, or null when it does not read that way. */
export function postalFromTyped(html: string): { streetAddress: string; addressLocality: string; addressRegion: string; postalCode: string } | null {
  const lines = plainText(html).split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length !== 2) return null;
  const m = /^(.+?),\s*([A-Za-z]{2})\s+(\d{5})(?:-\d{4})?$/.exec(lines[1]);
  return m ? { streetAddress: lines[0], addressLocality: m[1], addressRegion: m[2].toUpperCase(), postalCode: m[3] } : null;
}
