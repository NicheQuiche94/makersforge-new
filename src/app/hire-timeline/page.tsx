import type { Metadata } from "next";
import { TimelineForm } from "./TimelineForm";

export const metadata: Metadata = {
  title: "Will your job ad hire in time? · MakersForge",
  description:
    "See when a job ad hire is likely to start, notice period included, against the date you need them. Free, from published hiring benchmarks.",
  alternates: { canonical: "/hire-timeline" },
};

/* 2026-11-09 (Andre): a lead magnet that reveals a problem (the hire won't
   start in time) before offering the fix (a search week). Sister tool to
   /compare; both run as ads and compete. */
export default function HireTimelinePage() {
  return <TimelineForm />;
}
