import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import MissionBlock from "@/components/home/MissionBlock";
import MeetGrowServe from "@/components/home/MeetGrowServe";
import NT26Feature from "@/components/home/NT26Feature";
import LocationsSection from "@/components/home/LocationsSection";
import StayConnected from "@/components/home/StayConnected";
import GiveSection from "@/components/home/GiveSection";
import { getCMSScreen } from "@/lib/cms";
import { mapHomeContent, HOME_DEFAULTS } from "@/lib/home-content";

export const metadata: Metadata = {
  title: "Celebration Community Church | Welcome Home.",
  description:
    "A church family in Hays and Colby, Kansas — for everyone, just as you are. Services Saturday and Sunday.",
};

export default async function HomePage() {
  // The hand-built site is the source of truth. We ALWAYS render the real premium
  // components; C3 Studio (the CMS) only feeds their CONTENT. When the CMS is offline
  // or a field is unset, each component falls back to its exact hand-built default —
  // so the site is visually identical with or without the CMS.
  const home = await getCMSScreen("/").catch(() => null);
  const c = home?.blocks?.length ? mapHomeContent(home.blocks) : HOME_DEFAULTS;

  return (
    <>
      <Hero content={c.hero} />
      <MissionBlock content={c.mission} />
      <MeetGrowServe content={c.meetGrowServe} />
      <NT26Feature content={c.nt26} />
      <LocationsSection />
      <StayConnected />
      <GiveSection />
    </>
  );
}
