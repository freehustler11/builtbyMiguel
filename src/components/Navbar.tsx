import { Link } from '@tanstack/react-router'
import {
  ChevronDown,
  Menu,
  X,
  Search,
  Globe,
  Cpu,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { ThemeToggle } from './ThemeToggle'

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [solutionsOpen, setSolutionsOpen] = useState(false)
  const [mobileSolutionsExpanded, setMobileSolutionsExpanded] = useState(true)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close mega menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setSolutionsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#CBD5E1]/70 dark:border-slate-800 bg-[#FAF8F5]/95 dark:bg-[#141522]/95 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo Lockup */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 dark:focus-visible:ring-rose-500 rounded-2xl p-1">
            <div className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-slate-900 dark:bg-[#06B6D4]/10 border border-slate-800 dark:border-[#06B6D4]/30 shadow-md group-hover:scale-105 transition-all duration-200 shrink-0">
              <span className="font-mono font-bold text-sm sm:text-lg text-white dark:text-[#38BDF8]">
                M
              </span>
              <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 flex h-2.5 w-2.5 sm:h-3 sm:w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F59E0B] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-[#F59E0B] ring-2 ring-white dark:ring-[#0B132B]" />
              </span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base sm:text-lg tracking-tight text-[#1E293B] dark:text-white group-hover:text-[#0EA5E9] dark:group-hover:text-[#38BDF8] transition-colors">
                  built by Miguel
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-mono tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                Websites · SEO · Systems
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
            {/* Solutions Mega Menu Trigger */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setSolutionsOpen(!solutionsOpen)}
                onMouseEnter={() => setSolutionsOpen(true)}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full transition-all duration-150 cursor-pointer ${
                  solutionsOpen
                    ? 'text-[#1E293B] dark:text-white bg-[#CBD5E1]/40 dark:bg-slate-800 font-semibold'
                    : 'text-[#1E293B]/80 dark:text-slate-300 hover:text-[#1E293B] dark:hover:text-white hover:bg-[#CBD5E1]/30 dark:hover:bg-slate-800/60'
                }`}
                aria-expanded={solutionsOpen}
                aria-haspopup="true"
              >
                <span>Solutions</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    solutionsOpen ? 'rotate-180 text-slate-900 dark:text-white' : 'text-slate-400'
                  }`}
                />
              </button>

              {/* Mega Menu Dropdown Panel */}
              {solutionsOpen && (
                <div
                  onMouseLeave={() => setSolutionsOpen(false)}
                  className="absolute left-1/2 -translate-x-1/2 mt-3 w-[880px] rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-150 z-50 overflow-hidden"
                >
                  <div className="grid grid-cols-3 gap-6 p-7">
                    {/* Column 1: SEO */}
                    <div className="space-y-3">
                      <div>
                        <Link
                          to="/seo"
                          onClick={() => setSolutionsOpen(false)}
                          className="font-bold text-base text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 font-display flex items-center gap-2 group"
                        >
                          <Search className="w-4 h-4 text-amber-500" />
                          <span>SEO</span>
                        </Link>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Rank locally, nationally, or in AI search
                        </p>
                      </div>

                      <div className="space-y-1 pt-1">
                        <Link
                          to="/seo/local"
                          onClick={() => setSolutionsOpen(false)}
                          className="block p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition group"
                        >
                          <div className="text-xs font-semibold text-slate-900 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-400">
                            Local SEO
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                            Map Pack rankings for one service area
                          </div>
                        </Link>

                        <Link
                          to="/seo/national"
                          onClick={() => setSolutionsOpen(false)}
                          className="block p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition group"
                        >
                          <div className="text-xs font-semibold text-slate-900 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-400">
                            National SEO
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                            Multi-state and franchise reach
                          </div>
                        </Link>

                        <Link
                          to="/seo/aeo-geo"
                          onClick={() => setSolutionsOpen(false)}
                          className="block p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition group"
                        >
                          <div className="text-xs font-semibold text-slate-900 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-400">
                            AEO & GEO
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                            Get cited by ChatGPT and AI search
                          </div>
                        </Link>
                      </div>
                    </div>

                    {/* Column 2: Websites */}
                    <div className="space-y-3">
                      <div>
                        <Link
                          to="/websites"
                          onClick={() => setSolutionsOpen(false)}
                          className="font-bold text-base text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 font-display flex items-center gap-2 group"
                        >
                          <Globe className="w-4 h-4 text-amber-500" />
                          <span>Websites</span>
                        </Link>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Fast, custom-built sites that convert
                        </p>
                      </div>

                      <div className="space-y-1 pt-1">
                        <Link
                          to="/websites/design-and-development"
                          onClick={() => setSolutionsOpen(false)}
                          className="block p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition group"
                        >
                          <div className="text-xs font-semibold text-slate-900 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-400">
                            Website Design
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                            New builds and full redesigns
                          </div>
                        </Link>

                        <Link
                          to="/websites/hosting-and-maintenance"
                          onClick={() => setSolutionsOpen(false)}
                          className="block p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition group"
                        >
                          <div className="text-xs font-semibold text-slate-900 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-400">
                            Hosting & Care
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                            Ongoing speed, security, updates
                          </div>
                        </Link>
                      </div>
                    </div>

                    {/* Column 3: Systems & Automation */}
                    <div className="space-y-3">
                      <div>
                        <Link
                          to="/systems-auto"
                          onClick={() => setSolutionsOpen(false)}
                          className="font-bold text-base text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 font-display flex items-center gap-2 group"
                        >
                          <Cpu className="w-4 h-4 text-amber-500" />
                          <span>Systems & Automation</span>
                        </Link>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Leads that text your phone instantly
                        </p>
                      </div>

                      <div className="pt-2 text-xs text-slate-400 dark:text-slate-500 italic">
                        Integrated lead capture and automated dispatch workflows.
                      </div>
                    </div>
                  </div>

                  {/* Bottom CTA Strip */}
                  <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 px-7 py-3.5 flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                      Not sure where to start?
                    </span>
                    <Link
                      to="/audit"
                      onClick={() => setSolutionsOpen(false)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition shadow-xs cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                      <span>Get Your Free Audit</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Standard Links */}
            <Link
              to="/work"
              activeProps={{
                className: 'text-[#1E293B] dark:text-white bg-[#CBD5E1]/40 dark:bg-slate-800 font-semibold',
              }}
              inactiveProps={{
                className: 'text-[#1E293B]/80 dark:text-slate-300 hover:text-[#1E293B] dark:hover:text-white hover:bg-[#CBD5E1]/30 dark:hover:bg-slate-800/60',
              }}
              className="px-4 py-2 text-sm font-medium rounded-full transition-all duration-150"
            >
              Work
            </Link>

            <Link
              to="/blog"
              activeProps={{
                className: 'text-[#1E293B] dark:text-white bg-[#CBD5E1]/40 dark:bg-slate-800 font-semibold',
              }}
              inactiveProps={{
                className: 'text-[#1E293B]/80 dark:text-slate-300 hover:text-[#1E293B] dark:hover:text-white hover:bg-[#CBD5E1]/30 dark:hover:bg-slate-800/60',
              }}
              className="px-4 py-2 text-sm font-medium rounded-full transition-all duration-150"
            >
              Blog
            </Link>

            <Link
              to="/about"
              activeProps={{
                className: 'text-[#1E293B] dark:text-white bg-[#CBD5E1]/40 dark:bg-slate-800 font-semibold',
              }}
              inactiveProps={{
                className: 'text-[#1E293B]/80 dark:text-slate-300 hover:text-[#1E293B] dark:hover:text-white hover:bg-[#CBD5E1]/30 dark:hover:bg-slate-800/60',
              }}
              className="px-4 py-2 text-sm font-medium rounded-full transition-all duration-150"
            >
              About
            </Link>

            <Link
              to="/contact"
              activeProps={{
                className: 'text-[#1E293B] dark:text-white bg-[#CBD5E1]/40 dark:bg-slate-800 font-semibold',
              }}
              inactiveProps={{
                className: 'text-[#1E293B]/80 dark:text-slate-300 hover:text-[#1E293B] dark:hover:text-white hover:bg-[#CBD5E1]/30 dark:hover:bg-slate-800/60',
              }}
              className="px-4 py-2 text-sm font-medium rounded-full transition-all duration-150"
            >
              Contact
            </Link>
          </nav>

          {/* Desktop Right Action Area */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Dark Mode Theme Toggle */}
            <ThemeToggle variant="pill" />

            {/* Primary CTA: Get My Free Audit */}
            <Link
              to="/audit"
              className="relative inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold text-[#0B132B] bg-[#F59E0B] hover:bg-[#D97706] shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B]"
            >
              <Sparkles className="w-4 h-4 text-[#0B132B] fill-[#0B132B]" />
              <span>Get My Free Audit</span>
            </Link>
          </div>

          {/* Mobile Action Cluster */}
          <div className="flex lg:hidden items-center gap-1.5 sm:gap-2">
            <ThemeToggle variant="pill" />

            <Link
              to="/audit"
              className="inline-flex items-center gap-1 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-bold text-[#0B132B] bg-[#F59E0B] hover:bg-[#D97706] transition active:scale-95 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0B132B] fill-[#0B132B]" />
              <span>Free Audit</span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none cursor-pointer active:scale-95 transition-all"
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 dark:border-slate-800 bg-white/98 dark:bg-[#0B0F17]/98 px-4 pt-3 pb-6 space-y-4 backdrop-blur-2xl shadow-xl max-h-[calc(100vh-5rem)] overflow-y-auto">
          {/* Solutions Accordion Section */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setMobileSolutionsExpanded(!mobileSolutionsExpanded)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold"
            >
              <span>Solutions</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  mobileSolutionsExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>

            {mobileSolutionsExpanded && (
              <div className="pl-2 space-y-4 pt-1">
                {/* SEO Pillar */}
                <div className="space-y-1.5 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
                  <Link
                    to="/seo"
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2"
                  >
                    <Search className="w-3.5 h-3.5 text-amber-500" />
                    <span>SEO</span>
                  </Link>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Rank locally, nationally, or in AI search
                  </p>
                  <div className="space-y-1 pt-1 border-t border-slate-200/50 dark:border-slate-800/50">
                    <Link
                      to="/seo/local"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-xs text-slate-700 dark:text-slate-300 hover:text-amber-600 py-1"
                    >
                      <span className="font-medium">Local SEO</span>
                      <span className="text-[10px] text-slate-400 block">Map Pack rankings for one service area</span>
                    </Link>
                    <Link
                      to="/seo/national"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-xs text-slate-700 dark:text-slate-300 hover:text-amber-600 py-1"
                    >
                      <span className="font-medium">National SEO</span>
                      <span className="text-[10px] text-slate-400 block">Multi-state and franchise reach</span>
                    </Link>
                    <Link
                      to="/seo/aeo-geo"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-xs text-slate-700 dark:text-slate-300 hover:text-amber-600 py-1"
                    >
                      <span className="font-medium">AEO & GEO</span>
                      <span className="text-[10px] text-slate-400 block">Get cited by ChatGPT and AI search</span>
                    </Link>
                  </div>
                </div>

                {/* Websites Pillar */}
                <div className="space-y-1.5 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
                  <Link
                    to="/websites"
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2"
                  >
                    <Globe className="w-3.5 h-3.5 text-amber-500" />
                    <span>Websites</span>
                  </Link>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Fast, custom-built sites that convert
                  </p>
                  <div className="space-y-1 pt-1 border-t border-slate-200/50 dark:border-slate-800/50">
                    <Link
                      to="/websites/design-and-development"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-xs text-slate-700 dark:text-slate-300 hover:text-amber-600 py-1"
                    >
                      <span className="font-medium">Website Design</span>
                      <span className="text-[10px] text-slate-400 block">New builds and full redesigns</span>
                    </Link>
                    <Link
                      to="/websites/hosting-and-maintenance"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-xs text-slate-700 dark:text-slate-300 hover:text-amber-600 py-1"
                    >
                      <span className="font-medium">Hosting & Care</span>
                      <span className="text-[10px] text-slate-400 block">Ongoing speed, security, updates</span>
                    </Link>
                  </div>
                </div>

                {/* Systems & Automation Pillar */}
                <div className="space-y-1.5 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
                  <Link
                    to="/systems-auto"
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2"
                  >
                    <Cpu className="w-3.5 h-3.5 text-amber-500" />
                    <span>Systems & Automation</span>
                  </Link>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Leads that text your phone instantly
                  </p>
                </div>

                {/* Mobile Bottom Audit Prompt */}
                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200/60 dark:border-amber-800/50 text-center space-y-2">
                  <p className="text-xs text-amber-900 dark:text-amber-200 font-medium">
                    Not sure where to start?
                  </p>
                  <Link
                    to="/audit"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                    <span>Get Your Free Audit</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Other Navigation Links */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 py-1 font-bold">
              Navigation
            </div>
            <Link
              to="/work"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-2xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60"
            >
              <span>Client Work & Proof</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>

            <Link
              to="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-2xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60"
            >
              <span>Blog & Articles</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>

            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-2xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60"
            >
              <span>About Miguel</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>

            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-2xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60"
            >
              <span>Contact</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <ThemeToggle variant="row" />

            <Link
              to="/audit"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-full font-semibold text-sm text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-md transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Get Free Growth Audit</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
