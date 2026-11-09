/**
 * LinkedIn Insight Tag conversions (Andre 2026-11-09). The tag itself loads
 * only after cookie consent (components/consent/Consent.tsx, partner
 * 10072226). Each key below is a conversion created in Campaign Manager as
 * "Event-specific"; paste its conversion ID in and the event starts counting.
 * Until then the calls do nothing.
 */
export const LINKEDIN_PARTNER_ID = "10072226";

const CONVERSIONS: Record<LinkedInEvent, number | null> = {
  compare_requested: null, // /compare: "Email me my comparison"
  timeline_requested: null, // /hire-timeline: "Email me my timeline"
  ad_graded: null, // /job-ad-grading-tool: "Email me my score"
  booking_started: null, // /start: a search week reserved
  booking_completed: null, // /start: terms signed and booked
};
export type LinkedInEvent = "compare_requested" | "timeline_requested" | "ad_graded" | "booking_started" | "booking_completed";

type Lintrk = (action: "track", data: { conversion_id: number }) => void;

export function trackLinkedIn(event: LinkedInEvent) {
  const id = CONVERSIONS[event];
  const lintrk = typeof window !== "undefined" ? (window as unknown as { lintrk?: Lintrk }).lintrk : undefined;
  if (!id || !lintrk) return;
  try {
    lintrk("track", { conversion_id: id });
  } catch {}
}
