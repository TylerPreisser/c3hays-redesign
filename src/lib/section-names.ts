/**
 * The plain name of every section the site draws, in the church's words. ONE map: the section strip in Studio's editor
 * reads these from the page (`data-section-name`), so no screen shows a code word. An id with no entry falls back to a
 * readable form of the id itself.
 */
export const SECTION_NAMES: Record<string, string> = {
  // Home
  hero: "Top of the page",
  mission: "Our mission",
  meetGrowServe: "Meet, grow, serve",
  nt26: "Bible reading",
  locations: "Our churches",
  stayConnected: "Ways to connect",
  give: "Giving",
  promo: "Announcement",
  // Pages
  "about-hero": "Top of the page",
  "about-values": "Our values",
  "about-believe": "What we believe",
  "visit-hero": "Top of the page",
  "visit-plan": "Your first visit",
  "locations-hero": "Top of the page",
  "locations-campuses": "Our campuses",
  "messages-hero": "Top of the page",
  "messages-archive": "All messages",
  "watch-hero": "Top of the page",
  "watch-channels": "Where to watch",
  "watch-ondemand": "Past services",
  "events-hero": "Top of the page",
  "events-upcoming": "Upcoming events",
  "events-calendar": "Church calendar",
  "connect-hero": "Top of the page",
  "connect-steps": "Next steps",
  "counseling-hero": "Top of the page",
  "counseling-team": "Our counselors",
  "counseling-fees": "Cost",
  "give-hero": "Top of the page",
  "give-ways": "Ways to give",
  "weekly-hero": "Top of the page",
  "weekly-list": "Past issues",
  "hays-hero": "Top of the page",
  "hays-details": "Times, address and directions",
  "hays-team": "Meet the team",
  "colby-hero": "Top of the page",
  "colby-details": "Times, address and directions",
  "colby-team": "Meet the team",
  "colby-visit": "Plan a visit",
  // Sections a person can add
  serviceTimes: "Service times",
  sermonFeature: "Message spotlight",
  eventsStrip: "Upcoming events",
  ministriesGrid: "Ministries",
  staffGrid: "Meet the team",
  testimonial: "A story",
  faq: "Questions",
  statsBand: "Numbers",
  nextSteps: "Next steps",
  scriptureVerse: "Scripture",
  weeklySignup: "Newsletter signup",
  editorialRows: "Feature rows",
  resourceGrid: "Resources",
  sermonPlayer: "Message player",
  watchHub: "Watch and listen",
  seriesArchive: "Message series",
  mediaCarousel: "Message carousel",
  campusMap: "Campus map",
  stickySplit: "Feature with points",
};

export function sectionName(id: string): string {
  const known = SECTION_NAMES[id];
  if (known) return known;
  const words = id.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[-_]+/g, " ").trim().toLowerCase();
  return words ? words[0].toUpperCase() + words.slice(1) : "Section";
}
