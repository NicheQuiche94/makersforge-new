import type { Metadata } from "next";
import { NeedsTool } from "./NeedsTool";

export const metadata: Metadata = {
  title: "What am I hiring for? · MakersForge",
  robots: { index: false, follow: false },
};

/* MOCKUP 2026-11-08 (Andre): step one in the chain of free tools. Works out
   the hire from first principles, then hands a draft ad to the grading tool. */
export default function Page() {
  return <NeedsTool />;
}
