# LinkedIn ads: free tools head to head (DRAFT, 2026-11-09)

Two single-image ads in one campaign, same audience and budget, so they compete on cost per lead. Europe first. Both land on a free tool with the email gate, and each URL is tagged so PostHog and the LinkedIn conversion show which one brought the lead.

## Ad A: Will your job ad hire in time? → /hire-timeline

- **URL:** `https://www.makersforge.gg/hire-timeline?utm_source=linkedin&utm_campaign=tools-nov&utm_content=timeline`
- **Intro text:**
  Hiring a senior role in Germany with a job ad? The median job ad takes about 10 weeks to get to a hire. Then they work 3 months' notice.
  If you need them by spring, the search starts now. See your likely start date, free:
- **Headline:** Will your job ad hire in time?
- **Image text:** Job ad + notice period = later than you think.
- **CTA button:** Learn more
- **Variant intro for the UK:** Hiring a Senior or Lead with a job ad? Allow about 10 weeks to hire, then a month's notice. Check your likely start date, free:

## Ad B: Every way to hire, compared → /compare

- **URL:** `https://www.makersforge.gg/compare?utm_source=linkedin&utm_campaign=tools-nov&utm_content=compare`
- **Intro text:**
  An agency at 20–25% of salary, a job ad you run yourself, or a flat fee? See every way to hire your role side by side: cost, weeks to hire and who you actually reach.
  Honest, including when we're not the best option. Free:
- **Headline:** Every way to hire your role, compared
- **Image text:** Agency, job ad or flat fee: which is cheapest for your role?
- **CTA button:** Learn more

## Notes

- Figures in Ad A come from Ashby 2026 (median 71 days to hire at senior level) and German notice-period practice; see docs/hire-timeline-benchmarks.md.
- Conversion: "compare_requested" already fires; the timeline tool fires "timeline_requested" once it emails (add the LinkedIn conversion ID when created).
