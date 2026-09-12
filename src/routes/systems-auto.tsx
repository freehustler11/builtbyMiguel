import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Sparkles,
  ArrowRight,
  ChevronDown,
  Check,
  Star,
  Smartphone,
  FileCheck2,
  LayoutDashboard,
  Bot,
  Zap,
  Clock,
  Send,
  Calendar,
  Layers,
  ShieldCheck,
  Terminal,
} from 'lucide-react'
import { useState } from 'react'

const AUTOMATION_FAQ = [
  {
    question: 'How do automated text alerts help close more jobs?',
    answer:
      'Homeowners often hire the first contractor who calls back. Speed-to-lead is the single biggest factor in closing high-ticket service work. My system texts your mobile phone the second a website form is submitted, and it also sends an instant confirmation text to the customer so they stop calling your competitors.',
  },
  {
    question: 'Can your business automation services connect with my existing software?',
    answer:
      'Yes. Automations are built to run directly on top of your existing CRM, calendar, and scheduling software, connecting through webhooks and APIs rather than replacing tools you already use and pay for.',
  },
  {
    question: 'What is the Private Client Portal?',
    answer:
      'A private, password-protected dashboard where you and your team can see leads, booked jobs, technician schedules, and reports in one place, instead of checking five different apps every morning.',
  },
  {
    question: 'Do you charge per user or per lead for marketing automation for small business?',
    answer:
      'No. Plans are flat-rate starting at $99 per month, so adding more leads or team members doesn\'t increase your bill.',
  },
  {
    question: 'What\'s included in the free systems audit?',
    answer:
      'A personally recorded 5-minute video reviewing your current lead response process, the tools you\'re already using, and where jobs are likely slipping through the cracks, delivered within 24 hours. There is no sales call required to get it.',
  },
  {
    question: 'How long does it take to set up my automation system?',
    answer:
      'Most core automations, like instant lead alerts and CRM sync, are live within one to two weeks. Dashboards and client portal setups can take longer depending on how many existing tools need to connect.',
  },
  {
    question: 'What happens if a lead comes in after hours?',
    answer:
      'The system doesn\'t sleep. Alerts and confirmations go out the same way at 11pm as they do at 11am, so you never miss a same-day emergency call.',
  },
  {
    question: 'Do I need to buy new software or hardware to use these automations?',
    answer:
      'No. Automations run in the background connected to tools you likely already have, like your phone, your calendar, and your CRM, rather than requiring you to adopt a new platform.',
  },
]

const AUTOMATION_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'Business Automation Services for Small Business',
      serviceType: 'Business Automation & Workflow Consulting',
      provider: {
        '@type': 'ProfessionalService',
        name: 'built by Miguel',
        url: 'https://builtbymiguel.net',
      },
      description:
        'Automated lead alerts, CRM sync, and client dashboards for trade contractors. Built and run directly by me. Plans starting at $99/month. Free 5-minute audit.',
      areaServed: 'United States',
    },
    {
      '@type': 'FAQPage',
      mainEntity: AUTOMATION_FAQ.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    },
  ],
}

export const Route = createFileRoute('/systems-auto')({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      {
        title:
          'Business Automation Services for Small Business | built by Miguel',
      },
      {
        name: 'description',
        content:
          'Automated lead alerts, CRM sync, and client dashboards for trade contractors. Built and run directly by me. Plans starting at $99/month. Free 5-minute audit.',
      },
      {
        name: 'keywords',
        content:
          'business automation services, workflow automation consulting, small business automation systems, lead automation, custom crm pipelines, trade contractor automation',
      },
      // OpenGraph
      { property: 'og:type', content: 'website' },
      {
        property: 'og:title',
        content:
          'Business Automation Services for Small Business | built by Miguel',
      },
      {
        property: 'og:description',
        content:
          'Automated lead alerts, CRM sync, and client dashboards for trade contractors. Built and run directly by me. Plans starting at $99/month. Free 5-minute audit.',
      },
      {
        property: 'og:url',
        content: 'https://builtbymiguel.net/systems-auto',
      },
      {
        property: 'og:image',
        content: 'https://builtbymiguel.net/og-image.png',
      },
      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      {
        name: 'twitter:title',
        content:
          'Business Automation Services for Small Business | built by Miguel',
      },
      {
        name: 'twitter:description',
        content:
          'Automated lead alerts, CRM sync, and client dashboards for trade contractors. Built and run directly by me. Plans starting at $99/month. Free 5-minute audit.',
      },
      {
        name: 'twitter:image',
        content: 'https://builtbymiguel.net/og-image.png',
      },
    ],
    links: [
      {
        rel: 'canonical',
        href: 'https://builtbymiguel.net/systems-auto',
      },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify(AUTOMATION_JSON_LD),
      },
    ],
  }),
  component: SystemsAutoPage,
})

function SystemsAutoPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)
  const [activeCodeTab, setActiveCodeTab] = useState('lead-pipeline.ts')

  return (
    <div className="w-full bg-[#FAF8F5] dark:bg-[#080B11] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* ========================================================================= */}
      {/* SECTION 1: HERO                                                           */}
      {/* ========================================================================= */}
      <section className="relative w-full overflow-hidden border-b border-slate-200/80 dark:border-slate-800/80 pt-12 pb-16 sm:pt-20 sm:pb-24 lg:pb-28">
        {/* Ambient mesh glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-amber-200/30 via-orange-100/20 to-sky-200/20 dark:from-amber-500/10 dark:via-orange-500/5 dark:to-sky-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

        {/* Radial dot grid overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] dark:bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:24px_24px] opacity-40 dark:opacity-30 pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            {/* Left Column: Copy & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-2">
                <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono font-bold tracking-wider uppercase text-amber-800 dark:text-amber-300 bg-amber-100/90 dark:bg-amber-950/50 px-3.5 py-1.5 rounded-full border border-amber-300/80 dark:border-amber-700/50 shadow-2xs">
                  <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  High-Leverage Automations
                </span>
              </div>

              {/* H1 */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display leading-[1.12]">
                Business Automation Services That Connect Leads Straight to Your Phone
              </h1>

              {/* Subhead */}
              <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-2xl">
                Get automation built for trade contractors tired of losing jobs to slow replies. Leads text straight to your phone and sync with your scheduling software automatically, so you're never waiting on someone else's dashboard.
              </p>

              {/* CTAs (Dual on Hero as specified) */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/audit"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 dark:bg-amber-400 dark:hover:bg-amber-300 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Get Your Free Systems Audit</span>
                </Link>
                <Link
                  to="/work"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-850 transition-all duration-200 shadow-2xs active:scale-95 cursor-pointer"
                >
                  <span>See My Work and Systems</span>
                  <ArrowRight className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                </Link>
              </div>

              {/* Trust Line */}
              <div className="pt-2 text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>100% Free · Custom video breakdown · No high-pressure sales calls</span>
              </div>
            </div>

            {/* Right Column: Flat Vector Illustration */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md rounded-3xl bg-white/90 dark:bg-[#111827]/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/90 shadow-2xl p-6 sm:p-8 space-y-6">
                {/* Visual Pipeline Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Live Lead Pipeline
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-800/40 font-semibold">
                    0.4s Latency
                  </span>
                </div>

                {/* Node 1: Mobile Text Alert */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50">
                  <div className="w-11 h-11 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-sm">
                    <Smartphone className="w-5 h-5" strokeWidth={2.2} />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-mono font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wide">
                      Instant SMS Alert
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                      Direct text dispatched to mobile
                    </div>
                  </div>
                </div>

                {/* Connecting Arrow */}
                <div className="flex justify-center -my-2">
                  <div className="w-0.5 h-6 bg-gradient-to-b from-amber-400 to-sky-400 rounded-full" />
                </div>

                {/* Node 2: Calendar Auto-Sync */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-sky-50/80 dark:bg-sky-950/30 border border-sky-200/80 dark:border-sky-800/50">
                  <div className="w-11 h-11 rounded-xl bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Calendar className="w-5 h-5" strokeWidth={2.2} />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-mono font-bold text-sky-900 dark:text-sky-300 uppercase tracking-wide">
                      Calendar Booking
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                      Diagnostics synced with scheduling
                    </div>
                  </div>
                </div>

                {/* Connecting Arrow */}
                <div className="flex justify-center -my-2">
                  <div className="w-0.5 h-6 bg-gradient-to-b from-sky-400 to-emerald-400 rounded-full" />
                </div>

                {/* Node 3: CRM Dashboard Record */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/50">
                  <div className="w-11 h-11 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <LayoutDashboard className="w-5 h-5" strokeWidth={2.2} />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-mono font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wide">
                      CRM Record Provisioned
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                      Portal workspace created automatically
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: RELIABLE WEBHOOKS AND DATA PIPELINES (CODE SHOWCASE)           */}
      {/* ========================================================================= */}
      <section className="relative w-full py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0B0F17] transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            {/* Left Column: Intro Copy (~40% width) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/40">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Clean Code
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight leading-tight">
                Reliable Webhooks and Data Pipelines
              </h2>
              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                Inspect the underlying automation logic that routes leads to your phone in seconds.
              </p>
            </div>

            {/* Right Column: Code Editor Widget (~60% width) */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-slate-800 bg-[#0B0F17] shadow-2xl overflow-hidden backdrop-blur-xl">
                {/* Code Editor Tab Strip */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800/80 bg-[#070A0F]/90 overflow-x-auto">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>

                  {/* Tabs */}
                  <div className="flex items-center gap-1">
                    <span className="px-3 py-1 text-xs font-mono text-slate-500 cursor-default">
                      lead-trigger
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveCodeTab('lead-pipeline.ts')}
                      className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                        activeCodeTab === 'lead-pipeline.ts'
                          ? 'bg-slate-800 text-amber-400 font-bold border border-amber-500/30'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      lead-pipeline.ts
                    </button>
                    <span className="px-3 py-1 text-xs font-mono text-slate-500 cursor-default">
                      local-schema.json
                    </span>
                    <span className="px-3 py-1 text-xs font-mono text-slate-500 cursor-default">
                      speed.config.ts
                    </span>
                  </div>
                </div>

                {/* Code Window Body */}
                <div className="p-6 sm:p-8 font-mono text-xs sm:text-sm text-slate-300 leading-relaxed overflow-x-auto">
                  <pre className="space-y-1">
                    <code>
                      <span className="text-purple-400">export async function</span>{' '}
                      <span className="text-blue-400 font-bold">handleInboundLead</span>
                      <span className="text-slate-400">(</span>
                      <span className="text-amber-300">lead</span>
                      <span className="text-slate-400">:</span>{' '}
                      <span className="text-emerald-400">Lead</span>
                      <span className="text-slate-400">) &#123;</span>
                      {'\n'}
                      <span className="text-slate-500">  // 1. Instant SMS & Dispatch Notification</span>
                      {'\n'}
                      <span className="text-slate-400">  </span>
                      <span className="text-purple-400">await</span>{' '}
                      <span className="text-sky-300">smsDispatcher</span>
                      <span className="text-slate-400">.</span>
                      <span className="text-amber-400">sendLeadAlert</span>
                      <span className="text-slate-400">(lead);</span>
                      {'\n'}
                      <span className="text-slate-500">  // 2. Auto-sync to CRM and Google Calendar</span>
                      {'\n'}
                      <span className="text-slate-400">  </span>
                      <span className="text-purple-400">const</span>{' '}
                      <span className="text-slate-200">crmRecord</span>{' '}
                      <span className="text-purple-400">=</span>{' '}
                      <span className="text-purple-400">await</span>{' '}
                      <span className="text-sky-300">crmPipeline</span>
                      <span className="text-slate-400">.</span>
                      <span className="text-amber-400">sync</span>
                      <span className="text-slate-400">(lead);</span>
                      {'\n'}
                      <span className="text-slate-400">  </span>
                      <span className="text-purple-400">await</span>{' '}
                      <span className="text-sky-300">calendar</span>
                      <span className="text-slate-400">.</span>
                      <span className="text-amber-400">scheduleDiagnostic</span>
                      <span className="text-slate-400">(lead.timeSlot);</span>
                      {'\n'}
                      <span className="text-slate-500">  // 3. Provision Client Portal Workspace</span>
                      {'\n'}
                      <span className="text-slate-400">  </span>
                      <span className="text-purple-400">await</span>{' '}
                      <span className="text-sky-300">clientPortal</span>
                      <span className="text-slate-400">.</span>
                      <span className="text-amber-400">createWorkspace</span>
                      <span className="text-slate-400">(lead.email);</span>
                      {'\n'}
                      <span className="text-slate-400">&#125;</span>
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: CUSTOM AUTOMATION SYSTEMS (FEATURE GRID)                       */}
      {/* ========================================================================= */}
      <section className="relative w-full py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-[#FAF8F5]/60 dark:bg-[#080B11] transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
          <div className="mb-12 sm:mb-16 space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-800/40">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
              Workflow Automation Consulting
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight leading-tight">
              Custom Automation Systems I Build for You
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Rather than forcing your team into complicated workflow automation software with endless monthly subscription fees, I write custom automations that run directly on your existing tools.
            </p>
          </div>

          {/* 2x2 Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1: Speed to Lead */}
            <div className="p-7 sm:p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:border-amber-400/80 dark:hover:border-amber-500/80 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-amber-100/90 dark:bg-amber-950/70 border border-amber-300/80 dark:border-amber-700/60 flex items-center justify-center text-amber-700 dark:text-amber-400 shadow-2xs">
                    <Smartphone className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40">
                    Speed to Lead
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
                  Instant Lead Alert System
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Get customer requests on your phone by text message right away. No manual data entry needed.
                </p>
                <ul className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Instant text alerts to you and your customer</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Direct call routing and phone number tracking</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Automatic backup emails and CRM pipeline sync</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Card 2: Easy Intake */}
            <div className="p-7 sm:p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:border-sky-400/80 dark:hover:border-sky-500/80 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-sky-100/90 dark:bg-sky-950/70 border border-sky-300/80 dark:border-sky-700/60 flex items-center justify-center text-sky-700 dark:text-sky-400 shadow-2xs">
                    <FileCheck2 className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider text-sky-800 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/40 border border-sky-200/60 dark:border-sky-800/40">
                    Easy Intake
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
                  Client Intake and Onboarding
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Automate your client onboarding. Send digital agreements, collect payment, and set up project folders automatically.
                </p>
                <ul className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Online agreements with digital signatures</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Automatic Google Drive folder creation</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Simple kickoff questionnaires that save time</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Card 3: Central Dashboard */}
            <div className="p-7 sm:p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:border-emerald-400/80 dark:hover:border-emerald-500/80 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-emerald-100/90 dark:bg-emerald-950/70 border border-emerald-300/80 dark:border-emerald-700/60 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shadow-2xs">
                    <LayoutDashboard className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40">
                    Central Dashboard
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
                  Custom Business Dashboards
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Stop opening five different apps every morning. See your sales, booked jobs, technician schedules, and search rankings in one place.
                </p>
                <ul className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Live sales and lead reports</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Separate logins for staff and technicians</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Private client portal with real-time updates</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Card 4: Smart Tools */}
            <div className="p-7 sm:p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:border-purple-400/80 dark:hover:border-purple-500/80 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-purple-100/90 dark:bg-purple-950/70 border border-purple-300/80 dark:border-purple-700/60 flex items-center justify-center text-purple-700 dark:text-purple-400 shadow-2xs">
                    <Bot className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider text-purple-800 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-800/40">
                    Smart Tools
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
                  AI Content and Search Tools
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Helpful tools that draft localized service pages, suggest review replies, and monitor local competitors.
                </p>
                <ul className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Fast review reply drafts that boost rankings</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>City-specific service page writer</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Weekly updates on competitor rankings and prices</span>
                  </li>
                </ul>

                {/* Cross-pillar link to /seo as specified */}
                <div className="pt-2">
                  <Link
                    to="/seo"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400 hover:text-amber-500 transition-colors"
                  >
                    <span>See how this fits into your broader SEO strategy →</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Single CTA Button */}
          <div className="mt-12 sm:mt-14 flex items-center justify-start">
            <Link
              to="/audit"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 dark:bg-amber-400 dark:hover:bg-amber-300 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Start My Free Systems Audit</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: WHAT CLIENTS SAY (TESTIMONIALS)                                 */}
      {/* ========================================================================= */}
      <section className="relative w-full py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0B0F17] transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
          <div className="mb-12 sm:mb-16 space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/40">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Verified Proof
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight leading-tight">
              What Clients Say
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Testimonial 1: Marcus */}
            <div className="relative p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  "We used to lose jobs because nobody got back to people fast enough. Now a lead texts my phone the second the form goes through, and I can respond before they've even closed the tab."
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold font-display text-slate-900 dark:text-white text-xs sm:text-sm">
                    Marcus
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    Electrical Contractor
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
                  Verified
                </span>
              </div>
            </div>

            {/* Testimonial 2: Renee */}
            <div className="relative p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  "Onboarding a new client used to mean three emails and a missing form. Now the agreement, the payment, and the project folder are all set up automatically before I even sit down."
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold font-display text-slate-900 dark:text-white text-xs sm:text-sm">
                    Renee
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    Roofing Company Owner
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
                  Verified
                </span>
              </div>
            </div>

            {/* Testimonial 3: Dave */}
            <div className="relative p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  "I used to check four different apps every morning just to see where things stood. Now it's one dashboard, and I actually know what's happening on every job."
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold font-display text-slate-900 dark:text-white text-xs sm:text-sm">
                    Dave
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    HVAC Business Owner
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
                  Verified
                </span>
              </div>
            </div>
          </div>

          {/* Single CTA Button */}
          <div className="mt-12 sm:mt-14 flex items-center justify-start">
            <Link
              to="/audit"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 dark:bg-amber-400 dark:hover:bg-amber-300 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Claim Your Free Systems Audit</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: FREQUENTLY ASKED QUESTIONS                                     */}
      {/* ========================================================================= */}
      <section className="relative w-full py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-[#FAF8F5]/60 dark:bg-[#080B11] transition-colors duration-200">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 space-y-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/40">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Common Inquiries
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight leading-tight">
              Frequently Asked Questions About My Business Automation Services
            </h2>
          </div>

          <div className="space-y-4 pt-4">
            {AUTOMATION_FAQ.map((faq, index) => {
              const isOpen = openFaqIndex === index
              return (
                <div
                  key={faq.question}
                  className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] overflow-hidden shadow-2xs hover:border-amber-400/60 dark:hover:border-amber-500/60 transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left text-sm sm:text-base font-bold font-display text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors focus:outline-none cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 shrink-0 ml-4 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-amber-600 dark:text-amber-400' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6: CLOSING HERO CTA                                               */}
      {/* ========================================================================= */}
      <section className="relative w-full py-20 sm:py-28 overflow-hidden bg-slate-950 dark:bg-black text-white transition-colors duration-200">
        {/* Glowing background bloom */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[750px] h-[350px] bg-gradient-to-b from-amber-500/15 via-rose-500/5 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 text-center space-y-6 relative z-10">
          <div>
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-amber-400 bg-amber-400/10 border border-amber-400/30 px-3.5 py-1.5 rounded-full inline-block">
              Stop Losing Jobs to Slow Replies
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-white tracking-tight leading-tight max-w-2xl mx-auto">
            Get Automation That Answers Before Your Competitor Does
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            Stop losing jobs to whoever calls back first. Start with a free 5-minute audit and see exactly where your leads are slipping through the cracks.
          </p>

          <div className="flex items-center justify-center pt-4">
            <Link
              to="/audit"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 dark:bg-amber-400 dark:hover:bg-amber-300 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Get My Free Systems Audit</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
