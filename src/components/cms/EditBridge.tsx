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
 *   {type:"cms:log", ev, ...}         // debug events for the live runner
 * From parent (source:"c3editor"):
 *   {type:"cms:setHtml", path, html}     // set a region's content (external update)
 *   {type:"cms:setImg", path, src}       // U10: live-swap a tagged image (preview only)
 *   {type:"cms:setStyle", path, background} // U10: live-paint a tagged element bg (preview only)
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
      /* Clean, professional edit affordance: soft rounded highlight + thin ring — NO dashed lines. */
      [data-cms]{ outline:none; border-radius:6px; transition:background-color .12s ease, box-shadow .12s ease; cursor:text; }
      [data-cms]:hover{ background-color: rgba(28,195,175,.06); box-shadow:0 0 0 2px rgba(28,195,175,.16); }
      [data-cms]:focus{ outline:none; background-color: rgba(28,195,175,.07); box-shadow:0 0 0 2px rgba(28,195,175,.5); }
      [data-cms-img], [data-cms-link], [data-cms-icon]{ cursor:pointer; }
      [data-cms-icon]{ border-radius:8px; transition:box-shadow .12s ease; }
      [data-cms-icon]:hover{ box-shadow:0 0 0 3px rgba(28,195,175,.55); }
      [data-cms-img]{ position:relative; border-radius:6px; transition:box-shadow .12s ease; }
      [data-cms-img]:hover{ box-shadow:0 0 0 3px rgba(28,195,175,.6); }
      [data-cms-img].cms-sel, [data-cms-link].cms-sel, [data-cms-icon].cms-sel{ box-shadow:0 0 0 3px #1cc3af; }
      [data-cms-link]{ border-radius:8px; transition:box-shadow .12s ease; }
      [data-cms-link]:hover{ box-shadow:0 0 0 3px rgba(28,195,175,.55); }
      /* v3 R3: a tile whose BACKGROUND is editable — click its non-text area to recolor. */
      [data-cms-bg]{ cursor:pointer; transition:box-shadow .12s ease; }
      [data-cms-bg]:hover{ box-shadow:0 0 0 3px rgba(28,195,175,.4); }
      [data-cms-bg].cms-sel{ box-shadow:0 0 0 3px #1cc3af; }
      /* v3 R2: the floating "select this section" handle (move/delete/background). */
      #c3-sec-handle{ position:fixed; z-index:2147483646; display:none; align-items:center; gap:6px;
        background:#1cc3af; color:#042e29; font:700 12px/1 -apple-system,system-ui,sans-serif;
        padding:6px 11px; border-radius:999px; border:none; cursor:pointer; box-shadow:0 6px 18px rgba(0,0,0,.28); }
      #c3-sec-handle:hover{ background:#15b3a0; }
      /* v4 R2: the floating "recolor this tile" handle. A packed tile has almost no
         bare background to click, so the v3 click-empty-pixels path was undiscoverable
         (a click landed a text caret). This EXPLICIT chip appears on hover over any
         recolorable element ([data-cms-bg]) and opens the background picker. */
      #c3-bg-handle{ position:fixed; z-index:2147483646; display:none; align-items:center; gap:6px;
        background:#7c3aed; color:#fff; font:700 12px/1 -apple-system,system-ui,sans-serif;
        padding:6px 11px; border-radius:999px; border:none; cursor:pointer; box-shadow:0 6px 18px rgba(0,0,0,.28); }
      #c3-bg-handle:hover{ background:#6d28d9; }
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
    const shimStyle = document.createElement("style");
    shimStyle.id = "c3-shim-bg";
    document.head.appendChild(shimStyle);
    const applyShimBg = (path: string, background: string) => {
      if (background) shimBg[path] = background; else delete shimBg[path];
      shimStyle.textContent = buildBgCss([], shimBg);
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
    const imgObserver = new MutationObserver(() => { if (Object.keys(shimImg).length) reapplyShimImgs(); });
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

    // ── v3 R2: floating "select this section" handle ──
    // Hovering a section shows a chip; clicking it selects the section so the
    // editor can move / delete / recolor it — contextual, no sidebar.
    const secChip = document.createElement("button");
    secChip.id = "c3-sec-handle";
    secChip.type = "button";
    let secId = "";
    secChip.addEventListener("mousedown", (e) => {
      e.preventDefault(); e.stopPropagation();
      if (secId) { post({ type: "cms:select", kind: "section", path: secId }); log("select-section", { path: secId }); }
    });
    document.body.appendChild(secChip);

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
    log("ready", { regions: els.length });

    const onFocusIn = (e: FocusEvent) => {
      const el = (e.target as HTMLElement)?.closest?.("[data-cms]") as HTMLElement | null;
      if (!el) { return; }
      activeEl = el; positionBar();
      post({ type: "cms:focus", path: pathOf(el) });
      log("focus", { path: pathOf(el) });
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
        post({ type: "cms:select", kind: "icon", path: icon.getAttribute("data-cms-icon") });
        log("select-icon", { path: icon.getAttribute("data-cms-icon") });
        return;
      }
      // OBJECT selection: image → open picker; link → edit label/href
      if (img && !text) {
        e.preventDefault(); e.stopPropagation(); clearSel(); img.classList.add("cms-sel");
        post({ type: "cms:select", kind: "image", path: img.getAttribute("data-cms-img") });
        log("select-image", { path: img.getAttribute("data-cms-img") });
        return;
      }
      if (link && !text) {
        e.preventDefault(); e.stopPropagation(); clearSel(); link.classList.add("cms-sel");
        const lab = (link.querySelector("[data-cms-link-label]") as HTMLElement)?.innerText ?? link.innerText;
        post({ type: "cms:select", kind: "link", path: link.getAttribute("data-cms-link"), label: lab, href: (link as HTMLAnchorElement).getAttribute?.("href") || "" });
        log("select-link", { path: link.getAttribute("data-cms-link") });
        return;
      }
      // v3 R3: BACKGROUND selection — a tile's non-text area. Lowest priority, so
      // clicking its text/image/button/icon still edits those directly.
      const bg = tgt?.closest?.("[data-cms-bg]") as HTMLElement | null;
      if (bg && !text && !img && !link && !icon) {
        e.preventDefault(); e.stopPropagation(); clearSel(); bg.classList.add("cms-sel");
        post({ type: "cms:select", kind: "bg", path: bg.getAttribute("data-cms-bg") });
        log("select-bg", { path: bg.getAttribute("data-cms-bg") });
        return;
      }
      // plain links/buttons (untagged) — block navigation in edit mode
      const a = tgt?.closest?.("a,button");
      if (a && !text) { e.preventDefault(); e.stopPropagation(); log("blocked-nav", { to: (a as HTMLAnchorElement).getAttribute?.("href") || "" }); }
      if (a && text) e.preventDefault();
    };
    const onDocClick = (e: MouseEvent) => { const t = e.target as HTMLElement; if (!t?.closest?.("[data-cms]") && !t?.closest?.("#c3-toolbar") && !t?.closest?.("#c3-fontmenu")) hideBar(); };

    // v3 R2: show the section-select handle over whichever section is hovered.
    const positionSecChip = (sec: HTMLElement) => {
      const r = sec.getBoundingClientRect();
      secChip.style.top = `${Math.max(6, r.top + 8)}px`;
      secChip.style.left = `${Math.max(6, r.left + 8)}px`;
      secChip.style.display = "inline-flex";
    };
    // v4 R2: position the recolor chip at the top-RIGHT of the hovered tile (the
    // section chip owns the top-left), so both are reachable without overlap.
    const positionBgChip = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      bgChip.style.top = `${Math.max(6, r.top + 8)}px`;
      bgChip.style.left = `${Math.max(6, Math.min(window.innerWidth - 108, r.right - 108))}px`;
      bgChip.style.display = "inline-flex";
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      // Keep whichever chip the pointer moved onto (so it can be clicked).
      if (t === secChip || t === bgChip) return;
      const sec = t?.closest?.("[data-section]") as HTMLElement | null;
      if (sec) {
        secId = sec.getAttribute("data-section") || "";
        secChip.innerHTML = `<span aria-hidden="true">▚</span> Edit section`;
        positionSecChip(sec);
      } else { secChip.style.display = "none"; secId = ""; }
      // v4 R2: a recolorable element (tile / card / footer) → show the recolor chip.
      const bgEl = t?.closest?.("[data-cms-bg]") as HTMLElement | null;
      if (bgEl) { bgPath = bgEl.getAttribute("data-cms-bg") || ""; positionBgChip(bgEl); }
      else { bgChip.style.display = "none"; bgPath = ""; }
    };

    document.addEventListener("focusin", onFocusIn, true);
    document.addEventListener("input", onInput, true);
    document.addEventListener("selectionchange", onSelChange);
    document.addEventListener("click", onClick, true);
    document.addEventListener("mousedown", onDocClick, true);
    document.addEventListener("mouseover", onOver, true);
    window.addEventListener("scroll", () => { if (bar.style.display === "flex") positionBar(); secChip.style.display = "none"; bgChip.style.display = "none"; }, true);

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
        applyShimBg(d.path, typeof d.background === "string" ? d.background : "");
      }
    };
    window.addEventListener("message", onMsg);
    post({ type: "cms:ready" });

    return () => {
      document.removeEventListener("focusin", onFocusIn, true);
      document.removeEventListener("input", onInput, true);
      document.removeEventListener("selectionchange", onSelChange);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("mousedown", onDocClick, true);
      document.removeEventListener("mouseover", onOver, true);
      window.removeEventListener("message", onMsg);
      els.forEach((el) => el.removeAttribute("contenteditable"));
      imgObserver.disconnect();
      bar.remove(); fontMenu.remove(); style.remove(); secChip.remove(); bgChip.remove(); shimStyle.remove();
      document.documentElement.removeAttribute("data-cms-edit");
    };
  }, []);

  return null;
}
