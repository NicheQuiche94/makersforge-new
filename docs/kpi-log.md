# MakersForge — KPI running tally

Running numbers for investor reporting. Updated whenever companies, contacts, or
leads are added to Folk (or when board metrics move). Source of truth for Folk
counts is the Folk workspace (Companies MF / Contacts MF groups); this log is the
time-series on top of it so growth is visible at a glance.

## Snapshot

_As of 2026-07-19_

| Metric | Count |
|---|---|
| Folk — Companies (Companies MF) | 110 |
| Folk — Contacts (Contacts MF) | 118 |
| Folk — new leads added via job board | 37 companies / 44 contacts |
| Job board — live roles | 100 |
| Job board — companies on board | 42 |
| Job board — alert signups | 0 |

_(Board trimmed from 114→100 roles by the 2026-07-19 remit audit: removed off-remit companies/roles — see log.)_

## Log

Newest first. "+N" = records added this entry.

| Date | Change | Companies + | Contacts + | Running: Companies / Contacts | Notes |
|---|---|---|---|---|---|
| 2026-07-19 | Remit cleanup: removed off-remit leads | −3 | −3 | 110 / 118 | Deleted Immutable, Inworld AI, Coinbase (+ their contacts) — off-remit after the board audit. |
| 2026-07-19 | Gap-fill: skipped companies + odd-name fixes | +6 | +8 | 113 / 121 | 7 getro startups (Midnite, Immutable, Inworld…) via domain overrides; fixed odd Apollo names (Supercell→Rob Lowe, Peloton→Katie Hawkins), deleted 2 junk records. |
| 2026-07-19 | Apollo contact-find → Folk bulk import | +32 | +37 | 107 / 113 | Automated: board companies + Apollo-sourced decision-maker per company (growth/UA/CMO), imported as Leads / "Job board signal". |
| 2026-07-18 | Job board → Folk import (test batch) | +2 | +2 | 75 / 76 | Tripledot Studios (Mark Beck, CMO) + Suno (Mikey Shulman, CEO). Status Lead, Channel "Job board signal", live roles in Next Steps. |
| 2026-07-18 | Baseline established | — | — | 73 / 74 | Starting point before job-board → Folk import flow. |

---

### How this gets updated
- Each time job-board companies are imported to Folk (Companies MF, Status "Lead",
  Channel "Job board signal") and a contact is added (Contacts MF), a row is appended
  here and the snapshot totals are bumped.
- Board metrics (live roles, companies monitored, alert signups) come from
  `src/data/jobs.json` and the alerts store.
