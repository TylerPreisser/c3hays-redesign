/**
 * Security headers for the live (CMS_LIVE) Worker. Plain module, no imports, so next.config.ts can load it.
 *
 * Studio's editor frames this site as its canvas, so `frame-ancestors` names Studio's origin of the SAME environment
 * (staging frames staging, production frames production), and nothing else. The edit bridge injects <style> elements,
 * so `style-src` keeps 'unsafe-inline'. Next's own hydration scripts are inline, so `script-src` does too; the
 * hardening that matters here is the closed origin lists, `frame-ancestors`, `object-src 'none'` and `base-uri`.
 *
 * Origins are chosen at BUILD time: set STUDIO_ORIGIN for the environment being built (`cf:build`), as
 * NEXT_PUBLIC_CMS_URL already is. Unset, a production-shaped build frames production Studio only.
 */
export const STUDIO_ORIGINS = {
  production: "https://c3-studio.tylerpreisser.workers.dev",
  staging: "https://c3-studio-staging.preissersolutions.com",
} as const;

export function studioOrigin(env: Record<string, string | undefined> = process.env): string {
  const v = (env.STUDIO_ORIGIN || "").trim().replace(/\/$/, "");
  if (v) {
    const u = new URL(v); // throws on junk: a bad origin must fail the build, not weaken the policy
    return u.origin;
  }
  return STUDIO_ORIGINS.production;
}

export function contentSecurityPolicy(opts: { studio: string; dev?: boolean }): string {
  const turnstile = "https://challenges.cloudflare.com";
  const ancestors = [opts.studio, ...(opts.dev ? ["http://localhost:4600"] : [])];
  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    "script-src": ["'self'", "'unsafe-inline'", turnstile, ...(opts.dev ? ["'unsafe-eval'"] : [])],
    "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    "font-src": ["'self'", "data:", "https://fonts.gstatic.com"],
    "img-src": ["'self'", "data:", "blob:", "https:"],
    "media-src": ["'self'", "blob:", "https:"],
    // https://app.espace.cool: the Events page's browser code reads the church's eSpace calendar from it (src/lib/espace.ts, GetFullCalendarEvents). That one origin, for fetch only: nothing from eSpace is framed or loaded as script.
    "connect-src": ["'self'", turnstile, "https://app.espace.cool", ...(opts.dev ? ["ws://localhost:*", "http://localhost:*"] : [])],
    "frame-src": [turnstile, "https://www.youtube.com", "https://www.youtube-nocookie.com", "https://www.google.com", "https://maps.google.com"],
    "frame-ancestors": ancestors,
    "form-action": ["'self'"],
    "base-uri": ["'self'"],
    "object-src": ["'none'"],
  };
  return Object.entries(directives).map(([k, v]) => `${k} ${v.join(" ")}`).join("; ");
}

export function securityHeaders(opts: { studio: string; dev?: boolean; noindex?: boolean; build?: string }): { key: string; value: string }[] {
  return [
    { key: "Content-Security-Policy", value: contentSecurityPolicy(opts) },
    // A ?preview= token must never leave in a Referer.
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
    // Staging only (SITE_NOINDEX=1 at build): search engines stay out. Production never sets it.
    ...(opts.noindex ? [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] : []),
    // Staging only: names the build the live address serves, so a deploy can be verified (SITE_BUILD_ID at build).
    ...(opts.build ? [{ key: "X-C3-Build", value: opts.build }] : []),
  ];
}
