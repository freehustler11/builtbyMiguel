import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Cpu,
  Sparkles,
  ArrowRight,
  ChevronDown,
  Check,
  CheckCircle2,
  Lock,
  ExternalLink,
  MessageSquare,
  FileCheck2,
  LayoutDashboard,
  ShieldCheck,
} from 'lucide-react'
import { useState } from 'react'

const SYSTEMS_FAQ = [
  {
    question: 'How do custom systems connect with my existing tools?',
    answer:
      'We integrate seamlessly with your current software ecosystem (QuickBooks, Stripe, Google Workspace, Jobber, Housecall Pro, Calendly) via secure webhooks and custom API microservices, eliminating duplicate data entry.',
  },
  {
    question: 'What is the Client Portal (`app.builtbymiguel.com`)?',
    answer:
      'The client portal is a dedicated web app where your team can view real-time inbound lead status, track ongoing SEO deliverables, access ranking heatmaps, and download invoices in one central location.',
  },
  {
    question: 'Do I have to pay per-user software licensing fees for custom tools?',
    answer:
      'No. Unlike expensive SaaS subscriptions that charge \$50 to \$100 per seat per month, custom tools built for your business belong to you with zero arbitrary per-user licensing fees.',
  },
  {
    question: 'How long does it take to deploy an automated workflow?',
    answer:
      'Standard CRM triggers, instant SMS notifications, and automated client intake kits are typically deployed and tested within 7 to 14 days of project kickoff.',
  },
]

const SYSTEMS_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'Custom Small Business Systems & Workflow Automation',
      provider: {
        '@type': 'LocalBusiness',
        name: 'Built by Miguel',
        url: 'https://builtbymiguel.com',
      },
      description:
        'Eliminate administrative friction with automated lead pipelines, instant SMS alerts, zero-touch onboarding, and client portal integrations.',
      areaServed: 'United States',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Systems & Automation Services',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Lead-to-Client CRM & Instant SMS Alerts',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Zero-Touch Client Onboarding Engine',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Internal Operations Dashboard',
            },
          },
        ],
      },
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
          'Custom Business Systems & Automation Tools | Built by Miguel',
      },
      {
        name: 'description',
        content:
          'Automate your business operations. Custom lead CRM pipelines, instant SMS notifications, zero-touch client onboarding, and bespoke operations dashboards.',
      },
      {
        name: 'keywords',
        content:
          'small business automation, custom crm development, client onboarding automation, zapier alternatives, webhook integrations, operational efficiency',
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
          'Eliminate administrative chaos. Connect forms, CRMs, booking software, and client portals into one seamless engine.',
      },
      { property: 'og:url', content: 'https://builtbymiguel.com/systems-auto' },
      { property: 'og:image', content: 'https://builtbymiguel.com/og-image.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: 'https://builtbymiguel.com/og-image.png' },
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
    <div className="space-y-24 sm:space-y-32 py-6 sm:py-10">
      {/* HERO SECTION */}
      <section className="relative text-center max-w-4xl mx-auto space-y-8">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-indigo-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
          <Cpu className="w-3.5 h-3.5" /> Operational Leverage & Automation
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
          Automate the Boring Work.{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400 bg-clip-text text-transparent">
            Scale Without the Chaos.
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
          Stop losing qualified leads to slow response times or drowning in manual copy-paste spreadsheets. We build customized CRM pipelines, instant SMS dispatchers, and zero-touch onboarding engines.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            to="/audit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-base text-slate-950 bg-indigo-400 hover:bg-indigo-300 shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-200 active:scale-95"
          >
            <Sparkles className="w-5 h-5 fill-slate-950" />
            <span>Audit Your Operations for Free</span>
          </Link>

          <Link
            to="/work"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-base text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-800 transition-all duration-200"
          >
            <span>Explore Systems Architecture</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 4 CORE AUTOMATION SOLUTIONS */}
      <section className="space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-semibold">
            Custom Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            4 Ways We Streamline Your Business
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Every system is custom tailored to your exact operational workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900/90 transition-all space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">
                Lead-to-Client CRM & SMS Dispatch
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Respond to new inbound leads within 30 seconds. Automatically send confirmation SMS messages to customers and instantly ping your field crew.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 font-medium pt-2 border-t border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Instant &lt;30s automated lead notification</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Two-way customer SMS conversation logging</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Automated calendar appointment syncing</span>
              </li>
            </ul>
          </div>

          <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900/90 transition-all space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">
                Zero-Touch Client Onboarding
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                When a new customer pays an invoice, our engine automatically provisions their folder structure, sends digital intake forms, and schedules kickoffs.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 font-medium pt-2 border-t border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Automated agreement & contract signing</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Dynamic questionnaire & asset collection</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Auto-provisioned client portal workspace</span>
              </li>
            </ul>
          </div>

          <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900/90 transition-all space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">
                Operations & Financial Dashboards
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Get a single-pane-of-glass overview of your month-to-date revenue, active job stages, technician utilization, and customer acquisition costs.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 font-medium pt-2 border-t border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Live revenue & cash flow metrics</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Job pipeline throughput tracking</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Custom team permission levels</span>
              </li>
            </ul>
          </div>

          <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900/90 transition-all space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">
                API & Multi-App Webhook Bridges
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Bridge the gap between tools that don't normally talk to each other. We create bulletproof webhook listeners with automatic error retries.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 font-medium pt-2 border-t border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Zero monthly Zapier tax</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Full payload encryption & validation</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Failover logging & Slack error alerts</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CLIENT PORTAL SPOTLIGHT */}
      <section className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-8 sm:p-12 space-y-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Lock className="w-3.5 h-3.5" /> SECURE CLIENT ACCESS
            </div>
            <h3 className="text-3xl font-extrabold text-white tracking-tight">
              Client Portal at <code className="text-emerald-400 text-2xl font-mono">app.builtbymiguel.com</code>
            </h3>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Every client gets dedicated access to their internal dashboard. Check local SEO progress, inspect automated lead workflows, submit requests, and access billing transparently.
            </p>
          </div>

          <div className="flex flex-col gap-3 shrink-0">
            <a
              href="https://app.builtbymiguel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-emerald-500 hover:bg-emerald-400 shadow-xl shadow-emerald-500/20 transition-all active:scale-95"
            >
              <span>Access Client Portal</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-semibold">
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Systems & Automation FAQs
          </h2>
        </div>

        <div className="space-y-4">
          {SYSTEMS_FAQ.map((faq, index) => {
            const isOpen = openFaqIndex === index
            return (
              <div
                key={faq.question}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left text-base font-semibold text-white hover:text-indigo-300 transition-colors focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-indigo-400' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-slate-400 leading-relaxed border-t border-slate-800/80 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-8 sm:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
          <Sparkles className="w-3.5 h-3.5" /> High-Efficiency Systems
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight max-w-2xl mx-auto">
          Ready to put your business operations on autopilot?
        </h2>

        <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Book a free 5-minute system audit. Let's map out the bottlenecks costing your business time and money.
        </p>

        <div className="pt-2">
          <Link
            to="/audit"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base text-slate-950 bg-indigo-400 hover:bg-indigo-300 shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all active:scale-95"
          >
            <Sparkles className="w-5 h-5 fill-slate-950" />
            <span>Get Free System Audit</span>
          </Link>
        </div>
      </section>
    </div>
  )
}
