// OpenNext → Cloudflare Workers adapter config for the c3hays site (U6).
//
// Mirrors FarmBooks-web's proven stack: a bare defineCloudflareConfig({}) is all
// the c3hays CMS_LIVE Worker needs — no incremental cache, no queue, no tag cache.
// The site is server-rendered per request (output: undefined) and reads LIVE
// content from the C3 Studio editor API over the network on each request; there's
// no ISR/data-cache layer to wire here. Add caches later only if we introduce ISR.
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({});
