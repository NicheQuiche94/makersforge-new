import { Metadata } from "next";
import { HexagonBackground } from "@/components/marketing/HexagonBackground";
import { GradientBlur } from "@/components/marketing/GradientBlur";
import { TeamBuildCalculatorLead } from "@/components/marketing/TeamBuildCalculatorLead";
import { Users, Zap, Shield, CheckCircle, Target } from "lucide-react";

export const metadata: Metadata = {
  title: "Team Build Calculator | MakersForge",
  description: "Build your mobile games team now. Pay over 6 months. Fixed fees, not percentages.",
  openGraph: {
    title: "Less Netflix. More Klarna.",
    description: "Build your team now. Pay over 6 months.",
  },
};

const BENEFITS = [
  {
    icon: Target,
    title: "Talent Strategy Session",
    description: "We plan the build before we start hiring.",
  },
  {
    icon: Zap,
    title: "Prioritised Roadmap",
    description: "Your roles jump the queue. Sequenced for momentum.",
  },
  {
    icon: Users,
    title: "Team Dynamics Mapping",
    description: "We consider how they'll work together, not just individual CVs.",
  },
  {
    icon: Shield,
    title: "Replacement Guarantee",
    description: "Any hire doesn't work out within 30 days? Replaced free.",
  },
];

const VALUE_PROPS = [
  "Fixed fees, not percentages",
  "Mobile games specialists",
  "Payments over 6 months",
];

export default function TeamCalculatorPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16">
        <HexagonBackground />
        <GradientBlur position="top-right" size="lg" color="orange" intensity="medium" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block bg-brand-orange/10 border border-brand-orange/20 rounded-full px-4 py-1 mb-6">
              <span className="text-sm text-brand-orange font-medium">Team Build Calculator</span>
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-heading">
              Less Netflix.{" "}
              <span className="text-brand-orange">More Klarna.</span>
            </h1>
            <p className="mt-6 text-xl md:text-2xl text-white/70">
              Build your team now. Pay over 6 months.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {VALUE_PROPS.map((prop, index) => (
                <div key={index} className="flex items-center gap-2 text-white/60">
                  <CheckCircle className="w-4 h-4 text-brand-orange" />
                  <span className="text-sm">{prop}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section id="calculator" className="section-padding bg-brand-black-light relative overflow-hidden">
        <GradientBlur position="top-left" size="md" color="orange" intensity="low" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white font-heading">
              See your <span className="text-brand-orange">monthly cost</span>
            </h2>
          </div>
          <TeamBuildCalculatorLead />
        </div>
      </section>

      {/* Positioning Section */}
      <section className="section-padding bg-brand-black relative overflow-hidden">
        <div className="opacity-30">
          <HexagonBackground />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white font-heading mb-8">
              Not a subscription.{" "}
              <span className="text-brand-orange">A team build.</span>
            </h2>
            <div className="space-y-6 text-lg text-white/70 text-left">
              <p>
                Other agencies sell you access. Monthly retainers. Unlimited hires. 
                Sounds good until you realise you&apos;re renting recruitment.
              </p>
              <p>
                We do it differently.
              </p>
              <p>
                You tell us who you need. We build your team. You pay over 6 months.
              </p>
              <p className="text-white">
                No retainer. No percentages. Just your team, delivered.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding bg-brand-black-light relative overflow-hidden">
        <GradientBlur position="bottom-left" size="md" color="orange" intensity="low" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white font-heading">
              Every team build <span className="text-brand-orange">includes</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map((benefit, index) => (
              <div
                key={index}
                className="p-6 bg-white/5 border border-white/10 rounded-xl hover:border-brand-orange/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-orange/20 flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-brand-orange" />
                </div>
                <h3 className="text-white font-bold mb-2">{benefit.title}</h3>
                <p className="text-white/60 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Fixed Fees Section */}
      <section className="section-padding bg-brand-black relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white font-heading mb-8">
              Why <span className="text-brand-orange">fixed fees</span> make sense
            </h2>
            <div className="space-y-6 text-lg text-white/70">
              <p>
                Traditional agencies charge 15-25% of salary. A 5-person team at £80k average? 
                That&apos;s <span className="text-white">£60-100k in fees.</span>
              </p>
              <p>
                We charge fixed fees. Same team? <span className="text-brand-orange">£40k with team pricing.</span>
              </p>
              <p>
                Better yet, we&apos;re not incentivised to push salaries up. We just want 
                the right people in the right seats.
              </p>
            </div>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-8 max-w-3xl">
            <div>
              <div className="text-4xl font-bold text-brand-orange">20-60%</div>
              <p className="mt-2 text-white/70">saved vs traditional agencies</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-brand-orange">0%</div>
              <p className="mt-2 text-white/70">salary inflation pressure</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-brand-orange">4+</div>
              <p className="mt-2 text-white/70">hires unlocks team pricing</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-brand-black-light relative overflow-hidden">
        <GradientBlur position="top-right" size="md" color="orange" intensity="low" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white font-heading mb-8 text-center">
              How it works
            </h2>
            <div className="space-y-6">
              <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                <h3 className="text-white font-bold mb-2">One partner</h3>
                <p className="text-white/60 text-sm">
                  We become your sole recruiter for this build. No competing agencies. 
                  No mixed signals. Full focus.
                </p>
              </div>
              <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                <h3 className="text-white font-bold mb-2">Clear timeline</h3>
                <p className="text-white/60 text-sm">
                  4-6 hires in 2-4 months. 7-10 hires in 4-6 months. 
                  We move fast, but building right takes time.
                </p>
              </div>
              <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                <h3 className="text-white font-bold mb-2">Payments split</h3>
                <p className="text-white/60 text-sm">
                  Your fee spreads over 6 months. Cash flow stays healthy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding bg-brand-black relative overflow-hidden">
        <div className="opacity-30">
          <HexagonBackground />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-heading mb-6">
              Ready to <span className="text-brand-orange">build?</span>
            </h2>
            <a
              href="#calculator"
              className="inline-flex items-center justify-center px-8 py-4 bg-brand-orange text-white font-bold rounded-lg hover:bg-brand-orange/90 transition-colors"
            >
              Get Your Quote
            </a>
          </div>
        </div>
      </section>
    </>
  );
}