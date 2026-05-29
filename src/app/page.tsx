import type { Metadata } from "next";
import { HeroHome } from "@/components/sections/HeroHome";
import { MetaStrip } from "@/components/sections/MetaStrip";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { RosterPreview } from "@/components/sections/RosterPreview";
import { GradientBand } from "@/components/sections/GradientBand";

export const metadata: Metadata = {
  title:
    "MakersForge — Growth team contractors for mobile apps & games",
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
      <HeroHome />
      <MetaStrip />
      <HowItWorks />
      <RosterPreview />
      <GradientBand />
    </>
  );
}
