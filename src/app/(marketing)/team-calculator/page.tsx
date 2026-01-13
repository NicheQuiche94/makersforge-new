import { Metadata } from "next";
import { HexagonBackground } from "@/components/marketing/HexagonBackground";
import { GradientBlur } from "@/components/marketing/GradientBlur";
import { TeamBuildCalculatorLead } from "@/components/marketing/TeamBuildCalculatorLead";
import { Users, Zap, Shield, Calendar, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Team Build Calculator | MakersForge",
  description: "Calculate exactly what it costs to build your mobile games team. No email required, no sales pitch. Just numbers.",
  openGraph: {
    title: "What does it cost to build your mobile games team?",
    description: "Find out in 30 seconds. No email required.",
  },
};

const BENEFITS = [
  {
    icon: Zap,
    title: "Coordinated Hiring",
    description: "We sequence your hires strategically so each new team member builds on the last.",
  },
  {
    icon: Users,
    title: "Team Dynamics",
    description: "We consider how candidates will work together, not just their individual skills.",
  },
  {
    icon: Calendar,
    title: "Dedicated Focus",
    description: "Your team build gets prioritised sourcing until every role is filled.",
  },
  {
    icon: Shield,
    title: "Replacement Guarantee",
    description: "If any hire doesn't work out within 30 days, we replace them free of charge.",
  },
];

const VALUE_PROPS = [
  "Fixed fees, not percentages",
  "Mobile games specialism",
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
              What does it cost to build your{" "}
              <span className="text-brand-orange">mobile games team?</span>
            </h1>
            <p className="mt-6 text-xl md:text-2xl text-white/70">
              Find out in 30 seconds.
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
      <section className="section-padding bg-brand-black-light relative overflow-hidden">
        <GradientBlur position="top-left" size="md" color="orange" intensity="low" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <TeamBuildCalculatorLead />
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding bg-brand-black relative overflow-hidden">
        <div className="opacity-30">
          <HexagonBackground />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white font-heading">
              What&apos;s included in every <span className="text-brand-orange">team build</span>
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

      {/* Comparison Section */}
      <section className="section-padding bg-brand-black-light relative overflow-hidden">
        <GradientBlur position="bottom-right" size="md" color="orange" intensity="low" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white font-heading mb-8">
              Why teams choose <span className="text-brand-orange">fixed fees</span>
            </h2>
            <div className="space-y-6 text-lg text-white/70">
              <p>
                Most agencies charge 15-25% of salary. For a 5-person team at £80k average, 
                that&apos;s <span className="text-white">£60-100k in fees alone.</span>
              </p>
              <p>
                We charge fixed fees. Same 5 people? <span className="text-brand-orange">£40k with team pricing.</span> 
                {" "}You keep the difference.
              </p>
              <p>
                Better yet, we&apos;re not incentivised to push salaries up. We just want 
                to find the right people.
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

      {/* FAQ/Caveats */}
      <section className="section-padding bg-brand-black relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white font-heading mb-8 text-center">
              How it works
            </h2>
            <div className="space-y-6">
              <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                <h3 className="text-white font-bold mb-2">Exclusivity required</h3>
                <p className="text-white/60 text-sm">
                  Team packages mean we become your sole recruitment partner for this build. 
                  No competing agencies, no mixed signals to candidates.
                </p>
              </div>
              <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                <h3 className="text-white font-bold mb-2">Timeline commitments</h3>
                <p className="text-white/60 text-sm">
                  2-4 months for 4-6 hires, 4-6 months for 7-10 hires, custom for larger teams. 
                  We move fast, but building right takes time.
                </p>
              </div>
              <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                <h3 className="text-white font-bold mb-2">Quote validity</h3>
                <p className="text-white/60 text-sm">
                  Reserve your quote and we will get in touch to get started.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}