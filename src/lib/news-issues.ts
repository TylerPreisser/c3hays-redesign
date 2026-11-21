import { getCMSNewsletterIssues } from "@/lib/cms";
import type { NewsletterIssue } from "@/data/news";

/**
 * C3 News issues from Studio's `newsletter_issues`.
 *
 * Studio stores each issue's HTML sanitised (D5-C14) in `html`; a stored copy of the raw mail is never read here.
 * `sanitizeIssueHtml` runs again on read as defence in depth: it escapes every `<` that is not a tag on the
 * allow-list, re-emits only allow-listed tags, keeps `href` (http, https, mailto) and `src`/`alt` (https) and drops every
 * other attribute, and drops links into the mailing platform's tracking host (a recipient-specific URL).
 */
const TAGS = new Set(["p", "br", "strong", "b", "em", "i", "u", "a", "ul", "ol", "li", "h2", "h3", "h4", "blockquote", "hr", "img"]);
const VOID = new Set(["br", "hr", "img"]);
const TRACKING = /(^|\.)list-manage\.com$/i;

const escAttr = (v: string) => v.replace(/&(?!(?:amp|lt|gt|quot|#\d+|#x[0-9a-f]+);)/gi, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function safeUrl(raw: string, kinds: string[]): string | null {
  const v = raw.replace(/&amp;/gi, "&").trim();
  let u: URL;
  try { u = new URL(v); } catch { return null; }
  if (!kinds.includes(u.protocol)) return null;
  if (TRACKING.test(u.hostname)) return null;
  return u.toString();
}

const TAG_RE = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)((?:\s+[a-zA-Z-]+(?:\s*=\s*(?:"[^"]*"|'[^']*'))?)*)\s*(\/?)>/g;
const ATTR_RE = /([a-zA-Z-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'))?/g;

// Elements whose CONTENT is code or hidden: dropped whole, so a script's text never shows up as page text.
const DROP_WHOLE = /<(script|style|iframe|object|embed|noscript|template|svg|math)\b[^>]*>[\s\S]*?<\/\1\s*>/gi;

export function sanitizeIssueHtml(input: string): string {
  const html = input.replace(DROP_WHOLE, "").replace(/<!--[\s\S]*?-->/g, "");
  let out = "";
  let last = 0;
  const esc = (t: string) => t.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  for (const m of html.matchAll(TAG_RE)) {
    out += esc(html.slice(last, m.index));
    last = m.index + m[0].length;
    const closing = m[1] === "/";
    const name = m[2].toLowerCase();
    if (!TAGS.has(name)) continue; // the tag is dropped, its text stays
    if (closing) { if (!VOID.has(name)) out += `</${name}>`; continue; }
    let attrs = "";
    for (const a of m[3].matchAll(ATTR_RE)) {
      const an = a[1].toLowerCase();
      const val = a[2] ?? a[3] ?? "";
      if (name === "a" && an === "href") { const u = safeUrl(val, ["http:", "https:", "mailto:"]); if (u) attrs += ` href="${escAttr(u)}" rel="noopener noreferrer" target="_blank"`; }
      else if (name === "img" && an === "src") { const u = safeUrl(val, ["https:"]); if (u) attrs += ` src="${escAttr(u)}"`; }
      else if (name === "img" && an === "alt") attrs += ` alt="${escAttr(val)}"`;
    }
    if (name === "img" && !attrs.includes("src=")) continue;
    out += `<${name}${attrs}>`;
  }
  out += esc(html.slice(last));
  return out;
}

const ENT: Record<string, string> = { "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'", "&nbsp;": " ", "&amp;": "&" };
const INLINE = /<\/?(?:a|b|strong|em|i|u|span)\b[^>]*>/gi;
const textOf = (html: string) => html.replace(INLINE, "").replace(/<[^>]+>/g, " ").replace(/&(?:lt|gt|quot|#39|nbsp|amp);/g, (e) => ENT[e]).replace(/\s+/g, " ").trim();
const ISO = /^\d{4}-\d{2}-\d{2}/;

/** One Studio item -> the shape the News components render, or null when it has no usable HTML, title or date. */
export function adaptIssue(raw: unknown): NewsletterIssue | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const html = typeof r.html === "string" ? r.html : "";
  const date = [r.date, r.sent_at, r.sentAt].find((d): d is string => typeof d === "string" && ISO.test(d));
  const title = typeof r.title === "string" ? r.title.trim() : typeof r.subject === "string" ? r.subject.trim() : "";
  if (!html.trim() || !date || !title || typeof r.id !== "string") return null;
  const clean = sanitizeIssueHtml(html);
  const text = textOf(clean);
  const excerpt = typeof r.excerpt === "string" && r.excerpt.trim() ? r.excerpt.trim() : text.slice(0, 180).trimEnd() + (text.length > 180 ? "…" : "");
  return {
    id: r.id,
    number: typeof r.number === "number" ? r.number : undefined,
    title,
    date: date.slice(0, 10),
    excerpt,
    topics: Array.isArray(r.topics) ? r.topics.filter((t): t is string => typeof t === "string") : [],
    readMinutes: Math.max(1, Math.round(text.split(" ").length / 220)),
    image: typeof r.image === "string" && r.image ? r.image : undefined,
    sections: [{ body: clean }],
  };
}

/** Newest first. Empty when Studio is down or has none: the page shows its honest "on its way" state. */
export async function getNewsIssues(): Promise<NewsletterIssue[]> {
  const raw = await getCMSNewsletterIssues();
  if (!Array.isArray(raw)) return [];
  return raw.map(adaptIssue).filter((i): i is NewsletterIssue => i !== null).sort((a, b) => (a.date < b.date ? 1 : -1));
}
