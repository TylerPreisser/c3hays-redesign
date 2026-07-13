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
