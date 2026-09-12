import { Link, useRouterState } from '@tanstack/react-router'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-[#FAF8F5] text-[#141522] text-xs sm:text-sm border-t border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Column 1: Logo & Tagline */}
          <div className="lg:col-span-4 space-y-3">
            <Link to="/" className="font-bold text-lg text-[#141522] font-display inline-block">
              built by Miguel
            </Link>
            <p className="text-xs text-slate-500 font-sans leading-relaxed max-w-xs">
              We will help you show your ads to more people for less money.
            </p>
            <div className="flex items-center gap-3 pt-2 text-[#141522]">
              <span className="font-extrabold text-sm font-sans">in</span>
              <span className="w-4 h-4 rounded-full border border-[#141522] inline-block" />
              <span className="font-serif font-bold text-sm">f</span>
            </div>
            <div className="pt-4 text-[11px] text-slate-400 font-mono">
              © {currentYear} built by Miguel. All rights reserved
            </div>
          </div>

          {/* Column 2: Solutions */}
          <div className="lg:col-span-2 space-y-2.5">
            <div className="text-xs font-bold text-[#141522] font-display">
              Solutions
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600 font-sans">
              <li><Link to="/seo" className="hover:text-black">SEO</Link></li>
              <li><Link to="/local-seo-gbp" className="hover:text-black">Local SEO</Link></li>
              <li><Link to="/national-seo" className="hover:text-black">National SEO</Link></li>
              <li><Link to="/aeo-geo" className="hover:text-black">AEO & GEO</Link></li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className="lg:col-span-2 space-y-2.5">
            <div className="text-xs font-bold text-[#141522] font-display">
              Support
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600 font-sans">
              <li><Link to="/audit" className="hover:text-black">Free Audit</Link></li>
              <li><Link to="/website-demo" className="hover:text-black">Free Demo</Link></li>
              <li><Link to="/contact" className="hover:text-black">Contact</Link></li>
            </ul>
          </div>

          {/* Column 4: Company */}
          <div className="lg:col-span-2 space-y-2.5">
            <div className="text-xs font-bold text-[#141522] font-display">
              Company
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600 font-sans">
              <li><Link to="/about" className="hover:text-black">About</Link></li>
              <li><Link to="/blog" className="hover:text-black">Blog</Link></li>
              <li><Link to="/work" className="hover:text-black">Work</Link></li>
            </ul>
          </div>

          {/* Column 5: Legal */}
          <div className="lg:col-span-2 space-y-2.5">
            <div className="text-xs font-bold text-[#141522] font-display">
              Legal
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600 font-sans">
              <li><Link to="/privacy-policy" className="hover:text-black">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-black">Terms</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
