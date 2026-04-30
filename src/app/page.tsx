import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import MissionBlock from "@/components/home/MissionBlock";
import MeetGrowServe from "@/components/home/MeetGrowServe";
import NT26Feature from "@/components/home/NT26Feature";
import LocationsSection from "@/components/home/LocationsSection";
import StayConnected from "@/components/home/StayConnected";
import GiveSection from "@/components/home/GiveSection";

export const metadata: Metadata = {
  title: "Celebration Community Church | Welcome Home.",
  description:
    "Jesus is central to everything we do at C3. We exist to meet with Him, grow in Him, and serve through Him. Services in Hays and Colby, Kansas.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <MissionBlock />
      {/* Crimson accent rule: dark MissionBlock → light MeetGrowServe */}
      <div className="section-rule" style={{ backgroundColor: "#f2efed" }} />
      <MeetGrowServe />
      {/* Crimson accent rule: light MeetGrowServe → dark NT26Feature */}
      <div className="section-rule" style={{ backgroundColor: "#232e2c" }} />
      <NT26Feature />
      {/* Crimson accent rule: dark NT26Feature → light LocationsSection */}
      <div className="section-rule" style={{ backgroundColor: "#f2efed" }} />
      <LocationsSection />
      {/* Crimson accent rule: light LocationsSection → dark StayConnected */}
      <div className="section-rule" style={{ backgroundColor: "#232e2c" }} />
      <StayConnected />
      <GiveSection />
    </>
  );
}
