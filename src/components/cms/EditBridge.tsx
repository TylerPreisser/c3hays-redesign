"use client";

import { useEffect } from "react";
import { buildBgCss } from "@/lib/backgrounds";
import { FONT_PICKER } from "@/lib/fonts";

/**
 * EditBridge — turns the live site into an ON-PAGE editor when embedded in C3
 * Studio (`?cmsEdit=1` + inside an iframe). Click any tagged element to place a
 * caret and type in place; select text to format (bold/italic/color/size/font).
 * Changes are sent to the editor via postMessage (NO page reload). On the public
 * site this does nothing.
 *
 * Messages to parent (source:"c3site"):
 *   {type:"cms:ready"}
 *   {type:"cms:edit", path, html}     // a region's content changed
 *   {type:"cms:focus", path}          // a region was focused (caret placed)
 *   {type:"cms:focus", path, hrefPath, href} // ITEM 5: focused text sits inside a
 *                                     // data-cms-href anchor → carries a link the
 *                                     // editor can expose as a link field (additive;
 *                                     // plain text still posts the {path}-only shape)
 *   {type:"cms:log", ev, ...}         // debug events for the live runner
 * From parent (source:"c3editor"):
 *   {type:"cms:setHtml", path, html}     // set a region's content (external update)
 *   {type:"cms:setImg", path, src}       // U10: live-swap a tagged image (preview only)
 *   {type:"cms:setStyle", path, background}            // U10: live-paint a tagged tile bg (preview only)
 *   {type:"cms:setStyle", path, background, scope:"section"} // v8 P6: live-paint a SECTION bg
 */
export default function EditBridge() {
  useEffect(() => {
    let on = false;
    try {
      const q = new URLSearchParams(window.location.search);
      on = q.get("cmsEdit") === "1" && window.parent !== window;
    } catch { on = false; }
    if (!on) return;

    const post = (m: Record<string, unknown>) => window.parent.postMessage({ source: "c3site", ...m }, "*");
    const log = (ev: string, data: Record<string, unknown> = {}) => post({ type: "cms:log", ev, ...data });

    document.documentElement.setAttribute("data-cms-edit", "1");

    const style = document.createElement("style");
    style.textContent = `
      /* v6 R9: an obviously-EDITOR affordance — an animated dashed "marching-ants"
         outline that circles the hovered/selected element (never a plain website
         hover). cmsEdit-only (this whole stylesheet is injected only in edit mode);
         prefers-reduced-motion falls back to a static dashed outline. The outline is
         a pointer-events:none ::after overlay, so it never covers the element's own
         background or blocks clicks. */
      /* v8 iter-2 D17: NO blanket position:relative here. That rule (injected AFTER
         Tailwind, equal specificity → later wins) turned full-bleed hero wrappers
         (<div class="absolute inset-0" data-cms-img="…">) into position:relative, so
         inset-0 stopped stretching them → wrapper 0×0 → <Image fill> 0×0 → hero blank
         in the editor. Anchoring is now done in JS, only for elements whose COMPUTED
         position is static (see ensureAnchored). */
      [data-cms], [data-cms-img], [data-cms-link], [data-cms-icon], [data-cms-bg]{ border-radius:7px; }
      /* BUG #1 (mission layout jump): editable headings use text-wrap:balance, which the
         browser RE-COMPUTES the moment the element becomes a focused contenteditable —
         re-wrapping e.g. the mission statement 3→4 lines and JUMPING the section height
         (473→553px) on hover/select/focus. Forcing a stable, non-balanced wrap in EDIT
         MODE ONLY (this sheet is injected only when cmsEdit=1) makes the idle and focused
         layouts identical, so the section height is STABLE while editing. The published
         site (no cmsEdit) keeps text-wrap:balance untouched. */
      [data-cms]{ text-wrap: normal !important; }
      [data-cms]{ cursor:text; transition:background-color .12s ease; }
      [data-cms]:hover{ background-color: rgba(28,195,175,.05); }
      [data-cms-img], [data-cms-link], [data-cms-icon], [data-cms-bg]{ cursor:pointer; }
      /* the marching border — shown on hover, and persistently on the selected element */
      [data-cms]:hover::after, [data-cms-img]:hover::after, [data-cms-link]:hover::after, [data-cms-icon]:hover::after, [data-cms-bg]:hover::after,
      [data-cms].cms-sel::after, [data-cms-img].cms-sel::after, [data-cms-link].cms-sel::after, [data-cms-icon].cms-sel::after, [data-cms-bg].cms-sel::after{
        content:""; position:absolute;
        /* v8 D3: PIN the geometry with !important. Some tagged elements own their own
           author ::after (e.g. globals.css .nav-link-underline::after sets width:0;
           height:2px;bottom:-2px). That author rule leaks its width/height/inset into
           this overlay and collapses the marching-ants ring to a 0x2px sliver — the
           "navbar ring still wrong" bug. Forcing all four insets AND width/height with
           !important beats any co-resident author ::after regardless of specificity or
           order, so the ring always renders as a full rectangle around EVERY data-cms.  */
        top:-3px!important; right:-3px!important; bottom:-3px!important; left:-3px!important;
        width:auto!important; height:auto!important;
        /* v8 P4: RESET the background-color. The nav links carry
           .nav-link-underline whose ::after sets background-color:var(--color-teal)
           (globals.css). Because D3 above pins this overlay to full size
           (inset:-3px + width/height:auto !important), that leaked solid teal fills
           the whole box and paints an unreadable SOLID GREEN BOX over the label. The
           ants are drawn via background-IMAGE, so forcing background-COLOR transparent
           keeps the marching-ants ring while letting the text ("ABOUT" etc.) show. */
        background-color: transparent !important;
        border-radius:9px; pointer-events:none; z-index:2147482000;
        --ant: rgba(28,195,175,.85);
        background-image:
          repeating-linear-gradient(90deg, var(--ant) 0 7px, transparent 7px 14px),
          repeating-linear-gradient(90deg, var(--ant) 0 7px, transparent 7px 14px),
          repeating-linear-gradient(0deg,  var(--ant) 0 7px, transparent 7px 14px),
          repeating-linear-gradient(0deg,  var(--ant) 0 7px, transparent 7px 14px);
        background-size: 100% 2px, 100% 2px, 2px 100%, 2px 100%;
        background-position: 0 0, 0 100%, 0 0, 100% 0;
        background-repeat: no-repeat;
        animation: c3ants .5s linear infinite;
      }
      /* SELECTED = distinct: deeper teal, thicker ants, a touch faster. */
      [data-cms].cms-sel::after, [data-cms-img].cms-sel::after, [data-cms-link].cms-sel::after, [data-cms-icon].cms-sel::after, [data-cms-bg].cms-sel::after{
        --ant: #179c8c; background-size: 100% 3px, 100% 3px, 3px 100%, 3px 100%; animation-duration:.38s;
      }
      @keyframes c3ants{ to{ background-position: 14px 0, -14px 100%, 0 -14px, 100% 14px; } }
      /* ITEM 3: UNIVERSAL selection outline for IMAGES. A full-bleed image wrapper
         (<div class="absolute inset-0" data-cms-img>) fills its section EXACTLY, and the
         shared ring above pins to inset:-3px — i.e. 3px OUTSIDE the wrapper on every side.
         Hero/photo sections commonly set overflow:hidden, which then clips that entire
         outer ring → the image read as selected (.cms-sel added, "Change image" chip up)
         but showed NO marching ants. Text/tile/link/icon/section rings are never clipped
         because those elements sit INSIDE larger containers, so this override is scoped to
         images only: draw the ring a few px INSIDE the element (never clipped by an
         ancestor's overflow:hidden) and lift it above any scrim / next-image layer. The
         --ant color + thicker background-size from the .cms-sel rule above still apply. */
      [data-cms-img]:hover::after, [data-cms-img].cms-sel::after{
        top:2px!important; right:2px!important; bottom:2px!important; left:2px!important;
        z-index:2147483000;
      }
      /* keystone A/C: SECTION selection outline. Every page composed by PageComposer
         wraps each section in <div data-section=id>. Clicking a section's own chrome
         (canvas, symptom A) OR its rail card (symptom C) stamps .cms-sel-sec on that
         wrapper → the SAME marching-ants, sized for a full section. Positioned only
         when selected so the plain wrapper never changes layout in normal flow. */
      [data-section].cms-sel-sec{ position: relative; }
      [data-section].cms-sel-sec::after{
        content:""; position:absolute; top:2px!important; right:2px!important; bottom:2px!important; left:2px!important;
        width:auto!important; height:auto!important; background-color:transparent!important;
        border-radius:12px; pointer-events:none; z-index:2147481000;
        --ant:#0ea5a0;
        background-image:
          repeating-linear-gradient(90deg, var(--ant) 0 9px, transparent 9px 18px),
          repeating-linear-gradient(90deg, var(--ant) 0 9px, transparent 9px 18px),
          repeating-linear-gradient(0deg,  var(--ant) 0 9px, transparent 9px 18px),
          repeating-linear-gradient(0deg,  var(--ant) 0 9px, transparent 9px 18px);
        background-size: 100% 3px, 100% 3px, 3px 100%, 3px 100%;
        background-position: 0 0, 0 100%, 0 0, 100% 0;
        background-repeat: no-repeat;
        animation: c3ants .5s linear infinite;
      }
      @media (prefers-reduced-motion: reduce){ [data-section].cms-sel-sec::after{ animation:none; } }
      @media (prefers-reduced-motion: reduce){
        [data-cms]:hover::after, [data-cms-img]:hover::after, [data-cms-link]:hover::after, [data-cms-icon]:hover::after, [data-cms-bg]:hover::after,
        [data-cms].cms-sel::after, [data-cms-img].cms-sel::after, [data-cms-link].cms-sel::after, [data-cms-icon].cms-sel::after, [data-cms-bg].cms-sel::after{ animation:none; }
      }
      /* v7 R6: selection = the marching-ants ONLY. Kill the solid green box — the
         c3hays brand :focus-visible ring (globals.css: outline 2px solid teal) that
         paints a filled rounded box while a contenteditable/link is focused. Scoped
         to edit mode (this whole sheet is injected only when cmsEdit=1), so the
         public-site focus ring stays intact for accessibility. */
      [data-cms]:focus, [data-cms]:focus-visible,
      [data-cms].cms-sel, [data-cms-img].cms-sel, [data-cms-link].cms-sel, [data-cms-icon].cms-sel, [data-cms-bg].cms-sel,
      [data-cms].cms-sel:focus-visible, [data-cms-link].cms-sel:focus-visible, [data-cms-img].cms-sel:focus-visible, [data-cms-icon].cms-sel:focus-visible, [data-cms-bg].cms-sel:focus-visible{
        outline: none !important;
      }
      /* v7 R5: the on-canvas "Edit section" oval (#c3-sec-handle) is REMOVED — section
         editing is triggered from the right-rail SectionDock card, not a floating pill. */
      /* v4 R2: the floating "recolor this tile" handle. A packed tile has almost no
         bare background to click, so the v3 click-empty-pixels path was undiscoverable
         (a click landed a text caret). This EXPLICIT chip appears on hover over any
         recolorable element ([data-cms-bg]) and opens the background picker. */
      #c3-bg-handle{ position:fixed; z-index:2147483646; display:none; align-items:center; gap:6px;
        background:#7c3aed; color:#fff; font:700 12px/1 -apple-system,system-ui,sans-serif;
        padding:6px 11px; border-radius:999px; border:none; cursor:pointer; box-shadow:0 6px 18px rgba(0,0,0,.28); }
      #c3-bg-handle:hover{ background:#6d28d9; }
      /* v7 R12: the DISCOVERABLE per-image "Change image" chip (top-LEFT of the hovered
         image — the old section oval that lived there is gone). Makes swapping a photo
         obvious for Kale, instead of relying on knowing you can click the image. */
      #c3-img-handle{ position:fixed; z-index:2147483646; display:none; align-items:center; gap:6px;
        background:#1cc3af; color:#042e29; font:700 12px/1 -apple-system,system-ui,sans-serif;
        padding:6px 11px; border-radius:999px; border:none; cursor:pointer; box-shadow:0 6px 18px rgba(0,0,0,.28); }
      #c3-img-handle:hover{ background:#15b3a0; }
      /* #2 events add/remove: the per-card DELETE chip (bottom-right of an authored
         event card [data-cms-card]) → posts cms:removeCard so the editor drops it. */
      #c3-card-delete{ position:fixed; z-index:2147483646; display:none; align-items:center; gap:6px;
        background:#c0392b; color:#fff; font:700 12px/1 -apple-system,system-ui,sans-serif;
        padding:6px 11px; border-radius:999px; border:none; cursor:pointer; box-shadow:0 6px 18px rgba(0,0,0,.28); }
      #c3-card-delete:hover{ background:#a93226; }
      [data-cms-edit-badge]{ position:fixed; z-index:2147483646; background:#1cc3af; color:#042e29; font:700 11px/1 -apple-system,sans-serif;
        padding:4px 8px; border-radius:999px; pointer-events:none; transform:translateY(-50%); box-shadow:0 4px 12px rgba(0,0,0,.25); }
      #c3-toolbar{ position:fixed; z-index:2147483647; display:none; gap:2px; align-items:center;
        background:#1b1c1c; color:#fff; border-radius:10px; padding:5px; box-shadow:0 10px 30px rgba(0,0,0,.35);
        font-family:-apple-system,system-ui,sans-serif; }
      #c3-toolbar button, #c3-toolbar select, #c3-toolbar label{ background:transparent; color:#fff; border:none; border-radius:6px;
        font-size:13px; height:28px; min-width:28px; padding:0 6px; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; }
      #c3-toolbar button:hover{ background:#333; }
      #c3-toolbar .sep{ width:1px; height:18px; background:#3a3b3b; margin:0 3px; }
      #c3-toolbar .sw{ width:18px; height:18px; border-radius:50%; border:2px solid #555; cursor:pointer; padding:0; }
      #c3-toolbar select{ background:#2a2b2b; }
    `;
    document.head.appendChild(style);

    // U10 preview shim (background): paint via an injected, !important STYLESHEET rule
    // keyed by data-cms-bg (mirrors buildBgCss) — NOT an inline element style. A
    // document stylesheet is not reset when React re-renders the tagged element, so
    // the preview survives a client re-render (e.g. a client component re-rendering
    // and re-applying its own inline background). Preview-only; no persistence.
    const shimBg: Record<string, string> = {};
    // v8 polish P6: a SECTION bg edit (scope:"section") paints a `[data-section=id]>*`
    // rule — routed through buildBgCss's SECTIONS arg, exactly like the published path
    // (page.tsx buildBgCss(c.sections,…)). Keyed separately from the data-cms-bg tiles.
    const shimSections: Record<string, string> = {};
    const shimStyle = document.createElement("style");
    shimStyle.id = "c3-shim-bg";
    document.head.appendChild(shimStyle);
    const rebuildShim = () => {
      const secs = Object.entries(shimSections).map(([id, bg]) => ({ id, visible: true, bg }));
      shimStyle.textContent = buildBgCss(secs, shimBg);
    };
    const applyShimBg = (path: string, background: string) => {
      if (background) shimBg[path] = background; else delete shimBg[path];
      rebuildShim();
    };
    const applyShimSection = (id: string, background: string) => {
      if (background) shimSections[id] = background; else delete shimSections[id];
      rebuildShim();
    };

    // Unit L: preview IMAGE swaps (esp. the per-variant logos g:logo-light/dark).
    // Store the applied overrides and re-apply them whenever a matching data-cms-img
    // (re)MOUNTS — a client re-render (e.g. the header swapping the light/dark logo
    // on scroll) mounts a FRESH <img> with the DEFAULT src, which silently drops the
    // preview swap. Unlike a background (a durable stylesheet rule), an <img> src is
    // reset on remount, so we re-apply on mount via a MutationObserver — not only on
    // cms:ready. Preview-only; never changes what Publish persists.
    const shimImg: Record<string, string> = {};
    const applyImgTo = (el: HTMLElement, src: string) => {
      const img = (el.tagName === "IMG" ? el : el.querySelector("img")) as HTMLImageElement | null;
      if (img && img.src !== src) { img.removeAttribute("srcset"); img.src = src; }
    };
    const applyShimImg = (path: string, src: string) => {
      if (src) shimImg[path] = src; else delete shimImg[path];
      if (src) document.querySelectorAll<HTMLElement>(`[data-cms-img="${path}"]`).forEach((el) => applyImgTo(el, src));
    };
    const reapplyShimImgs = () => {
      for (const [path, src] of Object.entries(shimImg)) {
        document.querySelectorAll<HTMLElement>(`[data-cms-img="${path}"]`).forEach((el) => applyImgTo(el, src));
      }
    };

    // v7 R6: PERSIST the selection by PATH, not by node. The sticky header (and any
    // client re-render) mounts FRESH nodes that lack the `.cms-sel` class, so the
    // marching-ants vanish mid-edit — esp. in the nav bar. We remember the selected
    // element as a stable attribute-selector and re-stamp `.cms-sel` onto whatever
    // node currently matches it, on every DOM mutation (same remount hook the image
    // shim already uses). Empty ⇒ nothing selected. Preview-only; no persistence.
    let selPath = "";
    const reapplySel = () => {
      if (!selPath) return;
      const cur = document.querySelectorAll<HTMLElement>(selPath);
      if (!cur.length) return; // element not (re)mounted yet — leave prior state
      document.querySelectorAll(".cms-sel").forEach((n) => { if (!(n as HTMLElement).matches(selPath)) n.classList.remove("cms-sel"); });
      cur.forEach((el) => el.classList.add("cms-sel"));
    };

    // keystone A/C: SECTION selection, persisted by data-section id (survives re-render,
    // same pattern as selPath). selectSection("") clears. Set from a canvas section-click
    // (A) and from an inbound cms:selectSection posted when a rail card is clicked (C).
    const cssEsc = (s: string) => (typeof CSS !== "undefined" && CSS.escape ? CSS.escape(s) : s.replace(/["\\]/g, "\\$&"));
    let secSelId = "";
    const clearSecSel = () => document.querySelectorAll(".cms-sel-sec").forEach((n) => n.classList.remove("cms-sel-sec"));
    const selectSection = (id: string) => {
      secSelId = id || "";
      clearSecSel();
      if (!secSelId) return;
      document.querySelectorAll<HTMLElement>(`[data-section="${cssEsc(secSelId)}"]`).forEach((el) => el.classList.add("cms-sel-sec"));
    };
    const reapplySecSel = () => {
      if (!secSelId) return;
      const sel = `[data-section="${cssEsc(secSelId)}"]`;
      const cur = document.querySelectorAll<HTMLElement>(sel);
      if (!cur.length) return; // section not (re)mounted yet
      document.querySelectorAll(".cms-sel-sec").forEach((n) => { if (!(n as HTMLElement).matches(sel)) n.classList.remove("cms-sel-sec"); });
      cur.forEach((el) => el.classList.add("cms-sel-sec"));
    };

    // v8 iter-2 D17: anchor the marching-ants ::after by making ONLY static elements
    // position:relative. Elements already positioned (absolute/fixed/sticky/relative —
    // e.g. a full-bleed `absolute inset-0` hero wrapper, or a next/image `fill`) KEEP
    // their own position so `inset` still stretches them (no 0×0 collapse). Idempotent
    // per node via a WeakSet, so getComputedStyle runs at most once per element and
    // freshly-mounted nodes (client re-renders) get anchored on the next mutation.
    const CMS_SELECTOR = "[data-cms],[data-cms-img],[data-cms-link],[data-cms-icon],[data-cms-bg]";
    const anchored = new WeakSet<HTMLElement>();
    const ensureAnchored = () => {
      document.querySelectorAll<HTMLElement>(CMS_SELECTOR).forEach((el) => {
        if (anchored.has(el)) return;
        anchored.add(el);
        // Anchor unless the element is ALREADY positioned. (Real browsers report
        // "static" for unpositioned; jsdom reports "" — treat both as needing anchor.)
        const pos = getComputedStyle(el).position;
        if (pos !== "absolute" && pos !== "fixed" && pos !== "sticky" && pos !== "relative") {
          el.style.position = "relative";
        }
      });
    };

    // #2 fix (general): make EVERY [data-cms] editable, including nodes a CLIENT island
    // mounts AFTER this effect's one-time scan (e.g. /events upcoming cards fetched async,
    // /news live lists). Before this, the doc-level focusin/click still selected+outlined
    // them (they "highlighted") but they never got contenteditable, so you couldn't type —
    // exactly the "clicking highlights but won't let me edit" bug. Idempotent; re-run on
    // every DOM mutation via the observer below.
    const ensureEditable = () => {
      document.querySelectorAll<HTMLElement>("[data-cms]").forEach((el) => {
        if (el.getAttribute("contenteditable") !== "true") { el.setAttribute("contenteditable", "true"); el.spellcheck = false; }
      });
    };

    const imgObserver = new MutationObserver(() => { if (Object.keys(shimImg).length) reapplyShimImgs(); reapplySel(); reapplySecSel(); ensureAnchored(); ensureEditable(); });
    imgObserver.observe(document.body, { childList: true, subtree: true });

    // ── build the floating toolbar ──
    const bar = document.createElement("div");
    bar.id = "c3-toolbar";
    bar.contentEditable = "false";
    const mkBtn = (html: string, title: string, fn: () => void) => {
      const b = document.createElement("button"); b.innerHTML = html; b.title = title;
      b.addEventListener("mousedown", (e) => { e.preventDefault(); fn(); });
      return b;
    };
    const exec = (cmd: string, val?: string) => { document.execCommand("styleWithCSS", false, "true"); document.execCommand(cmd, false, val); afterFormat(cmd + (val ? ":" + val : "")); };
    bar.appendChild(mkBtn("<b>B</b>", "Bold", () => exec("bold")));
    bar.appendChild(mkBtn("<i>I</i>", "Italic", () => exec("italic")));
    bar.appendChild(mkBtn("<u>U</u>", "Underline", () => exec("underline")));
    const sep1 = document.createElement("span"); sep1.className = "sep"; bar.appendChild(sep1);
    // colors
    const colors = ["#1b1c1c", "#1cc3af", "#ffffff", "#6b6c6c", "#c0392b", "#d98a16"];
    colors.forEach((c) => { const s = document.createElement("button"); s.className = "sw"; s.style.background = c; s.title = "Color " + c; s.addEventListener("mousedown", (e) => { e.preventDefault(); exec("foreColor", c); }); bar.appendChild(s); });
    const custom = document.createElement("input"); custom.type = "color"; custom.title = "Custom color"; custom.style.cssText = "width:24px;height:24px;border:none;background:none;cursor:pointer;padding:0;";
    custom.addEventListener("input", () => exec("foreColor", custom.value)); bar.appendChild(custom);
    const sep2 = document.createElement("span"); sep2.className = "sep"; bar.appendChild(sep2);
    // size
    const size = document.createElement("select"); size.title = "Text size";
    [["2", "S"], ["3", "M"], ["5", "L"], ["7", "XL"]].forEach(([v, l]) => { const o = document.createElement("option"); o.value = v; o.textContent = l; size.appendChild(o); });
    size.value = "3"; size.addEventListener("mousedown", (e) => e.stopPropagation()); size.addEventListener("change", () => exec("fontSize", size.value)); bar.appendChild(size);
    // font — a VISIBLE picker: each name is rendered in its own font.
    // v6 R7: DERIVED from the shared FONT_CATALOG (via FONT_PICKER), the same catalog
    // that generates the layout <link>, so nothing offered here is ever unloaded.
    const FONTS: [string, string][] = FONT_PICKER;
    const fontBtn = document.createElement("button");
    fontBtn.innerHTML = "Font ▾"; fontBtn.title = "Font"; fontBtn.style.minWidth = "60px";
    const fontMenu = document.createElement("div");
    fontMenu.id = "c3-fontmenu";
    fontMenu.style.cssText = "position:fixed; z-index:2147483647; display:none; max-height:320px; overflow-y:auto; overscroll-behavior:contain; background:#1b1c1c; border:1px solid #333; border-radius:10px; padding:6px; box-shadow:0 16px 40px rgba(0,0,0,.45); min-width:200px;";
    // Keep the wheel inside the menu — never let it scroll the page behind it.
    fontMenu.addEventListener("wheel", (e) => {
      const atTop = fontMenu.scrollTop === 0;
      const atBottom = fontMenu.scrollTop + fontMenu.clientHeight >= fontMenu.scrollHeight - 1;
      if ((e.deltaY < 0 && atTop) || (e.deltaY > 0 && atBottom)) e.preventDefault();
      e.stopPropagation();
    }, { passive: false });
    FONTS.forEach(([fam, name]) => {
      const it = document.createElement("div");
      it.textContent = name; it.style.cssText = `font-family:${fam}; color:#fff; padding:8px 12px; border-radius:7px; cursor:pointer; font-size:17px; white-space:nowrap;`;
      it.addEventListener("mouseenter", () => (it.style.background = "#333"));
      it.addEventListener("mouseleave", () => (it.style.background = "transparent"));
      it.addEventListener("mousedown", (e) => { e.preventDefault(); exec("fontName", fam); fontMenu.style.display = "none"; });
      fontMenu.appendChild(it);
    });
    document.body.appendChild(fontMenu);
    fontBtn.addEventListener("mousedown", (e) => {
      e.preventDefault();
      if (fontMenu.style.display === "block") { fontMenu.style.display = "none"; return; }
      const r = fontBtn.getBoundingClientRect();
      fontMenu.style.left = `${Math.min(r.left, window.innerWidth - 220)}px`;
      fontMenu.style.top = `${r.bottom + 6}px`;
      fontMenu.style.display = "block";
    });
    bar.appendChild(fontBtn);
    const sep3 = document.createElement("span"); sep3.className = "sep"; bar.appendChild(sep3);
    bar.appendChild(mkBtn("✕", "Clear formatting", () => exec("removeFormat")));
    document.body.appendChild(bar);

    // ── v7 R5: the on-canvas "Edit section" oval is GONE ──
    // Section editing is triggered from the right-rail SectionDock card (which already
    // sets secSel in HomeEditor). No floating canvas pill — one predictable affordance.

    // ── v4 R2: floating "recolor this tile" chip ──
    // The discoverable recolor affordance. Hovering ANY recolorable element
    // ([data-cms-bg] — pillar/ministry tiles, contact cards, footer) reveals this
    // chip; clicking it posts cms:select{kind:"bg",path} so the editor opens the
    // background picker. Same stable message contract as the old bare-pixel click,
    // but a human can actually find and hit it.
    const bgChip = document.createElement("button");
    bgChip.id = "c3-bg-handle";
    bgChip.type = "button";
    bgChip.setAttribute("data-cms-recolor", "");
    bgChip.innerHTML = `<span aria-hidden="true">🎨</span> Recolor`;
    let bgPath = "";
    bgChip.addEventListener("mousedown", (e) => {
      e.preventDefault(); e.stopPropagation();
      if (bgPath) { post({ type: "cms:select", kind: "bg", path: bgPath }); log("select-bg-chip", { path: bgPath }); }
    });
    document.body.appendChild(bgChip);

    // ── v7 R12: discoverable "Change image" chip ──
    // Hovering any image reveals this chip; clicking it opens the image Inspector
    // (same cms:select{kind:"image"} the image-click posts), so swapping/uploading a
    // photo is an obvious affordance — not a hidden click-the-image gesture.
    const imgChip = document.createElement("button");
    imgChip.id = "c3-img-handle";
    imgChip.type = "button";
    imgChip.setAttribute("data-cms-change-image", "");
    imgChip.innerHTML = `<span aria-hidden="true">🖼</span> Change image`;
    let imgPath = "";
    imgChip.addEventListener("mousedown", (e) => {
      e.preventDefault(); e.stopPropagation();
      if (imgPath) { post({ type: "cms:select", kind: "image", path: imgPath }); log("select-image-chip", { path: imgPath }); }
    });
    document.body.appendChild(imgChip);

    // ── #2 events add/remove: per-card DELETE chip ──
    // Hovering an authored event card ([data-cms-card="events.cards.<id>"]) reveals a
    // Delete chip; clicking posts cms:removeCard so the editor drops that card from
    // PageOverrides.cards and reloads the canvas. (Adding a card is the editor's
    // "Add event card" section control — the first add flips the grid live→authored.)
    const cardDelChip = document.createElement("button");
    cardDelChip.id = "c3-card-delete";
    cardDelChip.type = "button";
    cardDelChip.innerHTML = `<span aria-hidden="true">🗑</span> Delete event`;
    let cardDelPath = "";
    cardDelChip.addEventListener("mousedown", (e) => {
      e.preventDefault(); e.stopPropagation();
      if (cardDelPath) {
        const id = cardDelPath.split(".").slice(2).join("."); // "events.cards.<id>" → <id>
        post({ type: "cms:removeCard", list: "events.cards", id });
        log("remove-card", { path: cardDelPath });
        cardDelChip.style.display = "none"; cardDelPath = "";
      }
    });
    document.body.appendChild(cardDelChip);
    const positionCardDel = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      cardDelChip.style.top = `${Math.max(6, Math.min(window.innerHeight - 44, r.bottom - 44))}px`;
      cardDelChip.style.left = `${Math.max(6, Math.min(window.innerWidth - 136, r.right - 136))}px`;
      cardDelChip.style.display = "inline-flex";
    };

    let activeEl: HTMLElement | null = null;
    const pathOf = (el: HTMLElement | null) => el?.getAttribute("data-cms") || "";

    function positionBar() {
      const sel = window.getSelection();
      let rect: DOMRect | null = null;
      if (sel && sel.rangeCount && !sel.isCollapsed) rect = sel.getRangeAt(0).getBoundingClientRect();
      else if (activeEl) rect = activeEl.getBoundingClientRect();
      if (!rect) return;
      bar.style.display = "flex";
      const bw = bar.offsetWidth || 360;
      let top = rect.top - bar.offsetHeight - 10;
      if (top < 8) top = rect.bottom + 10;
      bar.style.top = `${Math.max(8, top)}px`;
      bar.style.left = `${Math.min(Math.max(8, rect.left + rect.width / 2 - bw / 2), window.innerWidth - bw - 8)}px`;
    }
    function hideBar() { bar.style.display = "none"; fontMenu.style.display = "none"; }

    let t: ReturnType<typeof setTimeout> | null = null;
    function postEdit() {
      if (!activeEl) return;
      const path = pathOf(activeEl); const html = activeEl.innerHTML;
      post({ type: "cms:edit", path, html });
      log("edit", { path, len: html.length });
    }
    function afterFormat(what: string) { log("format", { path: pathOf(activeEl), what }); positionBar(); postEdit(); }

    // make every tagged element editable
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-cms]"));
    els.forEach((el) => { el.setAttribute("contenteditable", "true"); el.spellcheck = false; });
    ensureAnchored();
    log("ready", { regions: els.length });

    const onFocusIn = (e: FocusEvent) => {
      const el = (e.target as HTMLElement)?.closest?.("[data-cms]") as HTMLElement | null;
      if (!el) { return; }
      activeEl = el; positionBar();
      // v7 R6: focusing a text region SELECTS it — persistent marching-ants, not a
      // hover-only outline that vanishes when the mouse moves away.
      const p = pathOf(el);
      clearSel(); el.classList.add("cms-sel"); selPath = p ? `[data-cms="${p}"]` : "";
      // ITEM 5: a [data-cms] text node inside an element carrying data-cms-href (e.g.
      // the footer phone/email — an <a href=tel:/mailto:> whose LABEL is the editable
      // text) posts the link alongside the focus so the editor can render a link field.
      // Additive: with no data-cms-href we post the unchanged {path}-only shape, so the
      // text is still directly editable regardless of whether the editor reads hrefPath.
      const linkEl = el.closest("[data-cms-href]");
      if (linkEl) {
        post({ type: "cms:focus", path: p, hrefPath: linkEl.getAttribute("data-cms-href"), href: (linkEl as HTMLAnchorElement).getAttribute("href") || "" });
      } else {
        post({ type: "cms:focus", path: p });
      }
      log("focus", { path: p });
    };
    const onInput = (e: Event) => {
      const el = (e.target as HTMLElement)?.closest?.("[data-cms]") as HTMLElement | null;
      if (!el) return; activeEl = el;
      if (t) clearTimeout(t); t = setTimeout(postEdit, 350);
    };
    const onSelChange = () => { if (activeEl && document.activeElement && activeEl.contains(document.activeElement as Node)) positionBar(); };
    const clearSel = () => document.querySelectorAll(".cms-sel").forEach((n) => n.classList.remove("cms-sel"));
    const onClick = (e: MouseEvent) => {
      const tgt = e.target as HTMLElement;
      const img = tgt?.closest?.("[data-cms-img]") as HTMLElement | null;
      const link = tgt?.closest?.("[data-cms-link]") as HTMLElement | null;
      const icon = tgt?.closest?.("[data-cms-icon]") as HTMLElement | null;
      const text = tgt?.closest?.("[data-cms]") as HTMLElement | null;
      if (icon && !text) {
        e.preventDefault(); e.stopPropagation(); clearSel(); icon.classList.add("cms-sel");
        selPath = `[data-cms-icon="${icon.getAttribute("data-cms-icon")}"]`;
        post({ type: "cms:select", kind: "icon", path: icon.getAttribute("data-cms-icon") });
        log("select-icon", { path: icon.getAttribute("data-cms-icon") });
        return;
      }
      // OBJECT selection: image → open picker; link → edit label/href
      if (img && !text) {
        e.preventDefault(); e.stopPropagation(); clearSel(); img.classList.add("cms-sel");
        selPath = `[data-cms-img="${img.getAttribute("data-cms-img")}"]`;
        post({ type: "cms:select", kind: "image", path: img.getAttribute("data-cms-img") });
        log("select-image", { path: img.getAttribute("data-cms-img") });
        return;
      }
      if (link && !text) {
        e.preventDefault(); e.stopPropagation(); clearSel(); link.classList.add("cms-sel");
        selPath = `[data-cms-link="${link.getAttribute("data-cms-link")}"]`;
        const lab = (link.querySelector("[data-cms-link-label]") as HTMLElement)?.innerText ?? link.innerText;
        // ITEM 3: carry the button's inner HTML so the editor preview can render an
        // ICON-only button (Facebook/Instagram/YouTube) as its real icon, not "button".
        post({ type: "cms:select", kind: "link", path: link.getAttribute("data-cms-link"), label: lab, href: (link as HTMLAnchorElement).getAttribute?.("href") || "", html: link.innerHTML });
        log("select-link", { path: link.getAttribute("data-cms-link") });
        return;
      }
      // v3 R3: BACKGROUND selection — a tile's non-text area. Lowest priority, so
      // clicking its text/image/button/icon still edits those directly.
      const bg = tgt?.closest?.("[data-cms-bg]") as HTMLElement | null;
      if (bg && !text && !img && !link && !icon) {
        e.preventDefault(); e.stopPropagation(); clearSel(); bg.classList.add("cms-sel");
        selPath = `[data-cms-bg="${bg.getAttribute("data-cms-bg")}"]`;
        // ITEM 4: carry the tile's ACTUAL rendered background so the editor's picker
        // swatch shows the CURRENT color even when no bgFill override is saved yet.
        post({ type: "cms:select", kind: "bg", path: bg.getAttribute("data-cms-bg"), value: getComputedStyle(bg).backgroundColor });
        log("select-bg", { path: bg.getAttribute("data-cms-bg") });
        return;
      }
      // keystone A: SECTION selection — a click on a section's own chrome that isn't a
      // tagged text/image/link/icon/bg target selects the WHOLE section, so its rail
      // controls (move / bg / style / delete) open and the marching-ants ring the
      // section. Lowest priority, so editing any tile's content still wins. The rail
      // card (symptom C) is the always-available path; this makes the canvas work too.
      const sec = tgt?.closest?.("[data-section]") as HTMLElement | null;
      if (sec && !text && !img && !link && !icon && !bg) {
        e.preventDefault(); e.stopPropagation();
        const id = sec.getAttribute("data-section") || "";
        selectSection(id);
        post({ type: "cms:select", kind: "section", path: id });
        log("select-section", { path: id });
        return;
      }
      // plain links/buttons (untagged) — block navigation in edit mode
      const a = tgt?.closest?.("a,button");
      if (a && !text) { e.preventDefault(); e.stopPropagation(); log("blocked-nav", { to: (a as HTMLAnchorElement).getAttribute?.("href") || "" }); }
      if (a && text) e.preventDefault();
    };
    const onDocMouseDown = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t?.closest?.("[data-cms]") && !t?.closest?.("#c3-toolbar") && !t?.closest?.("#c3-fontmenu")) hideBar();
      // BUG #2 (click section/tile BACKGROUND highlights TEXT): the browser places a
      // text caret AND starts a text selection on mousedown — BEFORE our click handler
      // (onClick) gets to route the click to background / section selection. So the
      // nearest editable text got caret-focused + highlighted instead of the background
      // being selected. FIX: on mousedown, if the target is NOT inside a tagged text
      // region ([data-cms]) but IS inside a selectable OBJECT (bg tile / image / link /
      // icon / section wrapper), preventDefault → no caret, no text-selection. The click
      // handler below still fires and selects that background/section. Clicking ACTUAL
      // text ([data-cms] present) is untouched, so normal in-place editing still works.
      if (t?.closest?.("[data-cms]")) return; // real text — let the caret land
      if (t === bgChip || t === imgChip || t === cardDelChip || t?.closest?.("#c3-toolbar") || t?.closest?.("#c3-fontmenu")) return;
      const obj = t?.closest?.("[data-cms-bg],[data-cms-img],[data-cms-link],[data-cms-icon],[data-section]");
      if (obj) { e.preventDefault(); }
    };

    // v4 R2: position the recolor chip at the top-RIGHT of the hovered tile.
    const positionBgChip = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      bgChip.style.top = `${Math.max(6, r.top + 8)}px`;
      bgChip.style.left = `${Math.max(6, Math.min(window.innerWidth - 108, r.right - 108))}px`;
      bgChip.style.display = "inline-flex";
    };
    // v7 R12: the change-image chip sits top-LEFT of the image (the removed section oval's spot).
    const positionImgChip = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      imgChip.style.top = `${Math.max(6, r.top + 8)}px`;
      imgChip.style.left = `${Math.max(6, r.left + 8)}px`;
      imgChip.style.display = "inline-flex";
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      // Keep whichever chip the pointer moved onto (so it can be clicked).
      if (t === bgChip || t === imgChip || t === cardDelChip) return;
      // #2: show the per-card Delete chip whenever hovering an authored event card
      // (independent of the img/bg chips below, which keep their own behavior).
      const cardEl = t?.closest?.("[data-cms-card]") as HTMLElement | null;
      if (cardEl) { cardDelPath = cardEl.getAttribute("data-cms-card") || ""; positionCardDel(cardEl); }
      else { cardDelChip.style.display = "none"; cardDelPath = ""; }
      // v7 R7 + R12: images are NOT recolorable but ARE swappable. A [data-cms-img] often
      // sits INSIDE a recolorable [data-cms-bg] wrapper (e.g. a pillar photo), so suppress
      // the 🎨 recolor chip over images and instead show the discoverable 🖼 Change image chip.
      const imgEl = t?.closest?.("[data-cms-img]") as HTMLElement | null;
      if (imgEl) {
        bgChip.style.display = "none"; bgPath = "";
        imgPath = imgEl.getAttribute("data-cms-img") || ""; positionImgChip(imgEl);
        return;
      }
      imgChip.style.display = "none"; imgPath = "";
      // v4 R2: a recolorable element (tile / card / footer) → show the recolor chip.
      const bgEl = t?.closest?.("[data-cms-bg]") as HTMLElement | null;
      if (bgEl) { bgPath = bgEl.getAttribute("data-cms-bg") || ""; positionBgChip(bgEl); }
      else { bgChip.style.display = "none"; bgPath = ""; }
    };

    document.addEventListener("focusin", onFocusIn, true);
    document.addEventListener("input", onInput, true);
    document.addEventListener("selectionchange", onSelChange);
    document.addEventListener("click", onClick, true);
    document.addEventListener("mousedown", onDocMouseDown, true);
    document.addEventListener("mouseover", onOver, true);
    window.addEventListener("scroll", () => { if (bar.style.display === "flex") positionBar(); bgChip.style.display = "none"; imgChip.style.display = "none"; cardDelChip.style.display = "none"; }, true);

    const onMsg = (e: MessageEvent) => {
      const d = e.data; if (!d || d.source !== "c3editor") return;
      if (d.type === "cms:setHtml" && typeof d.path === "string") {
        document.querySelectorAll<HTMLElement>(`[data-cms="${d.path}"]`).forEach((el) => { if (el.innerHTML !== d.html) el.innerHTML = d.html; });
      } else if (d.type === "cms:setImg" && typeof d.path === "string") {
        // U10 preview shim: live-swap a tagged image (esp. the g:logo-* marks) so a
        // global image edit shows in the preview without a Publish/reload round-trip.
        // Unit L: stored + re-applied on remount (see applyShimImg / imgObserver).
        applyShimImg(d.path, typeof d.src === "string" ? d.src : "");
      } else if (d.type === "cms:setStyle" && typeof d.path === "string") {
        // Update the shim stylesheet (survives re-render); "" clears the rule → default.
        // v8 polish P6: scope:"section" paints a `[data-section=id]>*` rule; else a tile.
        const bg = typeof d.background === "string" ? d.background : "";
        if (d.scope === "section") applyShimSection(d.path, bg); else applyShimBg(d.path, bg);
      } else if (d.type === "cms:selectSection" && typeof d.id === "string") {
        // keystone C: the editor selected a section (rail card OR echoing a canvas
        // click) → ring that [data-section] and bring it into view so the user sees
        // exactly what they're editing.
        selectSection(d.id);
        if (d.id) {
          const el = document.querySelector<HTMLElement>(`[data-section="${cssEsc(d.id)}"]`);
          if (el && d.scroll !== false) el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      } else if (d.type === "cms:deselectSection") {
        selectSection("");
      }
    };
    window.addEventListener("message", onMsg);
    post({ type: "cms:ready" });

    return () => {
      document.removeEventListener("focusin", onFocusIn, true);
      document.removeEventListener("input", onInput, true);
      document.removeEventListener("selectionchange", onSelChange);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("mousedown", onDocMouseDown, true);
      document.removeEventListener("mouseover", onOver, true);
      window.removeEventListener("message", onMsg);
      els.forEach((el) => el.removeAttribute("contenteditable"));
      imgObserver.disconnect();
      bar.remove(); fontMenu.remove(); style.remove(); bgChip.remove(); imgChip.remove(); cardDelChip.remove(); shimStyle.remove();
      document.documentElement.removeAttribute("data-cms-edit");
    };
  }, []);

  return null;
}
