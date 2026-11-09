import type { Metadata } from "next";
import { GradingTool } from "./GradingTool";

export const metadata: Metadata = {
  title: "Job ad grading tool · MakersForge",
  description:
    "Drop in your job ad and get a score out of 100, with the fixes that will make the biggest difference to who applies. Free, for mobile games and app studios.",
  alternates: { canonical: "/job-ad-grading-tool" },
};

/* Job ad grading tool (Andre 2026-11-08): drop in a job ad, get a score out
   of 100 and the fixes that matter most, by email (designed email + PDF);
   Andre offers to rewrite it by hand. Claude reads the ad against Andre's
   scorecard (lib/adGraderAI), with the rule reader as a fallback. */
export default async function GradingToolPage({ searchParams }: { searchParams: Promise<{ ad?: string }> }) {
  const { ad } = await searchParams;
  return <GradingTool fromAd={ad === "1"} />;
}
