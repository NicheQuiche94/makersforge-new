import type { Metadata } from "next";
import { TimelineForm } from "./TimelineForm";

export const metadata: Metadata = {
  title: "When will your hire actually start? · MakersForge",
  description:
    "Hiring with a job ad? See when your hire is likely to start, stage by stage, with the notice period in their country, against the date you need them. Free, from published benchmarks.",
  alternates: { canonical: "/hire-timeline" },
  robots: { index: false }, // MOCKUP until Andre signs it off
};

/* 2026-11-09 (Andre): a lead magnet that reveals a problem (the hire won't
   start in time) before offering the fix (a search week). Sister tool to
   /compare; both run as ads and compete. */
export default function HireTimelinePage() {
  return <TimelineForm />;
}
