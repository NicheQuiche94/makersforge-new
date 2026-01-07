"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Loader2, Check } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { HexagonBackground } from "@/components/marketing/HexagonBackground";
import { GradientBlur } from "@/components/marketing/GradientBlur";

const DISCIPLINES = [
  "Game Design",
  "Economy/Monetisation Design",
  "Product Management",
  "Production",
  "Engineering",
  "Art & Animation",
  "UI/UX Design",
  "UA & Growth",
  "Analytics",
  "LiveOps",
  "QA",
  "Leadership/Executive",
  "Other",
];

const SPECIALITIES: Record<string, string[]> = {
  "Game Design": ["Systems Design", "Level Design", "Narrative Design", "Combat Design", "Economy Design", "UX Design"],
  "Economy/Monetisation Design": ["F2P Monetisation", "LiveOps Economy", "Virtual Economies", "Pricing Strategy"],
  "Product Management": ["Core Product", "Growth Product", "Platform Product", "LiveOps Product"],
  "Production": ["Project Management", "Program Management", "Scrum Master", "Development Director"],
  "Engineering": ["Unity", "Unreal", "Backend/Server", "Tools", "Platform", "DevOps", "QA Automation"],
  "Art & Animation": ["2D Art", "3D Art", "Character Art", "Environment Art", "UI Art", "VFX", "Animation", "Technical Art"],
  "UI/UX Design": ["UI Design", "UX Design", "UX Research"],
  "UA & Growth": ["Performance Marketing", "Creative Strategy", "ASO", "Influencer Marketing", "Brand Marketing"],
  "Analytics": ["Product Analytics", "Marketing Analytics", "Data Science", "BI/Reporting"],
  "LiveOps": ["LiveOps Management", "Community Management", "Player Support", "Event Design"],
  "QA": ["Manual QA", "QA Automation", "QA Lead"],
  "Leadership/Executive": ["Studio Head", "CPO", "CTO", "VP Engineering", "VP Product", "Art Director", "Creative Director"],
  "Other": ["Other"],
};

const EXPERIENCE_LEVELS = ["Entry", "Junior", "Mid", "Senior", "Lead", "Director", "VP", "C-Suite"];

const GAME_CATEGORIES = ["HyperCasual", "HybridCasual", "Casual", "Midcore", "Hardcore", "Social Casino", "RMG"];

const GENRES = [
  "Puzzle", "Simulation", "Strategy", "RPG", "Action", "Adventure", 
  "Sports", "Racing", "Card", "Board", "Idle", "Merge", "Match-3", 
  "Word", "Trivia", "Shooter", "Battle Royale", "MOBA", "MMO"
];

const JOB_TYPES = ["Full-time", "Contract", "Freelance"];

const WORKPLACE_PREFERENCES = ["Remote", "Hybrid", "On-site"];

const LOOKING_STATUS = [
  { value: "yes", label: "Yes, actively looking" },
  { value: "passive", label: "Open to the right opportunity" },
  { value: "no", label: "Not looking right now" },
];

export default function OnboardingPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [existingProfile, setExistingProfile] = useState<any>(null);

  const [formData, setFormData] = useState({
    discipline: "",
    speciality: "",
    experience_level: "",
    years_experience: "",
    current_title: "",
    current_company: "",
    game_categories: [] as string[],
    genres: [] as string[],
    job_types: [] as string[],
    workplace_preferences: [] as string[],
    looking_status: "",
    available_from: "",
    salary_minimum: "",
    salary_ideal: "",
    linkedin_url: "",
    portfolio_url: "",
    cv_url: "",
  });

  useEffect(() => {
    if (isLoaded && user) {
      loadExistingProfile();
    }
  }, [isLoaded, user]);

  async function loadExistingProfile() {
    if (!user) return;
    
    const { data } = await supabase
      .from("candidate_profiles")
      .select("*")
      .eq("clerk_id", user.id)
      .single();

    if (data) {
      setExistingProfile(data);
      // If profile is already complete, redirect to dashboard
      if (data.profile_complete) {
        router.push("/dashboard");
        return;
      }
      // Pre-fill form with existing data
      setFormData({
        discipline: data.discipline || "",
        speciality: data.speciality || "",
        experience_level: data.experience_level || "",
        years_experience: data.years_experience?.toString() || "",
        current_title: data.current_title || "",
        current_company: data.current_company || "",
        game_categories: data.game_categories || [],
        genres: data.genres || [],
        job_types: data.job_types || [],
        workplace_preferences: data.workplace_preferences || [],
        looking_status: data.looking_status || "",
        available_from: data.available_from || "",
        salary_minimum: data.salary_minimum || "",
        salary_ideal: data.salary_ideal || "",
        linkedin_url: data.linkedin_url || "",
        portfolio_url: data.portfolio_url || "",
        cv_url: data.cv_url || "",
      });
    }
    setCheckingProfile(false);
  }

  function updateField(field: string, value: any) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Reset speciality when discipline changes
    if (field === "discipline") {
      setFormData((prev) => ({ ...prev, speciality: "" }));
    }
  }

  function toggleArrayField(field: string, value: string) {
    setFormData((prev) => {
      const current = prev[field as keyof typeof prev] as string[];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter((v) => v !== value) };
      }
      return { ...prev, [field]: [...current, value] };
    });
  }

  async function handleSubmit() {
    if (!user) return;
    setLoading(true);

    const profileData = {
      clerk_id: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      first_name: user.firstName,
      last_name: user.lastName,
      discipline: formData.discipline,
      speciality: formData.speciality,
      experience_level: formData.experience_level,
      years_experience: parseInt(formData.years_experience) || null,
      current_title: formData.current_title,
      current_company: formData.current_company,
      game_categories: formData.game_categories,
      genres: formData.genres,
      job_types: formData.job_types,
      workplace_preferences: formData.workplace_preferences,
      looking_status: formData.looking_status,
      available_from: formData.available_from,
      salary_minimum: formData.salary_minimum,
      salary_ideal: formData.salary_ideal,
      linkedin_url: formData.linkedin_url,
      portfolio_url: formData.portfolio_url,
      cv_url: formData.cv_url,
      profile_complete: true,
      updated_at: new Date().toISOString(),
    };

    try {
      if (existingProfile) {
        await supabase
          .from("candidate_profiles")
          .update(profileData)
          .eq("clerk_id", user.id);
      } else {
        await supabase.from("candidate_profiles").insert([profileData]);
      }
      router.push("/dashboard");
    } catch (error) {
      console.error("Error saving profile:", error);
      setLoading(false);
    }
  }

  if (!isLoaded || checkingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-black">
        <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
      </div>
    );
  }

  const specialities = formData.discipline ? SPECIALITIES[formData.discipline] || [] : [];

  return (
    <div className="min-h-screen bg-brand-black">
      <div className="relative py-12">
        <HexagonBackground />
        <GradientBlur position="top-right" size="lg" color="orange" intensity="low" />
        <div className="relative mx-auto max-w-3xl px-6 lg:px-8">
          {/* Progress */}
          <div className="flex items-center justify-between mb-12">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                    step >= s
                      ? "bg-brand-orange text-white"
                      : "bg-white/10 text-white/50"
                  }`}
                >
                  {step > s ? <Check className="w-5 h-5" /> : s}
                </div>
                {s < 4 && (
                  <div
                    className={`w-16 sm:w-24 h-1 mx-2 rounded ${
                      step > s ? "bg-brand-orange" : "bg-white/10"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Professional Background */}
          {step === 1 && (
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-white font-heading mb-2">
                Let&apos;s start with your background
              </h2>
              <p className="text-white/60 mb-8">
                Tell us about your professional experience in mobile games.
              </p>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Discipline *
                  </label>
                  <select
                    value={formData.discipline}
                    onChange={(e) => updateField("discipline", e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-orange/50"
                  >
                    <option value="" className="bg-brand-black">Select your discipline</option>
                    {DISCIPLINES.map((d) => (
                      <option key={d} value={d} className="bg-brand-black">
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                {specialities.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Speciality
                    </label>
                    <select
                      value={formData.speciality}
                      onChange={(e) => updateField("speciality", e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-orange/50"
                    >
                      <option value="" className="bg-brand-black">Select your speciality</option>
                      {specialities.map((s) => (
                        <option key={s} value={s} className="bg-brand-black">
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Experience Level *
                  </label>
                  <select
                    value={formData.experience_level}
                    onChange={(e) => updateField("experience_level", e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-orange/50"
                  >
                    <option value="" className="bg-brand-black">Select your level</option>
                    {EXPERIENCE_LEVELS.map((level) => (
                      <option key={level} value={level} className="bg-brand-black">
                        {level}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Years in Games Industry
                  </label>
                  <input
                    type="number"
                    value={formData.years_experience}
                    onChange={(e) => updateField("years_experience", e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-orange/50"
                    placeholder="e.g. 5"
                    min="0"
                    max="50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Current Job Title *
                  </label>
                  <input
                    type="text"
                    value={formData.current_title}
                    onChange={(e) => updateField("current_title", e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-orange/50"
                    placeholder="e.g. Senior Game Designer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Current Company
                  </label>
                  <input
                    type="text"
                    value={formData.current_company}
                    onChange={(e) => updateField("current_company", e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-orange/50"
                    placeholder="e.g. Supercell"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Game Experience */}
          {step === 2 && (
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-white font-heading mb-2">
                Your game experience
              </h2>
              <p className="text-white/60 mb-8">
                What types of games have you worked on?
              </p>
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-white mb-4">
                    Game Categories *
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {GAME_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleArrayField("game_categories", cat)}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          formData.game_categories.includes(cat)
                            ? "bg-brand-orange border-brand-orange text-white"
                            : "bg-white/5 border-white/10 text-white/70 hover:border-white/30"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-4">
                    Genres
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {GENRES.map((genre) => (
                      <button
                        key={genre}
                        type="button"
                        onClick={() => toggleArrayField("genres", genre)}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          formData.genres.includes(genre)
                            ? "bg-brand-orange border-brand-orange text-white"
                            : "bg-white/5 border-white/10 text-white/70 hover:border-white/30"
                        }`}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Job Preferences */}
          {step === 3 && (
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-white font-heading mb-2">
                Job preferences
              </h2>
              <p className="text-white/60 mb-8">
                What are you looking for in your next role?
              </p>
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-white mb-4">
                    Job Types *
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {JOB_TYPES.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleArrayField("job_types", type)}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          formData.job_types.includes(type)
                            ? "bg-brand-orange border-brand-orange text-white"
                            : "bg-white/5 border-white/10 text-white/70 hover:border-white/30"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-4">
                    Workplace Preferences *
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {WORKPLACE_PREFERENCES.map((pref) => (
                      <button
                        key={pref}
                        type="button"
                        onClick={() => toggleArrayField("workplace_preferences", pref)}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          formData.workplace_preferences.includes(pref)
                            ? "bg-brand-orange border-brand-orange text-white"
                            : "bg-white/5 border-white/10 text-white/70 hover:border-white/30"
                        }`}
                      >
                        {pref}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-4">
                    Are you looking for new opportunities? *
                  </label>
                  <div className="space-y-3">
                    {LOOKING_STATUS.map((status) => (
                      <button
                        key={status.value}
                        type="button"
                        onClick={() => updateField("looking_status", status.value)}
                        className={`w-full px-4 py-3 rounded-lg border text-left transition-colors ${
                          formData.looking_status === status.value
                            ? "bg-brand-orange/20 border-brand-orange/50 text-white"
                            : "bg-white/5 border-white/10 text-white/70 hover:border-white/30"
                        }`}
                      >
                        {status.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Available from
                  </label>
                  <input
                    type="text"
                    value={formData.available_from}
                    onChange={(e) => updateField("available_from", e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-orange/50"
                    placeholder="e.g. Immediately, 2 weeks notice, etc."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Final Details */}
          {step === 4 && (
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-white font-heading mb-2">
                Final details
              </h2>
              <p className="text-white/60 mb-8">
                Help us understand your expectations and connect with you.
              </p>
              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Minimum Salary
                    </label>
                    <input
                      type="text"
                      value={formData.salary_minimum}
                      onChange={(e) => updateField("salary_minimum", e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-orange/50"
                      placeholder="e.g. £60,000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Ideal Salary
                    </label>
                    <input
                      type="text"
                      value={formData.salary_ideal}
                      onChange={(e) => updateField("salary_ideal", e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-orange/50"
                      placeholder="e.g. £80,000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={formData.linkedin_url}
                    onChange={(e) => updateField("linkedin_url", e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-orange/50"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Portfolio URL
                  </label>
                  <input
                    type="url"
                    value={formData.portfolio_url}
                    onChange={(e) => updateField("portfolio_url", e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-orange/50"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    CV/Resume URL
                  </label>
                  <input
                    type="url"
                    value={formData.cv_url}
                    onChange={(e) => updateField("cv_url", e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-orange/50"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="btn-ghost inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={
                  (step === 1 && (!formData.discipline || !formData.experience_level || !formData.current_title)) ||
                  (step === 2 && formData.game_categories.length === 0) ||
                  (step === 3 && (formData.job_types.length === 0 || formData.workplace_preferences.length === 0 || !formData.looking_status))
                }
                className="btn-primary inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary inline-flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Complete Profile
                    <Check className="w-5 h-5" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}