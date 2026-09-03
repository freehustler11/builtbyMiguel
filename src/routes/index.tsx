import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import {
  Search,
  Globe,
  Cpu,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  Send,
  Check,
  AlertCircle,
  Code2,
} from 'lucide-react'
import { useState } from 'react'
import { submitAuditLead } from '../server/leads'
import { CodeTerminalInspector } from '../components/CodeTerminalInspector'
import { InteractiveComparisonCard } from '../components/InteractiveComparisonCard'

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
        title:
          'Built by Miguel | Local SEO, Fast Websites & Custom Business Systems',
      },
      {
        name: 'description',
        content:
          'High-speed React websites, verified local search optimization, and custom lead automation workflows for local businesses and contractors.',
      },
      {
        name: 'keywords',
        content:
          'local seo services, google business profile optimization, custom web development, small business automation, built by miguel',
      },
      // OpenGraph
      { property: 'og:type', content: 'website' },
      {
        property: 'og:title',
        content:
          'Built by Miguel | Local SEO, Fast Websites & Custom Business Systems',
      },
      {
        property: 'og:description',
        content:
          'High-speed React websites, verified local search optimization, and custom lead automation workflows.',
      },
      { property: 'og:url', content: 'https://builtbymiguel.net' },
      { property: 'og:image', content: 'https://builtbymiguel.net/og-image.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: 'https://builtbymiguel.net/og-image.png' },
    ],
    links: [
      {
        rel: 'canonical',
        href: 'https://builtbymiguel.net',
      },
    ],
  }),
  component: HomePage,
})

function HomePage() {
  const navigate = useNavigate()

  // Form submission state
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    email: '',
    cityArea: '',
    websiteUrl: '',
    primaryGoal: 'Google Map Pack Visibility',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitAudit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    const result = await submitAuditLead({ data: formData })

    if (result.success) {
      navigate({ to: '/thank-you' })
    } else {
      setIsSubmitting(false)
      if (result.errors) {
        setErrors(result.errors)
      }
    }
  }

  return (
    <div className="space-y-24 sm:space-y-32 lg:space-y-36 py-6 sm:py-10">
      {/* =========================================================================
          SECTION 1: HERO SECTION
          ========================================================================= */}
      <section className="relative overflow-hidden pt-4 pb-2 sm:pt-8 sm:pb-4 text-center">
        {/* Soft Ambient Light Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-rose-200/40 via-orange-100/30 to-teal-100/40 dark:from-rose-500/15 dark:via-orange-500/10 dark:to-teal-500/15 blur-[130px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto">
          {/* Top Uppercase Kicker Badge */}
          <div className="mb-8 sm:mb-10 flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-rose-600 dark:text-rose-400 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
              </span>
              <span>HIGH-PERFORMANCE LOCAL SYSTEMS</span>
            </div>
          </div>

          {/* Dual-Tone Main H1 */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.12] mb-6 sm:mb-8">
            Modern Local SEO, Fast Websites, and{' '}
            <span className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 bg-clip-text text-transparent">
              Automated Lead Pipelines.
            </span>
          </h1>

          {/* Subhead / Lead Paragraph */}
          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto font-normal">
            We engineer high-speed React websites, optimize Google Business Profiles for sustainable local search visibility, and build automated lead workflows for trade contractors and local businesses.
          </p>

          {/* Dual Pill CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 sm:pt-8">
            <a
              href="#audit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-base text-white bg-slate-900 dark:bg-rose-600 hover:bg-black dark:hover:bg-rose-500 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-rose-400 dark:text-white fill-rose-400 dark:fill-white" />
              <span>Claim Your Free 5-Min Audit</span>
            </a>

            <Link
              to="/work"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-base text-slate-800 dark:text-slate-200 hover:text-black dark:hover:text-white bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow transition-all duration-200"
            >
              <span>Explore Systems & Work</span>
              <ArrowRight className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            </Link>
          </div>

          {/* Friction-Reduction Microcopy */}
          <div className="pt-3 sm:pt-4 text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>100% Free · Custom video breakdown · No high-pressure sales calls</span>
          </div>

          {/* 3-Point Proof Bar */}
          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Optimized Google Map Pack</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
              <span>Fast React Architecture</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
              <span>Automated Lead Dispatch</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: CORE SERVICES PILLARS (3 WHITE CARDS)
          ========================================================================= */}
      <section className="space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-[11px] font-mono uppercase tracking-widest text-rose-600 dark:text-rose-400 font-bold">
            Core Service Pillars
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            Everything Your Business Needs to Scale Locally
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Engineered solutions built without bloat. High-ranking search assets, modern web applications, and automatic operations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Card 1: Local SEO & Google Maps */}
          <div className="group relative flex flex-col justify-between p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-emerald-500/40 dark:hover:border-emerald-500/50 hover:shadow-xl transition-all duration-300 shadow-sm dark:shadow-none">
            <div className="space-y-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                <Search className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>

              <div className="space-y-2">
                <div className="text-[10px] font-mono font-bold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">
                  RANKING ACQUISITION
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  Local SEO & Google Maps
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Turn Google Search and Maps into a dependable customer channel with systematic local optimization.
                </p>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Google Map Pack search optimization</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>100% NAP citation cleanup across 50+ directories</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Automated 5-star review acceleration</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>AI search engine citations (ChatGPT, Gemini, Perplexity)</span>
                </li>
              </ul>
            </div>

            <div className="pt-8 mt-6 border-t border-slate-100 dark:border-slate-800">
              <Link
                to="/local-seo-gbp"
                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 group-hover:translate-x-1 transition-all"
              >
                <span>Explore Local SEO Solutions</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: High-Speed Websites & Care */}
          <div className="group relative flex flex-col justify-between p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-cyan-500/40 dark:hover:border-cyan-500/50 hover:shadow-xl transition-all duration-300 shadow-sm dark:shadow-none">
            <div className="space-y-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-100 dark:border-cyan-800/40 flex items-center justify-center text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
                <Globe className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>

              <div className="space-y-2">
                <div className="text-[10px] font-mono font-bold tracking-widest text-cyan-600 dark:text-cyan-400 uppercase">
                  HIGH-PERFORMANCE ARCHITECTURE
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  High-Speed Websites & Care
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Bespoke web applications built for fast load times, instant mobile responsiveness, and high conversion.
                </p>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                  <span>Fast mobile page speeds without heavy plugins</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                  <span>Frictionless thumb-friendly tap-to-call buttons</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                  <span>High-speed global edge hosting & SSL</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                  <span>Monthly 24/7 care, backups, and proactive updates</span>
                </li>
              </ul>
            </div>

            <div className="pt-8 mt-6 border-t border-slate-100 dark:border-slate-800">
              <Link
                to="/websites-care"
                className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 group-hover:translate-x-1 transition-all"
              >
                <span>Explore Websites & Care Plans</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 3: Custom Systems & Workflows */}
          <div className="group relative flex flex-col justify-between p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-orange-500/40 dark:hover:border-orange-500/50 hover:shadow-xl transition-all duration-300 shadow-sm dark:shadow-none">
            <div className="space-y-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-100 dark:border-orange-800/40 flex items-center justify-center text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">
                <Cpu className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>

              <div className="space-y-2">
                <div className="text-[10px] font-mono font-bold tracking-widest text-orange-600 dark:text-orange-400 uppercase">
                  OPERATIONAL LEVERAGE
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  Custom Systems & Workflows
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Eliminate repetitive busywork. Connect forms, CRMs, booking software, and client portals into one seamless engine.
                </p>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
                  <span>Custom lead CRM pipelines & instant SMS alerts</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
                  <span>Zero-touch client intake & onboarding workflows</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
                  <span>Custom internal tools & business dashboards</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
                  <span>Client portal integration & reporting dashboard</span>
                </li>
              </ul>
            </div>

            <div className="pt-8 mt-6 border-t border-slate-100 dark:border-slate-800">
              <Link
                to="/systems-auto"
                className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 group-hover:translate-x-1 transition-all"
              >
                <span>Explore Custom Automations</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2.5: ARCHITECTURAL COMPARISON (BUILT BY MIGUEL VS LEGACY AGENCY)
          ========================================================================= */}
      <section className="space-y-6">
        <InteractiveComparisonCard />
      </section>

      {/* =========================================================================
          SECTION 3: CODE & SYSTEM INSPECTOR SHOWCASE
          ========================================================================= */}
      <section className="space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400">
            <Code2 className="w-3.5 h-3.5" /> DEVELOPER-GRADE AUTOMATION
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            Automated Logic. Zero Fragility.
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Inspect the underlying TypeScript and schema payloads that power client pipelines.
          </p>
        </div>

        {/* Tabbed Code Inspector Widget */}
        <CodeTerminalInspector />
      </section>

      {/* =========================================================================
          SECTION 4: 3-STEP PROCESS
          ========================================================================= */}
      <section className="space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-[11px] font-mono uppercase tracking-widest text-rose-600 dark:text-rose-400 font-bold">
            Simple 3-Step Execution
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            How We Turn Search Traffic into Booked Revenue
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            A proven, data-driven framework designed to establish market dominance and streamline your operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="p-8 rounded-[2rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] space-y-4 shadow-sm dark:shadow-none">
            <div className="text-4xl font-bold font-mono text-cyan-600 dark:text-cyan-400">
              01
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Visibility Audit
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Identify ranking leaks, mobile speed bottlenecks, competitor citation gaps, and website conversion drop-offs.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-8 rounded-[2rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] space-y-4 shadow-sm dark:shadow-none">
            <div className="text-4xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              02
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Build & Rank
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Launch speed-optimized pages, synchronize local directory citations, optimize Google Business Profile, and send hyper-local geo-signals.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-8 rounded-[2rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] space-y-4 shadow-sm dark:shadow-none">
            <div className="text-4xl font-bold font-mono text-orange-600 dark:text-orange-400">
              03
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Automate & Scale
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Connect automated lead follow-ups, CRM workflows, and live client reporting so you can focus strictly on fulfilling client work.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: LEAD MAGNET AUDIT FORM SECTION (id="audit")
          ========================================================================= */}
      <section id="audit" className="relative rounded-[3rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-8 sm:p-12 lg:p-16 shadow-xl dark:shadow-none overflow-hidden transition-colors duration-200">
        {/* Soft Ambient Light Glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-rose-100/40 dark:bg-rose-500/10 blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto space-y-10">
          <div className="text-center">
            <div className="mb-6 sm:mb-8 flex justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-rose-600 dark:text-rose-400 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" /> 100% Free · No Obligation
              </div>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white tracking-tight leading-[1.15] mb-5 sm:mb-6">
              Get Your Free Local Visibility Audit
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl mx-auto font-normal mb-8 sm:mb-10">
              I will record a 5-minute video showing where your business is losing calls on Google Maps and how to fix it within 24 hours.
            </p>

            {/* 3-Step Process Expectations */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-left">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 flex items-start gap-2.5">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-mono text-xs font-bold shrink-0">1</span>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Enter Details</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">Submit your city & website below.</div>
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 flex items-start gap-2.5">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-mono text-xs font-bold shrink-0">2</span>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Founder Analysis</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">Miguel pulls live geo-rankings.</div>
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 flex items-start gap-2.5">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-mono text-xs font-bold shrink-0">3</span>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Video in 24 Hours</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">Loom video delivered to inbox.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmitAudit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="space-y-2">
                <label htmlFor="home-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="home-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Miguel Sanchez"
                  className={`w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none transition-colors ${
                    errors.name
                      ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                      : 'border-slate-200 dark:border-slate-800 focus:border-slate-900 dark:focus:border-rose-500 focus:ring-1 focus:ring-slate-900 dark:focus:ring-rose-500'
                  }`}
                />
                {errors.name && (
                  <p className="text-xs text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.name}</span>
                  </p>
                )}
              </div>

              {/* Business Name */}
              <div className="space-y-2">
                <label htmlFor="home-business" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Business Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="home-business"
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  placeholder="e.g. Sanchez Plumbing & HVAC"
                  className={`w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none transition-colors ${
                    errors.businessName
                      ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                      : 'border-slate-200 dark:border-slate-800 focus:border-slate-900 dark:focus:border-rose-500 focus:ring-1 focus:ring-slate-900 dark:focus:ring-rose-500'
                  }`}
                />
                {errors.businessName && (
                  <p className="text-xs text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.businessName}</span>
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <label htmlFor="home-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  id="home-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@company.com"
                  className={`w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none transition-colors ${
                    errors.email
                      ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                      : 'border-slate-200 dark:border-slate-800 focus:border-slate-900 dark:focus:border-rose-500 focus:ring-1 focus:ring-slate-900 dark:focus:ring-rose-500'
                  }`}
                />
                {errors.email && (
                  <p className="text-xs text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              {/* Primary City / Area */}
              <div className="space-y-2">
                <label htmlFor="home-city" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Primary City / Area <span className="text-rose-500">*</span>
                </label>
                <input
                  id="home-city"
                  type="text"
                  required
                  value={formData.cityArea}
                  onChange={(e) => setFormData({ ...formData, cityArea: e.target.value })}
                  placeholder="e.g. Austin, TX & surrounding"
                  className={`w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none transition-colors ${
                    errors.cityArea
                      ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                      : 'border-slate-200 dark:border-slate-800 focus:border-slate-900 dark:focus:border-rose-500 focus:ring-1 focus:ring-slate-900 dark:focus:ring-rose-500'
                  }`}
                />
                {errors.cityArea && (
                  <p className="text-xs text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.cityArea}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Website URL (Optional) */}
            <div className="space-y-2">
              <label htmlFor="home-website" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Current Website <span className="text-slate-400 dark:text-slate-500 font-normal lowercase">(optional)</span>
              </label>
              <input
                id="home-website"
                type="url"
                value={formData.websiteUrl}
                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                placeholder="https://www.yourbusiness.com"
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-slate-900 dark:focus:border-rose-500 focus:ring-1 focus:ring-slate-900 dark:focus:ring-rose-500 transition-colors"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-base text-white bg-slate-900 dark:bg-rose-600 hover:bg-black dark:hover:bg-rose-500 shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Preparing Your Audit Request...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 fill-white" />
                    <span>Send Me the Free Video Audit</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-center text-xs text-slate-500 dark:text-slate-400">
              No sales pressure. No automated junk. A real 5-minute video recorded personally by Miguel Umbac analyzing your exact local market opportunities.
            </p>
          </form>
        </div>
      </section>
    </div>
  )
}
