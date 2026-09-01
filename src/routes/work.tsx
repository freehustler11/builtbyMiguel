import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Bot,
  BarChart3,
  CreditCard,
  CheckCircle2,
  Lock,
  Search,
  Globe,
  TrendingUp,
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
        content: 'In-House Software & Client Systems Showcase | Built by Miguel',
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
    <div className="space-y-24 sm:space-y-32 py-6 sm:py-10">
      {/* =========================================================================
          1. HERO SECTION
          ========================================================================= */}
      <section className="relative text-center max-w-4xl mx-auto space-y-8">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[320px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <Layers className="w-3.5 h-3.5" /> Architecture & Proof
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
          Software and Systems{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Built In-House.
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
          A transparent look at the internal tools, automation workflows, and high-performance websites I build and run.
        </p>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>Showing architectural previews & sanitized demo stats. Zero client data exposed.</span>
        </div>
      </section>

      {/* =========================================================================
          2. INTERNAL SYSTEMS GRID (5 PRODUCT PREVIEW CARDS)
          ========================================================================= */}
      <section className="space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
            In-House Infrastructure
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Proprietary Tools & Automation Engines
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Custom-coded applications that eliminate manual overhead and accelerate client growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1: Lead-to-Client CRM */}
          <div className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-6 sm:p-8 space-y-6 shadow-xl flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Zap className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  CRM-01
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Lead-to-Client CRM</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Real-time pipeline tracking with instant Twilio SMS dispatch, email alerts, and inbound call logging.
                </p>
              </div>

              {/* UI Preview Frame */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] space-y-2">
                <div className="text-slate-500 text-[10px]">PIPELINE STAGE MONITOR</div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" /> New Inquiry
                  </span>
                  <span className="text-emerald-400 font-semibold">&lt; 30s Alert</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" /> Audit Delivered
                  </span>
                  <span className="text-slate-500">Auto-Logged</span>
                </div>
              </div>

              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Sub-30-second automated lead notification</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Direct integration with Stripe & Twilio API</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Card 2: Client Onboarding Engine */}
          <div className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-6 sm:p-8 space-y-6 shadow-xl flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Layers className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  AUTO-02
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Client Onboarding Engine</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Zero-touch client intake: automatic agreement generation, Google Drive provisioning, and welcome packet dispatch.
                </p>
              </div>

              {/* UI Preview Frame */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] space-y-2">
                <div className="text-slate-500 text-[10px]">WORKFLOW TRIGGER</div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-300">1. Invoice Paid</span>
                  <span className="text-cyan-400">Stripe Webhook</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-300">2. Portal User Created</span>
                  <span className="text-emerald-400">Instant Access</span>
                </div>
              </div>

              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Saves 4+ hours of manual onboarding per client</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Instant portal provisioning on `app.builtbymiguel.com`</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Card 3: AI Agent Workspace */}
          <div className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-6 sm:p-8 space-y-6 shadow-xl flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  AI-03
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">AI Agent Workspace</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Automated local SEO audit generation, geo-grid competitor clustering, and hyper-local service content drafting.
                </p>
              </div>

              {/* UI Preview Frame */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] space-y-2">
                <div className="text-slate-500 text-[10px]">GEO-ENTITY ANALYSIS</div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Schema Entity Graph</span>
                  <span className="text-purple-400">100% Clustered</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>AI Search Readiness</span>
                  <span className="text-emerald-400">Optimized</span>
                </div>
              </div>

              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Extracts ranking gap insights in &lt; 2 minutes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Structured Schema.org JSON-LD generation</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Card 4: Business Operations Dashboard */}
          <div className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-6 sm:p-8 space-y-6 shadow-xl flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  OPS-04
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Business Operations Dashboard</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Live operational visibility across monthly recurring retainers, ranking health scores, and site uptime.
                </p>
              </div>

              {/* UI Preview Frame */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] space-y-2">
                <div className="text-slate-500 text-[10px]">METRICS SNAPSHOT</div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Client Ranking Health</span>
                  <span className="text-emerald-400 font-bold">98.4% Top 3</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Infrastructure Uptime</span>
                  <span className="text-cyan-400">99.99% Edge</span>
                </div>
              </div>

              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Proactive rank drop detection & alerts</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Consolidated financial and project analytics</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Card 5: Invoicing & Payment Tracker */}
          <div className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-6 sm:p-8 space-y-6 shadow-xl flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <CreditCard className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  FIN-05
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Invoicing & Payment Tracker</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Clean billing schedules with automatic Stripe reconciliation, receipt dispatches, and gentle reminder sequences.
                </p>
              </div>

              {/* UI Preview Frame */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] space-y-2">
                <div className="text-slate-500 text-[10px]">PAYMENT PIPELINE</div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Deposit Milestone</span>
                  <span className="text-emerald-400">Collected</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Recurring Retainers</span>
                  <span className="text-amber-400">Auto-Rebilled</span>
                </div>
              </div>

              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>0 hours spent chasing manual invoice payments</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Automated QuickBooks bookkeeping sync</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. CLIENT CASE STUDIES (2 BEFORE-AND-AFTER CARDS)
          ========================================================================= */}
      <section className="space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
            Proven Results
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Client Growth Case Studies
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Real benchmark transformations combining Local SEO with sub-second web engineering.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Case Study 1: Local Service Client */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono text-emerald-400 font-semibold uppercase">Local SEO & Map Pack</span>
                <h3 className="text-2xl font-bold text-white mt-1">Austin Roofing Contractor</h3>
              </div>
              <div className="text-right font-mono text-xs text-slate-500">
                Timeline: 60 Days
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
                <div className="text-[11px] font-mono text-slate-500 uppercase">BEFORE OPTIMIZATION</div>
                <div className="text-lg font-extrabold text-rose-400">Rank #18 (Invisible)</div>
                <div className="text-xs text-slate-400">~6 monthly inquiries</div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                <div className="text-[11px] font-mono text-emerald-400 uppercase font-semibold">AFTER (60 DAYS)</div>
                <div className="text-lg font-extrabold text-emerald-300">Rank #1 Map Pack</div>
                <div className="text-xs text-emerald-400 font-semibold">3x Inbound Call Volume</div>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              Cleaned 62 duplicate citations, optimized secondary Google Business Profile categories, and launched 8 localized neighborhood landing pages with Schema.org JSON-LD markup.
            </p>
          </div>

          {/* Case Study 2: Trade Business Client */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-semibold uppercase">Speed & Conversion</span>
                <h3 className="text-2xl font-bold text-white mt-1">Commercial HVAC Specialist</h3>
              </div>
              <div className="text-right font-mono text-xs text-slate-500">
                Timeline: 3 Weeks
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
                <div className="text-[11px] font-mono text-slate-500 uppercase">BEFORE (WORDPRESS)</div>
                <div className="text-lg font-extrabold text-rose-400">5.8s Load Time</div>
                <div className="text-xs text-slate-400">High mobile bounce rate</div>
              </div>

              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 space-y-1">
                <div className="text-[11px] font-mono text-cyan-400 uppercase font-semibold">AFTER (REACT & EDGE)</div>
                <div className="text-lg font-extrabold text-cyan-300">620ms Speed</div>
                <div className="text-xs text-cyan-400 font-semibold">+42% Form Submissions</div>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              Replaced slow WordPress install with a custom React application on global edge CDN. Implemented persistent mobile tap-to-call bars and instant SMS dispatch to field technicians.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. BOTTOM CONVERSION BANNER
          ========================================================================= */}
      <section className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-8 sm:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <Sparkles className="w-3.5 h-3.5" /> High-Performance Infrastructure
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight max-w-2xl mx-auto">
          Want a system like this built for your business?
        </h2>

        <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Let’s discuss your current operational bottlenecks, local search rankings, and custom system needs.
        </p>

        <div className="pt-2">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base text-slate-950 bg-emerald-500 hover:bg-emerald-400 shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all active:scale-95"
          >
            <span>Start a Consultation</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
