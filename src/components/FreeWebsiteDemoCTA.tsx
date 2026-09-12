import { Link } from '@tanstack/react-router'
import {
  Rocket,
  Smartphone,
  Link as LinkIcon,
  Code2,
  Server,
  Gift,
  Clock,
  ShieldCheck,
  Hammer,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react'

export interface FreeWebsiteDemoCTAProps {
  className?: string
}

export function FreeWebsiteDemoCTA({ className = '' }: FreeWebsiteDemoCTAProps) {
  return (
    <section
      aria-label="Free Website Demo Section"
      className={`relative w-full py-16 sm:py-20 md:py-24 bg-[#F0F4F8] border-t border-[#CBD5E1]/70 ${className}`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 text-cyan-900 border border-cyan-300/60 text-xs font-semibold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-[#0EA5E9] animate-pulse"></span>
            Free Live Preview
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-[#0B132B] tracking-tight leading-tight">
            See Your New Website Before You Pay
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 font-sans leading-relaxed">
            We build a real working preview using your business info. No templates. No guesswork.
          </p>
        </div>

        {/* Hero Visual: Current Homepage vs New Live Preview */}
        <div className="mb-14 sm:mb-16">
          <div className="bg-[#0B132B] rounded-2xl p-4 sm:p-6 md:p-8 border border-slate-700/60 shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Left Column: Current Homepage */}
              <div className="bg-[#0A1128]/90 rounded-xl p-5 border border-red-500/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-red-400 bg-red-950/60 px-2.5 py-1 rounded-md border border-red-500/20 inline-flex items-center gap-1.5">
                      <TrendingDown className="w-3.5 h-3.5" /> Current Homepage
                    </span>
                    <span className="text-xs text-slate-400">Slow & Outdated</span>
                  </div>
                  <div className="space-y-3 font-mono text-xs">
                    <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-400">
                      <div className="h-3 w-28 bg-slate-700 rounded mb-2"></div>
                      <div className="text-slate-400 leading-snug">
                        Heavy template bloat. Takes 4+ seconds to open on phones.
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-slate-400 pt-1 text-xs">
                      <span>Mobile page load speed</span>
                      <span className="text-red-400 font-bold">4.8 seconds</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400 text-xs">
                      <span>Google Core Web Vitals</span>
                      <span className="text-red-400 font-semibold">Failed</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400">
                  Visitors leave before your phone number even renders.
                </div>
              </div>

              {/* Right Column: New Live Preview */}
              <div className="bg-[#0A1128]/90 rounded-xl p-5 border border-cyan-500/40 flex flex-col justify-between shadow-lg shadow-cyan-950/20">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-md border border-cyan-500/30 inline-flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5" /> New Live Preview
                    </span>
                    <span className="text-xs text-cyan-400 font-bold">Sub-Second Speed</span>
                  </div>
                  <div className="space-y-3 font-mono text-xs">
                    <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-800/40 text-slate-200">
                      <div className="flex items-center gap-2 mb-1.5">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span className="font-semibold text-white">Hand-Coded Clean Architecture</span>
                      </div>
                      <div className="text-slate-300 leading-snug">
                        Instant tap-to-call, modern design, and zero plugin bloat.
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-slate-300 pt-1 text-xs">
                      <span>Mobile page load speed</span>
                      <span className="text-cyan-400 font-bold">0.42 seconds</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300 text-xs">
                      <span>Google Core Web Vitals</span>
                      <span className="text-cyan-400 font-semibold">100% Passed</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-cyan-300/90 font-medium">
                  Clients tap to call immediately on any phone screen.
                </div>
              </div>
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-slate-500 font-sans">
            A real production page we build. Not an AI concept image.
          </p>
        </div>

        {/* Three Benefit Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Benefit Card 1 */}
          <div className="bg-white rounded-2xl p-6 border border-[#CBD5E1]/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-11 h-11 rounded-xl bg-cyan-50 border border-cyan-200/80 flex items-center justify-center text-[#0EA5E9] mb-4">
              <Rocket className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-display text-[#0B132B] mb-2">
              Feel the Speed
            </h3>
            <p className="text-sm text-slate-600 font-sans leading-relaxed">
              Load your new site in under a second.
            </p>
          </div>

          {/* Benefit Card 2 */}
          <div className="bg-white rounded-2xl p-6 border border-[#CBD5E1]/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-11 h-11 rounded-xl bg-cyan-50 border border-cyan-200/80 flex items-center justify-center text-[#0EA5E9] mb-4">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-display text-[#0B132B] mb-2">
              Test It on Your Phone
            </h3>
            <p className="text-sm text-slate-600 font-sans leading-relaxed">
              Try tap to call the way your customers will.
            </p>
          </div>

          {/* Benefit Card 3 */}
          <div className="bg-white rounded-2xl p-6 border border-[#CBD5E1]/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-11 h-11 rounded-xl bg-cyan-50 border border-cyan-200/80 flex items-center justify-center text-[#0EA5E9] mb-4">
              <LinkIcon className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-display text-[#0B132B] mb-2">
              Share It With Anyone
            </h3>
            <p className="text-sm text-slate-600 font-sans leading-relaxed">
              Send the live link to your team or partner.
            </p>
          </div>
        </div>

        {/* One Trust Card */}
        <div className="bg-gradient-to-r from-[#0B132B] to-[#162244] rounded-2xl p-6 border border-slate-700/80 shadow-md text-white mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-[#0EA5E9] shrink-0">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-base sm:text-lg font-medium text-slate-100 font-sans leading-relaxed">
                Every demo is built on the same production stack real clients get. No shortcuts.
              </p>
            </div>
          </div>
        </div>

        {/* Three FAQ Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* FAQ Card 1 */}
          <div className="bg-white rounded-2xl p-6 border border-[#CBD5E1]/80 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 mb-3">
              <Server className="w-4 h-4" />
            </div>
            <h4 className="text-base font-bold font-display text-[#0B132B] mb-2">
              Do I need new hosting?
            </h4>
            <p className="text-sm text-slate-600 font-sans leading-relaxed">
              No. It's just a preview link. Your site stays live.
            </p>
          </div>

          {/* FAQ Card 2 */}
          <div className="bg-white rounded-2xl p-6 border border-[#CBD5E1]/80 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 mb-3">
              <Gift className="w-4 h-4" />
            </div>
            <h4 className="text-base font-bold font-display text-[#0B132B] mb-2">
              Is it really free?
            </h4>
            <p className="text-sm text-slate-600 font-sans leading-relaxed">
              Yes. Keep the link either way.
            </p>
          </div>

          {/* FAQ Card 3 */}
          <div className="bg-white rounded-2xl p-6 border border-[#CBD5E1]/80 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 mb-3">
              <Clock className="w-4 h-4" />
            </div>
            <h4 className="text-base font-bold font-display text-[#0B132B] mb-2">
              How long does it take?
            </h4>
            <p className="text-sm text-slate-600 font-sans leading-relaxed">
              Three business days after receiving your details.
            </p>
          </div>
        </div>

        {/* CTA Button, Risk Reversal, and Urgency */}
        <div className="flex flex-col items-center text-center max-w-xl mx-auto">
          <Link
            to="/website-demo"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-[#0B132B] font-bold text-base sm:text-lg font-display tracking-tight shadow-md hover:shadow-lg transition-all duration-200 group cursor-pointer"
          >
            <span>Get My Free Website Demo</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>

          {/* Risk Reversal Line */}
          <div className="mt-5 flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-600 font-sans">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>No payment. No contract. Keep the preview no matter what.</span>
          </div>

          {/* Urgency Line */}
          <div className="mt-2.5 flex items-center justify-center gap-2 text-xs sm:text-sm font-medium text-amber-800 font-sans">
            <Hammer className="w-4 h-4 text-[#F59E0B] shrink-0" />
            <span>Each demo is custom engineered. Capacity is limited to 5 requests per week.</span>
          </div>
        </div>
      </div>
    </section>
  )
}
