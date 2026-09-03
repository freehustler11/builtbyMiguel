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
} from 'lucide-react'
import { useState } from 'react'

const LOCAL_SEO_FAQ = [
  {
    question: 'How long does it take to see results from Local SEO?',
    answer:
      'Most local service businesses begin seeing measurable ranking movement and search impression growth within 30 to 60 days. Building dominant local visibility is a compounding process that strengthens with consistent citation building, genuine review generation, and geographic relevance.',
  },
  {
    question: 'What is AI Search Engine Citation optimization (ChatGPT, Perplexity, Gemini)?',
    answer:
      'AI search engines pull answers from structured entity graphs, local schema, and consistent cross-platform NAP data. We engineer your website with semantic JSON-LD entity markup and verified citation nodes so AI bots cite your business as the authoritative local recommendation.',
  },
  {
    question: 'What is the difference between the Month 1 Setup and the Monthly Retainer?',
    answer:
      'Month 1 is a comprehensive foundation overhaul: category audit, deep duplicate NAP cleanup across 50+ directories, Google Business Profile restructuring, and review funnel deployment. The Monthly Retainer covers ongoing geo-content updates, rank tracking across grid coordinates, photo updates, and continuous review generation.',
  },
  {
    question: 'Do I get access to live ranking reports and heatmaps?',
    answer:
      'Yes. You receive access to your private client portal on app.builtbymiguel.com, featuring live geo-grid heatmaps showing your exact ranking position across your local service area.',
  },
]

const LOCAL_SEO_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'Local SEO & Google Business Profile Optimization',
      provider: {
        '@type': 'LocalBusiness',
        name: 'Built by Miguel',
        url: 'https://builtbymiguel.com',
      },
      description:
        'Systematic Google Map Pack optimization, local citation cleanup, automated 5-star customer reviews, and local entity data for AI search engines.',
      areaServed: 'United States',
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
        title:
          'Local SEO & Google Business Profile Optimization | Built by Miguel',
      },
      {
        name: 'description',
        content:
          'Systematic Google Map Pack optimization and AI search engine visibility (ChatGPT, Perplexity). Complete local SEO retainers and NAP citation cleanup.',
      },
      {
        name: 'keywords',
        content:
          'local seo services, google business profile optimization, rank in google map pack, ai search citations, local citation cleaning, google map ranking',
      },
      // OpenGraph
      { property: 'og:type', content: 'website' },
      {
        property: 'og:title',
        content:
          'Local SEO & Google Business Profile Optimization | Built by Miguel',
      },
      {
        property: 'og:description',
        content:
          'Turn Google Maps into a steady source of inbound customers with verified GBP setup, AI search entity architecture, and review workflows.',
      },
      { property: 'og:url', content: 'https://builtbymiguel.com/local-seo-gbp' },
      { property: 'og:image', content: 'https://builtbymiguel.com/og-image.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: 'https://builtbymiguel.com/og-image.png' },
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

        <div className="mb-8 sm:mb-10 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-rose-600 dark:text-rose-400 shadow-sm">
            <MapPin className="w-3.5 h-3.5" /> High-Intent Search Acquisition
          </div>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.12] mb-6 sm:mb-8">
          Turn Google Maps into a{' '}
          <span className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 bg-clip-text text-transparent">
            Steady Inbound Channel.
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto font-normal">
          High-intent local searches happen on Google Maps every day. We execute surgical GBP entity optimization, clean citations across 50+ directories, and establish automated review workflows so your business builds durable local search equity.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 sm:pt-10">
          <Link
            to="/audit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-base text-white bg-slate-900 dark:bg-rose-600 hover:bg-black dark:hover:bg-rose-500 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 active:scale-95"
          >
            <Sparkles className="w-5 h-5 text-rose-400 dark:text-white fill-rose-400 dark:fill-white" />
            <span>Claim Your Free 5-Min Video Audit</span>
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

      {/* 4 DELIVERABLES WHITE CARDS */}
      <section className="space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-[11px] font-mono uppercase tracking-widest text-rose-600 dark:text-rose-400 font-bold">
            Deliverables
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            How We Elevate Your Local Presence
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            No vague retainer hours or useless vanity metrics. Every deliverable is tied directly to rank elevation and inbound phone calls.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-emerald-500/40 dark:hover:border-emerald-500/50 hover:shadow-xl transition-all space-y-5 shadow-sm dark:shadow-none">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Search className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <div className="text-[10px] font-mono font-bold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">
                MAP PACK AUTHORITY
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Google Business Profile Optimization
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Complete re-architecture of your Google Business Profile categories, secondary attributes, geo-tagged photo pipelines, and service area radiuses to maximize rank authority.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium pt-2 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Primary & secondary category gap analysis</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Geo-targeted localized service landing pages</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Grid coordinate heatmap rank tracking</span>
              </li>
            </ul>
          </div>

          <div className="p-8 rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-cyan-500/40 dark:hover:border-cyan-500/50 hover:shadow-xl transition-all space-y-5 shadow-sm dark:shadow-none">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-100 dark:border-cyan-800/40 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <Bot className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <div className="text-[10px] font-mono font-bold tracking-widest text-cyan-600 dark:text-cyan-400 uppercase">
                AI ENTITY GRAPHS
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                AI Search Citations (ChatGPT, Gemini, Perplexity)
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Future-proof your local discovery. We inject advanced schema markup, Wikidata entities, and brand authority signals so AI chatbots recommend you first.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium pt-2 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>Semantic LocalBusiness & Schema.org JSON-LD</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>Entity graph clustering for generative engine search</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>Perplexity & ChatGPT local brand indexing</span>
              </li>
            </ul>
          </div>

          <div className="p-8 rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-indigo-500/40 dark:hover:border-indigo-500/50 hover:shadow-xl transition-all space-y-5 shadow-sm dark:shadow-none">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Layers className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <div className="text-[10px] font-mono font-bold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase">
                CLEAN DIRECTORY SIGNALS
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Local Citation Cleaning & NAP Consistency
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Inconsistent names, old phone numbers, and duplicate addresses destroy ranking trust. We clean and synchronize your business across 50+ high-tier local directories.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium pt-2 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>100% NAP (Name, Address, Phone) consistency guarantee</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>Aggressive duplicate directory suppression</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>Tier-1 syndication (Yelp, Apple Maps, Bing, BBB)</span>
              </li>
            </ul>
          </div>

          <div className="p-8 rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-orange-500/40 dark:hover:border-orange-500/50 hover:shadow-xl transition-all space-y-5 shadow-sm dark:shadow-none">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-100 dark:border-orange-800/40 flex items-center justify-center text-orange-600 dark:text-orange-400">
              <Star className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <div className="text-[10px] font-mono font-bold tracking-widest text-orange-600 dark:text-orange-400 uppercase">
                SOCIAL PROOF AUTOMATION
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Review Acceleration Funnel
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Turn happy customers into 5-star Google reviews on autopilot. We deploy automated SMS/email triggers that ask for feedback right after service completion.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium pt-2 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
                <span>1-click direct Google review shortlinks</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
                <span>Keyword-rich review response templates</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
                <span>Negative feedback routing before public posting</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* COMPARISON GRID */}
      <section className="space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-[11px] font-mono uppercase tracking-widest text-rose-600 dark:text-rose-400 font-bold">
            Clear Transparency
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Month 1 Setup vs. Monthly Retainer
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Everything we do is clearly documented. No guesswork, no hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-8 space-y-6 shadow-sm dark:shadow-none">
            <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                PHASE 1
              </span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Month 1: Foundation Sprint</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Total cleanup and baseline authority build</p>
            </div>
            <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>Full Google Business Profile audit & category restructuring</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>50+ directory citation audit & duplicate removal</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>Installation of Schema.org JSON-LD LocalBusiness markup</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>Setup of automated customer review capture funnel</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>Baseline geo-grid rank mapping and competitor benchmarks</span>
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
              <p className="text-xs text-slate-500 dark:text-slate-400">Continuous rank elevation and territory defense</p>
            </div>
            <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>Weekly geo-signal photo updates & geotag enrichment</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>Ongoing review generation follow-ups & keyword replies</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>Monthly localized content expansion & service area pages</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>Live grid ranking updates in your client portal dashboard</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>Monthly executive performance review & competitor defense</span>
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
            Local SEO & Map Pack FAQs
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
      <section className="rounded-[3rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-8 sm:p-16 text-center shadow-xl dark:shadow-none relative overflow-hidden transition-colors duration-200">
        <div className="mb-6 sm:mb-8 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-rose-600 dark:text-rose-400 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" /> Free Market Intelligence
          </div>
        </div>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white tracking-tight max-w-2xl mx-auto leading-[1.15] mb-5 sm:mb-6">
          See Exactly Where Your Business Ranks in Your City Today
        </h2>

        <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-xl mx-auto leading-relaxed font-normal mb-8 sm:mb-10">
          Request a free 5-minute video audit. I will pull live geo-grid heatmaps of your primary services and point out the low-hanging fruit to beat your competitors.
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
