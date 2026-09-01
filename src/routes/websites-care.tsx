import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Globe,
  Zap,
  Sparkles,
  ArrowRight,
  ChevronDown,
  Check,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  Server,
  RefreshCw,
} from 'lucide-react'
import { useState } from 'react'

const WEBSITES_FAQ = [
  {
    question: 'Why build with custom React/TypeScript instead of WordPress?',
    answer:
      'WordPress sites frequently suffer from bloated plugins, slow server response times, and security vulnerabilities that damage mobile conversions. Our custom React and TanStack architecture loads in under 800ms, achieves 95+ Google PageSpeed scores, and converts mobile searchers at a drastically higher rate.',
  },
  {
    question: 'What is included in the Monthly Care Plan?',
    answer:
      'The Care Plan provides 24/7 uptime monitoring, enterprise edge hosting, automated hourly backups, ongoing security patches, technical Core Web Vitals optimization, and unlimited monthly content/copy adjustments.',
  },
  {
    question: 'Do I own the website after it is built?',
    answer:
      'Yes, 100%. Once project milestones are fulfilled, you own all design files, source code, and assets. We do not lock you into hostage contracts.',
  },
  {
    question: 'How fast will my new website load?',
    answer:
      'Every site is engineered to achieve a First Contentful Paint (FCP) of under 800ms on 4G mobile connections, ensuring instant interactivity and zero bounce due to lag.',
  },
]

const WEBSITES_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'High-Speed Custom Websites & Monthly Care Plans',
      provider: {
        '@type': 'LocalBusiness',
        name: 'Built by Miguel',
        url: 'https://builtbymiguel.com',
      },
      description:
        'Sub-second load times (<800ms), conversion-optimized mobile UI, edge hosting, and proactive 24/7 care for growing businesses.',
      areaServed: 'United States',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Web Engineering & Maintenance',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Sub-Second React & Edge Architecture',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'High-Converting Mobile UX & Tap-to-Call',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Monthly 24/7 Care & Hosting Retainer',
            },
          },
        ],
      },
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
          'High-Speed Websites & 24/7 Care Plans | Built by Miguel',
      },
      {
        name: 'description',
        content:
          'Sub-second websites built for conversions. React & TypeScript edge architecture, thumb-friendly tap-to-call mobile design, and 24/7 maintenance.',
      },
      {
        name: 'keywords',
        content:
          'fast local business website, website maintenance plans, custom web design, sub-second web performance, core web vitals optimization',
      },
      // OpenGraph
      { property: 'og:type', content: 'website' },
      {
        property: 'og:title',
        content: 'High-Speed Websites & 24/7 Care Plans | Built by Miguel',
      },
      {
        property: 'og:description',
        content:
          'Websites built strictly to convert visitors into booked jobs with sub-second speeds.',
      },
      { property: 'og:url', content: 'https://builtbymiguel.com/websites-care' },
      { property: 'og:image', content: 'https://builtbymiguel.com/og-image.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: 'https://builtbymiguel.com/og-image.png' },
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
    <div className="space-y-24 sm:space-y-32 py-6 sm:py-10">
      {/* HERO SECTION */}
      <section className="relative text-center max-w-4xl mx-auto space-y-8">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
          <Zap className="w-3.5 h-3.5" /> Sub-Second Conversion Engines
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
          Websites Built Strictly to{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
            Convert Visitors into Booked Jobs.
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
          If your website takes longer than 2 seconds to load, over half your mobile traffic leaves for a competitor. We build clean, hyper-fast web applications with 24/7 care and zero WordPress bloat.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            to="/audit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-base text-slate-950 bg-cyan-400 hover:bg-cyan-300 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-200 active:scale-95"
          >
            <Sparkles className="w-5 h-5 fill-slate-950" />
            <span>Test Your Website Speed for Free</span>
          </Link>

          <Link
            to="/work"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-base text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-800 transition-all duration-200"
          >
            <span>Explore Live Builds</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 3 CORE SPEED PILLARS */}
      <section className="space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
            The Speed Advantage
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineered for Milliseconds
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Every layer of our stack is optimized for instantaneous rendering and frictionless client booking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Sub-Second Load Times</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              No bloated plugins or heavy database queries. Every page is compiled ahead of time and served from 300+ global edge locations in under 800ms.
            </p>
          </div>

          <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Thumb-Friendly Mobile UX</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Designed specifically for customers holding a phone with one hand. Prominent sticky tap-to-call bars and instant booking forms that maximize lead capture.
            </p>
          </div>

          <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Zero Maintenance Stress</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Never worry about your website breaking or getting hacked. We monitor uptime 24/7, perform continuous security checks, and execute unlimited copy updates.
            </p>
          </div>
        </div>
      </section>

      {/* MONTHLY CARE PLAN BREAKDOWN */}
      <section className="space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
            Ongoing Peace of Mind
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            What's Inside the Care Plan
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Your website handled like an enterprise software product with continuous attention.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-3">
            <div className="text-cyan-400">
              <Server className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base">Global Edge Hosting</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ultra-reliable serverless edge network with 99.99% uptime and automatic SSL certificates.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-3">
            <div className="text-emerald-400">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base">Automated Daily Backups</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Immutable snapshot backups saved redundantly across multiple secure cloud regions.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-3">
            <div className="text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base">Security & Firewall</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enterprise DDoS protection, Web Application Firewall (WAF), and automated vulnerability blocking.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-3">
            <div className="text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base">Content & Design Edits</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Need to add a new team member, update seasonal pricing, or post a project? Just send a quick message.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Websites & Care Plan FAQs
          </h2>
        </div>

        <div className="space-y-4">
          {WEBSITES_FAQ.map((faq, index) => {
            const isOpen = openFaqIndex === index
            return (
              <div
                key={faq.question}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left text-base font-semibold text-white hover:text-cyan-300 transition-colors focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-cyan-400' : ''
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
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
          <Sparkles className="w-3.5 h-3.5" /> High-Performance Guarantee
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight max-w-2xl mx-auto">
          Ready to turn your website into a reliable revenue engine?
        </h2>

        <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Request a free speed and UX audit today. See exactly how much faster and cleaner your website could perform.
        </p>

        <div className="pt-2">
          <Link
            to="/audit"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base text-slate-950 bg-cyan-400 hover:bg-cyan-300 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all active:scale-95"
          >
            <Sparkles className="w-5 h-5 fill-slate-950" />
            <span>Get Free Speed Audit</span>
          </Link>
        </div>
      </section>
    </div>
  )
}
