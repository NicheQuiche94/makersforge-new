import type { Metadata } from "next";
import { HeroPanel } from "@/components/sections/HeroPanel";
import { StatStrip } from "@/components/sections/StatStrip";
import { Statement } from "@/components/sections/Statement";
import { HowItWorksBento } from "@/components/sections/HowItWorksBento";
import { RosterCarousel } from "@/components/sections/RosterCarousel";
import { ForTalentBanner } from "@/components/sections/ForTalentBanner";
import { CTABand } from "@/components/sections/CTABand";

// Stats reframed per Andre 2026-05-30 v4: "avg deployment" replaced
// with a claim we can actually back (lineup is live, updated weekly).
const HOME_STATS = [
  { n: <span className="gr">50+</span>, label: "On the lineup" },
  { n: <span className="gr">2</span>, label: "Disciplines live" },
  { n: <span className="gr">Live</span>, label: "Lineup, updated weekly" },
  { n: <span className="gr">Flat</span>, label: "Monthly fee. That's it." },
];

export const metadata: Metadata = {
  title: "MakersForge: Growth team specialists for mobile apps & games",
  description:
    "A live lineup of senior UA managers and marketing artists for mobile apps and games. Pay them direct, pay us a flat monthly fee. No percentage games.",
  openGraph: {
    title:
      "MakersForge: Growth team specialists for mobile apps & games",
    description:
      "A live lineup of senior UA managers and marketing artists. Flat monthly fees, no percentage games.",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <>
      <HeroPanel />
      <StatStrip cells={HOME_STATS} />
      <Statement />
      <HowItWorksBento />
      <RosterCarousel />
      <ForTalentBanner />
      <CTABand />
    </>
  );
}
