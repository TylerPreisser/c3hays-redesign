"use client";

export default function NewsletterForm() {
  return (
    /* v6 R3: stack full-width (input over button) so the placeholder never clips
       in the footer's narrow link column at ANY viewport. min-w-0 keeps it from
       overflowing the grid track. */
    <form
      className="flex flex-col gap-2.5 w-full min-w-0"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="your@email.com"
        className="newsletter-input w-full min-w-0"
        aria-label="Email address"
      />
      <button type="submit" className="btn btn-primary w-full">
        Subscribe
      </button>
    </form>
  );
}
