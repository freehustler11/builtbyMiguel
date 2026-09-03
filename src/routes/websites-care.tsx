import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Globe,
  Zap,
  Sparkles,
  ArrowRight,
  ChevronDown,
  Check,
  ShieldCheck,
  Smartphone,
  RefreshCw,
} from 'lucide-react'
import { useState } from 'react'

const WEBSITES_FAQ = [
  {
    question: 'Why build custom React/TanStack sites instead of WordPress or Wix?',
    answer:
      'Standard WordPress and template builders often load heavy CSS libraries, slow database queries, and redundant plugins that slow down mobile devices. Our custom React applications feature clean code, instant page navigation, and proactive 24/7 care so your site stays fast, secure, and dependable.',
  },
  {
    question: 'What is included in the Monthly Care & Hosting Plan?',
    answer:
      'The Care Plan includes ultra-fast global edge hosting, SSL certificates, daily automated backups, 24/7 uptime monitoring, Core Web Vital speed maintenance, and up to 2 hours of monthly content or technical changes.',
  },
  {
    question: 'Can I integrate my existing CRM, booking software, or scheduling app?',
    answer:
      'Yes. We build custom API bridges and webhook triggers into Housecall Pro, Jobber, ServiceTitan, Calendly, Stripe, HubSpot, or any custom database you use.',
  },
  {
    question: 'Do I own the code and website assets?',
    answer:
      '100% yes. Once the initial build sprint is paid for, all source code, domain names, content, and design assets belong entirely to you with zero vendor lock-in.',
  },
]

const WEBSITES_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'High-Speed Custom Websites & Care Plans',
      provider: {
        '@type': 'LocalBusiness',
        name: 'built by Miguel',
        url: 'https://builtbymiguel.net',
      },
      description:
        'Sub-second local business websites built with modern React, TanStack Start, and Tailwind CSS. Includes 24/7 care, edge hosting, and maintenance plans.',
      areaServed: 'United States',
    },
    {
      '@type': 'FAQPage',
      mainEntity: WEBSITES_FAQ.map((faq) => ({
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

export const Route = createFileRoute('/websites-care')({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      {
        title:
          'High-Speed Websites & Monthly Care Plans | built by Miguel',
      },
      {
        name: 'description',
        content:
          'Sub-second custom websites built for local service businesses. Fast mobile load times, high conversion architecture, and 24/7 care & maintenance retainers.',
      },
      {
        name: 'keywords',
        content:
          'fast local business website, website maintenance plans, custom web design, sub-second site speed, conversion rate optimization, built by miguel',
      },
      // OpenGraph
      { property: 'og:type', content: 'website' },
      {
        property: 'og:title',
        content:
          'High-Speed Websites & Monthly Care Plans | built by Miguel',
      },
      {
        property: 'og:description',
        content:
          'Websites built strictly to convert visitors into booked phone calls. Sub-second speed and 24/7 care.',
      },
      { property: 'og:url', content: 'https://builtbymiguel.net/websites-care' },
      { property: 'og:image', content: 'https://builtbymiguel.net/og-image.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: 'https://builtbymiguel.net/og-image.png' },
    ],
    links: [
      {
        rel: 'canonical',
        href: 'https://builtbymiguel.net/websites-care',
      },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify(WEBSITES_JSON_LD),
      },
    ],
  }),
  component: WebsitesCarePage,
})

function WebsitesCarePage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  return (
    <div className="space-y-24 sm:space-y-32 lg:space-y-36 py-6 sm:py-10">
      {/* HERO SECTION */}
      <section className="relative text-center max-w-4xl mx-auto">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-rose-200/30 via-orange-100/30 to-teal-100/30 dark:from-rose-500/10 dark:via-orange-500/10 dark:to-teal-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

        <div className="mb-8 sm:mb-10 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-rose-600 dark:text-rose-400 shadow-sm">
            <Zap className="w-3.5 h-3.5" /> Sub-Second Edge Architecture
          </div>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.12] mb-6 sm:mb-8">
          Websites Built Strictly to{' '}
          <span className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 bg-clip-text text-transparent">
            Convert Calls.
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto font-normal">
          Slow, bloated websites cost you customers. We engineer fast, clean React web applications with thumb-friendly tap-to-call funnels, resilient uptime, and proactive 24/7 care so you never lose a job to a broken website.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 sm:pt-10">
          <Link
            to="/audit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-base text-white bg-slate-900 dark:bg-rose-600 hover:bg-black dark:hover:bg-rose-500 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 active:scale-95"
          >
            <Sparkles className="w-5 h-5 text-rose-400 dark:text-white fill-rose-400 dark:fill-white" />
            <span>Check Your Current Site Speed</span>
          </Link>

          <Link
            to="/work"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-base text-slate-800 dark:text-slate-200 hover:text-black dark:hover:text-white bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow transition-all duration-200"
          >
            <span>Explore In-House Systems</span>
            <ArrowRight className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </Link>
        </div>

        <div className="pt-3 sm:pt-4 text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>100% Free · Custom video breakdown · No high-pressure sales calls</span>
        </div>
      </section>

      {/* 4 DELIVERABLES WHITE CARDS */}
      <section className="space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-[11px] font-mono uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-bold">
            Web Architecture
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            Engineered for Maximum Speed & Conversion
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Every millimeter of design and line of code is dedicated to getting qualified inbound prospects to take immediate action.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-cyan-500/40 dark:hover:border-cyan-500/50 hover:shadow-xl transition-all space-y-5 shadow-sm dark:shadow-none">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-100 dark:border-cyan-800/40 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="space-y-2">
              <div className="text-[10px] font-mono font-bold tracking-widest text-cyan-600 dark:text-cyan-400 uppercase">
                CORE WEB VITALS
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Sub-Second Speed & Edge Deployment
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Render pages in fast response times on mobile networks. Clean code satisfies Google Core Web Vitals and stops visitors from bouncing to competitors.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium pt-2 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>High Google PageSpeed mobile metrics</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>Edge caching & automatic WebP/AVIF image compression</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>Clean semantic HTML for optimal search crawler indexing</span>
              </li>
            </ul>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-emerald-500/40 dark:hover:border-emerald-500/50 hover:shadow-xl transition-all space-y-5 shadow-sm dark:shadow-none">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Smartphone className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="space-y-2">
              <div className="text-[10px] font-mono font-bold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">
                CONVERSION FUNNELS
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Conversion-First Mobile UX
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Designed for frantic homeowners on mobile screens. Sticky thumb-friendly tap-to-call buttons, instant quote triggers, and frictionless forms.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium pt-2 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Persistent bottom mobile call bar</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>1-click quote modals with instant validation</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>High-trust local licensing and review badges</span>
              </li>
            </ul>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-indigo-500/40 dark:hover:border-indigo-500/50 hover:shadow-xl transition-all space-y-5 shadow-sm dark:shadow-none">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="space-y-2">
              <div className="text-[10px] font-mono font-bold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase">
                PROACTIVE SECURITY
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                24/7 Security & High Uptime
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Zero database injection vulnerabilities. Static edge architecture prevents typical WordPress hacking, plugin breakages, and malware redirects.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium pt-2 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>Continuous health & uptime monitoring</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>Automated daily off-site cloud backups</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>Automated SSL renewal and DDOS mitigation</span>
              </li>
            </ul>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-orange-500/40 dark:hover:border-orange-500/50 hover:shadow-xl transition-all space-y-5 shadow-sm dark:shadow-none">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-100 dark:border-orange-800/40 flex items-center justify-center text-orange-600 dark:text-orange-400">
              <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="space-y-2">
              <div className="text-[10px] font-mono font-bold tracking-widest text-orange-600 dark:text-orange-400 uppercase">
                HANDS-OFF CARE
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Monthly Web Care Retainer
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Never worry about your website again. Need a new promotion banner, staff photo, or service page added? Send an email and it's handled promptly.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium pt-2 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
                <span>Included monthly technical and content updates</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
                <span>Direct developer support with 24h turnaround</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
                <span>Monthly Core Web Vitals speed audit verification</span>
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
            Websites & Care Plan FAQs
          </h2>
        </div>

        <div className="space-y-4">
          {WEBSITES_FAQ.map((faq, index) => {
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
            <Sparkles className="w-3.5 h-3.5" /> High-Performance Infrastructure
          </div>
        </div>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white tracking-tight max-w-2xl mx-auto leading-[1.15] mb-5 sm:mb-6">
          Test Your Website's Real Mobile Speed Today
        </h2>

        <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-xl mx-auto leading-relaxed font-normal mb-8 sm:mb-10">
          Request a free 5-minute video audit. We'll run full Core Web Vitals diagnostic tests and show you the exact code bottlenecks costing you customers.
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
