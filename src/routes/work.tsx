import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Layers,
  Sparkles,
  ArrowRight,
  Zap,
  Bot,
  BarChart3,
  CreditCard,
  CheckCircle2,
  Lock,
  Search,
  Globe,
  Cpu,
} from 'lucide-react'

export const Route = createFileRoute('/work')({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      {
        title: 'Built In-House Software & Client Results | built by Miguel',
      },
      {
        name: 'description',
        content:
          'Explore the custom software, automation tools, and fast websites built by Miguel to help local businesses grow.',
      },
      {
        name: 'keywords',
        content:
          'custom business systems, internal software showcase, local seo case studies, lead crm automation, small business tools',
      },
      // OpenGraph
      { property: 'og:type', content: 'website' },
      {
        property: 'og:title',
        content: 'Built In-House Software & Client Results | built by Miguel',
      },
      {
        property: 'og:description',
        content:
          'A clear look at the custom tools, automation engines, and fast websites we build and run.',
      },
      { property: 'og:url', content: 'https://builtbymiguel.net/work' },
      { property: 'og:image', content: 'https://builtbymiguel.net/og-image.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: 'https://builtbymiguel.net/og-image.png' },
    ],
    links: [
      {
        rel: 'canonical',
        href: 'https://builtbymiguel.net/work',
      },
    ],
  }),
  component: WorkPage,
})

function WorkPage() {
  return (
    <div className="w-full bg-[#FAF8F5] dark:bg-[#0B0F17] transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 py-12 sm:py-16 md:py-20 space-y-24 sm:space-y-32">
        {/* =========================================================================
            1. HERO SECTION
            ========================================================================= */}
        <section className="relative text-center max-w-4xl mx-auto">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-amber-400/20 via-orange-400/10 to-transparent blur-[130px] rounded-full pointer-events-none -z-10" />

          <div className="mb-6 sm:mb-8 flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-semibold tracking-wider uppercase text-amber-800 dark:text-amber-300 bg-amber-100/90 dark:bg-amber-950/50 border border-amber-300/80 dark:border-amber-700/50 shadow-xs">
              <Layers className="w-3.5 h-3.5" /> Architecture & Proof
            </div>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight text-slate-900 dark:text-white leading-[1.12] mb-6 sm:mb-8">
            Software and Systems{' '}
            <span className="text-amber-600 dark:text-amber-400">
              Built In-House.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto font-normal">
            A clear look at the internal tools, automation workflows, and fast websites we build and run.
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 shadow-sm mt-6">
            <Lock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Showing system previews and sanitized data. No private client information is shown.</span>
          </div>
        </section>

        {/* =========================================================================
            2. INTERNAL SYSTEMS GRID (5 PRODUCT CARDS)
            ========================================================================= */}
        <section className="space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-100/90 dark:bg-amber-950/50 border border-amber-300/80 dark:border-amber-700/50">
              In-House Tools
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              Custom Tools and Automation Engines
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Software built to remove manual work and help local clients win more jobs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1: Lead-to-Client CRM */}
            <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 sm:p-8 space-y-6 shadow-sm dark:shadow-none flex flex-col justify-between hover:border-amber-400/60 hover:shadow-lg transition-all duration-300">
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <Zap className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-bold">
                    CRM-01
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] font-mono font-bold tracking-widest text-amber-600 dark:text-amber-400 uppercase">
                    FAST RESPONSE
                  </div>
                  <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Lead-to-Client CRM</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Tracks incoming leads with instant text message alerts, email notifications, and phone call logs.
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                    <div className="text-sm font-bold text-slate-900 dark:text-white font-display">Under 28 Seconds</div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">Average response time for new inbound customer inquiries.</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                    <div className="text-sm font-bold text-amber-600 dark:text-amber-400 font-display">38 Percent Higher Conversion</div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">Fast replies turn more web visitors into paying customers.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Built with React and fast edge functions</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Active Tool</span>
              </div>
            </div>

            {/* Card 2: Client Onboarding Engine */}
            <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 sm:p-8 space-y-6 shadow-sm dark:shadow-none flex flex-col justify-between hover:border-cyan-400/60 hover:shadow-lg transition-all duration-300">
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-100 dark:border-cyan-800/40 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-bold">
                    AUTO-02
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] font-mono font-bold tracking-widest text-cyan-600 dark:text-cyan-400 uppercase">
                    EASY SETUP
                  </div>
                  <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Onboarding Engine</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Sends online intake forms, digital agreements, and shared project folders automatically.
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                    <div className="text-sm font-bold text-cyan-600 dark:text-cyan-400 font-display">Zero Manual Paperwork</div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">Clients sign agreements and upload files without email back-and-forth.</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                    <div className="text-sm font-bold text-slate-900 dark:text-white font-display">Kickoff in 5 Minutes</div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">Projects start right away once the client submits their details.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Automated with webhooks and cloud storage</span>
                <span className="text-cyan-600 dark:text-cyan-400 font-semibold">Active Tool</span>
              </div>
            </div>

            {/* Card 3: AI Agent Workspace */}
            <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 sm:p-8 space-y-6 shadow-sm dark:shadow-none flex flex-col justify-between hover:border-orange-400/60 hover:shadow-lg transition-all duration-300">
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="w-10 h-10 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-100 dark:border-orange-800/40 flex items-center justify-center text-orange-600 dark:text-orange-400">
                    <Bot className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-bold">
                    AI-03
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] font-mono font-bold tracking-widest text-orange-600 dark:text-orange-400 uppercase">
                    AUDIT TOOLS
                  </div>
                  <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white">AI Audit Workspace</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Generates local SEO audits, maps ranking coordinates, and drafts localized service pages.
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                    <div className="text-sm font-bold text-orange-600 dark:text-orange-400 font-display">Ready in Under 4 Hours</div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">Full local ranking audits generated and verified rapidly.</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                    <div className="text-sm font-bold text-slate-900 dark:text-white font-display">Accurate Local Data</div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">Structured data verified for Google and modern AI search tools.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Powered by local data engines and schema tools</span>
                <span className="text-orange-600 dark:text-orange-400 font-semibold">Active Tool</span>
              </div>
            </div>

            {/* Card 4: Business Operations Dashboard */}
            <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 sm:p-8 space-y-6 shadow-sm dark:shadow-none flex flex-col justify-between hover:border-emerald-400/60 hover:shadow-lg transition-all duration-300">
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-bold">
                    DASH-04
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] font-mono font-bold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">
                    LIVE VISIBILITY
                  </div>
                  <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Operations Dashboard</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Gives clients a live look at monthly rankings, deliverables, traffic trends, and billing.
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                    <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-display">Live Real-Time Data</div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">Ranking movements and lead numbers update without delay.</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                    <div className="text-sm font-bold text-slate-900 dark:text-white font-display">Complete Client Visibility</div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">You see every completed deliverable with zero guesswork.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Built with modern web frameworks and live databases</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Active Tool</span>
              </div>
            </div>

            {/* Card 5: Invoicing & Payment Tracker */}
            <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 sm:p-8 space-y-6 shadow-sm dark:shadow-none flex flex-col justify-between hover:border-cyan-400/60 hover:shadow-lg transition-all duration-300">
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-100 dark:border-cyan-800/40 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-bold">
                    PAY-05
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] font-mono font-bold tracking-widest text-cyan-600 dark:text-cyan-400 uppercase">
                    SIMPLE BILLING
                  </div>
                  <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Payment Tracker</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Handles recurring retainer payments, automated billing receipts, and card renewals.
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                    <div className="text-sm font-bold text-cyan-600 dark:text-cyan-400 font-display">Automatic Billing</div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">Retainers process on schedule with clear automated receipts.</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                    <div className="text-sm font-bold text-slate-900 dark:text-white font-display">Smart Card Retries</div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">Failed payments retry smoothly without interrupting service.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Connected to Stripe with secure webhooks</span>
                <span className="text-cyan-600 dark:text-cyan-400 font-semibold">Active Tool</span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            3. REAL CLIENT OUTCOMES (CASE STUDIES)
            ========================================================================= */}
        <section className="space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-100/90 dark:bg-amber-950/50 border border-amber-300/80 dark:border-amber-700/50">
              Real Client Results
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              Real Before and After Results
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Actual performance data from active client accounts.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Case Study 1: HVAC Contractor */}
            <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-8 sm:p-10 space-y-6 shadow-sm dark:shadow-none hover:border-emerald-400/60 transition-colors duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                  LOCAL HVAC COMPANY
                </span>
                <span className="text-xs font-mono text-slate-400 dark:text-slate-500">Austin, Texas</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
                  From Rank #14 to #1 on Google Maps in 75 Days
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  We rebuilt a slow website into a fast web app, fixed 84 directory errors, and automated review requests after service calls.
                </p>
              </div>

              {/* Metrics Trio */}
              <div className="grid grid-cols-3 gap-4 pt-2 font-mono text-center">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400 font-display">#1</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase mt-1">Google Maps Rank</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="text-2xl sm:text-3xl font-bold text-cyan-600 dark:text-cyan-400 font-display">+184%</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase mt-1">More Customer Calls</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400 font-display">620ms</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase mt-1">Mobile Load Speed</div>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium pt-4 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Automated text requests brought in 68 new 5-star Google reviews</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Instant alerts send customer leads directly to technician phones</span>
                </li>
              </ul>
            </div>

            {/* Case Study 2: Commercial Roofing Company */}
            <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-8 sm:p-10 space-y-6 shadow-sm dark:shadow-none hover:border-cyan-400/60 transition-colors duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800/40">
                  COMMERCIAL ROOFING
                </span>
                <span className="text-xs font-mono text-slate-400 dark:text-slate-500">Dallas, Texas</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
                  Instant Lead Intake and 3.2x More Inquiries
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  We set up automated lead capture and local search pages. The company expanded into 12 new suburbs without spending extra money on ads.
                </p>
              </div>

              {/* Metrics Trio */}
              <div className="grid grid-cols-3 gap-4 pt-2 font-mono text-center">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="text-2xl sm:text-3xl font-bold text-cyan-600 dark:text-cyan-400 font-display">3.2x</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase mt-1">More Inbound Leads</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400 font-display">12</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase mt-1">New Cities Ranked</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400 font-display">0 min</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase mt-1">Manual Data Entry</div>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium pt-4 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Customer project folders create automatically when a lead comes in</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Full local indexing across Google and AI search tools</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      {/* =========================================================================
          4. BOTTOM CTA
          ========================================================================= */}
      <section className="w-full bg-[#0B0F17] dark:bg-[#070A0F] text-white py-16 sm:py-24 border-t border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-semibold tracking-wider uppercase bg-amber-950/50 border border-amber-700/50 text-amber-300">
            <Sparkles className="w-3.5 h-3.5" /> High-Performance Engineering
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight text-white leading-[1.15]">
            Ready for Systems That Bring You More Jobs?
          </h2>

          <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto leading-relaxed font-normal">
            Request a free 5-minute video audit. We will show you where you can beat competitors in your local market.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/audit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-base bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-slate-950 fill-current" />
              <span>Claim Your Free 5-Minute Video Audit</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
