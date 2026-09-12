import { Link } from '@tanstack/react-router'
import {
  Search,
  Workflow,
  UserCheck,
  Video,
  FileQuestion,
  ThumbsUp,
  Clock,
  ShieldCheck,
  CalendarClock,
  ArrowRight,
  Split,
  Cpu,
  CheckCircle2,
} from 'lucide-react'

export interface FreeSystemsAuditCTAProps {
  className?: string
}

export function FreeSystemsAuditCTA({ className = '' }: FreeSystemsAuditCTAProps) {
  return (
    <section
      aria-label="Free Systems Audit Section"
      className={`relative w-full py-16 sm:py-20 md:py-24 bg-[#FAF8F5] dark:bg-[#0B0F17] border-t border-slate-200/80 dark:border-slate-800 transition-colors duration-200 ${className}`}
    >
      <div className="max-w-5xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-100/90 dark:bg-amber-950/50 border border-amber-300/80 dark:border-amber-700/50 mb-4">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            Free Video Review
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-slate-900 dark:text-white tracking-tight leading-tight">
            See What's Slowing Down Your Business Behind the Scenes
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
            We record a free video review of your tools and workflows to show you what is costing you time.
          </p>
        </div>

        {/* Hero Visual: Disconnected Tools vs Clean Connected Flow */}
        <div className="mb-14 sm:mb-16">
          <div className="bg-[#0B0F17] rounded-3xl p-4 sm:p-6 md:p-8 border border-slate-800 shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Left Column: Disconnected Tools & Manual Copying */}
              <div className="bg-slate-900/90 rounded-2xl p-5 border border-red-500/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-red-400 bg-red-950/60 px-2.5 py-1 rounded-md border border-red-500/20 inline-flex items-center gap-1.5 font-mono">
                      <Split className="w-3.5 h-3.5" /> Disconnected Tools
                    </span>
                    <span className="text-xs text-slate-400 font-sans">Manual Busywork</span>
                  </div>
                  <div className="space-y-3 font-mono text-xs">
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-400">
                      <div className="h-3 w-28 bg-slate-800 rounded mb-2"></div>
                      <div className="text-slate-400 leading-snug">
                        Website leads sit in email inboxes. Manual retyping into spreadsheets.
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-slate-400 pt-1 text-xs">
                      <span>Time to reach new lead</span>
                      <span className="text-red-400 font-bold">2 to 6 hours</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400 text-xs">
                      <span>Lost inquiries</span>
                      <span className="text-red-400 font-semibold">1 in 4 forgotten</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400">
                  Staff wastes hours retyping customer data between disconnected apps.
                </div>
              </div>

              {/* Right Column: Clean Connected Flow */}
              <div className="bg-slate-900/90 rounded-2xl p-5 border border-amber-500/40 flex flex-col justify-between shadow-lg shadow-amber-950/20">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-md border border-amber-500/30 inline-flex items-center gap-1.5 font-mono">
                      <Cpu className="w-3.5 h-3.5" /> Clean Connected Flow
                    </span>
                    <span className="text-xs text-amber-400 font-bold font-sans">Automated Dispatch</span>
                  </div>
                  <div className="space-y-3 font-mono text-xs">
                    <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/40 text-slate-200">
                      <div className="flex items-center gap-2 mb-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="font-semibold text-white">Instant Lead Webhook Pipeline</span>
                      </div>
                      <div className="text-slate-300 leading-snug">
                        Form submit triggers direct SMS to your phone and auto-syncs your CRM.
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-slate-300 pt-1 text-xs">
                      <span>Time to reach new lead</span>
                      <span className="text-amber-400 font-bold">Under 30 seconds</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300 text-xs">
                      <span>CRM & Billing sync</span>
                      <span className="text-emerald-400 font-semibold">100% automated</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-amber-300/90 font-medium">
                  Your technicians get job alerts before your competitors even open the email.
                </div>
              </div>
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-slate-500 font-sans">
            A real look at your actual tools. Not a generic checklist.
          </p>
        </div>

        {/* Three Benefit Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Benefit Card 1 */}
          <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-amber-400/60 transition-all">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/40 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-2">
              Find the Time Sink
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
              We show you exactly which manual task is eating your week.
            </p>
          </div>

          {/* Benefit Card 2 */}
          <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-amber-400/60 transition-all">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/40 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4">
              <Workflow className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-2">
              See What Could Run Itself
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
              Some tasks don't need a person at all.
            </p>
          </div>

          {/* Benefit Card 3 */}
          <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-amber-400/60 transition-all">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/40 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4">
              <UserCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-2">
              Get a Straight Read
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
              No sales scripts. Just the exact bottlenecks we would fix first.
            </p>
          </div>
        </div>

        {/* One Trust Card */}
        <div className="bg-[#0B0F17] dark:bg-[#070A0F] rounded-3xl p-6 border border-slate-800 shadow-md text-white mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <p className="text-base sm:text-lg font-medium text-slate-100 font-sans leading-relaxed">
                Every audit is a real video screen recording. See exact bottlenecks and actionable automations.
              </p>
            </div>
          </div>
        </div>

        {/* Three FAQ Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* FAQ Card 1 */}
          <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-3">
              <FileQuestion className="w-4 h-4" />
            </div>
            <h4 className="text-base font-bold font-display text-slate-900 dark:text-white mb-2">
              Do I need to install anything?
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
              No. We just review how your workflow operates today.
            </p>
          </div>

          {/* FAQ Card 2 */}
          <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-3">
              <ThumbsUp className="w-4 h-4" />
            </div>
            <h4 className="text-base font-bold font-display text-slate-900 dark:text-white mb-2">
              What if our systems are fine?
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
              We tell you upfront. You gain clear insight with zero downside.
            </p>
          </div>

          {/* FAQ Card 3 */}
          <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-3">
              <Clock className="w-4 h-4" />
            </div>
            <h4 className="text-base font-bold font-display text-slate-900 dark:text-white mb-2">
              How long does it take?
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
              Within 3 business days of a short call or form.
            </p>
          </div>
        </div>

        {/* CTA Button, Risk Reversal, and Urgency */}
        <div className="flex flex-col items-center text-center max-w-xl mx-auto">
          <Link
            to="/audit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-base sm:text-lg font-display tracking-tight shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200 group cursor-pointer"
          >
            <span>Get My Free Systems Audit</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>

          {/* Risk Reversal Line */}
          <div className="mt-5 flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-sans">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>No cost. No obligation. Keep the video either way.</span>
          </div>

          {/* Urgency Line */}
          <div className="mt-2.5 flex items-center justify-center gap-2 text-xs sm:text-sm font-medium text-amber-800 dark:text-amber-300 font-sans">
            <CalendarClock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>Audits are personally recorded by our technical team. Capacity is limited to 5 requests per week.</span>
          </div>
        </div>
      </div>
    </section>
  )
}
