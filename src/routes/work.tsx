import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Layers,
  Sparkles,
  Zap,
  Bot,
  BarChart3,
  CreditCard,
  Lock,
  Cpu,
  X,
  Maximize2,
} from 'lucide-react'
import { useState, useEffect } from 'react'

export const Route = createFileRoute('/work')({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      {
        title: 'Client Work & Proof | built by Miguel',
      },
      {
        name: 'description',
        content:
          'Real search performance data, in-house tools, and website builds. See actual results and design work, not stock case studies.',
      },
      {
        name: 'keywords',
        content:
          'custom business systems, internal software showcase, local seo case studies, lead crm automation, small business tools, search console performance data',
      },
      // OpenGraph
      { property: 'og:type', content: 'website' },
      {
        property: 'og:title',
        content: 'Client Work & Proof | built by Miguel',
      },
      {
        property: 'og:description',
        content:
          'Real search performance data, in-house tools, and website builds. See actual results and design work, not stock case studies.',
      },
      { property: 'og:url', content: 'https://builtbymiguel.net/work' },
      { property: 'og:image', content: 'https://builtbymiguel.net/og-image.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
      {
        name: 'twitter:title',
        content: 'Client Work & Proof | built by Miguel',
      },
      {
        name: 'twitter:description',
        content:
          'Real search performance data, in-house tools, and website builds. See actual results and design work, not stock case studies.',
      },
      { name: 'twitter:image', content: 'https://builtbymiguel.net/og-image.png' },
    ],
    links: [
      {
        rel: 'canonical',
        href: 'https://builtbymiguel.net/work',
      },
    ],
  }),
  component: WorkPage,
})

function WorkPage() {
  const [lightbox, setLightbox] = useState<{
    src: string
    alt: string
    title?: string
  } | null>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
    }
    if (lightbox) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [lightbox])

  return (
    <div className="w-full bg-[#FAF8F5] dark:bg-[#0B0F17] transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 py-12 sm:py-16 md:py-20 space-y-24 sm:space-y-32">
        {/* =========================================================================
            SECTION 1: Hero
            ========================================================================= */}
        <section className="relative text-center max-w-4xl mx-auto">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-amber-400/20 via-orange-400/10 to-transparent blur-[130px] rounded-full pointer-events-none -z-10" />

          <div className="mb-6 sm:mb-8 flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-semibold tracking-wider uppercase text-amber-800 dark:text-amber-300 bg-amber-100/90 dark:bg-amber-950/50 border border-amber-300/80 dark:border-amber-700/50 shadow-xs">
              <Layers className="w-3.5 h-3.5" /> Architecture & Proof
            </div>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight text-slate-900 dark:text-white leading-[1.12] mb-6 sm:mb-8">
            Software and Systems Built In-House
          </h1>

          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto font-normal">
            A clear look at the internal tools, automation workflows, and fast websites built and run in-house.
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 shadow-sm mt-6">
            <Lock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Showing system previews and sanitized data. No private client information is shown.</span>
          </div>
        </section>

        {/* =========================================================================
            SECTION 2: In-House Tools
            ========================================================================= */}
        <section className="space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-100/90 dark:bg-amber-950/50 border border-amber-300/80 dark:border-amber-700/50">
              In-House Tools
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              Custom Tools and Automation Engines
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Software built to remove manual work and help local clients win more jobs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Card 1: CRM-01 */}
            <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 sm:p-8 space-y-6 shadow-sm dark:shadow-none flex flex-col justify-between hover:border-amber-400/60 hover:shadow-lg transition-all duration-300">
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <Zap className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-bold">
                    CRM-01 · Fast Response
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
                    Lead-to-Client CRM
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Tracks incoming leads with instant text message alerts, email notifications, and phone call logs. Built with React and fast edge functions. Active Tool
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="text-[11px] font-mono">React & Edge Functions</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active Tool
                </span>
              </div>
            </div>

            {/* Card 2: AUTO-02 */}
            <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 sm:p-8 space-y-6 shadow-sm dark:shadow-none flex flex-col justify-between hover:border-cyan-400/60 hover:shadow-lg transition-all duration-300">
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-100 dark:border-cyan-800/40 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-bold">
                    AUTO-02 · Easy Setup
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
                    Onboarding Engine
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Sends online intake forms, digital agreements, and shared project folders automatically. Automated with webhooks and cloud storage. Active Tool
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="text-[11px] font-mono">Webhooks & Cloud Storage</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active Tool
                </span>
              </div>
            </div>

            {/* Card 3: AI-03 */}
            <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 sm:p-8 space-y-6 shadow-sm dark:shadow-none flex flex-col justify-between hover:border-orange-400/60 hover:shadow-lg transition-all duration-300">
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="w-10 h-10 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-100 dark:border-orange-800/40 flex items-center justify-center text-orange-600 dark:text-orange-400">
                    <Bot className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-bold">
                    AI-03 · Audit Tools
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
                    AI Audit Workspace
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Generates local SEO audits, maps ranking coordinates, and drafts localized service pages. Powered by local data engines and schema tools. Active Tool
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="text-[11px] font-mono">Local Data & Schema</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active Tool
                </span>
              </div>
            </div>

            {/* Card 4: DASH-04 */}
            <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 sm:p-8 space-y-6 shadow-sm dark:shadow-none flex flex-col justify-between hover:border-emerald-400/60 hover:shadow-lg transition-all duration-300">
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-bold">
                    DASH-04 · Live Visibility
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
                    Operations Dashboard
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Gives clients a live look at monthly rankings, deliverables, traffic trends, and billing. Built with modern web frameworks and live databases. Active Tool
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="text-[11px] font-mono">Modern Frameworks & DB</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active Tool
                </span>
              </div>
            </div>

            {/* Card 5: PAY-05 */}
            <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 sm:p-8 space-y-6 shadow-sm dark:shadow-none flex flex-col justify-between hover:border-cyan-400/60 hover:shadow-lg transition-all duration-300 md:col-span-2 lg:col-span-1">
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-100 dark:border-cyan-800/40 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-bold">
                    PAY-05 · Simple Billing
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
                    Payment Tracker
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Handles recurring retainer payments, automated billing receipts, and card renewals. Connected to Stripe with secure webhooks. Active Tool
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="text-[11px] font-mono">Stripe & Secure Webhooks</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active Tool
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 3: Portfolio
            ========================================================================= */}
        <section className="space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-100/90 dark:bg-amber-950/50 border border-amber-300/80 dark:border-amber-700/50">
              Design & Build Portfolio
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              Sites Built From Scratch
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1: SEO Consultancy Website */}
            <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] overflow-hidden shadow-sm dark:shadow-none flex flex-col justify-between group hover:border-amber-400/60 transition-all duration-300">
              <div className="p-6 sm:p-8 space-y-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wide uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                    Tag: Personal Project
                  </span>
                  <button
                    onClick={() =>
                      setLightbox({
                        src: '/images/work/portfolio-seo-consultancy.webp',
                        alt: 'SEO Consultancy Website',
                        title: 'SEO Consultancy Website — Full Screenshot',
                      })
                    }
                    className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-amber-500 transition font-mono cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>View full</span>
                  </button>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
                    SEO Consultancy Website
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    A personal SEO brand site built to showcase services and drive free-audit signups, with a bold dark theme and fast, lightweight code.
                  </p>
                </div>

                {/* Verified PageSpeed Score Badges */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono">
                  <button
                    type="button"
                    onClick={() =>
                      setLightbox({
                        src: '/images/work/pagespeed-mobile.webp',
                        alt: 'PageSpeed Mobile Score 99',
                        title: 'Google PageSpeed Insights (Mobile) — 99 Performance',
                      })
                    }
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 hover:border-emerald-500 transition cursor-pointer"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Mobile: 99 Performance
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setLightbox({
                        src: '/images/work/pagespeed-desktop.webp',
                        alt: 'PageSpeed Desktop Score 99',
                        title: 'Google PageSpeed Insights (Desktop) — 99 Performance',
                      })
                    }
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 hover:border-emerald-500 transition cursor-pointer"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Desktop: 99 Performance
                  </button>
                </div>
              </div>

              <div
                onClick={() =>
                  setLightbox({
                    src: '/images/work/portfolio-seo-consultancy.webp',
                    alt: 'SEO Consultancy Website',
                    title: 'SEO Consultancy Website — Full Screenshot',
                  })
                }
                className="relative bg-slate-950/40 border-t border-slate-100 dark:border-slate-800/80 p-4 sm:p-6 cursor-pointer group/img"
              >
                <div className="rounded-xl overflow-hidden border border-slate-200/80 dark:border-slate-700/80 shadow-inner bg-slate-900 h-64 sm:h-72 relative">
                  <img
                    src="/images/work/portfolio-seo-consultancy.webp"
                    alt="SEO Consultancy Website"
                    className="w-full object-cover object-top transition-transform duration-500 group-hover/img:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end justify-center p-4 opacity-0 group-hover/img:opacity-100 transition-opacity">
                    <span className="px-4 py-2 rounded-full bg-slate-900/90 text-white text-xs font-mono font-medium border border-slate-700">
                      Click to expand full page
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Dental Clinic Concept */}
            <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] overflow-hidden shadow-sm dark:shadow-none flex flex-col justify-between group hover:border-cyan-400/60 transition-all duration-300">
              <div className="p-6 sm:p-8 space-y-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wide uppercase bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/30">
                    Tag: Demo Build
                  </span>
                  <button
                    onClick={() =>
                      setLightbox({
                        src: '/images/work/portfolio-dental-clinic.webp',
                        alt: 'Dental Clinic Concept',
                        title: 'Dental Clinic Concept — Full Screenshot',
                      })
                    }
                    className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-500 transition font-mono cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>View full</span>
                  </button>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
                    Dental Clinic Concept
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    A patient-friendly clinic design exploring service cards, appointment booking, and a warm, approachable color system.
                  </p>
                </div>
              </div>

              <div
                onClick={() =>
                  setLightbox({
                    src: '/images/work/portfolio-dental-clinic.webp',
                    alt: 'Dental Clinic Concept',
                    title: 'Dental Clinic Concept — Full Screenshot',
                  })
                }
                className="relative bg-slate-950/40 border-t border-slate-100 dark:border-slate-800/80 p-4 sm:p-6 cursor-pointer group/img"
              >
                <div className="rounded-xl overflow-hidden border border-slate-200/80 dark:border-slate-700/80 shadow-inner bg-slate-900 h-64 sm:h-72 relative">
                  <img
                    src="/images/work/portfolio-dental-clinic.webp"
                    alt="Dental Clinic Concept"
                    className="w-full object-cover object-top transition-transform duration-500 group-hover/img:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end justify-center p-4 opacity-0 group-hover/img:opacity-100 transition-opacity">
                    <span className="px-4 py-2 rounded-full bg-slate-900/90 text-white text-xs font-mono font-medium border border-slate-700">
                      Click to expand full page
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: E-Commerce Storefront Concept */}
            <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] overflow-hidden shadow-sm dark:shadow-none flex flex-col justify-between group hover:border-amber-400/60 transition-all duration-300">
              <div className="p-6 sm:p-8 space-y-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wide uppercase bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/30">
                    Tag: Demo Build
                  </span>
                  <button
                    onClick={() =>
                      setLightbox({
                        src: '/images/work/portfolio-ecommerce.webp',
                        alt: 'E-Commerce Storefront Concept',
                        title: 'E-Commerce Storefront Concept — Full Screenshot',
                      })
                    }
                    className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-amber-500 transition font-mono cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>View full</span>
                  </button>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
                    E-Commerce Storefront Concept
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    An online store concept exploring product categories, featured listings, and a bold, high-contrast storefront theme.
                  </p>
                </div>
              </div>

              <div
                onClick={() =>
                  setLightbox({
                    src: '/images/work/portfolio-ecommerce.webp',
                    alt: 'E-Commerce Storefront Concept',
                    title: 'E-Commerce Storefront Concept — Full Screenshot',
                  })
                }
                className="relative bg-slate-950/40 border-t border-slate-100 dark:border-slate-800/80 p-4 sm:p-6 cursor-pointer group/img"
              >
                <div className="rounded-xl overflow-hidden border border-slate-200/80 dark:border-slate-700/80 shadow-inner bg-slate-900 h-64 sm:h-72 relative">
                  <img
                    src="/images/work/portfolio-ecommerce.webp"
                    alt="E-Commerce Storefront Concept"
                    className="w-full object-cover object-top transition-transform duration-500 group-hover/img:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end justify-center p-4 opacity-0 group-hover/img:opacity-100 transition-opacity">
                    <span className="px-4 py-2 rounded-full bg-slate-900/90 text-white text-xs font-mono font-medium border border-slate-700">
                      Click to expand full page
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Law Firm Concept */}
            <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] overflow-hidden shadow-sm dark:shadow-none flex flex-col justify-between group hover:border-cyan-400/60 transition-all duration-300">
              <div className="p-6 sm:p-8 space-y-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wide uppercase bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/30">
                    Tag: Demo Build
                  </span>
                  <button
                    onClick={() =>
                      setLightbox({
                        src: '/images/work/portfolio-law-firm.webp',
                        alt: 'Law Firm Concept',
                        title: 'Law Firm Concept — Full Screenshot',
                      })
                    }
                    className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-500 transition font-mono cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>View full</span>
                  </button>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
                    Law Firm Concept
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    A personal injury law firm concept featuring press mentions, award badges, and case-type breakdowns.
                  </p>
                </div>
              </div>

              <div
                onClick={() =>
                  setLightbox({
                    src: '/images/work/portfolio-law-firm.webp',
                    alt: 'Law Firm Concept',
                    title: 'Law Firm Concept — Full Screenshot',
                  })
                }
                className="relative bg-slate-950/40 border-t border-slate-100 dark:border-slate-800/80 p-4 sm:p-6 cursor-pointer group/img"
              >
                <div className="rounded-xl overflow-hidden border border-slate-200/80 dark:border-slate-700/80 shadow-inner bg-slate-900 h-64 sm:h-72 relative">
                  <img
                    src="/images/work/portfolio-law-firm.webp"
                    alt="Law Firm Concept"
                    className="w-full object-cover object-top transition-transform duration-500 group-hover/img:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end justify-center p-4 opacity-0 group-hover/img:opacity-100 transition-opacity">
                    <span className="px-4 py-2 rounded-full bg-slate-900/90 text-white text-xs font-mono font-medium border border-slate-700">
                      Click to expand full page
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 4: Real Performance Data
            ========================================================================= */}
        <section className="space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-100/90 dark:bg-amber-950/50 border border-amber-300/80 dark:border-amber-700/50">
              Real Client Results
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              Real Search Performance Data
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              Actual Search Console and Semrush data from client accounts. Client details are withheld, most clients prefer not to have their business named publicly, but the numbers themselves are real and unedited.
            </p>
          </div>

          {/* Sub-group 1: 4-card GSC grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Client A */}
            <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 sm:p-8 space-y-5 shadow-sm dark:shadow-none flex flex-col justify-between hover:border-amber-400/60 transition-all duration-300">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white">
                    Client A — 6-Month Search Performance
                  </h3>
                  <button
                    onClick={() =>
                      setLightbox({
                        src: '/images/work/gsc-client-a.webp',
                        alt: 'Client A Search Console Performance',
                        title: 'Client A — Google Search Console Data',
                      })
                    }
                    className="text-slate-400 hover:text-amber-500 transition p-1 cursor-pointer"
                    aria-label="Expand Client A chart"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>

                <div
                  onClick={() =>
                    setLightbox({
                      src: '/images/work/gsc-client-a.webp',
                      alt: 'Client A Search Console Performance',
                      title: 'Client A — Google Search Console Data',
                    })
                  }
                  className="rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 cursor-pointer group/chart"
                >
                  <img
                    src="/images/work/gsc-client-a.webp"
                    alt="Client A Search Console Data"
                    className="w-full object-contain transition-transform duration-300 group-hover/chart:scale-[1.01]"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 font-mono text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Average position: 38.1 → 39.8 Clicks: 1.3K → 1.84K · Impressions: 394K → 536K · CTR: 0.3% → 0.3%
                </div>
              </div>
            </div>

            {/* Client B */}
            <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 sm:p-8 space-y-5 shadow-sm dark:shadow-none flex flex-col justify-between hover:border-amber-400/60 transition-all duration-300">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white">
                    Client B — 6-Month Search Performance
                  </h3>
                  <button
                    onClick={() =>
                      setLightbox({
                        src: '/images/work/gsc-client-b.webp',
                        alt: 'Client B Search Console Performance',
                        title: 'Client B — Google Search Console Data',
                      })
                    }
                    className="text-slate-400 hover:text-amber-500 transition p-1 cursor-pointer"
                    aria-label="Expand Client B chart"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>

                <div
                  onClick={() =>
                    setLightbox({
                      src: '/images/work/gsc-client-b.webp',
                      alt: 'Client B Search Console Performance',
                      title: 'Client B — Google Search Console Data',
                    })
                  }
                  className="rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 cursor-pointer group/chart"
                >
                  <img
                    src="/images/work/gsc-client-b.webp"
                    alt="Client B Search Console Data"
                    className="w-full object-contain transition-transform duration-300 group-hover/chart:scale-[1.01]"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 font-mono text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Average position: 29.5 → 24 Clicks: 478 → 1.21K · Impressions: 70K → 172K · CTR: 0.7% → 0.7%
                </div>
              </div>
            </div>

            {/* Client C */}
            <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 sm:p-8 space-y-5 shadow-sm dark:shadow-none flex flex-col justify-between hover:border-amber-400/60 transition-all duration-300">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white">
                    Client C — 6-Month Search Performance
                  </h3>
                  <button
                    onClick={() =>
                      setLightbox({
                        src: '/images/work/gsc-client-c.webp',
                        alt: 'Client C Search Console Performance',
                        title: 'Client C — Google Search Console Data',
                      })
                    }
                    className="text-slate-400 hover:text-amber-500 transition p-1 cursor-pointer"
                    aria-label="Expand Client C chart"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>

                <div
                  onClick={() =>
                    setLightbox({
                      src: '/images/work/gsc-client-c.webp',
                      alt: 'Client C Search Console Performance',
                      title: 'Client C — Google Search Console Data',
                    })
                  }
                  className="rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 cursor-pointer group/chart"
                >
                  <img
                    src="/images/work/gsc-client-c.webp"
                    alt="Client C Search Console Data"
                    className="w-full object-contain transition-transform duration-300 group-hover/chart:scale-[1.01]"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 font-mono text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Average position: 28.9 → 18.7 Clicks: 22 → 360 · Impressions: 1.2K → 14.2K · CTR: 1.8% → 2.5%
                </div>
              </div>
            </div>

            {/* Client D */}
            <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 sm:p-8 space-y-5 shadow-sm dark:shadow-none flex flex-col justify-between hover:border-amber-400/60 transition-all duration-300">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white">
                    Client D — 6-Month Search Performance
                  </h3>
                  <button
                    onClick={() =>
                      setLightbox({
                        src: '/images/work/gsc-client-d.webp',
                        alt: 'Client D Search Console Performance',
                        title: 'Client D — Google Search Console Data',
                      })
                    }
                    className="text-slate-400 hover:text-amber-500 transition p-1 cursor-pointer"
                    aria-label="Expand Client D chart"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>

                <div
                  onClick={() =>
                    setLightbox({
                      src: '/images/work/gsc-client-d.webp',
                      alt: 'Client D Search Console Performance',
                      title: 'Client D — Google Search Console Data',
                    })
                  }
                  className="rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 cursor-pointer group/chart"
                >
                  <img
                    src="/images/work/gsc-client-d.webp"
                    alt="Client D Search Console Data"
                    className="w-full object-contain transition-transform duration-300 group-hover/chart:scale-[1.01]"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 font-mono text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Average position: 47.2 → 31.6 Clicks: 27 → 390 · Impressions: 4.36K → 42.7K · CTR: 0.6% → 0.9%
                </div>
              </div>
            </div>
          </div>

          {/* Sub-group 2: Featured Semrush Chart */}
          <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 sm:p-10 space-y-6 shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-5">
              <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
                Featured: Organic Keyword Growth
              </h3>
              <button
                onClick={() =>
                  setLightbox({
                    src: '/images/work/semrush-keyword-growth.webp',
                    alt: 'Semrush Organic Keyword Growth Chart',
                    title: 'Featured: Organic Keyword Growth (Semrush)',
                  })
                }
                className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-amber-500 transition cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>View high-res</span>
              </button>
            </div>

            <div
              onClick={() =>
                setLightbox({
                  src: '/images/work/semrush-keyword-growth.webp',
                  alt: 'Semrush Organic Keyword Growth Chart',
                  title: 'Featured: Organic Keyword Growth (Semrush)',
                })
              }
              className="rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 p-2 sm:p-4 cursor-pointer group/semrush"
            >
              <img
                src="/images/work/semrush-keyword-growth.webp"
                alt="Semrush Organic Keyword Growth"
                className="w-full object-contain rounded-xl transition-transform duration-300 group-hover/semrush:scale-[1.01]"
              />
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Six months of organic keyword growth for a client, tracked in Semrush: from a near-standing start to 441 ranking keywords, including movement into the top 10 and top 3 positions.
            </p>
          </div>
        </section>
      </div>

      {/* =========================================================================
          SECTION 5: Closing CTA
          ========================================================================= */}
      <section className="w-full bg-[#0B0F17] dark:bg-[#070A0F] text-white py-16 sm:py-24 border-t border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-semibold tracking-wider uppercase bg-amber-950/50 border border-amber-700/50 text-amber-300">
            <Sparkles className="w-3.5 h-3.5" /> Proven Systems
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight text-white leading-[1.15]">
            Ready for Systems That Bring You More Jobs?
          </h2>

          <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto leading-relaxed font-normal">
            A free 5-minute video audit shows you exactly where you can beat competitors in your local market.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/audit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-base bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-slate-950 fill-current" />
              <span>Claim Your Free 5-Minute Video Audit</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Lightbox Modal */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-white dark:bg-[#111827] rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <span className="text-sm font-display font-bold text-slate-900 dark:text-white">
                {lightbox.title || lightbox.alt}
              </span>
              <button
                type="button"
                onClick={() => setLightbox(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                aria-label="Close image modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 sm:p-6 overflow-auto flex items-center justify-center bg-slate-950/40">
              <img
                src={lightbox.src}
                alt={lightbox.alt}
                className="max-h-[75vh] w-auto object-contain rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
