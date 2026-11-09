import type { Metadata } from "next";
import styles from "../legal.module.css";

/**
 * /legal/privacy — MakersForge privacy policy.
 *
 * Adapted from the HiddenGem and Escapage privacy templates Andre
 * pointed at (his other Seedcraft products) and reframed for
 * MakersForge as a TALENT AGENCY representing growth specialists
 * for mobile apps & games studios.
 *
 * Key MakersForge-specific data points covered:
 *   - Talent profiles (anonymised on public lineup, revealed after a brief)
 *   - Studio briefs and matching workflow
 *   - Contract & engagement records
 *   - Payment routing (talent paid directly by studios; flat fee to us)
 *
 * Four non-negotiable commitments:
 *   1. No commission on talent pay
 *   2. Indefinite representation
 *   3. No selling profiles
 *   4. No silent changes
 *
 * Copy is a working draft for Andre to legal-review.
 */

export const metadata: Metadata = {
  title: "Privacy · MakersForge",
  description:
    "How MakersForge collects, uses, and protects personal data. Talent agency for growth, product, design, engineering and art specialists in mobile apps and games.",
};

export default function PrivacyPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        {/* HERO */}
        <header className={styles.hero}>
          <span className={`kicker ${styles.kicker}`}>Legal</span>
          <h1 className={styles.h1}>
            <span className={styles.gr}>privacy.</span>
          </h1>
          <div className={styles.meta}>
            <span className={styles.metaItem}>
              <span className={styles.metaLabel}>Last updated</span>
              <span className={styles.metaValue}>5 November 2026</span>
            </span>
            <span className={styles.metaItem}>
              <span className={styles.metaLabel}>Data controller</span>
              <span className={styles.metaValue}>
                <a href="mailto:andre@makersforge.gg">
                  andre@makersforge.gg
                </a>
              </span>
            </span>
          </div>
        </header>

        {/* BODY */}
        <div className={styles.body}>
          <Section num="01" title="who is the data controller">
            <p className={styles.p}>
              MakersForge Ltd, registered in England and Wales, is the
              legal entity responsible for personal data under UK and
              EU data protection law.
            </p>
            <p className={styles.p}>
              MakersForge Ltd is a Seedcraft Ventures company. References
              to &ldquo;MakersForge&rdquo;, &ldquo;we&rdquo;,
              &ldquo;us&rdquo;, or &ldquo;our&rdquo; throughout this
              policy refer to MakersForge Ltd.
            </p>
          </Section>

          <Section num="02" title="what we collect">
            <p className={styles.p}>
              We collect only what we need to represent specialists,
              match them to studio briefs, and operate the service.
            </p>

            <h3 className={styles.subH}>specialist account &amp; profile</h3>
            <p className={styles.p}>
              When a specialist applies to the lineup, we collect:
              full name, professional handle, email address, location,
              discipline, work history, channels and creative formats,
              indicative day-rate range, references, and the
              handwritten summary published on their profile.
              Profiles on the public lineup are{" "}
              <strong>anonymised</strong>; real identities are revealed
              to a studio only after a brief is confirmed.
            </p>

            <h3 className={styles.subH}>studio briefs</h3>
            <p className={styles.p}>
              When a studio briefs us, we capture: role shape, timeline,
              budget, monetisation, channels in scope, internal contact,
              and any related context they choose to share.
            </p>

            <h3 className={styles.subH}>engagement &amp; payment records</h3>
            <p className={styles.p}>
              For each engagement, we keep: matching notes, start and
              end dates, the flat monthly fee invoiced to the studio,
              and confirmation that the studio paid the specialist
              directly. We do not handle the specialist&apos;s pay; we
              only record that it happened.
            </p>

            <h3 className={styles.subH}>technical data</h3>
            <p className={styles.p}>
              Browser log data including IP address, browser type,
              pages visited, and timestamps, retained briefly for
              diagnostics and abuse detection.
            </p>

            <h3 className={styles.subH}>analytics (only if you accept)</h3>
            <p className={styles.p}>
              If you accept cookies, analytics tools record how the site
              is used, and use your IP address to identify the company
              you&apos;re browsing from (not you as a person), so we know
              which studios are interested. We may also record how pages
              are used (clicks, scrolling, where people drop off), with
              everything typed into forms and your chat messages hidden
              from the recording. See section 11.
            </p>

            <h3 className={styles.subH}>chat messages</h3>
            <p className={styles.p}>
              If you message Andre through the chat on the site, we keep
              your messages, any name and email you give, and the page you
              were on, so he can reply in the chat or by email. Your
              browser keeps a random code so the chat remembers your
              conversation; it doesn&apos;t track you anywhere else. Messages
              reach Andre through Telegram.
            </p>

            <h3 className={styles.subH}>links in our emails</h3>
            <p className={styles.p}>
              Links in emails we send you can carry a short code, so we know
              you opened the site from that email and which page you landed
              on. It&apos;s recorded on our side (nothing is stored on your
              device) and helps us follow up with something useful rather
              than chase you. If you accept cookies, the rest of that visit is
              linked to the code too.
            </p>

            <p className={styles.p}>
              <strong>What we don&apos;t collect:</strong> advertising
              cookies, device fingerprinting, tracking across other
              websites, or personal details we don&apos;t need to do our
              job.
            </p>
          </Section>

          <Section num="03" title="how we use it">
            <ul className={styles.ul}>
              <li>Represent specialists to studios who brief us</li>
              <li>Generate the matched shortlist that goes to a studio after a brief</li>
              <li>Operate the lineup, the filters, and deep-linked filter views</li>
              <li>Issue invoices and reconcile fees</li>
              <li>Fix bugs, prevent spam, and improve features</li>
              <li>Send essential account notices and security alerts</li>
              <li>Meet legal obligations</li>
            </ul>

            {/* COMMITMENT PULLOUT */}
            <div className={`heat-glow ${styles.commitment}`} style={{ background: "var(--bg-deep)" }}>
              <p className={styles.commitmentH}>the part we care most about</p>
              <blockquote className={styles.commitmentBlockquote}>
                &ldquo;talent is not a commodity.&rdquo;
              </blockquote>
              <ul className={styles.commitmentList}>
                <li>
                  <span>
                    <strong>no commission on talent pay.</strong>
                    Our fee is paid by the studio. We never take a cut
                    of what the specialist earns.
                  </span>
                </li>
                <li>
                  <span>
                    <strong>indefinite representation.</strong>
                    Once a specialist is on the lineup, they stay on the
                    lineup. Contract ends, we represent them into the
                    next one.
                  </span>
                </li>
                <li>
                  <span>
                    <strong>no selling profiles.</strong>
                    Profile data is never sold to brokers or external
                    parties.
                  </span>
                </li>
                <li>
                  <span>
                    <strong>no AI training.</strong>
                    Profile content is never used to train AI models,
                    ours or anyone else&apos;s.
                  </span>
                </li>
                <li>
                  <span>
                    <strong>no silent changes.</strong>
                    Material policy changes are announced before they
                    take effect with an opportunity to opt out.
                  </span>
                </li>
              </ul>
            </div>
          </Section>

          <Section num="04" title="our legal bases for processing">
            <ul className={styles.ul}>
              <li>
                <strong>Contract.</strong> Running the lineup,
                representing specialists, delivering matches to studios.
              </li>
              <li>
                <strong>Legitimate interests.</strong> Logging, spam
                prevention, security monitoring. Minimised collection.
              </li>
              <li>
                <strong>Consent.</strong> Optional features, including
                analytics and company-level visitor identification, only
                with your agreement. Withdrawable at any time.
              </li>
              <li>
                <strong>Legal obligation.</strong> Responding to lawful
                requests, financial record keeping, tax compliance.
              </li>
            </ul>
          </Section>

          <Section num="05" title="who we share it with">
            <p className={styles.p}>
              Personal data is shared only with infrastructure providers
              under data processing agreements, plus the specific studio
              involved in a confirmed brief.
            </p>
            <ul className={styles.ul}>
              <li>
                <strong>Supabase.</strong> Database and storage. EU-hosted.
              </li>
              <li>
                <strong>Vercel.</strong> Website hosting and request logging.
              </li>
              <li>
                <strong>Resend.</strong> Transactional email delivery for application acknowledgements and account notices.
              </li>
              <li>
                <strong>Telegram.</strong> Delivers chat messages from the site to Andre so he can reply.
              </li>
              <li>
                <strong>Analytics and advertising providers (Google Analytics, PostHog, Apollo, LinkedIn).</strong> Site usage statistics, page recordings with form entries hidden, identifying the companies visiting the site from IP address, and measuring our LinkedIn ads. Only if you accept cookies. PostHog stores its data in the EU.
              </li>
              <li>
                <strong>Studios with confirmed briefs.</strong> When a studio briefs us and a shortlist is generated, the matched specialists&apos; real identities and detailed profiles are shared with that studio for the purpose of interview and engagement.
              </li>
            </ul>
            <p className={styles.p}>
              Disclosure to anyone else occurs only when legally required.
              We push back where lawful and notify the person affected
              where permitted.
            </p>
          </Section>

          <Section num="06" title="international data transfers">
            <p className={styles.p}>
              Data is stored on EU servers via Supabase. For users
              outside the UK or EEA, data may be processed by vendors in
              other jurisdictions including the US. Protection is
              maintained through Standard Contractual Clauses and the UK
              International Data Transfer Addendum.
            </p>
          </Section>

          <Section num="07" title="how long we keep things">
            <p className={styles.p}>
              <strong>Active specialist accounts:</strong> data retained
              for as long as the specialist remains on the lineup.
            </p>
            <p className={styles.p}>
              <strong>Closed accounts:</strong> personal data deleted
              within 30 days, except encrypted backups (up to 60 days)
              and anonymised analytics (indefinitely).
            </p>
            <p className={styles.p}>
              <strong>Engagement and financial records:</strong> kept
              for as long as UK tax law requires (currently six years).
            </p>
            <p className={styles.p}>
              Technical logs rotate automatically within 30 days.
            </p>
          </Section>

          <Section num="08" title="how we protect it">
            <p className={styles.p}>
              Security measures include TLS encryption in transit,
              field-level encryption at rest for sensitive fields,
              hashed passwords, access controls, and audit logging.
              Breaches trigger notification to authorities within 72
              hours and direct notification to affected users when
              significant risk exists.
            </p>
          </Section>

          <Section num="09" title="your rights">
            <p className={styles.p}>
              Depending on where you live, you have a set of rights over
              the personal data we hold. We honour these globally where
              we reasonably can.
            </p>
            <ul className={styles.ul}>
              <li>
                <strong>Access.</strong> See the personal data we hold about you.
              </li>
              <li>
                <strong>Rectification.</strong> Correct anything that&apos;s wrong or out of date.
              </li>
              <li>
                <strong>Erasure.</strong> Delete your account and the data we hold.
              </li>
              <li>
                <strong>Restriction.</strong> Pause processing while a dispute is sorted out.
              </li>
              <li>
                <strong>Portability.</strong> Receive your data in a machine-readable format.
              </li>
              <li>
                <strong>Object.</strong> Challenge processing based on our legitimate interests.
              </li>
              <li>
                <strong>Withdraw consent.</strong> Pull back any consent at any time.
              </li>
              <li>
                <strong>Complain.</strong> Lodge a complaint with your local data protection authority.
              </li>
            </ul>
            <p className={styles.p}>
              Requests to{" "}
              <a href="mailto:andre@makersforge.gg">
                andre@makersforge.gg
              </a>{" "}
              receive responses within 30 days at no cost.
            </p>
            <h3 className={styles.subH}>complaint authorities</h3>
            <ul className={styles.ul}>
              <li>
                <strong>UK:</strong> Information Commissioner&apos;s Office (
                <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">
                  ico.org.uk
                </a>
                )
              </li>
              <li>
                <strong>EEA:</strong> Your local data protection authority
              </li>
              <li>
                <strong>California:</strong> CCPA / CPRA rights apply. We won&apos;t discriminate for exercising them.
              </li>
            </ul>
          </Section>

          <Section num="10" title="minors">
            <p className={styles.p}>
              MakersForge is not intended for users under 18. Both
              specialists and studio contacts must be of age. If a child
              account is reported to us, we will close it and contact a
              parent or guardian as appropriate.
            </p>
          </Section>

          <Section num="11" title="cookies and similar things" id="cookies">
            <p className={styles.p}>
              Essential storage keeps sign-in, your preferences and your
              cookie choice working. It doesn&apos;t need your consent.
            </p>
            <p className={styles.p}>With your consent only, we also use:</p>
            <ul className={styles.ul}>
              <li>
                <strong>Analytics cookies</strong>, to see how the site is
                used: pages visited, rough location and device type.
              </li>
              <li>
                <strong>Page recordings</strong>, to see where the site is
                confusing: clicks, scrolling and where people leave.
                Anything you type into a form and your chat messages are
                hidden, and nothing is recorded in the client portal.
              </li>
              <li>
                <strong>Company identification</strong>, which uses your
                IP address to identify the company you&apos;re browsing
                from, not you as a person, so we can see which studios
                are interested.
              </li>
              <li>
                <strong>LinkedIn ads measurement</strong> (the LinkedIn
                Insight Tag), to see whether our LinkedIn ads lead to visits
                and enquiries, to show our ads again to people who visited,
                and to give us anonymous totals of visitors&apos; job titles
                and company sizes. LinkedIn may link this to your LinkedIn
                account under its own privacy policy.
              </li>
            </ul>
            <p className={styles.p}>
              None of these load until you click Accept on the cookie banner,
              and you can change your mind at any time from &ldquo;cookie
              settings&rdquo; in the footer. We don&apos;t use advertising
              cookies or device fingerprinting.
            </p>
            <p className={styles.p}>
              We also count visits with Vercel Web Analytics, which uses no
              cookies and doesn&apos;t identify you; it only gives us totals
              like page views and where visitors came from.
            </p>
            <p className={styles.p}>
              We also keep our own simple count of visits that uses no
              cookies and stores nothing on your device: the page, how you
              arrived (such as the site or link you came from), your
              approximate country and city, the type of device, and how long
              you stayed. We don&apos;t store your IP address or anything that
              identifies you.
            </p>
            <p className={styles.p}>
              If you give us your email to receive a free tool&apos;s result, we
              remember it in your browser so you don&apos;t have to enter it
              again. Click &ldquo;Not you?&rdquo; to clear it. While it&apos;s
              remembered, our visit count above is linked to it.
            </p>
          </Section>

          <Section num="12" title="changes to this policy">
            <p className={styles.p}>
              Material changes are communicated by email or in-app
              before taking effect. Acquisition or restructuring of
              MakersForge Ltd triggers advance notice with the
              opportunity to close your account first.
            </p>
          </Section>

          <Section num="13" title="governing law">
            <p className={styles.p}>
              Governed by the laws of England and Wales. Disputes are
              subject to the exclusive jurisdiction of the English
              courts, without prejudice to consumer rights in your own
              jurisdiction.
            </p>
          </Section>

          {/* CONTACT FOOTER */}
          <div className={styles.contactBlock}>
            <h2 className={styles.contactH}>questions?</h2>
            <p className={styles.contactP}>
              We&apos;re a small team and we actually read our inbox. If
              anything in here is unclear, write to us before applying
              to the lineup or briefing us on a hire.
            </p>
            <a href="mailto:andre@makersforge.gg" className={styles.contactEmail}>
              andre@makersforge.gg
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({
  num,
  title,
  id,
  children,
}: {
  num: string;
  title: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={`reveal ${styles.section}`}>
      <span className={styles.sectionNum}>{num}</span>
      <h2 className={styles.sectionH}>{title}</h2>
      {children}
    </section>
  );
}
