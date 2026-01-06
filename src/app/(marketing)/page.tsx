import Link from "next/link";
import { ArrowRight, CheckCircle, Coins, Gamepad2, Cog, TrendingUp, Palette, Users } from "lucide-react";
import { HexagonBackground } from "@/components/marketing/HexagonBackground";
import { GradientBlur } from "@/components/marketing/GradientBlur";

const CALENDLY_URL = "https://calendly.com/andre-30y6/makersforge-headhunting-introduction";

const areas = [
  { icon: Coins, title: "Monetisation and Economy Design", description: "The people who make your game profitable without making players hate you." },
  { icon: Gamepad2, title: "Game Design and Production", description: "From systems designers to producers who have shipped live mobile titles." },
  { icon: Cog, title: "Engineering", description: "Unity, backend, tools. Engineers who understand mobile constraints and live game demands." },
  { icon: TrendingUp, title: "UA and Growth", description: "The specialists who know how to acquire players profitably." },
  { icon: Palette, title: "Art and Creative", description: "Artists who understand mobile UI, optimisation, and what actually performs in ads." },
  { icon: Users, title: "Leadership", description: "Studio heads, directors, and executives who have built mobile gaming teams before." },
];

export default function HomePage() {
  return (
    <>
      <section className="relative min-h-[90vh] flex items-center">
        <HexagonBackground />
        <GradientBlur position="top-right" size="lg" color="orange" intensity="high" />
        <GradientBlur position="bottom-left" size="md" color="orange" intensity="medium" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-brand-orange/10 border border-brand-orange/20 rounded-full px-4 py-2 mb-8">
              <span className="w-2 h-2 bg-brand-orange rounded-full animate-pulse"></span>
              <span className="text-sm text-brand-orange font-medium">Exclusively Mobile Gaming</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight font-heading">
              The Mobile Gaming<br />
              <span className="text-brand-orange">Talent Specialists</span>
            </h1>
            <p className="mt-8 text-xl md:text-2xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              Stop explaining what hybridcasual means to tech agencies and start getting the right talent, every time.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="btn-primary text-lg inline-flex items-center justify-center gap-2">
                Book a call
                <ArrowRight className="w-5 h-5" />
              </a>
              <Link href="/services" className="btn-ghost text-lg">
                See how we work
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-brand-orange py-6">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-center text-lg font-medium text-white">
            We work exclusively with mobile gaming studios. No PC. No console. Just mobile.
          </p>
        </div>
      </section>

      <section className="section-padding bg-brand-black-light relative overflow-hidden">
        <GradientBlur position="top-left" size="md" color="orange" intensity="low" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight font-heading">
                Hiring in mobile games is <span className="text-brand-orange">broken</span>
              </h2>
              <div className="mt-8 space-y-6 text-lg text-white/70">
                <p>
                  You need a senior monetisation designer who has shipped F2P titles. What you get is a recruiter asking what the difference between mobile and console is.
                </p>
                <p>
                  You need a UA lead who understands ROAS and creative iteration. What you get is CVs for people who worked on a game once.
                </p>
                <p>
                  Every conversation starts with you educating the recruiter instead of them finding you talent.
                </p>
              </div>
            </div>
            <div className="card-highlight p-8">
              <h3 className="text-2xl font-bold text-white mb-6 font-heading">What if your recruiter already knew?</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" />
                  <span className="text-white/80">We have spent years inside the mobile gaming ecosystem</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" />
                  <span className="text-white/80">We know what LiveOps actually means</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" />
                  <span className="text-white/80">We understand why you need idle game experience, not match-3</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" />
                  <span className="text-white/80">We get the difference between a game designer and an economy designer</span>
                </div>
              </div>
              <p className="mt-6 text-lg text-white font-medium">
                You brief us once. We deliver candidates who fit.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-brand-black relative overflow-hidden">
        <HexagonBackground />
        <GradientBlur position="bottom-right" size="lg" color="orange" intensity="low" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white font-heading">
              Areas we <span className="text-brand-orange">cover</span>
            </h2>
            <p className="mt-4 text-xl text-white/60 max-w-2xl mx-auto">
              Specialist recruitment across all mobile gaming disciplines
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {areas.map((area) => (
              <div key={area.title} className="card group">
                <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center mb-4 group-hover:bg-brand-orange/20 transition-colors">
                  <area.icon className="w-6 h-6 text-brand-orange" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 font-heading">{area.title}</h3>
                <p className="text-white/60">{area.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-brand-black-light relative overflow-hidden">
        <GradientBlur position="top-right" size="md" color="orange" intensity="low" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight font-heading">
                Work in mobile games and looking for your <span className="text-brand-orange">next opportunity?</span>
              </h2>
              <p className="mt-6 text-xl text-white/70">
                Lets get to know each other.
              </p>
              <div className="mt-10">
                <Link href="/for-talent" className="btn-secondary text-lg inline-flex items-center gap-2">
                  Create account
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-orange/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-brand-orange" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Access to hidden opportunities</h3>
                  <p className="text-sm text-white/60 mt-1">Many of our roles are never posted publicly.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-orange/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-brand-orange" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Honest conversations</h3>
                  <p className="text-sm text-white/60 mt-1">We will tell you the truth about roles and your fit.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-orange/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-brand-orange" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Your advocate in the process</h3>
                  <p className="text-sm text-white/60 mt-1">From first conversation to offer negotiation.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-brand-black relative overflow-hidden">
        <GradientBlur position="center" size="lg" color="orange" intensity="medium" />
        <HexagonBackground />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="card-highlight max-w-4xl mx-auto text-center py-16 px-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white font-heading">
              Ready to stop explaining and <span className="text-brand-orange">start hiring?</span>
            </h2>
            <p className="mt-6 text-xl text-white/70 max-w-2xl mx-auto">
              Lets talk about how we can find your next critical hire.
            </p>
            <div className="mt-10">
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="btn-primary text-lg inline-flex items-center gap-2">
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