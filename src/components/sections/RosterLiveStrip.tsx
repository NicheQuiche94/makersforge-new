import { ROSTER } from "@/data/roster";
import { StatStrip } from "./StatStrip";

export function RosterLiveStrip() {
  const total = ROSTER.length;
  const available = ROSTER.filter((p) => p.available).length;
  const uaCount = ROSTER.filter((p) => p.discipline === "ua").length;
  const artCount = ROSTER.filter((p) => p.discipline === "art").length;

  return (
    <StatStrip
      cells={[
        { n: total, label: "total operators" },
        { n: <span className="gr">{available}</span>, label: "available now", pulse: true },
        { n: uaCount, label: "ua managers" },
        { n: artCount, label: "marketing artists" },
      ]}
    />
  );
}
