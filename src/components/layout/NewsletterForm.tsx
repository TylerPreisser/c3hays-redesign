"use client";

export default function NewsletterForm() {
  return (
    /* Stacked layout — input then button, both full width of column.
       Never side-by-side to prevent overflow on narrow columns. */
    <form
      className="flex flex-col gap-3 w-full"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="your@email.com"
        className="newsletter-input"
        aria-label="Email address"
      />
      <button type="submit" className="btn btn-primary w-full">
        Subscribe
      </button>
    </form>
  );
}
