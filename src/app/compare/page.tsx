import type { Metadata } from "next";
import { CompareMock } from "./CompareMock";

export const metadata: Metadata = {
  title: "Design your hiring route · MakersForge",
  description: "A free, dated hiring plan for your mobile games or apps role: referrals, a job ad, agencies or MakersForge, in the right order, with when the hire lands. Free.",
  alternates: { canonical: "/compare" },
};

/* 2026-11-07 (Andre): one role in, every way to hire it compared on
   cost, speed, accuracy and team hours, honest when MakersForge isn't the
   best option. Figures: ours from our own searches, the rest market benchmarks (2026-11-07). */
export default async function ComparePage({ searchParams }: { searchParams: Promise<{ ad?: string }> }) {
  const { ad } = await searchParams;
  return <CompareMock fromAd={ad === "1"} />;
}
