import { useState } from 'react'
import { Check, X, ArrowRight, Zap, ShieldAlert, Sparkles } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export function InteractiveComparisonCard() {
  const [activeTab, setActiveTab] = useState<'miguel' | 'legacy'>('miguel')

  return (
    <div className="w-full max-w-4xl mx-auto rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 sm:p-10 shadow-lg shadow-slate-200/50 dark:shadow-none space-y-8 transition-colors duration-200">
      {/* Header & Toggle Switch */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-transparent dark:border-rose-900/50">
            <Sparkles className="w-3.5 h-3.5" /> Direct Architecture Comparison
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            The Engineering Advantage
          </h3>
        </div>

        {/* Pill Segmented Control */}
        <div className="inline-flex p-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTab('miguel')}
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
              activeTab === 'miguel'
                ? 'bg-slate-900 dark:bg-rose-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            ⚡ Built by Miguel
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('legacy')}
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
              activeTab === 'legacy'
                ? 'bg-slate-900 dark:bg-rose-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            🐢 Traditional Agency
          </button>
        </div>
      </div>

      {/* Comparison Grid */}
      {activeTab === 'miguel' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="p-6 rounded-3xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/40 space-y-3">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-mono font-bold text-xs uppercase tracking-wider">
              <Zap className="w-4 h-4" /> Fast Mobile Speed
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">Fast Edge Render</div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Custom React web application deployed on global edge networks with zero plugin bloat.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-cyan-50/60 dark:bg-cyan-950/20 border border-cyan-200/80 dark:border-cyan-800/40 space-y-3">
            <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-400 font-mono font-bold text-xs uppercase tracking-wider">
              <Check className="w-4 h-4" /> Map Pack Visibility
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">Local Search Authority</div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Schema entity injection, clean directory citations, and automated customer review workflows.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-orange-50/60 dark:bg-orange-950/20 border border-orange-200/80 dark:border-orange-800/40 space-y-3">
            <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400 font-mono font-bold text-xs uppercase tracking-wider">
              <Zap className="w-4 h-4" /> Instant SMS Alerts
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">Speed-to-Lead</div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Zero manual busywork. Leads route straight to your phone with automated customer confirmations.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="p-6 rounded-3xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 space-y-3">
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-mono font-bold text-xs uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" /> 4.8s WordPress Bloat
            </div>
            <div className="text-2xl font-bold text-rose-900 dark:text-rose-200 font-mono">Slow & Leaking</div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Heavy page builder plugins, shared hosting lags, and 40%+ mobile traffic bounce rates.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 space-y-3">
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-mono font-bold text-xs uppercase tracking-wider">
              <X className="w-4 h-4" /> Buried on Page 2
            </div>
            <div className="text-2xl font-bold text-rose-900 dark:text-rose-200 font-mono">Rank #14+</div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Duplicate directory listings, conflicting phone numbers, and generic non-optimized GBP categories.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 space-y-3">
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-mono font-bold text-xs uppercase tracking-wider">
              <X className="w-4 h-4" /> 4-Hour Response Delay
            </div>
            <div className="text-2xl font-bold text-rose-900 dark:text-rose-200 font-mono">Lost Customers</div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Website inquiries sit in an unmonitored inbox while homeowners call the next contractor on Google.
            </p>
          </div>
        </div>
      )}

      {/* Footer CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Full transparency. Direct founder collaboration with Miguel.</span>
        </div>

        <Link
          to="/audit"
          className="inline-flex items-center gap-1.5 font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 transition-colors"
        >
          <span>Get Your Custom Gap Breakdown</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
