import { ArrowRight, Gamepad2, Users, Target, Heart } from "lucide-react";
import { HexagonBackground } from "@/components/marketing/HexagonBackground";
import { GradientBlur } from "@/components/marketing/GradientBlur";

const CALENDLY_URL = "https://calendly.com/andre-30y6/makersforge-headhunting-introduction";

export default function AboutPage() {
  return (
    <>
      <section className="relative pt-32 pb-16">
        <HexagonBackground />
        <GradientBlur position="top-right" size="lg" color="orange" intensity="medium" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-heading">
              Mobile gaming recruitment that <span className="text-brand-orange">gets the nuance</span>
            </h1>
            <p className="mt-6 text-xl md:text-2xl text-white/70">
              Technical specificity meets cultural intelligence.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-brand-black-light relative overflow-hidden">
        <GradientBlur position="top-left" size="md" color="orange" intensity="low" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white font-heading">
              Two things that <span className="text-brand-orange">matter</span>
            </h2>
            <div className="mt-8 space-y-6 text-lg text-white/70">
              <p>
                Hiring in mobile games requires two things that most recruiters get wrong.
              </p>
              <p>
                First, <span className="text-white">technical specificity</span>. Mobile gaming isn't one thing. The skills that make someone exceptional at hybridcasual don't translate directly to midcore RPGs. A monetisation designer from match-3 thinks differently to one from idle games. An engineer who's optimised for low-end Android devices brings something different to one who's only worked on iOS. The nuance matters.
              </p>
              <p>
                Second, <span className="text-white">cultural balance</span>. Great teams aren't built by hiring the same profile over and over. They need a mix of proven talent who bring pattern recognition and new perspectives who challenge assumptions. Getting that balance right is as important as getting the technical fit right.
              </p>
              <p>
                We built MakersForge to do both.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-brand-black relative overflow-hidden">
        <div className="opacity-50">
          <HexagonBackground />
        </div>
        <GradientBlur position="bottom-right" size="md" color="orange" intensity="low" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white font-heading">
              What we <span className="text-brand-orange">believe</span>
            </h2>
          </div>
          <div className="mt-12 grid md:grid-cols-2 gap-8 max-w-5xl">
            <div className="p-8 bg-brand-grey/30 rounded-xl border-2 border-brand-orange/50">
              <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center mb-6">
                <Gamepad2 className="w-6 h-6 text-brand-orange" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-white font-heading">Specificity over generalism</h3>
              <p className="mt-3 text-white/60">
                We know the difference between genres, platforms, and business models. When you say you need someone with LiveOps experience on F2P midcore, we understand exactly what that means.
              </p>
            </div>
            <div className="p-8 bg-brand-grey/30 rounded-xl border-2 border-brand-orange/50">
              <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-brand-orange" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-white font-heading">Proven meets fresh</h3>
              <p className="mt-3 text-white/60">
                The best teams blend experience with new thinking. We help you find people who've done it before and people who'll help you do it differently.
              </p>
            </div>
            <div className="p-8 bg-brand-grey/30 rounded-xl border-2 border-brand-orange/50">
              <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-brand-orange" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-white font-heading">Quality over volume</h3>
              <p className="mt-3 text-white/60">
                We don't flood you with CVs. We send you candidates we genuinely believe will work, because we've done the thinking upfront.
              </p>
            </div>
            <div className="p-8 bg-brand-grey/30 rounded-xl border-2 border-brand-orange/50">
              <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center mb-6">
                <Heart className="w-6 h-6 text-brand-orange" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-white font-heading">Human throughout</h3>
              <p className="mt-3 text-white/60">
                Recruitment is a people business. We treat candidates and clients like humans, not transactions. That's how you build teams that last.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-brand-black-light relative overflow-hidden">
        <GradientBlur position="top-right" size="md" color="orange" intensity="low" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white font-heading">
              Why <span className="text-brand-orange">mobile</span>?
            </h2>
            <div className="mt-8 space-y-6 text-lg text-white/70">
              <p>
                Mobile is where the nuance is sharpest. The difference between casual and midcore isn't just a label, it's a completely different set of skills, instincts, and experience.
              </p>
              <p>
                Generalist recruiters miss this. They treat "games" as one category and wonder why their candidates don't stick. We specialise because that's where knowing the detail actually makes the difference.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-brand-black relative overflow-hidden">
        <HexagonBackground />
        <GradientBlur position="center" size="lg" color="orange" intensity="medium" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white font-heading">
              Let's <span className="text-brand-orange">talk</span>
            </h2>
            <p className="mt-6 text-xl text-white/70">
              Whether you're building a team or looking for your next role.
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