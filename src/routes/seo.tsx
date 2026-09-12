import { FreeAuditCTA } from '../components/FreeAuditCTA'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Search,
  MapPin,
  Globe2,
  Bot,
  Sparkles,
  ArrowRight,
  ChevronDown,
  CheckCircle2,
  ShieldCheck,
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
      'Most contractors see ranking improvements within 60 to 90 days. Local map rankings usually move first as I clean up your listings and profile data. Competitive organic terms follow as I build out your service pages.',
  },
  {
    question: 'How is working with an independent seo consultant different from hiring an agency?',
    answer:
      'You communicate directly with me on every update. Traditional agencies hand your account off to an inexperienced coordinator while charging you for overhead. I inspect the search data, write the technical code, and optimize your pages myself.',
  },
  {
    question: 'Do you require long term contracts or high upfront commitments?',
    answer:
      'No. I work on straightforward month to month agreements. You stay because your phone rings with qualified jobs, not because you signed a restrictive annual contract.',
  },
]

const CONTRACTOR_SEO_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'SEO Services for Contractors',
      serviceType: 'Search Engine Optimization',
      provider: {
        '@type': 'LocalBusiness',
        name: 'built by Miguel',
        url: 'https://builtbymiguel.net',
      },
      description:
        'Direct search engine optimization and local search visibility services for trade contractors across the United States.',
      areaServed: 'United States',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Contractor SEO Paths',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Local SEO & Google Business Profile Optimization',
              url: 'https://builtbymiguel.net/local-seo-gbp',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'National SEO & Organic Authority',
              url: 'https://builtbymiguel.net/national-seo',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'AEO & GEO Search Optimization',
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
        title: 'SEO Services for Contractors: Rank & Win | built by Miguel',
      },
      {
        name: 'description',
        content:
          'I provide direct SEO services for contractors who need real customer calls. No agency fluff or vanity metrics. Get your free 5-minute video audit today.',
      },
      {
        name: 'keywords',
        content:
          'seo services for contractors, seo company, small business seo, seo consultant, contractor marketing, trade contractor search rankings',
      },
      // OpenGraph
      { property: 'og:type', content: 'website' },
      {
        property: 'og:title',
        content: 'SEO Services for Contractors: Rank & Win | built by Miguel',
      },
      {
        property: 'og:description',
        content:
          'Direct SEO services for trade contractors who need real phone calls. Work directly with an engineer who optimizes your rankings without agency fluff.',
      },
      { property: 'og:url', content: 'https://builtbymiguel.net/seo' },
      { property: 'og:image', content: 'https://builtbymiguel.net/og-image.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
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
    <div className="space-y-24 sm:space-y-32 lg:space-y-36 py-6 sm:py-10">
      {/* HERO SECTION */}
      <section className="relative text-center max-w-4xl mx-auto">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-rose-200/30 via-orange-100/30 to-teal-100/30 dark:from-rose-500/10 dark:via-orange-500/10 dark:to-teal-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

        <div className="mb-8 sm:mb-10 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-rose-600 dark:text-rose-400 shadow-sm">
            <Search className="w-3.5 h-3.5" /> Search Visibility Architecture
          </div>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.12] mb-6 sm:mb-8">
          Direct{' '}
          <span className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 bg-clip-text text-transparent">
            SEO Services for Contractors
          </span>{' '}
          Who Want Real Calls.
        </h1>

        <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto font-normal">
          I provide direct seo services for contractors who want steady customer calls without paying heavy agency markups. Whether you run a local roofing company or a regional trade business, you work with me alone. Traditional marketing agencies charge big monthly retainers for cookie cutter templates and vanity metric reports. As an independent seo consultant, I focus on the technical search work that actually rings your phone.
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

      {/* 3 CHILD PATHS GRID */}
      <section className="space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-[11px] font-mono uppercase tracking-widest text-rose-600 dark:text-rose-400 font-bold">
            Category Architecture
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            Three Clear Paths From an Independent SEO Company
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Search engine optimization is not one single tactic. I break down search into three distinct paths based on how your customers look for help.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Local SEO */}
          <div className="p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-emerald-500/40 dark:hover:border-emerald-500/50 hover:shadow-xl transition-all flex flex-col justify-between space-y-6 shadow-sm dark:shadow-none">
            <div className="space-y-5">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="space-y-2">
                <div className="text-[10px] font-mono font-bold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">
                  LOCAL SERVICE RADIUS
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Local SEO & Google Maps
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Rank in the Google Map Pack and secure top local spots when nearby property owners need emergency repairs or scheduled installations.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                <p className="font-semibold text-slate-900 dark:text-white">Who it is for:</p>
                <p>
                  Plumbers, HVAC contractors, electricians, and roofers serving a specific town, metro area, or twenty mile driving radius.
                </p>
              </div>
            </div>

            <Link
              to="/local-seo-gbp"
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 pt-4"
            >
              <span>Explore Local SEO & Map Pack</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 2: National SEO */}
          <div className="p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-blue-500/40 dark:hover:border-blue-500/50 hover:shadow-xl transition-all flex flex-col justify-between space-y-6 shadow-sm dark:shadow-none">
            <div className="space-y-5">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-800/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Globe2 className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="space-y-2">
                <div className="text-[10px] font-mono font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase">
                  BROAD REACH AUTHORITY
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  National & Regional SEO
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Rank across entire states or across the country for specialized commercial contracting terms and high value industrial projects.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                <p className="font-semibold text-slate-900 dark:text-white">Who it is for:</p>
                <p>
                  Commercial builders, custom metal fabricators, and trade equipment installers who take contracts across multiple state lines.
                </p>
              </div>
            </div>

            <Link
              to="/national-seo"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 pt-4"
            >
              <span>Explore National SEO</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 3: AEO & GEO */}
          <div className="p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-purple-500/40 dark:hover:border-purple-500/50 hover:shadow-xl transition-all flex flex-col justify-between space-y-6 shadow-sm dark:shadow-none">
            <div className="space-y-5">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-800/40 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="space-y-2">
                <div className="text-[10px] font-mono font-bold tracking-widest text-purple-600 dark:text-purple-400 uppercase">
                  AI SEARCH CITATIONS
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  AEO & GEO Optimization
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Structure your company entity data so artificial intelligence engines cite your business directly when homeowners ask for recommendations.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                <p className="font-semibold text-slate-900 dark:text-white">Who it is for:</p>
                <p>
                  Modern trade contractors who want to lead their market as buyers use conversational tools like ChatGPT and Perplexity to hire help.
                </p>
              </div>
            </div>

            <Link
              to="/aeo-geo"
              className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 pt-4"
            >
              <span>Explore AI Search & GEO</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* VALUE PILLARS & REVENUE FOCUS */}
      <section className="space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-[11px] font-mono uppercase tracking-widest text-rose-600 dark:text-rose-400 font-bold">
            Engineering Advantage
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            Why My SEO Services for Contractors Focus on Revenue
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            I do not build vanity reports with meaningless impression spikes. I fix the core technical issues that keep you off the first page of Google.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] space-y-4">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-800/40 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Direct Access to the Builder
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              When you hire a typical marketing firm, your project goes through multiple layers of account managers. I handle your search plan personally. You get fast answers, direct communication, and technical work executed without delays.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] space-y-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-800/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              No Cookie Cutter Page Templates
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Most agency websites use bloated site builders that load slow on smartphones. I build lightweight pages that load instantly and meet Google core web standards so your visitors stay on the page and call your business.
            </p>
          </div>
        </div>
      </section>

      {/* METHODOLOGY: SMALL BUSINESS SEO */}
      <section className="rounded-3xl sm:rounded-[3rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-8 sm:p-12 space-y-8">
        <div className="space-y-3 max-w-2xl">
          <div className="text-[11px] font-mono uppercase tracking-widest text-rose-600 dark:text-rose-400 font-bold">
            Execution Roadmap
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            How Small Business SEO Works When You Work With Me
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            I follow a proven four step method to turn Google searches into booked contractor appointments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 space-y-2">
            <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">STEP 01</span>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Audit & Diagnosis</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              I audit your current rankings, your Google business profile, and your competitors to find what is blocking your calls.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 space-y-2">
            <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">STEP 02</span>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Technical Cleanup</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              I fix your business listings, remove broken code, improve page speed, and add structured schema markup.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 space-y-2">
            <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">STEP 03</span>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Service Pages</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              I build dedicated pages for each trade service and city you want jobs in so Google knows exactly what you offer.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 space-y-2">
            <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">STEP 04</span>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Reputation Growth</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              I set up automated review workflows that prompt your happy customers to leave 5-star ratings on Google.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ ACCORDION */}
      <section className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="text-[11px] font-mono uppercase tracking-widest text-rose-600 dark:text-rose-400 font-bold">
            Common Inquiries
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions About My Contractor SEO Services
          </h2>
        </div>

        <div className="space-y-4">
          {CONTRACTOR_SEO_FAQ.map((faq, index) => {
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
      <FreeAuditCTA variant="default" />
    </div>
  )
}
