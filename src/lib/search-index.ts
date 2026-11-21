import type { StudioSermon } from "@/lib/sermons";
import { dateLabel } from "@/lib/sermons";

export interface SearchEntry { title: string; href: string; kind: "Page" | "Message"; text: string }

/** The site's own pages. Words here are the words a visitor would type; they are navigation, not church content. */
export const PAGE_ENTRIES: SearchEntry[] = [
  { title: "Plan a Visit", href: "/visit/", kind: "Page", text: "first time visit what to expect kids parking service times sunday" },
  { title: "About", href: "/about/", kind: "Page", text: "who we are what we believe beliefs staff leadership team mission" },
  { title: "Locations", href: "/locations/", kind: "Page", text: "campuses address directions map hays colby service times" },
  { title: "Hays campus", href: "/locations/hays/", kind: "Page", text: "hays kansas address service times directions" },
  { title: "Colby campus", href: "/locations/colby/", kind: "Page", text: "colby kansas address service times directions" },
  { title: "Messages", href: "/messages/", kind: "Page", text: "sermons watch listen archive series video" },
  { title: "Watch", href: "/watch/", kind: "Page", text: "live stream online church facebook youtube" },
  { title: "C3 Weekly", href: "/news/", kind: "Page", text: "newsletter weekly news updates sign up email" },
  { title: "Events", href: "/events/", kind: "Page", text: "calendar upcoming events happening" },
  { title: "Counseling", href: "/counseling/", kind: "Page", text: "counselors care help support appointment" },
  { title: "Connect", href: "/connect/", kind: "Page", text: "life groups serve volunteer next steps contact" },
  { title: "Give", href: "/give/", kind: "Page", text: "giving tithe donate offering online campaign" },
];

/** Studio's sermons become searchable entries; the page entries are always there, so search works with Studio down. */
export function buildIndex(sermons: StudioSermon[] | null): SearchEntry[] {
  const msgs: SearchEntry[] = (sermons ?? []).map((s) => ({
    title: s.title,
    href: `/messages/${encodeURIComponent(s.id)}/`,
    kind: "Message",
    text: [s.speaker, dateLabel(s.date), ...(s.scripture_references ?? []), s.description].filter(Boolean).join(" "),
  }));
  return [...PAGE_ENTRIES, ...msgs];
}

const norm = (v: string) => v.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "");

/** Every word of the query must appear; a title hit ranks above a body hit. Empty query = no results. */
export function searchEntries(index: SearchEntry[], query: string): SearchEntry[] {
  const words = norm(query).split(/[^a-z0-9']+/).filter(Boolean);
  if (words.length === 0) return [];
  const scored: { e: SearchEntry; score: number; i: number }[] = [];
  index.forEach((e, i) => {
    const title = norm(e.title);
    const hay = `${title} ${norm(e.text)}`;
    if (!words.every((w) => hay.includes(w))) return;
    scored.push({ e, score: words.reduce((n, w) => n + (title.includes(w) ? 2 : 1), 0), i });
  });
  return scored.sort((a, b) => b.score - a.score || a.i - b.i).map((s) => s.e);
}
