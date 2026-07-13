"use client";

export default function NewsletterForm() {
  return (
    /* Inline from sm up (input grows, button hugs) so the footer column doesn't
       tower vertically; stacks only on the narrowest phones. min-w-0 keeps it
       from overflowing the column. */
    <form
      className="flex flex-col sm:flex-row gap-2.5 w-full"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="your@email.com"
        className="newsletter-input min-w-0 flex-1"
        aria-label="Email address"
      />
      <button type="submit" className="btn btn-primary shrink-0 px-5">
        Subscribe
      </button>
    </form>
  );
}
