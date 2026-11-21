import { getCloudflareContext } from "@opennextjs/cloudflare";

type Env = { TURNSTILE_SITE_KEY?: string; SITE_FORWARD_SECRET?: string } | undefined;
function env(): Env {
  try {
    return getCloudflareContext().env as Env;
  } catch {
    return undefined; // no Cloudflare context (dev, vitest, export)
  }
}

/** The Turnstile site key (public by design), from the Worker's vars or the build env. Empty when none is set. */
export const getTurnstileSiteKey = (): string => env()?.TURNSTILE_SITE_KEY || process.env.TURNSTILE_SITE_KEY || "";

/** The secret the signup route sends to Studio so Studio trusts `x-c3-client-ip`. A Worker secret; never a var. */
export const getForwardSecret = (): string => env()?.SITE_FORWARD_SECRET || process.env.SITE_FORWARD_SECRET || "";
