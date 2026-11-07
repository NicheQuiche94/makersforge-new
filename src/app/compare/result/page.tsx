import type { Metadata } from "next";
import { decodeInput } from "@/lib/compare";
import { Results } from "./Results";

export const metadata: Metadata = {
  title: "Your hiring comparison · MakersForge",
  robots: { index: false, follow: false },
};

/* (Andre 2026-11-07): the comparison the email links to. */
export default async function ResultPage({ searchParams }: { searchParams: Promise<{ d?: string }> }) {
  const { d } = await searchParams;
  const input = d ? decodeInput(d) : null;
  return <Results input={input} />;
}
