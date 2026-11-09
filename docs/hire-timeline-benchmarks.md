# Hire timeline benchmarks ("When will your hire actually start?")

Researched 2026-11-09. Sources from 2023-2026 where possible. No MakersForge-run board is used or cited.

Confidence key:
- **high**: primary source read directly, clear definition
- **medium**: primary source exists, but the figure came from the publisher's summary or a reliable secondary source, or the definition is loose
- **low**: vendor blog, aggregator, or conflicting sources. Use only as a range.

## Definitions (keep these separate in the calculator)

- **Time to fill**: the role (requisition) opens, through to offer accepted. SHRM, Workable and Ashby's "Time to First Fill" use this definition, though Ashby's clock stops at hire rather than at acceptance.
- **Time to hire**: one candidate's application (or entry into the ATS), through to hire or acceptance. Ashby and Gem both measure this. It is always shorter than time to fill.
- **Time to start**: offer accepted, through to day one. This is mostly the notice period. Ashby's EMEA report says it is not measured and "tends to run meaningfully longer in Europe".
- LinkedIn's 2023 figure is unusual. It runs from **application to first day of work**, so it includes the notice period. US notice is about 2 weeks, so this figure is about 2 weeks shorter than the European equivalent would be.

---

## 1. Company runs it itself (job ads / in-house)

```json
[
  {
    "figure": "52 days (junior), 63 days (mid-level), 71 days (senior)",
    "measures": "Median Time to First Fill: job opened -> first hire made",
    "split": "seniority",
    "source": "Ashby, Recruiting Operations Benchmarks (2026 Talent Trends Report)",
    "url": "https://www.ashbyhq.com/talent-trends-report/reports/recruiting-operations-benchmarks-talent-trends",
    "year": "Published 7 May 2026. Data Jan 2021 - Mar 2026, 54M+ applications, 93K+ jobs",
    "confidence": "high. Best seniority split found. Ashby customers skew towards tech/VC-backed companies, which suits MF. No head/director/exec band. Global, no EU-only cut."
  },
  {
    "figure": "75 days (technical roles), 60 days (business roles)",
    "measures": "Median Time to First Fill (job open -> first hire)",
    "source": "Ashby, Recruiting Operations Benchmarks 2026",
    "url": "https://www.ashbyhq.com/talent-trends-report/reports/recruiting-operations-benchmarks-talent-trends",
    "year": "2026",
    "confidence": "high. Technical roles take about 25% longer than business roles."
  },
  {
    "figure": "Interview loop ~18 days (technical, median 17.9), ~14 days (business, median 14.4)",
    "measures": "First interview -> last interview (stage-level data)",
    "source": "Ashby, Recruiting Operations Benchmarks 2026",
    "url": "https://www.ashbyhq.com/talent-trends-report/reports/recruiting-operations-benchmarks-talent-trends",
    "year": "2026",
    "confidence": "high. The only credible stage-level figure found for the interview phase."
  },
  {
    "figure": "Slow companies (bottom quartile) take +3.3 days (business) / +4.7 days (tech) longer at the offer stage",
    "measures": "Offer turnaround: candidate enters offer stage -> offer created",
    "source": "Ashby, Recruiting Operations Benchmarks 2026",
    "url": "https://www.ashbyhq.com/talent-trends-report/reports/recruiting-operations-benchmarks-talent-trends",
    "year": "2026",
    "confidence": "high, but it is a gap between quartiles, not an absolute duration"
  },
  {
    "figure": "EMEA median 35 days (past year); EMEA averaged 37-43 days every year since 2021; AMER median 34 days",
    "measures": "Time to hire: application received -> hire made",
    "source": "Ashby, EMEA Recruiter Productivity (Talent Trends)",
    "url": "https://www.ashbyhq.com/talent-trends-report/reports/emea-recruiter-productivity",
    "year": "Published 9 Sep 2026. 180K+ EMEA jobs, Jan 2021 - Jun 2026",
    "confidence": "high. The best Europe-specific figure. It shows EU process speed is about the same as the US, and that the gap between the regions comes from notice periods."
  },
  {
    "figure": "42 days with a recruiter involved vs 62 days without (startups < 25 employees)",
    "measures": "Time to hire (Ashby does not define it on the page)",
    "source": "Ashby, The State of Startup Hiring 2026",
    "url": "https://www.ashbyhq.com/talent-trends-report/reports/startup-hiring",
    "year": "Published 23 Feb 2026. Mostly 2025 data, 1,200+ VC-backed startups, 32K hires",
    "confidence": "medium. Very relevant for small studios: a founder hiring alone is about 30% slower. 'Recruiter' means any recruiter user in Ashby (in-house or external), NOT specifically an agency."
  },
  {
    "figure": "41 days (2024 average), up from 33 days in 2021",
    "measures": "Average time to hire (Gem's clock reportedly starts when the candidate enters the ATS)",
    "source": "Gem, 2025 Recruiting Benchmarks",
    "url": "https://vercel.gem.com/blog/10-takeaways-from-the-2025-recruiting-benchmarks-report",
    "year": "2025 report. Data Jan 2021 - Dec 2024, 140M applicants, 1.3M hires",
    "confidence": "medium. The definition is not stated on the page. Gem's 2026 report uses a median (24 days) on a different basis, so do not mix the two."
  },
  {
    "figure": "Engineering ~53 days (Gem 2025, average); IT/infosec 58 days",
    "measures": "Average time to hire by department",
    "source": "Gem 2025 Recruiting Benchmarks, via secondary sources (Metaview; aggregators)",
    "url": "https://www.metaview.ai/resources/blog/time-to-hire-by-role",
    "year": "2024 data",
    "confidence": "low. Could not verify against Gem's own PDF."
  },
  {
    "figure": "Median ~44 days nonexecutive, ~45 days executive (2025); nonexecutive 39 days in the 2026 edition, executive still 45",
    "measures": "Time to fill: requisition -> offer acceptance, calendar days",
    "source": "SHRM, 2025 Recruiting Benchmarking Report (2,371 US members, surveyed Jan-Mar 2025)",
    "url": "https://www.shrm.org/content/dam/en/shrm/research/2025-recruiting-benchmarking-report.pdf",
    "year": "2025 / 2026",
    "confidence": "medium. Figures taken from SHRM's summary and secondary sources; the PDF is too large and partly paywalled to verify directly. US only, all industries (not tech-specific)."
  },
  {
    "figure": "~49 days overall (about 7 weeks); entry-level ~6 weeks, senior ~7 weeks; engineering > 57 days; consulting ~63 days",
    "measures": "Application -> FIRST DAY AT WORK (includes US notice of about 2 weeks)",
    "source": "LinkedIn hiring cycle data, reported by CNBC",
    "url": "https://www.cnbc.com/2023/08/16/landing-a-job-right-now-could-take-you-nearly-2-months-says-linkedin.html",
    "year": "Apr-Jun 2023, ~178K confirmed US hires",
    "confidence": "medium-high. The only end-to-end 'until they start' figure found. It is US-only, so add the extra European notice on top."
  },
  {
    "figure": "42.8 days average (Sep 2024), 43.3 days (Aug 2024), 44.2 days cited in Aug report",
    "measures": "Workable time to fill: job opened -> filled",
    "source": "Workable Hiring Pulse",
    "url": "https://resources.workable.com/stories-and-insights/hiring-pulse/sep-2024",
    "year": "2024",
    "confidence": "medium. SMB-heavy, all industries. Function-level numbers are inconsistent with the headline figure."
  }
]
```

### Head / Director / Exec (company-run)

- No credible in-house (non-agency) figure for Head or Director level was found. SHRM's "executive" median (about 45 days) is the only one available. It is self-reported by US HR teams and is suspiciously close to the nonexecutive figure.
- A reasonable approach is to extrapolate Ashby's seniority slope (junior 52, mid 63, senior 71, so roughly +8-11 days per band) to about 80-90 days for Head/Director. **That is an extrapolation, not a sourced figure.** Label it as one if used.

### Ad live -> "enough applicants"

- **Not findable** as a credible benchmark. No ATS vendor publishes a "days until shortlist-ready" figure.
- Related data: Gem 2026 says only 8% of applicants pass initial screening and about 1 hire is made per 200 applications. Ashby says non-interviewed candidates are archived (rejected) after about 6 days median. Treat the screening stage as roughly 1-2 weeks, an inference that is not cited as a figure.

### Gaming-specific

- **Not findable.** No credible 2023-2026 time-to-fill data specific to games or mobile apps was found. Use the "technical vs business" split from Ashby as the proxy.

---

## 2. Contingent agency

```json
[
  {
    "figure": "No credible contingent-agency time-to-fill dataset found",
    "measures": "-",
    "source": "Searched REC, Bullhorn, SIA, Recruiterflow",
    "url": "https://recruiterflow.com/blog/time-to-fill-benchmarks/",
    "year": "2026",
    "confidence": "Recruiterflow (Sep 2026) says contingent has 'no committed timeline' and tracks the ~42-day in-house baseline with the widest spread of any model. It publishes no figures from its own platform. Engaged/hybrid 60-90 days and retained 90-120 days are attributed to Pin (2026) with no methodology. LOW."
  },
  {
    "figure": "Director 6-12 weeks, VP 8-14 weeks, C-suite 12-16+ weeks",
    "measures": "Executive search time to fill (search open -> offer accepted)",
    "source": "Talentfoot, Executive Time-to-Fill Benchmarks 2026",
    "url": "https://talentfoot.com/executive-time-to-fill-metrics/",
    "year": "2026",
    "confidence": "low. Vendor ranges with no methodology given."
  },
  {
    "figure": "117 days average; 76% placement rate",
    "measures": "Retained executive search: project start -> placement",
    "source": "Clockwork Recruiting, 2024 Executive Search Benchmark Report",
    "url": "https://www.clockworkrecruiting.com/hubfs/2024-Clockwork-Executive-Search-Benchmark-Report.pdf",
    "year": "2024",
    "confidence": "medium. Figure taken from a search summary; the PDF text could not be extracted. Covers retained exec search (search-firm software users), not contingent."
  }
]
```

**Bottom line:** there is no credible public data showing that contingent agencies are faster or slower than in-house hiring. The only adjacent evidence is Ashby's startup finding: hiring with a recruiter involved is about 30% faster than a founder hiring alone, at 42 vs 62 days. That "recruiter" is not specifically an agency. Any agency-speed claim in the calculator should be framed as MakersForge's own process or SLA, not as an industry benchmark.

---

## 3. Notice periods (employee resigning)

"Statutory" means the legal floor for the **employee's** resignation. "Practice" means what is common for professional, tech and manager roles. The practice figures are mostly sourced from HR/legal guides rather than surveys, so treat them as **medium/low**.

```json
[
  {
    "country": "UK",
    "statutory": "1 week after 1 month's service (Employment Rights Act 1996 s.86). The employer's notice rises by 1 week per year of service, up to 12 weeks.",
    "practice": "1 month is the most common for staff (XpertHR 2010: two-thirds of organisations). 3 months is typical for managers and seniors (a 58.6% 'average for managers' figure in an IRIS guide, underlying survey not named).",
    "sources": [
      "https://hrcentre.uk.brightmine.com/survey-analysis/managing-employee-departures-survey-2010-notice-periods/105147",
      "https://www.iris.co.uk/blog/a-complete-guide-to-notice-periods/",
      "https://support.remote.com/hc/en-us/articles/5831900985613"
    ],
    "confidence": "statutory high. Practice medium (the survey data is old or unnamed). 1 month mid / 3 months senior is the widely accepted convention."
  },
  {
    "country": "Germany",
    "statutory": "4 weeks to the 15th or the end of a calendar month (§622 BGB). 2 weeks during probation (max 6 months). The longer service-based scale (1-7 months) applies only to the employer, unless the contract mirrors it.",
    "practice": "Contracts commonly extend to 3 months. For senior and leitende Angestellte, 3-6 months to the quarter-end is common. A Haufe expert cites '3 months to month-end or quarter-end' as the most common terms.",
    "sources": [
      "https://apps.eurofound.europa.eu/legislationdb/notice-period-to-employees/germany",
      "https://www.finanztip.de/arbeitsrecht-kuendigungsfrist/",
      "https://www.arbeitsrechte.de/leitender-angestellter-kuendigungsfrist/",
      "https://www.haufe-akademie.de/blog/themen/personalmanagement/kuendigung/"
    ],
    "confidence": "statutory high. Practice medium. Note: the quarter-end rule can add up to another ~3 months, so 3 months to quarter-end means 3-6 months in reality, depending on when they resign."
  },
  {
    "country": "Netherlands",
    "statutory": "1 month for the employee (regardless of tenure). The contract can extend it to a max of 6 months, and if the employee's notice is over 1 month, the employer's must be at least double. Employer: 1-4 months by tenure.",
    "practice": "1 month is standard. 2-3 months is seen for senior roles (contractual). No survey found.",
    "sources": [
      "https://business.gov.nl/regulations/notice-period/",
      "https://www.eurodev.com/blog/notice-period-and-severance-pay-in-eu-countries-in-2025"
    ],
    "confidence": "statutory high (government site). Practice for seniors is low (convention only)."
  },
  {
    "country": "France",
    "statutory": "The Code du travail sets no general resignation notice. It comes from the collective agreement (CCN) or custom.",
    "practice": "Syntec (IDCC 1486, covers IT/digital/engineering, so most tech and games studios): cadres (IC) 3 months regardless of seniority. ETAM 1 month (<2 yrs) or 2 months (2+ yrs). Overall range 1-3 months.",
    "sources": [
      "https://payfit.com/fr/ccn/syntec/preavis-licenciement/",
      "https://www.victorisavocat.com/en/blog/licenciement-des-cadres-le-guide-complet-pour-dirigeants-et-cadres-2026",
      "https://www.eurodev.com/blog/notice-period-and-severance-pay-in-eu-countries-in-2025"
    ],
    "confidence": "medium-high. 3 months for cadres is reliable for Syntec-covered tech roles. Early release by mutual agreement is common but not guaranteed."
  },
  {
    "country": "Spain",
    "statutory": "The Estatuto de los Trabajadores defers to the collective agreement or custom. 15 days is the common default.",
    "practice": "15 days to 1 month, often 30+ days under convenios. Senior management (alta dirección, RD 1382/1985): 3 months, which the contract can extend up to 6.",
    "sources": [
      "https://employsome.com/?p=7663",
      "https://www.eliasymunozabogados.com/en/labour-law/lawyers-managers",
      "https://www.boe.es/eli/es/rd/1985/08/01/1382"
    ],
    "confidence": "medium. Convenio-dependent. Could not find a reliable 'técnicos titulados 2 months' rule."
  },
  {
    "country": "Italy",
    "statutory": "Set by the national collective agreement (CCNL) by level and tenure. Range 15 days to 6 months (Eurodev).",
    "practice": "CCNL Commercio, Quadri/1st level resigning: about 45-60 days (<5 yrs). Sources conflict. Metalmeccanici ranges from 10 days to 4 months by level. Dirigenti are typically longer. Remote lists employer-side notice of 60/90/120 days for Quadro/Level 1.",
    "sources": [
      "https://support.remote.com/hc/en-us/articles/5831900985613",
      "https://www.eurodev.com/blog/notice-period-and-severance-pay-in-eu-countries-in-2025",
      "https://www.lexplain.it/preavviso-ccnl-commercio-dimissioni-o-licenziamento-come-orientarsi/"
    ],
    "confidence": "low-medium. Use '1-2 months mid, 2-4 months senior' as a range, not a precise figure."
  },
  {
    "country": "Poland",
    "statutory": "Same both ways (Labour Code art. 36): 2 weeks (<6 months' service), 1 month (6 months-3 years), 3 months (3+ years).",
    "practice": "Follows the statute. Seniors with 3+ years in post are therefore usually 3 months.",
    "sources": [
      "https://apps.eurofound.europa.eu/legislationdb/notice-period-to-employees/poland",
      "https://support.remote.com/hc/en-us/articles/5831900985613"
    ],
    "confidence": "high. Note it depends on tenure at the CURRENT employer, not on seniority."
  },
  {
    "country": "Sweden",
    "statutory": "Employee: 1 month (LAS). Employer: 1-6 months by tenure.",
    "practice": "1 month baseline. Collective agreements or contracts often set 1-3 months (ST union guide). Seniors are often 3 months+ by contract.",
    "sources": [
      "https://apps.eurofound.europa.eu/legislationdb/notice-period-to-employees/sweden",
      "https://www.st.org/rad-och-stod/egen-uppsagning",
      "https://support.remote.com/hc/en-us/articles/5831900985613"
    ],
    "confidence": "statutory high. Practice medium."
  },
  {
    "country": "Finland",
    "statutory": "Employee: 14 days (up to 5 years' service), 1 month (over 5 years) (Employment Contracts Act). The contract may set up to 6 months. Employer: 14 days to 6 months by tenure.",
    "practice": "Statutory or 1 month for most. Longer for seniors by contract. No survey found.",
    "sources": [
      "https://apps.eurofound.europa.eu/legislationdb/notice-period-to-employees/finland",
      "https://globallawexperts.com/notice-period-in-finland/"
    ],
    "confidence": "statutory medium-high. Practice low."
  },
  {
    "country": "Ireland",
    "statutory": "Employee: 1 week (after 13 weeks' service) (Minimum Notice and Terms of Employment Acts). Employer: 1-8 weeks by tenure.",
    "practice": "1 month common for professionals. 3 months for senior. No survey found.",
    "sources": [
      "https://www.citizensinformation.ie/en/employment/unemployment-and-redundancy/dismissal/minimum-notice-and-terms-of-employment/",
      "https://support.remote.com/hc/en-us/articles/5831900985613"
    ],
    "confidence": "statutory high. Practice low (convention)."
  },
  {
    "country": "Portugal",
    "statutory": "Employee resigning (Código do Trabalho art. 400): 30 days (≤2 years' service), 60 days (>2 years). Senior management or director roles: up to 6 months if set in the contract or CBA.",
    "practice": "30-60 days for most. Up to 6 months for directors where contracted.",
    "sources": [
      "https://www.fedfinance.pt/en/news/employment-contract-termination-letter-how-to-resign-without-costly-mistakes",
      "https://leglobal.law/countries/portugal/employment-law/employment-law-overview-portugal/02-employment-contracts/"
    ],
    "confidence": "medium-high. Beware EOR pages showing a 15/30/60/75-day ladder; that is employer-side, not resignation."
  },
  {
    "country": "US",
    "statutory": "None (at-will employment).",
    "practice": "2 weeks is the customary courtesy. Execs sometimes 30-90 days by contract.",
    "sources": ["https://support.remote.com/hc/en-us/articles/5831900985613"],
    "confidence": "statutory high. '2 weeks' is a universal convention, but I found no survey to cite for it."
  }
]
```

---

## 4. Offer acceptance and drop-off (things that lengthen the timeline)

```json
[
  {
    "figure": "82% of candidates reaching offer accept (highest since 2021); 0.5% of applicants get an offer (~1 hire per 200 applications); interviews per hire +33% since 2021",
    "source": "Gem, 2026 Recruiting Benchmarks",
    "url": "https://app.gem.com/blog/key-takeaways-from-the-2026-recruiting-benchmarks-report",
    "year": "Data Jun 2021 - May 2025, 165M applicants, 1.2M hires",
    "confidence": "high"
  },
  {
    "figure": "84% offer acceptance (2024), up from 81% (2021); 20 interviews per hire (2024) vs 14 (2021)",
    "source": "Gem, 2025 Recruiting Benchmarks",
    "url": "https://vercel.gem.com/blog/10-takeaways-from-the-2025-recruiting-benchmarks-report",
    "year": "2025 report",
    "confidence": "high"
  },
  {
    "figure": "Startup offer acceptance ~80%; remote vs in-office: technical 79% vs 70%, business 83% vs 80%; 2024 all-company 81%",
    "source": "Ashby, State of Startup Hiring 2026",
    "url": "https://www.ashbyhq.com/talent-trends-report/reports/startup-hiring",
    "year": "2026 (2025 data)",
    "confidence": "high. Useful: an office-based technical role means roughly a 1 in 3 chance the first offer fails."
  },
  {
    "figure": "Referral offer acceptance 89% (business) / 84% (tech); sourced tech candidates 76%",
    "source": "Ashby, Recruiting Operations Benchmarks 2026",
    "url": "https://www.ashbyhq.com/talent-trends-report/reports/recruiting-operations-benchmarks-talent-trends",
    "year": "2026",
    "confidence": "high"
  },
  {
    "figure": "31% of professionals who received a counteroffer accepted it",
    "source": "Selby Jennings, Europe Financial Services Talent Report 2026",
    "url": "https://www.selbyjennings.com/insights/europe-financial-services-talent-report-2026/career-motivations",
    "year": "2026",
    "confidence": "medium. Europe-based, but a finance-sector sample."
  },
  {
    "figure": "50% of candidates who accepted an offer May 2022-May 2023 later reneged and started elsewhere",
    "source": "SHRM (reporting a survey)",
    "url": "https://www.shrm.org/topics-tools/news/talent-acquisition/survey-finds-half-candidates-accepted-job-offer-reneging",
    "year": "2023",
    "confidence": "low-medium. US, a hot-market period, and survey wording matters. Do not headline it."
  }
]
```

---

## Suggested calculator model (derived, not a single source)

`start date = process time (by seniority, tech vs business) + notice (country x seniority) + optional quarter-end rounding (DE) + offer-fail risk buffer`

- **Process time (company-run, open -> hire):** junior 52d, mid 63d, senior 71d (Ashby 2026). Add about 10-15% for technical roles (Ashby: tech 75 vs business 60). Head/Director: about 80-90d, extrapolated and **flagged as an estimate**.
- **Small company, no recruiter:** Ashby startups show 62d vs 42d with a recruiter.
- **Notice:** use the practice column above. Germany: round up to the quarter-end for senior roles.
- **Offer-fail risk:** about 18-20% of offers are declined (Gem 82%, Ashby ~80%). A decline typically sends the process back to the runner-up or to re-sourcing. Show it as a "+ risk" band rather than a fixed figure.
