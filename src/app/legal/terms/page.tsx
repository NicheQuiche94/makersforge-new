import type { Metadata } from "next";
import styles from "../legal.module.css";

/**
 * /legal/terms: MakersForge website terms of use.
 *
 * Rewritten 2026-11-25 for the current business (Andre): direct-to-candidate
 * recruitment for mobile game studios and app companies. Searches are governed
 * by the client terms of business (lib/termsOfBusiness.ts); these terms cover
 * the website, the client portal, the free resources and tools, and the talent
 * directory. House style: plain sentences, no unnecessary punctuation.
 */

export const metadata: Metadata = {
  title: "Terms · MakersForge",
  description:
    "Terms of use for the MakersForge website, client portal, free resources and talent directory.",
};

export default function TermsPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        {/* HERO */}
        <header className={styles.hero}>
          <h1 className={styles.h1}>
            <span className={styles.gr}>Terms.</span>
          </h1>
          <div className={styles.meta}>
            <span className={styles.metaItem}>
              <span className={styles.metaLabel}>Last updated</span>
              <span className={styles.metaValue}>25 November 2026</span>
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
          <Section num="01" title="Who we are">
            <p className={styles.p}>
              MakersForge is run by MakersForge Ltd, a company registered in
              England and Wales and part of Seedcraft Ventures. When these terms
              say MakersForge, we, us or our, they mean MakersForge Ltd.
            </p>
            <p className={styles.p}>
              You can reach us any time at{" "}
              <a href="mailto:andre@makersforge.gg">andre@makersforge.gg</a>.
            </p>
          </Section>

          <Section num="02" title="What MakersForge is">
            <p className={styles.p}>
              MakersForge is a direct-to-candidate recruitment business for
              mobile game studios and app companies. We find the right people
              for a role and engage them directly, including people who are
              not looking for a new job and would never see a job ad.
            </p>
            <p className={styles.p}>
              Companies book a search through our website and agree our terms
              of business when they do. Those terms cover fees, timings and
              everything else about a search, and they take priority over
              these terms for that work.
            </p>
            <p className={styles.p}>
              We also publish a talent directory of specialists who have chosen
              to share a public profile, along with free guides, reports and
              tools. The free resources are general guidance to help you hire
              and are not professional advice.
            </p>
            <p className={styles.p}>
              The website and everything on it are provided as is and may
              change as the business grows.
            </p>
          </Section>

          <Section num="03" title="Using the website">
            <ul className={styles.ul}>
              <li>
                <strong>Age.</strong> You must be at least 18 to book a search or use the client portal.
              </li>
              <li>
                <strong>Accuracy.</strong> Anything you tell us when you book a search, brief us or request an interview must be honest and reflect the role you actually intend to hire.
              </li>
              <li>
                <strong>Your login.</strong> The client portal signs you in with a code sent to your email. Keep access to that inbox secure and tell us straight away if you think someone else has used your account.
              </li>
              <li>
                <strong>Closing your account.</strong> You can ask us to close your client account at any time by email. We delete personal data as set out in our Privacy Policy.
              </li>
            </ul>
          </Section>

          <Section num="04" title="Free resources and tools">
            <p className={styles.p}>
              Our guides, reports and free tools are general guidance to help
              you hire. They are not legal, financial or employment advice.
              Timelines, costs and scores from our tools are estimates based on
              the answers you give and the data we have, and your results may
              differ.
            </p>
            <p className={styles.p}>
              You are welcome to use our resources within your own company and
              to share links to them. Please do not resell them or republish
              them in full without our written permission.
            </p>
          </Section>

          <Section num="05" title="The talent directory">
            <p className={styles.p}>
              Everyone in the talent directory has chosen to share a profile
              with us. Profiles are shown without names, and we only share a
              specialist&apos;s identity with a company once the specialist has
              agreed to an introduction.
            </p>
            <ul className={styles.ul}>
              <li>
                <strong>We never take a cut of what specialists earn.</strong> Our fee is paid by the hiring company and is never deducted from a salary or day rate.
              </li>
              <li>
                <strong>We never sell profiles.</strong> We do not sell or license profile data to anyone.
              </li>
              <li>
                <strong>We never train AI on profiles.</strong> Profile content is not used to train AI models, ours or anyone else&apos;s.
              </li>
              <li>
                <strong>Specialists stay in control.</strong> A specialist can ask us to change or remove their profile at any time and we will do it promptly.
              </li>
            </ul>
            <p className={styles.p}>
              Profile details such as availability, location and rates are
              given to us by the specialist and can change. We check them as
              best we can but cannot guarantee them.
            </p>
          </Section>

          <Section num="06" title="Searches and hires">
            <p className={styles.p}>
              When you book a search with us, our terms of business apply to
              that search. They set out our fees and what we deliver and when. If
              they differ from these terms, the terms of business take
              priority for that work.
            </p>
            <p className={styles.p}>
              You hire and contract with the people you choose directly.
              MakersForge is not a party to that employment or contract.
            </p>
          </Section>

          <Section num="07" title="Fair use">
            <p className={styles.p}>By using the website you agree to the following.</p>
            <ul className={styles.ul}>
              <li>
                <strong>No going around us.</strong> If you find a specialist through MakersForge, the hire runs through MakersForge. You may not use the directory or anything we share to approach specialists directly to avoid our fee.
              </li>
              <li>
                <strong>No scraping.</strong> Do not copy profiles or any other content from the website by automated means.
              </li>
              <li>
                <strong>No misuse.</strong> Do not use the website for anything unlawful, harmful or abusive, and do not try to break or overload it.
              </li>
              <li>
                <strong>No impersonation.</strong> Do not pretend to be another person or company.
              </li>
              <li>
                <strong>Respect confidentiality.</strong> Treat any candidate information we share with you as confidential and use it only for the role it was shared for.
              </li>
            </ul>
            <p className={styles.p}>
              If these rules are broken we may remove access to the website or
              the client portal, without notice in serious cases.
            </p>
          </Section>

          <Section num="08" title="Our intellectual property">
            <p className={styles.p}>
              The MakersForge name, logo, design, code, guides, reports, tools
              and other content we create are owned by MakersForge Ltd and
              protected by copyright and other intellectual property laws.
            </p>
            <p className={styles.p}>
              You may not copy or adapt them without our written permission.
              Linking to MakersForge is always welcome.
            </p>
          </Section>

          <Section num="09" title="Availability">
            <p className={styles.p}>
              The website is provided as is and as available. We work hard to
              keep it accurate and running but cannot promise it will always be
              available or free of errors.
            </p>
          </Section>

          <Section num="10" title="Limitation of liability">
            <p className={styles.p}>
              To the fullest extent permitted by law, MakersForge Ltd is not
              liable for any indirect or consequential loss arising from your
              use of the website, including lost business, missed hires or
              reputational harm.
            </p>
            <p className={styles.p}>
              Our total liability for any claim relating to the website is
              limited to the greater of the fees you paid us in the 12 months
              before the claim arose or &pound;1,000. Liability for a search is
              set out in our terms of business.
            </p>
            <p className={styles.p}>
              Nothing in these terms limits our liability for fraud, for death
              or personal injury caused by our negligence, or for anything else
              that cannot be limited by law.
            </p>
          </Section>

          <Section num="11" title="Changes to these terms">
            <p className={styles.p}>
              We may update these terms as the business grows. If a change
              affects your rights, we will email clients with an active account
              before it takes effect. Every update shows a new last updated
              date at the top of this page.
            </p>
            <p className={styles.p}>
              Continuing to use the website after a change means you accept the
              updated terms.
            </p>
          </Section>

          <Section num="12" title="Governing law">
            <p className={styles.p}>
              These terms are governed by the laws of England and Wales, and
              the English courts have exclusive jurisdiction over any dispute.
              This does not affect any rights you have as a consumer under the
              laws of your own country.
            </p>
            <p className={styles.p}>
              If any part of these terms is found to be unenforceable, the rest
              still applies.
            </p>
          </Section>

          {/* CONTACT FOOTER */}
          <div className={styles.contactBlock}>
            <h2 className={styles.contactH}>Questions about these terms?</h2>
            <p className={styles.contactP}>
              We&apos;re a small team and we read every email. If anything in
              here is unclear, write to us before you book a search.
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
