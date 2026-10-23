import type { Metadata } from "next";
import { SEGMENTS } from "@/data/segments";
import { SegmentPage } from "@/components/sections/SegmentPage";

const segment = SEGMENTS.apps;

export const metadata: Metadata = {
  title: segment.metaTitle,
  description: segment.metaDescription,
  alternates: { canonical: "/apps" },
  openGraph: { title: segment.metaTitle, description: segment.metaDescription, type: "website" },
};

export default function AppsPage() {
  return <SegmentPage segment={segment} />;
}
