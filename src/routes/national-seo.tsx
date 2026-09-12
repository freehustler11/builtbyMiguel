import { FreeAuditCTA } from '../components/FreeAuditCTA'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Globe2,
  Sparkles,
  ArrowRight,
  ChevronDown,
  Check,
  CheckCircle2,
  Layers,
  BarChart3,
  Building2,
  GitBranch,
  ShieldCheck,
  Search,
} from 'lucide-react'
import { useState } from 'react'

const NATIONAL_SEO_FAQ = [
  {
    question: 'How long does it take to see results from national seo services?',
    answer:
      'National organic campaigns usually take four to six months to show meaningful momentum. National search queries have higher competition than local terms. I target high-intent commercial terms first to produce early revenue before going after broad head terms.',
  },
  {
    question: 'How do franchise seo services prevent duplicate content across locations?',
    answer:
      'I build unique content modules for each location page rather than copying identical paragraphs. Each franchisee page features city-specific project photos, verified staff bios, local reviews, and distinct neighborhood service areas.',
  },
  {
    question: 'Can a growing business compete with enterprise brands nationally?',
    answer:
      'Yes. Enterprise brands often have slow, bloated websites and bureaucratic approval chains. I build lightweight pages that load in under a second and target specific long-tail buyer problems that big corporate competitors overlook.',
  },
  {
    question: 'How do b2b seo services generate qualified sales pipeline?',
    answer:
      'I optimize your site for executive decision makers who search for commercial problem-solving keywords rather than casual consumers. Every page directs qualified buyers into detailed consultation or proposal requests.',
  },
]

const NATIONAL_SEO_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'National SEO Services',
      serviceType: 'National Search Engine Optimization',
      provider: {
        '@type': 'LocalBusiness',
        name: 'built by Miguel',
        url: 'https://builtbymiguel.net',
      },
      description:
        'Direct national SEO services, multi location SEO, and franchise search optimization for growing brands and B2B companies across the United States.',
      areaServed: 'United States',
      isPartOf: {
        '@type': 'Service',
        name: 'SEO Services for Contractors',
        url: 'https://builtbymiguel.net/seo',
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'National SEO Deliverables',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'B2B Commercial Keyword Architecture',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Enterprise Technical Site Optimization',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Multi Location SEO Directory Structuring',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Franchise Search Authority Architecture',
            },
          },
        ],
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: NATIONAL_SEO_FAQ.map((faq) => ({
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

export const Route = createFileRoute('/national-seo')({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      {
        title: 'National SEO Services: Grow Organic Reach | built by Miguel',
      },
      {
        name: 'description',
        content:
          'I provide national seo services that help B2B and franchise brands win broad search rankings. No agency fluff. Get your free 5-minute video audit today.',
      },
      {
        name: 'keywords',
        content:
          'national seo services, national seo company, b2b seo services, enterprise seo services, seo services usa, multi location seo, franchise seo services',
      },
      // OpenGraph
      { property: 'og:type', content: 'website' },
      {
        property: 'og:title',
        content: 'National SEO Services: Grow Organic Reach | built by Miguel',
      },
      {
        property: 'og:description',
        content:
          'Scale your organic search rankings across the United States. Custom national SEO, B2B search funnels, and franchise search architecture built by Miguel.',
      },
      { property: 'og:url', content: 'https://builtbymiguel.net/national-seo' },
      { property: 'og:image', content: 'https://builtbymiguel.net/og-image.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: 'https://builtbymiguel.net/og-image.png' },
    ],
    links: [
      {
        rel: 'canonical',
        href: 'https://builtbymiguel.net/national-seo',
      },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify(NATIONAL_SEO_JSON_LD),
      },
    ],
  }),
  component: NationalSeoPage,
})

function NationalSeoPage() {
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
            <Globe2 className="w-3.5 h-3.5" /> Broad Market Search Architecture
          </div>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.12] mb-6 sm:mb-8">
          Direct{' '}
          <span className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 bg-clip-text text-transparent">
            National SEO Services
          </span>{' '}
          for Multi Location & B2B Brands.
        </h1>

        <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto font-normal">
          I provide national seo services for growing businesses that need organic search rankings across multiple states or the entire country. If your company sells business services, manufactures products, or operates multiple branches, broad search visibility is how you win high-value contracts. Traditional marketing agencies charge big monthly retainers for generic templates and confusing reports. As an independent national seo company, I build custom search architecture that puts your brand in front of qualified buyers nationwide.
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

      {/* SIBLING DIFFERENCE SECTION */}
      <section className="rounded-3xl sm:rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-8 sm:p-12 space-y-8">
        <div className="space-y-3 max-w-2xl">
          <div className="text-[11px] font-mono uppercase tracking-widest text-rose-600 dark:text-rose-400 font-bold">
            Search Strategy Differences
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            How National SEO Differs From Local and AI Search
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            Understanding scope prevents wasted budget. Here is how national search compares directly to my local and AI search campaigns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 space-y-3">
            <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 uppercase">MAP RADIUS</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Local SEO & Google Maps</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Local SEO fits one city or immediate service area. It focuses on the Google Map Pack and getting calls from nearby homeowners.
            </p>
            <Link
              to="/local-seo-gbp"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline pt-1"
            >
              <span>View Local SEO</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border-2 border-rose-500/30 dark:border-rose-500/30 space-y-3">
            <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 uppercase">THIS PAGE</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">National & Regional SEO</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              National SEO ranks a business across many markets or the whole country. It fits businesses with no single location, B2B companies, franchises, and multi location brands.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 space-y-3">
            <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 uppercase">AI CITATIONS</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">AEO & GEO (AI Search)</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              AEO and GEO fits AI answer engines like ChatGPT and Perplexity. It ensures machines cite your brand as an authority.
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

      {/* COMPARISON BLOCK: LOCAL VS NATIONAL */}
      <section className="space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-[11px] font-mono uppercase tracking-widest text-rose-600 dark:text-rose-400 font-bold">
            Decision Framework
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Local vs National, Which Do I Need?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Choose your search scope based on how your customers sign agreements and where your staff performs work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Choose Local SEO If:</h3>
            </div>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>You dispatch trucks to properties within a 20 to 50 mile driving radius.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>Your primary goal is direct phone calls from local homeowners and property managers.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>You rely heavily on Google Maps rankings and local customer reviews.</span>
              </li>
            </ul>
          </div>

          <div className="p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-800/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Globe2 className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Choose National SEO If:</h3>
            </div>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <span>You serve clients across multiple states with no single physical address.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <span>You sell specialized commercial B2B solutions or franchise opportunities.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <span>You manage multiple brick-and-mortar storefronts across the country.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* WHY NATIONAL SEO SERVICES BUILD AUTHORITY */}
      <section className="space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-[11px] font-mono uppercase tracking-widest text-rose-600 dark:text-rose-400 font-bold">
            Long Term Market Value
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            Why National SEO Services Build Long Term Market Authority
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Broad organic search traffic builds a reliable pipeline of inbound contracts without the compounding expense of pay-per-click auctions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-800/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Defensible Keyword Ownership
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              When you rank at the top of Google for core commercial queries, you capture inbound demand before competitors even know the lead exists. This asset appreciates over time instead of expiring when ad budgets run out.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] space-y-4">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-800/40 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Enterprise SEO Services Without Agency Overhead
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Most national marketing firms assign junior coordinators to run your account. I deliver enterprise seo services directly. I analyze the search data, build the technical page structure, and write the code myself.
            </p>
          </div>
        </div>
      </section>

      {/* 4 DELIVERABLES WHITE CARDS (MATCHING LOCAL SEO STYLE) */}
      <section className="space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-[11px] font-mono uppercase tracking-widest text-rose-600 dark:text-rose-400 font-bold">
            What You Get
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            Proven B2B SEO Services for High-Value Sales Cycles
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            No vanity keyword counts or empty traffic spikes. Every deliverable connects directly to revenue and qualified contract opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-blue-500/40 dark:hover:border-blue-500/50 hover:shadow-xl transition-all space-y-5 shadow-sm dark:shadow-none">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-800/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Search className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="space-y-2">
              <div className="text-[10px] font-mono font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase">
                BUYER INTENT
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Commercial Keyword Architecture
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                I map the exact high-value search terms corporate procurement heads and commercial buyers use when sourcing new vendors.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium pt-2 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>Commercial intent keyword mapping for high margin services</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>Competitor content gap analysis against industry leaders</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>Topic clusters designed to capture commercial RFP traffic</span>
              </li>
            </ul>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-emerald-500/40 dark:hover:border-emerald-500/50 hover:shadow-xl transition-all space-y-5 shadow-sm dark:shadow-none">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Layers className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="space-y-2">
              <div className="text-[10px] font-mono font-bold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">
                PERFORMANCE CODE
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Technical Indexing & Speed
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Large national websites fail when code bloat slows down indexing. I eliminate rendering bottlenecks so search engines crawl your entire catalog.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium pt-2 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Sub-second page rendering and perfect core web vitals</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Crawl budget optimization and automated XML sitemap logic</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Clean canonical structure to prevent internal ranking conflicts</span>
              </li>
            </ul>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-purple-500/40 dark:hover:border-purple-500/50 hover:shadow-xl transition-all space-y-5 shadow-sm dark:shadow-none">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-800/40 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Globe2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="space-y-2">
              <div className="text-[10px] font-mono font-bold tracking-widest text-purple-600 dark:text-purple-400 uppercase">
                DOMESTIC REACH
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                SEO Services USA Authority
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                I establish your brand as a recognized national authority through strategic topical coverage and verified digital entity associations.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium pt-2 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                <span>Deep topical resource hubs that answer complex buyer questions</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                <span>Schema markup mapping parent entities, services, and leadership</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                <span>Cross-platform entity citations across trusted industry publishers</span>
              </li>
            </ul>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-amber-500/40 dark:hover:border-amber-500/50 hover:shadow-xl transition-all space-y-5 shadow-sm dark:shadow-none">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-800/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="space-y-2">
              <div className="text-[10px] font-mono font-bold tracking-widest text-amber-600 dark:text-amber-400 uppercase">
                CONVERSION FOCUS
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Revenue Pipeline Analytics
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                I track real pipeline numbers instead of vanity search rankings. You see exactly which organic pages produce signed agreements.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium pt-2 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Private dashboard tracking organic lead forms and calls</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Lead source tracking to credit high-value commercial inquiries</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Clear monthly progress reviews without technical jargon</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* DEEP DIVE 1: MULTI LOCATION SEO */}
      <section className="rounded-3xl sm:rounded-[3rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-8 sm:p-14 space-y-8">
        <div className="max-w-3xl space-y-3">
          <div className="text-[11px] font-mono uppercase tracking-widest text-rose-600 dark:text-rose-400 font-bold flex items-center gap-2">
            <Building2 className="w-4 h-4" /> Multi Branch Scale
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Scale Locations with Precision Multi Location SEO
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            Operating in dozens or hundreds of cities requires specialized search architecture. If your location directory is unstructured, Google will get confused and refuse to rank your local branch pages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 space-y-3">
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Directory Architecture</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              I build a clean hierarchical URL structure by state, county, and city. This passes domain authority from your root website down to individual location branches.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 space-y-3">
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Cannibalization Defense</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              When branch locations operate within thirty miles of each other, they often fight for the same keywords. I define strict geographic boundaries so your branches never compete against one another.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 space-y-3">
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Store Locator Integration</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              I replace slow third-party locator widgets with crawlable server-rendered locator pages. Google indexes every branch address and phone number instantly.
            </p>
          </div>
        </div>
      </section>

      {/* DEEP DIVE 2: FRANCHISE SEO SERVICES (REAL HIGH-VALUE COVERAGE) */}
      <section className="rounded-3xl sm:rounded-[3rem] border-2 border-rose-500/20 bg-gradient-to-b from-rose-50/20 via-white to-white dark:from-rose-950/10 dark:via-[#111827] dark:to-[#111827] p-8 sm:p-14 space-y-8">
        <div className="max-w-3xl space-y-3">
          <div className="text-[11px] font-mono uppercase tracking-widest text-rose-600 dark:text-rose-400 font-bold flex items-center gap-2">
            <GitBranch className="w-4 h-4" /> Franchise System Authority
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Dominate Regional Markets with Franchise SEO Services
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            Franchise marketing has a unique challenge. The parent corporation needs to protect its national brand equity, while individual franchisees need their phones ringing in local territories. Most agencies try to solve this with copy-pasted location pages, which triggers Google duplicate content penalties.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Solving the Franchisee Duplicate Content Trap
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              When fifty franchisees use identical service descriptions on their local subpages, search engines only index one of them and ignore the rest. I solve this by creating modular dynamic page components. Each franchisee page features:
            </p>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                <span>Territory-specific project galleries and customer job stories</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                <span>Verified local owner bios and direct branch contact details</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                <span>Location-specific customer reviews piped directly into schema markup</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Centralized Corporate Brand Schema
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              I build a unified JSON-LD schema hierarchy connecting the corporate headquarters entity directly to each child franchisee branch. This tells Google that the local branch is backed by national authority, giving your local franchisees an immediate ranking advantage over independent mom-and-pop shops.
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              You get predictable, measurable search results across all franchise territories without rogue marketing agencies diluting your national brand guidelines.
            </p>
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
            Frequently Asked Questions About National SEO Services
          </h2>
        </div>

        <div className="space-y-4">
          {NATIONAL_SEO_FAQ.map((faq, index) => {
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
      <FreeAuditCTA variant="national-seo" />
    </div>
  )
}
