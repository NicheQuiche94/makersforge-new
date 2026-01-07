import { Mail, Linkedin, Calendar } from "lucide-react";
import { HexagonBackground } from "@/components/marketing/HexagonBackground";
import { GradientBlur } from "@/components/marketing/GradientBlur";

const CALENDLY_URL = "https://calendly.com/andre-30y6/makersforge-headhunting-introduction";

export default function ContactPage() {
  return (
    <section className="relative pt-32 pb-16 min-h-[80vh] flex items-center">
      <HexagonBackground />
      <GradientBlur position="top-right" size="lg" color="orange" intensity="medium" />
      <GradientBlur position="bottom-left" size="md" color="orange" intensity="low" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 w-full">
        <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-heading">
            Let's get <span className="text-brand-orange">started</span>
            </h1>
          <p className="mt-6 text-xl md:text-2xl text-white/70">
            Whether you're hiring, looking for your next role, or just want to chat about mobile gaming recruitment.
          </p>
        </div>
        <div className="mt-16 grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="group p-6 bg-gradient-to-br from-brand-orange/20 to-brand-orange/5 rounded-xl border-2 border-brand-orange hover:border-brand-orange-light transition-all text-center">
            <div className="w-14 h-14 rounded-xl bg-brand-orange/20 flex items-center justify-center mx-auto group-hover:bg-brand-orange/30 transition-colors">
              <Calendar className="w-7 h-7 text-brand-orange" strokeWidth={1.5} />
            </div>
            <h2 className="mt-4 text-lg font-bold text-white font-heading">Book a call</h2>
            <p className="mt-2 text-sm text-white/60">Schedule a time that works for you</p>
          </a>
          <a href="mailto:andre@makersforge.co" className="group p-6 bg-brand-grey/30 rounded-xl border border-white/10 hover:border-brand-orange/50 transition-all text-center">
            <div className="w-14 h-14 rounded-xl bg-brand-orange/10 flex items-center justify-center mx-auto group-hover:bg-brand-orange/20 transition-colors">
              <Mail className="w-7 h-7 text-brand-orange" strokeWidth={1.5} />
            </div>
            <h2 className="mt-4 text-lg font-bold text-white font-heading">Email</h2>
            <p className="mt-2 text-sm text-white/60">andre@makersforge.co</p>
          </a>
          <a href="https://www.linkedin.com/in/yourusername/" target="_blank" rel="noopener noreferrer" className="group p-6 bg-brand-grey/30 rounded-xl border border-white/10 hover:border-brand-orange/50 transition-all text-center">
            <div className="w-14 h-14 rounded-xl bg-brand-orange/10 flex items-center justify-center mx-auto group-hover:bg-brand-orange/20 transition-colors">
              <Linkedin className="w-7 h-7 text-brand-orange" strokeWidth={1.5} />
            </div>
            <h2 className="mt-4 text-lg font-bold text-white font-heading">LinkedIn</h2>
            <p className="mt-2 text-sm text-white/60">Connect with Andre</p>
          </a>
        </div>
        <div className="mt-16 max-w-xl mx-auto text-center">
          <p className="text-white/50 text-sm">Based in the UK, working with mobile gaming studios across EMEA and beyond.</p>
        </div>
      </div>
    </section>
  );
}