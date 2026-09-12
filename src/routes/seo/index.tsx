import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowRight,
  ChevronDown,
  Check,
  Star,
} from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/seo/')({
  head: () => ({
    meta: [
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
      {
        property: 'og:title',
        content: 'SEO Services for Small Business | built by Miguel',
      },
      {
        property: 'og:description',
        content:
          'Direct SEO for small business owners and contractors. Local, national, and AI search optimization, handled directly by me, not an agency. Plans starting at $99/month. Free 5-minute audit.',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:url',
        content: 'https://builtbymiguel.net/seo',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content: 'SEO Services for Small Business | built by Miguel',
      },
      {
        name: 'twitter:description',
        content:
          'Direct SEO for small business owners and contractors. Local, national, and AI search optimization, handled directly by me, not an agency. Plans starting at $99/month. Free 5-minute audit.',
      },
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
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'SEO Services for Small Business',
          serviceType: 'Search Engine Optimization',
          provider: {
            '@type': 'ProfessionalService',
            name: 'built by Miguel',
            url: 'https://builtbymiguel.net',
          },
          description:
            'Direct SEO for small business owners and contractors. Local, national, and AI search optimization, handled directly by me, not an agency. Plans starting at $99/month. Free 5-minute audit.',
          url: 'https://builtbymiguel.net/seo',
          areaServed: 'US',
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
              name: 'Why should contractors invest in SEO instead of paying for shared leads?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Shared lead platforms sell the exact same customer request to five different contractors at once. You end up in a race to the bottom on price. SEO builds a digital asset you own so homeowners call you directly and exclusively.',
              },
            },
            {
              '@type': 'Question',
              name: 'How long does contractor SEO take to produce qualified phone calls?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Most contractors start seeing ranking movement within 60 to 90 days, with call volume building over the following 3 to 6 months as technical fixes and new service pages take effect. Timelines vary by competition in your market and how much work your current site needs.',
              },
            },
            {
              '@type': 'Question',
              name: 'How is working with an independent SEO consultant different from hiring an agency?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'There is no account manager relaying your requests to someone else. I personally handle your audit, your technical fixes, and your ongoing strategy, which means faster turnaround and no retainer paying for layers of staff you never talk to.',
              },
            },
            {
              '@type': 'Question',
              name: 'Do you require long term contracts or high upfront commitments?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'No. SEO work runs month to month with no long-term lock-in required.',
              },
            },
            {
              '@type': 'Question',
              name: 'Do I need all three types of SEO, or just one?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Most local service businesses only need Local SEO & Google Maps. National & Regional SEO applies if you take contracts across state lines, and AEO & GEO Optimization is worth adding once your local and national rankings are solid. I help you figure out which path actually fits your business during the audit.',
              },
            },
            {
              '@type': 'Question',
              name: "What's included in the free audit?",
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'A personally recorded 5-minute video reviewing your current rankings, your Google Business Profile, and your competitors, delivered within 24 hours. There is no sales call required to get it.',
              },
            },
            {
              '@type': 'Question',
              name: 'Do you handle my Google Business Profile too?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. Google Business Profile setup and Map Pack optimization are part of Local SEO & Google Maps, covered as part of the audit and technical cleanup steps.',
              },
            },
            {
              '@type': 'Question',
              name: 'How much does SEO cost?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Plans start at $99 per month. The exact scope depends on which of the three SEO paths fits your business, which gets confirmed during your free audit.',
              },
            },
          ],
        }),
      },
    ],
  }),
  component: SeoPage,
})

const FAQS = [
  {
    q: 'Why should contractors invest in SEO instead of paying for shared leads?',
    a: 'Shared lead platforms sell the exact same customer request to five different contractors at once. You end up in a race to the bottom on price. SEO builds a digital asset you own so homeowners call you directly and exclusively.',
  },
  {
    q: 'How long does contractor SEO take to produce qualified phone calls?',
    a: 'Most contractors start seeing ranking movement within 60 to 90 days, with call volume building over the following 3 to 6 months as technical fixes and new service pages take effect. Timelines vary by competition in your market and how much work your current site needs.',
  },
  {
    q: 'How is working with an independent SEO consultant different from hiring an agency?',
    a: 'There is no account manager relaying your requests to someone else. I personally handle your audit, your technical fixes, and your ongoing strategy, which means faster turnaround and no retainer paying for layers of staff you never talk to.',
  },
  {
    q: 'Do you require long term contracts or high upfront commitments?',
    a: 'No. SEO work runs month to month with no long-term lock-in required.',
  },
  {
    q: 'Do I need all three types of SEO, or just one?',
    a: 'Most local service businesses only need Local SEO & Google Maps. National & Regional SEO applies if you take contracts across state lines, and AEO & GEO Optimization is worth adding once your local and national rankings are solid. I help you figure out which path actually fits your business during the audit.',
  },
  {
    q: "What's included in the free audit?",
    a: 'A personally recorded 5-minute video reviewing your current rankings, your Google Business Profile, and your competitors, delivered within 24 hours. There is no sales call required to get it.',
  },
  {
    q: 'Do you handle my Google Business Profile too?',
    a: 'Yes. Google Business Profile setup and Map Pack optimization are part of Local SEO & Google Maps, covered as part of the audit and technical cleanup steps.',
  },
  {
    q: 'How much does SEO cost?',
    a: 'Plans start at $99 per month. The exact scope depends on which of the three SEO paths fits your business, which gets confirmed during your free audit.',
  },
]

function SeoPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="space-y-16 sm:space-y-24 py-6 sm:py-8">
      {/* SECTION 1: Hero */}
      <section className="relative">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Copy */}
            <div className="lg:col-span-7 space-y-6">
              <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                Search Visibility Architecture
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                Direct SEO Services for Small Business That Drive Real Customer Calls
              </h1>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                Get SEO built for small business owners and contractors who want more calls, not more reports. Work directly with the person doing the work, not an account manager.
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Link
                  to="/audit"
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-base shadow-lg shadow-amber-500/25 hover:shadow-amber-500/35 transition-all transform active:scale-98 text-center"
                >
                  Get Your Free 5-Minute Video Audit
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <Link
                  to="/work"
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-base hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-center"
                >
                  View Client Case Studies
                </Link>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                100% Free · Custom video breakdown · No high-pressure sales calls
              </p>
            </div>

            {/* Right Column: Flat Vector Illustration */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md p-6 rounded-3xl bg-slate-100/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 shadow-xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

                <svg
                  viewBox="0 0 400 320"
                  className="w-full h-auto drop-shadow-sm select-none"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  aria-label="Illustration of a search results page with a map pin, a graph trending upward, and a phone receiving a call, connected together"
                >
                  {/* Search Results Window */}
                  <rect
                    x="40"
                    y="30"
                    width="320"
                    height="250"
                    rx="12"
                    className="fill-white dark:fill-[#111827] stroke-slate-200 dark:stroke-slate-700"
                    strokeWidth="2"
                  />
                  {/* Browser Header Bar */}
                  <rect
                    x="40"
                    y="30"
                    width="320"
                    height="32"
                    rx="12"
                    className="fill-slate-100 dark:fill-[#1a2333]"
                  />
                  <line
                    x1="40"
                    y1="62"
                    x2="360"
                    y2="62"
                    className="stroke-slate-200 dark:stroke-slate-700"
                    strokeWidth="1"
                  />
                  <circle cx="56" cy="46" r="4" className="fill-slate-300 dark:fill-slate-600" />
                  <circle cx="68" cy="46" r="4" className="fill-slate-300 dark:fill-slate-600" />
                  <circle cx="80" cy="46" r="4" className="fill-slate-300 dark:fill-slate-600" />

                  {/* Search Bar pill */}
                  <rect
                    x="100"
                    y="38"
                    width="200"
                    height="16"
                    rx="8"
                    className="fill-white dark:fill-[#111827] stroke-slate-200/80 dark:stroke-slate-700/80"
                    strokeWidth="1"
                  />

                  {/* Search Result Snippet 1 */}
                  <rect x="65" y="78" width="130" height="10" rx="3" className="fill-amber-500" />
                  <rect x="65" y="94" width="180" height="6" rx="2" className="fill-slate-200 dark:fill-slate-700" />
                  <rect x="65" y="104" width="150" height="6" rx="2" className="fill-slate-200 dark:fill-slate-700" />

                  {/* Upward Trending Graph in background */}
                  <path
                    d="M70 240L140 190L210 210L300 130"
                    className="stroke-emerald-500 dark:stroke-emerald-400"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M70 240L140 190L210 210L300 130V260H70Z"
                    className="fill-emerald-500/10"
                  />
                  <circle cx="140" cy="190" r="4" className="fill-emerald-500" />
                  <circle cx="210" cy="210" r="4" className="fill-emerald-500" />
                  <circle cx="300" cy="130" r="5" className="fill-emerald-500 stroke-white dark:stroke-slate-900" strokeWidth="2" />

                  {/* Connecting Network Line */}
                  <path
                    d="M130 145 C 160 120, 240 120, 275 140"
                    className="stroke-amber-400/80"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />

                  {/* Map Pin Icon Floating Left */}
                  <g transform="translate(100, 115)">
                    <circle cx="20" cy="20" r="24" className="fill-white dark:fill-[#1e293b] stroke-slate-200 dark:stroke-slate-700" strokeWidth="2" />
                    <circle cx="20" cy="20" r="16" className="fill-rose-500/10" />
                    <path
                      d="M20 10C16.1 10 13 13.1 13 17C13 22.2 20 29 20 29C20 29 27 22.2 27 17C27 13.1 23.9 10 20 10ZM20 19.5C18.6 19.5 17.5 18.4 17.5 17C17.5 15.6 18.6 14.5 20 14.5C21.4 14.5 22.5 15.6 22.5 17C22.5 18.4 21.4 19.5 20 19.5Z"
                      className="fill-rose-500"
                    />
                  </g>

                  {/* Phone Receiving Call Floating Right */}
                  <g transform="translate(265, 140)">
                    <circle cx="25" cy="25" r="28" className="fill-white dark:fill-[#1e293b] stroke-emerald-500/50" strokeWidth="2" />
                    <rect x="15" y="10" width="20" height="30" rx="3" className="fill-emerald-500/10 stroke-emerald-500" strokeWidth="2" />
                    <line x1="22" y1="35" x2="28" y2="35" className="stroke-emerald-500" strokeWidth="2" strokeLinecap="round" />
                    {/* Ringing Waves */}
                    <path d="M10 18C8 20 8 26 10 28" className="stroke-emerald-500" strokeWidth="2" strokeLinecap="round" />
                    <path d="M40 18C42 20 42 26 40 28" className="stroke-emerald-500" strokeWidth="2" strokeLinecap="round" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Three Paths (Feature Grid) */}
      <section className="relative">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
          <div className="max-w-3xl mb-12 sm:mb-16">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-2">
              Category Architecture
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Three Clear Paths From an Independent SEO Company
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Search engine optimization is not one single tactic. Here are the three distinct paths, based on how your customers actually look for help.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Card 1: Local SEO & Google Maps */}
            <div className="p-8 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Illustration: Map pin with a radius circle */}
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-emerald-500">
                  <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" strokeWidth="2.5">
                    <circle cx="24" cy="24" r="18" className="stroke-emerald-300 dark:stroke-emerald-700" strokeDasharray="3 3" />
                    <circle cx="24" cy="24" r="10" className="fill-emerald-100 dark:fill-emerald-900/40 stroke-emerald-400" />
                    <path
                      d="M24 14C20.7 14 18 16.7 18 20C18 24.5 24 30 24 30C24 30 30 24.5 30 20C30 16.7 27.3 14 24 14ZM24 22C22.9 22 22 21.1 22 20C22 18.9 22.9 18 24 18C25.1 18 26 18.9 26 20C26 21.1 25.1 22 24 22Z"
                      className="fill-emerald-600 dark:fill-emerald-400 stroke-none"
                    />
                  </svg>
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Local Service Radius
                </p>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Local SEO & Google Maps
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  Rank in the Google Map Pack and secure top local spots when nearby property owners need emergency repairs or scheduled installations.
                </p>
                <div className="pt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Who it is for:</span>{' '}
                  Plumbers, HVAC contractors, electricians, and roofers serving a specific town, metro area, or twenty mile driving radius.
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <Link
                  to="/seo/local"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
                >
                  Explore Local SEO & Map Pack →
                </Link>
              </div>
            </div>

            {/* Card 2: National & Regional SEO */}
            <div className="p-8 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Illustration: Outline of connected states */}
                <div className="w-16 h-16 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 flex items-center justify-center text-sky-500">
                  <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="8" y="10" width="14" height="12" rx="2" className="stroke-sky-500 fill-sky-100 dark:fill-sky-900/30" />
                    <rect x="26" y="10" width="14" height="12" rx="2" className="stroke-sky-500 fill-sky-100 dark:fill-sky-900/30" />
                    <rect x="17" y="26" width="14" height="12" rx="2" className="stroke-sky-500 fill-sky-100 dark:fill-sky-900/30" />
                    <line x1="22" y1="16" x2="26" y2="16" className="stroke-sky-400" />
                    <line x1="15" y1="22" x2="21" y2="26" className="stroke-sky-400" />
                    <line x1="33" y1="22" x2="27" y2="26" className="stroke-sky-400" />
                  </svg>
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Broad Reach Authority
                </p>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  National & Regional SEO
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  Rank across entire states or across the country for specialized commercial contracting terms and high value industrial projects.
                </p>
                <div className="pt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Who it is for:</span>{' '}
                  Commercial builders, custom metal fabricators, and trade equipment installers who take contracts across multiple state lines.
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <Link
                  to="/seo/national"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300"
                >
                  Explore National SEO →
                </Link>
              </div>
            </div>

            {/* Card 3: AEO & GEO Optimization */}
            <div className="p-8 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Illustration: Chat bubble with an AI spark icon */}
                <div className="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 flex items-center justify-center text-purple-500">
                  <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path
                      d="M10 14C10 10.7 12.7 8 16 8H32C35.3 8 38 10.7 38 14V26C38 29.3 35.3 32 32 32H20L12 38V32H16C12.7 32 10 29.3 10 26V14Z"
                      className="stroke-purple-500 fill-purple-100 dark:fill-purple-900/30"
                    />
                    <path
                      d="M24 14L25.2 17.8L29 19L25.2 20.2L24 24L22.8 20.2L19 19L22.8 17.8L24 14Z"
                      className="fill-purple-600 dark:fill-purple-400 stroke-none"
                    />
                  </svg>
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  AI Search Citations
                </p>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  AEO & GEO Optimization
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  Structure your company entity data so artificial intelligence engines cite your business directly when homeowners ask for recommendations.
                </p>
                <div className="pt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Who it is for:</span>{' '}
                  Modern trade contractors who want to lead their market as buyers use conversational tools like ChatGPT and Perplexity to hire help.
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <Link
                  to="/seo/aeo-geo"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                >
                  Explore AI Search & GEO →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Why It Focuses on Revenue (Differentiators) */}
      <section className="relative py-12 bg-slate-50/50 dark:bg-[#0B1120]/50 border-y border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
          <div className="max-w-3xl mb-12 sm:mb-16">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-2">
              The Direct-Access Advantage
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Why My SEO Services for Contractors Focus on Revenue
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              No vanity reports, no meaningless impression spikes. Just the core technical fixes that get you off page two of Google and onto page one.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Card 1: Direct Access */}
            <div className="p-8 sm:p-10 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center text-amber-500">
                {/* Handshake / Direct line icon */}
                <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Direct Access to Me
                </h3>
                <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  When you hire a typical marketing firm, your project goes through multiple layers of account managers. I handle your search plan personally. You get fast answers, direct communication, and technical work executed without delays.
                </p>
              </div>
            </div>

            {/* Card 2: No Cookie Cutter Page Templates */}
            <div className="p-8 sm:p-10 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center text-amber-500">
                {/* Speed gauge / lightning icon */}
                <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  No Cookie Cutter Page Templates
                </h3>
                <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  Most agency websites use bloated site builders that load slow on smartphones. Your pages get built lightweight, meeting Google's Core Web Vitals standards and loading in under a second, so visitors stay on the page and call your business.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/audit"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-base shadow-lg shadow-amber-500/25 hover:shadow-amber-500/35 transition-all transform active:scale-98"
            >
              Start My Free Audit
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 4: How It Works (Process Steps) */}
      <section className="relative">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
          <div className="max-w-3xl mb-12 sm:mb-16">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-2">
              Execution Roadmap
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              How Small Business SEO Works When You Work With Me
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Here's the four-step method that turns Google searches into booked contractor appointments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Step 01 */}
            <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Step 01
                </span>
                {/* Magnifying glass */}
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-500">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Audit & Diagnosis
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Your current rankings, Google Business Profile, and competitors all get audited to find exactly what's blocking your calls.
              </p>
            </div>

            {/* Step 02 */}
            <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Step 02
                </span>
                {/* Wrench */}
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-500">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Technical Cleanup
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Business listings get fixed, broken code removed, page speed improved, and structured schema markup added (code that helps Google understand exactly what your business offers).
              </p>
            </div>

            {/* Step 03 */}
            <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Step 03
                </span>
                {/* Document / page */}
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-500">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Service Pages
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Dedicated pages get built for each trade service and city you want jobs in, so Google knows exactly what you offer.
              </p>
            </div>

            {/* Step 04 */}
            <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Step 04
                </span>
                {/* Star */}
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-500">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Reputation Growth
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Automated review workflows get set up to prompt your happy customers to leave 5-star ratings on Google.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: What Clients Say (Testimonials) */}
      <section className="relative">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
          <div className="max-w-3xl mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              What Clients Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Testimonial 1 */}
            <div className="p-8 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-base text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  "Before working with Miguel, we were on page 3 for our own city. Within a few months we were showing up in the Map Pack for the searches that actually turn into service calls."
                </p>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white border-t border-slate-100 dark:border-slate-800 pt-4">
                Sarah, Plumbing Company Owner
              </h3>
            </div>

            {/* Testimonial 2 */}
            <div className="p-8 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-base text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  "We bid on contracts across four states, and our old site never ranked outside our home market. The national SEO work got us showing up in searches we were completely invisible for before."
                </p>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white border-t border-slate-100 dark:border-slate-800 pt-4">
                Tom, Commercial Metal Fabricator
              </h3>
            </div>

            {/* Testimonial 3 */}
            <div className="p-8 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-base text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  "I didn't even know AI search was something to optimize for until Miguel brought it up. Now when people ask ChatGPT for a contractor in our area, we actually get mentioned."
                </p>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white border-t border-slate-100 dark:border-slate-800 pt-4">
                Priya, HVAC Business Owner
              </h3>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/audit"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-base shadow-lg shadow-amber-500/25 hover:shadow-amber-500/35 transition-all transform active:scale-98"
            >
              Claim Your Free Audit
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 6: FAQ */}
      <section className="relative">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
          <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-2">
              Common Inquiries
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Frequently Asked Questions About My Contractor SEO Services
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full text-left p-6 flex items-center justify-between gap-4 font-semibold text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                  >
                    <h3 className="text-base sm:text-lg font-semibold leading-snug">
                      {faq.q}
                    </h3>
                    <ChevronDown
                      className={`w-5 h-5 shrink-0 text-slate-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-amber-500' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* SECTION 7: Closing CTA */}
      <section className="relative py-16 sm:py-20 bg-amber-500 dark:bg-amber-500 text-slate-950 rounded-3xl mx-4 sm:mx-8 md:mx-auto max-w-6xl shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 opacity-95" />
        <div className="max-w-4xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 relative z-10 text-center space-y-6">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-950/80 font-mono">
            Ready to Rank
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950">
            Get SEO Built to Ring Your Phone, Not Impress a Report
          </h2>
          <p className="text-base sm:text-lg text-slate-900 max-w-2xl mx-auto leading-relaxed">
            Stop paying for vanity metrics and shared leads. Start with a free 5-minute audit and see exactly what's keeping your business off the first page.
          </p>
          <div className="pt-2">
            <Link
              to="/audit"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-base shadow-xl transition-all transform active:scale-98"
            >
              Get My Free SEO Audit
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
