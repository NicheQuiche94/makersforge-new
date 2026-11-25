import type { Metadata } from "next";
import styles from "../legal.module.css";

/**
 * /legal/privacy: MakersForge privacy policy.
 *
 * Rewritten 2026-11-25 for the current business (Andre): direct-to-candidate
 * recruitment for mobile game studios and app companies. Covers clients,
 * candidates we approach, the talent directory, free resources and tools,
 * chat, analytics and cookies. House style: plain sentences, no unnecessary
 * punctuation.
 */

export const metadata: Metadata = {
  title: "Privacy · MakersForge",
  description:
    "How MakersForge collects, uses and protects personal data.",
};

export default function PrivacyPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        {/* HERO */}
        <header className={styles.hero}>
          <h1 className={styles.h1}>
            <span className={styles.gr}>Privacy.</span>
          </h1>
          <div className={styles.meta}>
            <span className={styles.metaItem}>
              <span className={styles.metaLabel}>Last updated</span>
              <span className={styles.metaValue}>25 November 2026</span>
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
          <Section num="01" title="Who is the data controller">
            <p className={styles.p}>
              MakersForge Ltd is responsible for the personal data described
              in this policy under UK and EU data protection law. We are a
              company registered in England and Wales and part of Seedcraft
              Ventures. When this policy says MakersForge, we, us or our, it
              means MakersForge Ltd.
            </p>
          </Section>

          <Section num="02" title="What we collect">
            <p className={styles.p}>
              MakersForge is a direct-to-candidate recruitment business for
              mobile game studios and app companies. We only collect what we
              need to run searches for our clients and to run this website.
            </p>

            <h3 className={styles.subH}>Clients</h3>
            <p className={styles.p}>
              When a company books a search or signs in to the client portal,
              we keep the contact&apos;s name, work email, job title and
              company, the details of the role, the plan chosen, the signed
              terms of business, the billing details we need to invoice and
              anything else you choose to tell us about the role.
            </p>

            <h3 className={styles.subH}>Candidates we approach</h3>
            <p className={styles.p}>
              To find people for a role we look at information professionals
              have made public about their careers, for example on LinkedIn
              and company websites. When we contact someone about a role we
              keep their name, contact details, current and past roles,
              skills, location and the notes from our conversations. We first
              get in touch through LinkedIn as MakersForge, about a specific
              role we are recruiting for on behalf of a client, so people know
              who we are and why we are contacting them. They can ask us to
              stop or to delete their details at any time.
            </p>
            <p className={styles.p}>
              We only share a candidate&apos;s details with a client once the
              candidate has agreed to be put forward for that role.
            </p>

            <h3 className={styles.subH}>The talent directory</h3>
            <p className={styles.p}>
              Specialists in the talent directory have chosen to share a
              profile with us. The public profile shows their role, skills,
              experience, location, availability and rates but not their
              name. We only share their identity with a company once they have
              agreed to an introduction.
            </p>

            <h3 className={styles.subH}>Free resources and tools</h3>
            <p className={styles.p}>
              If you enter your email to unlock our resources or use one of
              our free tools, we keep your email, when you signed up, the link
              that brought you and the answers you gave the tool. We use it to
              send you what you asked for, to email you new tools and guides
              when they release, and to follow up about your experience with
              the resources and your hiring. Every email has a one-click
              unsubscribe link.
            </p>

            <h3 className={styles.subH}>Chat messages</h3>
            <p className={styles.p}>
              If you message Andre through the chat on the site, we keep your
              messages, any name and email you give and the page you were on,
              so he can reply in the chat or by email. Your browser keeps a
              random code so the chat remembers your conversation. It does not
              track you anywhere else. Messages reach Andre through Telegram.
            </p>

            <h3 className={styles.subH}>Links in our emails</h3>
            <p className={styles.p}>
              Links in emails we send can carry a short code, so we know you
              opened the site from that email and which page you landed on.
              It is recorded on our side and nothing is stored on your device.
              If you accept cookies, the rest of that visit is linked to the
              code too.
            </p>

            <h3 className={styles.subH}>Analytics, only if you accept</h3>
            <p className={styles.p}>
              If you accept cookies, analytics tools record how the site is
              used and use your IP address to identify the company you are
              browsing from, not you as a person. We may also record how pages
              are used, such as clicks, scrolling and where people leave, with
              everything typed into forms and your chat messages hidden. See
              section 11 for the details.
            </p>

            <h3 className={styles.subH}>Technical data</h3>
            <p className={styles.p}>
              Our hosting keeps short-lived logs of requests to the site, such
              as IP address, browser type, pages visited and times, to fix
              problems and stop abuse.
            </p>

            <p className={styles.p}>
              We do not use advertising cookies or device fingerprinting, and
              we do not collect personal details we do not need.
            </p>
          </Section>

          <Section num="03" title="How we use it">
            <ul className={styles.ul}>
              <li>Run searches for our clients and put forward candidates who fit</li>
              <li>Talk to candidates about roles and arrange interviews</li>
              <li>Run the talent directory, the client portal and the free tools</li>
              <li>Send what you asked for, and the emails described in section 02</li>
              <li>Invoice clients and keep financial records</li>
              <li>Fix problems, prevent spam and improve the website</li>
              <li>Meet our legal obligations</li>
            </ul>
            <p className={styles.p}>
              We never sell personal data, and we never use profiles or
              candidate details to train AI models.
            </p>
          </Section>

          <Section num="04" title="Our legal bases for processing">
            <ul className={styles.ul}>
              <li>
                <strong>Contract.</strong> Running a search a client has booked, and the client portal.
              </li>
              <li>
                <strong>Legitimate interests.</strong> Approaching candidates about roles that fit their experience, following up with people who used our free resources or tools, and keeping the website secure. You can object at any time and we will stop.
              </li>
              <li>
                <strong>Consent.</strong> The talent directory, introductions to clients, and analytics and company identification on the website. You can withdraw consent at any time.
              </li>
              <li>
                <strong>Legal obligation.</strong> Financial records, tax and responding to lawful requests.
              </li>
            </ul>
          </Section>

          <Section num="05" title="Who we share it with">
            <p className={styles.p}>
              We share candidate details with a client only when the candidate
              has agreed. Otherwise personal data is only handled for us by
              these service providers under data processing agreements.
            </p>
            <ul className={styles.ul}>
              <li>
                <strong>Supabase.</strong> Our database. Hosted in the EU.
              </li>
              <li>
                <strong>Vercel.</strong> Website hosting and request logs.
              </li>
              <li>
                <strong>Resend.</strong> Sending the emails the website sends.
              </li>
              <li>
                <strong>Folk.</strong> Our contact management system for clients, leads and candidates, and how we send our emails to them.
              </li>
              <li>
                <strong>LinkedIn Recruiter.</strong> Finding candidates and messaging them about roles.
              </li>
              <li>
                <strong>Cal.com.</strong> Booking calls with Andre.
              </li>
              <li>
                <strong>Telegram.</strong> Delivering chat messages from the site to Andre.
              </li>
              <li>
                <strong>Google Analytics, PostHog, Apollo and LinkedIn.</strong> Website statistics, page recordings with form entries hidden, identifying the companies that visit, and measuring our LinkedIn ads. Only if you accept cookies. PostHog stores its data in the EU.
              </li>
            </ul>
            <p className={styles.p}>
              We only disclose data to anyone else when the law requires it,
              and we tell the person affected where we are allowed to.
            </p>
          </Section>

          <Section num="06" title="International data transfers">
            <p className={styles.p}>
              Our database is in the EU. Some of our service providers process
              data in other countries, including the US. Where they do, the
              transfer is protected by Standard Contractual Clauses and the UK
              International Data Transfer Addendum.
            </p>
          </Section>

          <Section num="07" title="How long we keep things">
            <ul className={styles.ul}>
              <li>
                <strong>Clients.</strong> For as long as you have an account with us, and financial records for six years as UK tax law requires.
              </li>
              <li>
                <strong>Candidates.</strong> For two years after we were last in touch, unless you ask us to delete your details sooner.
              </li>
              <li>
                <strong>The talent directory.</strong> Until the specialist asks us to remove their profile.
              </li>
              <li>
                <strong>Resource and tool sign-ups.</strong> For two years after you last heard from or engaged with us, or until you unsubscribe.
              </li>
              <li>
                <strong>Technical logs.</strong> Deleted automatically within 30 days.
              </li>
            </ul>
            <p className={styles.p}>
              If you unsubscribe or ask us not to contact you, we keep only
              your email on a do-not-contact list so we never email you again.
            </p>
          </Section>

          <Section num="08" title="How we protect it">
            <p className={styles.p}>
              Data is encrypted in transit and at rest by our providers.
              Access is limited to the people who need it, and the client
              portal signs you in with a one-time code sent to your email. If a
              breach puts your data at risk, we will tell the regulator within
              72 hours and tell you directly when the risk is significant.
            </p>
          </Section>

          <Section num="09" title="Your rights">
            <p className={styles.p}>
              Depending on where you live, you have rights over the personal
              data we hold. We honour them for everyone wherever we reasonably
              can.
            </p>
            <ul className={styles.ul}>
              <li>
                <strong>Access.</strong> See the personal data we hold about you.
              </li>
              <li>
                <strong>Correction.</strong> Fix anything that is wrong or out of date.
              </li>
              <li>
                <strong>Deletion.</strong> Ask us to delete your data.
              </li>
              <li>
                <strong>Restriction.</strong> Ask us to pause using your data while a concern is sorted out.
              </li>
              <li>
                <strong>Portability.</strong> Receive your data in a format you can reuse.
              </li>
              <li>
                <strong>Objection.</strong> Ask us to stop using your data where we rely on legitimate interests.
              </li>
              <li>
                <strong>Withdrawing consent.</strong> Change your mind about anything you agreed to.
              </li>
              <li>
                <strong>Complaints.</strong> Complain to your data protection authority.
              </li>
            </ul>
            <p className={styles.p}>
              Email{" "}
              <a href="mailto:andre@makersforge.gg">andre@makersforge.gg</a>{" "}
              and we will respond within 30 days at no cost.
            </p>
            <h3 className={styles.subH}>Complaint authorities</h3>
            <ul className={styles.ul}>
              <li>
                <strong>UK.</strong> The Information Commissioner&apos;s Office at{" "}
                <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">ico.org.uk</a>
              </li>
              <li>
                <strong>EEA.</strong> Your local data protection authority
              </li>
              <li>
                <strong>California.</strong> Your CCPA and CPRA rights apply and we will not treat you differently for using them
              </li>
            </ul>
          </Section>

          <Section num="10" title="Minors">
            <p className={styles.p}>
              MakersForge is for adults. We do not knowingly collect data from
              anyone under 18, and if we find we have, we will delete it.
            </p>
          </Section>

          <Section num="11" title="Cookies and similar things" id="cookies">
            <p className={styles.p}>
              Essential storage keeps sign-in, your preferences and your
              cookie choice working. It does not need your consent.
            </p>
            <p className={styles.p}>With your consent only, we also use the following.</p>
            <ul className={styles.ul}>
              <li>
                <strong>Analytics cookies</strong> to see how the site is
                used, such as pages visited, rough location and device type.
              </li>
              <li>
                <strong>Page recordings</strong> to see where the site is
                confusing, such as clicks, scrolling and where people leave.
                Anything you type into a form and your chat messages are
                hidden, and nothing is recorded in the client portal.
              </li>
              <li>
                <strong>Company identification</strong>, which uses your IP
                address to identify the company you are browsing from, not you
                as a person, so we can see which companies are interested.
              </li>
              <li>
                <strong>LinkedIn ads measurement</strong> through the LinkedIn
                Insight Tag, to see whether our LinkedIn ads lead to visits, to
                show our ads again to people who visited and to give us
                anonymous totals of visitors&apos; job titles and company
                sizes. LinkedIn may link this to your LinkedIn account under
                its own privacy policy.
              </li>
            </ul>
            <p className={styles.p}>
              None of these load until you click Accept on the cookie banner,
              and you can change your mind at any time from Cookie settings in
              the footer.
            </p>
            <p className={styles.p}>
              We also count visits with Vercel Web Analytics, which uses no
              cookies and does not identify you. It only gives us totals such
              as page views and where visitors came from.
            </p>
            <p className={styles.p}>
              We keep our own simple count of visits too. It uses no cookies
              and stores nothing on your device. It records the page, how you
              arrived, your approximate country and city, the type of device
              and how long you stayed. We do not store your IP address or
              anything that identifies you.
            </p>
            <p className={styles.p}>
              If you give us your email to unlock our resources or receive a
              free tool&apos;s result, we remember it in your browser so you do
              not have to enter it again. Use the Not you link next to the email
              field to clear it. While it is remembered, our visit count is
              linked to it.
            </p>
          </Section>

          <Section num="12" title="Changes to this policy">
            <p className={styles.p}>
              If we make a change that affects how we use your data, we will
              email clients with an active account before it takes effect.
              Every update shows a new last updated date at the top of this
              page.
            </p>
          </Section>

          <Section num="13" title="Governing law">
            <p className={styles.p}>
              This policy is governed by the laws of England and Wales, and the
              English courts have exclusive jurisdiction over any dispute. This
              does not affect any rights you have under the laws of your own
              country.
            </p>
          </Section>

          {/* CONTACT FOOTER */}
          <div className={styles.contactBlock}>
            <h2 className={styles.contactH}>Questions?</h2>
            <p className={styles.contactP}>
              We&apos;re a small team and we read every email. If anything in
              here is unclear, just write to us.
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
