import type { Metadata } from "next";
import styles from "../legal.module.css";

/**
 * /legal/terms — MakersForge terms of use.
 *
 * Adapted from the HiddenGem and Escapage terms templates Andre
 * pointed at (his other Seedcraft products) and reframed for
 * MakersForge as a TALENT AGENCY representing senior growth
 * specialists for mobile apps and games studios.
 *
 * Two audiences are covered:
 *   - Specialists on the lineup (the talent we represent)
 *   - Studios briefing us for hires
 *
 * Five non-negotiable commitments to talent:
 *   1. No commission on talent pay
 *   2. Indefinite representation
 *   3. No selling profiles
 *   4. No AI training on profile content
 *   5. No silent changes
 *
 * Copy is a working draft for Andre to legal-review.
 */

export const metadata: Metadata = {
  title: "Terms — MakersForge",
  description:
    "Terms of use for MakersForge. Talent agency for growth specialists in mobile apps and games.",
};

export default function TermsPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        {/* HERO */}
        <header className={styles.hero}>
          <span className={`kicker ${styles.kicker}`}>Legal</span>
          <h1 className={styles.h1}>
            <span className={styles.gr}>terms.</span>
          </h1>
          <div className={styles.meta}>
            <span className={styles.metaItem}>
              <span className={styles.metaLabel}>Last updated</span>
              <span className={styles.metaValue}>30 May 2026</span>
            </span>
            <span className={styles.metaItem}>
              <span className={styles.metaLabel}>Contact</span>
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
          <Section num="01" title="who we are">
            <p className={styles.p}>
              MakersForge is operated by MakersForge Ltd, a company
              registered in England and Wales. References to
              &ldquo;MakersForge&rdquo;, &ldquo;we&rdquo;,
              &ldquo;us&rdquo;, or &ldquo;our&rdquo; throughout these
              terms refer to MakersForge Ltd.
            </p>
            <h3 className={styles.subH}>operated by</h3>
            <p className={styles.p}>
              MakersForge Ltd, registered in England and Wales. Trading
              as <strong>MakersForge</strong>. A Seedcraft Ventures
              company. Contact:{" "}
              <a href="mailto:andre@makersforge.gg">
                andre@makersforge.gg
              </a>
              .
            </p>
          </Section>

          <Section num="02" title="what makersforge is">
            <p className={styles.p}>
              MakersForge is a talent agency. We represent senior
              growth specialists, UA managers and marketing artists,
              working in mobile apps and games. When a studio briefs us
              on a hire, we put the specialists we already represent
              forward.
            </p>
            <p className={styles.p}>
              MakersForge is built around a core commitment:{" "}
              <strong>talent is not a commodity</strong>. We never take
              a cut of what specialists earn, we don&apos;t sell access
              to profiles, and once a specialist is on the lineup, we
              represent them indefinitely. See §05 for the full set.
            </p>
            <p className={styles.p}>
              The MakersForge website and lineup are provided as-is and
              may change as the business evolves.
            </p>
          </Section>

          <Section num="03" title="your account">
            <ul className={styles.ul}>
              <li>
                <strong>Age.</strong> You must be at least 18 to apply to the lineup or to brief us as a studio.
              </li>
              <li>
                <strong>Accuracy.</strong> Information you give us when applying or briefing must be honest. Work history, channels, monetisation experience and rates must be truthful.
              </li>
              <li>
                <strong>Security.</strong> You&apos;re responsible for keeping your credentials secure. If you think your account has been compromised, tell us immediately.
              </li>
              <li>
                <strong>One person, one specialist account.</strong> Specialist accounts are personal. You can&apos;t sell, transfer, or share them.
              </li>
              <li>
                <strong>Closing your account.</strong> You can close your account at any time by emailing us. We delete personal data within 30 days, subject to the exceptions in the Privacy Policy.
              </li>
            </ul>
          </Section>

          <Section num="04" title="your profile, your work">
            <p className={styles.p}>
              Specialist profile content is yours. You retain full
              ownership of your work history, portfolio assets, written
              summary, and anything else you submit to the lineup.
            </p>
            <p className={styles.p}>
              By submitting profile content to MakersForge, you grant us
              a limited, non-exclusive, royalty-free licence to store
              that content, display it on the anonymised public lineup,
              and share the full identified version with studios that
              brief us once a brief is confirmed. This licence ends when
              you remove the content or close your account.
            </p>
            <p className={styles.p}>
              When you reference work from a previous employer or
              client (NDA permitting), you&apos;re responsible for
              ensuring you have the right to do so. MakersForge
              represents honest work history, not breaches of
              agreements you signed.
            </p>
          </Section>

          <Section num="05" title="our commitment to talent">
            <div className={`heat-glow ${styles.commitment}`} style={{ background: "var(--bg-deep)" }}>
              <p className={styles.commitmentH}>core commitment</p>
              <blockquote className={styles.commitmentBlockquote}>
                talent is not a commodity.
              </blockquote>
              <ul className={styles.commitmentList}>
                <li>
                  <span>
                    <strong>no commission on talent pay.</strong>
                    Our fee is paid by the studio at a flat monthly
                    rate. We never take a cut of what a specialist
                    earns, neither markup on day rate nor percentage of
                    salary on a permanent placement.
                  </span>
                </li>
                <li>
                  <span>
                    <strong>indefinite representation.</strong>
                    Once a specialist is on the lineup, they stay on the
                    lineup. A contract ends, we work the next one. The
                    relationship is permanent unless the specialist
                    asks to close their account.
                  </span>
                </li>
                <li>
                  <span>
                    <strong>no selling profiles.</strong>
                    We do not sell, license, or transfer profile data
                    to brokers or anyone else outside the platform.
                  </span>
                </li>
                <li>
                  <span>
                    <strong>no AI training.</strong>
                    We do not use specialist profile content to train
                    AI models, ours or anyone else&apos;s.
                  </span>
                </li>
                <li>
                  <span>
                    <strong>no silent changes.</strong>
                    If any of the above ever needs to change, we tell
                    affected specialists first, clearly, with time to
                    leave if they disagree.
                  </span>
                </li>
              </ul>
            </div>
          </Section>

          <Section num="06" title="how engagements work">
            <p className={styles.p}>
              When a studio briefs us, we put forward a shortlist of
              specialists from the lineup who fit the brief. If an
              engagement proceeds:
            </p>
            <ul className={styles.ul}>
              <li>
                <strong>Contract.</strong> The studio contracts with the specialist directly. MakersForge is not a party to that contract.
              </li>
              <li>
                <strong>Payment.</strong> The studio pays the specialist directly. MakersForge invoices the studio separately for our flat monthly fee.
              </li>
              <li>
                <strong>Permanent placements.</strong> For permanent hires, the placement fee is flat and does not scale with salary. The fee is invoiced once at the start of the engagement.
              </li>
              <li>
                <strong>Replacement matching.</strong> If a fit doesn&apos;t work out within an agreed window, we will rematch from the lineup at no additional fee.
              </li>
              <li>
                <strong>Stopping the engagement.</strong> Either side can end the engagement on the notice period specified in the studio-specialist contract.
              </li>
            </ul>
          </Section>

          <Section num="07" title="conduct standards">
            <p className={styles.p}>
              By being on the lineup or briefing us as a studio you
              agree to:
            </p>
            <ul className={styles.ul}>
              <li>
                <strong>Be honest.</strong> Specialists: the work you claim is the work you did. Studios: the brief you give us is the role you actually intend to hire.
              </li>
              <li>
                <strong>Be human.</strong> No bots, automated scraping, or AI-generated profile content presented as your own work.
              </li>
              <li>
                <strong>Be professional.</strong> Conduct yourself the way you would in any workplace, both in interviews and across the engagement.
              </li>
              <li>
                <strong>Respect NDAs.</strong> Don&apos;t post anything you&apos;ve signed paperwork about not posting. We can&apos;t police every NDA but we act on credible reports.
              </li>
              <li>
                <strong>No off-platform circumvention.</strong> If a match is made through MakersForge, the engagement runs through MakersForge. Studios may not use the lineup to identify and approach specialists directly to avoid our fee.
              </li>
            </ul>
          </Section>

          <Section num="08" title="what's not allowed">
            <ul className={styles.ul}>
              <li>
                <strong>Illegal content.</strong> Anything that violates UK law or the laws of your jurisdiction.
              </li>
              <li>
                <strong>Hateful content.</strong> Content promoting hatred or discrimination based on race, ethnicity, religion, gender, sexual orientation, disability, or any other protected characteristic.
              </li>
              <li>
                <strong>Harassment.</strong> Targeted abuse, threats, or intimidation of any user, specialist, or studio contact.
              </li>
              <li>
                <strong>Fraudulent credits.</strong> Claiming work you didn&apos;t do, employers you didn&apos;t work for, channels you don&apos;t actually run, or skills you don&apos;t have.
              </li>
              <li>
                <strong>Scraping.</strong> Automated extraction of profile data or any other content from the platform.
              </li>
              <li>
                <strong>Impersonation.</strong> Claiming to be another person or organisation.
              </li>
            </ul>
            <p className={styles.p}>
              Violations may result in content removal, account
              suspension, or permanent termination, without notice in
              serious cases.
            </p>
          </Section>

          <Section num="09" title="our intellectual property">
            <p className={styles.p}>
              The MakersForge name, logo, design, code, and any
              original content we create are owned by MakersForge Ltd
              and protected by copyright and other intellectual property
              laws.
            </p>
            <p className={styles.p}>
              You may not copy, reproduce, or create derivative works
              from MakersForge&apos;s design or interface without our
              written permission. Linking to MakersForge is fine and
              encouraged.
            </p>
          </Section>

          <Section num="10" title="availability and warranties">
            <p className={styles.p}>
              MakersForge is provided &ldquo;as is&rdquo; and &ldquo;as
              available&rdquo;. We don&apos;t make any warranties about
              reliability, accuracy, or availability. We&apos;ll do our
              best to keep things running, but we can&apos;t guarantee
              uninterrupted access or that every brief results in a
              match.
            </p>
            <p className={styles.p}>
              If we ever shut down MakersForge entirely, we&apos;ll
              give at least 30 days&apos; notice and offer specialists a
              way to export their profile data.
            </p>
          </Section>

          <Section num="11" title="limitation of liability">
            <p className={styles.p}>
              To the fullest extent permitted by law, MakersForge Ltd
              shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages arising from your use
              of MakersForge. This includes, but is not limited to,
              missed hiring opportunities, business losses, or
              reputational harm.
            </p>
            <p className={styles.p}>
              Our total liability for any claim shall not exceed the
              greater of the fees paid to us in the 12 months prior to
              the event giving rise to the claim, or &pound;1,000.
            </p>
            <p className={styles.p}>
              Nothing in these terms excludes or limits our liability
              for fraud, death or personal injury caused by our
              negligence, or any other liability that cannot be
              excluded under applicable law.
            </p>
          </Section>

          <Section num="12" title="termination">
            <p className={styles.p}>
              Specialists can close their lineup account at any time
              with no explanation needed. Studios can stop briefing us
              at any time.
            </p>
            <p className={styles.p}>
              We may suspend or terminate access if these terms are
              violated. In serious cases (fraudulent credits,
              harassment, scraping, off-platform circumvention) we may
              act without warning. In less serious cases we&apos;ll
              contact you first.
            </p>
            <p className={styles.p}>
              If your account is terminated due to a violation, you may
              not re-apply or rebrief us without our explicit
              permission.
            </p>
          </Section>

          <Section num="13" title="changes to these terms">
            <p className={styles.p}>
              When we make material changes (anything that affects your
              rights or obligations) we&apos;ll notify active
              specialists and studios by email before the change takes
              effect. Minor updates will show a new &ldquo;last
              updated&rdquo; date.
            </p>
            <p className={styles.p}>
              Continuing to use MakersForge after a change takes effect
              means you accept the updated terms. If you disagree you
              can close your account before they apply.
            </p>
          </Section>

          <Section num="14" title="governing law">
            <p className={styles.p}>
              These terms are governed by the laws of England and Wales.
              Any disputes shall be subject to the exclusive
              jurisdiction of the English courts, without prejudice to
              your rights as a consumer under the laws of your own
              country.
            </p>
            <p className={styles.p}>
              If any provision of these terms is found to be
              unenforceable, the remaining provisions continue in full
              force.
            </p>
          </Section>

          {/* CONTACT FOOTER */}
          <div className={styles.contactBlock}>
            <h2 className={styles.contactH}>questions about these terms?</h2>
            <p className={styles.contactP}>
              We&apos;re a small team and we actually read our inbox.
              If anything in here is unclear, write to us before
              applying or briefing.
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
  children,
}: {
  num: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`reveal ${styles.section}`}>
      <span className={styles.sectionNum}>{num}</span>
      <h2 className={styles.sectionH}>{title}</h2>
      {children}
    </section>
  );
}
