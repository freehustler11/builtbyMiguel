import { FreeWebsiteDemoCTA } from '../components/FreeWebsiteDemoCTA'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Sparkles,
  ArrowRight,
  ChevronDown,
  Check,
  X,
  Code2,
  Smartphone,
  Zap,
  Server,
  ShieldCheck,
  Layers,
  Flame,
  LayoutTemplate,
  Activity,
} from 'lucide-react'
import { useState } from 'react'

const WEBSITE_DESIGN_FAQ = [
  {
    question: 'How long does a custom website build or redesign take?',
    answer:
      'Most custom website builds and redesigns take two to three weeks from start to launch. Because you work directly with me without account managers or junior designers in between, we move fast and avoid endless revision cycles.',
  },
  {
    question: 'Do I need a brand new website or just a redesign of my existing site?',
    answer:
      'If your current domain has established domain history and rankings, a redesign preserves your URL structures and search equity while replacing slow page templates with fast code. If you are starting fresh, a new build gives you a clean foundation from day one.',
  },
  {
    question: 'Do you use WordPress, Wix, or page builders like Elementor?',
    answer:
      'No. I build every site using modern React and clean code. Page builders add heavy database bloat, dozens of vulnerable plugins, and slow loading times on mobile devices. Clean code loads in under one second and turns more visitors into calls.',
  },
  {
    question: 'What happens after my new website is launched?',
    answer:
      'Once your site launches, you own all files and assets. You can manage the site yourself, or you can join my Website Hosting and Care plan at /websites-care for ongoing security monitoring, high-speed hosting, and monthly content updates.',
  },
  {
    question: 'How do customers contact me through the website?',
    answer:
      'Every site includes fixed tap-to-call buttons on mobile phones and clean lead forms. Form submissions route immediately to your email, your mobile phone via text, or directly into field software like Jobber, Housecall Pro, or ServiceTitan.',
  },
]

const WEBSITE_DESIGN_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'Website Redesign Services',
      serviceType: 'Website Design and Development',
      provider: {
        '@type': 'LocalBusiness',
        name: 'built by Miguel',
        url: 'https://builtbymiguel.net',
      },
      description:
        'Custom website redesign services and new website builds for contractors and trade businesses. Sub-second load speeds and high-converting mobile call funnels.',
      areaServed: 'United States',
    },
    {
      '@type': 'FAQPage',
      mainEntity: WEBSITE_DESIGN_FAQ.map((faq) => ({
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

export const Route = createFileRoute('/website-design')({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      {
        title: 'Website Redesign Services for Contractors | built by Miguel',
      },
      {
        name: 'description',
        content:
          'I provide custom website redesign services for contractors who need fast mobile sites that turn clicks into calls. Claim your free interactive website demo.',
      },
      {
        property: 'og:title',
        content: 'Website Redesign Services for Contractors | built by Miguel',
      },
      {
        property: 'og:description',
        content:
          'I provide custom website redesign services for contractors who need fast mobile sites that turn clicks into calls. Claim your free interactive website demo.',
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://builtbymiguel.net/website-design' },
      { property: 'og:image', content: 'https://builtbymiguel.net/og-image.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
      {
        name: 'twitter:title',
        content: 'Website Redesign Services for Contractors | built by Miguel',
      },
      {
        name: 'twitter:description',
        content:
          'I provide custom website redesign services for contractors who need fast mobile sites that turn clicks into calls. Claim your free interactive website demo.',
      },
      { name: 'twitter:image', content: 'https://builtbymiguel.net/og-image.png' },
    ],
    links: [
      {
        rel: 'canonical',
        href: 'https://builtbymiguel.net/website-design',
      },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify(WEBSITE_DESIGN_JSON_LD),
      },
    ],
  }),
  component: WebsiteDesignPage,
})

function WebsiteDesignPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)
  const [comparisonTab, setComparisonTab] = useState<'custom' | 'template'>('custom')

  return (
    <div className="space-y-24 sm:space-y-32 lg:space-y-36 py-6 sm:py-10">
      {/* =========================================================================
          SECTION 1: HERO SECTION
          ========================================================================= */}
      <section className="relative text-center max-w-4xl mx-auto">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-200/30 via-rose-100/30 to-amber-100/30 dark:from-cyan-500/10 dark:via-rose-500/10 dark:to-amber-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

        {/* Pillar Breadcrumb Badge */}
        <div className="mb-6 sm:mb-8 flex justify-center">
          <Link
            to="/websites"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-cyan-600 dark:text-cyan-400 hover:border-cyan-500/50 shadow-sm transition-all"
          >
            <span>← Back to Contractor Websites</span>
          </Link>
        </div>

        {/* Main H1 with Primary Keyword */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.12] mb-6 sm:mb-8">
          Website Redesign Services That Turn{' '}
          <span className="bg-gradient-to-r from-cyan-500 via-rose-500 to-amber-500 bg-clip-text text-transparent">
            Mobile Visitors Into Calls.
          </span>
        </h1>

        {/* Intro Lead with Primary & Secondary Keywords */}
        <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto font-normal">
          I provide custom website redesign services and new website builds for trade contractors who are tired of losing jobs to slow pages. Whether you need a fresh build from scratch or a complete rebuild of an old site, I write clean code that loads in under one second.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 sm:pt-10">
          <Link
            to="/website-demo"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-base text-white bg-slate-900 dark:bg-rose-600 hover:bg-black dark:hover:bg-rose-500 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-cyan-400 dark:text-white fill-cyan-400 dark:fill-white" />
            <span>Request a Free Website Demo</span>
          </Link>
          <a
            href="#comparison"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-base text-slate-800 dark:text-slate-200 hover:text-black dark:hover:text-white bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm transition-all"
          >
            <span>See Custom vs Templates</span>
            <ArrowRight className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </a>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: DIFFERENCE SECTION (BUILD VS HOSTING & CARE)
          ========================================================================= */}
      <section className="p-8 sm:p-12 rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm dark:shadow-none space-y-6">
        <div className="max-w-2xl">
          <div className="text-[11px] font-mono uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-bold mb-2">
            Service Scope
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            The Difference Between Website Design and Website Care
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            I keep website creation and monthly site management clear so you only pay for what your company needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Active Child: This Page */}
          <div className="p-6 rounded-2xl bg-cyan-50/50 dark:bg-cyan-950/20 border-2 border-cyan-500/30 dark:border-cyan-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase">THIS PAGE</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-cyan-100 dark:bg-cyan-900/60 text-cyan-700 dark:text-cyan-300">One-Time Project</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Website Design and Development</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              This page covers the one-time build. A brand-new website or a full website redesign. I handle your mobile layout, custom code, Core Web Vitals optimization, and CRM form connections from scratch until launch day.
            </p>
          </div>

          {/* Sibling Child: Hosting & Care */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 uppercase">POST-LAUNCH OPERATIONS</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">Monthly Plan</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Website Hosting and Care</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Website Hosting and Care covers what happens after launch. High-speed edge hosting, 24/7 uptime monitoring, daily automated backups, security certificates, and regular monthly content edits. A client can start with either service or combine both.
              </p>
            </div>
            <div className="pt-2">
              <Link
                to="/websites-care"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline"
              >
                <span>Explore Website Hosting and Care</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: SCOPE CLARITY: BRAND NEW BUILDS & COMPLETE REDESIGNS
          ========================================================================= */}
      <section className="space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-[11px] font-mono uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-bold">
            Project Scope
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Built for New Businesses and Established Companies
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            I handle website design and development whether you need your very first domain or a complete modernization of a ten-year-old site.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card A: Brand New Builds */}
          <div className="p-8 rounded-[2rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] space-y-5 shadow-sm dark:shadow-none">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-100 dark:border-cyan-800/40 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Brand-New Website Builds
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                If you are launching a new trade business or adding an independent location, you need a site that builds trust immediately. I write custom website development code that sets you apart from competitors using cheap drag-and-drop templates.
              </p>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium border-t border-slate-100 dark:border-slate-800 pt-4">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>Clean domain setup and SSL encryption</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>Modern contractor layout focused on service calls</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>Structured service area pages for local search discovery</span>
              </li>
            </ul>
          </div>

          {/* Card B: Complete Redesigns */}
          <div className="p-8 rounded-[2rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] space-y-5 shadow-sm dark:shadow-none">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-800/40 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <Flame className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Complete Website Redesigns
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                If your current website was built years ago on WordPress, Wix, or Squarespace, it is probably slow on mobile and difficult to update. My website redesign services replace heavy templates with fast code while protecting all existing Google rankings.
              </p>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium border-t border-slate-100 dark:border-slate-800 pt-4">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                <span>301 redirect mapping to preserve existing Google rankings</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                <span>Complete removal of slow plugins and database bloat</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                <span>Updated mobile navigation and click-to-call buttons</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: COMPARISON BLOCK (ENGINEERING ADVANTAGE STYLE)
          Custom Built Site vs Template Site
          ========================================================================= */}
      <section id="comparison" className="space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-[11px] font-mono uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-bold">
            The Engineering Advantage
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            Custom Code vs. Clunky Page Templates
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Most agencies sell small business website design built on heavy WordPress themes. Here is how custom engineering compares to standard agency templates.
          </p>
        </div>

        {/* Interactive Comparison Card Container */}
        <div className="w-full max-w-4xl mx-auto rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 sm:p-10 shadow-lg shadow-slate-200/50 dark:shadow-none space-y-8">
          {/* Header & Toggle */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
            <div className="space-y-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 border border-transparent dark:border-cyan-900/50">
                <Activity className="w-3.5 h-3.5" /> Direct Technical Comparison
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                How Your Website Operates Under the Hood
              </h3>
            </div>

            {/* Toggle Switch */}
            <div className="inline-flex p-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-inner">
              <button
                type="button"
                onClick={() => setComparisonTab('custom')}
                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                  comparisonTab === 'custom'
                    ? 'bg-slate-900 dark:bg-cyan-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                ⚡ Custom Built Site
              </button>
              <button
                type="button"
                onClick={() => setComparisonTab('template')}
                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                  comparisonTab === 'template'
                    ? 'bg-slate-900 dark:bg-rose-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                🐢 Agency Template Site
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {comparisonTab === 'custom' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="p-6 rounded-3xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/40 space-y-3">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-mono font-bold text-xs uppercase tracking-wider">
                  <Zap className="w-4 h-4" /> Load Time
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">Under 1 Second</div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Engineered with modern React and clean styling. Loads immediately even on weak cellular networks in the field.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-cyan-50/60 dark:bg-cyan-950/20 border border-cyan-200/80 dark:border-cyan-800/40 space-y-3">
                <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-400 font-mono font-bold text-xs uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" /> Security & Bloat
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">Zero Plugins</div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  No third-party plugins to update or break. Static edge hosting stops database injection and hacking attempts.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40 space-y-3">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-mono font-bold text-xs uppercase tracking-wider">
                  <Smartphone className="w-4 h-4" /> Mobile Conversion
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">Tap-to-Call First</div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Sticky call buttons and high-contrast quote forms connect homeowners to your phone in two quick taps.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="p-6 rounded-3xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 space-y-3">
                <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-mono font-bold text-xs uppercase tracking-wider">
                  <X className="w-4 h-4" /> Load Time
                </div>
                <div className="text-2xl font-bold text-rose-900 dark:text-rose-200 font-mono">4 to 8 Seconds</div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Bloated themes and heavy script trackers cause high bounce rates. Over forty percent of visitors leave before the page finishes loading.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 space-y-3">
                <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-mono font-bold text-xs uppercase tracking-wider">
                  <X className="w-4 h-4" /> Security & Bloat
                </div>
                <div className="text-2xl font-bold text-rose-900 dark:text-rose-200 font-mono">30+ Plugins</div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Constant updates cause broken layouts. Unpatched plugins expose your business database to malware and spam injections.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 space-y-3">
                <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-mono font-bold text-xs uppercase tracking-wider">
                  <X className="w-4 h-4" /> Mobile Conversion
                </div>
                <div className="text-2xl font-bold text-rose-900 dark:text-rose-200 font-mono">Buried Phone Numbers</div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Tiny buttons hidden in complex burger menus make calling frustrating for customers who need urgent repair work.
                </p>
              </div>
            </div>
          )}

          {/* Summary Callout Inside Table */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <span className="text-slate-600 dark:text-slate-300 text-center sm:text-left">
              Want to see how fast your company website runs when built with custom code?
            </span>
            <Link
              to="/website-demo"
              className="px-4 py-2 rounded-full font-bold text-white bg-slate-900 dark:bg-rose-600 hover:bg-black dark:hover:bg-rose-500 shrink-0 transition-colors"
            >
              Request Free Demo
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: WHAT EVERY BUILD INCLUDES (DELIVERABLES GRID)
          ========================================================================= */}
      <section className="space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-[11px] font-mono uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-bold">
            Engineering Standard
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            What Every Build and Redesign Delivers
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            I build custom digital assets designed to help your phone ring for years to come.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Deliverable 1 */}
          <div className="p-8 rounded-[2rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] space-y-4 shadow-sm dark:shadow-none">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-100 dark:border-cyan-800/40 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Mobile-First Call Funnels
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Over seventy percent of homeowners search for contractors on their phones. I build sticky header call buttons and clean touch targets so calling your team is effortless.
            </p>
          </div>

          {/* Deliverable 2 */}
          <div className="p-8 rounded-[2rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] space-y-4 shadow-sm dark:shadow-none">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Sub-Second Core Web Vitals
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Google rewards websites that load instantly. I compress media, optimize web fonts, and eliminate render-blocking code so your site scores green across all Google performance benchmarks.
            </p>
          </div>

          {/* Deliverable 3 */}
          <div className="p-8 rounded-[2rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] space-y-4 shadow-sm dark:shadow-none">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-800/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Instant CRM Lead Routing
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Forms connect to Jobber, Housecall Pro, ServiceTitan, or your phone via text message. You receive customer requests the second they submit without relying on clunky plugins.
            </p>
          </div>

          {/* Deliverable 4 */}
          <div className="p-8 rounded-[2rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] space-y-4 shadow-sm dark:shadow-none">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-800/40 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Local SEO Schema Markup
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              I embed structured data directly into the code. This tells search engines your exact service areas, business hours, license credentials, and primary trade categories.
            </p>
          </div>

          {/* Deliverable 5 */}
          <div className="p-8 rounded-[2rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] space-y-4 shadow-sm dark:shadow-none">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-800/40 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Targeted City Pages
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              I build dedicated landing pages for each surrounding city you service. These pages capture homeowners searching for trade work outside your main shop address.
            </p>
          </div>

          {/* Deliverable 6 */}
          <div className="p-8 rounded-[2rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] space-y-4 shadow-sm dark:shadow-none">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Full Asset Ownership
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              You own your domain, code repository, content, and branding outright. I never charge cancellation exit fees or hold your digital presence hostage.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: FAQ ACCORDION
          ========================================================================= */}
      <section className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="text-[11px] font-mono uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-bold">
            Questions & Answers
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions About Website Builds & Redesigns
          </h2>
        </div>

        <div className="space-y-4">
          {WEBSITE_DESIGN_FAQ.map((faq, index) => {
            const isOpen = openFaqIndex === index
            return (
              <div
                key={faq.question}
                className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] overflow-hidden shadow-sm dark:shadow-none"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left text-base font-semibold text-slate-900 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors focus:outline-none cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-cyan-600 dark:text-cyan-400' : ''
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
      <FreeWebsiteDemoCTA />
    </div>
  )
}
