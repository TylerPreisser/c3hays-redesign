"use client";

export default function NewsletterForm() {
  return (
    <form
      className="flex w-full max-w-sm gap-0"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="your@email.com"
        className="flex-1 min-w-0 px-4 py-3 text-sm bg-white/8 border border-white/15 text-white placeholder:text-white/35 outline-none focus:border-white/40 transition-colors duration-150"
        style={{ fontSize: "max(1rem, 16px)", borderRadius: 0 }}
        aria-label="Email address"
      />
      <button
        type="submit"
        className="btn btn-primary btn-sm shrink-0"
        style={{ borderRadius: 0, whiteSpace: "nowrap" }}
      >
        Subscribe
      </button>
    </form>
  );
}
