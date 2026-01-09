import { TeamBuildCalculator } from "./TeamBuildCalculator";
import { Users, Zap, Shield, Calendar } from "lucide-react";

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
    description: "If any hire doesn't work out within 45 days, we replace them free of charge.",
  },
];

export function TeamBuildSection() {
  return (
    <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
      {/* Section Header */}
      <div className="max-w-3xl mb-16">
        <div className="inline-block bg-brand-orange/10 border border-brand-orange/20 rounded-full px-4 py-1 mb-4">
          <span className="text-sm text-brand-orange font-medium">Team Build Package</span>
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white font-heading mb-6">
          Building an <span className="text-brand-orange">entire team?</span>
        </h2>
        <p className="text-xl text-white/70 leading-relaxed">
          When you need more than one key hire,building a cohesive team is important. 
          We&apos;ll partner with you to plan, source, and secure a team that 
          works together, not just a collection of individuals.
        </p>
      </div>

      {/* Benefits Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
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

      {/* Calculator */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-white font-heading mb-8 text-center">
          Build Your Team Quote
        </h3>
        <TeamBuildCalculator />
      </div>

      {/* Caveats */}
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-white/40 text-sm">
          Team packages require exclusivity, we become your sole recruitment partner 
          for this build. Timelines vary by team size: 6 months for 4-6 hires, 
          9 months for 7-10 hires, custom for larger teams.
        </p>
      </div>
    </div>
  );
}