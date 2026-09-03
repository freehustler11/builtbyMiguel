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
        title: 'Built In-House Software & Client Results | Built by Miguel',
      },
      {
        name: 'description',
        content:
          'Explore the custom software, automation engines, and high-speed web systems built by Miguel to dominate local search and streamline business operations.',
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
        content: 'Built In-House Software & Client Results | Built by Miguel',
      },
      {
        property: 'og:description',
        content:
          'A transparent look at the custom tools, automation engines, and high-performance websites I build and run.',
      },
      { property: 'og:url', content: 'https://builtbymiguel.com/work' },
      { property: 'og:image', content: 'https://builtbymiguel.com/og-image.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: 'https://builtbymiguel.com/og-image.png' },
    ],
  }),
  component: WorkPage,
})

function WorkPage() {
  return (
    <div className="space-y-24 sm:space-y-32 lg:space-y-36 py-6 sm:py-10">
      {/* =========================================================================
          1. HERO SECTION
          ========================================================================= */}
      <section className="relative text-center max-w-4xl mx-auto">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-rose-200/30 via-orange-100/30 to-teal-100/30 dark:from-rose-500/10 dark:via-orange-500/10 dark:to-teal-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

        <div className="mb-8 sm:mb-10 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-rose-600 dark:text-rose-400 shadow-sm">
            <Layers className="w-3.5 h-3.5" /> Architecture & Proof
          </div>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.12] mb-6 sm:mb-8">
          Software and Systems{' '}
          <span className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 bg-clip-text text-transparent">
            Built In-House.
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto font-normal">
          A transparent look at the internal tools, automation workflows, and high-performance websites I build and run.
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 shadow-sm mt-4">
          <Lock className="w-3.5 h-3.5 text-slate-700 dark:text-slate-400" />
          <span>Showing architectural previews & sanitized telemetry. Zero client data exposed.</span>
        </div>
      </section>

      {/* =========================================================================
          2. INTERNAL SYSTEMS GRID (5 PRODUCT CARDS)
          ========================================================================= */}
      <section className="space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-[11px] font-mono uppercase tracking-widest text-rose-600 dark:text-rose-400 font-bold">
            In-House Infrastructure
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            Proprietary Tools & Automation Engines
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Custom-coded applications that eliminate manual overhead and accelerate client growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1: Lead-to-Client CRM */}
          <div className="rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 sm:p-8 space-y-6 shadow-sm dark:shadow-none flex flex-col justify-between hover:shadow-xl transition-all duration-300">
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-800/40 flex items-center justify-center text-rose-600 dark:text-rose-400">
                  <Zap className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-bold">
                  CRM-01
                </span>
              </div>

              <div className="space-y-2">
                <div className="text-[10px] font-mono font-bold tracking-widest text-rose-600 dark:text-rose-400 uppercase">
                  LEAD VELOCITY
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Lead-to-Client CRM</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Real-time pipeline tracking with instant Twilio SMS dispatch, email alerts, and inbound call logging.
                </p>
              </div>

              <div className="space-y-2 font-mono text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Avg. Response Time</span>
                  <span className="text-slate-900 dark:text-white font-bold">&lt; 28 seconds</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Lead Conversion Lift</span>
                  <span className="text-rose-600 dark:text-rose-400 font-bold">+38% higher</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Stack: React · Edge Functions</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Active Engine</span>
            </div>
          </div>

          {/* Card 2: Client Onboarding Engine */}
          <div className="rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 sm:p-8 space-y-6 shadow-sm dark:shadow-none flex flex-col justify-between hover:shadow-xl transition-all duration-300">
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
                  ZERO TOUCH
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Onboarding Engine</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Automatic client intake forms, digital agreement signing, and cloud asset folder creation upon checkout.
                </p>
              </div>

              <div className="space-y-2 font-mono text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Onboarding Friction</span>
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold">0 manual steps</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Time to Kickoff</span>
                  <span className="text-slate-900 dark:text-white font-bold">&lt; 5 minutes</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Stack: Webhooks · Drive API</span>
              <span className="text-cyan-600 dark:text-cyan-400 font-semibold">Active Engine</span>
            </div>
          </div>

          {/* Card 3: AI Agent Workspace */}
          <div className="rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 sm:p-8 space-y-6 shadow-sm dark:shadow-none flex flex-col justify-between hover:shadow-xl transition-all duration-300">
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
                  AI INTELLIGENCE
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">AI Agent Workspace</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Automated local SEO audit generation, geo-grid heatmap extraction, and localized content drafting.
                </p>
              </div>

              <div className="space-y-2 font-mono text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Audit Turnaround</span>
                  <span className="text-orange-600 dark:text-orange-400 font-bold">&lt; 4 hours</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Schema Precision</span>
                  <span className="text-slate-900 dark:text-white font-bold">100% valid</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Stack: LLM Pipelines · Schema.org</span>
              <span className="text-orange-600 dark:text-orange-400 font-semibold">Active Engine</span>
            </div>
          </div>

          {/* Card 4: Business Operations Dashboard */}
          <div className="rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 sm:p-8 space-y-6 shadow-sm dark:shadow-none flex flex-col justify-between hover:shadow-xl transition-all duration-300">
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
                  SINGLE PANE OF GLASS
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Operations Dashboard</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Real-time view of monthly recurring revenue, client deliverables, ranking heatmaps, and invoice status.
                </p>
              </div>

              <div className="space-y-2 font-mono text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Data Latency</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Real-time (0s)</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Client Transparency</span>
                  <span className="text-slate-900 dark:text-white font-bold">100% visible</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Stack: TanStack · Tailwind</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Active Engine</span>
            </div>
          </div>

          {/* Card 5: Invoicing & Payment Tracker */}
          <div className="rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 sm:p-8 space-y-6 shadow-sm dark:shadow-none flex flex-col justify-between hover:shadow-xl transition-all duration-300">
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
                  AUTOMATED BILLING
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Payment Tracker</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Automated recurring retainer billing, Stripe payment reconciliation, and automated receipts.
                </p>
              </div>

              <div className="space-y-2 font-mono text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Payment Collection</span>
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold">100% Automated</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Failed Retry Recovery</span>
                  <span className="text-slate-900 dark:text-white font-bold">Smart Dunning</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Stack: Stripe API · Webhooks</span>
              <span className="text-cyan-600 dark:text-cyan-400 font-semibold">Active Engine</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. REAL CLIENT OUTCOMES (CASE STUDIES)
          ========================================================================= */}
      <section className="space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-[11px] font-mono uppercase tracking-widest text-rose-600 dark:text-rose-400 font-bold">
            Real Client Results
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            Before & After Transformations
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Sanitized performance metrics from active local client deployments.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Case Study 1: HVAC Contractor */}
          <div className="rounded-[3rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-8 sm:p-10 space-y-6 shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                LOCAL HVAC CONTRACTOR
              </span>
              <span className="text-xs font-mono text-slate-400 dark:text-slate-500">Austin, TX Metro</span>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                From Rank #14 to #1 on Google Maps in 75 Days
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Rebuilt a slow WordPress site into a fast React application, resolved 84 citation errors, and automated 5-star review collection after every completed service call.
              </p>
            </div>

            {/* Metrics Trio */}
            <div className="grid grid-cols-3 gap-4 pt-2 font-mono text-center">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">#1</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase mt-1">Map Pack Rank</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="text-2xl sm:text-3xl font-bold text-cyan-600 dark:text-cyan-400">+184%</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase mt-1">Inbound Calls</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="text-2xl sm:text-3xl font-bold text-orange-600 dark:text-orange-400">620ms</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase mt-1">Mobile Speed</div>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium pt-4 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Automated SMS review requests generated 68 new 5-star reviews</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Instant dispatch connected to technician phones via webhook</span>
              </li>
            </ul>
          </div>

          {/* Case Study 2: Commercial Roofing Company */}
          <div className="rounded-[3rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-8 sm:p-10 space-y-6 shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800/40">
                COMMERCIAL ROOFING
              </span>
              <span className="text-xs font-mono text-slate-400 dark:text-slate-500">DFW Metroplex</span>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Zero-Touch Intake & 3.2x Lead Velocity
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Deployed automated intake pipelines and AI entity schema. Organic search visibility expanded across 12 high-intent suburbs without increasing ad spend.
              </p>
            </div>

            {/* Metrics Trio */}
            <div className="grid grid-cols-3 gap-4 pt-2 font-mono text-center">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="text-2xl sm:text-3xl font-bold text-cyan-600 dark:text-cyan-400">3.2x</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase mt-1">Lead Volume</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">12</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase mt-1">Suburbs Covered</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="text-2xl sm:text-3xl font-bold text-orange-600 dark:text-orange-400">0 min</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase mt-1">Manual Intake</div>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium pt-4 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Customer project files auto-created in Google Drive upon lead capture</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Full Perplexity & ChatGPT local entity graph indexing</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. BOTTOM CTA
          ========================================================================= */}
      <section className="rounded-[3rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-8 sm:p-16 text-center shadow-xl dark:shadow-none relative overflow-hidden transition-colors duration-200">
        <div className="mb-6 sm:mb-8 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-rose-600 dark:text-rose-400 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" /> High-Performance Engineering
          </div>
        </div>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white tracking-tight max-w-2xl mx-auto leading-[1.15] mb-5 sm:mb-6">
          Ready for Systems That Give You Unfair Local Market Advantage?
        </h2>

        <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-xl mx-auto leading-relaxed font-normal mb-8 sm:mb-10">
          Request a free 5-minute video audit. We'll show you the exact software and ranking gaps your competitors are currently exploiting.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/audit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-base text-white bg-slate-900 dark:bg-rose-600 hover:bg-black dark:hover:bg-rose-500 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-rose-400 dark:text-white fill-rose-400 dark:fill-white" />
            <span>Claim Your Free 5-Min Video Audit</span>
          </Link>
        </div>
      </section>
    </div>
  )
}
