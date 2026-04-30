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
        className="w-full px-4 py-3 text-sm bg-white/8 border border-white/15 text-white placeholder:text-white/35 outline-none focus:border-white/40 transition-colors duration-150"
        style={{
          fontSize: "max(1rem, 16px)",
          borderRadius: 0,
          backgroundColor: "rgba(255,255,255,0.07)",
          borderColor: "rgba(255,255,255,0.14)",
        }}
        aria-label="Email address"
      />
      <button
        type="submit"
        className="btn btn-primary w-full"
        style={{ borderRadius: 0 }}
      >
        Subscribe
      </button>
    </form>
  );
}
