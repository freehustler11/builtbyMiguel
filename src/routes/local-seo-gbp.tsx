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
    question: 'How long does it take to rank in Google Map Pack Top 3?',
    answer:
      'Most local service businesses begin seeing measurable movement within 30 to 60 days. Highly competitive metropolitan areas or multi-location setups typically achieve full top 3 dominance in 3 to 5 months of consistent citation building, review acceleration, and geo-signal optimization.',
  },
  {
    question: 'What is AI Search Engine Citation optimization (ChatGPT, Perplexity, Gemini)?',
    answer:
      'AI search engines pull answers from structured entity graphs, local schema, and consistent cross-platform NAP data. We engineer your website with semantic JSON-LD entity markup and verified citation nodes so AI bots cite your business as the authoritative local recommendation.',
  },
  {
    question: 'What is the difference between the Month 1 Setup and the Monthly Retainer?',
    answer:
      'Month 1 is a comprehensive foundation overhaul: category audit, deep duplicate NAP cleanup across 50+ directories, Google Business Profile restructuring, and review funnel deployment. The Monthly Retainer covers ongoing geo-content updates, rank tracking across grid coordinates, photo geotagging, and continuous review generation.',
  },
  {
    question: 'Do I get access to live ranking reports and heatmaps?',
    answer:
      'Yes. You receive access to your private client portal on app.builtbymiguel.com, featuring live geo-grid heatmaps showing your exact ranking position down to the neighborhood and street block.',
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
        'Dominate the Google Map Pack top 3, clean local citations, accelerate 5-star customer reviews, and optimize local entity data for AI search engines.',
      areaServed: 'United States',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Local SEO Services',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Google Map Pack Top 3 Optimization',
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
          'Local SEO & Google Business Profile Management | Built by Miguel',
      },
      {
        name: 'description',
        content:
          'Rank in the Google Map Pack Top 3 and get cited by AI search engines (ChatGPT, Perplexity). Complete local SEO retainers and NAP citation cleanup.',
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
          'Turn Google Maps into your #1 inbound customer channel. Top 3 Map Pack rankings, AI search entity setup, and review acceleration.',
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
    <div className="space-y-24 sm:space-y-32 py-6 sm:py-10">
      {/* HERO SECTION */}
      <section className="relative text-center max-w-4xl mx-auto space-y-8">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <MapPin className="w-3.5 h-3.5" /> High-Intent Search Acquisition
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
          Turn Google Maps into Your{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            #1 Source of Inbound Customers.
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
          Over 70% of high-ticket local service calls go to the top 3 spots in the Google Map Pack. We execute surgical entity optimization, clean citations, and AI search indexing so you dominate your local territory.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            to="/audit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-base text-slate-950 bg-emerald-500 hover:bg-emerald-400 shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-200 active:scale-95"
          >
            <Sparkles className="w-5 h-5 fill-slate-950" />
            <span>Claim Your Free 5-Min Video Audit</span>
          </Link>

          <Link
            to="/work"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-base text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-800 transition-all duration-200"
          >
            <span>View Client Case Studies</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 4 DELIVERABLES CARDS */}
      <section className="space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
            Deliverables
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How We Get You in the Top 3
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            No vague retainer hours or useless vanity metrics. Every deliverable is tied directly to rank elevation and inbound phone calls.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900/90 transition-all space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Search className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">
                Google Map Pack Top 3 Optimization
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Complete re-architecture of your Google Business Profile categories, secondary attributes, geo-tagged photo pipelines, and service area radiuses to maximize rank authority.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 font-medium pt-2 border-t border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Primary & secondary category gap analysis</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Geo-targeted localized service landing pages</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Grid coordinate heatmap rank tracking</span>
              </li>
            </ul>
          </div>

          <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900/90 transition-all space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Bot className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">
                AI Search Citations (ChatGPT, Gemini, Perplexity)
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Future-proof your local discovery. We inject advanced schema markup, Wikidata entities, and brand authority signals so AI chatbots recommend you first.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 font-medium pt-2 border-t border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Semantic LocalBusiness & Schema.org JSON-LD</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Entity graph clustering for generative engine search</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Perplexity & ChatGPT local brand indexing</span>
              </li>
            </ul>
          </div>

          <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900/90 transition-all space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Layers className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">
                Local Citation Cleaning & NAP Consistency
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Inconsistent names, old phone numbers, and duplicate addresses destroy ranking trust. We clean and synchronize your business across 50+ high-tier local directories.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 font-medium pt-2 border-t border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>100% NAP (Name, Address, Phone) consistency guarantee</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Aggressive duplicate directory suppression</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Tier-1 syndication (Yelp, Apple Maps, Bing, BBB)</span>
              </li>
            </ul>
          </div>

          <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900/90 transition-all space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Star className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">
                Review Acceleration Funnel
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Turn happy customers into 5-star Google reviews on autopilot. We deploy automated SMS/email triggers that ask for feedback right after service completion.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 font-medium pt-2 border-t border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>1-click direct Google review shortlinks</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Keyword-rich review response templates</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Negative feedback routing before public posting</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* COMPARISON GRID */}
      <section className="space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
            Clear Transparency
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Month 1 Setup vs. Monthly Retainer
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Everything we do is clearly documented. No guesswork, no hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 space-y-6">
            <div className="space-y-2 border-b border-slate-800 pb-4">
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold">
                PHASE 1
              </span>
              <h3 className="text-2xl font-bold text-white">Month 1: Foundation Sprint</h3>
              <p className="text-xs text-slate-400">Total cleanup and baseline authority build</p>
            </div>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Full Google Business Profile audit & category restructuring</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>50+ directory citation audit & duplicate removal</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Installation of Schema.org JSON-LD LocalBusiness markup</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Setup of automated customer review capture funnel</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Baseline geo-grid rank mapping and competitor benchmarks</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-slate-900 to-slate-950 p-8 space-y-6 shadow-2xl relative">
            <div className="space-y-2 border-b border-slate-800 pb-4">
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 font-semibold">
                PHASE 2 & BEYOND
              </span>
              <h3 className="text-2xl font-bold text-white">Monthly Growth Retainer</h3>
              <p className="text-xs text-slate-400">Continuous rank elevation and defense</p>
            </div>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Weekly geo-signal photo updates & geotag enrichment</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Ongoing review generation follow-ups & keyword replies</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Monthly localized content expansion & service area pages</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Live grid ranking updates in your client portal dashboard</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Monthly executive performance review & competitor defense</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ ACCORDION */}
      <section className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Local SEO & Map Pack FAQs
          </h2>
        </div>

        <div className="space-y-4">
          {LOCAL_SEO_FAQ.map((faq, index) => {
            const isOpen = openFaqIndex === index
            return (
              <div
                key={faq.question}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left text-base font-semibold text-white hover:text-emerald-300 transition-colors focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-emerald-400' : ''
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
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <Sparkles className="w-3.5 h-3.5" /> Free Market Intelligence
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight max-w-2xl mx-auto">
          See exactly where your business ranks in your city today
        </h2>

        <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Request a free 5-minute video audit. I will pull live geo-grid heatmaps of your primary services and point out the low-hanging fruit to beat your competitors.
        </p>

        <div className="pt-2">
          <Link
            to="/audit"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base text-slate-950 bg-emerald-500 hover:bg-emerald-400 shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all active:scale-95"
          >
            <Sparkles className="w-5 h-5 fill-slate-950" />
            <span>Claim Your Free 5-Min Video Audit</span>
          </Link>
        </div>
      </section>
    </div>
  )
}
