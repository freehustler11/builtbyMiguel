import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Sparkles,
  ArrowRight,
  ChevronDown,
  Check,
  Star,
  Smartphone,
  Gauge,
  PhoneCall,
  Hammer,
  ShieldCheck,
  Timer,
  ShieldAlert,
  Puzzle,
  Globe,
  Server,
  Zap,
} from 'lucide-react'
import { useState } from 'react'

const WEBSITES_FAQ = [
  {
    question: 'How long does it take to design and launch a new contractor website?',
    answer:
      'Most custom contractor websites launch within two to three weeks. Because you work directly with the person building it rather than an agency with layers of account managers, the code and mobile layout come together quickly.',
  },
  {
    question: 'Can I hire you for website care if you did not build my original site?',
    answer:
      'Yes. Care and hosting can be added to an existing site after a quick technical review to make sure it\'s stable enough to maintain long-term. If it needs significant rework first, that gets covered during your free demo.',
  },
  {
    question: 'Do I own my website code and design assets after the build?',
    answer:
      'Yes. Once the build is paid in full, the code and design assets are yours, with no vendor lock-in or proprietary page builder holding your site hostage.',
  },
  {
    question: 'Can you connect my website directly to my CRM or field service software?',
    answer:
      'Yes. Websites can connect directly to your CRM, scheduling, or field service software as part of a broader automation setup. See Systems & Automation for what that looks like.',
  },
  {
    question: 'What\'s included in the free website demo?',
    answer:
      'A personalized preview of what your new site could look like, built around your actual trade and service area, delivered without a sales call.',
  },
  {
    question: 'How much does website care cost?',
    answer:
      'Care plans start at $99 per month, covering hosting, backups, SSL renewals, and monthly updates.',
  },
  {
    question: 'What happens if I need changes after the site launches?',
    answer:
      'Minor content and photo updates are included in the monthly care plan. Larger changes, like adding new pages or services, get scoped and quoted separately.',
  },
  {
    question: 'Do you build websites for every trade, or just certain industries?',
    answer:
      'Sites are built for local service businesses and trade contractors, plumbers, electricians, HVAC, roofers, and similar trades. If your business doesn\'t fit that mold, it\'s worth a quick conversation during your free demo to see if it\'s still a good fit.',
  },
]

const WEBSITES_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'Web Design Services for Contractors',
      serviceType: 'Contractor Website Design & Development',
      provider: {
        '@type': 'ProfessionalService',
        name: 'built by Miguel',
        url: 'https://builtbymiguel.net',
      },
      description:
        'Custom, sub-second websites for trade contractors, built and maintained directly by me. Care plans starting at $99/month. Free personalized demo, no sales call.',
      areaServed: 'United States',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Contractor Website Solutions',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Website Design & Development',
              url: 'https://builtbymiguel.net/website-design',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Website Hosting & Care',
              url: 'https://builtbymiguel.net/websites-care',
            },
          },
        ],
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: WEBSITES_FAQ.map((faq) => ({
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

export const Route = createFileRoute('/websites')({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      {
        title: 'Web Design Services for Contractors | built by Miguel',
      },
      {
        name: 'description',
        content:
          'Custom, sub-second websites for trade contractors, built and maintained directly by me. Care plans starting at $99/month. Free personalized demo, no sales call.',
      },
      {
        name: 'keywords',
        content:
          'web design for contractors, contractor website design, custom web development, website hosting and care, mobile-optimized contractor websites',
      },
      // OpenGraph
      { property: 'og:type', content: 'website' },
      {
        property: 'og:title',
        content: 'Web Design Services for Contractors | built by Miguel',
      },
      {
        property: 'og:description',
        content:
          'Custom, sub-second websites for trade contractors, built and maintained directly by me. Care plans starting at $99/month. Free personalized demo, no sales call.',
      },
      {
        property: 'og:url',
        content: 'https://builtbymiguel.net/websites',
      },
      {
        property: 'og:image',
        content: 'https://builtbymiguel.net/og-image.png',
      },
      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      {
        name: 'twitter:title',
        content: 'Web Design Services for Contractors | built by Miguel',
      },
      {
        name: 'twitter:description',
        content:
          'Custom, sub-second websites for trade contractors, built and maintained directly by me. Care plans starting at $99/month. Free personalized demo, no sales call.',
      },
      {
        name: 'twitter:image',
        content: 'https://builtbymiguel.net/og-image.png',
      },
    ],
    links: [
      {
        rel: 'canonical',
        href: 'https://builtbymiguel.net/websites',
      },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify(WEBSITES_JSON_LD),
      },
    ],
  }),
  component: WebsitesPage,
})

function WebsitesPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  return (
    <div className="w-full bg-[#FAF8F5] dark:bg-[#080B11] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* ========================================================================= */}
      {/* SECTION 1: HERO                                                           */}
      {/* ========================================================================= */}
      <section className="relative w-full overflow-hidden border-b border-slate-200/80 dark:border-slate-800/80 pt-12 pb-16 sm:pt-20 sm:pb-24 lg:pb-28">
        {/* Ambient mesh glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-amber-200/30 via-orange-100/20 to-sky-200/20 dark:from-amber-500/10 dark:via-orange-500/5 dark:to-sky-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

        {/* Radial dot grid overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] dark:bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:24px_24px] opacity-40 dark:opacity-30 pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            {/* Left Column: Copy & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-2">
                <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono font-bold tracking-wider uppercase text-amber-800 dark:text-amber-300 bg-amber-100/90 dark:bg-amber-950/50 px-3.5 py-1.5 rounded-full border border-amber-300/80 dark:border-amber-700/50 shadow-2xs">
                  <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  High-Speed Web Architecture
                </span>
              </div>

              {/* H1 */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display leading-[1.12]">
                Direct Web Design for Contractors Built to Ring Your Phone
              </h1>

              {/* Subhead */}
              <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-2xl">
                Most trade websites run on bloated WordPress templates that load slowly and lose customers before the page even renders. Get a custom-built site that opens in under a second on mobile, with professional-grade precision and no agency layers in between.
              </p>

              {/* CTAs (Dual on Hero as permitted) */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/website-demo"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 dark:bg-amber-400 dark:hover:bg-amber-300 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Claim Your Free Website Demo</span>
                </Link>
                <Link
                  to="/work"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-850 transition-all duration-200 shadow-2xs active:scale-95 cursor-pointer"
                >
                  <span>View Client Case Studies</span>
                  <ArrowRight className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                </Link>
              </div>

              {/* Trust Line */}
              <div className="pt-2 text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>100% Free · Custom mobile preview · No high-pressure sales calls</span>
              </div>
            </div>

            {/* Right Column: Flat Vector Illustration */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md rounded-3xl bg-white/90 dark:bg-[#111827]/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/90 shadow-2xl p-6 sm:p-8 space-y-6">
                {/* Speed Metric Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Mobile Performance
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-800/40 font-semibold">
                    Score: 100/100
                  </span>
                </div>

                {/* Smartphone Device Representation */}
                <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-50 to-amber-50/40 dark:from-slate-900/60 dark:to-amber-950/20 border border-slate-200/80 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-amber-500" />
                      Mobile Viewport
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">0.8s Load</span>
                  </div>

                  {/* Visual Speed Gauge & Call Funnel */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200/70 dark:border-slate-800 shadow-2xs">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                          <Gauge className="w-5 h-5" strokeWidth={2.2} />
                        </div>
                        <div>
                          <div className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                            Sub-Second Render
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            Zero layout shifts, instant paint
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-500">
                        99/100
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200/70 dark:border-slate-800 shadow-2xs">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center">
                          <PhoneCall className="w-5 h-5" strokeWidth={2.2} />
                        </div>
                        <div>
                          <div className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                            Direct Call Trigger
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            1-tap phone dispatch for callers
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-amber-500">
                        Active
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sub-status Indicator */}
                <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 pt-1">
                  <span>Stack: React + Edge CDN</span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Zero Plugins</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: TWO CLEAR PATHS (FEATURE GRID)                                 */}
      {/* ========================================================================= */}
      <section className="relative w-full py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0B0F17] transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
          <div className="mb-12 sm:mb-16 space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/40">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Service Architecture
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight leading-tight">
              Two Clear Paths: The Build and What Happens After
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Web projects split into two distinct services. Hire for the initial build, choose ongoing monthly care, or bundle both together.
            </p>
          </div>

          {/* 2-Column Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1: The Initial Build */}
            <div className="p-7 sm:p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:border-amber-400/80 dark:hover:border-amber-500/80 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-amber-100/90 dark:bg-amber-950/70 border border-amber-300/80 dark:border-amber-700/60 flex items-center justify-center text-amber-700 dark:text-amber-400 shadow-2xs">
                    <Hammer className="w-6 h-6" strokeWidth={2} />
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40">
                    The Initial Build
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
                  Website Design & Development
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  A complete custom website built from scratch using modern React. Designed specifically to load under a second on mobile phones and convert visitors into calls.
                </p>
                <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                  <span className="font-bold text-amber-900 dark:text-amber-300">What it covers:</span> Custom UI design, persuasive copywriting, mobile call funnels, dispatch form integrations, and Core Web Vitals speed optimization.
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
                <Link
                  to="/websites/design-and-development"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400 hover:text-amber-500 transition-colors cursor-pointer"
                >
                  <span>Explore Website Design & Development →</span>
                </Link>
              </div>
            </div>

            {/* Card 2: What Happens After Launch */}
            <div className="p-7 sm:p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:border-sky-400/80 dark:hover:border-sky-500/80 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-sky-100/90 dark:bg-sky-950/70 border border-sky-300/80 dark:border-sky-700/60 flex items-center justify-center text-sky-700 dark:text-sky-400 shadow-2xs">
                    <ShieldCheck className="w-6 h-6" strokeWidth={2} />
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider text-sky-800 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/40 border border-sky-200/60 dark:border-sky-800/40">
                    What Happens After Launch
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
                  Website Hosting & Care
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Reliable edge CDN hosting, automated daily backups, uptime alerts, and ongoing monthly updates so your website remains fast, secure, and fresh.
                </p>
                <div className="p-4 rounded-2xl bg-sky-50/60 dark:bg-sky-950/30 border border-sky-200/60 dark:border-sky-800/40 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                  <span className="font-bold text-sky-900 dark:text-sky-300">What it covers:</span> Global edge server hosting, SSL renewals, monthly text and photo updates, security patch management, and round-the-clock uptime monitoring.
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
                <Link
                  to="/websites-care"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-sky-600 dark:text-sky-400 hover:text-sky-500 transition-colors cursor-pointer"
                >
                  <span>Explore Website Hosting & Care →</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: THE BUILD VS. AFTER LAUNCH (PROCESS DETAIL)                     */}
      {/* ========================================================================= */}
      <section className="relative w-full py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-[#FAF8F5]/60 dark:bg-[#080B11] transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
          <div className="mb-12 sm:mb-16 space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-800/40">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
              Project Scoping
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight leading-tight">
              The Build vs. What Happens After Launch
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Understanding the distinction helps you choose the right level of support for your company.
            </p>
          </div>

          {/* 2-Column Deep-Dive Process Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Step 01: The Build Phase */}
            <div className="p-7 sm:p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-500 dark:text-amber-400">
                  01
                </span>
                <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40">
                  One-Time Project
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
                The Build Phase
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                This is a one-time project: your custom digital storefront gets built from the ground up, sales copy included, mobile interface designed, and the whole thing coded without page builder bloat.
              </p>
              <ul className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Custom design tailored to your specific trade services</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Direct phone call tracking and instant form routing</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>One-time investment with zero vendor lock-in</span>
                </li>
              </ul>
            </div>

            {/* Step 02: After Launch: Care & Defense */}
            <div className="p-7 sm:p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-sky-500 dark:text-sky-400">
                  02
                </span>
                <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider text-sky-800 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/40 border border-sky-200/60 dark:border-sky-800/40">
                  Ongoing Monthly Retainer
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
                After Launch: Care & Defense
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Once your site is live, it requires dependable server infrastructure and regular maintenance. The monthly care plan ensures your site stays fast, updated, and completely defended against downtime.
              </p>
              <ul className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Ultra-fast edge hosting with automatic SSL renewals</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Monthly content updates so you never touch code</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Peace of mind knowing someone's personally keeping an eye on your site</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: WHY MOBILE SPEED MATTERS (DIFFERENTIATORS)                     */}
      {/* ========================================================================= */}
      <section className="relative w-full py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0B0F17] transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
          <div className="mb-12 sm:mb-16 space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/40">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              The Speed Advantage
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight leading-tight">
              Why Web Design for Contractors Must Prioritize Mobile Speed
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              More than three out of four contractor searches happen on mobile phones. When homeowners have an emergency, speed determines who gets the job.
            </p>
          </div>

          {/* 2-Column Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1: Sub-Second Load Times */}
            <div className="p-7 sm:p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100/90 dark:bg-amber-950/70 border border-amber-300/80 dark:border-amber-700/60 flex items-center justify-center text-amber-700 dark:text-amber-400 shadow-2xs">
                <Timer className="w-6 h-6" strokeWidth={2} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
                Sub-Second Load Times
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                If a website takes longer than three seconds to load, more than half of mobile visitors leave immediately and call your competitor. Pages here open in under one second on standard mobile networks, keeping buyers on the page.
              </p>
            </div>

            {/* Card 2: Zero Plugin Vulnerabilities */}
            <div className="p-7 sm:p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-sky-100/90 dark:bg-sky-950/70 border border-sky-300/80 dark:border-sky-700/60 flex items-center justify-center text-sky-700 dark:text-sky-400 shadow-2xs">
                <ShieldAlert className="w-6 h-6" strokeWidth={2} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
                Zero Plugin Vulnerabilities
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                WordPress sites rely on dozens of third-party plugins that regularly break, slow down databases, and invite security hacks. Custom React code is lean, secure, and requires zero plugin updates.
              </p>
            </div>
          </div>

          {/* Single CTA Button */}
          <div className="mt-12 sm:mt-14 flex items-center justify-start">
            <Link
              to="/website-demo"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 dark:bg-amber-400 dark:hover:bg-amber-300 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Start My Free Website Demo</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: WHAT CLIENTS SAY (TESTIMONIALS)                                 */}
      {/* ========================================================================= */}
      <section className="relative w-full py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-[#FAF8F5]/60 dark:bg-[#080B11] transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
          <div className="mb-12 sm:mb-16 space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/40">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Verified Proof
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight leading-tight">
              What Clients Say
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Testimonial 1: Carlos */}
            <div className="relative p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  "Our old site took forever to load on a phone, and I know we lost calls because of it. The new one opens instantly, and I can actually see the difference in how many people call from their phones now."
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold font-display text-slate-900 dark:text-white text-xs sm:text-sm">
                    Carlos
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    Roofing Contractor
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
                  Verified
                </span>
              </div>
            </div>

            {/* Testimonial 2: Angela */}
            <div className="relative p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  "I didn't want to learn a page builder or touch code every time I needed a photo updated. Now I just send a text and it's handled as part of the care plan."
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold font-display text-slate-900 dark:text-white text-xs sm:text-sm">
                    Angela
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    Landscaping Business Owner
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
                  Verified
                </span>
              </div>
            </div>

            {/* Testimonial 3: Ben */}
            <div className="relative p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  "We got quoted by three different agencies before this. Every one of them wanted a big monthly retainer for a template site. This was a fraction of the cost for something built specifically for us."
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold font-display text-slate-900 dark:text-white text-xs sm:text-sm">
                    Ben
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    General Contractor
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
                  Verified
                </span>
              </div>
            </div>
          </div>

          {/* Single CTA Button */}
          <div className="mt-12 sm:mt-14 flex items-center justify-start">
            <Link
              to="/website-demo"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 dark:bg-amber-400 dark:hover:bg-amber-300 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Claim Your Free Demo</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6: FAQ                                                            */}
      {/* ========================================================================= */}
      <section className="relative w-full py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0B0F17] transition-colors duration-200">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 space-y-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/40">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Common Inquiries
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight leading-tight">
              Frequently Asked Questions About Contractor Websites
            </h2>
          </div>

          <div className="space-y-4 pt-4">
            {WEBSITES_FAQ.map((faq, index) => {
              const isOpen = openFaqIndex === index
              return (
                <div
                  key={faq.question}
                  className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] overflow-hidden shadow-2xs hover:border-amber-400/60 dark:hover:border-amber-500/60 transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left text-sm sm:text-base font-bold font-display text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors focus:outline-none cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 shrink-0 ml-4 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-amber-600 dark:text-amber-400' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                      {faq.question === 'Can you connect my website directly to my CRM or field service software?' ? (
                        <span>
                          Yes. Websites can connect directly to your CRM, scheduling, or field service software as part of a broader automation setup. See{' '}
                          <Link
                            to="/systems-auto"
                            className="font-bold text-amber-600 dark:text-amber-400 hover:underline"
                          >
                            Systems & Automation
                          </Link>{' '}
                          for what that looks like.
                        </span>
                      ) : (
                        faq.answer
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 7: CLOSING HERO CTA                                               */}
      {/* ========================================================================= */}
      <section className="relative w-full py-20 sm:py-28 overflow-hidden bg-slate-950 dark:bg-black text-white transition-colors duration-200">
        {/* Glowing background bloom */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[750px] h-[350px] bg-gradient-to-b from-amber-500/15 via-rose-500/5 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 text-center space-y-6 relative z-10">
          <div>
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-amber-400 bg-amber-400/10 border border-amber-400/30 px-3.5 py-1.5 rounded-full inline-block">
              See It Before You Buy It
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-white tracking-tight leading-tight max-w-2xl mx-auto">
            Get a Website Built to Load Fast and Ring Your Phone
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            Stop losing mobile visitors to a slow, templated site. Start with a free personalized demo and see exactly what your new site could look like.
          </p>

          <div className="flex items-center justify-center pt-4">
            <Link
              to="/website-demo"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 dark:bg-amber-400 dark:hover:bg-amber-300 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Get My Free Website Demo</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
