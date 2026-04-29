"use client";

export default function NewsletterForm() {
  return (
    <form
      className="flex flex-col sm:flex-row gap-3"
      onSubmit={(e) => e.preventDefault()}
    >
      {/* inputMode="email" opens the email keyboard on iOS/Android.
          font-size must be ≥16px (set via input-c3 class) to prevent iOS Safari
          from auto-zooming the page when the input is focused. */}
      <input
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="you@example.com"
        className="input-c3 sm:flex-1"
        aria-label="Email address"
      />
      <button type="submit" className="btn btn-gold shrink-0">
        Subscribe
      </button>
    </form>
  );
}
