import { Link, useRouterState } from '@tanstack/react-router'

export function Footer() {
  const currentYear = new Date().getFullYear()
  const routerPath = useRouterState({ select: (s) => s.location.pathname })
  const browserPath = typeof window !== 'undefined' ? window.location.pathname : ''
  const currentPath = routerPath || browserPath || ''

  return (
    <footer className="bg-[#0B132B] text-white text-sm border-t border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Column 1: Logo & Bio */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group inline-flex">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono font-bold text-sm">
                M
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base text-white font-['Space_Grotesk']">
                  built by Miguel
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
              </div>
            </Link>

            <p className="text-sm text-slate-300 leading-relaxed font-['IBM_Plex_Sans'] max-w-xs">
              Fast websites, top Google Maps rankings, and automated lead systems for local businesses.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Taking on new clients this month</span>
            </div>
          </div>

          {/* Column 2: Services */}
          <div className="space-y-4">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
              Services
            </div>
            <ul className="space-y-2.5 text-sm font-['IBM_Plex_Sans']">
              <li>
                <Link to="/seo" className="text-slate-300 hover:text-white transition-colors">
                  SEO Services
                </Link>
              </li>
              <li>
                <Link to="/local-seo-gbp" className="text-slate-300 hover:text-white transition-colors">
                  Local SEO & GBP
                </Link>
              </li>
              <li>
                <Link to="/national-seo" className="text-slate-300 hover:text-white transition-colors">
                  National SEO
                </Link>
              </li>
              <li>
                <Link to="/aeo-geo" className="text-slate-300 hover:text-white transition-colors">
                  AEO & GEO
                </Link>
              </li>
              <li>
                <Link to="/websites" className="text-slate-300 hover:text-white transition-colors">
                  Websites & Care
                </Link>
              </li>
              <li>
                <Link to="/systems-auto" className="text-slate-300 hover:text-white transition-colors">
                  Systems & Automation
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Solutions & Offers */}
          <div className="space-y-4">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
              Solutions & Proof
            </div>
            <ul className="space-y-2.5 text-sm font-['IBM_Plex_Sans']">
              <li>
                <Link to="/audit" className="text-[#F59E0B] hover:text-amber-300 font-medium transition-colors">
                  Free Video Audit
                </Link>
              </li>
              <li>
                <Link to="/website-demo" className="text-[#F59E0B] hover:text-amber-300 font-medium transition-colors">
                  Free Website Demo
                </Link>
              </li>
              <li>
                <Link to="/work" className="text-slate-300 hover:text-white transition-colors">
                  Client Work & Proof
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-300 hover:text-white transition-colors">
                  About Miguel
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Resources & Legal */}
          <div className="space-y-4">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
              Resources & Legal
            </div>
            <ul className="space-y-2.5 text-sm font-['IBM_Plex_Sans']">
              <li>
                <Link to="/blog" className="text-slate-300 hover:text-white transition-colors">
                  Blog & Articles
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-300 hover:text-white transition-colors">
                  Contact & Inquiries
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-slate-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-slate-300 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="text-slate-300 hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {currentYear} built by Miguel. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>Remote · Nationwide · U.S. Only</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
