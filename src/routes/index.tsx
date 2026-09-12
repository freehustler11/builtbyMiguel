import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowRight,
  Plus,
  Minus,
  Check,
  X as XIcon,
  Star,
  Sparkles,
  TrendingUp,
  MapPin,
  Zap,
  Activity,
  ShieldCheck,
  CheckCircle2,
  Search,
  Lock,
  Smartphone,
  MessageSquare,
} from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      {
        name: 'google-site-verification',
        content: 'tSjijzpdCvum7gpDKpknIY2FN0jLAGuRNfOiAf0Kg3o',
      },
      {
        title: 'Digital Marketing Agency for Small Business | built by Miguel',
      },
      {
        name: 'description',
        content:
          'Get SEO, a fast website, and automated lead follow-up. Built and run by one founder, not an agency. Plans starting at $99/month. Start with a free 5-minute audit.',
      },
      {
        name: 'keywords',
        content:
          'digital marketing agency for small business, local seo services, national seo services, aeo geo optimization, custom web development, small business automation, trade contractor marketing',
      },
      // OpenGraph
      { property: 'og:type', content: 'website' },
      {
        property: 'og:title',
        content: 'Digital Marketing Agency for Small Business | built by Miguel',
      },
      {
        property: 'og:description',
        content:
          'Get SEO, a fast website, and automated lead follow-up. Built and run by one founder, not an agency. Plans starting at $99/month. Start with a free 5-minute audit.',
      },
      { property: 'og:url', content: 'https://builtbymiguel.net' },
      { property: 'og:image', content: 'https://builtbymiguel.net/og-image.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
      {
        name: 'twitter:title',
        content: 'Digital Marketing Agency for Small Business | built by Miguel',
      },
      {
        name: 'twitter:description',
        content:
          'Get SEO, a fast website, and automated lead follow-up. Built and run by one founder, not an agency. Plans starting at $99/month. Start with a free 5-minute audit.',
      },
      { name: 'twitter:image', content: 'https://builtbymiguel.net/og-image.png' },
    ],
    links: [
      {
        rel: 'canonical',
        href: 'https://builtbymiguel.net',
      },
    ],
    scripts: [
      // Organization Schema
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'built by Miguel',
          url: 'https://builtbymiguel.net',
          logo: 'https://builtbymiguel.net/logo.png',
          founder: {
            '@type': 'Person',
            name: 'Miguel Umbac',
          },
          description:
            'Digital marketing agency for small business and trade contractors. Custom web development, SEO, and business automation run by one founder.',
          sameAs: [
            'https://www.linkedin.com/in/seo-specialist-miguel-umbac/',
          ],
        }),
      },
      // FAQPage Schema
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'Is built by Miguel actually an agency?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'No. It is a one-person studio. Founder Miguel Umbac personally handles every client engagement. There is no account manager layer and no outsourcing to subcontractors.',
              },
            },
            {
              '@type': 'Question',
              name: 'Do I need to hire three different companies for SEO, my website, and automation?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'No. All three are built as one connected system: SEO (local, national, or AI search depending on your business), a custom website, and automated lead follow-up, so improvements in one area support the others.',
              },
            },
            {
              '@type': 'Question',
              name: "What's included in the free audit?",
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'A personally recorded 5-minute video reviewing your current site, SEO setup, and lead follow-up process, delivered within 24 hours. There is no sales call required to get it.',
              },
            },
            {
              '@type': 'Question',
              name: 'Do you work with businesses outside my state?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. Service is nationwide and remote across the U.S.',
              },
            },
            {
              '@type': 'Question',
              name: 'How fast will I hear back if I have a question?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Within 24 business hours.',
              },
            },
            {
              '@type': 'Question',
              name: 'Can you fix my existing website instead of building a new one?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'In most cases a full rebuild delivers better speed and reliability than patching an existing site, but every situation is different. The free audit looks at your current site first and tells you honestly whether a rebuild or a fix makes more sense.',
              },
            },
            {
              '@type': 'Question',
              name: 'Do you offer monthly plans or one-time projects?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Both. Websites are typically project-based, and ongoing care, SEO, and automation are handled through a monthly plan starting at $99 per month.',
              },
            },
            {
              '@type': 'Question',
              name: 'What kind of businesses do you typically work with?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Local service businesses and trade contractors, the kind of business where a missed call or a slow-loading site directly costs a job.',
              },
            },
            {
              '@type': 'Question',
              name: 'Is my site secure?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Sites are built with SSL and hosted on edge infrastructure, with backups and updates handled as part of ongoing care plans.',
              },
            },
          ],
        }),
      },
    ],
  }),
  component: HomePage,
})

const FAQ_ITEMS = [
  {
    question: 'Is built by Miguel actually an agency?',
    answer:
      'No. It is a one-person studio. Founder Miguel Umbac personally handles every client engagement. There is no account manager layer and no outsourcing to subcontractors.',
  },
  {
    question:
      'Do I need to hire three different companies for SEO, my website, and automation?',
    answer:
      'No. All three are built as one connected system: SEO (local, national, or AI search depending on your business), a custom website, and automated lead follow-up, so improvements in one area support the others.',
  },
  {
    question: "What's included in the free audit?",
    answer:
      'A personally recorded 5-minute video reviewing your current site, SEO setup, and lead follow-up process, delivered within 24 hours. There is no sales call required to get it.',
  },
  {
    question: 'Do you work with businesses outside my state?',
    answer: 'Yes. Service is nationwide and remote across the U.S.',
  },
  {
    question: 'How fast will I hear back if I have a question?',
    answer: 'Within 24 business hours.',
  },
  {
    question: 'Can you fix my existing website instead of building a new one?',
    answer:
      'In most cases a full rebuild delivers better speed and reliability than patching an existing site, but every situation is different. The free audit looks at your current site first and tells you honestly whether a rebuild or a fix makes more sense.',
  },
  {
    question: 'Do you offer monthly plans or one-time projects?',
    answer:
      'Both. Websites are typically project-based, and ongoing care, SEO, and automation are handled through a monthly plan starting at $99 per month.',
  },
  {
    question: 'What kind of businesses do you typically work with?',
    answer:
      'Local service businesses and trade contractors, the kind of business where a missed call or a slow-loading site directly costs a job.',
  },
  {
    question: 'Is my site secure?',
    answer:
      'Sites are built with SSL and hosted on edge infrastructure, with backups and updates handled as part of ongoing care plans.',
  },
]

function HomePage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index)
  }

  return (
    <div className="w-full flex flex-col bg-slate-50/50 dark:bg-[#080B11] text-slate-900 dark:text-slate-100 selection:bg-slate-900 selection:text-white dark:selection:bg-amber-400 dark:selection:text-slate-950 font-sans antialiased transition-colors duration-200">
      {/* ========================================================================= */}
      {/* SECTION 1: HERO                                                           */}
      {/* ========================================================================= */}
      <section className="relative w-full overflow-hidden pt-12 pb-16 sm:pt-18 sm:pb-24 lg:pt-24 lg:pb-32 border-b border-slate-200/70 dark:border-slate-800/80">
        {/* Soft background ambient radial gradient & technical grid overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] dark:bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none -z-10" />
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-bl from-amber-200/30 via-orange-100/20 to-transparent dark:from-amber-500/10 dark:via-orange-500/5 dark:to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-0 w-[450px] h-[450px] bg-gradient-to-tr from-sky-200/30 via-slate-100/20 to-transparent dark:from-sky-500/10 dark:via-slate-800/5 dark:to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            {/* Left Column: Copy & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Eyebrow kicker (Styled span, NOT a heading) */}
              <div className="inline-flex items-center gap-2">
                <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono font-bold tracking-wider uppercase text-amber-800 dark:text-amber-300 bg-amber-100/90 dark:bg-amber-950/50 px-3.5 py-1.5 rounded-full border border-amber-300/80 dark:border-amber-700/50 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  SEO, Speed, and Automation
                </span>
              </div>

              {/* Single H1 on page */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display leading-[1.12]">
                Digital Marketing Agency for Small Business, Run by One Founder
              </h1>

              {/* Subhead */}
              <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl font-normal">
                Most digital marketing agencies for small business hand you off to a junior account manager and a templated WordPress site. I build your SEO, your website, and your lead system myself, and you talk to me directly, not a support queue.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/audit"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 dark:bg-amber-400 dark:hover:bg-amber-300 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Get Your Free Audit</span>
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-full text-sm font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-850 transition-all duration-200 shadow-xs active:scale-95 cursor-pointer"
                >
                  <span>Contact Me</span>
                </Link>
              </div>

              {/* Verified Trust Strip */}
              <div className="pt-3 flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% Direct Founder
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 24h Response Guarantee
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Nationwide U.S.
                </span>
              </div>
            </div>

            {/* Right Column: Premium SaaS Interactive System Visual */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="relative w-full max-w-md rounded-3xl bg-white/90 dark:bg-[#111827]/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/90 shadow-2xl p-6 sm:p-7 space-y-5">
                {/* Visual Header with Real Status */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 font-mono text-xs text-slate-400 dark:text-slate-500 font-semibold">
                      connected-stack.live
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active
                  </span>
                </div>

                {/* Simulated SaaS Dashboard Node 1: Mobile React Speed */}
                <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/70 border border-slate-100 dark:border-slate-800/70 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-500" /> Mobile Speed Performance
                    </span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">0.42s (99/100)</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full w-[99%]" />
                  </div>
                </div>

                {/* Simulated SaaS Dashboard Node 2: Google Maps Local Pack */}
                <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/70 border border-slate-100 dark:border-slate-800/70 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-sky-500" /> Google Maps Local Rank
                    </span>
                    <span className="font-mono font-bold text-sky-600 dark:text-sky-400">#1 Top 3 Pack</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-1">
                    <span>Target: Metro Service Area</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">▲ +14 spots</span>
                  </div>
                </div>

                {/* Simulated SaaS Dashboard Node 3: Automated Lead Routing */}
                <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Lead Pipeline Dispatch
                    </span>
                    <span className="font-mono text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/50 px-2 py-0.5 rounded-full">
                      Instant SMS Sent
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                    New HVAC replacement inquiry routed to founder phone in <span className="font-bold text-slate-900 dark:text-white">12 seconds</span>.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: VALUE STRIP & METRICS BANNER                                   */}
      {/* ========================================================================= */}
      <section className="relative w-full py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-[#0B0F17] dark:via-[#0E131F] dark:to-[#0B0F17] transition-colors duration-200 overflow-hidden">
        {/* Subtle Ambient Glow behind Value Strip */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-amber-200/20 via-sky-200/20 to-purple-200/20 dark:from-amber-500/5 dark:via-sky-500/5 dark:to-purple-500/5 blur-3xl rounded-full pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="max-w-3xl mb-12 sm:mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/40">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Unified Architecture
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
              One Founder, Three Systems That Actually Talk to Each Other
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Most agencies split your SEO, your website, and your lead follow-up across three different vendors who never compare notes. I build all three as one connected system, so a ranking improvement, a faster page, and a follow-up text all work toward the same goal: more jobs booked.
            </p>
          </div>

          {/* 4 Cards Grid - Modern SaaS Pill & Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Direct Founder Access */}
            <div className="group relative p-6 sm:p-7 rounded-3xl bg-white/90 dark:bg-[#111827]/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 hover:border-amber-400/80 dark:hover:border-amber-500/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/60 dark:to-amber-900/40 border border-amber-200/80 dark:border-amber-700/60 flex items-center justify-center text-amber-700 dark:text-amber-400 shadow-xs group-hover:scale-105 transition-transform">
                    <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
                      <path d="M6 18L12 12L16 16L12 20L6 18Z" fill="#D97706" opacity="0.8" />
                      <path d="M26 14L20 20L16 16L20 12L26 14Z" fill="#B45309" />
                      <path d="M10 14L16 20L22 14" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-400 dark:text-slate-500">01</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    Direct Founder Access
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    No account manager relays your questions to someone else. You talk to the person actually building your site.
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] font-mono font-medium text-amber-700 dark:text-amber-400 flex items-center gap-1">
                <span>Personal oversight</span>
              </div>
            </div>

            {/* Card 2: Professional-Grade Rigor */}
            <div className="group relative p-6 sm:p-7 rounded-3xl bg-white/90 dark:bg-[#111827]/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 hover:border-sky-400/80 dark:hover:border-sky-500/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-50 to-sky-100 dark:from-sky-950/60 dark:to-sky-900/40 border border-sky-200/80 dark:border-sky-700/60 flex items-center justify-center text-sky-700 dark:text-sky-400 shadow-xs group-hover:scale-105 transition-transform">
                    <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
                      <path d="M8 12L4 16L8 20" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M24 12L28 16L24 20" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M12 16L15 19L20 13" stroke="#0369A1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-400 dark:text-slate-500">02</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-2 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                    Professional-Grade Rigor
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Every project is built to the same code-quality standard as production software, not assembled from a drag-and-drop template.
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] font-mono font-medium text-sky-700 dark:text-sky-400 flex items-center gap-1">
                <span>Production standards</span>
              </div>
            </div>

            {/* Card 3: Sub-Second Site Speed */}
            <div className="group relative p-6 sm:p-7 rounded-3xl bg-white/90 dark:bg-[#111827]/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 hover:border-emerald-400/80 dark:hover:border-emerald-500/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/60 dark:to-emerald-900/40 border border-emerald-200/80 dark:border-emerald-700/60 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shadow-xs group-hover:scale-105 transition-transform">
                    <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
                      <path d="M18 4L8 18H16L14 28L24 14H16L18 4Z" fill="#059669" />
                    </svg>
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-400 dark:text-slate-500">03</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    Sub-Second Site Speed
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Sites are built on React and edge hosting, tuned to load fast on the mobile connections your customers actually use.
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] font-mono font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <span>Edge cached</span>
              </div>
            </div>

            {/* Card 4: Automation-First Operations */}
            <div className="group relative p-6 sm:p-7 rounded-3xl bg-white/90 dark:bg-[#111827]/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 hover:border-purple-400/80 dark:hover:border-purple-500/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/60 dark:to-purple-900/40 border border-purple-200/80 dark:border-purple-700/60 flex items-center justify-center text-purple-700 dark:text-purple-400 shadow-xs group-hover:scale-105 transition-transform">
                    <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
                      <circle cx="16" cy="16" r="5" stroke="#7C3AED" strokeWidth="2.5" />
                      <path d="M16 6V8M16 24V26M6 16H8M24 16H26M8.9 8.9L10.3 10.3M21.7 21.7L23.1 23.1M8.9 23.1L10.3 21.7M21.7 10.3L23.1 8.9" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-400 dark:text-slate-500">04</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    Automation-First Operations
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Lead capture, CRM sync, and follow-up run automatically in the background, so nothing depends on someone checking an inbox.
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] font-mono font-medium text-purple-700 dark:text-purple-400 flex items-center gap-1">
                <span>Instant dispatch</span>
              </div>
            </div>
          </div>

          {/* CTA row */}
          <div className="mt-12 sm:mt-14 flex items-center justify-start">
            <Link
              to="/audit"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 dark:bg-amber-400 dark:hover:bg-amber-300 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Audit Your Growth Bottlenecks</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: WHAT YOU GET (FEATURE GRID)                                    */}
      {/* ========================================================================= */}
      <section className="relative w-full py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-[#FAF8F5]/60 dark:bg-[#080B11] transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 sm:mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-800/40">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
              Deliverables & Core Pillars
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
              What You Get
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed font-normal">
              Every deliverable is engineered as an integrated engine to capture demand, convert visitors, and retain customers without bloated tech stacks or handoff delays. Instead of juggling disconnected vendors or settling for cookie-cutter templates, you get direct founder execution backed by transparent reporting and measurable business outcomes. Each pillar is custom-built to scale with your business and deliver compounding ROI over time.
            </p>
          </div>

          {/* 3 Pillar Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Pillar 1: SEO That Actually Ranks */}
            <div className="group relative p-7 sm:p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:border-amber-400/80 dark:hover:border-amber-500/80 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-6">
                {/* SaaS Micro-UI Graphic 1: High-Tech SERP, Map Pack & AI Citation Dashboard */}
                <div className="w-full h-52 rounded-2xl bg-gradient-to-b from-amber-500/5 via-slate-50 to-amber-500/10 dark:from-amber-950/30 dark:via-slate-900/60 dark:to-amber-900/20 border border-amber-200/70 dark:border-amber-900/40 p-3.5 flex flex-col justify-between overflow-hidden shadow-inner group-hover:border-amber-400 transition-colors">
                  {/* Mock Query Pill */}
                  <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <Search className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="text-[11px] font-mono text-slate-700 dark:text-slate-300 truncate">
                        "commercial hvac near me"
                      </span>
                    </div>
                    <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 shrink-0">
                      Live SERP
                    </span>
                  </div>

                  {/* Rank #1 Card Preview */}
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900/90 border border-amber-300/80 dark:border-amber-700/60 shadow-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-mono font-black text-[10px]">
                          #1
                        </span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white font-display">
                          Google 3-Pack Winner
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        ▲ +240% YoY
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-amber-500">
                      {'★'.repeat(5)}
                      <span className="ml-1 text-slate-500 dark:text-slate-400 font-mono text-[10px]">
                        5.0 (140+ verified reviews)
                      </span>
                    </div>
                  </div>

                  {/* AI Citation Snippet */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-100/70 dark:bg-amber-950/50 border border-amber-300/60 dark:border-amber-800/50 text-[10px] text-amber-900 dark:text-amber-300 font-mono">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span className="truncate">Cited by ChatGPT & Perplexity AI Search</span>
                  </div>
                </div>

                <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  SEO That Actually Ranks
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Whether you need to dominate the Map Pack in a twenty-mile radius, rank across an entire state for commercial contracts, or get cited by AI tools like ChatGPT and Perplexity, I build the SEO strategy around where your customers are actually searching.
                </p>

                <ul className="space-y-3 pt-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                    <span>Local SEO and Map Pack optimization for businesses serving a specific town or metro area</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                    <span>National and regional SEO for commercial and industrial contractors, plus AEO/GEO work so AI search engines cite your business directly</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <Link
                  to="/seo"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-900 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 transition-colors group/link cursor-pointer"
                >
                  <span>See all SEO services</span>
                  <span className="transition-transform group-hover/link:translate-x-1 font-bold">→</span>
                </Link>
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-amber-600/70 dark:text-amber-400/70 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-200/50 dark:border-amber-800/40">
                  Rankings
                </span>
              </div>
            </div>

            {/* Pillar 2: High-Speed Websites & Care */}
            <div className="group relative p-7 sm:p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:border-sky-400/80 dark:hover:border-sky-500/80 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-6">
                {/* SaaS Micro-UI Graphic 2: Developer Lighthouse & Edge Performance Console */}
                <div className="w-full h-52 rounded-2xl bg-gradient-to-b from-sky-500/5 via-slate-50 to-sky-500/10 dark:from-sky-950/30 dark:via-slate-900/60 dark:to-sky-900/20 border border-sky-200/70 dark:border-sky-900/40 p-3.5 flex flex-col justify-between overflow-hidden shadow-inner group-hover:border-sky-400 transition-colors">
                  {/* Browser Console Window Bar */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-400">
                      <Lock className="w-2.5 h-2.5 text-emerald-500" />
                      <span>builtbymiguel.net</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold text-sky-600 dark:text-sky-400">
                      SSR Edge
                    </span>
                  </div>

                  {/* Core Web Vitals Inspection Box */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                      <div className="text-base font-black font-mono text-emerald-600 dark:text-emerald-400">
                        100
                      </div>
                      <div className="text-[9px] font-mono uppercase text-slate-500 dark:text-slate-400">
                        Perf
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                      <div className="text-base font-black font-mono text-emerald-600 dark:text-emerald-400">
                        0.38s
                      </div>
                      <div className="text-[9px] font-mono uppercase text-slate-500 dark:text-slate-400">
                        FCP
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                      <div className="text-base font-black font-mono text-emerald-600 dark:text-emerald-400">
                        0.00
                      </div>
                      <div className="text-[9px] font-mono uppercase text-slate-500 dark:text-slate-400">
                        CLS
                      </div>
                    </div>
                  </div>

                  {/* Live Care / Hosting Status Badge */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sky-100/70 dark:bg-sky-950/50 border border-sky-300/60 dark:border-sky-800/50 text-[10px] text-sky-900 dark:text-sky-300 font-mono">
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                    <span className="truncate">Daily Edge Backups • 99.99% Uptime Monitored</span>
                  </div>
                </div>

                <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  High-Speed Websites & Care
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Your site is built as a custom React application, not assembled from a page-builder theme. That means faster load times, a tap-to-call setup that actually works on mobile, and no plugin conflicts to manage. Once it launches, ongoing hosting and care keep it that way.
                </p>

                <ul className="space-y-3 pt-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-2 shrink-0" />
                    <span>Custom design and development, built to load under a second on mobile</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-2 shrink-0" />
                    <span>Edge hosting, SSL, backups, and monthly updates after launch</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <Link
                  to="/websites"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-900 dark:text-sky-400 hover:text-sky-600 dark:hover:text-sky-300 transition-colors group/link cursor-pointer"
                >
                  <span>See website design and hosting and care plans</span>
                  <span className="transition-transform group-hover/link:translate-x-1 font-bold">→</span>
                </Link>
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-sky-600/70 dark:text-sky-400/70 bg-sky-50 dark:bg-sky-950/40 px-2 py-0.5 rounded-md border border-sky-200/50 dark:border-sky-800/40">
                  React SSR
                </span>
              </div>
            </div>

            {/* Pillar 3: Custom Systems & Automation */}
            <div className="group relative p-7 sm:p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:border-purple-400/80 dark:hover:border-purple-500/80 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-6">
                {/* SaaS Micro-UI Graphic 3: Real-Time Lead Ingestion & Instant SMS Pipeline */}
                <div className="w-full h-52 rounded-2xl bg-gradient-to-b from-purple-500/5 via-slate-50 to-purple-500/10 dark:from-purple-950/30 dark:via-slate-900/60 dark:to-purple-900/20 border border-purple-200/70 dark:border-purple-900/40 p-3.5 flex flex-col justify-between overflow-hidden shadow-inner group-hover:border-purple-400 transition-colors">
                  {/* Live Pipeline Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-purple-500" />
                      <span className="text-xs font-bold text-slate-900 dark:text-white font-display">
                        Lead Dispatch Engine
                      </span>
                    </div>
                    <span className="flex items-center gap-1 text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live 24/7
                    </span>
                  </div>

                  {/* Pipeline Step Flow */}
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900/90 border border-purple-200/80 dark:border-purple-800/60 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-semibold">
                        <MessageSquare className="w-3.5 h-3.5 text-purple-500" />
                        <span>Form / Phone Call</span>
                      </div>
                      <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-bold">
                        ⚡ &lt;15s dispatch
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-3 h-3" /> Owner SMS Dispatched
                      </span>
                      <span>CRM Updated</span>
                    </div>
                  </div>

                  {/* Operational Guarantee Pill */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-100/70 dark:bg-purple-950/50 border border-purple-300/60 dark:border-purple-800/50 text-[10px] text-purple-900 dark:text-purple-300 font-mono">
                    <Smartphone className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                    <span className="truncate">Zero Missed Leads • Automated Follow-up</span>
                  </div>
                </div>

                <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  Custom Systems & Automation
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  When a lead comes in, it is routed to a CRM, texted to your phone, and logged in a client portal automatically. No lead sits in an inbox waiting for someone to notice it.
                </p>

                <ul className="space-y-3 pt-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0" />
                    <span>Lead CRM pipelines with instant SMS alerts</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0" />
                    <span>Client intake automation and internal dashboards</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <Link
                  to="/systems-auto"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-900 dark:text-purple-400 hover:text-purple-600 dark:hover:text-purple-300 transition-colors group/link cursor-pointer"
                >
                  <span>Learn more about automated lead systems and CRM pipelines</span>
                  <span className="transition-transform group-hover/link:translate-x-1 font-bold">→</span>
                </Link>
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-purple-600/70 dark:text-purple-400/70 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded-md border border-purple-200/50 dark:border-purple-800/40">
                  Workflows
                </span>
              </div>
            </div>
          </div>

          {/* CTA row */}
          <div className="mt-12 sm:mt-14 flex items-center justify-start">
            <Link
              to="/audit"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 dark:bg-amber-400 dark:hover:bg-amber-300 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Request Your Tailored Growth Plan</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: WHY WORK DIRECTLY WITH THE PERSON WHO BUILDS IT                */}
      {/* ========================================================================= */}
      <section className="relative w-full py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0B0F17] transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
            {/* Left Column (roughly 40% width): Text block & link */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/40">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Zero Agency Bureaucracy
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight leading-tight">
                Why Work Directly With the Person Who Builds It
              </h2>

              <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                A traditional digital marketing agency for small business sells you a retainer, then routes your account through layers of staff you will never talk to. I skip that structure entirely. Every site, every automation, and every SEO fix is something I build and test myself, so there is no gap between the person making promises and the person doing the work.
              </p>

              <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                That also means faster turnaround on changes. When something needs fixing, you are not waiting for a ticket to move through a queue. You are telling the person who can fix it directly.
              </p>

              <div className="pt-2">
                <Link
                  to="/work"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-900 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 transition-colors group cursor-pointer"
                >
                  <span>See real project examples on the client work page</span>
                  <span className="transition-transform group-hover:translate-x-1 font-bold">→</span>
                </Link>
              </div>
            </div>

            {/* Right Column (roughly 60% width): Testimonials Set with Speech Bubble Cards */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
                  What Clients Say
                </h3>

                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                  <span className="ml-1.5 font-mono text-xs font-bold text-slate-500 dark:text-slate-400">5.0 / 5.0</span>
                </div>
              </div>

              {/* Testimonial Card 1 */}
              <div className="relative p-6 sm:p-7 rounded-3xl bg-slate-50/90 dark:bg-[#111827]/90 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 hover:border-amber-400/60 dark:hover:border-amber-500/60 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 px-2 py-0.5 rounded-full font-semibold">
                    Verified Feedback
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic font-normal">
                  "Before this, our leads went into a shared inbox and half of them got a callback the next day, if we remembered. Now a missed call gets a text back automatically, and it is probably why we stopped losing jobs to the first contractor who calls back."
                </p>
                <div className="text-xs font-bold text-slate-900 dark:text-white font-display pt-1 flex items-center justify-between">
                  <span>James, HVAC Company Owner</span>
                  <span className="text-[11px] font-mono text-slate-400 font-normal">Austin, TX</span>
                </div>
              </div>

              {/* Testimonial Card 2 */}
              <div className="relative p-6 sm:p-7 rounded-3xl bg-slate-50/90 dark:bg-[#111827]/90 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 hover:border-amber-400/60 dark:hover:border-amber-500/60 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 px-2 py-0.5 rounded-full font-semibold">
                    Verified Feedback
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic font-normal">
                  "Our old site took almost 6 seconds to load on a phone. The new one is instant, and calls from the site actually started showing up the same week it went live."
                </p>
                <div className="text-xs font-bold text-slate-900 dark:text-white font-display pt-1 flex items-center justify-between">
                  <span>Maria, Landscaping Business Owner</span>
                  <span className="text-[11px] font-mono text-slate-400 font-normal">Orlando, FL</span>
                </div>
              </div>

              {/* Testimonial Card 3 */}
              <div className="relative p-6 sm:p-7 rounded-3xl bg-slate-50/90 dark:bg-[#111827]/90 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 hover:border-amber-400/60 dark:hover:border-amber-500/60 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 px-2 py-0.5 rounded-full font-semibold">
                    Verified Feedback
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic font-normal">
                  "I liked that I was talking to the person actually building the site instead of an account manager. Changes happened in a day instead of a week."
                </p>
                <div className="text-xs font-bold text-slate-900 dark:text-white font-display pt-1 flex items-center justify-between">
                  <span>David, Plumbing Contractor</span>
                  <span className="text-[11px] font-mono text-slate-400 font-normal">Denver, CO</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: COMPARISON TABLE (High-Contrast SaaS Side-by-Side Cards)      */}
      {/* ========================================================================= */}
      <section className="relative w-full py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-[#0B0F17] dark:via-[#0E131F] dark:to-[#0B0F17] transition-colors duration-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              Honest Breakdown
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
              Traditional Agency vs. built by Miguel
            </h2>
          </div>

          {/* Modern Comparison Layout (2-Column Side-by-Side Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
            {/* Column 1: Traditional Agency (Muted tone with X marks) */}
            <div className="p-7 sm:p-9 rounded-3xl bg-slate-100/80 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 flex flex-col justify-between">
              <div>
                <div className="pb-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                      Other Options
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-700 dark:text-slate-300">
                      Traditional Agency
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    Retainer Model
                  </span>
                </div>

                <div className="space-y-4 pt-6">
                  <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5 text-slate-500">
                      <XIcon className="w-3.5 h-3.5" />
                    </div>
                    <span>Cookie-cutter WordPress theme</span>
                  </div>

                  <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5 text-slate-500">
                      <XIcon className="w-3.5 h-3.5" />
                    </div>
                    <span>Care and support plans starting around $300+ per month</span>
                  </div>

                  <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5 text-slate-500">
                      <XIcon className="w-3.5 h-3.5" />
                    </div>
                    <span>Junior account manager relays your requests</span>
                  </div>

                  <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5 text-slate-500">
                      <XIcon className="w-3.5 h-3.5" />
                    </div>
                    <span>Vanity-metric PDF reports once a month</span>
                  </div>

                  <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5 text-slate-500">
                      <XIcon className="w-3.5 h-3.5" />
                    </div>
                    <span>SEO, website, and automation handled by separate vendors</span>
                  </div>

                  <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5 text-slate-500">
                      <XIcon className="w-3.5 h-3.5" />
                    </div>
                    <span>Slow turnaround through a support queue</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: built by Miguel (Accent tone with Checkmarks & Glowing Edge) */}
            <div className="p-7 sm:p-9 rounded-3xl bg-white dark:bg-[#111827] border-2 border-slate-900 dark:border-amber-400 shadow-2xl space-y-6 relative overflow-hidden flex flex-col justify-between">
              {/* Highlight ribbon badge */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-bl-full pointer-events-none -z-0" />

              <div>
                <div className="pb-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between relative z-10">
                  <div>
                    <span className="text-xs font-mono uppercase font-bold tracking-wider text-amber-600 dark:text-amber-400 block mb-1">
                      The Modern Standard
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
                      built by Miguel
                    </h3>
                  </div>
                  <span className="px-3.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-900 text-white dark:bg-amber-400 dark:text-slate-950 shadow-xs">
                    Direct Founder
                  </span>
                </div>

                <div className="space-y-4 pt-6 relative z-10">
                  <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-900 dark:text-slate-100 font-medium">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 flex items-center justify-center shrink-0 mt-0.5 text-emerald-700 dark:text-emerald-400 shadow-2xs">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>Custom-built React website</span>
                  </div>

                  <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-900 dark:text-slate-100 font-medium">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 flex items-center justify-center shrink-0 mt-0.5 text-emerald-700 dark:text-emerald-400 shadow-2xs">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>Care plans starting at $99 per month</span>
                  </div>

                  <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-900 dark:text-slate-100 font-medium">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 flex items-center justify-center shrink-0 mt-0.5 text-emerald-700 dark:text-emerald-400 shadow-2xs">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>Direct access to the person building your site</span>
                  </div>

                  <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-900 dark:text-slate-100 font-medium">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 flex items-center justify-center shrink-0 mt-0.5 text-emerald-700 dark:text-emerald-400 shadow-2xs">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>Real work you can see and ask about directly</span>
                  </div>

                  <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-900 dark:text-slate-100 font-medium">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 flex items-center justify-center shrink-0 mt-0.5 text-emerald-700 dark:text-emerald-400 shadow-2xs">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>One connected system, built by one person</span>
                  </div>

                  <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-900 dark:text-slate-100 font-medium">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 flex items-center justify-center shrink-0 mt-0.5 text-emerald-700 dark:text-emerald-400 shadow-2xs">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>Response within 24 business hours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6: FAQ                                                            */}
      {/* ========================================================================= */}
      <section className="relative w-full py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0B0F17] transition-colors duration-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/40">
              Answers & Transparency
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          {/* Accordion Component (Centered, Max Width ~750px) */}
          <div className="max-w-[760px] mx-auto space-y-3.5">
            {FAQ_ITEMS.map((faq, index) => {
              const isOpen = openFaqIndex === index
              return (
                <div
                  key={faq.question}
                  className={`rounded-3xl transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'bg-amber-50/90 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700/60 p-5 sm:p-6 shadow-md'
                      : 'bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 p-5 shadow-xs'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 text-left focus:outline-none cursor-pointer"
                  >
                    <h3 className="font-bold font-display text-sm sm:text-base text-slate-900 dark:text-white pr-2">
                      {faq.question}
                    </h3>
                    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0 text-slate-700 dark:text-slate-300 shadow-2xs">
                      {isOpen ? (
                        <Minus className="w-3.5 h-3.5" />
                      ) : (
                        <Plus className="w-3.5 h-3.5" />
                      )}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-3.5 border-t border-amber-200/60 dark:border-amber-900/40 font-normal">
                      {faq.answer}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 7: CLOSING CTA                                                    */}
      {/* ========================================================================= */}
      <section className="relative w-full py-20 sm:py-28 bg-[#0B0F17] dark:bg-[#070A0F] text-white border-t border-slate-800 overflow-hidden">
        {/* Ambient mesh glow for Closing CTA */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[750px] h-[350px] bg-gradient-to-b from-amber-500/15 via-rose-500/5 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          {/* Eyebrow kicker (not a heading) */}
          <div>
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-amber-400 bg-amber-400/10 border border-amber-400/30 px-3.5 py-1.5 rounded-full inline-block">
              Ready When You Are
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-white tracking-tight leading-tight max-w-2xl mx-auto">
            Get a Digital Marketing System Built by One Founder, Not an Agency
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            Stop splitting your SEO, website, and lead follow-up across three vendors who don't talk to each other. Start with a free 5-minute audit and see exactly what's costing you leads right now.
          </p>

          <div className="flex items-center justify-center pt-4">
            <Link
              to="/audit"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-all duration-200 shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Start Your Free 5-Minute Audit</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
