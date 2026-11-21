/**
 * Short rich text from Studio (headings, eyebrows, body copy, free text) is set as HTML. It is read through this
 * allow-list: only the tags below survive, each is re-emitted from its parsed parts (never passed through), the only
 * attributes kept are `href` on a link and a short list of colour/emphasis declarations in `style`, and every `<` that
 * is not part of an allowed tag is escaped. Text without markup comes out unchanged.
 */
const TAGS = new Set(["b", "strong", "i", "em", "u", "s", "br", "a", "span", "sup", "sub", "small", "p", "ul", "ol", "li", "h2", "h3", "blockquote"]);
const VOID = new Set(["br"]);
const TAG_RE = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)((?:\s+[a-zA-Z-]+(?:\s*=\s*(?:"[^"]*"|'[^']*'))?)*)\s*(\/?)>/g;
const ATTR_RE = /([a-zA-Z-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'))?/g;
const DROP_WHOLE = /<(script|style|iframe|object|embed|noscript|template|svg|math|textarea|title)\b[^>]*>[\s\S]*?<\/\1\s*>/gi;
const MAX = 60_000;

const escText = (t: string) => t.replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escAttr = (v: string) => v.replace(/&(?!(?:amp|lt|gt|quot|#\d+|#x[0-9a-f]+);)/gi, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** A link target: a site path, a #fragment, or http(s)/mailto/tel. Anything else (javascript:, data:, ...) is dropped. */
export function safeLinkTarget(raw: string): string | null {
  const v = raw.replace(/&amp;/gi, "&").trim();
  if (/^\/(?!\/)/.test(v) || /^#[\w-]*$/.test(v)) return v;
  try {
    const u = new URL(v);
    return ["http:", "https:", "mailto:", "tel:"].includes(u.protocol) ? v : null;
  } catch { return null; }
}

const STYLE_PROPS = new Set(["color", "font-style", "font-weight", "text-decoration"]);
const STYLE_VALUE = /^[#\w(),.%\s-]{1,60}$/;
function safeStyle(raw: string): string {
  const out: string[] = [];
  for (const decl of raw.split(";")) {
    const i = decl.indexOf(":");
    if (i < 0) continue;
    const prop = decl.slice(0, i).trim().toLowerCase();
    const val = decl.slice(i + 1).trim();
    if (STYLE_PROPS.has(prop) && STYLE_VALUE.test(val) && !/url|expression|var\(\s*--[^)]*\\/i.test(val)) out.push(`${prop}:${val}`);
  }
  return out.join(";");
}

export function sanitizeInlineHtml(input: unknown): string {
  if (typeof input !== "string") return "";
  if (input.length > MAX) return escText(input.slice(0, MAX));
  const html = input.replace(DROP_WHOLE, "").replace(/<!--[\s\S]*?-->/g, "");
  let out = "";
  let last = 0;
  for (const m of html.matchAll(TAG_RE)) {
    out += escText(html.slice(last, m.index));
    last = m.index + m[0].length;
    const name = m[2].toLowerCase();
    if (!TAGS.has(name)) continue; // the tag is dropped, its text stays
    if (m[1] === "/") { if (!VOID.has(name)) out += `</${name}>`; continue; }
    let attrs = "";
    for (const a of m[3].matchAll(ATTR_RE)) {
      const an = a[1].toLowerCase();
      const val = a[2] ?? a[3] ?? "";
      if (name === "a" && an === "href") { const u = safeLinkTarget(val); if (u) attrs += ` href="${escAttr(u)}"`; }
      else if (an === "style" && name !== "a" && name !== "br") { const st = safeStyle(val); if (st) attrs += ` style="${escAttr(st)}"`; }
    }
    out += `<${name}${attrs}>`;
  }
  return out + escText(html.slice(last));
}
