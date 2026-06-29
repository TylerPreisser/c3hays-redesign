import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import MissionBlock from "@/components/home/MissionBlock";
import MeetGrowServe from "@/components/home/MeetGrowServe";
import NT26Feature from "@/components/home/NT26Feature";
import LocationsSection from "@/components/home/LocationsSection";
import StayConnected from "@/components/home/StayConnected";
import GiveSection from "@/components/home/GiveSection";
import { getCMSScreen, getCMSSermons, getCMSEvents, getCMSLocations } from "@/lib/cms";
import CMSBlocks from "@/components/cms/CMSBlocks";

export const metadata: Metadata = {
  title: "Celebration Community Church | Welcome Home.",
  description:
    "A church family in Hays and Colby, Kansas — for everyone, just as you are. Services Saturday and Sunday.",
};

export default async function HomePage() {
  // REAL integration: drive the homepage from C3 Studio (the CMS) when it's reachable.
  const home = await getCMSScreen("/");
  if (home && home.blocks?.length) {
    const [sermons, events, locations] = await Promise.all([getCMSSermons(), getCMSEvents(), getCMSLocations()]);
    return (
      <>
        <div style={{ background: "var(--color-ink)", color: "#9aa0a0", textAlign: "center", fontSize: ".72rem", letterSpacing: ".08em", textTransform: "uppercase", padding: "6px" }}>
          Live from C3 Studio
        </div>
        <CMSBlocks blocks={home.blocks} ctx={{ sermons: sermons || [], events: events || [], locations: locations || [] }} />
      </>
    );
  }

  // Fallback: the original hand-built homepage (CMS offline).
  return (
    <>
      <Hero />
      <MissionBlock />
      <MeetGrowServe />
      <NT26Feature />
      <LocationsSection />
      <StayConnected />
      <GiveSection />
    </>
  );
}
