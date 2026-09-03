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
  ExternalLink,
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { ThemeToggle } from './ThemeToggle'

export interface NavItem {
  label: string
  to: string
  description?: string
  icon?: React.ComponentType<{ className?: string }>
}

export const SERVICE_ITEMS: NavItem[] = [
  {
    label: 'Local SEO & GBP',
    to: '/local-seo-gbp',
    description: 'Dominate Google Maps and high-intent local search queries.',
    icon: Search,
  },
  {
    label: 'Websites & Care',
    to: '/websites-care',
    description: 'Ultra-fast, conversion-optimized sites with ongoing maintenance.',
    icon: Globe,
  },
  {
    label: 'Systems & Automation',
    to: '/systems-auto',
    description: 'Automate CRM, client booking, follow-ups, and workflows.',
    icon: Cpu,
  },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setServicesDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-[#0B0F17]/85 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo Lockup */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 dark:focus-visible:ring-rose-500 rounded-2xl p-1">
            <div className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-slate-900 dark:bg-rose-500/10 border border-slate-800 dark:border-rose-500/30 shadow-md group-hover:scale-105 transition-all duration-200 shrink-0">
              <span className="font-mono font-bold text-sm sm:text-lg text-white dark:text-rose-400">
                M
              </span>
              <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 flex h-2.5 w-2.5 sm:h-3 sm:w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-rose-500 ring-2 ring-white dark:ring-[#0B0F17]" />
              </span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                  Built by Miguel
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-mono tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                Websites · SEO · Systems
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
            {/* Services Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                onMouseEnter={() => setServicesDropdownOpen(true)}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full transition-all duration-150 cursor-pointer ${
                  servicesDropdownOpen
                    ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                }`}
                aria-expanded={servicesDropdownOpen}
                aria-haspopup="true"
              >
                <span>Services</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    servicesDropdownOpen ? 'rotate-180 text-slate-900 dark:text-white' : 'text-slate-400'
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {servicesDropdownOpen && (
                <div
                  onMouseLeave={() => setServicesDropdownOpen(false)}
                  className="absolute left-0 mt-2 w-80 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#111827]/98 p-3 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150 z-50"
                >
                  <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 py-1.5 font-bold">
                    Core Solutions
                  </div>
                  <div className="space-y-1">
                    {SERVICE_ITEMS.map((service) => {
                      const Icon = service.icon || Sparkles
                      return (
                        <Link
                          key={service.to}
                          to={service.to}
                          onClick={() => setServicesDropdownOpen(false)}
                          activeProps={{
                            className: 'bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-white font-semibold',
                          }}
                          inactiveProps={{
                            className: 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50',
                          }}
                          className="flex items-start gap-3.5 p-3 rounded-2xl border border-transparent transition-all duration-150 group"
                        >
                          <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 group-hover:scale-105 transition-all">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-slate-900 dark:text-slate-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                              {service.label}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
                              {service.description}
                            </p>
                          </div>
                        </Link>
                      )
                    })}
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 px-3 pb-1">
                    <Link
                      to="/audit"
                      onClick={() => setServicesDropdownOpen(false)}
                      className="flex items-center justify-between text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 transition-colors"
                    >
                      <span>Need a custom growth plan?</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Standard Links */}
            <Link
              to="/work"
              activeProps={{
                className: 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 font-semibold',
              }}
              inactiveProps={{
                className: 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60',
              }}
              className="px-4 py-2 text-sm font-medium rounded-full transition-all duration-150"
            >
              Work
            </Link>

            <Link
              to="/about"
              activeProps={{
                className: 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 font-semibold',
              }}
              inactiveProps={{
                className: 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60',
              }}
              className="px-4 py-2 text-sm font-medium rounded-full transition-all duration-150"
            >
              About
            </Link>

            <Link
              to="/contact"
              activeProps={{
                className: 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 font-semibold',
              }}
              inactiveProps={{
                className: 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60',
              }}
              className="px-4 py-2 text-sm font-medium rounded-full transition-all duration-150"
            >
              Contact
            </Link>
          </nav>

          {/* Desktop Right Action Area */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/login"
              className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1 px-2 py-1"
            >
              Portal Login
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </Link>

            {/* Dark Mode Theme Toggle */}
            <ThemeToggle variant="pill" />

            {/* Primary CTA */}
            <Link
              to="/audit"
              className="relative inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-slate-900 dark:bg-rose-600 dark:hover:bg-rose-500 hover:bg-black shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 dark:focus-visible:ring-rose-500"
            >
              <Sparkles className="w-4 h-4 text-rose-400 dark:text-rose-200 fill-rose-400 dark:fill-rose-200" />
              <span>Get Free Audit</span>
            </Link>
          </div>

          {/* Mobile Action Cluster */}
          <div className="flex lg:hidden items-center gap-1.5 sm:gap-2">
            <ThemeToggle variant="pill" />

            <Link
              to="/audit"
              className="inline-flex items-center gap-1 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full text-xs font-semibold text-white bg-slate-900 dark:bg-rose-600 hover:bg-black dark:hover:bg-rose-500 transition active:scale-95 shadow-sm"
            >
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-400 dark:text-rose-200" />
              <span>Audit</span>
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
        <div className="lg:hidden border-b border-slate-200 dark:border-slate-800 bg-white/98 dark:bg-[#0B0F17]/98 px-4 pt-3 pb-6 space-y-4 backdrop-blur-2xl shadow-xl">
          <div className="space-y-1">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 py-1 font-bold">
              Services
            </div>
            {SERVICE_ITEMS.map((service) => {
              const Icon = service.icon || Sparkles
              return (
                <Link
                  key={service.to}
                  to={service.to}
                  onClick={() => setMobileMenuOpen(false)}
                  activeProps={{
                    className: 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 font-semibold',
                  }}
                  inactiveProps={{
                    className: 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60',
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium"
                >
                  <Icon className="w-4 h-4 text-slate-800 dark:text-slate-200" />
                  <span>{service.label}</span>
                </Link>
              )
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 py-1 font-bold">
              Navigation
            </div>
            <Link
              to="/work"
              onClick={() => setMobileMenuOpen(false)}
              activeProps={{
                className: 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 font-semibold',
              }}
              inactiveProps={{
                className: 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60',
              }}
              className="flex items-center justify-between px-3 py-2.5 rounded-2xl text-sm font-medium"
            >
              <span>Work / Case Studies</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>

            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              activeProps={{
                className: 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 font-semibold',
              }}
              inactiveProps={{
                className: 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60',
              }}
              className="flex items-center justify-between px-3 py-2.5 rounded-2xl text-sm font-medium"
            >
              <span>About Miguel</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>

            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              activeProps={{
                className: 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 font-semibold',
              }}
              inactiveProps={{
                className: 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60',
              }}
              className="flex items-center justify-between px-3 py-2.5 rounded-2xl text-sm font-medium"
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
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-full font-semibold text-sm text-white bg-slate-900 dark:bg-rose-600 hover:bg-black dark:hover:bg-rose-500 shadow-md"
            >
              <Sparkles className="w-4 h-4 text-rose-400 dark:text-rose-200" />
              <span>Get Free Growth Audit</span>
            </Link>

            <div className="flex items-center justify-center pt-1">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5"
              >
                <span>Client Portal Login</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
