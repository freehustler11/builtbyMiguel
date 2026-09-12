import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowRight,
  ChevronDown,
  Check,
  Star,
} from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/seo/aeo-geo')({
  head: () => ({
    meta: [
      {
        title:
          'Generative Engine Optimization (AEO & GEO) Services | built by Miguel',
      },
      {
        name: 'description',
        content:
          'Get cited by ChatGPT, Perplexity, and AI Overviews with structured schema and entity optimization. Direct service, no agency. Free 5-minute video audit.',
      },
      {
        name: 'keywords',
        content:
          'generative engine optimization services, aeo services, geo optimization, chatgpt seo, ai search optimization, llm seo',
      },
      {
        property: 'og:title',
        content:
          'Generative Engine Optimization (AEO & GEO) Services | built by Miguel',
      },
      {
        property: 'og:description',
        content:
          'Get cited by ChatGPT, Perplexity, and AI Overviews with structured schema and entity optimization. Direct service, no agency. Free 5-minute video audit.',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:url',
        content: 'https://builtbymiguel.net/seo/aeo-geo',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content:
          'Generative Engine Optimization (AEO & GEO) Services | built by Miguel',
      },
      {
        name: 'twitter:description',
        content:
          'Get cited by ChatGPT, Perplexity, and AI Overviews with structured schema and entity optimization. Direct service, no agency. Free 5-minute video audit.',
      },
    ],
    links: [
      {
        rel: 'canonical',
        href: 'https://builtbymiguel.net/seo/aeo-geo',
      },
    ],
  }),
  component: AeoGeoPage,
})

const AEO_GEO_FAQ = [
  {
    question:
      'What is the difference between AEO and traditional search optimization?',
    answer:
      'Traditional search optimization focuses on ranking ten blue links on a Google search results page. Answer Engine Optimization, or AEO, focuses on feeding clean facts and structured data into conversational models so they give your company as the direct answer to user queries.',
  },
  {
    question:
      'How do ChatGPT and Perplexity decide which businesses to recommend?',
    answer:
      'They cross-reference multiple trusted data sources, business directories, and structured schema markup, then favor businesses with clear, verifiable, consistently-cited information over ones with conflicting or thin data across the web.',
  },
  {
    question:
      'Do I still need a website if AI answer engines provide direct answers?',
    answer:
      'Yes. AI engines pull their facts from somewhere, and a clear, well-structured website is usually the source they cite from. It also remains where the actual phone call, booking form, or service page conversion happens once someone acts on an AI recommendation.',
  },
  {
    question:
      'How do generative engine optimization services improve my business revenue?',
    answer:
      "By putting your business directly in front of buyers at the moment they're asking AI tools for a recommendation, before they've even opened a search engine. Getting cited as the answer skips several steps of the traditional research process and can shorten the path from question to phone call.",
  },
  {
    question: "What's included in the free audit?",
    answer:
      'A personally recorded 5-minute video reviewing how your business currently shows up, or doesn\'t, when AI tools are asked for a recommendation in your space, delivered within 24 hours. There is no sales call required to get it.',
  },
  {
    question:
      'Do I need this in addition to local or national SEO, or instead of it?',
    answer:
      'In addition. AEO and GEO work best layered on top of [Local SEO](/seo/local) or [National SEO](/seo/national), since AI engines still lean heavily on the same structured, verified business data that traditional search rankings depend on.',
    links: [
      { text: 'Local SEO', url: '/seo/local' },
      { text: 'National SEO', url: '/seo/national' },
    ],
  },
  {
    question: 'How long does it take to see AI citations improve?',
    answer:
      'Most businesses see initial changes in AI citation frequency within 60 to 90 days, though this depends heavily on how much conflicting or outdated business data exists across the web before cleanup starts.',
  },
  {
    question: 'Do you require long-term contracts?',
    answer:
      'No. Work runs month to month with no long-term lock-in required.',
  },
]

const AEO_GEO_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'Direct Generative Engine Optimization Services',
      serviceType: 'Generative Engine Optimization & Answer Engine Optimization',
      provider: {
        '@type': 'LocalBusiness',
        name: 'built by Miguel',
        url: 'https://builtbymiguel.net',
      },
      description:
        'Get generative engine optimization built to make sure AI tools cite, recommend, and feature your business.',
      areaServed: 'United States',
      isPartOf: {
        '@type': 'Service',
        name: 'SEO Services for Contractors',
        url: 'https://builtbymiguel.net/seo',
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'AEO & GEO Deliverables',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'LLM SEO & Structured LLMO Code',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'GEO Optimization & Factual Answers',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'ChatGPT SEO & Perplexity SEO',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'AI Visibility Optimization',
            },
          },
        ],
      },
    },
    {
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
          name: 'SEO Services',
          item: 'https://builtbymiguel.net/seo',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'AEO & GEO Optimization',
          item: 'https://builtbymiguel.net/seo/aeo-geo',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: AEO_GEO_FAQ.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer.replace(/\\/g, ''),
        },
      })),
    },
  ],
}

function AeoGeoPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="space-y-24 sm:space-y-32 pb-24 text-slate-900 dark:text-slate-100 selection:bg-emerald-500 selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(AEO_GEO_JSON_LD) }}
      />

      {/* SECTION 0 & 1: Breadcrumb + Hero */}
      <section className="relative pt-8 sm:pt-12 lg:pt-16 pb-12 overflow-hidden border-b border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-b from-slate-50/50 via-white to-white dark:from-[#0B1120] dark:via-[#0B1120] dark:to-[#0B1120]">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/2 left-10 w-72 h-72 bg-teal-500/10 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 relative z-10">
          {/* SECTION 0: Breadcrumb */}
          <div className="mb-6 sm:mb-8">
            <Link
              to="/seo"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
            >
              ← Part of SEO Services for Contractors
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Copy Column */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8">
              <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                Generative & Answer Engine Architecture
              </p>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl/tight font-extrabold tracking-tight text-slate-900 dark:text-white">
                Direct Generative Engine Optimization Services for AI Search
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                Get generative engine optimization built to make sure AI tools
                cite, recommend, and feature your business. As customers shift
                from traditional search bars to ChatGPT, Perplexity, and Google AI
                Overviews, entity data, schema markup, and a technical knowledge
                graph get structured so AI models recognize your company as the
                authoritative answer.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    to="/audit"
                    className="inline-flex items-center justify-center px-6 sm:px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/35 transition-all transform active:scale-98"
                  >
                    Get Your Free 5-Minute Video Audit
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                  <Link
                    to="/work"
                    className="inline-flex items-center justify-center px-6 sm:px-8 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm sm:text-base transition-colors"
                  >
                    View Client Case Studies
                  </Link>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  100% Free · Custom video breakdown · No high-pressure sales calls
                </p>
              </div>
            </div>

            {/* Illustration Column */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md lg:max-w-none p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 shadow-xl relative overflow-hidden">
                {/* Vector illustration of chat interface + schema nodes */}
                <svg
                  viewBox="0 0 400 320"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-auto"
                >
                  <rect
                    x="10"
                    y="10"
                    width="380"
                    height="300"
                    rx="16"
                    className="fill-slate-50 dark:fill-[#0d1526] stroke-slate-200 dark:stroke-slate-800"
                    strokeWidth="2"
                  />
                  {/* Chat header */}
                  <rect
                    x="25"
                    y="25"
                    width="140"
                    height="12"
                    rx="6"
                    className="fill-slate-300 dark:fill-slate-700"
                  />
                  <circle
                    cx="360"
                    cy="31"
                    r="5"
                    className="fill-emerald-500"
                  />

                  {/* User query bubble */}
                  <rect
                    x="160"
                    y="55"
                    width="215"
                    height="38"
                    rx="12"
                    className="fill-slate-200 dark:fill-slate-800"
                  />
                  <rect
                    x="175"
                    y="67"
                    width="150"
                    height="6"
                    rx="3"
                    className="fill-slate-400 dark:fill-slate-500"
                  />
                  <rect
                    x="175"
                    y="77"
                    width="100"
                    height="6"
                    rx="3"
                    className="fill-slate-300 dark:fill-slate-600"
                  />

                  {/* Schema graph connector lines */}
                  <path
                    d="M 60 180 L 120 135 L 200 135"
                    className="stroke-emerald-500/60 dark:stroke-emerald-400/60"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                  <path
                    d="M 60 180 L 120 225 L 200 225"
                    className="stroke-emerald-500/60 dark:stroke-emerald-400/60"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />

                  {/* Entity Schema Graph Nodes */}
                  <circle
                    cx="60"
                    cy="180"
                    r="16"
                    className="fill-emerald-500/20 stroke-emerald-500"
                    strokeWidth="2"
                  />
                  <circle cx="60" cy="180" r="6" className="fill-emerald-500" />

                  <circle
                    cx="120"
                    cy="135"
                    r="10"
                    className="fill-teal-500/20 stroke-teal-500"
                    strokeWidth="1.5"
                  />
                  <circle cx="120" cy="135" r="4" className="fill-teal-500" />

                  <circle
                    cx="120"
                    cy="225"
                    r="10"
                    className="fill-teal-500/20 stroke-teal-500"
                    strokeWidth="1.5"
                  />
                  <circle cx="120" cy="225" r="4" className="fill-teal-500" />

                  {/* AI Cited Answer Box */}
                  <rect
                    x="190"
                    y="110"
                    width="185"
                    height="140"
                    rx="14"
                    className="fill-white dark:fill-[#152033] stroke-emerald-500 dark:stroke-emerald-400"
                    strokeWidth="2"
                  />

                  {/* Verified Answer Badge */}
                  <rect
                    x="205"
                    y="124"
                    width="65"
                    height="18"
                    rx="9"
                    className="fill-emerald-500/20"
                  />
                  <circle cx="215" cy="133" r="4" className="fill-emerald-500" />
                  <rect
                    x="224"
                    y="130"
                    width="36"
                    height="6"
                    rx="3"
                    className="fill-emerald-600 dark:fill-emerald-400"
                  />

                  {/* Entity Card inside Answer */}
                  <rect
                    x="205"
                    y="152"
                    width="155"
                    height="48"
                    rx="10"
                    className="fill-slate-100 dark:fill-[#1a283f] stroke-slate-200 dark:stroke-slate-700"
                    strokeWidth="1"
                  />
                  {/* Entity icon & title */}
                  <rect
                    x="215"
                    y="162"
                    width="28"
                    height="28"
                    rx="6"
                    className="fill-emerald-500/30"
                  />
                  <rect
                    x="250"
                    y="165"
                    width="95"
                    height="8"
                    rx="4"
                    className="fill-slate-800 dark:fill-slate-200"
                  />
                  <rect
                    x="250"
                    y="177"
                    width="65"
                    height="6"
                    rx="3"
                    className="fill-emerald-600 dark:fill-emerald-400"
                  />

                  {/* Cited Answer Details */}
                  <rect
                    x="205"
                    y="210"
                    width="150"
                    height="6"
                    rx="3"
                    className="fill-slate-400 dark:fill-slate-500"
                  />
                  <rect
                    x="205"
                    y="222"
                    width="110"
                    height="6"
                    rx="3"
                    className="fill-slate-300 dark:fill-slate-600"
                  />

                  {/* Input bottom bar */}
                  <rect
                    x="25"
                    y="270"
                    width="350"
                    height="26"
                    rx="8"
                    className="fill-slate-100 dark:fill-[#162136] stroke-slate-200 dark:stroke-slate-800"
                    strokeWidth="1"
                  />
                  <circle cx="42" cy="283" r="5" className="fill-slate-300 dark:fill-slate-600" />
                  <rect
                    x="56"
                    y="280"
                    width="120"
                    height="6"
                    rx="3"
                    className="fill-slate-300 dark:fill-slate-600"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: How This Differs (Sibling Comparison) */}
      <section className="relative">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
          <div className="max-w-3xl mb-12 sm:mb-16">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2">
              Search Strategy Differences
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              How AEO and GEO Differs From Local and National SEO
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Search behavior is splitting into two worlds. Here's how conversational answer engines differ from traditional search indexes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Card 1: Active / This Page */}
            <div className="p-6 sm:p-8 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border-2 border-emerald-500 shadow-xl shadow-emerald-500/5 relative flex flex-col justify-between">
              <div className="space-y-4">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500 text-white">
                  This Page
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  AEO & GEO (AI Search)
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  AEO and GEO optimizes for AI answer engines like ChatGPT, Perplexity, and Google AI Overviews. These tools give a direct answer instead of a list of links.
                </p>
              </div>
            </div>

            {/* Card 2: Local SEO */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Map Radius
                </p>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Local SEO & Google Maps
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  Local SEO targets Google Maps and Map Pack results for one city or service area. It reaches nearby customers using traditional map searches.
                </p>
              </div>
              <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800">
                <Link
                  to="/seo/local"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
                >
                  View Local SEO →
                </Link>
              </div>
            </div>

            {/* Card 3: National SEO */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Broad Reach
                </p>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  National & Regional SEO
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  National SEO ranks a business across many markets or the whole country. Both Local and National SEO target traditional search results instead of direct AI answers.
                </p>
              </div>
              <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800">
                <Link
                  to="/seo/national"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
                >
                  View National SEO →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Industry Shift */}
      <section className="relative py-12 bg-slate-50/50 dark:bg-[#0B1120]/50 border-y border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
          <div className="max-w-3xl mb-12 sm:mb-16">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2">
              Industry Shift
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              What Changed in Search: From Blue Links to Direct Answers
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Search engines are no longer just directories. They are answer synthesis machines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* The Old Search Model */}
            <div className="p-8 sm:p-10 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  The Old Search Model
                </h3>
                <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  Users typed short keywords into Google and received ten blue links. They had to click through three or four separate websites, read long articles, and evaluate credibility themselves.
                </p>
              </div>
              <p className="font-bold text-slate-900 dark:text-white border-t border-slate-100 dark:border-slate-800 pt-4">
                Ranking required keyword density, repetitive backlinks, and high word counts.
              </p>
            </div>

            {/* The Generative AI Model */}
            <div className="p-8 sm:p-10 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border-2 border-emerald-500/80 dark:border-emerald-500/60 shadow-md flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  The Generative AI Model
                </h3>
                <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  Modern searchers ask natural language questions. AI systems read the web, extract verified facts, and generate a single authoritative answer. If your business is cited in that answer, you win the customer.
                </p>
              </div>
              <p className="font-bold text-emerald-700 dark:text-emerald-400 border-t border-emerald-200/60 dark:border-emerald-800/60 pt-4">
                Winning requires machine-readable schema markup, clear entity naming, and quotable facts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Why This Matters Now (Differentiators) */}
      <section className="relative">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
          <div className="max-w-3xl mb-12 sm:mb-16">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2">
              Future-Proof Visibility
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Why Generative Engine Optimization Services Matter Today
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Over a billion people now use conversational AI tools to find solutions. Here's how your brand gets positioned inside those answers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Differentiator 1 */}
            <div className="p-8 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
              {/* Flat vector icon: schema/graph-node */}
              <div className="w-14 h-14 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center border border-emerald-200/60 dark:border-emerald-800/60">
                <svg
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8"
                >
                  <circle cx="12" cy="14" r="6" className="fill-emerald-500/20 stroke-emerald-600 dark:stroke-emerald-400" strokeWidth="2.5" />
                  <circle cx="36" cy="14" r="6" className="fill-emerald-500/20 stroke-emerald-600 dark:stroke-emerald-400" strokeWidth="2.5" />
                  <circle cx="24" cy="36" r="6" className="fill-emerald-500/30 stroke-emerald-600 dark:stroke-emerald-400" strokeWidth="2.5" />
                  <path d="M16.5 17.5 L20.5 31" className="stroke-emerald-500" strokeWidth="2" strokeDasharray="3 3" />
                  <path d="M31.5 17.5 L27.5 31" className="stroke-emerald-500" strokeWidth="2" strokeDasharray="3 3" />
                  <path d="M18 14 L30 14" className="stroke-emerald-500" strokeWidth="2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Structured for Machines, Not Guesswork
              </h3>
              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Large language models do not read websites like human beings. They look for structured knowledge relationships and verifiable claims. Nested JSON-LD schema gets built directly into your source code, so machines understand your offerings without confusion.
              </p>
            </div>

            {/* Differentiator 2 */}
            <div className="p-8 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
              {/* Flat vector icon: phone with chat-bubble citation pointing to it */}
              <div className="w-14 h-14 rounded-xl bg-teal-50 dark:bg-teal-950/50 flex items-center justify-center border border-teal-200/60 dark:border-teal-800/60">
                <svg
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8"
                >
                  <rect x="10" y="8" width="16" height="32" rx="4" className="fill-slate-100 dark:fill-slate-800 stroke-teal-600 dark:stroke-teal-400" strokeWidth="2" />
                  <circle cx="18" cy="34" r="1.5" className="fill-teal-600 dark:fill-teal-400" />
                  <path d="M24 16 L38 12 C41 12 42 14 42 16 L42 24 C42 26 41 28 38 28 L30 28 L24 33 L24 16 Z" className="fill-teal-500/20 stroke-teal-600 dark:stroke-teal-400" strokeWidth="2" strokeLinejoin="round" />
                  <path d="M30 18 L36 18 M30 22 L34 22" className="stroke-teal-600 dark:stroke-teal-400" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                AI Search Optimization That Drives Calls
              </h3>
              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Getting cited by an AI engine is only valuable if it brings you customers. Your service data gets structured so conversational bots cite your phone number, service areas, and direct booking links when recommending solutions.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/audit"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/35 transition-all transform active:scale-98"
            >
              Start My Free Audit
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 5: How It Works (Feature Grid) */}
      <section className="relative py-12 bg-slate-50/50 dark:bg-[#0B1120]/50 border-y border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
          <div className="max-w-3xl mb-12 sm:mb-16">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2">
              Technical Architecture
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              How Answer Engine Optimization Secures Direct Answers
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Every deliverable focuses on turning your business into an undeniable source of truth for artificial intelligence models.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Entity Schema Graph
                </span>
                <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center border border-emerald-200/60 dark:border-emerald-800/60">
                  {/* Flat vector icon: knowledge-graph node cluster */}
                  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 stroke-emerald-600 dark:stroke-emerald-400" strokeWidth="2">
                    <circle cx="6" cy="6" r="3" />
                    <circle cx="18" cy="6" r="3" />
                    <circle cx="12" cy="18" r="3" />
                    <line x1="8.5" y1="7.5" x2="15.5" y2="7.5" />
                    <line x1="7.5" y1="8.5" x2="10.5" y2="15.5" />
                    <line x1="16.5" y1="8.5" x2="13.5" y2="15.5" />
                  </svg>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  LLM SEO &amp; Structured LLMO Code
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  Custom JSON-LD schema gets written linking your organization, professional credentials, trade licenses, and service territories into an unbroken knowledge graph.
                </p>
              </div>
              <ul className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Multi-node schema markup that AI models parse instantly</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Precise SameAs references connecting your profiles across the web</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Technical LLMO validation tested against live model parsers</span>
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Quotable Architecture
                </span>
                <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950/50 flex items-center justify-center border border-teal-200/60 dark:border-teal-800/60">
                  {/* Flat vector icon: speech bubble with checkmark */}
                  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 stroke-teal-600 dark:stroke-teal-400" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    <path d="m9 10 2 2 4-4" />
                  </svg>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  GEO Optimization &amp; Factual Answers
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  Key service explanations get rewritten into direct, fact-first sentences that answer engines can extract and quote verbatim without editorial truncation.
                </p>
              </div>
              <ul className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Stand-alone definition blocks optimized for AI citation</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Clear factual answers that eliminate machine hesitation</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Direct integration with your live customer case studies</span>
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Conversational Engines
                </span>
                <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center border border-emerald-200/60 dark:border-emerald-800/60">
                  {/* Flat vector icon: robot/crawler icon */}
                  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 stroke-emerald-600 dark:stroke-emerald-400" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="10" rx="2" />
                    <circle cx="12" cy="5" r="2" />
                    <path d="M12 7v4" />
                    <line x1="8" y1="16" x2="8.01" y2="16" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="16" y1="16" x2="16.01" y2="16" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  ChatGPT SEO &amp; Perplexity SEO
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  Web pages get verified as accessible to automated web agents and crawlable by OpenAI and Perplexity indexing bots.
                </p>
              </div>
              <ul className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Optimized robots.txt rules that invite generative crawlers</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Sub-second server response times that prevent AI crawler timeouts</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Monitoring brand recommendation frequency across active AI engines</span>
                </li>
              </ul>
            </div>

            {/* Feature 4 */}
            <div className="p-8 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Brand Citations
                </span>
                <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950/50 flex items-center justify-center border border-teal-200/60 dark:border-teal-800/60">
                  {/* Flat vector icon: verified-badge icon */}
                  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 stroke-teal-600 dark:stroke-teal-400" strokeWidth="2">
                    <path d="M12 2l3.09 3.26 4.41.64 1.25 4.28 2.92 3.39-1.57 4.18.25 4.45-4.22 1.44-2.73 3.56L12 21.39l-3.4 1.81-2.73-3.56-4.22-1.44.25-4.45-1.57-4.18 2.92-3.39 1.25-4.28 4.41-.64L12 2z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  AI Visibility Optimization
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  AI models cross-reference multiple trusted data sources before making recommendations. Business citations get synchronized across high-authority directories.
                </p>
              </div>
              <ul className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Citation cleanup across primary entity databases</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Consistent business naming that prevents AI hallucinations</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Verified business entity records that pass model verification</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/audit"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/35 transition-all transform active:scale-98"
            >
              Claim Your Free AI Search Audit
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 6: The Three Pillars (Implementation Framework) */}
      <section className="relative">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
          <div className="max-w-3xl mb-12 sm:mb-16">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2">
              Implementation Framework
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              The Three Pillars of Machine-Readable Optimization
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Here's the exact technical blueprint used to make sure AI engines recognize, trust, and quote your business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="p-8 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 relative">
              <span className="text-4xl sm:text-5xl font-extrabold text-emerald-600/20 dark:text-emerald-400/20 block font-mono">
                1
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Structured Schema Markup
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Detailed JSON-LD graphs get embedded into your code. This tells machines who you are, what services you offer, what geographic radius you serve, and which licenses you hold. For an example of how local business data connects with maps, see{' '}
                <Link
                  to="/seo/local"
                  className="font-semibold text-emerald-600 dark:text-emerald-400 underline underline-offset-4 hover:text-emerald-700 dark:hover:text-emerald-300"
                >
                  Local SEO &amp; Google Maps
                </Link>
                .
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-8 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 relative">
              <span className="text-4xl sm:text-5xl font-extrabold text-emerald-600/20 dark:text-emerald-400/20 block font-mono">
                2
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Clear Entity Naming
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Ambiguity is the enemy of AI search. If your company name appears differently across directories, AI tools get confused and refuse to recommend you. Your brand entity gets standardized across government registries, industry boards, and commercial databases so models recognize your authority instantly.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-8 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 relative">
              <span className="text-4xl sm:text-5xl font-extrabold text-emerald-600/20 dark:text-emerald-400/20 block font-mono">
                3
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                AI-Quotable Content
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                AI models do not summarize rambling marketing fluff. They look for crisp, direct sentences that define problems and provide factual answers. Content gets written specifically structured for generative extraction. You can see a real example of this code-level approach on the{' '}
                <Link
                  to="/systems-auto"
                  className="font-semibold text-emerald-600 dark:text-emerald-400 underline underline-offset-4 hover:text-emerald-700 dark:hover:text-emerald-300"
                >
                  Systems &amp; Automation
                </Link>{' '}
                page.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: What Clients Say (Testimonials) */}
      <section className="relative py-12 bg-slate-50/50 dark:bg-[#0B1120]/50 border-y border-slate-200/60 dark:border-slate-800/60">
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
                  "I asked ChatGPT myself what plumber to call in my own city, out of curiosity, and our business came up. I didn't think that was something you could actually influence until this."
                </p>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white border-t border-slate-100 dark:border-slate-800 pt-4">
                Frank, Plumbing Company Owner
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
                  "Our directory listings had three slightly different versions of our business name floating around for years. Cleaning that up alone seemed to make a real difference in how consistently we show up."
                </p>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white border-t border-slate-100 dark:border-slate-800 pt-4">
                Yolanda, HVAC Business Owner
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
                  "This felt like the first person who could actually explain what schema markup does in plain English instead of just saying it's important."
                </p>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white border-t border-slate-100 dark:border-slate-800 pt-4">
                Derek, Electrical Contractor
              </h3>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/audit"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/35 transition-all transform active:scale-98"
            >
              See If AI Tools Already Recommend You
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 8: FAQ */}
      <section className="relative">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
          <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2">
              Direct Machine-Readable Answers
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Frequently Asked Questions About AEO and GEO Optimization
            </h2>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Each answer below is written as a clear standalone paragraph designed for direct extraction.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {AEO_GEO_FAQ.map((faq, index) => {
              const isOpen = openFaq === index
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full text-left p-6 flex items-center justify-between gap-4 font-semibold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    <h3 className="text-base sm:text-lg font-semibold leading-snug">
                      {faq.question}
                    </h3>
                    <ChevronDown
                      className={`w-5 h-5 shrink-0 text-slate-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-emerald-500' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60">
                      {faq.links ? (
                        <p>
                          In addition. AEO and GEO work best layered on top of{' '}
                          <Link
                            to="/seo/local"
                            className="font-semibold text-emerald-600 dark:text-emerald-400 underline underline-offset-4 hover:text-emerald-700 dark:hover:text-emerald-300"
                          >
                            Local SEO
                          </Link>{' '}
                          or{' '}
                          <Link
                            to="/seo/national"
                            className="font-semibold text-emerald-600 dark:text-emerald-400 underline underline-offset-4 hover:text-emerald-700 dark:hover:text-emerald-300"
                          >
                            National SEO
                          </Link>
                          , since AI engines still lean heavily on the same structured, verified business data that traditional search rankings depend on.
                        </p>
                      ) : (
                        <p>{faq.answer}</p>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* SECTION 9: Closing CTA */}
      <section className="relative py-16 sm:py-20 bg-emerald-600 dark:bg-emerald-600 text-white rounded-3xl mx-4 sm:mx-8 md:mx-auto max-w-6xl shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 opacity-90" />
        <div className="max-w-4xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 relative z-10 text-center space-y-6">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-emerald-200">
            Be the Answer, Not a Link
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Get Cited by AI Before Your Competitors Even Show Up
          </h2>
          <p className="text-base sm:text-lg text-emerald-50 max-w-2xl mx-auto leading-relaxed">
            Stop losing customers to whichever business AI tools happen to recommend first. Start with a free 5-minute audit and see exactly how your business shows up in AI search today.
          </p>
          <div className="pt-2">
            <Link
              to="/audit"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-emerald-950 hover:bg-emerald-50 font-bold text-base shadow-xl transition-all transform active:scale-98"
            >
              Get Your Free 5-Minute Audit
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
