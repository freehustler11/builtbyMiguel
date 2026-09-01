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
} from 'lucide-react'
import { useState } from 'react'
import { submitAuditLead } from '../server/leads'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      {
        title:
          'Built by Miguel | Local SEO, Fast Websites & Custom Business Systems',
      },
      {
        name: 'description',
        content:
          'I build high-speed websites, rank local businesses in the top 3 on Google Maps, and automate daily operations so you get steady, qualified calls.',
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
        content: 'Built by Miguel | High-Performance Websites & Local SEO Systems',
      },
      {
        property: 'og:description',
        content:
          'Get found on Google, cited by AI, and booked with fast systems.',
      },
      { property: 'og:url', content: 'https://builtbymiguel.com' },
      { property: 'og:image', content: 'https://builtbymiguel.com/og-image.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: 'https://builtbymiguel.com/og-image.png' },
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
    primaryGoal: 'Google Map Pack Top 3',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitAudit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    const result = await submitAuditLead(formData)

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
    <div className="space-y-24 sm:space-y-32">
      {/* =========================================================================
          SECTION 1: HERO SECTION
          ========================================================================= */}
      <section className="relative overflow-hidden pt-6 pb-12 sm:pt-12 sm:pb-16">
        {/* Ambient Glow Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300 shadow-inner">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>Open for new client partnerships</span>
          </div>

          {/* Main H1 */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
            Get found on Google, cited by AI, and booked with{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              fast systems.
            </span>
          </h1>

          {/* Subhead / Lead Paragraph */}
          <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
            I build high-speed websites, rank local businesses in the top 3 on Google Maps, and automate daily operations so you get steady, qualified calls.
          </p>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              href="#audit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-bold text-base text-slate-950 bg-emerald-500 hover:bg-emerald-400 shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 fill-slate-950" />
              <span>Claim Your Free 5-Min Audit</span>
            </a>

            <Link
              to="/work"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-semibold text-base text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all duration-200"
            >
              <span>Explore Systems & Work</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 3-Point Proof Bar */}
          <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs sm:text-sm font-medium text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Top 3 Google Map Pack</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Sub-second site speeds</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Hands-off automation</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: CORE SERVICES GRID (3 CARDS)
          ========================================================================= */}
      <section className="space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
            Core Service Pillars
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Everything your business needs to scale locally
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Engineered solutions built without bloat. High-ranking search assets, modern web applications, and automatic operations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Card 1: Local SEO & Google Maps */}
          <div className="group relative flex flex-col justify-between p-8 rounded-3xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900/90 hover:border-emerald-500/40 transition-all duration-300">
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Search className="w-6 h-6" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Local SEO & Google Maps
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Turn Google Search and Maps into your #1 customer acquisition channel with surgical local optimization.
                </p>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300 font-medium">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Google Map Pack top 3 domination</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>100% NAP citation cleanup across 50+ directories</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Automated 5-star review acceleration</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>AI search engine citations (ChatGPT, Gemini, Perplexity)</span>
                </li>
              </ul>
            </div>

            <div className="pt-8 mt-6 border-t border-slate-800/80">
              <Link
                to="/local-seo-gbp"
                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 group-hover:translate-x-1 transition-all"
              >
                <span>Explore Local SEO Solutions</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: High-Speed Websites & Care */}
          <div className="group relative flex flex-col justify-between p-8 rounded-3xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900/90 hover:border-emerald-500/40 transition-all duration-300">
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                  High-Speed Websites & Care
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Bespoke web applications built for sub-second load times, instant mobile responsiveness, and high conversion.
                </p>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300 font-medium">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Sub-second mobile speed (&lt; 800ms)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Frictionless thumb-friendly tap-to-call buttons</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>High-speed global edge hosting & SSL</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Monthly 24/7 care, backups, and proactive updates</span>
                </li>
              </ul>
            </div>

            <div className="pt-8 mt-6 border-t border-slate-800/80">
              <Link
                to="/websites-care"
                className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 group-hover:translate-x-1 transition-all"
              >
                <span>Explore Websites & Care Plans</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 3: Custom Systems & Workflows */}
          <div className="group relative flex flex-col justify-between p-8 rounded-3xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900/90 hover:border-emerald-500/40 transition-all duration-300">
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <Cpu className="w-6 h-6" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                  Custom Systems & Workflows
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Eliminate repetitive busywork. Connect forms, CRMs, booking software, and client portals into one seamless engine.
                </p>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300 font-medium">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Custom lead CRM pipelines & instant SMS alerts</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Zero-touch client intake & onboarding workflows</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Custom internal tools & business dashboards</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Client portal integration (`app.builtbymiguel.com`)</span>
                </li>
              </ul>
            </div>

            <div className="pt-8 mt-6 border-t border-slate-800/80">
              <Link
                to="/systems-auto"
                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 group-hover:translate-x-1 transition-all"
              >
                <span>Explore Custom Automations</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: IN-HOUSE SYSTEMS SPOTLIGHT (2 VISUAL SHOWCASE CARDS)
          ========================================================================= */}
      <section className="space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Zap className="w-3.5 h-3.5" /> IN-HOUSE SOFTWARE
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Real systems built for operational leverage
            </h2>
          </div>
          <Link
            to="/work"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <span>View All Architecture & Proof</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: Lead-to-Client CRM Hub */}
          <div className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-xs">
                  CRM-01
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Lead-to-Client CRM Hub</h4>
                  <p className="text-xs text-slate-400">Pipeline preview, instant SMS alerts & call logs</p>
                </div>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                Active Live Trigger
              </span>
            </div>

            {/* Visual Pipeline Frame */}
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  <span className="text-white font-medium">1. Inbound Form / Call Log</span>
                </div>
                <span className="text-slate-500">Auto-Enriched Lead Data</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-white font-medium">2. Instant SMS & Email Alert</span>
                </div>
                <span className="text-emerald-400">&lt; 30s Latency</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                  <span className="text-white font-medium">3. Proposal Sent & Paid Retainer</span>
                </div>
                <span className="text-slate-400">1-Click Stripe Checkout</span>
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-400 leading-relaxed">
              Eliminates manual lead entry, connects directly to Stripe/QuickBooks, and ensures no high-value inquiry is left unanswered.
            </div>
          </div>

          {/* Card 2: Automated Client Onboarding */}
          <div className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 font-mono text-xs">
                  AUTO-02
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Automated Client Onboarding</h4>
                  <p className="text-xs text-slate-400">Intake questionnaires, asset sync & contracts</p>
                </div>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                Zero Friction
              </span>
            </div>

            {/* Visual Workflow Steps */}
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-white font-medium">1. Automated Welcome Kit & Agreement</span>
                </div>
                <span className="text-slate-400">Sent Instantly</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="text-white font-medium">2. Google Drive & Asset Intake Questionnaire</span>
                </div>
                <span className="text-slate-400">Folders Auto-Created</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  <span className="text-white font-medium">3. Portal Provisioning (`app.builtbymiguel.com`)</span>
                </div>
                <span className="text-cyan-300">Live Client Dashboard</span>
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-400 leading-relaxed">
              Clients receive their portal credentials, kickoff agenda, and asset checklist within seconds of invoice completion.
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: 3-STEP PROCESS
          ========================================================================= */}
      <section className="space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
            Simple 3-Step Execution
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How we turn search traffic into booked revenue
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            A proven, data-driven framework designed to establish market dominance and streamline your operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/40 relative space-y-4">
            <div className="text-4xl font-black font-mono text-slate-800">
              01
            </div>
            <h3 className="text-xl font-bold text-white">
              Visibility Audit
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Identify ranking leaks, mobile speed bottlenecks, competitor citation gaps, and website conversion drop-offs.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/40 relative space-y-4">
            <div className="text-4xl font-black font-mono text-slate-800">
              02
            </div>
            <h3 className="text-xl font-bold text-white">
              Build & Rank
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Launch speed-optimized pages, synchronize local directory citations, optimize Google Business Profile, and send hyper-local geo-signals.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/40 relative space-y-4">
            <div className="text-4xl font-black font-mono text-slate-800">
              03
            </div>
            <h3 className="text-xl font-bold text-white">
              Automate & Scale
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Connect automated lead follow-ups, CRM workflows, and live client reporting so you can focus strictly on fulfilling client work.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: LEAD MAGNET AUDIT FORM SECTION (id="audit")
          ========================================================================= */}
      <section id="audit" className="relative rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-900 to-slate-950 p-8 sm:p-12 lg:p-16 shadow-2xl overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" /> 100% Free · No Obligation
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Get Your Free Local Visibility Audit
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
              I will record a 5-minute video showing where your business is losing calls on Google Maps and how to fix it within 24 hours.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmitAudit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="space-y-2">
                <label htmlFor="home-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Full Name <span className="text-emerald-400">*</span>
                </label>
                <input
                  id="home-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Miguel Sanchez"
                  className={`w-full px-4 py-3.5 rounded-xl bg-slate-950 border text-white placeholder-slate-500 text-sm focus:outline-none transition-colors ${
                    errors.name
                      ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                      : 'border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                  }`}
                />
                {errors.name && (
                  <p className="text-xs text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.name}</span>
                  </p>
                )}
              </div>

              {/* Business Name */}
              <div className="space-y-2">
                <label htmlFor="home-business" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Business Name <span className="text-emerald-400">*</span>
                </label>
                <input
                  id="home-business"
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  placeholder="e.g. Sanchez Plumbing & HVAC"
                  className={`w-full px-4 py-3.5 rounded-xl bg-slate-950 border text-white placeholder-slate-500 text-sm focus:outline-none transition-colors ${
                    errors.businessName
                      ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                      : 'border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                  }`}
                />
                {errors.businessName && (
                  <p className="text-xs text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.businessName}</span>
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <label htmlFor="home-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Email Address <span className="text-emerald-400">*</span>
                </label>
                <input
                  id="home-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@company.com"
                  className={`w-full px-4 py-3.5 rounded-xl bg-slate-950 border text-white placeholder-slate-500 text-sm focus:outline-none transition-colors ${
                    errors.email
                      ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                      : 'border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                  }`}
                />
                {errors.email && (
                  <p className="text-xs text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              {/* Primary City / Area */}
              <div className="space-y-2">
                <label htmlFor="home-city" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Primary City / Area <span className="text-emerald-400">*</span>
                </label>
                <input
                  id="home-city"
                  type="text"
                  required
                  value={formData.cityArea}
                  onChange={(e) => setFormData({ ...formData, cityArea: e.target.value })}
                  placeholder="e.g. Austin, TX & surrounding"
                  className={`w-full px-4 py-3.5 rounded-xl bg-slate-950 border text-white placeholder-slate-500 text-sm focus:outline-none transition-colors ${
                    errors.cityArea
                      ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                      : 'border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                  }`}
                />
                {errors.cityArea && (
                  <p className="text-xs text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.cityArea}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Website URL (Optional) */}
            <div className="space-y-2">
              <label htmlFor="home-website" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Current Website <span className="text-slate-500 font-normal lowercase">(optional)</span>
              </label>
              <input
                id="home-website"
                type="url"
                value={formData.websiteUrl}
                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                placeholder="https://www.yourbusiness.com"
                className="w-full px-4 py-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-base text-slate-950 bg-emerald-500 hover:bg-emerald-400 shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Preparing Your Audit Request...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 fill-slate-950" />
                    <span>Send Me the Free Video Audit</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-center text-xs text-slate-500">
              No sales pressure. No automated junk. A real 5-minute video recorded by Miguel analyzing your exact local market opportunities.
            </p>
          </form>
        </div>
      </section>
    </div>
  )
}
