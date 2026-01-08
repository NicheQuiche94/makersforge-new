import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Linkedin, Globe, FileText, Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { HexagonBackground } from "@/components/marketing/HexagonBackground";
import { GradientBlur } from "@/components/marketing/GradientBlur";
import { AboutYouSection } from "@/components/app/AboutYouSection";

export default async function ProfilePage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const supabase = createClient();
  const { data: profile, error } = await supabase
    .from("candidate_profiles")
    .select("*")
    .eq("clerk_id", user.id)
    .single();

  if (!profile || !profile.profile_complete) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-screen bg-brand-black">
      <div className="relative py-12">
        <HexagonBackground />
        <GradientBlur position="top-right" size="lg" color="orange" intensity="low" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to dashboard
            </Link>
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 text-brand-orange hover:text-brand-orange/80 transition-colors text-sm font-medium"
            >
              <Pencil className="w-4 h-4" />
              Edit Profile
            </Link>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white font-heading">
            Your Profile
          </h1>
          <p className="text-white/60 mt-2">
            {user.firstName} {user.lastName} · {profile.email}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="card p-8">
              <h2 className="text-xl font-bold text-white font-heading mb-6">
                Professional Details
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-white/50 mb-1">Discipline</p>
                  <p className="text-white">{profile.discipline || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-white/50 mb-1">Speciality</p>
                  <p className="text-white">{profile.speciality || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-white/50 mb-1">Experience Level</p>
                  <p className="text-white">{profile.experience_level || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-white/50 mb-1">Years Experience</p>
                  <p className="text-white">{profile.years_experience ? `${profile.years_experience} years` : "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-white/50 mb-1">Current Title</p>
                  <p className="text-white">{profile.current_title || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-white/50 mb-1">Current Company</p>
                  <p className="text-white">{profile.current_company || "—"}</p>
                </div>
              </div>
            </div>

            <div className="card p-8">
              <h2 className="text-xl font-bold text-white font-heading mb-6">
                Game Experience
              </h2>
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-white/50 mb-2">Game Categories</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.game_categories?.length > 0 ? (
                      profile.game_categories.map((cat: string) => (
                        <span
                          key={cat}
                          className="px-3 py-1 bg-brand-orange/10 border border-brand-orange/20 rounded-full text-sm text-brand-orange"
                        >
                          {cat}
                        </span>
                      ))
                    ) : (
                      <span className="text-white/30">None selected</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-white/50 mb-2">Genres</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.genres?.length > 0 ? (
                      profile.genres.map((genre: string) => (
                        <span
                          key={genre}
                          className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-white/70"
                        >
                          {genre}
                        </span>
                      ))
                    ) : (
                      <span className="text-white/30">None selected</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-8">
              <h2 className="text-xl font-bold text-white font-heading mb-6">
                Job Preferences
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-white/50 mb-2">Job Types</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.job_types?.length > 0 ? (
                      profile.job_types.map((type: string) => (
                        <span
                          key={type}
                          className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-white/70"
                        >
                          {type}
                        </span>
                      ))
                    ) : (
                      <span className="text-white/30">None selected</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-white/50 mb-2">Workplace Preferences</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.workplace_preferences?.length > 0 ? (
                      profile.workplace_preferences.map((pref: string) => (
                        <span
                          key={pref}
                          className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-white/70"
                        >
                          {pref}
                        </span>
                      ))
                    ) : (
                      <span className="text-white/30">None selected</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-white/50 mb-1">Looking Status</p>
                  <p className="text-white">
                    {profile.looking_status === "yes"
                      ? "Actively looking"
                      : profile.looking_status === "passive"
                      ? "Open to opportunities"
                      : profile.looking_status === "no"
                      ? "Not looking"
                      : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-white/50 mb-1">Available From</p>
                  <p className="text-white">{profile.available_from || "Immediately"}</p>
                </div>
              </div>
            </div>

            {/* About You Section with modals */}
            <AboutYouSection clerkId={user.id} profile={profile} />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="card p-8">
              <h2 className="text-xl font-bold text-white font-heading mb-6">
                Salary Expectations
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-white/50 mb-1">Minimum</p>
                  <p className="text-white">{profile.salary_minimum || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm text-white/50 mb-1">Ideal</p>
                  <p className="text-white">{profile.salary_ideal || "Not specified"}</p>
                </div>
              </div>
            </div>

            <div className="card p-8">
              <h2 className="text-xl font-bold text-white font-heading mb-6">
                Links
              </h2>
              <div className="space-y-4">
                {profile.linkedin_url ? (
                  <a
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-white/70 hover:text-white transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                    LinkedIn
                  </a>
                ) : (
                  <div className="flex items-center gap-3 text-white/30">
                    <Linkedin className="w-5 h-5" />
                    LinkedIn not added
                  </div>
                )}
                {profile.portfolio_url ? (
                  <a
                    href={profile.portfolio_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-white/70 hover:text-white transition-colors"
                  >
                    <Globe className="w-5 h-5" />
                    Portfolio
                  </a>
                ) : (
                  <div className="flex items-center gap-3 text-white/30">
                    <Globe className="w-5 h-5" />
                    Portfolio not added
                  </div>
                )}
                {profile.cv_url ? (
                  <a
                    href={profile.cv_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-white/70 hover:text-white transition-colors"
                  >
                    <FileText className="w-5 h-5" />
                    CV/Resume
                  </a>
                ) : (
                  <div className="flex items-center gap-3 text-white/30">
                    <FileText className="w-5 h-5" />
                    CV not added
                  </div>
                )}
              </div>
            </div>

            <Link
              href="/onboarding"
              className="btn-secondary w-full text-center block"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}