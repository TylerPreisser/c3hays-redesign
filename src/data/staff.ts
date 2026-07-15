export interface StaffMember {
  id: string;
  name: string;
  role: string;
}

export interface StaffGroup {
  id: string;
  label: string;
  members: StaffMember[];
}

/**
 * Real leadership roster from celebratejesus.org /our-staff-2 (captured 2026-07-15).
 * Names + titles ONLY — the real site carries no long bios, so none are invented.
 * Grouped exactly as the live site: Elder Staff → Hays Campus Staff → Colby Campus Staff.
 */
export const staffGroups: StaffGroup[] = [
  {
    id: "elder",
    label: "Elder Staff",
    members: [
      { id: "brant-rice", name: "Brant Rice", role: "Senior Pastor" },
      { id: "derek-mayfield", name: "Derek Mayfield", role: "Executive Pastor" },
    ],
  },
  {
    id: "hays",
    label: "Hays Campus Staff",
    members: [
      { id: "isabella-blansett", name: "Isabella Blansett", role: "Worship Director" },
      { id: "kael-bloom", name: "Kael Bloom", role: "Connections Pastor" },
      { id: "renee-dreiling", name: "Renee Dreiling", role: "Pastor's Assistant" },
      { id: "melisha-jones", name: "Melisha Jones", role: "Data Clerk" },
      { id: "jason-jordan", name: "Jason Jordan", role: "Encounter Young Adults Director" },
      { id: "kendall-jordan", name: "Kendall Jordan", role: "Missions Director" },
      { id: "tessa-mayfield", name: "Tessa Mayfield", role: "Children & Family Assistant" },
      { id: "delynn-rice", name: "Delynn Rice", role: "Director of Children & Family Ministries" },
      { id: "brian-taliaferro", name: "Brian Taliaferro", role: "Building & Operations Director" },
    ],
  },
  {
    id: "colby",
    label: "Colby Campus Staff",
    members: [
      { id: "kirby-benisch", name: "Kirby Benisch", role: "Campus Pastor" },
      { id: "kelsey-benisch", name: "Kelsey Benisch", role: "Children's Director & Office Manager" },
      { id: "brooks-wachs", name: "Brooks Wachs", role: "Youth Pastor" },
    ],
  },
];

/** Flat roster (all 14 members, in site order) for convenience/tests. */
export const staff: StaffMember[] = staffGroups.flatMap((g) => g.members);
