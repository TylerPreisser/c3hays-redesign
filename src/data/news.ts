/**
 * C3 News data models.
 *
 * IMPORTANT — NO FABRICATED CONTENT. celebratejesus.org has no public news feed and
 * no "C3 Weekly" newsletter archive, so these arrays are intentionally EMPTY. The
 * /news page and its <IssueBrowser> render a graceful, honest "on its way" state and
 * remain fully editable in C3 Studio. When real content exists, fill these arrays
 * here (or wire to C3 Studio) — the UI, filters, and reader adapt to any length,
 * including empty. Do NOT reintroduce invented issue titles, series, authors, dates,
 * or stats.
 */
export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string; // ISO yyyy-mm-dd
  category: "Announcement" | "Event" | "Message" | "Outreach" | "Students";
  image: string;
  href: string;
}

// Empty until real news exists — no fabricated items.
export const news: NewsItem[] = [];

export const newsCategories = ["All", "Announcement", "Event", "Message", "Outreach", "Students"] as const;

/* ─────────────────────────────────────────────────────────────────────────
   The C3 Weekly — newsletter issues. They live in C3 Studio (`newsletter_issues`) and
   are read by src/lib/news-issues.ts; nothing is hard-coded here. No fabricated issues.
   ───────────────────────────────────────────────────────────────────────── */
export interface IssueSection {
  heading?: string;
  /** Sanitised HTML only (src/lib/news-issues.ts re-sanitises on read). */
  body: string;
}
export interface NewsletterIssue {
  id: string;
  /** Edition number shown as "Issue No. NN"; absent when Studio has none (a sent campaign carries no number). */
  number?: number;
  title: string;
  date: string; // ISO yyyy-mm-dd — the send date (defines the "week")
  excerpt: string;
  /** Searchable topic tags + the week-filter facets. */
  topics: string[];
  readMinutes: number;
  image?: string;
  /** Body of the issue, rendered by <IssueReader>. */
  sections: IssueSection[];
}
