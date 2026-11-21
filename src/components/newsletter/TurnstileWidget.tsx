"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, o: Record<string, unknown>) => string;
      reset: (id?: string) => void;
      remove: (id?: string) => void;
    };
  }
}
const SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

function load(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.turnstile) return resolve();
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SRC}"]`);
    const s = existing ?? Object.assign(document.createElement("script"), { src: SRC, async: true });
    s.addEventListener("load", () => resolve(), { once: true });
    s.addEventListener("error", () => reject(new Error("turnstile")), { once: true });
    if (!existing) document.head.appendChild(s);
  });
}

/** Cloudflare Turnstile. `onToken(null)` when the token expires or the widget errors; `resetKey` re-arms it after a submit. */
export default function TurnstileWidget({ siteKey, onToken, resetKey = 0, theme = "auto" }: { siteKey: string; onToken: (t: string | null) => void; resetKey?: number; theme?: "auto" | "light" | "dark" }) {
  const box = useRef<HTMLDivElement>(null);
  const id = useRef<string | undefined>(undefined);
  const cb = useRef(onToken);
  cb.current = onToken;

  useEffect(() => {
    let dead = false;
    load()
      .then(() => {
        if (dead || !box.current || !window.turnstile) return;
        id.current = window.turnstile.render(box.current, {
          sitekey: siteKey,
          theme,
          callback: (t: string) => cb.current(t),
          "expired-callback": () => cb.current(null),
          "error-callback": () => cb.current(null),
        });
      })
      .catch(() => cb.current(null));
    return () => {
      dead = true;
      if (id.current) window.turnstile?.remove(id.current);
    };
  }, [siteKey, theme]);

  useEffect(() => {
    if (resetKey > 0 && id.current) window.turnstile?.reset(id.current);
  }, [resetKey]);

  return <div ref={box} data-turnstile style={{ minHeight: 65 }} />;
}
