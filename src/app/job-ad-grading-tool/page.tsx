import type { Metadata } from "next";
import { boardScores, boardAdText } from "@/lib/adGraderBench";
import { GradingTool, type Sample } from "./GradingTool";

export const metadata: Metadata = {
  title: "Job ad grading tool · MakersForge",
  robots: { index: false, follow: false },
};

/* MOCKUP 2026-11-08 (Andre): drop in a job ad, get a score out of 100 and
   the fixes that matter most, by email; Andre offers to rewrite it by hand.
   Step two in a chain of free tools (what am I hiring for → the ad →
   compare routes → a search week). Weights and copy are drafts. */
export default function GradingToolPage() {
  const { scored } = boardScores();
  // A spread of real ads to preview the scoring on: the best, the middle and the weakest.
  const mid = scored.length >> 1;
  const pick = [...scored.slice(0, 3), ...scored.slice(mid - 2, mid + 1), ...scored.slice(-3)];
  const samples: Sample[] = pick.map(({ x, s }) => ({
    id: x.slug,
    label: `${typeof x.company === "string" ? x.company : x.company?.name ?? ""}: ${x.title} (${s})`,
    title: x.title,
    text: boardAdText(x),
  }));
  return <GradingTool samples={samples} />;
}
