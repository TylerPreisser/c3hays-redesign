import type { Metadata } from "next";
import { Suspense } from "react";
import { getSermons } from "@/lib/sermons";
import { buildIndex } from "@/lib/search-index";
import { getServiceTimes } from "@/lib/service-times";
import SearchClient from "./SearchClient";

export const metadata: Metadata = { title: "Search", description: "Search messages and pages on the C3 website." };
// Studio's sermons are read on every request in the live build; in a static export there is no Studio and the page index alone is used.
export const dynamic = "force-dynamic";

export default async function SearchPage() {
  const [sermons, times] = await Promise.all([getSermons(), getServiceTimes()]);
  const index = buildIndex(sermons, times);
  return (
    <section style={{ backgroundColor: "#f4f5f5", paddingTop: "clamp(10.5rem, 16vw, 12rem)", paddingBottom: "clamp(3rem, 8vw, 6rem)", minHeight: "70vh" }}>
      <div className="container-c3" style={{ maxWidth: "44rem" }}>
        <h1 className="display-2" style={{ color: "#1b1c1c", marginBottom: "1.5rem" }}>Search</h1>
        <Suspense fallback={null}>
          <SearchClient index={index} />
        </Suspense>
      </div>
    </section>
  );
}
