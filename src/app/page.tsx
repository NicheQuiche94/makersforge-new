import type { Metadata } from "next";
import { HeroPanel } from "@/components/sections/HeroPanel";
import { MetaPills } from "@/components/sections/MetaPills";
import { Statement } from "@/components/sections/Statement";
import { HowItWorksBento } from "@/components/sections/HowItWorksBento";
import { RosterCarousel } from "@/components/sections/RosterCarousel";
import { CTABand } from "@/components/sections/CTABand";

export const metadata: Metadata = {
  title: "MakersForge — Growth team contractors for mobile apps & games",
  description:
    "A live roster of senior UA managers and marketing artists for mobile apps and games. Pay them direct, pay us a flat monthly fee. No percentage games.",
  openGraph: {
    title:
      "MakersForge — Growth team contractors for mobile apps & games",
    description:
      "A live roster of senior UA managers and marketing artists. Flat monthly fees, no percentage games.",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <>
      <HeroPanel />
      <MetaPills />
      <Statement />
      <HowItWorksBento />
      <RosterCarousel />
      <CTABand />
    </>
  );
}
