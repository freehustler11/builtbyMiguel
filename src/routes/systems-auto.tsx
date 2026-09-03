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
    question: 'How do automated SMS alerts and lead workflows increase sales conversions?',
    answer:
      'Studies show that contacting a local inbound lead within 5 minutes results in a 21x higher chance of closing the sale compared to waiting 30 minutes. Our automated webhook engines immediately bridge your website forms with SMS dispatch to your mobile phone and instant auto-reply text messages to the customer before they call a competitor.',
  },
  {
    question: 'Can this connect with my existing field service software or CRM?',
    answer:
      'Yes. We build custom API bridges and webhooks into Housecall Pro, Jobber, ServiceTitan, HubSpot, Zoho, HighLevel, Airtable, or custom SQL databases.',
  },
  {
    question: 'What is the Client Portal on app.builtbymiguel.net?',
    answer:
      'Every client receives private portal access where you can monitor live lead activity, search ranking heatmaps, site health metrics, monthly invoices, and submit new development requests with 1 click.',
  },
  {
    question: 'Do you charge per user or per lead?',
    answer:
      'No. We build dedicated, bespoke systems without per-user licensing penalties. You own your data, your integrations, and your workflows with zero lock-in.',
  },
]

const SYSTEMS_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'Custom Business Systems & Workflow Automation',
      provider: {
        '@type': 'LocalBusiness',
        name: 'Built by Miguel',
        url: 'https://builtbymiguel.net',
      },
      description:
        'Eliminate manual admin work with custom lead pipelines, instant SMS dispatch, client intake engines, and operational dashboards.',
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
          'Custom Business Systems & Workflow Automation | Built by Miguel',
      },
      {
        name: 'description',
        content:
          'Automate your local business operations. Custom lead CRMs, instant SMS dispatch, client intake engines, and real-time business dashboards.',
      },
      {
        name: 'keywords',
        content:
          'business automation tools, custom crm development, webhook automation, small business workflows, lead capture automation, built by miguel',
      },
      // OpenGraph
      { property: 'og:type', content: 'website' },
      {
        property: 'og:title',
        content:
          'Custom Business Systems & Workflow Automation | Built by Miguel',
      },
      {
        property: 'og:description',
        content:
          'Eliminate repetitive busywork. Connect forms, CRMs, booking software, and client portals into one seamless engine.',
      },
      { property: 'og:url', content: 'https://builtbymiguel.net/systems-auto' },
      { property: 'og:image', content: 'https://builtbymiguel.net/og-image.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
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
      {/* HERO SECTION */}
      <section className="relative text-center max-w-4xl mx-auto">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-rose-200/30 via-orange-100/30 to-teal-100/30 dark:from-rose-500/10 dark:via-orange-500/10 dark:to-teal-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

        <div className="mb-8 sm:mb-10 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-rose-600 dark:text-rose-400 shadow-sm">
            <Cpu className="w-3.5 h-3.5" /> High-Leverage Automations
          </div>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.12] mb-6 sm:mb-8">
          Custom Systems &{' '}
          <span className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 bg-clip-text text-transparent">
            Workflow Automation.
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto font-normal">
          Responding to inbound inquiries quickly is critical for closing jobs. We engineer custom pipelines that route web leads straight to your phone via SMS, sync seamlessly with Jobber or Housecall Pro, and trigger automated confirmations.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 sm:pt-10">
          <Link
            to="/audit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-base text-white bg-slate-900 dark:bg-rose-600 hover:bg-black dark:hover:bg-rose-500 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 active:scale-95"
          >
            <Sparkles className="w-5 h-5 text-rose-400 dark:text-white fill-rose-400 dark:fill-white" />
            <span>Claim Your Free Automation Audit</span>
          </Link>

          <Link
            to="/work"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-base text-slate-800 dark:text-slate-200 hover:text-black dark:hover:text-white bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow transition-all duration-200"
          >
            <span>View In-House Software Architecture</span>
            <ArrowRight className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </Link>
        </div>

        <div className="pt-3 sm:pt-4 text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>100% Free · Custom video breakdown · No high-pressure sales calls</span>
        </div>
      </section>

      {/* CODE INSPECTOR TERMINAL SECTION */}
      <section className="space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400">
            <Code2 className="w-3.5 h-3.5" /> LIVE CODE ARCHITECTURE
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            Engineered Webhooks & Data Pipelines
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Inspect real production automation schemas and webhook triggers.
          </p>
        </div>

        <CodeTerminalInspector />
      </section>

      {/* 4 DELIVERABLES WHITE CARDS */}
      <section className="space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-[11px] font-mono uppercase tracking-widest text-orange-600 dark:text-orange-400 font-bold">
            Operational Engines
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            Automations We Build for You
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Custom logic built on resilient serverless infrastructure. No flaky Zapier chains that break when APIs update.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-orange-500/40 dark:hover:border-orange-500/50 hover:shadow-xl transition-all space-y-5 shadow-sm dark:shadow-none">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-100 dark:border-orange-800/40 flex items-center justify-center text-orange-600 dark:text-orange-400">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="space-y-2">
              <div className="text-[10px] font-mono font-bold tracking-widest text-orange-600 dark:text-orange-400 uppercase">
                SPEED-TO-LEAD
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Instant Lead Notification Engine
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Route customer quote requests instantly to your phone via SMS, push notifications, or dispatch alerts with zero manual data entry.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium pt-2 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
                <span>Instant SMS notifications to staff & customer</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
                <span>Call whisper routing & inbound tracking numbers</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
                <span>Automatic fallback email & CRM pipeline sync</span>
              </li>
            </ul>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-cyan-500/40 dark:hover:border-cyan-500/50 hover:shadow-xl transition-all space-y-5 shadow-sm dark:shadow-none">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-100 dark:border-cyan-800/40 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <Layers className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="space-y-2">
              <div className="text-[10px] font-mono font-bold tracking-widest text-cyan-600 dark:text-cyan-400 uppercase">
                ZERO TOUCH
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Client Intake & Onboarding Engine
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Automate the entire client intake process. Generate contracts, process initial retainers, create client project folders, and send welcome guides automatically upon booking.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium pt-2 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>Automated digital agreement generation & signatures</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>Cloud storage folder provisioning (Google Drive / S3)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>Intake question validation & automated kickoff notifications</span>
              </li>
            </ul>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-emerald-500/40 dark:hover:border-emerald-500/50 hover:shadow-xl transition-all space-y-5 shadow-sm dark:shadow-none">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Database className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="space-y-2">
              <div className="text-[10px] font-mono font-bold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">
                SINGLE PANE OF GLASS
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Custom Operational Dashboards
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Stop jumping between 6 different SaaS apps. We build centralized web dashboards that show your revenue, active jobs, technician schedules, and search rankings in real time.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium pt-2 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Live KPI telemetry & revenue reporting</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Role-based technician and admin access permissions</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Secure client portal integration (`app.builtbymiguel.net`)</span>
              </li>
            </ul>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-indigo-500/40 dark:hover:border-indigo-500/50 hover:shadow-xl transition-all space-y-5 shadow-sm dark:shadow-none">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="space-y-2">
              <div className="text-[10px] font-mono font-bold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase">
                AI AUTOMATION
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                AI Local Intelligence Agents
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Custom AI workflows that auto-generate localized service content, draft customer review responses with optimal keyword density, and audit competitor websites weekly.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium pt-2 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>Automated keyword-optimized review replies</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>Geo-targeted blog and localized landing page drafter</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>Weekly competitor price and citation change alerts</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ ACCORDION */}
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
      <section className="rounded-[3rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-8 sm:p-16 text-center shadow-xl dark:shadow-none relative overflow-hidden transition-colors duration-200">
        <div className="mb-6 sm:mb-8 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-rose-600 dark:text-rose-400 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" /> High-Leverage Automations
          </div>
        </div>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white tracking-tight max-w-2xl mx-auto leading-[1.15] mb-5 sm:mb-6">
          Ready to Put Your Client Operations on Autopilot?
        </h2>

        <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-xl mx-auto leading-relaxed font-normal mb-8 sm:mb-10">
          Request a free 5-minute video audit. We'll map out how to cut 10+ hours of manual busywork from your business every week.
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
