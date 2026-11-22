#!/usr/bin/env node
// A local stand-in for Studio's public content bundle, so the site can be developed and checked with no Studio running.
//   node scripts/fake-studio.mjs [port]      default 4413; point the site at it with NEXT_PUBLIC_CMS_URL=http://127.0.0.1:4413
// Shapes follow Studio's public routes (GET /api/content/<resource>, GET /api/content/draft?path=). Sample words only.
// The draft route accepts the token ONLY in the `x-c3-preview` header and answers 401 otherwise; GET /__log lists what
// was asked (url + whether a token came in the header or the query) so a check can prove the token never rides a URL.
import http from "node:http";

const PORT = Number(process.argv[2] || process.env.PORT || 4413);
export const GOOD_TOKEN = "good-token";
const T = "2026-11-01T00:00:00.000Z";
const iso = (d) => new Date(Date.now() + d * 86400000).toISOString().slice(0, 10);

const nav = (id, label, href, children) => ({ id, label, href, ...(children ? { children } : {}) });
const MENU = [
  nav("m_start", "Start Here", "/visit/"),
  nav("m_about", "Who We Are", "/about/", [nav("m_story", "Our Story", "/about/#who-we-are")]),
  nav("m_msg", "Messages", "/messages/"),
  nav("m_watch", "Watch", "/watch/"),
  nav("m_connect", "Get Connected", "/connect/"),
];
const DRAFT_MENU = [nav("m_draft", "Draft Link", "/visit/"), ...MENU.slice(1)];

const pillar = (id, word, headline, body, href) => ({ id, word, headline, body, image: "/images/congregation.webp", href });
const homePub = {
  hero: { heading: "Published headline from Studio", ctaLabel: "Plan a Visit", ctaHref: "/visit/" },
  meetGrowServe: {
    heading: "Meet. Grow. Serve.",
    pillars: [
      pillar("about", "About", "Published about pillar", "About body.", "/about/"),
      pillar("messages", "Messages", "Published messages pillar", "Messages body.", "/messages/"),
      pillar("connect", "Connect", "Published connect pillar", "Connect body.", "/connect/"),
    ],
  },
};
const homeDraft = {
  ...homePub,
  hero: { ...homePub.hero, heading: "Draft headline from Studio" },
  // reordered: connect first
  meetGrowServe: { heading: "Meet. Grow. Serve.", pillars: [homePub.meetGrowServe.pillars[2], homePub.meetGrowServe.pillars[0], homePub.meetGrowServe.pillars[1]] },
};

const sermons = [
  { id: "srm_1", title: "Sample Message One", speaker: "Sample Speaker", date: "2026-11-15", description: "A sample message for local checks.", youtube_video_id: "M7lc1UVf-VE", thumbnail_url: null, scripture_references: ["John 1:1-5"], duration: 1800, created_at: T, updated_at: T },
  { id: "srm_2", title: "Sample Message Two", speaker: "Sample Speaker", date: "2026-11-08", description: null, youtube_video_id: "M7lc1UVf-VE", thumbnail_url: null, scripture_references: [], duration: null, created_at: T, updated_at: T },
];
const locations = [
  { id: "hays", name: "Hays", services: [{ day: "Sunday", times: ["8:00 AM", "9:00 AM", "10:45 AM"] }] },
  { id: "colby", name: "Colby", services: [{ day: "Sunday", times: ["10:00 AM"] }] },
];
const announcements = [
  { id: "ann_now", title: "Fall Serve Day", body: "Join us Saturday to serve around Hays.", link_label: "Sign up", link_url: "/connect/", surface: "web", starts_at: iso(-1), ends_at: iso(3), priority: 5, active: true },
  { id: "ann_app", title: "App is live", body: "Download the C3 app.", link_label: "Get the app", link_url: "https://example.org/app", surface: "web", starts_at: null, ends_at: null, priority: 2, active: true, created_at: "2026-07-24T00:00:00.000Z" },
  { id: "ann_old", title: "Past announcement", body: "Should not show.", surface: "web", starts_at: iso(-30), ends_at: iso(-20), priority: 1, active: true },
  { id: "ann_future", title: "Future announcement", body: "Should not show yet.", surface: "web", starts_at: iso(10), ends_at: iso(20), priority: 1, active: true },
];
const campaigns = [
  { id: "cmp_1", title: "Building Fund", blurb: "Sample campaign.", goal_amount: 100000, currency: "USD", give_url: "https://example.org/give", raised_amount: 40000 },
];
const issues = [];
// FAKE_EVENTS_MODE=studio: the events page reads Studio's events too (sample words only)
const sev = (id, title, dayOffset, hourUtc, extra = {}) => ({ id, title, description: extra.description ?? "", location: extra.location ?? "C3 Hays", address: null, start_date: `${iso(dayOffset)}T${String(hourUtc).padStart(2, "0")}:30:00.000Z`, end_date: null, all_day: !!extra.allDay, registration_enabled: true, image_url: null, category: "general", status: "scheduled", created_at: T, updated_at: T });
const studioEvents = [sev("evt_s1", "Studio Marriage Night", 2, 0, { description: "A night for couples." }), sev("evt_s2", "Baptism Sunday", 5, 16), sev("evt_s3", "Community Meal", 8, 0, { location: "C3 Colby" })];

const log = [];
const server = http.createServer((req, res) => {
  const u = new URL(req.url || "/", "http://x");
  const send = (body, status = 200) => { res.writeHead(status, { "content-type": "application/json" }); res.end(JSON.stringify(body)); };
  if (u.pathname === "/__log") return send(log);
  if (u.pathname === "/__reset") { log.length = 0; return send({ ok: true }); }
  log.push({ path: u.pathname, search: u.search, header: req.headers["x-c3-preview"] || null });
  const p = u.pathname;
  if (p === "/api/content/draft") {
    if (req.headers["x-c3-preview"] !== GOOD_TOKEN) return send({ error: "Invalid or missing preview token" }, 401);
    const path = u.searchParams.get("path") || "home";
    if (path === "home") return send(homeDraft);
    if (path === "globals") return send({ text: { "footer-tagline": "Draft footer words" } });
    if (path === "navigation") return send({ web: DRAFT_MENU, app: [] });
    if (path.startsWith("/")) return send({});
    return send({ error: "Unknown draft path" }, 404);
  }
  if (p === "/api/content/home") return send(homePub);
  if (p === "/api/content/globals") return send({ text: { "footer-tagline": "Published footer words" } });
  if (p === "/api/content/navigation") return send(MENU);
  if (p === "/api/content/site") return send({ ...(process.env.FAKE_EVENTS_MODE === "studio" ? { events_on_website: "studio" } : {}), giving: { hays: "https://example.org/give/hays-old" }, give_config: { campuses: { hays: { give_url: "https://example.org/give/hays" }, colby: { give_url: "https://example.org/give/colby" } } } });
  if (p === "/api/content/sermons") return send(sermons);
  if (p === "/api/content/locations") return send(locations);
  if (p === "/api/content/announcements") return send(announcements.filter((a) => a.active));
  if (p === "/api/content/giving_campaigns") return send(campaigns);
  if (p === "/api/content/newsletter_issues") return send(issues);
  if (p === "/api/content/events") return send(process.env.FAKE_EVENTS_MODE === "studio" ? studioEvents : []);
  if (p.startsWith("/api/content/page/")) return send({});
  if (p === "/api/content") return send({ site: {}, navigation: { web: MENU, app: [] }, screens: [], sermons, events: [], locations, announcements });
  send({ error: "not found" }, 404);
});
server.listen(PORT, () => console.log(`fake studio on ${PORT}`));
