"use client";

import { createContext, useContext } from "react";

/** The Turnstile site key, read on the server per request and handed to the signup forms. Empty: no widget, no signup. */
const Ctx = createContext<{ turnstileSiteKey: string }>({ turnstileSiteKey: "" });
export function SignupConfigProvider({ turnstileSiteKey, children }: { turnstileSiteKey: string; children: React.ReactNode }) {
  return <Ctx.Provider value={{ turnstileSiteKey }}>{children}</Ctx.Provider>;
}
export const useSignupConfig = () => useContext(Ctx);
