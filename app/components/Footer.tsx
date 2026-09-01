import { Link } from '@tanstack/react-router'
import {
  ExternalLink,
  Sparkles,
  ArrowUpRight,
  Lock,
} from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 text-sm">
      {/* Top Value Banner */}
      <div className="border-b border-slate-800/60 bg-gradient-to-r from-slate-950 via-slate-900/50 to-slate-950 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" /> High-Performance Engineering
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Ready to dominate local search and scale your business?
            </h3>
            <p className="text-sm text-slate-400">
              Get an in-depth audit of your local search presence, website speed, and conversion funnel.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/audit"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-slate-950 bg-emerald-500 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 transition-all duration-200 active:scale-95"
            >
              <span>Get Free Growth Audit</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Directory Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Company Bio Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group inline-flex">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 group-hover:border-emerald-500/50 transition-colors">
                <span className="font-mono font-bold text-sm text-white group-hover:text-emerald-400">
                  M
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base text-white group-hover:text-emerald-300 transition-colors">
                  Built by Miguel
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
            </Link>

            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              High-performance websites, local search rankings, and custom business systems.
            </p>

            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Engineered with full-stack TypeScript, automated client workflows, and surgical Google Business Profile optimization.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Available for select client partnerships</span>
            </div>
          </div>

          {/* Solutions Column */}
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
              Services
            </div>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/local-seo-gbp"
                  className="text-slate-400 hover:text-emerald-400 transition-colors inline-block"
                >
                  Local SEO & GBP
                </Link>
              </li>
              <li>
                <Link
                  to="/websites-care"
                  className="text-slate-400 hover:text-emerald-400 transition-colors inline-block"
                >
                  Websites & Care Plans
                </Link>
              </li>
              <li>
                <Link
                  to="/systems-auto"
                  className="text-slate-400 hover:text-emerald-400 transition-colors inline-block"
                >
                  Systems & Automation
                </Link>
              </li>
              <li>
                <Link
                  to="/audit"
                  className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors inline-flex items-center gap-1"
                >
                  <span>Free Performance Audit</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
              Company
            </div>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/about"
                  className="text-slate-400 hover:text-emerald-400 transition-colors inline-block"
                >
                  About Miguel
                </Link>
              </li>
              <li>
                <Link
                  to="/work"
                  className="text-slate-400 hover:text-emerald-400 transition-colors inline-block"
                >
                  Client Work & Proof
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-slate-400 hover:text-emerald-400 transition-colors inline-block"
                >
                  Contact & Inquiries
                </Link>
              </li>
              <li>
                <Link
                  to="/audit"
                  className="text-slate-400 hover:text-emerald-400 transition-colors inline-block"
                >
                  Request Consultation
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Portal & Resources Column */}
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
              Client Portal
            </div>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="https://app.builtbymiguel.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-slate-300 hover:text-emerald-400 font-medium transition-colors group"
                >
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Portal Login</span>
                  <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-emerald-400" />
                </a>
              </li>
              <li>
                <Link
                  to="/audit"
                  className="text-slate-400 hover:text-emerald-400 transition-colors inline-block"
                >
                  SEO Health Checker
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-slate-400 hover:text-emerald-400 transition-colors inline-block"
                >
                  Support Desk
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="border-t border-slate-800/80 bg-slate-950/90 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {currentYear} Built by Miguel. All rights reserved.
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <Link to="/privacy-policy" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-slate-300 transition-colors">
              Terms of Service
            </Link>
            <Link to="/cookie-policy" className="hover:text-slate-300 transition-colors">
              Cookie Policy
            </Link>
            <a
              href="https://app.builtbymiguel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-emerald-400 transition-colors inline-flex items-center gap-1"
            >
              <span>Portal Login</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
