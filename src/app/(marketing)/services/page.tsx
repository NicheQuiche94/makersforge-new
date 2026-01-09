import { ArrowRight, CheckCircle } from "lucide-react";
import { HexagonBackground } from "@/components/marketing/HexagonBackground";
import { GradientBlur } from "@/components/marketing/GradientBlur";
import { TeamBuildSection } from "@/components/marketing/TeamBuildSection";

const CALENDLY_URL = "https://calendly.com/andre-30y6/makersforge-headhunting-introduction";

export default function ServicesPage() {
  return (
    <>
      <section className="relative pt-32 pb-16">
        <HexagonBackground />
        <GradientBlur position="top-right" size="lg" color="orange" intensity="medium" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-heading">
              What to <span className="text-brand-orange">expect</span>
            </h1>
            <p className="mt-6 text-xl md:text-2xl text-white/70">
              We offer two ways to work with us depending on your hiring needs. Both are built on the same principle: <span className="text-brand-orange">we only succeed when you do.</span>
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-brand-black-light relative overflow-hidden">
        <GradientBlur position="top-left" size="md" color="orange" intensity="low" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="flex flex-col">
              <div className="inline-block bg-brand-orange/10 border border-brand-orange/20 rounded-full px-4 py-1 mb-4 self-start">
                <span className="text-sm text-brand-orange font-medium">Permanent Hires</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white font-heading">
                Contingent Recruitment
              </h2>
              <p className="mt-6 text-lg text-white/70">
                This is our core service. You brief us on the role, we go and find the right people. No retainer, no upfront cost. You only pay when we successfully place someone who joins your team.
              </p>
              <p className="mt-4 text-lg text-white/70">
                We handle everything: sourcing candidates from our network and beyond, screening for technical and cultural fit, managing the interview process, and supporting offer negotiations. You stay focused on running your studio.
              </p>
              <div className="mt-8 p-6 bg-brand-grey/50 rounded-xl border border-white/10 h-44 flex flex-col justify-center">
                <div className="text-3xl font-bold text-white">£10,000 <span className="text-lg font-normal text-white/50">fixed fee</span></div>
                <p className="text-white/50 text-sm mt-1">£12,000 for specialist or leadership roles</p>
                <p className="mt-4 text-white/70">Payable only on successful hire. No win, no fee.</p>
              </div>
              <div className="mt-8 space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" />
                  <span className="text-white/80">Zero risk - you only pay on successful placement</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" />
                  <span className="text-white/80">Full candidate screening and assessment</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" />
                  <span className="text-white/80">Interview coordination and offer support</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="inline-block bg-white/5 border border-white/10 rounded-full px-4 py-1 mb-4 self-start">
                <span className="text-sm text-white/70 font-medium">Contract and Freelance</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white font-heading">
                Contract Recruitment
              </h2>
              <p className="mt-6 text-lg text-white/70">
                Sometimes you need extra hands for a specific project or period without the commitment of a permanent hire. We can help you find experienced contractors and freelancers from our network.
              </p>
              <p className="mt-4 text-lg text-white/70">
                Whether you need a technical artist for three months or a producer to see you through launch, we will find someone who can hit the ground running and deliver from day one.
              </p>
              <div className="mt-8 p-6 bg-brand-grey/50 rounded-xl border border-white/10 h-44 flex flex-col justify-center">
                <div className="text-3xl font-bold text-white">£1,000 <span className="text-lg font-normal text-white/50">per month</span></div>
                <p className="text-white/50 text-sm mt-1">for the duration of the contract</p>
                <p className="mt-4 text-white/70">Simple monthly fee. No percentage of day rate.</p>
              </div>
              <div className="mt-8 space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" />
                  <span className="text-white/80">Access to vetted contractor network</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" />
                  <span className="text-white/80">Fast turnaround for urgent needs</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" />
                  <span className="text-white/80">Flexible engagement terms</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Build Section */}
      <section className="section-padding bg-brand-black relative overflow-hidden">
        <div className="opacity-30">
          <HexagonBackground />
        </div>
        <GradientBlur position="top-right" size="lg" color="orange" intensity="low" />
        <TeamBuildSection />
      </section>

      <section className="section-padding bg-brand-black-light relative overflow-hidden">
        <GradientBlur position="bottom-right" size="md" color="orange" intensity="low" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white font-heading">
              Every business gets a <span className="text-brand-orange">Company Portal</span>
            </h2>
            <p className="mt-6 text-lg text-white/70">
              When you work with us, you get access to your own dedicated portal. No more chasing emails or wondering where things stand.
            </p>
          </div>
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
            <div className="p-6 bg-brand-grey/30 rounded-xl border-2 border-brand-orange/50">
              <h3 className="font-semibold text-white">Submit Briefs</h3>
              <p className="mt-2 text-sm text-white/60">Create and manage role briefs directly in the portal. No back-and-forth emails.</p>
            </div>
            <div className="p-6 bg-brand-grey/30 rounded-xl border-2 border-brand-orange/50">
              <h3 className="font-semibold text-white">Process Overview</h3>
              <p className="mt-2 text-sm text-white/60">See exactly where each search stands, from sourcing through to offer stage.</p>
            </div>
            <div className="p-6 bg-brand-grey/30 rounded-xl border-2 border-brand-orange/50">
              <h3 className="font-semibold text-white">Candidate Tracking</h3>
              <p className="mt-2 text-sm text-white/60">Review candidates, leave feedback, and track progress all in one place.</p>
            </div>
            <div className="p-6 bg-brand-grey/30 rounded-xl border-2 border-brand-orange/50">
              <h3 className="font-semibold text-white">Invoice Tracking</h3>
              <p className="mt-2 text-sm text-white/60">Clear visibility on billing. No surprises, no hidden costs.</p>
            </div>
            <div className="p-6 bg-brand-grey/30 rounded-xl border-2 border-brand-orange/50">
              <h3 className="font-semibold text-white">Loyalty Programme</h3>
              <p className="mt-2 text-sm text-white/60">The more you work with us, the better it gets. Returning partners get priority service.</p>
            </div>
            <div className="p-6 bg-brand-grey/30 rounded-xl border-2 border-brand-orange/50">
              <h3 className="font-semibold text-white">Direct Communication</h3>
              <p className="mt-2 text-sm text-white/60">Message us directly through the portal. Quick responses, no phone tag.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-brand-black relative overflow-hidden">
        <GradientBlur position="top-right" size="md" color="orange" intensity="low" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white font-heading">
              Why we use <span className="text-brand-orange">fixed fees</span>
            </h2>
            <div className="mt-8 space-y-6 text-lg text-white/70">
              <p>
                Most recruitment agencies charge 15-25% of the candidate&apos;s first year salary. That creates a problem: they are incentivised to push candidates towards the highest possible salary, whether or not it is the right fit for your budget or the candidate&apos;s expectations.
              </p>
              <p>
                Our fixed fee model removes that conflict. We charge the same whether you hire someone at £50k or £150k. That means we are focused entirely on finding the right person, not inflating offers.
              </p>
              <p>
                For a typical £80k hire, traditional agencies would charge £12-20k. You pay us £10k.<br />
                <span className="text-brand-orange">Better alignment, better value.</span>
              </p>
            </div>
          </div>
          <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-4xl">
            <div>
              <div className="text-4xl font-bold text-brand-orange">£10k</div>
              <p className="mt-2 text-white/70">vs £15-25k typical agency fee</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-brand-orange">0%</div>
              <p className="mt-2 text-white/70">salary inflation pressure</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-brand-orange">100%</div>
              <p className="mt-2 text-white/70">focused on the right fit</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-brand-black-light relative overflow-hidden">
        <HexagonBackground />
        <GradientBlur position="center" size="lg" color="orange" intensity="medium" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white font-heading">
              Let&apos;s get <span className="text-brand-orange">started</span>
            </h2>
            <p className="mt-6 text-xl text-white/70">
              Whether you have a role to fill right now or just want to understand how we could help, we are happy to chat.
            </p>
            <div className="mt-10">
              <a 
                href={CALENDLY_URL} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-primary text-lg inline-flex items-center gap-2"
              >
                Book a call
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}