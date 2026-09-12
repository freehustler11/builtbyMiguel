import { Link, useRouterState } from '@tanstack/react-router'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-[#FAF8F5] dark:bg-[#0B0F17] text-[#141522] dark:text-slate-200 text-xs sm:text-sm border-t border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Column 1: Logo & Tagline */}
          <div className="lg:col-span-4 space-y-3">
            <Link to="/" className="font-bold text-lg text-[#141522] dark:text-white font-display inline-block">
              built by Miguel
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-sans leading-relaxed max-w-xs">
              Digital marketing agency for small business. Custom web development, Google Maps SEO, and automated lead dispatch.
            </p>
            {/* Social Profile: Verified LinkedIn Only */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.linkedin.com/in/seo-specialist-miguel-umbac/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Miguel Umbac on LinkedIn"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:text-[#0A66C2] dark:hover:text-[#38BDF8] hover:border-[#0A66C2]/40 transition shadow-xs"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.25c-.9 0-1.63.73-1.63 1.63s.73 1.63 1.63 1.63 1.63-.73 1.63-1.63c0-.9-.73-1.63-1.63-1.63z" />
                </svg>
                <span className="font-semibold">Miguel Umbac</span>
              </a>
            </div>
            <div className="pt-4 text-[11px] text-slate-400 dark:text-slate-500 font-mono">
              © {currentYear} built by Miguel. All rights reserved
            </div>
          </div>

          {/* Column 2: Solutions */}
          <div className="lg:col-span-2 space-y-2.5">
            <div className="text-xs font-bold text-[#141522] dark:text-white font-display">
              Solutions
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 font-sans">
              <li><Link to="/seo" className="hover:text-black dark:hover:text-white">SEO</Link></li>
              <li><Link to="/local-seo-gbp" className="hover:text-black dark:hover:text-white">Local SEO</Link></li>
              <li><Link to="/national-seo" className="hover:text-black dark:hover:text-white">National SEO</Link></li>
              <li><Link to="/aeo-geo" className="hover:text-black dark:hover:text-white">AEO & GEO</Link></li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className="lg:col-span-2 space-y-2.5">
            <div className="text-xs font-bold text-[#141522] dark:text-white font-display">
              Support
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 font-sans">
              <li><Link to="/audit" className="hover:text-black dark:hover:text-white">Free Audit</Link></li>
              <li><Link to="/website-demo" className="hover:text-black dark:hover:text-white">Free Demo</Link></li>
              <li><Link to="/contact" className="hover:text-black dark:hover:text-white">Contact</Link></li>
            </ul>
          </div>

          {/* Column 4: Company */}
          <div className="lg:col-span-2 space-y-2.5">
            <div className="text-xs font-bold text-[#141522] dark:text-white font-display">
              Company
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 font-sans">
              <li><Link to="/about" className="hover:text-black dark:hover:text-white">About</Link></li>
              <li><Link to="/blog" className="hover:text-black dark:hover:text-white">Blog</Link></li>
              <li><Link to="/work" className="hover:text-black dark:hover:text-white">Work</Link></li>
            </ul>
          </div>

          {/* Column 5: Legal */}
          <div className="lg:col-span-2 space-y-2.5">
            <div className="text-xs font-bold text-[#141522] dark:text-white font-display">
              Legal
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 font-sans">
              <li><Link to="/privacy-policy" className="hover:text-black dark:hover:text-white">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-black dark:hover:text-white">Terms</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
