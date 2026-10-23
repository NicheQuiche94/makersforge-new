import type { Metadata } from "next";
import { SEGMENTS } from "@/data/segments";
import { SegmentPage } from "@/components/sections/SegmentPage";

const segment = SEGMENTS.games;

export const metadata: Metadata = {
  title: segment.metaTitle,
  description: segment.metaDescription,
  alternates: { canonical: "/games" },
  openGraph: { title: segment.metaTitle, description: segment.metaDescription, type: "website" },
};

export default function GamesPage() {
  return <SegmentPage segment={segment} />;
}
