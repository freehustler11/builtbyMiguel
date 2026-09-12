import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowRight,
  ChevronDown,
  Check,
  Star,
  ShieldCheck,
  Zap,
} from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/seo_/local')({
  head: () => ({
    meta: [
      {
        title: 'Local SEO Services for Contractors | built by Miguel',
      },
      {
        name: 'description',
        content:
          'Rank in the Google Map Pack with GBP optimization, directory cleanup, and automated reviews. Direct service, no agency. Free 5-minute video audit.',
      },
      {
        name: 'keywords',
        content:
          'local seo services for contractors, google map pack optimization, google business profile optimization, local citation cleanup, nap cleanup services',
      },
      {
        property: 'og:title',
        content: 'Local SEO Services for Contractors | built by Miguel',
      },
      {
        property: 'og:description',
        content:
          'Rank in the Google Map Pack with GBP optimization, directory cleanup, and automated reviews. Direct service, no agency. Free 5-minute video audit.',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:url',
        content: 'https://builtbymiguel.net/seo/local',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content: 'Local SEO Services for Contractors | built by Miguel',
      },
      {
        name: 'twitter:description',
        content:
          'Rank in the Google Map Pack with GBP optimization, directory cleanup, and automated reviews. Direct service, no agency. Free 5-minute video audit.',
      },
    ],
    links: [
      {
        rel: 'canonical',
        href: 'https://builtbymiguel.net/seo/local',
      },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'Local SEO Services for Contractors',
          serviceType:
            'Local Search Engine Optimization & Google Map Pack Optimization',
          provider: {
            '@type': 'ProfessionalService',
            name: 'built by Miguel',
            url: 'https://builtbymiguel.net',
          },
          description:
            'Rank in the Google Map Pack with GBP optimization, directory cleanup, and automated reviews. Direct service, no agency. Free 5-minute video audit.',
          url: 'https://builtbymiguel.net/seo/local',
          areaServed: 'US',
          offers: {
            '@type': 'Offer',
            price: '99.00',
            priceCurrency: 'USD',
            description: 'Local SEO ongoing plans starting at $99/month.',
          },
        }),
      },
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://builtbymiguel.net',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'SEO Services for Contractors',
              item: 'https://builtbymiguel.net/seo',
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: 'Local SEO & Map Pack',
              item: 'https://builtbymiguel.net/seo/local',
            },
          ],
        }),
      },
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'How long does it take to see results from local SEO services?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Most contractors see ranking movement in the Google Map Pack within 30 to 60 days. Rankings improve as directory listings get cleaned up, profile categories get corrected, and a steady stream of customer reviews gets set up.',
              },
            },
            {
              '@type': 'Question',
              name: 'What is the difference between Google Map Pack and organic website ranking?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: "The Map Pack is the three-listing block with a map that appears at the top of local search results, pulled from your Google Business Profile. Organic website ranking is the separate list of website links below it. Local SEO focuses primarily on the Map Pack, since that's where most emergency and same-day service searches get clicked.",
              },
            },
            {
              '@type': 'Question',
              name: 'What is the difference between Month 1 and the monthly plan?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Month 1 is a one-time foundation sprint that cleans up your profile, directories, and site structure. The monthly plan is ongoing work, like new city pages, review follow-ups, and fresh content, that keeps growing your rankings after that foundation is in place.',
              },
            },
            {
              '@type': 'Question',
              name: 'Do I get access to live ranking reports?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. Ranking maps and performance reports are available inside your private client portal, updated as part of the monthly plan.',
              },
            },
            {
              '@type': 'Question',
              name: "What's included in the free audit?",
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'A personally recorded 5-minute video reviewing your current Google Business Profile, directory listings, and Map Pack position, delivered within 24 hours. There is no sales call required to get it.',
              },
            },
            {
              '@type': 'Question',
              name: 'Do you also handle national or AI search optimization?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: "Yes, as separate services. National & Regional SEO covers multi-state reach, and AEO & GEO Optimization covers AI search visibility. Most local-radius businesses only need this page's local SEO.",
              },
            },
            {
              '@type': 'Question',
              name: 'Do you require a long-term contract?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'No. The monthly retainer runs month to month with no long-term lock-in required.',
              },
            },
            {
              '@type': 'Question',
              name: 'Which directories do you clean up?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Citation cleanup covers 50+ top directories, including Apple Maps, Yelp, and Bing, matching your business name, address, and phone number everywhere your business is listed.',
              },
            },
          ],
        }),
      },
    ],
  }),
  component: LocalSeoPage,
})

const FAQS = [
  {
    q: 'How long does it take to see results from local SEO services?',
    a: 'Most contractors see ranking movement in the Google Map Pack within 30 to 60 days. Rankings improve as directory listings get cleaned up, profile categories get corrected, and a steady stream of customer reviews gets set up.',
  },
  {
    q: 'What is the difference between Google Map Pack and organic website ranking?',
    a: "The Map Pack is the three-listing block with a map that appears at the top of local search results, pulled from your Google Business Profile. Organic website ranking is the separate list of website links below it. Local SEO focuses primarily on the Map Pack, since that's where most emergency and same-day service searches get clicked.",
  },
  {
    q: 'What is the difference between Month 1 and the monthly plan?',
    a: 'Month 1 is a one-time foundation sprint that cleans up your profile, directories, and site structure. The monthly plan is ongoing work, like new city pages, review follow-ups, and fresh content, that keeps growing your rankings after that foundation is in place.',
  },
  {
    q: 'Do I get access to live ranking reports?',
    a: 'Yes. Ranking maps and performance reports are available inside your private client portal, updated as part of the monthly plan.',
  },
  {
    q: "What's included in the free audit?",
    a: 'A personally recorded 5-minute video reviewing your current Google Business Profile, directory listings, and Map Pack position, delivered within 24 hours. There is no sales call required to get it.',
  },
  {
    q: 'Do you also handle national or AI search optimization?',
    a: (
      <span>
        Yes, as separate services.{' '}
        <Link
          to="/national-seo"
          className="text-blue-600 dark:text-blue-400 underline font-semibold hover:text-blue-700 dark:hover:text-blue-300"
        >
          National & Regional SEO
        </Link>{' '}
        covers multi-state reach, and{' '}
        <Link
          to="/seo/ai-search"
          className="text-blue-600 dark:text-blue-400 underline font-semibold hover:text-blue-700 dark:hover:text-blue-300"
        >
          AEO & GEO Optimization
        </Link>{' '}
        covers AI search visibility. Most local-radius businesses only need this page's local SEO.
      </span>
    ),
  },
  {
    q: 'Do you require a long-term contract?',
    a: 'No. The monthly retainer runs month to month with no long-term lock-in required.',
  },
  {
    q: 'Which directories do you clean up?',
    a: 'Citation cleanup covers 50+ top directories, including Apple Maps, Yelp, and Bing, matching your business name, address, and phone number everywhere your business is listed.',
  },
]

function LocalSeoPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="w-full min-h-screen bg-[#fafafc] dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 selection:bg-slate-900 selection:text-white dark:selection:bg-rose-500 font-sans pb-24 sm:pb-32">
      {/* SECTION 0: Breadcrumb & SECTION 1: Hero */}
      <section className="relative overflow-hidden pt-8 sm:pt-12 pb-16 sm:pb-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-white via-slate-50/50 to-[#fafafc] dark:from-[#0f172a] dark:via-[#0B0F17] dark:to-[#0B0F17]">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 relative z-10">
          {/* SECTION 0: Breadcrumb (not a heading) */}
          <div className="mb-6">
            <Link
              to="/seo"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer group"
            >
              <span>← Part of SEO Services for Contractors</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Copy & Actions */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">
              {/* Eyebrow (not a heading) */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-800/60 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
                <span className="text-xs sm:text-sm font-semibold tracking-wide uppercase font-mono text-blue-700 dark:text-blue-300">
                  High-Intent Search Acquisition
                </span>
              </div>

              {/* H1 */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl/tight font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
                Direct Local SEO Services to Win Google Map Pack Rankings
              </h1>

              {/* Subhead */}
              <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                If you serve a specific city or regional territory, ranking in the Google Map Pack is your most profitable source of new work. Your Google Business Profile and local citation network get optimized so nearby homeowners call you first, not a traditional agency's cookie-cutter template and vanity report.
              </p>

              {/* CTAs */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                  <Link
                    to="/audit"
                    className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.99] transition-all duration-200 group"
                  >
                    <span>Get Your Free 5-Minute Video Audit</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    to="/work"
                    className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 text-slate-700 dark:text-slate-200 font-bold text-sm sm:text-base hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.99] transition-all duration-200"
                  >
                    <span>View Client Case Studies</span>
                  </Link>
                </div>

                {/* Trust Line */}
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 pt-1 flex items-center gap-2">
                  <span>100% Free · Custom video breakdown · No high-pressure sales calls</span>
                </p>
              </div>
            </div>

            {/* Right Column: Hero Graphic */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md lg:max-w-none p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 shadow-xl relative overflow-hidden">
                {/* Flat vector illustration: map pin surrounded by three ranked business listings and a phone receiving a call */}
                <svg
                  viewBox="0 0 460 380"
                  className="w-full h-auto drop-shadow-sm"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  aria-label="Illustration of a map pin surrounded by three ranked business listings and a phone receiving a call"
                >
                  {/* Map grid background */}
                  <rect width="460" height="380" rx="20" className="fill-slate-50 dark:fill-slate-900/60" />
                  <path d="M 0 95 L 460 95 M 0 190 L 460 190 M 0 285 L 460 285" className="stroke-slate-200/60 dark:stroke-slate-800/60" strokeWidth="2" strokeDasharray="6 6" />
                  <path d="M 115 0 L 115 380 M 230 0 L 230 380 M 345 0 L 345 380" className="stroke-slate-200/60 dark:stroke-slate-800/60" strokeWidth="2" strokeDasharray="6 6" />
                  
                  {/* Service Radius Waves */}
                  <circle cx="230" cy="110" r="85" className="stroke-blue-200/70 dark:stroke-blue-800/40" strokeWidth="2" strokeDasharray="4 4" fill="none" />
                  <circle cx="230" cy="110" r="55" className="fill-blue-50/50 dark:fill-blue-950/30 stroke-blue-300/80 dark:stroke-blue-700/50" strokeWidth="2" />

                  {/* Central Map Pin */}
                  <g transform="translate(230, 110)">
                    <ellipse cx="0" cy="36" rx="14" ry="5" className="fill-blue-900/20 dark:fill-blue-900/50" />
                    <path
                      d="M 0 32 C -18 6 -22 -4 -22 -18 C -22 -30 -12 -40 0 -40 C 12 -40 22 -30 22 -18 C 22 -4 18 6 0 32 Z"
                      className="fill-blue-600 dark:fill-blue-500"
                    />
                    <circle cx="0" cy="-18" r="9" className="fill-white" />
                    <circle cx="0" cy="-18" r="5" className="fill-blue-600 dark:fill-blue-500" />
                  </g>

                  {/* 3 Ranked Listings (Map Pack) */}
                  {/* Rank 1: Active Leader */}
                  <g transform="translate(30, 215)">
                    <rect width="250" height="42" rx="10" className="fill-white dark:fill-slate-800 stroke-blue-500 dark:stroke-blue-400" strokeWidth="2" />
                    <circle cx="22" cy="21" r="12" className="fill-blue-600 dark:fill-blue-500" />
                    <path d="M 19 25 L 22 16 L 25 25" className="stroke-white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <rect x="44" y="12" width="110" height="7" rx="3.5" className="fill-slate-800 dark:fill-slate-200" />
                    <rect x="44" y="24" width="75" height="5" rx="2.5" className="fill-amber-400" />
                    <circle cx="228" cy="21" r="10" className="fill-emerald-100 dark:fill-emerald-950/60 stroke-emerald-500" strokeWidth="1.5" />
                    <path d="M 224 21 L 227 24 L 232 18" className="stroke-emerald-600 dark:stroke-emerald-400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </g>

                  {/* Rank 2 */}
                  <g transform="translate(30, 267)">
                    <rect width="250" height="40" rx="10" className="fill-white/80 dark:fill-slate-800/80 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1.5" />
                    <circle cx="22" cy="20" r="11" className="fill-slate-200 dark:fill-slate-700" />
                    <path d="M 19 18 C 19 16 25 16 25 19 C 25 22 19 23 19 25 L 25 25" className="stroke-slate-600 dark:stroke-slate-300" strokeWidth="1.5" strokeLinecap="round" />
                    <rect x="44" y="13" width="95" height="6" rx="3" className="fill-slate-400 dark:fill-slate-500" />
                    <rect x="44" y="23" width="60" height="5" rx="2.5" className="fill-slate-300 dark:fill-slate-600" />
                  </g>

                  {/* Rank 3 */}
                  <g transform="translate(30, 317)">
                    <rect width="250" height="40" rx="10" className="fill-white/80 dark:fill-slate-800/80 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1.5" />
                    <circle cx="22" cy="20" r="11" className="fill-slate-200 dark:fill-slate-700" />
                    <path d="M 19 17 C 21 15 24 16 24 18 C 24 20 21 20 21 20 C 24 20 24 23 21 24" className="stroke-slate-600 dark:stroke-slate-300" strokeWidth="1.5" strokeLinecap="round" />
                    <rect x="44" y="13" width="80" height="6" rx="3" className="fill-slate-400 dark:fill-slate-500" />
                    <rect x="44" y="23" width="50" height="5" rx="2.5" className="fill-slate-300 dark:fill-slate-600" />
                  </g>

                  {/* Phone Receiving a Call */}
                  <g transform="translate(305, 195)">
                    {/* Pulsing ring for incoming call */}
                    <circle cx="65" cy="80" r="60" className="stroke-emerald-400/50 dark:stroke-emerald-500/30" strokeWidth="2" strokeDasharray="4 4" />
                    {/* Phone handset body */}
                    <rect x="25" y="15" width="80" height="145" rx="16" className="fill-slate-900 dark:fill-slate-950 stroke-slate-700 dark:stroke-slate-600" strokeWidth="2.5" />
                    {/* Screen */}
                    <rect x="31" y="27" width="68" height="115" rx="10" className="fill-slate-100 dark:fill-slate-900" />
                    {/* Notch & speaker */}
                    <rect x="53" y="20" width="24" height="3" rx="1.5" className="fill-slate-600" />
                    {/* Incoming call screen graphic */}
                    <circle cx="65" cy="56" r="16" className="fill-emerald-100 dark:fill-emerald-950 stroke-emerald-500" strokeWidth="1.5" />
                    <path d="M 58 53 C 58 61 69 72 77 72 L 74 67 C 73 66 70 66 69 67 C 67 65 65 63 63 61 C 64 60 64 57 63 56 Z" className="fill-emerald-600 dark:fill-emerald-400" />
                    <rect x="43" y="80" width="44" height="6" rx="3" className="fill-slate-700 dark:fill-slate-300" />
                    <rect x="50" y="90" width="30" height="4" rx="2" className="fill-slate-400 dark:fill-slate-500" />
                    {/* Accept button */}
                    <circle cx="52" cy="116" r="11" className="fill-rose-500" />
                    <circle cx="78" cy="116" r="11" className="fill-emerald-500" />
                    <path d="M 74 116 L 77 119 L 83 113" className="stroke-white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M 49 113 L 55 119 M 55 113 L 49 119" className="stroke-white" strokeWidth="2" strokeLinecap="round" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: How This Differs (Sibling Comparison) */}
      <section className="py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0B0F17]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
          <div className="max-w-3xl mb-12 sm:mb-16">
            {/* Eyebrow (not a heading) */}
            <p className="text-xs sm:text-sm font-semibold tracking-wide uppercase font-mono text-blue-600 dark:text-blue-400 mb-3">
              Search Strategy Differences
            </p>
            {/* H2 */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display mb-4">
              How This Differs From National SEO and AI Search
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Different search campaigns solve different business needs. Here's how local search marketing compares to the other two search paths.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Card 1: Local SEO & Map Pack (Highlighted/Active) */}
            <div className="p-7 sm:p-8 rounded-3xl bg-blue-50/70 dark:bg-blue-950/25 border-2 border-blue-600 dark:border-blue-500 shadow-md flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-4">
                <span className="inline-block text-[11px] font-mono font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/60 px-2.5 py-1 rounded-md border border-blue-200 dark:border-blue-700">
                  This Page
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                  Local SEO & Map Pack
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  Local SEO targets Google Maps and Map Pack results for one city or one service area. It is built for contractors who drive out to homes and job sites.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-blue-200/80 dark:border-blue-900/60 flex items-center text-xs sm:text-sm font-bold text-blue-700 dark:text-blue-300">
                <span>Active Service Path</span>
              </div>
            </div>

            {/* Card 2: National & Regional SEO */}
            <div className="p-7 sm:p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <span className="inline-block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                  Broad Reach
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                  National & Regional SEO
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  National SEO targets many markets with no single location. It focuses on broad organic rankings across entire states or the whole country.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                <Link
                  to="/national-seo"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer group"
                >
                  <span>View National SEO →</span>
                </Link>
              </div>
            </div>

            {/* Card 3: AEO & GEO (AI Search) */}
            <div className="p-7 sm:p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <span className="inline-block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                  Next-Gen Search
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                  AEO & GEO (AI Search)
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  AEO and GEO target AI answer engines like ChatGPT and Perplexity rather than traditional search result lists.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                <Link
                  to="/seo/ai-search"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer group"
                >
                  <span>View AI Search Optimization →</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Why Local SEO Beats Paid Ads (Differentiators) */}
      <section className="py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-[#fafafc] dark:bg-[#0B0F17]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
          <div className="max-w-3xl mb-12 sm:mb-16">
            {/* Eyebrow (not a heading) */}
            <p className="text-xs sm:text-sm font-semibold tracking-wide uppercase font-mono text-blue-600 dark:text-blue-400 mb-3">
              High Intent Traffic
            </p>
            {/* H2 */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display mb-4">
              Why Local SEO Services Deliver Better Leads Than Paid Ads
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              When a homeowner needs a plumber or electrician right away, they skip the sponsored ads and look at the top three map listings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Card 1 */}
            <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/60 flex items-center justify-center text-rose-600 dark:text-rose-400">
                {/* Flat vector icon: phone with a crossed-out dollar sign */}
                <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" />
                  <path d="M14 6h4m-2-2v4" className="stroke-slate-400" />
                  <line x1="2" y1="2" x2="22" y2="22" className="stroke-rose-600 dark:stroke-rose-400" strokeWidth="2.5" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display">
                No Per-Click Fees on Inbound Calls
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Paid ads stop delivering the moment you pause your ad budget. Local map positions generate consistent calls without costing you fifty dollars every time someone taps your phone number.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center text-amber-500">
                {/* Flat vector icon: star rating badge */}
                <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" className="fill-amber-400/30" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display">
                Instant Local Trust and Social Proof
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Homeowners trust businesses with high star ratings and recent reviews. Technical profile setup gets combined with review tools so your business stands out as the most reputable choice in town.
              </p>
            </div>
          </div>

          <div className="flex justify-start">
            <Link
              to="/audit"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.99] transition-all duration-200 group"
            >
              <span>Start My Free Audit</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 4: What You Get (Feature Grid) */}
      <section className="py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0B0F17]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
          <div className="max-w-3xl mb-12 sm:mb-16">
            {/* Eyebrow (not a heading) */}
            <p className="text-xs sm:text-sm font-semibold tracking-wide uppercase font-mono text-blue-600 dark:text-blue-400 mb-3">
              What You Get
            </p>
            {/* H2 */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display mb-4">
              Complete Google Business Profile Optimization Included
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              No vague retainer hours or vanity numbers. Every deliverable helps you rank higher and get more phone calls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12">
            {/* Card 1 */}
            <div className="p-8 sm:p-10 rounded-3xl bg-slate-50/70 dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-md border border-blue-200/80 dark:border-blue-800/60">
                  Google Maps Rankings
                </span>
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  {/* Map pin with a checkmark */}
                  <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <path d="m9 10 2 2 4-4" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display">
                GBP Optimization & Categories
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Primary and secondary categories, service areas, and geo-tagged photos get updated to help your business rank at the top of local searches.
              </p>
              <ul className="space-y-3 pt-3 border-t border-slate-200/80 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                  <span>Primary and secondary category configuration</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                  <span>Dedicated city and service landing pages for your market</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                  <span>Visual rank maps across your service radius</span>
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="p-8 sm:p-10 rounded-3xl bg-slate-50/70 dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-1 rounded-md border border-purple-200/80 dark:border-purple-800/60">
                  AI Search Readiness
                </span>
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  {/* Chat bubble with AI spark */}
                  <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                    <path d="M12 8v4m-2-2h4" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display">
                AI Search Citations
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Make sure AI tools recommend your company when local property owners ask for recommendations.
              </p>
              <ul className="space-y-3 pt-3 border-t border-slate-200/80 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                  <span>Structured local business schema for Google and AI engines</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                  <span>Verified company data across major directories</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                  <span>Direct inclusion in AI search answers</span>
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="p-8 sm:p-10 rounded-3xl bg-slate-50/70 dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-md border border-amber-200/80 dark:border-amber-800/60">
                  Directory Cleanup
                </span>
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  {/* Directory list with cleanup checkmark */}
                  <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <path d="m3 6 1 1 2-2" />
                    <path d="m3 12 1 1 2-2" />
                    <path d="m3 18 1 1 2-2" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display">
                Directory Citation Cleanup
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Old phone numbers and wrong addresses hurt your rank. Listings get cleaned up across 50 top directories.
              </p>
              <ul className="space-y-3 pt-3 border-t border-slate-200/80 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                  <span>Matching name, address, and phone number across the web</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                  <span>Removal of duplicate and outdated business listings</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                  <span>Top listings on Apple Maps, Yelp, and Bing</span>
                </li>
              </ul>
            </div>

            {/* Card 4 */}
            <div className="p-8 sm:p-10 rounded-3xl bg-slate-50/70 dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-200/80 dark:border-emerald-800/60">
                  5-Star Reviews
                </span>
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  {/* Star with refresh arrow */}
                  <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4-3.9-3.8 5.4-.8z" />
                    <path d="M21 12a9 9 0 0 0-9-9" strokeDasharray="3 3" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display">
                Automated Review Funnel
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Collect 5-star Google reviews on autopilot right after you finish a job.
              </p>
              <ul className="space-y-3 pt-3 border-t border-slate-200/80 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                  <span>Direct one-click review links sent by text message</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                  <span>Helpful review response templates that boost search rankings</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                  <span>Simple routing to resolve private customer feedback</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex justify-start">
            <Link
              to="/audit"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.99] transition-all duration-200 group"
            >
              <span>Claim Your Free Local SEO Audit</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 5: How Local SEO Drives Jobs (Growth Mechanics) */}
      <section className="py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-[#fafafc] dark:bg-[#0B0F17]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
          <div className="max-w-3xl mb-12 sm:mb-16">
            {/* Eyebrow (not a heading) */}
            <p className="text-xs sm:text-sm font-semibold tracking-wide uppercase font-mono text-blue-600 dark:text-blue-400 mb-3">
              Local Growth Mechanics
            </p>
            {/* H2 */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display mb-4">
              How Local SEO for Small Business Drives Consistent Jobs
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Local search presence connects directly to phone calls and estimate requests.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-mono font-bold flex items-center justify-center text-base">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                City Coverage
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Dedicated pages get built for each town and neighborhood you work in, so you rank outside your home office location.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-mono font-bold flex items-center justify-center text-base">
                2
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                Trade Keywords
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Your services get optimized for high-intent emergency keywords that property owners search when they need work done today.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-mono font-bold flex items-center justify-center text-base">
                3
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                Review Velocity
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Steady monthly reviews signal to Google that your business is active, reliable, and worthy of top placement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: Month 1 vs. Monthly Retainer (Pricing Phases) */}
      <section className="py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0B0F17]">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
          <div className="max-w-3xl mb-12 sm:mb-16">
            {/* Eyebrow (not a heading) */}
            <p className="text-xs sm:text-sm font-semibold tracking-wide uppercase font-mono text-blue-600 dark:text-blue-400 mb-3">
              Clear Transparency
            </p>
            {/* H2 */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display mb-4">
              Month 1 Setup vs. Monthly Retainer
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Everything is clearly documented. No guesswork, no hidden fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-5xl">
            {/* Phase 1 */}
            <div className="p-8 sm:p-10 rounded-3xl bg-slate-50/70 dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="inline-block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 bg-slate-200/70 dark:bg-slate-800 px-3 py-1 rounded-md">
                  Phase 1
                </span>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-display">
                  Month 1: Foundation Sprint
                </h3>
                <p className="text-sm sm:text-base font-semibold text-blue-600 dark:text-blue-400">
                  Total cleanup and setup.
                </p>
                <ul className="space-y-3.5 pt-4 border-t border-slate-200/80 dark:border-slate-800 text-sm sm:text-base text-slate-700 dark:text-slate-300">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>Complete Google profile audit and category update</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>Directory cleanup and duplicate removal across 50 sites</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>Structured local business code installed on your site</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>Automated review request system set up</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>Initial ranking maps across your service area</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Phase 2 & Beyond (Most Popular) */}
            <div className="p-8 sm:p-10 rounded-3xl bg-blue-50/50 dark:bg-blue-950/20 border-2 border-blue-600 dark:border-blue-500 shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="inline-block text-[11px] font-mono font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/60 px-3 py-1 rounded-md border border-blue-200 dark:border-blue-800">
                    Phase 2 & Beyond
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold uppercase tracking-wider text-white bg-blue-600 dark:bg-blue-500 px-3 py-1 rounded-full shadow-xs">
                    <Zap className="w-3 h-3 fill-current" />
                    Most Popular
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-display">
                  Monthly Growth Retainer
                </h3>
                <p className="text-sm sm:text-base font-semibold text-blue-600 dark:text-blue-400">
                  Ongoing rank growth and defense.
                </p>
                <ul className="space-y-3.5 pt-4 border-t border-blue-200/80 dark:border-blue-900/60 text-sm sm:text-base text-slate-700 dark:text-slate-300">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>Weekly photo updates and local signal posts</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>Automated review follow-ups and keyword replies</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>New city and service pages added each month</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>Live ranking maps inside your private client portal</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>Monthly performance report with clear results</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: What Clients Say (Testimonials) */}
      <section className="py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-[#fafafc] dark:bg-[#0B0F17]">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
          <div className="max-w-3xl mb-12 sm:mb-16">
            {/* H2 */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display mb-4">
              What Clients Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
            {/* Testimonial 1 */}
            <div className="p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  "We were buried past the map pack for our own city. After the directory cleanup and profile work, we started showing up in the top three for the searches that actually turn into service calls."
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="font-bold text-slate-900 dark:text-white text-sm font-display">Kevin</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Plumbing Company Owner</p>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  "I didn't realize how many old listings had our wrong phone number until this got cleaned up. Calls picked up within the first couple months."
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="font-bold text-slate-900 dark:text-white text-sm font-display">Lisa</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Electrical Contractor</p>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  "The review system alone was worth it. We went from maybe one review a month to a steady stream, and it shows in our ranking."
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="font-bold text-slate-900 dark:text-white text-sm font-display">Tony</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">HVAC Business Owner</p>
              </div>
            </div>
          </div>

          <div className="flex justify-start">
            <Link
              to="/audit"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.99] transition-all duration-200 group"
            >
              <span>Get My Free Map Pack Audit</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 8: FAQ */}
      <section className="py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0B0F17]">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
          <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
            {/* Eyebrow (not a heading) */}
            <p className="text-xs sm:text-sm font-semibold tracking-wide uppercase font-mono text-blue-600 dark:text-blue-400 mb-3">
              Common Inquiries
            </p>
            {/* H2 */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display mb-4">
              Frequently Asked Questions About Local Search Marketing
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-[#fafafc] dark:bg-[#111827] overflow-hidden transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-display">
                      {faq.q}
                    </h3>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-500 transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/60 dark:border-slate-800/60">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* SECTION 9: Closing CTA */}
      <section className="relative overflow-hidden py-16 sm:py-24 bg-slate-900 dark:bg-[#080C14] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 relative z-10 text-center space-y-6">
          {/* Eyebrow (not a heading) */}
          <p className="text-xs sm:text-sm font-semibold tracking-wide uppercase font-mono text-blue-400">
            Own Your Map Pack
          </p>
          {/* H2 */}
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight font-display">
            Rank Where Homeowners Are Actually Looking
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Stop losing local jobs to competitors with a cleaner Google profile. Start with a free 5-minute audit and see exactly where your Map Pack ranking is slipping.
          </p>
          <div className="pt-4 flex justify-center">
            <Link
              to="/audit"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-blue-600/30 hover:shadow-2xl hover:shadow-blue-600/40 active:scale-[0.99] transition-all duration-200 group"
            >
              <span>See What's Blocking Your Map Pack Ranking</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
