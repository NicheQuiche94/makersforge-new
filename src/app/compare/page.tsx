import type { Metadata } from "next";
import { CompareMock } from "./CompareMock";

export const metadata: Metadata = {
  title: "Every way to hire, compared · MakersForge",
  description: "Compare every way to hire a mobile games or apps role: MakersForge, a job ad, a games agency and a tech agency, side by side on cost, weeks to hire and your team's hours. Free.",
  alternates: { canonical: "/compare" },
};

/* 2026-11-07 (Andre): one role in, every way to hire it compared on
   cost, speed, accuracy and team hours, honest when MakersForge isn't the
   best option. Figures: ours from our own searches, the rest market benchmarks (2026-11-07). */
export default function ComparePage() {
  return <CompareMock />;
}
