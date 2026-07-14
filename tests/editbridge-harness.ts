// Shared jsdom harness for EditBridge behavioural tests (v7 Batch-A).
// NOT a *.test.ts file, so vitest's `tests/**/*.test.ts` include never collects it.
//
// EditBridge only activates when it believes it is embedded in the C3 Studio iframe
// (`?cmsEdit=1` in the URL AND window.parent !== window). We fake both, mount the real
// component with react-dom, and flush its useEffect via act() so the live DOM logic runs.
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import EditBridge from "@/components/cms/EditBridge";

export interface EditorHarness {
  messages: any[];
  root: Root;
  host: HTMLElement;
  unmount: () => Promise<void>;
}

export async function mountEditor(bodyHTML: string): Promise<EditorHarness> {
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  const messages: any[] = [];
  Object.defineProperty(window, "parent", {
    configurable: true,
    value: { postMessage: (m: unknown) => messages.push(m) },
  });
  Object.defineProperty(window, "location", {
    configurable: true,
    value: { ...window.location, search: "?cmsEdit=1", href: "http://localhost/?cmsEdit=1" },
  });
  // The tagged content must exist BEFORE mount — EditBridge scans [data-cms] on mount.
  document.body.innerHTML = bodyHTML;
  const host = document.createElement("div");
  document.body.appendChild(host);
  let root!: Root;
  await act(async () => { root = createRoot(host); root.render(createElement(EditBridge)); });
  const unmount = async () => { await act(async () => { root.unmount(); }); };
  return { messages, root, host, unmount };
}

/** Let a queued MutationObserver / microtask settle. */
export async function flush(): Promise<void> {
  await act(async () => { await new Promise((r) => setTimeout(r, 0)); });
}

/** The editor's injected marching-ants stylesheet (the one carrying @keyframes c3ants). */
export function editorStylesheet(): HTMLStyleElement | undefined {
  return Array.from(document.head.querySelectorAll("style")).find((s) =>
    (s.textContent || "").includes("c3ants"),
  );
}
