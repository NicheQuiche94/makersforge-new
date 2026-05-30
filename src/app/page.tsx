import type { Metadata } from "next";
import { HeroPanel } from "@/components/sections/HeroPanel";
import { StatStrip } from "@/components/sections/StatStrip";
import { Statement } from "@/components/sections/Statement";
import { HowItWorksBento } from "@/components/sections/HowItWorksBento";
import { RosterCarousel } from "@/components/sections/RosterCarousel";
import { CTABand } from "@/components/sections/CTABand";

const HOME_STATS = [
  { n: <>50<span className="gr">+</span></>, label: "vetted operators" },
  { n: <span className="gr">2</span>, label: "disciplines live" },
  { n: <>&lt;7<span className="gr">d</span></>, label: "avg deployment" },
  { n: "£0", label: "% of salary taken" },
];

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
      <StatStrip cells={HOME_STATS} />
      <Statement />
      <HowItWorksBento />
      <RosterCarousel />
      <CTABand />
    </>
  );
}
