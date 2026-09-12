import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Search,
  MapPin,
  Globe2,
  Bot,
  Sparkles,
  ArrowRight,
  ChevronDown,
  UserCheck,
  Zap,
  Star,
} from 'lucide-react'
import { useState } from 'react'

const CONTRACTOR_SEO_FAQ = [
  {
    question: 'Why should contractors invest in SEO instead of paying for shared leads?',
    answer:
      'Shared lead platforms sell the exact same customer request to five different contractors at once. You end up in a race to the bottom on price. SEO builds a digital asset you own so homeowners call you directly and exclusively.',
  },
  {
    question: 'How long does contractor SEO take to produce qualified phone calls?',
    answer:
      'Most contractors start seeing ranking movement within 60 to 90 days, with call volume building over the following 3 to 6 months as technical fixes and new service pages take effect. Timelines vary by competition in your market and how much work your current site needs.',
  },
  {
    question: 'How is working with an independent SEO consultant different from hiring an agency?',
    answer:
      'There is no account manager relaying your requests to someone else. I personally handle your audit, your technical fixes, and your ongoing strategy, which means faster turnaround and no retainer paying for layers of staff you never talk to.',
  },
  {
    question: 'Do you require long term contracts or high upfront commitments?',
    answer:
      'No. SEO work runs month to month with no long-term lock-in required.',
  },
  {
    question: 'Do I need all three types of SEO, or just one?',
    answer:
      'Most local service businesses only need Local SEO & Google Maps. National & Regional SEO applies if you take contracts across state lines, and AEO & GEO Optimization is worth adding once your local and national rankings are solid. I help you figure out which path actually fits your business during the audit.',
  },
  {
    question: "What's included in the free audit?",
    answer:
      'A personally recorded 5-minute video reviewing your current rankings, your Google Business Profile, and your competitors, delivered within 24 hours. There is no sales call required to get it.',
  },
  {
    question: 'Do you handle my Google Business Profile too?',
    answer:
      'Yes. Google Business Profile setup and Map Pack optimization are part of Local SEO & Google Maps, covered as part of the audit and technical cleanup steps.',
  },
  {
    question: 'How much does SEO cost?',
    answer:
      'Plans start at $99 per month. The exact scope depends on which of the three SEO paths fits your business, which gets confirmed during your free audit.',
  },
]

const CONTRACTOR_SEO_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'SEO Services for Small Business',
      serviceType: 'Search Engine Optimization',
      provider: {
        '@type': 'LocalBusiness',
        name: 'built by Miguel',
        url: 'https://builtbymiguel.net',
      },
      description:
        'Direct SEO for small business owners and contractors. Local, national, and AI search optimization, handled directly by me, not an agency. Plans starting at $99/month. Free 5-minute audit.',
      areaServed: 'United States',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'SEO Service Paths',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Local SEO & Google Maps',
              url: 'https://builtbymiguel.net/seo/local',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'National & Regional SEO',
              url: 'https://builtbymiguel.net/national-seo',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'AEO & GEO Optimization',
              url: 'https://builtbymiguel.net/aeo-geo',
            },
          },
        ],
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: CONTRACTOR_SEO_FAQ.map((faq) => ({
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

export const Route = createFileRoute('/seo')({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      {
        title: 'SEO Services for Small Business | built by Miguel',
      },
      {
        name: 'description',
        content:
          'Direct SEO for small business owners and contractors. Local, national, and AI search optimization, handled directly by me, not an agency. Plans starting at $99/month. Free 5-minute audit.',
      },
      {
        name: 'keywords',
        content:
          'seo services for small business, local seo services, national seo services, aeo geo optimization, contractor seo services, small business seo',
      },
      // OpenGraph
      { property: 'og:type', content: 'website' },
      {
        property: 'og:title',
        content: 'SEO Services for Small Business | built by Miguel',
      },
      {
        property: 'og:description',
        content:
          'Direct SEO for small business owners and contractors. Local, national, and AI search optimization, handled directly by me, not an agency. Plans starting at $99/month. Free 5-minute audit.',
      },
      { property: 'og:url', content: 'https://builtbymiguel.net/seo' },
      { property: 'og:image', content: 'https://builtbymiguel.net/og-image.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
      {
        name: 'twitter:title',
        content: 'SEO Services for Small Business | built by Miguel',
      },
      {
        name: 'twitter:description',
        content:
          'Direct SEO for small business owners and contractors. Local, national, and AI search optimization, handled directly by me, not an agency. Plans starting at $99/month. Free 5-minute audit.',
      },
      { name: 'twitter:image', content: 'https://builtbymiguel.net/og-image.png' },
    ],
    links: [
      {
        rel: 'canonical',
        href: 'https://builtbymiguel.net/seo',
      },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify(CONTRACTOR_SEO_JSON_LD),
      },
    ],
  }),
  component: SeoPillarPage,
})

function SeoPillarPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  return (
    <div className="w-full bg-[#FAF8F5] dark:bg-[#080B11] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* ========================================================================= */}
      {/* HERO SECTION                                                              */}
      {/* ========================================================================= */}
      <section className="relative w-full overflow-hidden border-b border-slate-200/80 dark:border-slate-800/80 pt-12 pb-16 sm:pt-20 sm:pb-24 lg:pb-28">
        {/* Ambient background mesh glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-amber-200/30 via-orange-100/20 to-sky-200/20 dark:from-amber-500/10 dark:via-orange-500/5 dark:to-sky-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

        {/* Subtle radial dot grid overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] dark:bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:24px_24px] opacity-40 dark:opacity-30 pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 text-center space-y-6 sm:space-y-8">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2">
            <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono font-bold tracking-wider uppercase text-amber-800 dark:text-amber-300 bg-amber-100/90 dark:bg-amber-950/50 px-3.5 py-1.5 rounded-full border border-amber-300/80 dark:border-amber-700/50 shadow-2xs">
              <Search className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              Search Visibility Architecture
            </span>
          </div>

          {/* H1 */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display leading-[1.12] max-w-4xl mx-auto">
            Direct SEO Services for Small Business That Drive Real Customer Calls
          </h1>

          {/* Subhead */}
          <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            Get SEO built for small business owners and contractors who want more calls, not more reports. Work directly with the person doing the work, not an account manager.
          </p>

          {/* CTAs (Dual on Hero as permitted) */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/audit"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 dark:bg-amber-400 dark:hover:bg-amber-300 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Get Your Free 5-Minute Video Audit →</span>
            </Link>
            <Link
              to="/work"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-850 transition-all duration-200 shadow-2xs active:scale-95 cursor-pointer"
            >
              <span>View Client Case Studies</span>
              <ArrowRight className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            </Link>
          </div>

          {/* Trust strip */}
          <div className="pt-2 text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>100% Free · Custom video breakdown · No high-pressure sales calls</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* CATEGORY ARCHITECTURE (THREE CLEAR PATHS)                                 */}
      {/* ========================================================================= */}
      <section className="relative w-full py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0B0F17] transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
          <div className="mb-12 sm:mb-16 space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/40">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Category Architecture
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight leading-tight">
              Three Clear Paths From an Independent SEO Company
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Search engine optimization is not one single tactic. Here are the three distinct paths, based on how your customers actually look for help.
            </p>
          </div>

          {/* 3 Path Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Card 1: Local SEO & Google Maps */}
            <div className="group relative p-7 sm:p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:border-emerald-400/80 dark:hover:border-emerald-500/80 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-100/90 to-emerald-200/50 dark:from-emerald-950/70 dark:to-emerald-900/40 border border-emerald-300/80 dark:border-emerald-700/60 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shadow-2xs group-hover:scale-105 transition-transform">
                    <MapPin className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-200/60 dark:border-emerald-800/40">
                    Local Service Radius
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-3">
                    Local SEO & Google Maps
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Rank in the Google Map Pack and secure top local spots when nearby property owners need emergency repairs or scheduled installations.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/70 border border-slate-100 dark:border-slate-800/70 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-bold text-slate-900 dark:text-white block font-display">Who it is for:</span>
                  <p className="leading-relaxed">
                    Plumbers, HVAC contractors, electricians, and roofers serving a specific town, metro area, or twenty mile driving radius.
                  </p>
                </div>
              </div>

              <div className="pt-8 mt-6 border-t border-slate-100 dark:border-slate-800">
                <Link
                  to="/seo/local"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-900 dark:text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors group/link cursor-pointer"
                >
                  <span>Explore Local SEO & Map Pack →</span>
                </Link>
              </div>
            </div>

            {/* Card 2: National & Regional SEO */}
            <div className="group relative p-7 sm:p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:border-sky-400/80 dark:hover:border-sky-500/80 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-100/90 to-sky-200/50 dark:from-sky-950/70 dark:to-sky-900/40 border border-sky-300/80 dark:border-sky-700/60 flex items-center justify-center text-sky-700 dark:text-sky-400 shadow-2xs group-hover:scale-105 transition-transform">
                    <Globe2 className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 px-2.5 py-1 rounded-md border border-sky-200/60 dark:border-sky-800/40">
                    Broad Reach Authority
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors mb-3">
                    National & Regional SEO
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Rank across entire states or across the country for specialized commercial contracting terms and high value industrial projects.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/70 border border-slate-100 dark:border-slate-800/70 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-bold text-slate-900 dark:text-white block font-display">Who it is for:</span>
                  <p className="leading-relaxed">
                    Commercial builders, custom metal fabricators, and trade equipment installers who take contracts across multiple state lines.
                  </p>
                </div>
              </div>

              <div className="pt-8 mt-6 border-t border-slate-100 dark:border-slate-800">
                <Link
                  to="/national-seo"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-900 dark:text-sky-400 hover:text-sky-600 dark:hover:text-sky-300 transition-colors group/link cursor-pointer"
                >
                  <span>Explore National SEO →</span>
                </Link>
              </div>
            </div>

            {/* Card 3: AEO & GEO Optimization */}
            <div className="group relative p-7 sm:p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:border-purple-400/80 dark:hover:border-purple-500/80 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-100/90 to-purple-200/50 dark:from-purple-950/70 dark:to-purple-900/40 border border-purple-300/80 dark:border-purple-700/60 flex items-center justify-center text-purple-700 dark:text-purple-400 shadow-2xs group-hover:scale-105 transition-transform">
                    <Bot className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-2.5 py-1 rounded-md border border-purple-200/60 dark:border-purple-800/40">
                    AI Search Citations
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors mb-3">
                    AEO & GEO Optimization
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Structure your company entity data so artificial intelligence engines cite your business directly when homeowners ask for recommendations.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/70 border border-slate-100 dark:border-slate-800/70 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-bold text-slate-900 dark:text-white block font-display">Who it is for:</span>
                  <p className="leading-relaxed">
                    Modern trade contractors who want to lead their market as buyers use conversational tools like ChatGPT and Perplexity to hire help.
                  </p>
                </div>
              </div>

              <div className="pt-8 mt-6 border-t border-slate-100 dark:border-slate-800">
                <Link
                  to="/aeo-geo"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-900 dark:text-purple-400 hover:text-purple-600 dark:hover:text-purple-300 transition-colors group/link cursor-pointer"
                >
                  <span>Explore AI Search & GEO →</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* THE DIRECT-ACCESS ADVANTAGE (REVENUE FOCUS)                               */}
      {/* ========================================================================= */}
      <section className="relative w-full py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-[#FAF8F5]/60 dark:bg-[#080B11] transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
          <div className="mb-12 sm:mb-16 space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/40">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              The Direct-Access Advantage
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight leading-tight">
              Why My SEO Services for Contractors Focus on Revenue
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              No vanity reports, no meaningless impression spikes. Just the core technical fixes that get you off page two of Google and onto page one.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="p-7 sm:p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-100/90 to-amber-200/50 dark:from-amber-950/70 dark:to-amber-900/40 border border-amber-300/80 dark:border-amber-700/60 flex items-center justify-center text-amber-700 dark:text-amber-400 shadow-2xs">
                <UserCheck className="w-5 h-5" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                Direct Access to Me
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                When you hire a typical marketing firm, your project goes through multiple layers of account managers. I handle your search plan personally. You get fast answers, direct communication, and technical work executed without delays.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-7 sm:p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-100/90 to-sky-200/50 dark:from-sky-950/70 dark:to-sky-900/40 border border-sky-300/80 dark:border-sky-700/60 flex items-center justify-center text-sky-700 dark:text-sky-400 shadow-2xs">
                <Zap className="w-5 h-5" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                No Cookie Cutter Page Templates
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Most agency websites use bloated site builders that load slow on smartphones. Your pages get built lightweight, meeting Google's Core Web Vitals standards and loading in under a second, so visitors stay on the page and call your business.
              </p>
            </div>
          </div>

          {/* Single CTA Row */}
          <div className="mt-12 sm:mt-14 flex items-center justify-start">
            <Link
              to="/audit"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 dark:bg-amber-400 dark:hover:bg-amber-300 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Start My Free Audit →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* EXECUTION ROADMAP                                                         */}
      {/* ========================================================================= */}
      <section className="relative w-full py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0B0F17] transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
          <div className="mb-12 sm:mb-16 space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-800/40">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
              Execution Roadmap
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight leading-tight">
              How Small Business SEO Works When You Work With Me
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Here's the four-step method that turns Google searches into booked contractor appointments.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 01 */}
            <div className="p-6 sm:p-7 rounded-3xl bg-slate-50/90 dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 space-y-3">
              <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400 block uppercase tracking-wider">
                Step 01
              </span>
              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                Audit & Diagnosis
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Your current rankings, Google Business Profile, and competitors all get audited to find exactly what's blocking your calls.
              </p>
            </div>

            {/* Step 02 */}
            <div className="p-6 sm:p-7 rounded-3xl bg-slate-50/90 dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 space-y-3">
              <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400 block uppercase tracking-wider">
                Step 02
              </span>
              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                Technical Cleanup
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Business listings get fixed, broken code removed, page speed improved, and structured schema markup added (code that helps Google understand exactly what your business offers).
              </p>
            </div>

            {/* Step 03 */}
            <div className="p-6 sm:p-7 rounded-3xl bg-slate-50/90 dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 space-y-3">
              <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 block uppercase tracking-wider">
                Step 03
              </span>
              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                Service Pages
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Dedicated pages get built for each trade service and city you want jobs in, so Google knows exactly what you offer.
              </p>
            </div>

            {/* Step 04 */}
            <div className="p-6 sm:p-7 rounded-3xl bg-slate-50/90 dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 space-y-3">
              <span className="font-mono text-xs font-bold text-purple-600 dark:text-purple-400 block uppercase tracking-wider">
                Step 04
              </span>
              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                Reputation Growth
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Automated review workflows get set up to prompt your happy customers to leave 5-star ratings on Google.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* WHAT CLIENTS SAY (TESTIMONIALS)                                           */}
      {/* ========================================================================= */}
      <section className="relative w-full py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-[#FAF8F5]/60 dark:bg-[#080B11] transition-colors duration-200">
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
            {/* Testimonial 1: Sarah */}
            <div className="relative p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  "Before working with Miguel, we were on page 3 for our own city. Within a few months we were showing up in the Map Pack for the searches that actually turn into service calls."
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold font-display text-slate-900 dark:text-white text-xs sm:text-sm">
                    Sarah
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    Plumbing Company Owner
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
                  Verified
                </span>
              </div>
            </div>

            {/* Testimonial 2: Tom */}
            <div className="relative p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  "We bid on contracts across four states, and our old site never ranked outside our home market. The national SEO work got us showing up in searches we were completely invisible for before."
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold font-display text-slate-900 dark:text-white text-xs sm:text-sm">
                    Tom
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    Commercial Metal Fabricator
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
                  Verified
                </span>
              </div>
            </div>

            {/* Testimonial 3: Priya */}
            <div className="relative p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  "I didn't even know AI search was something to optimize for until Miguel brought it up. Now when people ask ChatGPT for a contractor in our area, we actually get mentioned."
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold font-display text-slate-900 dark:text-white text-xs sm:text-sm">
                    Priya
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
              <span>Claim Your Free Audit →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FREQUENTLY ASKED QUESTIONS                                                */}
      {/* ========================================================================= */}
      <section className="relative w-full py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0B0F17] transition-colors duration-200">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 space-y-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/40">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Clear Answers
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight leading-tight">
              Frequently Asked Questions About My Contractor SEO Services
            </h2>
          </div>

          <div className="space-y-4 pt-4">
            {CONTRACTOR_SEO_FAQ.map((faq, index) => {
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
      {/* CLOSING HERO CTA SECTION                                                  */}
      {/* ========================================================================= */}
      <section className="relative w-full py-20 sm:py-28 overflow-hidden bg-slate-950 dark:bg-black text-white transition-colors duration-200">
        {/* Glowing background bloom */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[750px] h-[350px] bg-gradient-to-b from-amber-500/15 via-rose-500/5 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 text-center space-y-6 relative z-10">
          <div>
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-amber-400 bg-amber-400/10 border border-amber-400/30 px-3.5 py-1.5 rounded-full inline-block">
              Ready to Rank
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-white tracking-tight leading-tight max-w-2xl mx-auto">
            Get SEO Built to Ring Your Phone, Not Impress a Report
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            Stop paying for vanity metrics and shared leads. Start with a free 5-minute audit and see exactly what's keeping your business off the first page.
          </p>

          <div className="flex items-center justify-center pt-4">
            <Link
              to="/audit"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-all duration-200 shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Get My Free SEO Audit →</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
