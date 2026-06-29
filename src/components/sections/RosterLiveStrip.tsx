import { ROSTER } from "@/data/roster";
import { StatStrip } from "./StatStrip";

/* Roster live strip — total operators + available now, right-anchored.
   Per-discipline counts retired: the discipline filter on the toolbar
   below is now a role dropdown inferred from ROSTER (so "UA managers"
   etc. would be a hardcoded list that doesn't match the dropdown's
   actual options, and would explode as more titles land). The two
   remaining stats are the load-bearing scan-fast facts. */
export function RosterLiveStrip() {
  const total = ROSTER.length;
  const available = ROSTER.filter((p) => p.available).length;

  return (
    <StatStrip
      align="right"
      cells={[
        { n: total, label: "total operators" },
        {
          n: <span className="gr">{available}</span>,
          label: "available now",
          pulse: true,
        },
      ]}
    />
  );
}
