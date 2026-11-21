// Shared jsdom harness for EditBridge behavioural tests.
// NOT a *.test.ts file, so vitest's `tests/**/*.test.ts` include never collects it.
//
// EditBridge only activates when it believes it is embedded in the C3 Studio iframe
// (`?cmsEdit=1` in the URL, window.parent !== window, and a Studio origin configured).
// We fake all three, mount the real component with react-dom, and flush its useEffect via act().
//
// The harness also plays the STUDIO side of the v2 canvas contract: `studio.send()` delivers a
// message the way the browser would (event.origin, event.source), so a test can send the same
// message from the right sender and from a wrong one.
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import EditBridge from "@/components/cms/EditBridge";

/** The Studio origin of this fake environment (what NEXT_PUBLIC_CMS_URL points at). */
export const STUDIO = "http://studio.test";

export type Mode = "edit" | "view" | "visitor";

export interface Post { message: any; targetOrigin: string }

export interface EditorHarness {
  /** Every message the bridge posted to its parent (message bodies only). */
  messages: any[];
  /** The same, with the targetOrigin each was posted to. */
  posts: Post[];
  root: Root;
  host: HTMLElement;
  /** The fake parent window (the Studio iframe host). */
  parent: { postMessage: (m: unknown, target?: string) => void };
  /** Play the Studio side. `over` lets a test spoof the sender. */
  send: (type: string, payload?: Record<string, unknown>, over?: SendOverrides) => Promise<void>;
  /** Messages of one type posted so far. */
  of: (type: string) => any[];
  unmount: () => Promise<void>;
}

export interface SendOverrides {
  origin?: string;
  /** "parent" (default), "other" (a different window), or null. */
  from?: "parent" | "other" | null;
  /** Replace the whole data object. */
  data?: unknown;
  v?: unknown;
  source?: unknown;
}

export interface MountOptions {
  /** data-cms-draft on <html>: "served", "fallback", or null for no mark. Default "served". */
  draft?: "served" | "fallback" | null;
  /** Send editor:mode right after ready. Default none (the bridge starts in view). */
  mode?: Mode;
  caps?: Record<string, number>;
  pages?: { title: string; href: string }[];
}

let savedEnv: string | undefined;

export async function mountEditor(bodyHTML: string, opts: MountOptions = {}): Promise<EditorHarness> {
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  const posts: Post[] = [];
  const messages: any[] = [];
  const parent = {
    postMessage: (m: unknown, target?: string) => { messages.push(m); posts.push({ message: m, targetOrigin: String(target) }); },
  };
  Object.defineProperty(window, "parent", { configurable: true, value: parent });
  Object.defineProperty(window, "location", {
    configurable: true,
    value: { ...window.location, search: "?cmsEdit=1", href: "http://localhost/?cmsEdit=1" },
  });
  savedEnv = process.env.NEXT_PUBLIC_CMS_URL;
  process.env.NEXT_PUBLIC_CMS_URL = STUDIO + "/";
  const draft = opts.draft === undefined ? "served" : opts.draft;
  if (draft) document.documentElement.setAttribute("data-cms-draft", draft);
  else document.documentElement.removeAttribute("data-cms-draft");
  // The tagged content must exist BEFORE mount — EditBridge scans [data-cms] on mount.
  document.body.innerHTML = bodyHTML;
  const host = document.createElement("div");
  document.body.appendChild(host);
  let root!: Root;
  await act(async () => { root = createRoot(host); root.render(createElement(EditBridge)); });
  const other = { postMessage: () => {} };

  const send: EditorHarness["send"] = async (type, payload = {}, over = {}) => {
    const data = "data" in over ? over.data : { v: over.v === undefined ? 2 : over.v, source: over.source === undefined ? "c3editor" : over.source, type, ...payload };
    const ev = new Event("message") as any;
    Object.defineProperty(ev, "data", { value: data });
    Object.defineProperty(ev, "origin", { value: over.origin ?? STUDIO });
    Object.defineProperty(ev, "source", { value: over.from === null ? null : over.from === "other" ? other : parent });
    await act(async () => { window.dispatchEvent(ev); });
  };

  const h: EditorHarness = {
    messages, posts, root, host, parent, send,
    of: (type) => messages.filter((m) => m && m.type === type),
    unmount: async () => {
      await act(async () => { root.unmount(); });
      if (savedEnv === undefined) delete process.env.NEXT_PUBLIC_CMS_URL; else process.env.NEXT_PUBLIC_CMS_URL = savedEnv;
      document.documentElement.removeAttribute("data-cms-draft");
    },
  };
  if (opts.mode) await send("editor:mode", { mode: opts.mode, ...(opts.caps ? { caps: opts.caps } : {}), ...(opts.pages ? { pages: opts.pages } : {}) });
  return h;
}

/** Let a queued MutationObserver / microtask / debounce settle. */
export async function flush(ms = 0): Promise<void> {
  await act(async () => { await new Promise((r) => setTimeout(r, ms)); });
}

/** The editor's injected stylesheet (the one carrying the hover ring rules). */
export function editorStylesheet(): HTMLStyleElement | undefined {
  return Array.from(document.head.querySelectorAll("style")).find((s) =>
    (s.textContent || "").includes("repeating-linear-gradient") && (s.textContent || "").includes("c3-sel-ring"),
  );
}

/** Pin a jsdom element's measured box (jsdom lays nothing out). */
export function stubRect(el: Element, box: { left: number; top: number; width: number; height: number }) {
  const { left, top, width, height } = box;
  el.getBoundingClientRect = () =>
    ({ left, top, width, height, right: left + width, bottom: top + height, x: left, y: top, toJSON: () => ({}) }) as DOMRect;
}

/** Put the caret / a selection inside `el` between character offsets (text content). */
export function selectText(el: HTMLElement, start: number, end = start) {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let pos = 0, s: [Node, number] | null = null, e: [Node, number] | null = null, n: Node | null;
  while ((n = walker.nextNode())) {
    const len = (n.nodeValue || "").length;
    if (!s && start <= pos + len) s = [n, start - pos];
    if (!e && end <= pos + len) { e = [n, end - pos]; break; }
    pos += len;
  }
  const r = document.createRange();
  if (!s) { r.selectNodeContents(el); r.collapse(false); } else { r.setStart(s[0], s[1]); if (e) r.setEnd(e[0], e[1]); else r.setEnd(s[0], s[1]); }
  const sel = window.getSelection()!;
  sel.removeAllRanges(); sel.addRange(r);
}

/** Simulate the user typing `text` at the current caret of `el`: mutate, then fire input. */
export async function typeInto(el: HTMLElement, text: string) {
  const sel = window.getSelection()!;
  if (!sel.rangeCount || !el.contains(sel.anchorNode)) selectText(el, (el.textContent || "").length);
  const r = sel.getRangeAt(0);
  r.deleteContents();
  const t = document.createTextNode(text);
  r.insertNode(t);
  r.setStartAfter(t); r.collapse(true);
  sel.removeAllRanges(); sel.addRange(r);
  await act(async () => { el.dispatchEvent(new Event("input", { bubbles: true })); });
}

/** A paste carrying text/plain (and optionally text/html), cancelable like the real one. */
export async function pasteInto(el: HTMLElement, text: string, html?: string): Promise<boolean> {
  const ev = new Event("paste", { bubbles: true, cancelable: true }) as any;
  ev.clipboardData = { getData: (t: string) => (t === "text/plain" ? text : t === "text/html" ? (html ?? "") : "") };
  let prevented = false;
  await act(async () => { prevented = !el.dispatchEvent(ev); });
  return prevented;
}

export async function key(el: Element, k: string, mods: Partial<KeyboardEventInit> = {}) {
  await act(async () => { el.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true, ...mods })); });
}
