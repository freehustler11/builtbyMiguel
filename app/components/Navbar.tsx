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
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-xl p-1">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 group-hover:border-emerald-500/50 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] transition-all duration-300">
              <span className="font-mono font-bold text-lg text-white group-hover:text-emerald-400 transition-colors">
                M
              </span>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 ring-2 ring-slate-950" />
              </span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                  Built by Miguel
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
              <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase">
                Websites · SEO · Systems
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5" aria-label="Main Navigation">
            {/* Services Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                onMouseEnter={() => setServicesDropdownOpen(true)}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-150 cursor-pointer ${
                  servicesDropdownOpen
                    ? 'text-emerald-400 bg-slate-900 border border-slate-800'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                }`}
                aria-expanded={servicesDropdownOpen}
                aria-haspopup="true"
              >
                <span>Services</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    servicesDropdownOpen ? 'rotate-180 text-emerald-400' : 'text-slate-400'
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {servicesDropdownOpen && (
                <div
                  onMouseLeave={() => setServicesDropdownOpen(false)}
                  className="absolute left-0 mt-2 w-80 rounded-2xl border border-slate-800 bg-slate-900/95 p-3 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150 z-50"
                >
                  <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 px-3 py-1.5">
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
                            className: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
                          }}
                          inactiveProps={{
                            className: 'border-transparent text-slate-300 hover:text-white hover:bg-slate-800/80',
                          }}
                          className="flex items-start gap-3.5 p-3 rounded-xl border transition-all duration-150 group"
                        >
                          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-emerald-400 group-hover:border-emerald-500/40 group-hover:scale-105 transition-all">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-white group-hover:text-emerald-300 transition-colors">
                              {service.label}
                            </div>
                            <p className="text-xs text-slate-400 leading-snug mt-0.5">
                              {service.description}
                            </p>
                          </div>
                        </Link>
                      )
                    })}
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-800/80 px-3 pb-1">
                    <Link
                      to="/audit"
                      onClick={() => setServicesDropdownOpen(false)}
                      className="flex items-center justify-between text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
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
                className: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
              }}
              inactiveProps={{
                className: 'text-slate-300 hover:text-white hover:bg-slate-900/60 border-transparent',
              }}
              className="px-3.5 py-2 text-sm font-medium rounded-lg border transition-all duration-150"
            >
              Work
            </Link>

            <Link
              to="/about"
              activeProps={{
                className: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
              }}
              inactiveProps={{
                className: 'text-slate-300 hover:text-white hover:bg-slate-900/60 border-transparent',
              }}
              className="px-3.5 py-2 text-sm font-medium rounded-lg border transition-all duration-150"
            >
              About
            </Link>

            <Link
              to="/contact"
              activeProps={{
                className: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
              }}
              inactiveProps={{
                className: 'text-slate-300 hover:text-white hover:bg-slate-900/60 border-transparent',
              }}
              className="px-3.5 py-2 text-sm font-medium rounded-lg border transition-all duration-150"
            >
              Contact
            </Link>
          </nav>

          {/* Desktop Right Action Area */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="https://app.builtbymiguel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1"
            >
              Portal Login
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>

            {/* Primary CTA */}
            <Link
              to="/audit"
              className="relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-950 bg-emerald-500 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 transition-all duration-200 active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950" />
              <span>Get Free Audit</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-3">
            <Link
              to="/audit"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-950 bg-emerald-500 hover:bg-emerald-400 transition active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Audit</span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950/98 px-4 pt-3 pb-6 space-y-4 backdrop-blur-2xl">
          <div className="space-y-1">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 px-3 py-1">
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
                    className: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
                  }}
                  inactiveProps={{
                    className: 'text-slate-300 hover:text-white hover:bg-slate-900 border-transparent',
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl border text-sm font-medium"
                >
                  <Icon className="w-4 h-4 text-emerald-400" />
                  <span>{service.label}</span>
                </Link>
              )
            })}
          </div>

          <div className="pt-2 border-t border-slate-800/80 space-y-1">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 px-3 py-1">
              Navigation
            </div>
            <Link
              to="/work"
              onClick={() => setMobileMenuOpen(false)}
              activeProps={{
                className: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
              }}
              inactiveProps={{
                className: 'text-slate-300 hover:text-white hover:bg-slate-900 border-transparent',
              }}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl border text-sm font-medium"
            >
              <span>Work / Case Studies</span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </Link>

            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              activeProps={{
                className: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
              }}
              inactiveProps={{
                className: 'text-slate-300 hover:text-white hover:bg-slate-900 border-transparent',
              }}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl border text-sm font-medium"
            >
              <span>About Miguel</span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </Link>

            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              activeProps={{
                className: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
              }}
              inactiveProps={{
                className: 'text-slate-300 hover:text-white hover:bg-slate-900 border-transparent',
              }}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl border text-sm font-medium"
            >
              <span>Contact</span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-800/80 space-y-3">
            <Link
              to="/audit"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-slate-950 bg-emerald-500 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Get Free Growth Audit</span>
            </Link>

            <div className="flex items-center justify-center pt-1">
              <a
                href="https://app.builtbymiguel.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-slate-400 hover:text-emerald-400 flex items-center gap-1.5"
              >
                <span>Client Portal Login</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
