import Link from "next/link";
import { ArrowRight, CheckCircle, Briefcase, MessageSquare, Shield, TrendingUp } from "lucide-react";
import { HexagonBackground } from "@/components/marketing/HexagonBackground";
import { GradientBlur } from "@/components/marketing/GradientBlur";

export default function ForTalentPage() {
  return (
    <>
      <section className="relative pt-32 pb-16">
        <HexagonBackground />
        <GradientBlur position="top-right" size="lg" color="orange" intensity="medium" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-brand-orange/10 border border-brand-orange/20 rounded-full px-4 py-2 mb-8">
              <span className="text-sm text-brand-orange font-medium">For Mobile Gaming Professionals</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-heading">
              Find your next <span className="text-brand-orange">opportunity</span>
            </h1>
            <p className="mt-6 text-xl md:text-2xl text-white/70">
              We connect mobile gaming specialists with studios that value what you do.
            </p>
            <div className="mt-10">
              <Link href="/sign-up" className="btn-primary text-lg inline-flex items-center gap-2">
                Create your profile
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-brand-black-light relative overflow-hidden">
        <GradientBlur position="top-left" size="md" color="orange" intensity="low" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white font-heading">
              Why work <span className="text-brand-orange">with us</span>?
            </h2>
            <div className="mt-8 space-y-6 text-lg text-white/70">
              <p>
                Let's be honest: job hunting in mobile games is exhausting. Vague job descriptions that all sound the same. Recruiter spam from people who think Unity and Unreal are interchangeable. "Competitive salary" that turns out to be anything but.
              </p>
              <p>
                We do things differently. We only work with funded, well-run mobile studios. We understand what you actually do. And we'll only reach out when we have something genuinely relevant.
              </p>
            </div>
          </div>
          <div className="mt-16 grid sm:grid-cols-2 gap-6 max-w-4xl">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-6 h-6 text-brand-orange" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-semibold text-white">Access to hidden roles</h3>
                <p className="mt-2 text-sm text-white/60">Many of our positions are never posted publicly. Studios come to us first.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-6 h-6 text-brand-orange" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-semibold text-white">Honest conversations</h3>
                <p className="mt-2 text-sm text-white/60">We'll tell you the truth about roles, studios, and your fit. No sugarcoating.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-brand-orange" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-semibold text-white">Your advocate</h3>
                <p className="mt-2 text-sm text-white/60">From first conversation to offer negotiation, we're in your corner.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-brand-orange" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-semibold text-white">Career guidance</h3>
                <p className="mt-2 text-sm text-white/60">Not sure what's next? We can help you think through your options.</p>
              </div>
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
              Who we <span className="text-brand-orange">work with</span>
            </h2>
            <p className="mt-6 text-lg text-white/70">
              We specialise in placing mobile gaming professionals across all disciplines. If you have experience in any of these areas, we want to hear from you.
            </p>
          </div>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl">
            <div className="p-4 bg-brand-grey/30 rounded-xl border border-white/10">
              <h3 className="font-semibold text-white">Monetisation & Economy</h3>
              <p className="mt-1 text-sm text-white/50">F2P design, LiveOps, balancing</p>
            </div>
            <div className="p-4 bg-brand-grey/30 rounded-xl border border-white/10">
              <h3 className="font-semibold text-white">Game Design</h3>
              <p className="mt-1 text-sm text-white/50">Systems, levels, narrative, UX</p>
            </div>
            <div className="p-4 bg-brand-grey/30 rounded-xl border border-white/10">
              <h3 className="font-semibold text-white">Production</h3>
              <p className="mt-1 text-sm text-white/50">Producers, PMs, project leads</p>
            </div>
            <div className="p-4 bg-brand-grey/30 rounded-xl border border-white/10">
              <h3 className="font-semibold text-white">Engineering</h3>
              <p className="mt-1 text-sm text-white/50">Unity, backend, tools, tech leads</p>
            </div>
            <div className="p-4 bg-brand-grey/30 rounded-xl border border-white/10">
              <h3 className="font-semibold text-white">Art & Creative</h3>
              <p className="mt-1 text-sm text-white/50">2D, 3D, UI, technical art</p>
            </div>
            <div className="p-4 bg-brand-grey/30 rounded-xl border border-white/10">
              <h3 className="font-semibold text-white">UA & Growth</h3>
              <p className="mt-1 text-sm text-white/50">User acquisition, analytics, marketing</p>
            </div>
            <div className="p-4 bg-brand-grey/30 rounded-xl border border-white/10">
              <h3 className="font-semibold text-white">Leadership</h3>
              <p className="mt-1 text-sm text-white/50">Studio heads, directors, C-suite</p>
            </div>
            <div className="p-4 bg-brand-grey/30 rounded-xl border border-white/10">
              <h3 className="font-semibold text-white">QA & Support</h3>
              <p className="mt-1 text-sm text-white/50">Testing, community, player support</p>
            </div>
            <div className="p-4 bg-brand-grey/30 rounded-xl border border-white/10">
              <h3 className="font-semibold text-white">Data & Analytics</h3>
              <p className="mt-1 text-sm text-white/50">Data science, BI, insights</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-brand-black-light relative overflow-hidden">
        <GradientBlur position="top-right" size="md" color="orange" intensity="low" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white font-heading">
              How it <span className="text-brand-orange">works</span>
            </h2>
          </div>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl">
            <div>
              <div className="w-10 h-10 rounded-full bg-brand-orange flex items-center justify-center text-white font-bold">1</div>
              <h3 className="mt-4 font-semibold text-white">Create your profile</h3>
              <p className="mt-2 text-sm text-white/60">Tell us about your experience, what you're looking for, and what matters to you.</p>
            </div>
            <div>
              <div className="w-10 h-10 rounded-full bg-brand-orange flex items-center justify-center text-white font-bold">2</div>
              <h3 className="mt-4 font-semibold text-white">We review</h3>
              <p className="mt-2 text-sm text-white/60">We look at your background and match you against current and upcoming opportunities.</p>
            </div>
            <div>
              <div className="w-10 h-10 rounded-full bg-brand-orange flex items-center justify-center text-white font-bold">3</div>
              <h3 className="mt-4 font-semibold text-white">Relevant intros only</h3>
              <p className="mt-2 text-sm text-white/60">When something fits, we reach out. No spam, no irrelevant roles.</p>
            </div>
            <div>
              <div className="w-10 h-10 rounded-full bg-brand-orange flex items-center justify-center text-white font-bold">4</div>
              <h3 className="mt-4 font-semibold text-white">Full support</h3>
              <p className="mt-2 text-sm text-white/60">We guide you through the process and help negotiate the best outcome.</p>
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
              Ready to get <span className="text-brand-orange">started</span>?
            </h2>
            <p className="mt-6 text-xl text-white/70">
              Create your profile and let us know what you're looking for. It takes about 5 minutes.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up" className="btn-primary text-lg inline-flex items-center justify-center gap-2">
                Create your profile
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/sign-in" className="btn-ghost text-lg">
                Already registered? Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}