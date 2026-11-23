"use client";

import { mediaSrc } from "@/lib/media-path";
import { useEffect } from "react";

/**
 * EditBridge — turns the live site into an in-place editor when it is framed by C3 Studio
 * (`?cmsEdit=1`, inside an iframe, and a Studio origin configured). Click the real page and
 * type; select words for B, I and Link; the change goes to Studio as one message about one field.
 * On the public site (no `cmsEdit`, not framed) this does nothing.
 *
 * THE CONTRACT (the canvas messages). Every message is `{v: 2, source, type, ...}`.
 * The bridge POSTS ONLY to Studio's origin and ACCEPTS ONLY a message that
 *   (1) comes from Studio's origin, (2) comes from `window.parent`, (3) has `v === 2`,
 *   (4) has `source === "c3editor"`. Anything else is ignored without a trace.
 * Studio's origin is origin(NEXT_PUBLIC_STUDIO_ORIGIN || NEXT_PUBLIC_CMS_URL), both inlined at BUILD
 * time (README "Local development"). With neither set the bridge stays off: it never posts to "*".
 *
 * site -> editor (source "c3site"):
 *   cms:ready   {draftServed, asOf, mode, reason: "load" | "mode"}
 *               draftServed = the root's data-cms-draft mark is "served". Anything else is false.
 *               mode = the mode IN FORCE: a page that is not the draft is held in "view" whatever was asked.
 *   cms:select  {path, kind: "text"|"image"|"link"|"section"|"none", box: {x,y,width,height}|null,
 *                label?, href? (link), hrefPath?, href? (text inside a data-cms-href), echo?: true}
 *               text? = the element's current text (text and pick kinds), trimmed and capped at 200 characters.
 *               `echo` marks the answer to editor:select, so Studio does not select twice.
 *   cms:edit    {path, value}             value = allow-listed HTML (b, strong, i, em, br, a[href])
 *   cms:section {op: "move"|"deselect", id, index}   index = position among the page's [data-section]
 * editor -> site (source "c3editor"):
 *   editor:mode   {mode: "edit"|"view"|"visitor", caps?: {path: maxChars}, pages?: [{title, href}]}
 *   editor:apply  {path, value}   text: HTML string; image: URL string; link: {label?, href?}
 *   editor:select {path}          a field's data-cms key, or a section id; "" clears
 *
 * Paths are the site's own `data-cms*` keys. A list item is addressed by its id inside the key
 * (e.g. `meetGrowServe.pillars.<id>.headline`), never by its position; the bridge never derives an index
 * from the DOM for a field, and finds fields by comparing attribute values, never by building selectors.
 */

const V = 2;
/** The longest `text` a cms:select carries. */
const SELECT_TEXT_CAP = 200;
export type BridgeMode = "edit" | "view" | "visitor";
const MODES: BridgeMode[] = ["edit", "view", "visitor"];

const INK = "#0F6F64"; // teal ink: 6.04:1 on white (console tokens)

/* ── safe values ─────────────────────────────────────────────────────────────── */

/** https, http, mailto, tel or a site path. Anything else (javascript:, data:, //host) is refused. */
export function safeHref(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const v = raw.trim();
  if (!v || v.length > 2000) return null;
  const probe = v.replace(/[\u0000- \u007f]/g, "");
  if (/^[a-z][a-z0-9+.-]*:/i.test(probe)) return /^(https?:|mailto:|tel:)/i.test(probe) ? v : null;
  if (probe.startsWith("//")) return null;
  if (probe.startsWith("/") || probe.startsWith("#")) return v;
  return null;
}

function safeImgSrc(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const v = raw.trim();
  if (!v || v.length > 4000) return null;
  const probe = v.replace(/[\u0000- \u007f]/g, "");
  if (/^data:image\/(png|jpe?g|gif|webp|avif);/i.test(probe)) return v;
  return safeHref(v) && !/^(mailto:|tel:|#)/i.test(probe) ? v : null;
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escAttr = (s: string) => esc(s).replace(/"/g, "&quot;");
const DROP = new Set(["script", "style", "iframe", "object", "embed", "template", "noscript", "svg", "math", "title"]);

/** Reduce HTML to the editor's allow-list: b, strong, i, em, br, and a whose href is safe. */
export function sanitizeHtml(html: string): string {
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, "text/html");
  const out: string[] = [];
  const walk = (n: Node) => {
    if (n.nodeType === 3) { out.push(esc(n.nodeValue || "")); return; }
    if (n.nodeType !== 1) return;
    const el = n as Element;
    const tag = el.tagName.toLowerCase();
    if (DROP.has(tag)) return;
    if (tag === "br") { out.push("<br>"); return; }
    if (tag === "b" || tag === "strong" || tag === "i" || tag === "em") {
      out.push(`<${tag}>`); el.childNodes.forEach(walk); out.push(`</${tag}>`); return;
    }
    if (tag === "a") {
      const href = safeHref(el.getAttribute("href"));
      if (href) { out.push(`<a href="${escAttr(href)}">`); el.childNodes.forEach(walk); out.push("</a>"); return; }
    }
    el.childNodes.forEach(walk);
  };
  doc.body.childNodes.forEach(walk);
  return out.join("").replace(/(<br>)+$/, "");
}

/** Does `path` match a cap key? `*` stands for one dotted segment (a list item's id). */
export function capFor(caps: Record<string, number>, path: string): number {
  if (Object.prototype.hasOwnProperty.call(caps, path)) return caps[path];
  for (const k of Object.keys(caps)) {
    if (!k.includes("*")) continue;
    const re = new RegExp("^" + k.split("*").map((p) => p.replace(/[.+?^${}()|[\]\\]/g, "\\$&")).join("[^.]+") + "$");
    if (re.test(path)) return caps[k];
  }
  return 0;
}

/* ── the component ───────────────────────────────────────────────────────────── */

export default function EditBridge() {
  useEffect(() => {
    // Studio's origin: inlined at build. Both reads must stay literal `process.env.NEXT_PUBLIC_*`.
    let STUDIO = "";
    try {
      const raw = process.env.NEXT_PUBLIC_STUDIO_ORIGIN || process.env.NEXT_PUBLIC_CMS_URL || "";
      STUDIO = raw ? new URL(raw).origin : "";
    } catch { STUDIO = ""; }

    let on = false;
    try {
      const q = new URLSearchParams(window.location.search);
      on = !!STUDIO && q.get("cmsEdit") === "1" && window.parent !== window;
      // The browser tells us who framed us (Chromium, WebKit). If it says someone else, stay off.
      const anc = (window.location as Location & { ancestorOrigins?: DOMStringList }).ancestorOrigins;
      if (on && anc && anc.length && anc[0] !== STUDIO) on = false;
    } catch { on = false; }
    if (!on) return;

    const root = document.documentElement;
    const post = (m: Record<string, unknown>) => {
      try { window.parent.postMessage({ v: V, source: "c3site", ...m }, STUDIO); } catch { /* parent gone */ }
    };

    /* ── state ── */
    let mode: BridgeMode = "view";
    let caps: Record<string, number> = {};
    let pages: { title: string; href: string }[] = [];
    /** Phone: words are not edited there, so a press on a section with a photo behind it means the photo. */
    let photoFirst = false;
    /** Photo keys the editor will not change (built into the site): drawn as plain, never as buttons. */
    let fixedImg = new Set<string>();
    let sel: { attr: string; value: string; kind: string } | null = null;
    let secSelId = "";
    let activeEl: HTMLElement | null = null;
    let composing = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const dirty = new Set<HTMLElement>();
    const lastSent = new Map<string, string>();
    const editable = new Set<HTMLElement>();
    const tabAdded = new WeakSet<HTMLElement>();
    const inputSent = new Set<string>(); // paths whose first input event of this burst was already announced
    const tabWas = new Map<HTMLElement, string | null>(); // the site's own controls while they are taken out of the tab order

    const draftServed = () => {
      const m = root.getAttribute("data-cms-draft") ?? document.querySelector("[data-cms-draft]")?.getAttribute("data-cms-draft");
      return m === "served";
    };
    const effMode = (): BridgeMode => (mode === "edit" && !draftServed() ? "view" : mode);
    const asOfMark = () => root.getAttribute("data-cms-asof") || new Date().toISOString();
    const postReady = (reason: "load" | "mode") => post({ type: "cms:ready", draftServed: draftServed(), asOf: asOfMark(), mode: effMode(), reason });

    /* every element carrying a given attribute value; compared, never put into a selector */
    const byAttr = (attr: string, value: string) =>
      Array.from(document.querySelectorAll<HTMLElement>(`[${attr}]`)).filter((el) => el.getAttribute(attr) === value);
    const fields = () => Array.from(document.querySelectorAll<HTMLElement>("[data-cms]"));
    // Select-only markers (the menu, the announcement band, a service-time line): a click or Enter on one tells Studio
    // to open that thing's sheet. They are never editable text.
    const picks = () => Array.from(document.querySelectorAll<HTMLElement>("[data-cms-pick]"));
    const pickOf = (t: EventTarget | null) => ((t as HTMLElement | null)?.closest?.("[data-cms-pick]") as HTMLElement | null) || null;
    const pathOf = (el: HTMLElement) => el.getAttribute("data-cms") || "";
    const inChrome = (t: EventTarget | null) => !!(t as HTMLElement | null)?.closest?.("#c3-toolbar,#c3-link-card,#c3-cap");
    const fieldOf = (t: EventTarget | null) => ((t as HTMLElement | null)?.closest?.("[data-cms]") as HTMLElement | null) || null;

    /* ── chrome: stylesheet, ring, counter, bar, link card ── */
    let style: HTMLStyleElement | null = null;
    let ring: HTMLDivElement | null = null;
    let fring: HTMLDivElement | null = null; // the keyboard-focus ring of a photo, a marker or a link
    let focusEl: HTMLElement | null = null;
    let cap: HTMLDivElement | null = null;
    let bar: HTMLDivElement | null = null;
    let card: HTMLDivElement | null = null;
    let cardInput: HTMLInputElement | null = null;
    let cardList: HTMLDivElement | null = null;
    let cardRemove: HTMLButtonElement | null = null;
    let savedRange: Range | null = null;
    let ringRaf = 0;

    const CSS_TEXT = `
      /* In-place editor chrome. Injected only while the site is framed by Studio. */
      [data-cms], [data-cms-img], [data-cms-link]{ border-radius:7px; }
      /* Editable headings use text-wrap:balance, which re-wraps the moment the element is a focused
         contenteditable and would jump the section. A stable wrap keeps idle and focused layouts identical. */
      [data-cms]{ text-wrap: wrap !important; transition:background-color .12s ease; }
      html[data-cms-mode="edit"] [data-cms]{ cursor:text; }
      [data-cms-img], [data-cms-link]{ cursor:pointer; }
      [data-cms-img][data-cms-fixed]{ cursor:default; }
      [data-cms-img][data-cms-fixed]:hover::after{ display:none!important; }
      /* keyboard focus on a photo, a marker or a link is drawn by #c3-focus-ring, a fixed element ABOVE the picture (an outline is painted
         under the photo's own image and overlays, which is why it could not be seen) */
      [data-cms-img]:focus, [data-cms-img]:focus-visible, [data-cms-pick]:focus, [data-cms-pick]:focus-visible, [data-cms-link]:focus-visible{ outline:none !important; }
      #c3-focus-ring{
        position:fixed; pointer-events:none; z-index:2147483450; display:none; box-sizing:border-box;
        border-radius:9px; box-shadow: 0 0 0 3px #fff, 0 0 0 6px ${INK};
      }
      /* hover: a quiet outline over the element, never over its own background and never in the way of a click */
      [data-cms]:hover::after, [data-cms-img]:hover::after, [data-cms-link]:hover::after{
        content:""; position:absolute;
        /* pinned with !important: an author ::after (e.g. .nav-link-underline) must not collapse it to a sliver */
        top:-3px!important; right:-3px!important; bottom:-3px!important; left:-3px!important;
        width:auto!important; height:auto!important;
        background-color: transparent !important;
        border-radius:9px; pointer-events:none; z-index:2147482000;
        --ant: rgba(15,111,100,.55);
        background-image:
          repeating-linear-gradient(90deg, var(--ant) 0 6px, transparent 6px 10px),
          repeating-linear-gradient(90deg, var(--ant) 0 6px, transparent 6px 10px),
          repeating-linear-gradient(0deg,  var(--ant) 0 6px, transparent 6px 10px),
          repeating-linear-gradient(0deg,  var(--ant) 0 6px, transparent 6px 10px);
        background-size: 100% 1.5px, 100% 1.5px, 1.5px 100%, 1.5px 100%;
        background-position: 0 0, 0 100%, 0 0, 100% 0;
        background-repeat: no-repeat;
      }
      [data-cms-img]:hover::after{ top:2px!important; right:2px!important; bottom:2px!important; left:2px!important; z-index:2147483000; }
      /* selection: one fixed ring, 2px teal ink inside 2px white (3:1 on light and on a dark hero) */
      .cms-sel:hover::after{ display:none !important; }
      #c3-sel-ring{
        position:fixed; pointer-events:none; z-index:2147483400; display:none; box-sizing:border-box;
        border-radius:9px; box-shadow: 0 0 0 2px ${INK}, 0 0 0 4px #fff;
        opacity:1; transition: opacity .12s ease-out;
      }
      @media (prefers-reduced-motion: reduce){ #c3-sel-ring{ transition:none; } }
      /* the c3hays brand :focus-visible box would double the ring while a field has focus */
      [data-cms]:focus, [data-cms]:focus-visible, [data-cms].cms-sel, [data-cms-link].cms-sel, [data-cms-img].cms-sel,
      [data-cms-link].cms-sel:focus-visible, [data-cms-img].cms-sel:focus-visible{ outline:none !important; }
      #c3-cap{ position:fixed; z-index:2147483646; display:none; font:600 11px/1 -apple-system,system-ui,sans-serif;
        background:#fff; color:#1b1c1c; border:1px solid rgba(27,28,28,.14); border-radius:999px; padding:4px 8px;
        box-shadow:0 2px 8px rgba(0,0,0,.12); pointer-events:none; }
      #c3-cap[data-state="near"]{ color:#8a5300; border-color:#d98a16; }
      #c3-cap[data-state="full"]{ color:#b42318; border-color:#b42318; }
      #c3-toolbar, #c3-link-card{ position:fixed; z-index:2147483647; display:none; align-items:center; gap:2px;
        background:#fff; color:#1b1c1c; border:1px solid rgba(27,28,28,.14); border-radius:10px; padding:4px;
        box-shadow:0 8px 28px rgba(0,0,0,.18); font-family:-apple-system,system-ui,sans-serif; }
      #c3-toolbar button, #c3-link-card button{ background:transparent; color:#1b1c1c; border:none; border-radius:6px;
        font:600 13px/1 -apple-system,system-ui,sans-serif; height:30px; min-width:30px; padding:0 9px; cursor:pointer; }
      #c3-toolbar button:hover, #c3-link-card button:hover, #c3-link-card button[data-active="1"]{ background:#eef6f5; }
      #c3-toolbar button[aria-pressed="true"]{ background:#d9eeeb; color:${INK}; }
      #c3-link-card{ flex-direction:column; align-items:stretch; gap:4px; width:280px; padding:8px; }
      #c3-link-card input{ font:400 14px/1.2 -apple-system,system-ui,sans-serif; border:1px solid rgba(27,28,28,.25);
        border-radius:6px; padding:7px 8px; color:#1b1c1c; background:#fff; }
      #c3-link-card input:focus{ outline:2px solid ${INK}; outline-offset:1px; }
      #c3-link-card [data-page]{ text-align:left; height:auto; padding:7px 8px; display:flex; justify-content:space-between; gap:8px; }
      #c3-link-card [data-page] small{ font-weight:400; color:#6b6c6c; }
    `;

    const mkBtn = (label: string, html: string, fn: () => void) => {
      const b = document.createElement("button");
      b.type = "button"; b.innerHTML = html; b.setAttribute("aria-label", label); b.title = label;
      b.addEventListener("mousedown", (e) => { e.preventDefault(); fn(); });
      return b;
    };

    const buildChrome = () => {
      if (style) return;
      style = document.createElement("style");
      style.textContent = CSS_TEXT;
      document.head.appendChild(style);
      ring = document.createElement("div"); ring.id = "c3-sel-ring"; ring.setAttribute("aria-hidden", "true");
      document.body.appendChild(ring);
      fring = document.createElement("div"); fring.id = "c3-focus-ring"; fring.setAttribute("aria-hidden", "true");
      document.body.appendChild(fring);
      cap = document.createElement("div"); cap.id = "c3-cap"; cap.setAttribute("role", "status"); cap.setAttribute("aria-live", "polite");
      document.body.appendChild(cap);
      bar = document.createElement("div"); bar.id = "c3-toolbar"; bar.setAttribute("role", "toolbar"); bar.setAttribute("aria-label", "Format"); bar.contentEditable = "false";
      bar.appendChild(mkBtn("Bold", "<b>B</b>", () => format("bold")));
      bar.appendChild(mkBtn("Italic", "<i>I</i>", () => format("italic")));
      bar.appendChild(mkBtn("Link", "Link", () => openLinkCard()));
      document.body.appendChild(bar);
      card = document.createElement("div"); card.id = "c3-link-card"; card.setAttribute("role", "dialog"); card.setAttribute("aria-label", "Link");
      cardInput = document.createElement("input"); cardInput.type = "text"; cardInput.placeholder = "Search pages or paste an address";
      cardInput.setAttribute("aria-label", "Link to"); cardInput.autocomplete = "off";
      cardInput.addEventListener("input", () => renderPages());
      cardInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") { e.preventDefault(); e.stopPropagation(); commitLinkFromInput(); }
        else if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); closeLinkCard(true); }
      });
      cardList = document.createElement("div");
      cardRemove = mkBtn("Remove link", "Remove link", () => removeLink());
      cardRemove.style.display = "none";
      card.append(cardInput, cardList, cardRemove);
      document.body.appendChild(card);
      const loop = () => { positionRing(); positionFocusRing(); ringRaf = requestAnimationFrame(loop); };
      ringRaf = requestAnimationFrame(loop);
    };
    const dropChrome = () => {
      cancelAnimationFrame(ringRaf);
      style?.remove(); ring?.remove(); fring?.remove(); cap?.remove(); bar?.remove(); card?.remove();
      style = ring = fring = cap = bar = card = cardInput = cardList = cardRemove = null;
    };

    /* ── selection ring ── */
    const selTargets = () => (sel ? byAttr(sel.attr, sel.value) : []);
    const ringTarget = () => {
      const all = selTargets();
      return all.find((el) => { const r = el.getBoundingClientRect(); return r.width > 0 || r.height > 0; }) || all[0] || null;
    };
    let ringLast = "";
    function positionRing() {
      if (!ring) return;
      const el = ringTarget();
      const hide = () => { if (ring!.style.display !== "none") ring!.style.display = "none"; ringLast = ""; };
      if (!el || !document.contains(el)) return hide();
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return hide();
      // text and links: just outside the element; photos and sections: inside, so a full-bleed
      // element is never clipped by the viewport or an ancestor's overflow.
      const pad = sel && (sel.kind === "image" || sel.kind === "section") ? -4 : 3;
      const key = `${r.left}|${r.top}|${r.width}|${r.height}|${pad}`;
      if (key === ringLast && ring.style.display === "block") return;
      ringLast = key;
      // follow the element's own corner radius so a rounded photo is not ringed by a square-cornered box
      const rad = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;
      ring.style.borderRadius = `${Math.max(pad < 0 ? 4 : 7, rad + pad)}px`;
      ring.style.left = `${r.left - pad}px`; ring.style.top = `${r.top - pad}px`;
      ring.style.width = `${r.width + pad * 2}px`; ring.style.height = `${r.height + pad * 2}px`;
      ring.style.clipPath = clipUnderHeader(r.top - pad - 4);
      ring.style.display = "block";
    }
    /** A ring never draws across the site's fixed header (nav and announcement bar): what lies under it is cut off. `top` is the ring's outer top edge. */
    const clipUnderHeader = (top: number): string => {
      const hd = document.querySelector("header")?.getBoundingClientRect().bottom ?? 0;
      return hd > top ? `inset(${Math.ceil(hd - top)}px -20px -20px -20px)` : "none";
    };
    /** The ring for keyboard focus on a photo/marker: two tones (white, then ink) so it shows on any picture, kept on screen even for a full-bleed photo. */
    function positionFocusRing() {
      if (!fring) return;
      const hide = () => { if (fring!.style.display !== "none") fring!.style.display = "none"; };
      const el = focusEl;
      if (!el || !document.contains(el) || document.activeElement !== el || (sel && selTargets().includes(el))) return hide();
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return hide();
      const m = 7; // the two-tone ring is 6 px thick outside its box: where the photo runs past the window, the ring stays inside it
      const l = Math.max(r.left, m), t = Math.max(r.top, m), rt = Math.min(r.right, innerWidth - m), b = Math.min(r.bottom, innerHeight - m);
      if (rt - l < 4 || b - t < 4) return hide();
      const rad = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;
      fring.style.borderRadius = `${Math.max(7, rad)}px`;
      fring.style.left = `${l}px`; fring.style.top = `${t}px`; fring.style.width = `${rt - l}px`; fring.style.height = `${b - t}px`;
      fring.style.clipPath = clipUnderHeader(t - 6);
      fring.style.display = "block";
    }
    const clearMarks = () => {
      document.querySelectorAll(".cms-sel").forEach((n) => n.classList.remove("cms-sel"));
      document.querySelectorAll(".cms-sel-sec").forEach((n) => n.classList.remove("cms-sel-sec"));
    };
    const stamp = () => {
      clearMarks();
      if (!sel) return;
      selTargets().forEach((el) => el.classList.add(sel!.attr === "data-section" ? "cms-sel-sec" : "cms-sel"));
    };
    const boxOf = (el: HTMLElement | null) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.left), y: Math.round(r.top), width: Math.round(r.width), height: Math.round(r.height) };
    };
    const sections = () => Array.from(document.querySelectorAll<HTMLElement>("[data-section]"));
    const KIND_ATTR: Record<string, string> = { text: "data-cms", image: "data-cms-img", link: "data-cms-link", section: "data-section", pick: "data-cms-pick" };

    /** How a photo is framed where it sits now: the editor draws the chosen picture the same way (how it is fitted, and which part it keeps). */
    const frameOf = (el: HTMLElement): { fit: string; pos: string; known: boolean } => {
      const img = el.matches("img") ? el : el.querySelector("img");
      const cs = getComputedStyle(img ?? el);
      if (img) return { fit: cs.objectFit || "fill", pos: cs.objectPosition || "50% 50%", known: true };
      // a background picture: its size and position; an element with no picture of its own (the invisible marker over a hero) is not known
      return cs.backgroundImage && cs.backgroundImage !== "none" ? { fit: cs.backgroundSize || "cover", pos: cs.backgroundPosition || "50% 50%", known: true } : { fit: "cover", pos: "50% 50%", known: false };
    };
    /** Select an element: ring it and tell Studio. `extra` rides along (label/href); `echo` marks an editor:select answer. */
    function select(el: HTMLElement, kind: "text" | "image" | "link" | "section" | "pick", extra: Record<string, unknown> = {}, opts: { echo?: boolean; quiet?: boolean } = {}) {
      const attr = KIND_ATTR[kind];
      const value = el.getAttribute(attr) || "";
      const same = !!sel && sel.attr === attr && sel.value === value;
      sel = { attr, value, kind };
      secSelId = kind === "section" ? value : "";
      stamp(); positionRing();
      if (opts.quiet || (same && !opts.echo)) return;
      // a text or pick selection says what the element reads now (trimmed, spaces collapsed, capped), so Studio can show it
      const text = kind === "text" || kind === "pick" ? { text: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, SELECT_TEXT_CAP) } : {};
      post({ type: "cms:select", path: value, kind: kind === "pick" ? "text" : kind, box: boxOf(el), ...(kind === "image" ? { frame: frameOf(el) } : {}), ...text, ...extra, ...(opts.echo ? { echo: true } : {}) });
    }
    function clearSelection(tell: boolean) {
      const had = !!sel;
      sel = null; secSelId = ""; stamp(); positionRing();
      if (tell && had) post({ type: "cms:select", path: "", kind: "none", box: null });
    }
    const textExtra = (el: HTMLElement) => {
      const linkEl = el.closest("[data-cms-href]");
      return linkEl ? { hrefPath: linkEl.getAttribute("data-cms-href"), href: linkEl.getAttribute("href") || "" } : {};
    };

    /* ── editability (edit mode on a page that IS the draft) ── */
    const imgTabbed = new Set<HTMLElement>();
    const ensureEditable = () => {
      const on = effMode() === "edit";
      if (on) {
        fields().forEach((el) => {
          if (el.getAttribute("contenteditable") !== "true") el.setAttribute("contenteditable", "true");
          el.spellcheck = false;
          if (!el.hasAttribute("tabindex")) { el.setAttribute("tabindex", "0"); tabAdded.add(el); }
          editable.add(el);
        });
        // a fact shown in several places on a page (the service times) is ONE Tab stop: the first; a click on any of them still opens it
        const pickSeen = new Set<string>();
        picks().forEach((el) => {
          const v = el.getAttribute("data-cms-pick") || "";
          if (el.getClientRects().length === 0) { if (!el.hasAttribute("tabindex")) { el.setAttribute("tabindex", "0"); tabAdded.add(el); } return; } // the other layout's copy (the phone menu): not a stop here
          if (pickSeen.has(v)) { if (tabAdded.has(el)) { el.removeAttribute("tabindex"); tabAdded.delete(el); } return; }
          pickSeen.add(v);
          if (!el.hasAttribute("tabindex")) { el.setAttribute("tabindex", "0"); tabAdded.add(el); }
        });
        // a photo is reachable by keyboard: Tab stops on it and Enter or Space opens it, as a press does
        document.querySelectorAll<HTMLElement>("[data-cms-img]").forEach((el) => {
          if (!el.hasAttribute("tabindex")) { el.setAttribute("tabindex", "0"); tabAdded.add(el); imgTabbed.add(el); }
          if (!el.hasAttribute("role")) { el.setAttribute("role", "button"); imgTabbed.add(el); }
          if (el.getAttribute("aria-hidden") === "true") { el.removeAttribute("aria-hidden"); } // a focusable button is not hidden from assistive tech
          if (!el.hasAttribute("aria-label")) { el.setAttribute("aria-label", fixedImg.has(el.getAttribute("data-cms-img") || "") ? (/^g:logo/.test(el.getAttribute("data-cms-img") || "") ? "Church logo, set in the website's files" : "Photo built into the website") : "Change photo"); imgTabbed.add(el); }
          el.toggleAttribute("data-cms-fixed", fixedImg.has(el.getAttribute("data-cms-img") || ""));
        });
        // Tab walks the editable things in reading order: the site's own links and controls step out of the tab order.
        document.querySelectorAll<HTMLElement>(SITE_CONTROLS).forEach((el) => {
          if (inChrome(el) || el.hasAttribute("data-cms") || el.hasAttribute("data-cms-pick") || el.hasAttribute("data-cms-img") || tabWas.has(el)) return;
          tabWas.set(el, el.getAttribute("tabindex"));
          el.setAttribute("tabindex", "-1");
        });
      } else {
        editable.forEach((el) => { el.removeAttribute("contenteditable"); if (tabAdded.has(el)) { el.removeAttribute("tabindex"); tabAdded.delete(el); } });
        editable.clear();
        picks().forEach((el) => { if (tabAdded.has(el)) { el.removeAttribute("tabindex"); tabAdded.delete(el); } });
        imgTabbed.forEach((el) => { if (tabAdded.has(el)) { el.removeAttribute("tabindex"); tabAdded.delete(el); } el.removeAttribute("role"); el.removeAttribute("aria-label"); el.removeAttribute("data-cms-fixed"); });
        imgTabbed.clear();
        tabWas.forEach((was, el) => { if (was === null) el.removeAttribute("tabindex"); else el.setAttribute("tabindex", was); });
        tabWas.clear();
      }
    };
    const SITE_CONTROLS = "a[href],button,input,select,textarea,summary,[tabindex]";

    /* keep rings and editability across a client re-render that mounts fresh nodes */
    const CMS_SELECTOR = "[data-cms],[data-cms-img],[data-cms-link]";
    const anchored = new WeakSet<HTMLElement>();
    const ensureAnchored = () => {
      document.querySelectorAll<HTMLElement>(CMS_SELECTOR).forEach((el) => {
        if (anchored.has(el)) return;
        anchored.add(el);
        // Anchor the hover ring unless the element is ALREADY positioned (a full-bleed `absolute inset-0`
        // wrapper must keep its own position or it collapses). jsdom reports "" for unpositioned.
        const pos = getComputedStyle(el).position;
        if (pos !== "absolute" && pos !== "fixed" && pos !== "sticky" && pos !== "relative") el.style.position = "relative";
      });
    };
    const shimImg: Record<string, string> = {};
    const applyImgTo = (el: HTMLElement, src: string) => {
      const img = (el.tagName === "IMG" ? el : el.querySelector("img")) as HTMLImageElement | null;
      if (img && img.getAttribute("src") !== src) { img.removeAttribute("srcset"); img.removeAttribute("sizes"); img.setAttribute("src", src); }
    };
    const observer = new MutationObserver(() => {
      for (const [p, src] of Object.entries(shimImg)) byAttr("data-cms-img", p).forEach((el) => applyImgTo(el, src));
      if (sel) { stamp(); positionRing(); }
      ensureAnchored(); ensureEditable();
    });

    /* ── sending edits ── */
    const flushEl = (el: HTMLElement) => {
      if (!dirty.has(el)) return;
      dirty.delete(el);
      const path = pathOf(el);
      if (!path) return;
      inputSent.delete(path);
      const value = sanitizeHtml(el.innerHTML);
      if (lastSent.get(path) === value) return;
      lastSent.set(path, value);
      post({ type: "cms:edit", path, value });
    };
    const flushAll = () => {
      if (timer) { clearTimeout(timer); timer = null; }
      Array.from(dirty).forEach(flushEl);
    };
    const markDirty = (el: HTMLElement) => {
      dirty.add(el);
      if (composing) return;
      if (timer) clearTimeout(timer);
      timer = setTimeout(flushAll, 250);
    };

    /* ── caps ── */
    const textLen = (el: HTMLElement) => (el.textContent || "").length;
    const selLenIn = (el: HTMLElement) => {
      const s = window.getSelection();
      if (!s || !s.rangeCount) return 0;
      const r = s.getRangeAt(0);
      return el.contains(r.startContainer) && el.contains(r.endContainer) ? r.toString().length : 0;
    };
    const updateCounter = (el: HTMLElement | null) => {
      if (!cap) return;
      const c = el ? capFor(caps, pathOf(el)) : 0;
      if (!el || !c || effMode() !== "edit") { cap.style.display = "none"; return; }
      const n = textLen(el);
      cap.textContent = `${n} / ${c}`;
      cap.setAttribute("data-state", n >= c ? "full" : n >= c * 0.9 ? "near" : "ok");
      const r = el.getBoundingClientRect();
      cap.style.display = "block";
      cap.style.top = `${Math.min(window.innerHeight - 28, r.bottom + 6)}px`;
      cap.style.left = `${Math.max(8, Math.min(window.innerWidth - 90, r.right - 70))}px`;
    };
    const trimToCap = (el: HTMLElement, c: number) => {
      let over = textLen(el) - c;
      if (over <= 0) return;
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      const nodes: Text[] = []; let n: Node | null;
      while ((n = walker.nextNode())) nodes.push(n as Text);
      for (let i = nodes.length - 1; i >= 0 && over > 0; i--) {
        const t = nodes[i]; const len = (t.nodeValue || "").length; const cut = Math.min(len, over);
        t.nodeValue = (t.nodeValue || "").slice(0, len - cut); over -= cut;
      }
      setCaretAt(el, textLen(el));
    };

    /* ── caret helpers ── */
    const caretOffset = (el: HTMLElement): number => {
      const s = window.getSelection();
      if (!s || !s.rangeCount || !el.contains(s.anchorNode)) return -1;
      const r = document.createRange();
      r.selectNodeContents(el); r.setEnd(s.anchorNode!, s.anchorOffset);
      return r.toString().length;
    };
    function setCaretAt(el: HTMLElement, offset: number) {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      let pos = 0, n: Node | null, target: Text | null = null, at = 0;
      while ((n = walker.nextNode())) {
        const len = (n.nodeValue || "").length;
        if (offset <= pos + len) { target = n as Text; at = offset - pos; break; }
        pos += len;
      }
      const r = document.createRange();
      if (target) { r.setStart(target, at); r.collapse(true); } else { r.selectNodeContents(el); r.collapse(false); }
      const s = window.getSelection(); s?.removeAllRanges(); s?.addRange(r);
    }

    /* insert plain text at the selection of `el`, as one undoable step where the browser allows */
    const insertPlain = (el: HTMLElement, text: string) => {
      if (!text) return;
      if (typeof document.execCommand === "function") {
        try { if (document.execCommand("insertText", false, text)) return; } catch { /* fall through */ }
      }
      const s = window.getSelection();
      if (!s || !s.rangeCount || !el.contains(s.anchorNode)) setCaretAt(el, textLen(el));
      const r = window.getSelection()!.getRangeAt(0);
      r.deleteContents();
      const t = document.createTextNode(text);
      r.insertNode(t); r.setStartAfter(t); r.collapse(true);
      const s2 = window.getSelection()!; s2.removeAllRanges(); s2.addRange(r);
      el.dispatchEvent(new Event("input", { bubbles: true }));
    };

    /* ── format bar (B, I, Link) ── */
    const selectedFieldRange = (): { el: HTMLElement; range: Range } | null => {
      const s = window.getSelection();
      if (!s || !s.rangeCount) return null;
      const range = s.getRangeAt(0);
      const a = fieldOf(range.startContainer.nodeType === 1 ? range.startContainer : range.startContainer.parentElement);
      const b = fieldOf(range.endContainer.nodeType === 1 ? range.endContainer : range.endContainer.parentElement);
      if (!a || a !== b || !editable.has(a)) return null;
      return { el: a, range };
    };
    function hideBar() { if (bar) bar.style.display = "none"; }
    function updateBar() {
      if (!bar) return;
      const f = selectedFieldRange();
      if (effMode() !== "edit" || !f || f.range.collapsed) { if (!card || card.style.display !== "flex") hideBar(); return; }
      let rect: DOMRect | null = null;
      try { rect = f.range.getBoundingClientRect(); } catch { rect = null; }
      if (!rect || (rect.width === 0 && rect.height === 0)) rect = f.el.getBoundingClientRect();
      // the words scrolled out of the window (or under the header): the bar does not stay behind, pinned over the page; it is back with the words
      const hd = document.querySelector("header")?.getBoundingClientRect().bottom ?? 0;
      if (rect.bottom < hd + 4 || rect.top > innerHeight - 4) { if (!card || card.style.display !== "flex") hideBar(); return; }
      bar.style.display = "flex";
      const bw = bar.offsetWidth || 150;
      let top = rect.top - (bar.offsetHeight || 38) - 10;
      if (top < 8) top = rect.bottom + 10;
      bar.style.top = `${Math.max(8, top)}px`;
      bar.style.left = `${Math.min(Math.max(8, rect.left + rect.width / 2 - bw / 2), Math.max(8, window.innerWidth - bw - 8))}px`;
      const q = (c: string) => { try { return !!document.queryCommandState?.(c); } catch { return false; } };
      bar.querySelectorAll("button").forEach((b) => {
        const l = b.getAttribute("aria-label");
        if (l === "Bold") b.setAttribute("aria-pressed", String(q("bold")));
        if (l === "Italic") b.setAttribute("aria-pressed", String(q("italic")));
      });
    }
    function format(cmd: "bold" | "italic") {
      const f = selectedFieldRange();
      if (!f) return;
      let done = false;
      if (typeof document.execCommand === "function") {
        try { document.execCommand("styleWithCSS", false, "false"); done = document.execCommand(cmd); } catch { done = false; }
      }
      if (!done) {
        const w = document.createElement(cmd === "bold" ? "b" : "i");
        try { w.appendChild(f.range.extractContents()); f.range.insertNode(w); } catch { return; }
      }
      markDirty(f.el); updateBar();
    }

    /* ── link card ── */
    const sitePages = () => {
      if (pages.length) return pages;
      const seen = new Set<string>(); const out: { title: string; href: string }[] = [];
      document.querySelectorAll<HTMLAnchorElement>("header a[href], nav a[href]").forEach((a) => {
        const href = a.getAttribute("href") || ""; const title = (a.textContent || "").trim();
        if (!href.startsWith("/") || href.startsWith("//") || !title || seen.has(href)) return;
        seen.add(href); out.push({ title, href });
      });
      return out;
    };
    const anchorAt = (range: Range, el: HTMLElement): HTMLAnchorElement | null => {
      const n = range.commonAncestorContainer;
      const a = (n.nodeType === 1 ? (n as HTMLElement) : n.parentElement)?.closest("a");
      return a && el.contains(a) ? (a as HTMLAnchorElement) : null;
    };
    function renderPages() {
      if (!cardList || !cardInput) return;
      const q = cardInput.value.trim().toLowerCase();
      cardList.textContent = "";
      const urlish = /^([a-z][a-z0-9+.-]*:|\/|#)/i.test(q);
      if (urlish) return;
      sitePages().filter((p) => !q || p.title.toLowerCase().includes(q)).slice(0, 6).forEach((p, i) => {
        const b = document.createElement("button");
        b.type = "button"; b.setAttribute("data-page", p.href);
        if (i === 0 && q) b.setAttribute("data-active", "1");
        b.innerHTML = `<span></span><small></small>`;
        (b.firstChild as HTMLElement).textContent = p.title; (b.lastChild as HTMLElement).textContent = p.href;
        b.addEventListener("mousedown", (e) => { e.preventDefault(); applyLink(p.href); });
        cardList!.appendChild(b);
      });
    }
    function openLinkCard() {
      const f = selectedFieldRange();
      if (!f || !card || !cardInput || effMode() !== "edit") return;
      const anchor = anchorAt(f.range, f.el);
      if (f.range.collapsed && !anchor) return;
      savedRange = f.range.cloneRange();
      cardInput.value = anchor?.getAttribute("href") || "";
      if (cardRemove) cardRemove.style.display = anchor ? "" : "none";
      renderPages();
      card.style.display = "flex";
      const r = (() => { try { const rr = f.range.getBoundingClientRect(); return rr.width || rr.height ? rr : f.el.getBoundingClientRect(); } catch { return f.el.getBoundingClientRect(); } })();
      card.style.top = `${Math.max(8, Math.min(window.innerHeight - 220, r.bottom + 10))}px`;
      card.style.left = `${Math.max(8, Math.min(window.innerWidth - 296, r.left))}px`;
      hideBar();
      cardInput.focus();
      cardInput.select();
    }
    function closeLinkCard(refocus: boolean) {
      if (!card) return;
      card.style.display = "none";
      const f = savedRange ? fieldOf(savedRange.commonAncestorContainer.nodeType === 1 ? savedRange.commonAncestorContainer : savedRange.commonAncestorContainer.parentElement) : null;
      if (refocus && f) {
        f.focus({ preventScroll: true });
        const s = window.getSelection(); s?.removeAllRanges(); if (savedRange) s?.addRange(savedRange);
      }
    }
    function applyLink(raw: string) {
      const href = safeHref(raw);
      if (!href || !savedRange) return false;
      const f = fieldOf(savedRange.commonAncestorContainer.nodeType === 1 ? savedRange.commonAncestorContainer : savedRange.commonAncestorContainer.parentElement);
      if (!f) return false;
      const existing = anchorAt(savedRange, f);
      closeLinkCard(true);
      if (existing) { existing.setAttribute("href", href); }
      else {
        let done = false;
        if (typeof document.execCommand === "function") {
          try { done = document.execCommand("createLink", false, href); } catch { done = false; }
        }
        if (!done) {
          const a = document.createElement("a"); a.setAttribute("href", href);
          const r = savedRange;
          const frag = r.extractContents();
          frag.querySelectorAll("a").forEach((x) => x.replaceWith(...Array.from(x.childNodes)));
          a.appendChild(frag); r.insertNode(a);
        }
      }
      markDirty(f); flushEl(f);
      return true;
    }
    function removeLink() {
      if (!savedRange) return;
      const f = fieldOf(savedRange.commonAncestorContainer.nodeType === 1 ? savedRange.commonAncestorContainer : savedRange.commonAncestorContainer.parentElement);
      if (!f) return;
      const a = anchorAt(savedRange, f);
      closeLinkCard(true);
      if (a) { a.replaceWith(...Array.from(a.childNodes)); markDirty(f); flushEl(f); }
    }
    function commitLinkFromInput() {
      if (!cardInput) return;
      const v = cardInput.value.trim();
      const first = cardList?.querySelector<HTMLElement>("[data-page]");
      if (first && !/^([a-z][a-z0-9+.-]*:|\/|#)/i.test(v)) { applyLink(first.getAttribute("data-page") || ""); return; }
      applyLink(v);
    }

    /* ── events on the page ── */
    const ownerAnchors = (t: HTMLElement) => t.closest("a,button") as HTMLElement | null;

    let kbdNav = false; // the last thing a person did in the page was press a key (not a click)
    function ensureVisible(el: HTMLElement) {
      const hd = document.querySelector("header")?.getBoundingClientRect().bottom ?? 0;
      const top = Math.max(0, hd) + 12, bot = innerHeight - 14;
      const b = el.getBoundingClientRect();
      const fits = b.height <= bot - top;
      const placed = fits ? b.top >= top && b.bottom <= bot : b.top < bot - (bot - top) * 0.2 && b.bottom > top + (bot - top) * 0.2;
      if (placed) return;
      window.scrollTo({ top: Math.max(0, scrollY + (fits ? b.top + b.height / 2 - (top + bot) / 2 : b.top - top)), behavior: "instant" as ScrollBehavior });
    }
    const onFocusIn = (e: FocusEvent) => {
      if (inChrome(e.target)) return;
      const pk = pickOf(e.target);
      const ph = (e.target as HTMLElement | null)?.closest?.("[data-cms-img]") as HTMLElement | null;
      // a photo, a marker or a link takes the keyboard-focus ring; the ring of the words before it goes (never two places lit)
      if (!fieldOf(e.target) && (ph || pk)) {
        focusEl = ph || pk;
        activeEl = null; if (cap) cap.style.display = "none"; hideBar(); // the counter and the format bar belong to the words just left
        if (sel && sel.kind === "text") clearSelection(true);
        positionFocusRing();
      } else focusEl = null;
      // by keyboard, whatever took focus is brought fully into view, clear of the fixed header (words, photos and markers alike)
      const tgt = (fieldOf(e.target) || ph || pk) as HTMLElement | null;
      if (tgt && effMode() === "edit" && (!fieldOf(e.target) ? tgt.matches(":focus-visible") : kbdNav)) ensureVisible(tgt);
      // a pick marker is selected by a click or Enter/Space, never by focus alone (Tab onto it, or a focus that follows a click)
      if (pk && !fieldOf(e.target)) return;
      const el = fieldOf(e.target);
      if (!el) return;
      activeEl = el;
      const p = pathOf(el);
      if (!lastSent.has(p)) lastSent.set(p, sanitizeHtml(el.innerHTML));
      select(el, "text", textExtra(el));
      updateCounter(el);
    };
    const onFocusOut = (e: FocusEvent) => {
      if (focusEl && !(e.relatedTarget && focusEl.contains(e.relatedTarget as Node))) { focusEl = null; positionFocusRing(); }
      const el = fieldOf(e.target);
      if (!el) return;
      flushEl(el);
      const to = e.relatedTarget as HTMLElement | null;
      if (activeEl === el && !(to && inChrome(to))) { activeEl = null; if (cap) cap.style.display = "none"; }
    };
    const onInput = (e: Event) => {
      if (inChrome(e.target)) return;
      const el = fieldOf(e.target);
      if (!el || effMode() !== "edit") return;
      activeEl = el;
      const c = capFor(caps, pathOf(el));
      if (c && !composing) trimToCap(el, c);
      markDirty(el);
      updateCounter(el);
      // the first keystroke of a burst is announced at once (no wait), so Studio can show "Editing" in the same frame
      const ip = pathOf(el);
      if (ip && !inputSent.has(ip)) { inputSent.add(ip); post({ type: "cms:input", path: ip }); }
    };
    const BLOCKED_INPUT = /^(insertFromDrop|insertFromYank|insertOrderedList|insertUnorderedList|insertHorizontalRule|insertTranspose|formatUnderline|formatStrikeThrough|formatSuperscript|formatSubscript|formatJustify.*|formatIndent|formatOutdent|formatFontName|formatFontSize.*|formatForeColor|formatBackColor|formatSetBlockTextDirection|formatSetInlineTextDirection)$/;
    const onBeforeInput = (e: Event) => {
      const el = fieldOf(e.target);
      if (!el || inChrome(e.target)) return;
      const ev = e as InputEvent;
      const t = ev.inputType || "";
      if (effMode() !== "edit") { e.preventDefault(); return; }
      if (BLOCKED_INPUT.test(t)) { e.preventDefault(); return; }
      if (t === "insertParagraph" || t === "insertLineBreak") {
        e.preventDefault();
        // a heading, label or button is one line: Enter finishes the line. Body copy takes a soft break.
        if (el.closest("h1,h2,h3,h4,h5,h6,label,button,a,[data-cms-line]")) { flushEl(el); return; }
        insertBreak(el);
        return;
      }
      const c = capFor(caps, pathOf(el));
      if (c && !ev.isComposing && (t === "insertText" || t === "insertReplacementText")) {
        const add = (ev.data || "").length;
        if (textLen(el) - selLenIn(el) + add > c) e.preventDefault();
      }
    };
    function insertBreak(el: HTMLElement) {
      if (typeof document.execCommand === "function") {
        try { if (document.execCommand("insertLineBreak")) return; } catch { /* fall through */ }
      }
      const s = window.getSelection(); if (!s || !s.rangeCount) return;
      const r = s.getRangeAt(0); r.deleteContents();
      const br = document.createElement("br"); r.insertNode(br); r.setStartAfter(br); r.collapse(true);
      s.removeAllRanges(); s.addRange(r);
      el.dispatchEvent(new Event("input", { bubbles: true }));
    }
    const onPaste = (e: Event) => {
      const el = fieldOf(e.target);
      if (!el || inChrome(e.target)) return;
      e.preventDefault();
      if (effMode() !== "edit") return;
      const cd = (e as ClipboardEvent).clipboardData;
      let text = (cd?.getData("text/plain") || "").replace(/\s*[\r\n]+\s*/g, " ");
      const c = capFor(caps, pathOf(el));
      if (c) text = text.slice(0, Math.max(0, c - (textLen(el) - selLenIn(el))));
      insertPlain(el, text);
      if (c) trimToCap(el, c);
      updateCounter(el);
    };
    const onDrop = (e: Event) => { if (fieldOf(e.target) || (e as DragEvent).dataTransfer?.files?.length) e.preventDefault(); };
    const onCompStart = () => { composing = true; };
    const onCompEnd = (e: Event) => {
      composing = false;
      const el = fieldOf(e.target);
      if (!el) return;
      const c = capFor(caps, pathOf(el));
      if (c) trimToCap(el, c);
      markDirty(el); updateCounter(el);
    };
    const onSelChange = () => {
      if (activeEl) updateCounter(activeEl);
      updateBar();
    };

    const onClick = (e: MouseEvent) => {
      if (inChrome(e.target)) return;
      const tgt = e.target as HTMLElement;
      const em = effMode();
      let text = tgt?.closest?.("[data-cms]") as HTMLElement | null;
      if (mode === "visitor") {
        // see the page as a visitor does, but never leave it: the canvas must keep its token
        const a = tgt?.closest?.("a") as HTMLAnchorElement | null;
        const h = a?.getAttribute("href") || "";
        if (a && h && !h.startsWith("#")) { e.preventDefault(); e.stopPropagation(); }
        return;
      }
      const pk = pickOf(tgt);
      if (pk && !text) {
        e.preventDefault(); e.stopPropagation();
        select(pk, "pick");
        return;
      }
      let img = tgt?.closest?.("[data-cms-img]") as HTMLElement | null;
      const link = tgt?.closest?.("[data-cms-link]") as HTMLElement | null;
      // A page-top photo sits UNDER the section's text layer, so a press on the empty part of that layer lands on the layer, not the
      // photo. When the press is not on words, a link or a button, the photo under the pointer is the one meant.
      if (!img && !text && !link && !tgt?.closest?.("a,button,input,textarea,select,[data-cms-pick]") && typeof document.elementsFromPoint === "function") {
        for (const el of document.elementsFromPoint(e.clientX, e.clientY)) {
          const hit = (el as HTMLElement).closest?.("[data-cms-img]") as HTMLElement | null;
          if (hit) { img = hit; break; }
        }
      }
      // On a phone the words are not edited, so a press on words over a photo means the photo.
      if (photoFirst && em === "edit" && text && !link && !tgt?.closest?.("a,button,input,textarea,select,[data-cms-pick]") && typeof document.elementsFromPoint === "function") {
        for (const el of document.elementsFromPoint(e.clientX, e.clientY)) {
          const hit = (el as HTMLElement).closest?.("[data-cms-img]") as HTMLElement | null;
          if (hit) { img = hit; text = null; break; }
        }
      }
      if (img && !text) {
        e.preventDefault(); e.stopPropagation();
        select(img, "image");
        return;
      }
      if (link && !text) {
        e.preventDefault(); e.stopPropagation();
        const lab = (link.querySelector("[data-cms-link-label]") as HTMLElement | null)?.textContent ?? link.textContent ?? "";
        select(link, "link", { label: lab, href: link.getAttribute("href") || "" });
        return;
      }
      if (text) {
        const a = ownerAnchors(tgt);
        if (a) e.preventDefault(); // a field inside a link edits, it does not navigate
        if (em !== "edit" || !activeEl) select(text, "text", textExtra(text));
        return;
      }
      const sec = tgt?.closest?.("[data-section]") as HTMLElement | null;
      if (sec) {
        e.preventDefault(); e.stopPropagation();
        select(sec, "section");
        return;
      }
      if (ownerAnchors(tgt)) { e.preventDefault(); e.stopPropagation(); }
    };
    const onDocMouseDown = (e: MouseEvent) => {
      kbdNav = false;
      if (inChrome(e.target)) return;
      const t = e.target as HTMLElement;
      if (!t?.closest?.("[data-cms]")) hideBar();
      if (mode === "visitor") return;
      if (t?.closest?.("[data-cms]")) return; // real text: let the caret land
      const obj = t?.closest?.("[data-cms-img],[data-cms-link],[data-cms-pick],[data-section]");
      if (obj) {
        // no stray caret or text selection from pressing on a photo, button or section...
        e.preventDefault();
        // ...but pressing there still ends the edit in the field that had focus, and sends its text
        if (activeEl) { flushEl(activeEl); activeEl.blur(); }
      }
    };

    const visible = (el: HTMLElement) => {
      if (el.closest("[hidden],[aria-hidden='true']")) return false;
      const cs = getComputedStyle(el);
      return cs.display !== "none" && cs.visibility !== "hidden";
    };
    /** A photo marker may be an empty aria-hidden layer (the shared hero): it is still a stop, so only real hiding counts. */
    const shown = (el: HTMLElement) => { const cs = getComputedStyle(el); return cs.display !== "none" && cs.visibility !== "hidden"; };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") kbdNav = true;
      const em = effMode();
      const k = e.key;
      // Studio owns these: with focus inside the page they would otherwise be lost to the browser (or save the page as a file).
      if ((e.metaKey || e.ctrlKey) && !e.altKey && (k === "Enter" || k === "s" || k === "S" || ((k === "z" || k === "Z") && !fieldOf(document.activeElement)))) {
        e.preventDefault();
        flushAll();
        post({ type: "cms:key", key: k.length === 1 ? k.toLowerCase() : k, mod: true, shift: e.shiftKey });
        return;
      }
      if ((k === "Enter" || k === " ") && em === "edit" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const ph = (document.activeElement as HTMLElement | null)?.closest?.("[data-cms-img]") as HTMLElement | null;
        if (ph && !fieldOf(document.activeElement)) { e.preventDefault(); sel = null; select(ph, "image", { key: true }); return; }
        const pk = pickOf(document.activeElement);
        if (pk && !fieldOf(document.activeElement)) { e.preventDefault(); sel = null; select(pk, "pick", { key: true }); return; }
      }
      if ((e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey && (k === "k" || k === "K")) {
        if (em === "edit" && selectedFieldRange()) { e.preventDefault(); openLinkCard(); }
        return;
      }
      if (k === "Escape") {
        if (card && card.style.display === "flex") { e.preventDefault(); closeLinkCard(true); return; }
        post({ type: "cms:key", key: "Escape", mod: false, shift: false });
        const cur = activeEl || fieldOf(document.activeElement);
        if (cur && document.activeElement === cur) {
          flushAll(); cur.blur(); activeEl = null; hideBar(); if (cap) cap.style.display = "none";
          window.getSelection()?.removeAllRanges();
          return;
        }
        if (secSelId) {
          const id = secSelId; const index = sections().findIndex((s) => s.getAttribute("data-section") === id);
          clearSelection(false);
          post({ type: "cms:section", op: "deselect", id, index });
          return;
        }
        if (sel) clearSelection(true);
        return;
      }
      if (k === "Tab" && em === "edit" && !e.ctrlKey && !e.metaKey && !e.altKey && !inChrome(e.target)) {
        // One reading order for everything a person can edit: words, photos and the select-only markers, as the page lays them out.
        const act = document.activeElement as HTMLElement | null;
        const stopOf = (n: HTMLElement | null): HTMLElement | null => (n ? fieldOf(n) ?? (n.closest?.("[data-cms-img]") as HTMLElement | null) ?? pickOf(n) : null);
        const cur = stopOf(act);
        if (!cur) return;
        const stops = Array.from(document.querySelectorAll<HTMLElement>("[data-cms],[data-cms-img],[data-cms-pick]"))
          .filter((n) => (n.hasAttribute("data-cms") ? editable.has(n) && visible(n) : n.getAttribute("tabindex") === "0" && (n.hasAttribute("data-cms-img") ? shown(n) : visible(n))) && n.getClientRects().length > 0 && (n === cur || !n.contains(cur)))
          .sort((x, y) => (x === y ? 0 : x.compareDocumentPosition(y) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
        const i = stops.indexOf(cur);
        const next = stops[i + (e.shiftKey ? -1 : 1)];
        if (i < 0 || !next) return; // past the first or last stop: let focus leave the page
        e.preventDefault();
        flushAll();
        next.focus({ preventScroll: false });
        if (next.hasAttribute("data-cms")) {
          const r = document.createRange(); r.selectNodeContents(next);
          const sl = window.getSelection(); sl?.removeAllRanges(); sl?.addRange(r);
        } else window.getSelection()?.removeAllRanges();
        return;
      }
      if (e.altKey && (k === "ArrowUp" || k === "ArrowDown") && em === "edit" && secSelId && !fieldOf(document.activeElement)) {
        const all = sections();
        const i = all.findIndex((s) => s.getAttribute("data-section") === secSelId);
        const j = i + (k === "ArrowUp" ? -1 : 1);
        if (i < 0 || j < 0 || j >= all.length) return;
        e.preventDefault();
        post({ type: "cms:section", op: "move", id: secSelId, index: j });
      }
    };
    const onScroll = () => { positionRing(); updateBar(); if (activeEl && document.activeElement === activeEl) updateCounter(activeEl); };
    const onResize = () => { positionRing(); updateBar(); };
    const onHide = () => flushAll();
    const onVis = () => { if (document.visibilityState === "hidden") flushAll(); };

    document.addEventListener("focusin", onFocusIn, true);
    document.addEventListener("focusout", onFocusOut, true);
    document.addEventListener("input", onInput, true);
    document.addEventListener("beforeinput", onBeforeInput, true);
    document.addEventListener("paste", onPaste, true);
    document.addEventListener("drop", onDrop, true);
    document.addEventListener("compositionstart", onCompStart, true);
    document.addEventListener("compositionend", onCompEnd, true);
    document.addEventListener("selectionchange", onSelChange);
    document.addEventListener("click", onClick, true);
    document.addEventListener("mousedown", onDocMouseDown, true);
    document.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pagehide", onHide);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize, true);

    /* ── messages from Studio ── */
    const setMode = (next: BridgeMode) => {
      const was = effMode();
      mode = next;
      const now = effMode();
      if (was === "edit" && now !== "edit") { flushAll(); if (activeEl) activeEl.blur(); activeEl = null; hideBar(); if (cap) cap.style.display = "none"; }
      root.setAttribute("data-cms-mode", now);
      root.toggleAttribute("data-cms-locked", mode === "edit" && now !== "edit");
      if (next === "visitor") {
        dropChrome(); clearMarks(); sel = null; secSelId = "";
        root.removeAttribute("data-cms-edit");
      } else {
        buildChrome();
        root.setAttribute("data-cms-edit", "1");
        stamp(); positionRing();
      }
      ensureEditable();
    };

    const findByPath = (path: string): { el: HTMLElement; kind: "text" | "image" | "link" | "section" } | null => {
      for (const kind of ["text", "image", "link", "section"] as const) {
        const hit = byAttr(KIND_ATTR[kind], path);
        if (hit.length) return { el: hit.find((el) => { const r = el.getBoundingClientRect(); return r.width > 0; }) || hit[0], kind };
      }
      return null;
    };

    const onMsg = (e: MessageEvent) => {
      if (e.origin !== STUDIO || e.source !== window.parent) return;
      const d = e.data as Record<string, unknown> | null;
      if (!d || typeof d !== "object" || d.v !== V || d.source !== "c3editor" || typeof d.type !== "string") return;
      switch (d.type) {
        case "editor:mode": {
          if (typeof d.mode !== "string" || !MODES.includes(d.mode as BridgeMode)) return;
          if (d.caps && typeof d.caps === "object") {
            const next: Record<string, number> = {};
            for (const [k, v] of Object.entries(d.caps as Record<string, unknown>)) if (typeof v === "number" && Number.isFinite(v) && v > 0) next[k.slice(0, 200)] = Math.floor(v);
            caps = next;
          }
          photoFirst = d.photoFirst === true;
          if (Array.isArray(d.fixed)) fixedImg = new Set((d.fixed as unknown[]).filter((k): k is string => typeof k === "string").slice(0, 100));
          if (Array.isArray(d.pages)) {
            pages = (d.pages as unknown[]).slice(0, 200).flatMap((p) => {
              const o = p as { title?: unknown; href?: unknown };
              const href = safeHref(o?.href);
              return typeof o?.title === "string" && href ? [{ title: o.title.slice(0, 80), href }] : [];
            });
          }
          setMode(d.mode as BridgeMode);
          postReady("mode");
          return;
        }
        case "editor:select": {
          if (typeof d.path !== "string" || d.path.length > 300) return;
          if (d.path === "") { clearSelection(false); return; }
          const hit = findByPath(d.path);
          if (!hit || mode === "visitor") return;
          // bring it into view first, so the box we answer with is where the person will see it
          try { hit.el.scrollIntoView({ block: "nearest" }); } catch { /* old engine */ }
          select(hit.el, hit.kind, hit.kind === "text" ? textExtra(hit.el) : {}, { echo: true });
          // the section rail pressed from the keyboard: the keyboard goes into the section, to its first stop
          if (hit.kind === "section" && d.focusIn === true && effMode() === "edit") {
            const first = Array.from(hit.el.querySelectorAll<HTMLElement>("[data-cms],[data-cms-img],[data-cms-pick]")).find((n) => n.getAttribute("tabindex") === "0" && n.getClientRects().length > 0 && (n.hasAttribute("data-cms") ? editable.has(n) : true));
            if (first) { kbdNav = true; first.focus({ preventScroll: true }); ensureVisible(first); }
            return;
          }
          if (hit.kind === "text" && effMode() === "edit" && editable.has(hit.el)) {
            hit.el.focus({ preventScroll: true });
            setCaretAt(hit.el, textLen(hit.el));
          }
          return;
        }
        case "editor:apply": {
          if (typeof d.path !== "string" || d.path.length > 300) return;
          applyValue(d.path, d.value);
          return;
        }
      }
    };

    function applyValue(path: string, value: unknown) {
      // text: a string of HTML, reduced to the allow-list
      if (typeof value === "string") {
        const html = sanitizeHtml(value);
        const texts = byAttr("data-cms", path);
        if (texts.length) {
          lastSent.set(path, html);
          texts.forEach((el) => {
            const focused = document.activeElement === el;
            if (focused && (dirty.has(el) || composing)) return; // the editor's copy is older than the typing in it
            if (sanitizeHtml(el.innerHTML) === html) return;
            const at = focused ? caretOffset(el) : -1;
            el.innerHTML = html;
            if (focused && at >= 0) setCaretAt(el, Math.min(at, textLen(el)));
            if (focused) updateCounter(el);
          });
          return;
        }
        // image: a URL string
        const imgs = byAttr("data-cms-img", path);
        const src = mediaSrc(safeImgSrc(value)); // the canvas shows an upload through the same /media path a visitor gets
        if (imgs.length && src) { shimImg[path] = src; imgs.forEach((el) => applyImgTo(el, src)); }
        return;
      }
      // link: {label?, href?}
      if (value && typeof value === "object") {
        const v = value as { label?: unknown; href?: unknown };
        byAttr("data-cms-link", path).forEach((a) => {
          const href = safeHref(v.href);
          if (href) a.setAttribute("href", href);
          if (typeof v.label === "string") {
            const lab = a.querySelector("[data-cms-link-label]") as HTMLElement | null;
            (lab || a).textContent = v.label.slice(0, 200);
          }
        });
      }
    }

    window.addEventListener("message", onMsg);
    setMode("view");
    observer.observe(document.body, { childList: true, subtree: true });
    ensureAnchored();
    postReady("load");

    return () => {
      flushAll();
      document.removeEventListener("focusin", onFocusIn, true);
      document.removeEventListener("focusout", onFocusOut, true);
      document.removeEventListener("input", onInput, true);
      document.removeEventListener("beforeinput", onBeforeInput, true);
      document.removeEventListener("paste", onPaste, true);
      document.removeEventListener("drop", onDrop, true);
      document.removeEventListener("compositionstart", onCompStart, true);
      document.removeEventListener("compositionend", onCompEnd, true);
      document.removeEventListener("selectionchange", onSelChange);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("mousedown", onDocMouseDown, true);
      document.removeEventListener("keydown", onKeyDown, true);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pagehide", onHide);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize, true);
      window.removeEventListener("message", onMsg);
      if (timer) clearTimeout(timer);
      observer.disconnect();
      mode = "view"; ensureEditable();
      clearMarks(); dropChrome();
      root.removeAttribute("data-cms-edit"); root.removeAttribute("data-cms-mode"); root.removeAttribute("data-cms-locked");
    };
  }, []);

  return null;
}
