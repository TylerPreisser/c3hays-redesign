import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
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
      <MeetGrowServe />
      <NT26Feature />
      <LocationsSection />
      <StayConnected />
      <GiveSection />
    </>
  );
}
