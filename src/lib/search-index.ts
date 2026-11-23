import type { StudioSermon } from "@/lib/sermons";
import { dateLabel } from "@/lib/sermons";
import { campus, kidsTimes, type ServiceTimesData } from "@/lib/service-times-core";
import { site } from "@/data/site";

export interface SearchEntry { title: string; href: string; kind: "Page" | "Message"; text: string; /** One plain sentence shown under the result. */ excerpt?: string }

/** The site's own pages. Words here are the words a visitor would type; they are navigation, not church content. */
export const PAGE_ENTRIES: SearchEntry[] = [
  { title: "Plan a Visit", href: "/visit/", kind: "Page", text: "first time visit what to expect kids parking service times sunday" },
  { title: "About", href: "/about/", kind: "Page", text: "who we are what we believe beliefs staff leadership team mission" },
  { title: "Locations", href: "/locations/", kind: "Page", text: "campuses address directions map hays colby service times" },
  { title: "Hays campus", href: "/locations/hays/", kind: "Page", text: "hays kansas address service times directions" },
  { title: "Colby campus", href: "/locations/colby/", kind: "Page", text: "colby kansas address service times directions" },
  { title: "Messages", href: "/messages/", kind: "Page", text: "sermons watch listen archive series video" },
  { title: "Watch", href: "/watch/", kind: "Page", text: "live stream online church facebook youtube" },
  { title: "C3 News", href: "/news/", kind: "Page", text: "newsletter weekly news updates sign up email" },
  { title: "Events", href: "/events/", kind: "Page", text: "calendar upcoming events happening" },
  { title: "Counseling", href: "/counseling/", kind: "Page", text: "counselors care help support appointment" },
  { title: "Connect", href: "/connect/", kind: "Page", text: "life groups serve volunteer next steps contact" },
  { title: "Give", href: "/give/", kind: "Page", text: "giving tithe donate offering online campaign" },
];

/** Words that mean the same thing to a parent: any one finds the others. */
export const SYNONYMS: string[][] = [
  ["kids", "kid", "children", "child", "c3kids", "nursery", "childcare", "toddler", "preschool"],
  ["directions", "address", "map", "parking", "where"],
  ["times", "time", "service", "services", "sunday", "saturday", "schedule", "when"],
  ["pray", "prayer", "praying"],
];
const group = (w: string): string[] => SYNONYMS.find((g) => g.includes(w)) ?? [w];

/** The page text a visitor would search, built from Studio's service times, never typed twice. */
function campusEntries(times: ServiceTimesData | null): Partial<Record<string, { text: string; excerpt: string }>> {
  if (!times) return {};
  const hays = campus(times, "hays");
  const kids = kidsTimes(hays);
  const kidsSentence = kids ? `C3Kids is available for children ages 3 through 5th grade during our ${kids} Sunday services.` : "";
  const addr = `${site.address.street}, ${site.address.city}, ${site.address.state} ${site.address.zip}`;
  return {
    "/locations/hays/": { text: `${kidsSentence} ${addr} nursery children kids c3kids`, excerpt: kidsSentence || `Find us at ${addr}.` },
    "/visit/": { text: `${kidsSentence} what to expect parking first time families`, excerpt: kidsSentence || "What to expect on your first Sunday." },
  };
}

/** Studio's sermons become searchable entries; the page entries are always there, so search works with Studio down. */
export function buildIndex(sermons: StudioSermon[] | null, times: ServiceTimesData | null = null): SearchEntry[] {
  const extra = campusEntries(times);
  const pages = PAGE_ENTRIES.map((e) => (extra[e.href] ? { ...e, text: `${e.text} ${extra[e.href]!.text}`, excerpt: extra[e.href]!.excerpt } : e));
  const msgs: SearchEntry[] = (sermons ?? []).map((s) => ({
    title: s.title,
    href: `/messages/${encodeURIComponent(s.id)}/`,
    kind: "Message",
    text: [s.speaker, dateLabel(s.date), ...(s.scripture_references ?? []), s.description].filter(Boolean).join(" "),
  }));
  return [...pages, ...msgs];
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
    if (!words.every((w) => group(w).some((v) => hay.includes(v)))) return;
    scored.push({ e, score: words.reduce((n, w) => n + (group(w).some((v) => title.includes(v)) ? 2 : 1), 0), i });
  });
  return scored.sort((a, b) => b.score - a.score || a.i - b.i).map((s) => s.e);
}

/** The words of a query (and their synonyms) to set in bold in an excerpt. */
export function highlightWords(query: string): string[] {
  const words = norm(query).split(/[^a-z0-9']+/).filter(Boolean);
  return [...new Set(words.flatMap(group))].sort((a, b) => b.length - a.length);
}
