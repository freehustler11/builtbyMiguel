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
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F17] text-slate-600 dark:text-slate-400 text-sm transition-colors duration-200">
      {/* Top Value Banner */}
      <div className="border-b border-slate-100 dark:border-slate-800/80 bg-gradient-to-b from-[#fafafc] to-white dark:from-[#111827] dark:to-[#0B0F17] py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left max-w-2xl">
            <div className="mb-3.5 sm:mb-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-rose-600 dark:text-rose-400 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" /> High-Performance Engineering
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight leading-snug mb-2.5 sm:mb-3">
              Ready to dominate local search and scale your business?
            </h3>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Get an in-depth audit of your local search presence, website speed, and conversion funnel.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/audit"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base text-white bg-slate-900 dark:bg-rose-600 hover:bg-black dark:hover:bg-rose-500 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 active:scale-95"
            >
              <span>Get Free Growth Audit</span>
              <ArrowUpRight className="w-4 h-4 text-rose-400 dark:text-white" />
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
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-slate-900 dark:bg-rose-500/10 border border-transparent dark:border-rose-500/30 text-white dark:text-rose-400 font-mono font-bold text-sm">
                M
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                  Built by Miguel
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              </div>
            </Link>

            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              High-performance websites, local search rankings, and custom business systems.
            </p>

            <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed max-w-sm">
              Engineered with full-stack TypeScript, automated client workflows, and surgical Google Business Profile optimization.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Available for select client partnerships</span>
            </div>
          </div>

          {/* Solutions Column */}
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold">
              Services
            </div>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/local-seo-gbp"
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors inline-block"
                >
                  Local SEO & GBP
                </Link>
              </li>
              <li>
                <Link
                  to="/websites-care"
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors inline-block"
                >
                  Websites & Care Plans
                </Link>
              </li>
              <li>
                <Link
                  to="/systems-auto"
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors inline-block"
                >
                  Systems & Automation
                </Link>
              </li>
              <li>
                <Link
                  to="/audit"
                  className="text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-semibold transition-colors inline-flex items-center gap-1"
                >
                  <span>Free Performance Audit</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold">
              Company
            </div>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/about"
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors inline-block"
                >
                  About Miguel
                </Link>
              </li>
              <li>
                <Link
                  to="/work"
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors inline-block"
                >
                  Client Work & Proof
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors inline-block"
                >
                  Blog & Playbooks
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors inline-block"
                >
                  Contact & Inquiries
                </Link>
              </li>
              <li>
                <Link
                  to="/audit"
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors inline-block"
                >
                  Request Consultation
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Portal Column */}
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold">
              Client Portal
            </div>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-slate-800 dark:text-slate-200 hover:text-rose-600 dark:hover:text-rose-400 font-semibold transition-colors group"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-700 dark:text-slate-400" />
                  <span>Portal Login</span>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-rose-600 dark:group-hover:text-rose-400" />
                </Link>
              </li>
              <li>
                <Link
                  to="/audit"
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors inline-block"
                >
                  SEO Health Checker
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors inline-block"
                >
                  Support Desk
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="border-t border-slate-100 dark:border-slate-800 bg-[#fafafc] dark:bg-[#070A0F] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 dark:text-slate-500">
          <div>
            © {currentYear} Built by Miguel. All rights reserved.
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <Link to="/privacy-policy" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
              Terms of Service
            </Link>
            <Link to="/cookie-policy" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
              Cookie Policy
            </Link>
            <Link
              to="/login"
              className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors inline-flex items-center gap-1"
            >
              <span>Portal Login</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
