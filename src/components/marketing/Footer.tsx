import Link from "next/link";
import { Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-brand-black-light border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/">
              <img
                src="/images/mf-icon-white.png"
                alt="MakersForge"
                className="h-8"
              />
            </Link>
            <p className="mt-4 text-brand-white-muted max-w-md">
              The mobile gaming talent specialists.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Company</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/about" className="text-brand-white-muted hover:text-white transition-colors">About</Link>
              </li>
              <li>
                <Link href="/services" className="text-brand-white-muted hover:text-white transition-colors">Services</Link>
              </li>
              <li>
                <Link href="/contact" className="text-brand-white-muted hover:text-white transition-colors">Contact</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">For Talent</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/for-talent" className="text-brand-white-muted hover:text-white transition-colors">Join our network</Link>
              </li>
              <li>
                <Link href="/sign-in" className="text-brand-white-muted hover:text-white transition-colors">Sign in</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/10 flex justify-between items-center">
          <p className="text-brand-white-muted text-sm">MakersForge Ltd.</p>
          <a href="https://www.linkedin.com/company/makers-forge/" target="_blank" rel="noopener noreferrer" className="text-brand-white-muted hover:text-white transition-colors">
            <Linkedin className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}