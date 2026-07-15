/**
 * REAL staff roster — shared source of truth (Phase 3).
 *
 * Verbatim name + title from celebratejesus.org `/our-staff-2` (Elder Staff · Hays
 * Campus Staff · Colby Campus Staff). NO bios exist on the real site — only the role
 * line — so none are invented. Used by the Home StaffGrid (`leadershipStaff`) and the
 * About staff section (`staffGroups`). Never hardcode placeholder names
 * ("Lead Pastor", "Pastor Lance Carter", etc.) — import from here.
 *
 * Headshots: the real site has 14 portraits; until those assets are pulled in, `image`
 * falls back to existing site imagery so a card is never broken (and is CMS-swappable).
 */
export type StaffGroupKey = "elder" | "hays" | "colby";

export interface StaffMember {
  /** Stable slug id (kebab-case of the name). */
  id: string;
  name: string;
  /** Role / title line, exactly as on celebratejesus.org. */
  role: string;
  group: StaffGroupKey;
  /** Optional real headshot; falls back to site imagery when absent. */
  image?: string;
}

export const STAFF_GROUP_LABELS: Record<StaffGroupKey, string> = {
  elder: "Elder Staff",
  hays: "Hays Campus Staff",
  colby: "Colby Campus Staff",
};

/** All 14 real staff, in the real site's display order (Elder → Hays → Colby). */
export const staff: StaffMember[] = [
  // ── Elder Staff ──
  { id: "brant-rice", name: "Brant Rice", role: "Senior Pastor", group: "elder", image: "/images/congregation.webp" },
  { id: "derek-mayfield", name: "Derek Mayfield", role: "Executive Pastor", group: "elder", image: "/images/gather.webp" },
  // ── Hays Campus Staff ──
  { id: "isabella-blansett", name: "Isabella Blansett", role: "Worship Director", group: "hays", image: "/images/worship.webp" },
  { id: "kael-bloom", name: "Kael Bloom", role: "Connections Pastor", group: "hays", image: "/images/exterior.webp" },
  { id: "renee-dreiling", name: "Renee Dreiling", role: "Pastor's Assistant", group: "hays", image: "/images/congregation.webp" },
  { id: "melisha-jones", name: "Melisha Jones", role: "Data Clerk", group: "hays", image: "/images/gather.webp" },
  { id: "jason-jordan", name: "Jason Jordan", role: "Encounter Young Adults Director", group: "hays", image: "/images/worship.webp" },
  { id: "kendall-jordan", name: "Kendall Jordan", role: "Missions Director", group: "hays", image: "/images/exterior.webp" },
  { id: "tessa-mayfield", name: "Tessa Mayfield", role: "Children & Family Assistant", group: "hays", image: "/images/congregation.webp" },
  { id: "delynn-rice", name: "Delynn Rice", role: "Director of Children & Family Ministries", group: "hays", image: "/images/gather.webp" },
  { id: "brian-taliaferro", name: "Brian Taliaferro", role: "Building & Operations Director", group: "hays", image: "/images/exterior.webp" },
  // ── Colby Campus Staff ──
  { id: "kirby-benisch", name: "Kirby Benisch", role: "Campus Pastor", group: "colby", image: "/images/worship.webp" },
  { id: "kelsey-benisch", name: "Kelsey Benisch", role: "Children's Director & Office Manager", group: "colby", image: "/images/congregation.webp" },
  { id: "brooks-wachs", name: "Brooks Wachs", role: "Youth Pastor", group: "colby", image: "/images/gather.webp" },
];

/** Grouped roster (Elder → Hays → Colby) for the About staff section. */
export interface StaffGroup {
  id: StaffGroupKey;
  label: string;
  members: StaffMember[];
}

export const staffGroups: StaffGroup[] = (["elder", "hays", "colby"] as StaffGroupKey[]).map((g) => ({
  id: g,
  label: STAFF_GROUP_LABELS[g],
  members: staff.filter((m) => m.group === g),
}));

/** Leadership subset — Elder pastors + Hays worship/connections leads.
 *  Used by the Home StaffGrid so a "meet the team" block shows REAL leaders. */
export const leadershipStaff: StaffMember[] = [staff[0], staff[1], staff[2], staff[3]];
