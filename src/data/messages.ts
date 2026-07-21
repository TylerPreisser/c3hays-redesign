/**
 * C3 Past Messages — seed data for the searchable <PastMessagesGrid>.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * NEUTRAL PLACEHOLDERS ONLY. celebratejesus.org's full message archive lives on
 * YouTube (youtube.com/@c3hays). We do NOT invent sermon-series names, speakers,
 * or scripture references here. These are generic "Sunday Message" cards with
 * month/year labels so the search + filter feature is real and functional out of
 * the box.
 *
 * The church replaces these with real messages — either edit this array with real
 * titles/dates (each `href` can point at the specific YouTube watch URL) or wire
 * it to C3 Studio. Every field below is editable. The grid, search, and year
 * filter adapt to any length, including empty.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** The real C3 message archive on YouTube. Cards default here. */
export const YOUTUBE_CHANNEL = "https://youtube.com/@c3hays";

export interface PastMessage {
  id: string;
  /** Editable card title — replace with the real message title. */
  title: string;
  /** Neutral human date label shown on the card (e.g. "March 2025"). */
  dateLabel: string;
  /** Year facet used by the filter chips. */
  year: string;
  /** Searchable tags — kept neutral (topics/format), never a fake series name. */
  tags: string[];
  /** Link target — the real YouTube channel (or a specific watch URL). */
  href: string;
}

// Neutral placeholders — the church replaces these with real messages.
export const pastMessages: PastMessage[] = [
  {
    id: "msg-2025-05",
    title: "Sunday Message",
    dateLabel: "May 2025",
    year: "2025",
    tags: ["Weekend Service", "Teaching"],
    href: YOUTUBE_CHANNEL,
  },
  {
    id: "msg-2025-04",
    title: "Sunday Message",
    dateLabel: "April 2025",
    year: "2025",
    tags: ["Weekend Service", "Worship"],
    href: YOUTUBE_CHANNEL,
  },
  {
    id: "msg-2025-03",
    title: "Sunday Message",
    dateLabel: "March 2025",
    year: "2025",
    tags: ["Weekend Service", "Teaching"],
    href: YOUTUBE_CHANNEL,
  },
  {
    id: "msg-2024-12",
    title: "Sunday Message",
    dateLabel: "December 2024",
    year: "2024",
    tags: ["Weekend Service", "Christmas"],
    href: YOUTUBE_CHANNEL,
  },
  {
    id: "msg-2024-11",
    title: "Sunday Message",
    dateLabel: "November 2024",
    year: "2024",
    tags: ["Weekend Service", "Gratitude"],
    href: YOUTUBE_CHANNEL,
  },
  {
    id: "msg-2024-10",
    title: "Sunday Message",
    dateLabel: "October 2024",
    year: "2024",
    tags: ["Weekend Service", "Teaching"],
    href: YOUTUBE_CHANNEL,
  },
];
