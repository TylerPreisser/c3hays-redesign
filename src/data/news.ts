/**
 * C3 News / "What's happening" — dated items shown on /news with date filtering.
 * Seeded with church-appropriate items (celebratejesus.org has no public news feed
 * to scrape). Edit/extend here, or wire to C3 Studio later.
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

// Relative to "today" = 2026-06-29 so the date filters have content in each bucket.
export const news: NewsItem[] = [
  { id: "n1", title: "Baptism Sunday is July 12", excerpt: "Ready to take your next step? Sign up to be baptized at either campus on July 12.", date: "2026-06-28", category: "Announcement", image: "/images/worship.webp", href: "/connect/" },
  { id: "n2", title: "Student Summer Bash", excerpt: "Games, food, and a message for grades 6–12 — this Wednesday at the Hays campus.", date: "2026-06-26", category: "Students", image: "/images/gather.webp", href: "/connect/" },
  { id: "n3", title: "New Message Series: The Word Became Flesh", excerpt: "We're walking through the Gospel of John all summer. Catch this week's message online.", date: "2026-06-22", category: "Message", image: "/images/nt26.webp", href: "/messages/" },
  { id: "n4", title: "Community Serve Day Recap", excerpt: "Over 200 volunteers served across Hays last weekend. Thank you for being the church.", date: "2026-06-14", category: "Outreach", image: "/images/congregation.webp", href: "/about/" },
  { id: "n5", title: "Colby Campus Worship Night", excerpt: "An evening of extended worship and prayer at the Colby campus.", date: "2026-06-06", category: "Event", image: "/images/building.webp", href: "/locations/colby/" },
  { id: "n6", title: "Marriage Night Returns", excerpt: "A date night to invest in your marriage — childcare provided. Registration open.", date: "2026-05-24", category: "Event", image: "/images/community.webp", href: "/connect/" },
  { id: "n7", title: "NT26 Reading Plan Kickoff", excerpt: "Read the entire New Testament with us in 2026 — one chapter at a time, together.", date: "2026-04-30", category: "Announcement", image: "/images/nt26.webp", href: "/messages/" },
  { id: "n8", title: "Easter at C3", excerpt: "Thousands gathered across both campuses to celebrate the resurrection. He is risen!", date: "2026-04-05", category: "Event", image: "/images/hero-1.webp", href: "/about/" },
];

export const newsCategories = ["All", "Announcement", "Event", "Message", "Outreach", "Students"] as const;

/* ─────────────────────────────────────────────────────────────────────────
   The C3 Weekly — newsletter issues (ready-to-fill model)
   ─────────────────────────────────────────────────────────────────────────
   These are SEED issues so the /newsletter browser (filter-by-week + search)
   has something real to render and design against. They are NOT a fabricated
   long archive — a small, honest set of recent weekly editions grounded in the
   church's actual summer content (Gospel of John series, Baptism Sunday,
   student ministry). When the real Beehiiv-style feed lands, replace/extend
   this array (or wire it to C3 Studio); the UI, filter, and reader adapt to
   any length — including an empty array (graceful "on its way" state). */
export interface IssueSection {
  heading: string;
  /** May contain inline HTML (<em>, <strong>, links) — authored content only. */
  body: string;
}
export interface NewsletterIssue {
  id: string;
  /** Sequential edition number shown as "Issue No. NN". */
  number: number;
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

// Recent weekly editions relative to "today" = 2026-07-16.
export const newsletterIssues: NewsletterIssue[] = [
  {
    id: "iss-2026-07-13",
    number: 14,
    title: "Baptized, and belonging",
    date: "2026-07-13",
    excerpt:
      "Sunday we celebrated more than 30 baptisms across both campuses — plus where we're headed next in the Gospel of John.",
    topics: ["Baptism", "Gospel of John", "Students"],
    readMinutes: 3,
    image: "/images/worship.webp",
    sections: [
      {
        heading: "This week's message",
        body:
          "We continued <em>The Word Became Flesh</em> in John 6 &mdash; Jesus, the bread of life. If you missed it, the full message is up on YouTube and the C3 App.",
      },
      {
        heading: "Baptism Sunday recap",
        body:
          "More than 30 people took the plunge across Hays and Colby. If you're ready to take that step, stop by the Connect Center this weekend and we'll walk with you.",
      },
      {
        heading: "Coming up",
        body:
          "Student Summer Bash lands Wednesday for grades 6&ndash;12, and Serve Day sign-ups open Friday morning.",
      },
    ],
  },
  {
    id: "iss-2026-07-06",
    number: 13,
    title: "The week ahead at C3",
    date: "2026-07-06",
    excerpt:
      "Baptism Sunday is almost here, students kick off their summer, and we keep walking through John together.",
    topics: ["Baptism", "Gospel of John", "Events"],
    readMinutes: 2,
    image: "/images/gather.webp",
    sections: [
      {
        heading: "Baptism Sunday is July 12",
        body:
          "Ready to be baptized at either campus? Sign up at the Connect Center or online &mdash; no experience required, just a next step of obedience.",
      },
      {
        heading: "This week's message",
        body:
          "John 5: an invitation to be made well. We're learning what it looks like to actually want the healing Jesus offers.",
      },
      {
        heading: "Students",
        body:
          "Summer Bash rolls on &mdash; games, food, and a message for grades 6&ndash;12 every Wednesday at the Hays campus.",
      },
    ],
  },
  {
    id: "iss-2026-06-29",
    number: 12,
    title: "Summer in the Gospel of John",
    date: "2026-06-29",
    excerpt:
      "Our new summer series begins, a Colby worship night is on the calendar, and it's time for an NT26 check-in.",
    topics: ["Gospel of John", "Worship", "NT26"],
    readMinutes: 2,
    image: "/images/congregation.webp",
    sections: [
      {
        heading: "New series: The Word Became Flesh",
        body:
          "All summer we're walking through the Gospel of John, one passage at a time. Bring a friend and a Bible &mdash; or use the one in the app.",
      },
      {
        heading: "Colby Worship Night",
        body:
          "An evening of extended worship and prayer at the Colby campus. Come as you are; childcare is provided.",
      },
      {
        heading: "NT26 check-in",
        body:
          "We're reading the whole New Testament together in 2026. Behind? That's okay &mdash; jump back in with today's chapter.",
      },
    ],
  },
];
