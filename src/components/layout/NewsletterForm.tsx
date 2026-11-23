"use client";

import { useState } from "react";
import TurnstileWidget from "@/components/newsletter/TurnstileWidget";
import { SIGNUP_DONE, SIGNUP_ERRORS, SIGNUP_NOTE, useSignup } from "@/components/newsletter/useSignup";
import { useSignupConfig } from "@/providers/SignupConfigProvider";

export default function NewsletterForm() {
  const { turnstileSiteKey } = useSignupConfig();
  const { status, setStatus, submit, resetKey } = useSignup();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [trap, setTrap] = useState("");
  const small = { color: "rgba(255,255,255,0.55)", fontSize: "0.75rem", lineHeight: 1.5, margin: 0 } as const;

  if (status === "done") {
    return <p role="status" style={{ ...small, color: "rgba(255,255,255,0.85)", fontSize: "0.85rem" }}>{SIGNUP_DONE}</p>;
  }
  return (
    /* v6 R3: stack full-width (input over button) so the placeholder never clips
       in the footer's narrow link column at ANY viewport. min-w-0 keeps it from
       overflowing the grid track. */
    <form
      className="flex flex-col gap-2.5 w-full min-w-0"
      method="post"
      action="/api/newsletter/subscribe"
      onSubmit={(e) => {
        e.preventDefault();
        void submit(email, token, trap);
      }}
    >
      <input
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="your@email.com"
        className="newsletter-input w-full min-w-0"
        name="email"
        required
        aria-label="Email address"
        aria-invalid={status === "invalid"}
        value={email}
        onChange={(e) => { setEmail(e.target.value); if (status !== "idle" && status !== "sending") setStatus("idle"); }}
      />
      {/* Honeypot: off screen and out of the tab order; a person never fills it. */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" value={trap} onChange={(e) => setTrap(e.target.value)} style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />
      {turnstileSiteKey && <TurnstileWidget siteKey={turnstileSiteKey} onToken={setToken} resetKey={resetKey} attention={status === "captcha"} theme="dark" />}
      <button type="submit" className="btn btn-primary w-full" disabled={status === "sending" || !turnstileSiteKey}>
        {status === "sending" ? "Sending…" : "Subscribe"}
      </button>
      {SIGNUP_ERRORS[status] && <p role="alert" style={{ ...small, color: "#ffd7d0" }}>{SIGNUP_ERRORS[status]}</p>}
      <p style={small}>{turnstileSiteKey ? SIGNUP_NOTE : "Sign-up here is not switched on yet. Call the office at (785) 625-5483 and we will add you."}</p>
    </form>
  );
}
