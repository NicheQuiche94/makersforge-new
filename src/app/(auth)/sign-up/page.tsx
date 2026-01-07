import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <SignUp
      appearance={{
        elements: {
          rootBox: "mx-auto",
          card: "bg-brand-black-light border border-white/10 shadow-xl",
          headerTitle: "text-white",
          headerSubtitle: "text-white/60",
          socialButtonsBlockButton: "bg-white/10 border-white/20 text-white hover:bg-white/20",
          formFieldLabel: "text-white/80",
          formFieldInput: "bg-white/5 border-white/10 text-white",
          footerActionLink: "text-brand-orange hover:text-brand-orange/80",
          formButtonPrimary: "bg-brand-orange hover:bg-brand-orange/90",
        },
      }}
      signInUrl="/sign-in"
      forceRedirectUrl="/onboarding"
    />
  );
}