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
    "A church family in Hays and Colby, Kansas — for everyone, just as you are. Services Saturday and Sunday.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <MissionBlock />
      {/* Teal accent rule: dark MissionBlock → white MeetGrowServe */}
      <div className="section-rule" style={{ backgroundColor: "#ffffff" }} />
      <MeetGrowServe />
      {/* Teal accent rule: white MeetGrowServe → ink NT26Feature */}
      <div className="section-rule" style={{ backgroundColor: "#1b1c1c" }} />
      <NT26Feature />
      {/* Teal accent rule: ink NT26Feature → mist LocationsSection */}
      <div className="section-rule" style={{ backgroundColor: "#f6f6f6" }} />
      <LocationsSection />
      {/* Teal accent rule: mist LocationsSection → white StayConnected */}
      <div className="section-rule" style={{ backgroundColor: "#ffffff" }} />
      <StayConnected />
      <GiveSection />
    </>
  );
}
