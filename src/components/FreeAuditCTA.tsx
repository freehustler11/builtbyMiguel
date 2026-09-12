import { Link } from '@tanstack/react-router'
import {
  Search,
  Gauge,
  UserCheck,
  Video,
  PhoneOff,
  ThumbsUp,
  Clock,
  ShieldCheck,
  CalendarClock,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react'

export type FreeAuditCtaVariant =
  | 'default'
  | 'local-seo'
  | 'national-seo'
  | 'aeo-geo'
  | 'hosting-care'

export interface FreeAuditCTAProps {
  variant?: FreeAuditCtaVariant
  className?: string
}

interface VariantContent {
  headline: string
  subheadline: string
}

const VARIANT_COPY: Record<FreeAuditCtaVariant, VariantContent> = {
  default: {
    headline: "See Why You're Losing Customers to Competitors on Google",
    subheadline:
      'I record a free audit of your site and your Google presence. No outside team. No sales pitch.',
  },
  'local-seo': {
    headline: 'See Why Competitors Beat You in the Map Pack',
    subheadline:
      "I check your Google Business Profile, called GBP for short, and show you what's holding you back.",
  },
  'national-seo': {
    headline: 'See Why Competitors Outrank You Nationally',
    subheadline: 'Get a clear read on where your national SEO stands today.',
  },
  'aeo-geo': {
    headline: 'See Why AI Tools Recommend Your Competitors',
    subheadline:
      'Find out if ChatGPT and Google AI Overviews even know your business exists.',
  },
  'hosting-care': {
    headline: "See What's Slowing Down Your Website",
    subheadline:
      "I check your site's speed and security before I recommend a care plan.",
  },
}

export function FreeAuditCTA({
  variant = 'default',
  className = '',
}: FreeAuditCTAProps) {
  const { headline, subheadline } = VARIANT_COPY[variant] || VARIANT_COPY.default

  return (
    <section
      aria-label="Free Audit Request Section"
      className={`relative w-full py-16 sm:py-20 md:py-24 bg-[#F0F4F8] border-t border-[#CBD5E1]/70 ${className}`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300/60 text-xs font-semibold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse"></span>
            Free Video Audit
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-[#0B132B] tracking-tight leading-tight">
            {headline}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 font-sans leading-relaxed">
            {subheadline}
          </p>
        </div>

        {/* Hero Visual: Split Screen Comparison */}
        <div className="mb-14 sm:mb-16">
          <div className="bg-[#0B132B] rounded-2xl p-4 sm:p-6 md:p-8 border border-slate-700/60 shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Left Column: Where You Rank Now */}
              <div className="bg-[#0A1128]/90 rounded-xl p-5 border border-red-500/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-red-400 bg-red-950/60 px-2.5 py-1 rounded-md border border-red-500/20 inline-flex items-center gap-1.5">
                      <TrendingDown className="w-3.5 h-3.5" /> Where You Rank Now
                    </span>
                    <span className="text-xs text-slate-400">Position #12+</span>
                  </div>
                  <div className="space-y-3 font-mono text-xs">
                    <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-400">
                      <div className="h-3 w-28 bg-slate-700 rounded mb-2"></div>
                      <div className="text-slate-400 leading-snug">
                        Hidden under page two. Missing calls every week.
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-slate-400 pt-1 text-xs">
                      <span>Monthly calls from Google</span>
                      <span className="text-red-400 font-bold">1 to 3</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400 text-xs">
                      <span>Google Map Pack</span>
                      <span className="text-slate-500">Not in top 3</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400">
                  Customers click your competitors instead.
                </div>
              </div>

              {/* Right Column: Where You Could Be */}
              <div className="bg-[#0A1128]/90 rounded-xl p-5 border border-emerald-500/40 flex flex-col justify-between shadow-lg shadow-emerald-950/20">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-500/30 inline-flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5" /> Where You Could Rank
                    </span>
                    <span className="text-xs text-emerald-400 font-bold">Position #1 to #3</span>
                  </div>
                  <div className="space-y-3 font-mono text-xs">
                    <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-slate-200">
                      <div className="flex items-center gap-2 mb-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="font-semibold text-white">Google Map Pack Top Spot</span>
                      </div>
                      <div className="text-slate-300 leading-snug">
                        First contractor clients see when searching nearby.
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-slate-300 pt-1 text-xs">
                      <span>Monthly calls from Google</span>
                      <span className="text-emerald-400 font-bold">25 to 50+</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300 text-xs">
                      <span>Google Map Pack</span>
                      <span className="text-emerald-400 font-semibold">Locked in top 3</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-emerald-300/90 font-medium">
                  Direct phone inquiries from homeowners ready to hire.
                </div>
              </div>
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-slate-500 font-sans">
            A real screen recording of your site. Not a template graphic.
          </p>
        </div>

        {/* Three Benefit Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Benefit Card 1 */}
          <div className="bg-white rounded-2xl p-6 border border-[#CBD5E1]/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-200/80 flex items-center justify-center text-[#0EA5E9] mb-4">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-display text-[#0B132B] mb-2">
              Check Your Ranking
            </h3>
            <p className="text-sm text-slate-600 font-sans leading-relaxed">
              I review your Google Business Profile, citations, and Map Pack spot.
            </p>
          </div>

          {/* Benefit Card 2 */}
          <div className="bg-white rounded-2xl p-6 border border-[#CBD5E1]/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-200/80 flex items-center justify-center text-[#0EA5E9] mb-4">
              <Gauge className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-display text-[#0B132B] mb-2">
              See Why Visitors Leave
            </h3>
            <p className="text-sm text-slate-600 font-sans leading-relaxed">
              A slow site loses calls before SEO even matters.
            </p>
          </div>

          {/* Benefit Card 3 */}
          <div className="bg-white rounded-2xl p-6 border border-[#CBD5E1]/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-200/80 flex items-center justify-center text-[#0EA5E9] mb-4">
              <UserCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-display text-[#0B132B] mb-2">
              Talk to the Real Expert
            </h3>
            <p className="text-sm text-slate-600 font-sans leading-relaxed">
              No account manager. You get me, the founder.
            </p>
          </div>
        </div>

        {/* One Trust Card */}
        <div className="bg-gradient-to-r from-[#0B132B] to-[#162244] rounded-2xl p-6 border border-slate-700/80 shadow-md text-white mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-[#F59E0B] shrink-0">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <p className="text-base sm:text-lg font-medium text-slate-100 font-sans leading-relaxed">
                Every audit is a real video. You see exactly what I check and why.
              </p>
            </div>
          </div>
        </div>

        {/* Three FAQ Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* FAQ Card 1 */}
          <div className="bg-white rounded-2xl p-6 border border-[#CBD5E1]/80 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 mb-3">
              <PhoneOff className="w-4 h-4" />
            </div>
            <h4 className="text-base font-bold font-display text-[#0B132B] mb-2">
              Is this a sales call?
            </h4>
            <p className="text-sm text-slate-600 font-sans leading-relaxed">
              No. It's a video sent to your email. No calls. No meetings.
            </p>
          </div>

          {/* FAQ Card 2 */}
          <div className="bg-white rounded-2xl p-6 border border-[#CBD5E1]/80 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 mb-3">
              <ThumbsUp className="w-4 h-4" />
            </div>
            <h4 className="text-base font-bold font-display text-[#0B132B] mb-2">
              What if my site is fine?
            </h4>
            <p className="text-sm text-slate-600 font-sans leading-relaxed">
              Then I'll tell you. You lose five minutes, not money.
            </p>
          </div>

          {/* FAQ Card 3 */}
          <div className="bg-white rounded-2xl p-6 border border-[#CBD5E1]/80 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 mb-3">
              <Clock className="w-4 h-4" />
            </div>
            <h4 className="text-base font-bold font-display text-[#0B132B] mb-2">
              How fast do I get it?
            </h4>
            <p className="text-sm text-slate-600 font-sans leading-relaxed">
              Within 24 hours of sending your site.
            </p>
          </div>
        </div>

        {/* CTA Button, Risk Reversal, and Urgency */}
        <div className="flex flex-col items-center text-center max-w-xl mx-auto">
          <Link
            to="/audit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-[#0B132B] font-bold text-base sm:text-lg font-display tracking-tight shadow-md hover:shadow-lg transition-all duration-200 group"
          >
            <span>Get My Free Audit</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>

          {/* Risk Reversal Line */}
          <div className="mt-5 flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-600 font-sans">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>No card. No signup. No obligation. If I find nothing wrong, I'll tell you.</span>
          </div>

          {/* Urgency Line */}
          <div className="mt-2.5 flex items-center justify-center gap-2 text-xs sm:text-sm font-medium text-amber-800 font-sans">
            <CalendarClock className="w-4 h-4 text-[#F59E0B] shrink-0" />
            <span>I record every audit myself. I only take 8 requests a week.</span>
          </div>
        </div>
      </div>
    </section>
  )
}
