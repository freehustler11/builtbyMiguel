import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowRight,
  ChevronDown,
  Check,
  Star,
} from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/national-seo')({
  head: () => ({
    meta: [
      {
        title:
          'National SEO Services for Multi-Location & B2B Brands | built by Miguel',
      },
      {
        name: 'description',
        content:
          'National, multi-location, and franchise SEO for B2B and enterprise-scale brands. Direct service, no agency overhead. Free 5-minute video audit.',
      },
      {
        name: 'keywords',
        content:
          'national seo services, b2b seo services, franchise seo services, multi-location seo, enterprise seo services',
      },
      {
        property: 'og:title',
        content:
          'National SEO Services for Multi-Location & B2B Brands | built by Miguel',
      },
      {
        property: 'og:description',
        content:
          'National, multi-location, and franchise SEO for B2B and enterprise-scale brands. Direct service, no agency overhead. Free 5-minute video audit.',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:url',
        content: 'https://builtbymiguel.net/national-seo',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content:
          'National SEO Services for Multi-Location & B2B Brands | built by Miguel',
      },
      {
        name: 'twitter:description',
        content:
          'National, multi-location, and franchise SEO for B2B and enterprise-scale brands. Direct service, no agency overhead. Free 5-minute video audit.',
      },
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
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'National SEO Services for Multi-Location & B2B Brands',
          serviceType:
            'National Search Engine Optimization & B2B Search Strategy',
          provider: {
            '@type': 'ProfessionalService',
            name: 'built by Miguel',
            url: 'https://builtbymiguel.net',
          },
          description:
            'National, multi-location, and franchise SEO for B2B and enterprise-scale brands. Direct service, no agency overhead. Free 5-minute video audit.',
          url: 'https://builtbymiguel.net/national-seo',
          areaServed: 'US',
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
              name: 'National & Regional SEO',
              item: 'https://builtbymiguel.net/national-seo',
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
              name: 'How long does it take to see results from national SEO services?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'National organic campaigns usually take four to six months to show meaningful momentum. National search queries have higher competition than local terms, so high-intent commercial terms get targeted first to produce early revenue before going after broad head terms.',
              },
            },
            {
              '@type': 'Question',
              name: 'How do franchise SEO services prevent duplicate content across locations?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Duplicate content gets prevented with modular dynamic page components instead of copy-pasted location pages. Each franchisee page gets unique territory-specific project galleries, verified local owner bios, and location-specific reviews piped into schema, so search engines index and rank every location instead of just one.',
              },
            },
            {
              '@type': 'Question',
              name: 'Can a growing business compete with enterprise brands nationally?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. Enterprise brands often carry outdated code, bloated CMS platforms, and slow internal approval processes. A lean, fast, well-structured site can outrank a much bigger competitor on specific commercial terms, especially where nobody else in the space is targeting them directly.',
              },
            },
            {
              '@type': 'Question',
              name: 'How do B2B SEO services generate qualified sales pipeline?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'By targeting the specific commercial search terms procurement teams and buyers actually use, then tracking which organic pages produce signed agreements rather than just traffic. Revenue Pipeline Analytics shows exactly which content drives real pipeline instead of vanity numbers.',
              },
            },
            {
              '@type': 'Question',
              name: "What's included in the free audit?",
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'A personally recorded 5-minute video reviewing your current national search visibility, technical site structure, and where competitors are outranking you, delivered within 24 hours. There is no sales call required to get it.',
              },
            },
            {
              '@type': 'Question',
              name: 'Do you also handle local SEO for our individual branch locations?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. Local SEO & Google Maps covers Map Pack rankings for a single service area and can run alongside national work for individual branch locations.',
              },
            },
            {
              '@type': 'Question',
              name: 'How much do national SEO services cost?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Pricing depends on the number of markets, locations, or franchise territories involved, and gets scoped individually during your free audit.',
              },
            },
            {
              '@type': 'Question',
              name: 'Do you require long-term contracts?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'No. Work runs month to month with no long-term lock-in required.',
              },
            },
          ],
        }),
      },
    ],
  }),
  component: NationalSeoPage,
})

const FAQS = [
  {
    q: 'How long does it take to see results from national SEO services?',
    a: 'National organic campaigns usually take four to six months to show meaningful momentum. National search queries have higher competition than local terms, so high-intent commercial terms get targeted first to produce early revenue before going after broad head terms.',
  },
  {
    q: 'How do franchise SEO services prevent duplicate content across locations?',
    a: 'Duplicate content gets prevented with modular dynamic page components instead of copy-pasted location pages. Each franchisee page gets unique territory-specific project galleries, verified local owner bios, and location-specific reviews piped into schema, so search engines index and rank every location instead of just one.',
  },
  {
    q: 'Can a growing business compete with enterprise brands nationally?',
    a: 'Yes. Enterprise brands often carry outdated code, bloated CMS platforms, and slow internal approval processes. A lean, fast, well-structured site can outrank a much bigger competitor on specific commercial terms, especially where nobody else in the space is targeting them directly.',
  },
  {
    q: 'How do B2B SEO services generate qualified sales pipeline?',
    a: 'By targeting the specific commercial search terms procurement teams and buyers actually use, then tracking which organic pages produce signed agreements rather than just traffic. Revenue Pipeline Analytics shows exactly which content drives real pipeline instead of vanity numbers.',
  },
  {
    q: "What's included in the free audit?",
    a: 'A personally recorded 5-minute video reviewing your current national search visibility, technical site structure, and where competitors are outranking you, delivered within 24 hours. There is no sales call required to get it.',
  },
  {
    q: 'Do you also handle local SEO for our individual branch locations?',
    a: (
      <span>
        Yes.{' '}
        <Link
          to="/seo/local"
          className="text-blue-600 dark:text-blue-400 underline font-semibold hover:text-blue-700 dark:hover:text-blue-300"
        >
          Local SEO & Google Maps
        </Link>{' '}
        covers Map Pack rankings for a single service area and can run alongside national work for individual branch locations.
      </span>
    ),
  },
  {
    q: 'How much do national SEO services cost?',
    a: 'Pricing depends on the number of markets, locations, or franchise territories involved, and gets scoped individually during your free audit.',
  },
  {
    q: 'Do you require long-term contracts?',
    a: 'No. Work runs month to month with no long-term lock-in required.',
  },
]

function NationalSeoPage() {
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
                  Broad Market Search Architecture
                </span>
              </div>

              {/* H1 */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl/tight font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
                Direct National SEO Services for Multi-Location & B2B Brands
              </h1>

              {/* Subhead */}
              <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                Get national SEO built for growing multi-location brands, franchise networks, and B2B companies expanding their organic search authority nationwide. Basic local tactics fall short across state lines, so technical site structure, keyword clusters, and high-authority content get built to capture demand in every market you serve.
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
                {/* Flat vector illustration: US map with several connected location pins and an upward search-ranking graph */}
                <svg
                  viewBox="0 0 460 380"
                  className="w-full h-auto drop-shadow-sm"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  aria-label="Illustration of a US map with several connected location pins and an upward search-ranking graph"
                >
                  {/* Background container */}
                  <rect width="460" height="380" rx="20" className="fill-slate-50 dark:fill-slate-900/60" />
                  
                  {/* Subtle national grid */}
                  <path d="M 0 95 L 460 95 M 0 190 L 460 190 M 0 285 L 460 285" className="stroke-slate-200/60 dark:stroke-slate-800/60" strokeWidth="2" strokeDasharray="6 6" />
                  <path d="M 115 0 L 115 380 M 230 0 L 230 380 M 345 0 L 345 380" className="stroke-slate-200/60 dark:stroke-slate-800/60" strokeWidth="2" strokeDasharray="6 6" />

                  {/* Stylized US Map Silhouette */}
                  <path
                    d="M 50 110 
                       L 110 100 
                       L 170 105 
                       L 230 85 
                       L 310 90 
                       L 360 70 
                       L 400 95 
                       L 415 135 
                       L 380 185 
                       L 395 240 
                       L 355 275 
                       L 300 255 
                       L 255 285 
                       L 200 290 
                       L 155 255 
                       L 95 250 
                       L 45 190 
                       L 40 145 Z"
                    className="fill-blue-50/70 dark:fill-blue-950/30 stroke-blue-200/80 dark:stroke-blue-800/60"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />

                  {/* Interconnected Network Lines */}
                  <path
                    d="M 90 150 L 180 140 L 280 130 L 370 110 M 180 140 L 240 220 L 330 230 M 280 130 L 330 230 M 90 150 L 120 220 L 240 220"
                    className="stroke-blue-400/80 dark:stroke-blue-500/70"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />

                  {/* Connected Location Pins */}
                  {/* Pin 1: West (Seattle / NW) */}
                  <g transform="translate(90, 150)">
                    <circle cx="0" cy="0" r="14" className="fill-blue-100 dark:fill-blue-950 stroke-blue-500" strokeWidth="2" />
                    <circle cx="0" cy="0" r="6" className="fill-blue-600 dark:fill-blue-400" />
                  </g>

                  {/* Pin 2: Southwest (LA/Phoenix) */}
                  <g transform="translate(120, 220)">
                    <circle cx="0" cy="0" r="12" className="fill-blue-100 dark:fill-blue-950 stroke-blue-500" strokeWidth="2" />
                    <circle cx="0" cy="0" r="5" className="fill-blue-600 dark:fill-blue-400" />
                  </g>

                  {/* Pin 3: Midwest / Mountain (Denver) */}
                  <g transform="translate(180, 140)">
                    <circle cx="0" cy="0" r="13" className="fill-blue-100 dark:fill-blue-950 stroke-blue-500" strokeWidth="2" />
                    <circle cx="0" cy="0" r="5" className="fill-blue-600 dark:fill-blue-400" />
                  </g>

                  {/* Pin 4: Central / South (Texas) */}
                  <g transform="translate(240, 220)">
                    <circle cx="0" cy="0" r="14" className="fill-blue-100 dark:fill-blue-950 stroke-blue-500" strokeWidth="2" />
                    <circle cx="0" cy="0" r="6" className="fill-blue-600 dark:fill-blue-400" />
                  </g>

                  {/* Pin 5: Great Lakes (Chicago) */}
                  <g transform="translate(280, 130)">
                    <circle cx="0" cy="0" r="15" className="fill-blue-100 dark:fill-blue-950 stroke-blue-500" strokeWidth="2" />
                    <circle cx="0" cy="0" r="6" className="fill-blue-600 dark:fill-blue-400" />
                  </g>

                  {/* Pin 6: Southeast (Atlanta/Florida) */}
                  <g transform="translate(330, 230)">
                    <circle cx="0" cy="0" r="13" className="fill-blue-100 dark:fill-blue-950 stroke-blue-500" strokeWidth="2" />
                    <circle cx="0" cy="0" r="5" className="fill-blue-600 dark:fill-blue-400" />
                  </g>

                  {/* Pin 7: Northeast (NYC/Boston - Primary Hub) */}
                  <g transform="translate(370, 110)">
                    <circle cx="0" cy="0" r="18" className="fill-blue-600 dark:fill-blue-500 shadow-md" />
                    <circle cx="0" cy="0" r="8" className="fill-white" />
                  </g>

                  {/* Upward Search-Ranking Graph Overlay */}
                  <g transform="translate(45, 235)">
                    {/* Graph card backdrop */}
                    <rect width="370" height="115" rx="14" className="fill-white/95 dark:fill-slate-900/95 stroke-slate-200 dark:stroke-slate-700 shadow-lg" strokeWidth="1.5" />
                    
                    {/* Graph axes & horizontal lines */}
                    <line x1="20" y1="90" x2="350" y2="90" className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="1.5" />
                    <line x1="20" y1="58" x2="350" y2="58" className="stroke-slate-100 dark:stroke-slate-800/60" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="20" y1="26" x2="350" y2="26" className="stroke-slate-100 dark:stroke-slate-800/60" strokeWidth="1" strokeDasharray="4 4" />

                    {/* Gradient under curve */}
                    <path
                      d="M 30 85 C 80 82 120 75 160 62 C 210 46 260 48 300 28 C 325 16 335 15 345 14 L 345 90 L 30 90 Z"
                      className="fill-emerald-500/10 dark:fill-emerald-500/20"
                    />

                    {/* Upward trending search ranking line */}
                    <path
                      d="M 30 85 C 80 82 120 75 160 62 C 210 46 260 48 300 28 C 325 16 335 15 345 14"
                      className="stroke-emerald-500 dark:stroke-emerald-400"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />

                    {/* Graph points */}
                    <circle cx="30" cy="85" r="4" className="fill-emerald-500" />
                    <circle cx="160" cy="62" r="4" className="fill-emerald-500" />
                    <circle cx="260" cy="45" r="4" className="fill-emerald-500" />
                    <circle cx="345" cy="14" r="6" className="fill-emerald-500 stroke-white dark:stroke-slate-900" strokeWidth="2" />

                    {/* Badge: #1 National Rank */}
                    <g transform="translate(255, 14)">
                      <rect width="80" height="20" rx="6" className="fill-emerald-600 text-white" />
                      <path d="M 265 24 L 270 20 L 275 24" className="stroke-white" strokeWidth="1.5" strokeLinecap="round" />
                      <text x="282" y="24" className="fill-white font-mono font-bold text-[10px]">#1 RANK</text>
                    </g>
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
              How National SEO Differs From Local and AI Search
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Understanding scope prevents wasted budget. Here's how national search compares directly to the local and AI search paths.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Card 1: Local SEO & Google Maps */}
            <div className="p-7 sm:p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <span className="inline-block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                  Map Radius
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                  Local SEO & Google Maps
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  Local SEO fits one city or immediate service area. It focuses on the Google Map Pack and getting calls from nearby homeowners.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                <Link
                  to="/seo/local"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer group"
                >
                  <span>View Local SEO →</span>
                </Link>
              </div>
            </div>

            {/* Card 2: National & Regional SEO (Active/Highlighted) */}
            <div className="p-7 sm:p-8 rounded-3xl bg-blue-50/70 dark:bg-blue-950/25 border-2 border-blue-600 dark:border-blue-500 shadow-md flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-4">
                <span className="inline-block text-[11px] font-mono font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/60 px-2.5 py-1 rounded-md border border-blue-200 dark:border-blue-700">
                  This Page
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                  National & Regional SEO
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  National SEO ranks a business across many markets or the whole country. It fits businesses with no single location, B2B companies, franchises, and multi-location brands.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-blue-200/80 dark:border-blue-900/60 flex items-center text-xs sm:text-sm font-bold text-blue-700 dark:text-blue-300">
                <span>Active Service Path</span>
              </div>
            </div>

            {/* Card 3: AEO & GEO (AI Search) */}
            <div className="p-7 sm:p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <span className="inline-block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                  AI Citations
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                  AEO & GEO (AI Search)
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  AEO and GEO fits AI answer engines like ChatGPT and Perplexity. It ensures machines cite your brand as an authority.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                <Link
                  to="/aeo-geo"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer group"
                >
                  <span>View AI Search Optimization →</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Decision Framework */}
      <section className="py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-[#fafafc] dark:bg-[#0B0F17]">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
          <div className="max-w-3xl mb-12 sm:mb-16">
            {/* Eyebrow (not a heading) */}
            <p className="text-xs sm:text-sm font-semibold tracking-wide uppercase font-mono text-blue-600 dark:text-blue-400 mb-3">
              Decision Framework
            </p>
            {/* H2 */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display mb-4">
              Local vs. National, Which Do I Need?
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Choose your search scope based on how your customers sign agreements and where your staff performs work.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
            {/* Column 1 */}
            <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span>Choose Local SEO If:</span>
              </h3>
              <ul className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>You dispatch trucks to properties within a 20 to 50 mile driving radius.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Your primary goal is direct phone calls from local homeowners and property managers.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>You rely heavily on Google Maps rankings and local customer reviews.</span>
                </li>
              </ul>
            </div>

            {/* Column 2 */}
            <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-blue-500" />
                <span>Choose National SEO If:</span>
              </h3>
              <ul className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <span>You serve clients across multiple states with no single physical address.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <span>You sell specialized commercial B2B solutions or franchise opportunities.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <span>You manage multiple brick-and-mortar storefronts across the country.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Why National SEO Builds Long-Term Value (Differentiators) */}
      <section className="py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0B0F17]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
          <div className="max-w-3xl mb-12 sm:mb-16">
            {/* Eyebrow (not a heading) */}
            <p className="text-xs sm:text-sm font-semibold tracking-wide uppercase font-mono text-blue-600 dark:text-blue-400 mb-3">
              Long-Term Market Value
            </p>
            {/* H2 */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display mb-4">
              Why National SEO Services Build Long-Term Market Authority
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Broad organic search traffic builds a reliable pipeline of inbound contracts without the compounding expense of pay-per-click auctions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Card 1 */}
            <div className="p-8 sm:p-10 rounded-3xl bg-slate-50/70 dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                {/* Flat vector icon: trophy/flag planted on a search-results ranking */}
                <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                  <line x1="4" y1="22" x2="4" y2="15" />
                  <path d="M10 22h8" />
                  <path d="M14 18v4" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display">
                Defensible Keyword Ownership
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                When you rank at the top of Google for core commercial queries, you capture inbound demand before competitors even know the lead exists. This asset appreciates over time instead of expiring when ad budgets run out.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-8 sm:p-10 rounded-3xl bg-slate-50/70 dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
                {/* Flat vector icon: single connected node with no middle layers between it and a larger network */}
                <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" className="fill-blue-600/20" />
                  <circle cx="12" cy="3" r="2" />
                  <circle cx="21" cy="12" r="2" />
                  <circle cx="12" cy="21" r="2" />
                  <circle cx="3" cy="12" r="2" />
                  <line x1="12" y1="5" x2="12" y2="9" />
                  <line x1="19" y1="12" x2="15" y2="12" />
                  <line x1="12" y1="19" x2="12" y2="15" />
                  <line x1="5" y1="12" x2="9" y2="12" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display">
                Enterprise SEO Services Without Agency Overhead
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Most national marketing firms assign junior coordinators to run your account. Enterprise SEO work here is delivered directly, from analyzing the search data to building the technical page structure and writing the code.
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

      {/* SECTION 5: What You Get (Feature Grid) */}
      <section className="py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-[#fafafc] dark:bg-[#0B0F17]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
          <div className="max-w-3xl mb-12 sm:mb-16">
            {/* Eyebrow (not a heading) */}
            <p className="text-xs sm:text-sm font-semibold tracking-wide uppercase font-mono text-blue-600 dark:text-blue-400 mb-3">
              What You Get
            </p>
            {/* H2 */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display mb-4">
              Proven B2B SEO Services for High-Value Sales Cycles
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              No vanity keyword counts or empty traffic spikes. Every deliverable connects directly to revenue and qualified contract opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12">
            {/* Card 1 */}
            <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-md border border-blue-200/80 dark:border-blue-800/60">
                  Buyer Intent
                </span>
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  {/* Target with magnifying glass */}
                  <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <circle cx="11" cy="11" r="3" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display">
                Commercial Keyword Architecture
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                High-value search terms that corporate procurement heads and commercial buyers actually use when sourcing new vendors get mapped and prioritized.
              </p>
              <ul className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                  <span>Commercial intent keyword mapping for high margin services</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                  <span>Competitor content gap analysis against industry leaders</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                  <span>Topic clusters designed to capture commercial RFP traffic</span>
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-md border border-amber-200/80 dark:border-amber-800/60">
                  Performance Code
                </span>
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  {/* Lightning bolt over webpage */}
                  <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                    <polygon points="13 7 9 13 13 13 11 17 15 11 11 11 13 7" className="fill-amber-400/40" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display">
                Technical Indexing & Speed
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Large national websites fail when code bloat slows down indexing. Rendering bottlenecks get eliminated so search engines can crawl your entire catalog.
              </p>
              <ul className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                  <span>Sub-second page rendering and perfect Core Web Vitals</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                  <span>Crawl budget optimization and automated XML sitemap logic</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                  <span>Clean canonical structure to prevent internal ranking conflicts</span>
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-1 rounded-md border border-purple-200/80 dark:border-purple-800/60">
                  Domestic Reach
                </span>
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  {/* National map with radiating authority lines */}
                  <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 3a9 9 0 0 1 9 9" strokeDasharray="2 2" />
                    <path d="M3.6 9h16.8" />
                    <path d="M3.6 15h16.8" />
                    <path d="M11.5 3a17 17 0 0 0 0 18" />
                    <path d="M12.5 3a17 17 0 0 1 0 18" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display">
                National Topical Authority
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Your brand gets established as a recognized national authority through strategic topical coverage and verified digital entity associations.
              </p>
              <ul className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                  <span>Deep topical resource hubs that answer complex buyer questions</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                  <span>Schema markup mapping parent entities, services, and leadership</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                  <span>Cross-platform entity citations across trusted industry publishers</span>
                </li>
              </ul>
            </div>

            {/* Card 4 */}
            <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-200/80 dark:border-emerald-800/60">
                  Conversion Focus
                </span>
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  {/* Dashboard with rising revenue line */}
                  <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M7 16l4-4 3 3 4-6" />
                    <polyline points="15 9 18 9 18 12" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display">
                Revenue Pipeline Analytics
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Real pipeline numbers get tracked instead of vanity search rankings, so you see exactly which organic pages produce signed agreements.
              </p>
              <ul className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                  <span>Private dashboard tracking organic lead forms and calls</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                  <span>Lead source tracking to credit high-value commercial inquiries</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                  <span>Clear monthly progress reviews without technical jargon</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex justify-start">
            <Link
              to="/audit"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.99] transition-all duration-200 group"
            >
              <span>Claim Your Free National SEO Audit</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 6: Multi-Location Scale */}
      <section className="py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0B0F17]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
          <div className="max-w-3xl mb-12 sm:mb-16">
            {/* Eyebrow (not a heading) */}
            <p className="text-xs sm:text-sm font-semibold tracking-wide uppercase font-mono text-blue-600 dark:text-blue-400 mb-3">
              Multi-Branch Scale
            </p>
            {/* H2 */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display mb-4">
              Scale Locations with Precision Multi-Location SEO
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Operating in dozens or hundreds of cities requires specialized search architecture. If your location directory is unstructured, Google gets confused and refuses to rank your local branch pages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="p-8 sm:p-10 rounded-3xl bg-slate-50/70 dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                Directory Architecture
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                A clean hierarchical URL structure gets built by state, county, and city, passing domain authority from your root website down to individual location branches.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-8 sm:p-10 rounded-3xl bg-slate-50/70 dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                Cannibalization Defense
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                When branch locations operate within thirty miles of each other, they often fight for the same keywords. Strict geographic boundaries get defined so your branches never compete against one another.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-8 sm:p-10 rounded-3xl bg-slate-50/70 dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                Store Locator Integration
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Slow third-party locator widgets get replaced with crawlable server-rendered locator pages, so Google indexes every branch address and phone number instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: Franchise System Authority */}
      <section className="py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-[#fafafc] dark:bg-[#0B0F17]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
          <div className="max-w-4xl space-y-8">
            <div>
              {/* Eyebrow (not a heading) */}
              <p className="text-xs sm:text-sm font-semibold tracking-wide uppercase font-mono text-blue-600 dark:text-blue-400 mb-3">
                Franchise System Authority
              </p>
              {/* H2 */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display mb-4">
                Dominate Regional Markets with Franchise SEO Services
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                Franchise marketing has a unique challenge. The parent corporation needs to protect its national brand equity, while individual franchisees need their phones ringing in local territories. Most agencies try to solve this with copy-pasted location pages, which triggers Google duplicate content penalties.
              </p>
            </div>

            {/* Sub-section 1: Solving the Franchisee Duplicate Content Trap */}
            <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display">
                Solving the Franchisee Duplicate Content Trap
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                When fifty franchisees use identical service descriptions on their local subpages, search engines only index one of them and ignore the rest. This gets solved with modular dynamic page components. Each franchisee page features:
              </p>
              <ul className="space-y-3.5 text-sm sm:text-base text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Territory-specific project galleries and customer job stories</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Verified local owner bios and direct branch contact details</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Location-specific customer reviews piped directly into schema markup</span>
                </li>
              </ul>
            </div>

            {/* Sub-section 2: Centralized Corporate Brand Schema */}
            <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display">
                Centralized Corporate Brand Schema
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                A unified JSON-LD schema hierarchy connects the corporate headquarters entity directly to each child franchisee branch, telling Google that the local branch is backed by national authority and giving local franchisees an immediate ranking advantage over independent mom-and-pop shops.
              </p>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                You get predictable, measurable search results across all franchise territories without rogue marketing agencies diluting your national brand guidelines.
              </p>
            </div>

            <div className="pt-2">
              <Link
                to="/audit"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.99] transition-all duration-200 group"
              >
                <span>Get My Free Franchise SEO Audit</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: What Clients Say (Testimonials) */}
      <section className="py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0B0F17]">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
          <div className="max-w-3xl mb-12 sm:mb-16">
            {/* H2 */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display mb-4">
              What Clients Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
            {/* Testimonial 1 */}
            <div className="p-8 rounded-3xl bg-slate-50/70 dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  "We had twelve locations competing against each other in search instead of the actual competition. Once the geographic boundaries were sorted out, each branch started ranking on its own instead of fighting our other stores."
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800">
                <p className="font-bold text-slate-900 dark:text-white text-sm font-display">Diane</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Multi-Location Retail Brand Owner</p>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="p-8 rounded-3xl bg-slate-50/70 dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  "Our franchisees all had the same copy-pasted page and Google only indexed one of them. Getting each location its own real content and schema made a visible difference within a couple months."
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800">
                <p className="font-bold text-slate-900 dark:text-white text-sm font-display">Robert</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Franchise Development Director</p>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="p-8 rounded-3xl bg-slate-50/70 dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  "We compete for large commercial contracts, not homeowner calls, so generic SEO advice never applied to us. This was the first time the keyword strategy actually matched how our buyers search."
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800">
                <p className="font-bold text-slate-900 dark:text-white text-sm font-display">Nicole</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">B2B Industrial Equipment Company</p>
              </div>
            </div>
          </div>

          <div className="flex justify-start">
            <Link
              to="/audit"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.99] transition-all duration-200 group"
            >
              <span>See What's Blocking Your National Rankings</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 9: FAQ */}
      <section className="py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-[#fafafc] dark:bg-[#0B0F17]">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
          <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
            {/* Eyebrow (not a heading) */}
            <p className="text-xs sm:text-sm font-semibold tracking-wide uppercase font-mono text-blue-600 dark:text-blue-400 mb-3">
              Common Inquiries
            </p>
            {/* H2 */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display mb-4">
              Frequently Asked Questions About National SEO Services
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] overflow-hidden transition-all duration-200 shadow-2xs"
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
                    <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* SECTION 10: Closing CTA */}
      <section className="relative overflow-hidden py-16 sm:py-24 bg-slate-900 dark:bg-[#080C14] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 relative z-10 text-center space-y-6">
          {/* Eyebrow (not a heading) */}
          <p className="text-xs sm:text-sm font-semibold tracking-wide uppercase font-mono text-blue-400">
            Own Every Market You Serve
          </p>
          {/* H2 */}
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight font-display">
            Build Search Authority That Compounds Across Every State You Operate In
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Stop losing commercial contracts to competitors with a cleaner search presence. Start with a free 5-minute audit and see exactly where your national visibility is falling short.
          </p>
          <div className="pt-4 flex justify-center">
            <Link
              to="/audit"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-blue-600/30 hover:shadow-2xl hover:shadow-blue-600/40 active:scale-[0.99] transition-all duration-200 group"
            >
              <span>Get Your Free 5-Minute Audit</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
