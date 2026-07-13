import type { Metadata } from "next";
import NewsClient from "./NewsClient";
import { news } from "@/data/news";

export const metadata: Metadata = {
  title: "News & Happenings",
  description: "Current news, events, and what's happening at Celebration Community Church.",
};

export default function NewsPage() {
  return <NewsClient items={news} />;
}
