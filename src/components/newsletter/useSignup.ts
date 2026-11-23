"use client";

import { useCallback, useState } from "react";

/** What the form says. Until Studio sends C3 News or the church's mailing-list key exists, the address is only recorded. */
export const SIGNUP_NOTE = "Leave your email and the church office will add you to C3 News.";
export const SIGNUP_DONE = "Thanks. The church office will add you to C3 News.";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export type SignupStatus = "idle" | "sending" | "done" | "invalid" | "captcha" | "limited" | "failed";

export const SIGNUP_ERRORS: Partial<Record<SignupStatus, string>> = {
  invalid: "Please enter a valid email address.",
  captcha: "Please complete the check, then send again.",
  limited: "Too many tries from here. Please wait a minute and try again.",
  failed: "We could not record that just now. Please try again in a little while.",
};

/** Posts to the site's own route. No Turnstile token, no request: the server would refuse it anyway. */
export function useSignup() {
  const [status, setStatus] = useState<SignupStatus>("idle");
  const [resetKey, setResetKey] = useState(0);

  const submit = useCallback(async (email: string, token: string | null, honeypot = "") => {
    if (!EMAIL_RE.test(email.trim())) return setStatus("invalid");
    if (!token) return setStatus("captcha");
    setStatus("sending");
    try {
      const res = await fetch("/api/newsletter/subscribe/", { // trailing slash: the site redirects the bare path (trailingSlash)
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: email.trim(), turnstile_token: token, company: honeypot }),
      });
      if (res.ok) return setStatus("done");
      setResetKey((k) => k + 1); // a Turnstile token is single use
      setStatus(res.status === 429 ? "limited" : res.status === 400 ? ((await res.json().catch(() => ({}))).code === "invalid_email" ? "invalid" : "captcha") : "failed");
    } catch {
      setResetKey((k) => k + 1);
      setStatus("failed");
    }
  }, []);

  return { status, setStatus, submit, resetKey };
}
