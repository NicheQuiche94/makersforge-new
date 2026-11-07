import type { Metadata } from "next";
import { CompareMock } from "./CompareMock";

export const metadata: Metadata = {
  title: "Every way to hire, compared · MakersForge",
  robots: { index: false, follow: false },
};

/* MOCKUP 2026-11-07 (Andre): one role in, every way to hire it compared on
   cost, speed, accuracy and team hours, honest when MakersForge isn't the
   best option. All figures are draft assumptions for Andre to set. */
export default function ComparePage() {
  return <CompareMock />;
}
