import { FreeAuditCTA } from '../components/FreeAuditCTA'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Search,
  MapPin,
  Sparkles,
  ArrowRight,
  ChevronDown,
  Check,
  CheckCircle2,
  Bot,
  Layers,
  Star,
  Globe2,
  ShieldCheck,
} from 'lucide-react'
import { useState } from 'react'

const LOCAL_SEO_FAQ = [
  {
    question: 'How long does it take to see results from local seo services?',
    answer:
      'Most contractors see ranking movement in the Google Map Pack within 30 to 60 days. Rankings improve as I clean up your directory listings, correct your profile categories, and set up a steady stream of customer reviews.',
  },
  {
    question: 'What is the difference between Google Map Pack and organic website ranking?',
    answer:
      'The Google Map Pack shows three local businesses with their phone numbers, reviews, and addresses at the very top of the search page. Organic rankings appear below the map. Local search marketing ensures you win both positions in your immediate service area.',
  },
  {
    question: 'What is the difference between Month 1 and the monthly plan?',
    answer:
      'Month 1 is a complete foundation sprint. I audit your Google profile, clean up citations across 50 major directories, and launch your review workflow. The monthly plan defends your top rank with fresh photos, new customer reviews, and dedicated city pages.',
  },
  {
    question: 'Do I get access to live ranking reports?',
    answer:
      'Yes. You get a private client portal with live visual rank maps across your entire service territory so you can see where your business stands in real time.',
  },
]

const LOCAL_SEO_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'Local SEO Services',
      serviceType: 'Local Search Engine Optimization',
      provider: {
        '@type': 'LocalBusiness',
        name: 'built by Miguel',
        url: 'https://builtbymiguel.net',
      },
      description:
        'Direct local SEO services and Google Business Profile optimization for trade contractors and small businesses across the United States.',
      areaServed: 'United States',
      isPartOf: {
        '@type': 'Service',
        name: 'SEO Services for Contractors',
        url: 'https://builtbymiguel.net/seo',
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Local SEO Services',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Google Business Profile Optimization',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'AI Engine Local Entity Schema',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'NAP Directory Citation Cleanup',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Automated 5-Star Review Acceleration',
            },
          },
        ],
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: LOCAL_SEO_FAQ.map((faq) => ({
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

export const Route = createFileRoute('/local-seo-gbp')({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      {
        title: 'Local SEO Services: Rank in Google Maps | built by Miguel',
      },
      {
        name: 'description',
        content:
          'We provide local seo services that help trade contractors and local businesses rank in the Google Map Pack and win direct calls. Request a free 5-minute video audit.',
      },
      {
        name: 'keywords',
        content:
          'local seo services, local seo company, google business profile optimization, local seo for small business, gbp optimization, local search marketing',
      },
      // OpenGraph
      { property: 'og:type', content: 'website' },
      {
        property: 'og:title',
        content: 'Local SEO Services: Rank in Google Map Pack | built by Miguel',
      },
      {
        property: 'og:description',
        content:
          'We provide local seo services that help trade contractors and local businesses rank in the Google Map Pack and win direct calls. Request a free 5-minute video audit.',
      },
      { property: 'og:url', content: 'https://builtbymiguel.net/local-seo-gbp' },
      { property: 'og:image', content: 'https://builtbymiguel.net/og-image.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: 'https://builtbymiguel.net/og-image.png' },
    ],
    links: [
      {
        rel: 'canonical',
        href: 'https://builtbymiguel.net/local-seo-gbp',
      },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify(LOCAL_SEO_JSON_LD),
      },
    ],
  }),
  component: LocalSeoGbpPage,
})

function LocalSeoGbpPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  return (
    <div className="space-y-24 sm:space-y-32 lg:space-y-36 py-6 sm:py-10">
      {/* HERO SECTION */}
      <section className="relative text-center max-w-4xl mx-auto">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-rose-200/30 via-orange-100/30 to-teal-100/30 dark:from-rose-500/10 dark:via-orange-500/10 dark:to-teal-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

        {/* Pillar Breadcrumb Link */}
        <div className="mb-6 flex justify-center">
          <Link
            to="/seo"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
          >
            <span>←</span>
            <span>Part of SEO Services for Contractors</span>
          </Link>
        </div>

        <div className="mb-8 sm:mb-10 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-rose-600 dark:text-rose-400 shadow-sm">
            <MapPin className="w-3.5 h-3.5" /> High-Intent Search Acquisition
          </div>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.12] mb-6 sm:mb-8">
          Direct{' '}
          <span className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 bg-clip-text text-transparent">
            Local SEO Services
          </span>{' '}
          to Win Google Map Pack Rankings.
        </h1>

        <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto font-normal">
          We provide direct local seo services for trade contractors and service businesses that need more local customer calls. If you serve a specific city or regional territory, ranking in the Google Map Pack is your most profitable source of new work. Traditional marketing agencies charge big retainers for cookie-cutter templates and vanity reports. We optimize your Google Business Profile and local citation network so nearby homeowners call you first.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 sm:pt-10">
          <Link
            to="/audit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-base text-white bg-slate-900 dark:bg-rose-600 hover:bg-black dark:hover:bg-rose-500 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-rose-400 dark:text-white fill-rose-400 dark:fill-white" />
            <span>Get Your Free 5-Minute Video Audit</span>
          </Link>

          <Link
            to="/work"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-base text-slate-800 dark:text-slate-200 hover:text-black dark:hover:text-white bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow transition-all duration-200"
          >
            <span>View Client Case Studies</span>
            <ArrowRight className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </Link>
        </div>

        <div className="pt-3 sm:pt-4 text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>100% Free · Custom video breakdown · No high-pressure sales calls</span>
        </div>
      </section>

      {/* SIBLING COMPARISON SECTION */}
      <section className="rounded-3xl sm:rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-8 sm:p-12 space-y-8">
        <div className="space-y-3 max-w-2xl">
          <div className="text-[11px] font-mono uppercase tracking-widest text-rose-600 dark:text-rose-400 font-bold">
            Search Strategy Differences
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            How This Differs From National SEO and AI Search
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            Different search campaigns solve different business needs. Here is how local search marketing compares to my other search paths.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="p-6 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border-2 border-rose-500/30 dark:border-rose-500/30 space-y-3">
            <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 uppercase">THIS PAGE</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Local SEO & Map Pack</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Local SEO targets Google Maps and Map Pack results for one city or one service area. It is built for contractors who drive out to homes and job sites.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 space-y-3">
            <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 uppercase">BROAD REACH</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">National & Regional SEO</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              National SEO targets many markets with no single location. It focuses on broad organic rankings across entire states or the whole country.
            </p>
            <Link
              to="/national-seo"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline pt-1"
            >
              <span>View National SEO</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 space-y-3">
            <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 uppercase">NEXT-GEN SEARCH</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">AEO & GEO (AI Search)</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              AEO and GEO targets AI answer engines like ChatGPT and Perplexity rather than traditional search result lists.
            </p>
            <Link
              to="/aeo-geo"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline pt-1"
            >
              <span>View AI Search Optimization</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* WHY LOCAL SEO SERVICES WORK */}
      <section className="space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-[11px] font-mono uppercase tracking-widest text-rose-600 dark:text-rose-400 font-bold">
            High Intent Traffic
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            Why Local SEO Services Deliver Better Leads Than Paid Ads
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            When a homeowner needs a plumber or electrician right away, they skip the sponsored ads and look at the top three map listings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              No Per-Click Fees on Inbound Calls
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Paid ads stop delivering the moment you pause your ad budget. Local map positions generate consistent calls without costing you fifty dollars every time someone taps your phone number.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] space-y-4">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-800/40 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <Star className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Instant Local Trust and Social Proof
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Homeowners trust businesses with high star ratings and recent reviews. I combine technical profile setup with review tools so your business stands out as the most reputable choice in town.
            </p>
          </div>
        </div>
      </section>

      {/* 4 DELIVERABLES WHITE CARDS */}
      <section className="space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-[11px] font-mono uppercase tracking-widest text-rose-600 dark:text-rose-400 font-bold">
            What You Get
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            Complete Google Business Profile Optimization Included
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            No vague retainer hours or vanity numbers. Every deliverable helps you rank higher and get more phone calls.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-emerald-500/40 dark:hover:border-emerald-500/50 hover:shadow-xl transition-all space-y-5 shadow-sm dark:shadow-none">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Search className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="space-y-2">
              <div className="text-[10px] font-mono font-bold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">
                GOOGLE MAPS RANKINGS
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                GBP Optimization & Categories
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                I update your primary and secondary categories, service areas, and geo-tagged photos to help your business rank at the top of local searches.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium pt-2 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Primary and secondary category configuration</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Dedicated city and service landing pages for your market</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Visual rank maps across your service radius</span>
              </li>
            </ul>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-cyan-500/40 dark:hover:border-cyan-500/50 hover:shadow-xl transition-all space-y-5 shadow-sm dark:shadow-none">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-100 dark:border-cyan-800/40 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="space-y-2">
              <div className="text-[10px] font-mono font-bold tracking-widest text-cyan-600 dark:text-cyan-400 uppercase">
                AI SEARCH READINESS
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                AI Search Citations
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Make sure AI tools recommend your company when local property owners ask for recommendations.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium pt-2 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>Structured local business schema for Google and AI engines</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>Verified company data across major directories</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>Direct inclusion in AI search answers</span>
              </li>
            </ul>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-indigo-500/40 dark:hover:border-indigo-500/50 hover:shadow-xl transition-all space-y-5 shadow-sm dark:shadow-none">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Layers className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="space-y-2">
              <div className="text-[10px] font-mono font-bold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase">
                DIRECTORY CLEANUP
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Directory Citation Cleanup
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Old phone numbers and wrong addresses hurt your rank. I clean your listings across 50 top directories.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium pt-2 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>Matching name, address, and phone number across the web</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>Removal of duplicate and outdated business listings</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>Top listings on Apple Maps, Yelp, and Bing</span>
              </li>
            </ul>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-orange-500/40 dark:hover:border-orange-500/50 hover:shadow-xl transition-all space-y-5 shadow-sm dark:shadow-none">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-100 dark:border-orange-800/40 flex items-center justify-center text-orange-600 dark:text-orange-400">
              <Star className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="space-y-2">
              <div className="text-[10px] font-mono font-bold tracking-widest text-orange-600 dark:text-orange-400 uppercase">
                5-STAR REVIEWS
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Automated Review Funnel
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Collect 5-star Google reviews on autopilot right after you finish a job.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium pt-2 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
                <span>Direct one-click review links sent by text message</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
                <span>Helpful review response templates that boost search rankings</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
                <span>Simple routing to resolve private customer feedback</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* HOW LOCAL SEO FOR SMALL BUSINESS DRIVES JOBS */}
      <section className="space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-[11px] font-mono uppercase tracking-widest text-rose-600 dark:text-rose-400 font-bold">
            Local Growth Mechanics
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            How Local SEO for Small Business Drives Consistent Jobs
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            I connect your local search presence directly to phone calls and estimate requests.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] space-y-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">1. City Coverage</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              I build dedicated pages for each town and neighborhood you work in so you rank outside your home office location.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] space-y-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">2. Trade Keywords</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              I optimize your services for high-intent emergency keywords that property owners search when they need work done today.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] space-y-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">3. Review Velocity</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Steady monthly reviews signal to Google that your business is active, reliable, and worthy of top placement.
            </p>
          </div>
        </div>
      </section>

      {/* SETUP VS RETAINER COMPARISON GRID */}
      <section className="space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-[11px] font-mono uppercase tracking-widest text-rose-600 dark:text-rose-400 font-bold">
            Clear Transparency
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Month 1 Setup vs. Monthly Retainer
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Everything I do is clearly documented. No guesswork, no hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-8 space-y-6 shadow-sm dark:shadow-none">
            <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                PHASE 1
              </span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Month 1: Foundation Sprint</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Total cleanup and setup</p>
            </div>
            <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>Complete Google profile audit and category update</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>Directory cleanup and duplicate removal across 50 sites</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>Structured local business code installed on your site</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>Automated review request system set up</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>Initial ranking maps across your service area</span>
              </li>
            </ul>
          </div>

          <div className="rounded-[2.5rem] border-2 border-rose-500/40 bg-white dark:bg-[#111827] p-8 space-y-6 shadow-xl relative ring-4 ring-rose-500/5">
            <div className="absolute -top-3.5 right-8 px-3.5 py-1 rounded-full bg-slate-900 dark:bg-rose-600 text-white text-[11px] font-mono font-bold uppercase tracking-wider shadow-md">
              ★ Most Popular
            </div>
            <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold border border-transparent dark:border-rose-900/50">
                PHASE 2 & BEYOND
              </span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Monthly Growth Retainer</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Ongoing rank growth and defense</p>
            </div>
            <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>Weekly photo updates and local signal posts</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>Automated review follow-ups and keyword replies</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>New city and service pages added each month</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>Live ranking maps inside your private client portal</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>Monthly performance report with clear results</span>
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
            Frequently Asked Questions About Local Search Marketing
          </h2>
        </div>

        <div className="space-y-4">
          {LOCAL_SEO_FAQ.map((faq, index) => {
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
      <FreeAuditCTA variant="local-seo" />
    </div>
  )
}
