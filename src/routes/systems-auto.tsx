import { FreeSystemsAuditCTA } from '../components/FreeSystemsAuditCTA'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Cpu,
  Sparkles,
  ArrowRight,
  ChevronDown,
  Check,
  Zap,
  Bot,
  Layers,
  Database,
  Code2,
} from 'lucide-react'
import { useState } from 'react'
import { CodeTerminalInspector } from '../components/CodeTerminalInspector'

const SYSTEMS_FAQ = [
  {
    question: 'How do automated text alerts help close more jobs?',
    answer:
      'Homeowners often hire the first contractor who calls back. My system texts your mobile phone the second a website form is submitted. It also sends an instant confirmation text to the customer so they stop calling your competitors.',
  },
  {
    question: 'Can your business automation services connect with my existing software?',
    answer:
      'Yes. Through my workflow automation consulting, I connect quote forms and booking workflows directly into Housecall Pro, Jobber, ServiceTitan, HubSpot, Calendly, Stripe, and custom databases.',
  },
  {
    question: 'What is the Private Client Portal?',
    answer:
      'You receive a secure dashboard showing your live customer inquiries, Google rankings, monthly project tasks, and invoices in real time without waiting for slow email reports.',
  },
  {
    question: 'Do you charge per user or per lead for marketing automation for small business?',
    answer:
      'No. You pay a simple flat project or monthly retainer fee with zero per-user penalties and zero per-lead fees. You own your automations, webhook code, and customer data completely.',
  },
]

const SYSTEMS_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'Business Automation Services for Contractors',
      serviceType: 'Business Process Automation Consulting & Workflow Automation',
      provider: {
        '@type': 'LocalBusiness',
        name: 'built by Miguel',
        url: 'https://builtbymiguel.net',
      },
      description:
        'Business automation services, workflow automation consulting, and instant SMS dispatch pipelines for trade contractors and local businesses.',
      areaServed: 'United States',
    },
    {
      '@type': 'FAQPage',
      mainEntity: SYSTEMS_FAQ.map((faq) => ({
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
          'Business Automation Services for Contractors | built by Miguel',
      },
      {
        name: 'description',
        content:
          'We provide business automation services and workflow automation consulting for contractors. Route leads instantly to technician phones and eliminate manual busywork.',
      },
      {
        name: 'keywords',
        content:
          'business automation services, business process automation consulting, workflow automation consulting, marketing automation for small business, built by miguel',
      },
      // OpenGraph
      { property: 'og:type', content: 'website' },
      {
        property: 'og:title',
        content:
          'Business Automation Services for Contractors | built by Miguel',
      },
      {
        property: 'og:description',
        content:
          'We provide business automation services and workflow automation consulting for contractors. Route leads instantly to technician phones and eliminate manual busywork.',
      },
      { property: 'og:url', content: 'https://builtbymiguel.net/systems-auto' },
      { property: 'og:image', content: 'https://builtbymiguel.net/og-image.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
      {
        name: 'twitter:title',
        content:
          'Business Automation Services for Contractors | built by Miguel',
      },
      {
        name: 'twitter:description',
        content:
          'We provide business automation services and workflow automation consulting for contractors. Route leads instantly to technician phones and eliminate manual busywork.',
      },
      { name: 'twitter:image', content: 'https://builtbymiguel.net/og-image.png' },
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
        children: JSON.stringify(SYSTEMS_JSON_LD),
      },
    ],
  }),
  component: SystemsAutoPage,
})

function SystemsAutoPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  return (
    <div className="space-y-24 sm:space-y-32 lg:space-y-36 py-6 sm:py-10">
      {/* =========================================================================
          SECTION 1: HERO SECTION
          ========================================================================= */}
      <section className="relative text-center max-w-4xl mx-auto">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-rose-200/30 via-orange-100/30 to-teal-100/30 dark:from-rose-500/10 dark:via-orange-500/10 dark:to-teal-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

        <div className="mb-8 sm:mb-10 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-rose-600 dark:text-rose-400 shadow-sm">
            <Cpu className="w-3.5 h-3.5" /> High-Leverage Automations
          </div>
        </div>

        {/* Main H1 with Primary Keyword */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.12] mb-6 sm:mb-8">
          Business Automation Services That Connect Leads Straight to{' '}
          <span className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 bg-clip-text text-transparent">
            Your Phone.
          </span>
        </h1>

        {/* Lead Paragraph with Primary & Secondary Keywords */}
        <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto font-normal">
          We provide business automation services, workflow automation consulting, and small business automation systems for trade contractors who are tired of losing jobs to slow replies. Our systems send website leads straight to your phone by text, sync with your scheduling software, and confirm appointments right away. Speed-to-lead is the single biggest factor in closing high-ticket service work.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 sm:pt-10">
          <Link
            to="/audit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-base text-white bg-slate-900 dark:bg-rose-600 hover:bg-black dark:hover:bg-rose-500 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 active:scale-95"
          >
            <Sparkles className="w-5 h-5 text-rose-400 dark:text-white fill-rose-400 dark:fill-white" />
            <span>Get Your Free Systems Audit</span>
          </Link>

          <Link
            to="/work"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-base text-slate-800 dark:text-slate-200 hover:text-black dark:hover:text-white bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow transition-all duration-200"
          >
            <span>See My Work and Systems</span>
            <ArrowRight className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </Link>
        </div>

        <div className="pt-3 sm:pt-4 text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>100% Free · Custom video breakdown · No high-pressure sales calls</span>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: CODE INSPECTOR TERMINAL SECTION
          ========================================================================= */}
      <section className="space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400">
            <Code2 className="w-3.5 h-3.5" /> CLEAN CODE
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            Reliable Webhooks and Data Pipelines
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Inspect the underlying automation logic that routes leads to your phone in seconds.
          </p>
        </div>

        <CodeTerminalInspector />
      </section>

      {/* =========================================================================
          SECTION 3: 4 DELIVERABLES WHITE CARDS
          ========================================================================= */}
      <section className="space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-[11px] font-mono uppercase tracking-widest text-orange-600 dark:text-orange-400 font-bold">
            Workflow Automation Consulting
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            Custom Automation Systems I Build for You
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Rather than forcing your team into complicated workflow automation software with endless monthly subscription fees, I write custom automations that run directly on your existing tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Speed to Lead */}
          <div className="p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-orange-500/40 dark:hover:border-orange-500/50 hover:shadow-xl transition-all space-y-5 shadow-sm dark:shadow-none">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-100 dark:border-orange-800/40 flex items-center justify-center text-orange-600 dark:text-orange-400">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="space-y-2">
              <div className="text-[10px] font-mono font-bold tracking-widest text-orange-600 dark:text-orange-400 uppercase">
                SPEED TO LEAD
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Instant Lead Alert System
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Get customer requests on your phone by text message right away. No manual data entry needed.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium pt-2 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
                <span>Instant text alerts to you and your customer</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
                <span>Direct call routing and phone number tracking</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
                <span>Automatic backup emails and CRM pipeline sync</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Easy Intake */}
          <div className="p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-cyan-500/40 dark:hover:border-cyan-500/50 hover:shadow-xl transition-all space-y-5 shadow-sm dark:shadow-none">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-100 dark:border-cyan-800/40 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <Layers className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="space-y-2">
              <div className="text-[10px] font-mono font-bold tracking-widest text-cyan-600 dark:text-cyan-400 uppercase">
                EASY INTAKE
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Client Intake and Onboarding
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Automate your client onboarding. Send digital agreements, collect payment, and set up project folders automatically.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium pt-2 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>Online agreements with digital signatures</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>Automatic Google Drive folder creation</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>Simple kickoff questionnaires that save time</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Central Dashboard */}
          <div className="p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-emerald-500/40 dark:hover:border-emerald-500/50 hover:shadow-xl transition-all space-y-5 shadow-sm dark:shadow-none">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Database className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="space-y-2">
              <div className="text-[10px] font-mono font-bold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">
                CENTRAL DASHBOARD
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Custom Business Dashboards
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Stop opening five different apps every morning. See your sales, booked jobs, technician schedules, and search rankings in one place.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium pt-2 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Live sales and lead reports</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Separate logins for staff and technicians</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Private client portal with real-time updates</span>
              </li>
            </ul>
          </div>

          {/* Card 4: Smart Tools */}
          <div className="p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-indigo-500/40 dark:hover:border-indigo-500/50 hover:shadow-xl transition-all space-y-5 shadow-sm dark:shadow-none">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="space-y-2">
              <div className="text-[10px] font-mono font-bold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase">
                SMART TOOLS
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                AI Content and Search Tools
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Helpful tools that draft localized service pages, suggest review replies, and monitor local competitors.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium pt-2 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>Fast review reply drafts that boost rankings</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>City-specific service page writer</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>Weekly updates on competitor rankings and prices</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: FAQ ACCORDION
          ========================================================================= */}
      <section className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="text-[11px] font-mono uppercase tracking-widest text-rose-600 dark:text-rose-400 font-bold">
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Systems & Automation FAQs
          </h2>
        </div>

        <div className="space-y-4">
          {SYSTEMS_FAQ.map((faq, index) => {
            const isOpen = openFaqIndex === index
            return (
              <div
                key={faq.question}
                className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] overflow-hidden shadow-sm dark:shadow-none"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left text-base font-semibold text-slate-900 dark:text-white hover:text-rose-600 dark:hover:text-rose-400 transition-colors focus:outline-none cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-rose-600 dark:text-rose-400' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* BOTTOM CTA */}
      <FreeSystemsAuditCTA />
    </div>
  )
}
