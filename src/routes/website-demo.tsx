import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Code2,
  Calendar,
  Layers,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import { submitDemoLead } from '../server/leads'

export const Route = createFileRoute('/website-demo')({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      {
        title: 'Free Website Demo & Mockup for Contractors | built by Miguel',
      },
      {
        name: 'description',
        content:
          'Get a free website demo and custom website mockup for your trade business. Tell me about your company and I will build a real working preview.',
      },
      {
        name: 'keywords',
        content:
          'free website demo, website mockup, contractor website demo, contractor website mockup, built by miguel',
      },
      // OpenGraph
      { property: 'og:type', content: 'website' },
      {
        property: 'og:title',
        content: 'Free Website Demo & Mockup for Contractors | built by Miguel',
      },
      {
        property: 'og:description',
        content:
          'Tell me about your business. I will build a real working website preview and send it back within three business days.',
      },
      { property: 'og:url', content: 'https://builtbymiguel.net/website-demo' },
      { property: 'og:image', content: 'https://builtbymiguel.net/og-image.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: 'https://builtbymiguel.net/og-image.png' },
    ],
    links: [
      {
        rel: 'canonical',
        href: 'https://builtbymiguel.net/website-demo',
      },
    ],
  }),
  component: WebsiteDemoPage,
})

function WebsiteDemoPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    businessName: '',
    trade: '',
    websiteUrl: '',
    email: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})
    setServerError(null)

    const newErrors: Record<string, string> = {}
    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Please enter your business name'
    }
    if (!formData.trade.trim()) {
      newErrors.trade = 'Please enter your industry or trade'
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsSubmitting(false)
      return
    }

    try {
      const result = await submitDemoLead({ data: formData })
      if (result.success) {
        navigate({ to: '/thank-you' })
      } else {
        setIsSubmitting(false)
        if (result.errors) {
          setErrors(result.errors)
        } else {
          setServerError(result.message || 'Something went wrong. Please try again.')
        }
      }
    } catch (err) {
      setIsSubmitting(false)
      setServerError('An unexpected error occurred. Please try again or reach out directly.')
    }
  }

  return (
    <div className="w-full bg-[#FAF8F5] dark:bg-[#0B0F17] transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 py-12 sm:py-16 md:py-20 space-y-16 sm:space-y-24">
        {/* Soft Ambient Light Glow */}
        <div className="relative text-center max-w-3xl mx-auto">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-amber-400/20 via-orange-400/10 to-transparent blur-[130px] rounded-full pointer-events-none -z-10" />

          {/* Header */}
          <div className="mb-6 sm:mb-8 flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-semibold tracking-wider uppercase text-amber-800 dark:text-amber-300 bg-amber-100/90 dark:bg-amber-950/50 border border-amber-300/80 dark:border-amber-700/50 shadow-xs">
              <Sparkles className="w-3.5 h-3.5" /> Free Interactive Demo
            </div>
          </div>

          <h1 className="text-4xl sm:text-6xl font-display font-bold tracking-tight text-slate-900 dark:text-white leading-[1.12] mb-6 sm:mb-8">
            Get a Free Preview of Your{' '}
            <span className="text-amber-600 dark:text-amber-400">
              New Website.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed font-normal">
            Tell me about your business. I'll build a real working preview and send it back.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 sm:p-10 shadow-sm dark:shadow-none space-y-6">
          <div className="space-y-1 border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">
              Your Business Details
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tell me what you do so I can customize the layout, copy, and service buttons for your trade.
            </p>
          </div>

          {serverError && (
            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Business Name */}
            <div className="space-y-2">
              <label
                htmlFor="demo-businessName"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
              >
                Business Name <span className="text-amber-600 dark:text-amber-400">*</span>
              </label>
              <input
                id="demo-businessName"
                type="text"
                required
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                placeholder="e.g. Apex Roofing & Exteriors"
                className={`w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none transition-colors ${
                  errors.businessName
                    ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'border-slate-200 dark:border-slate-700 focus:border-amber-500 dark:focus:border-amber-400 focus:ring-1 focus:ring-amber-500 dark:focus:ring-amber-400'
                }`}
              />
              {errors.businessName && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.businessName}</span>
                </p>
              )}
            </div>

            {/* Industry or Trade */}
            <div className="space-y-2">
              <label
                htmlFor="demo-trade"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
              >
                Industry or Trade <span className="text-amber-600 dark:text-amber-400">*</span>
              </label>
              <input
                id="demo-trade"
                type="text"
                required
                value={formData.trade}
                onChange={(e) => setFormData({ ...formData, trade: e.target.value })}
                placeholder="e.g. Roofing, Plumbing, HVAC, Remodeling"
                className={`w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none transition-colors ${
                  errors.trade
                    ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'border-slate-200 dark:border-slate-700 focus:border-amber-500 dark:focus:border-amber-400 focus:ring-1 focus:ring-amber-500 dark:focus:ring-amber-400'
                }`}
              />
              {errors.trade && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.trade}</span>
                </p>
              )}
            </div>

            {/* Current Website URL (optional) */}
            <div className="space-y-2">
              <label
                htmlFor="demo-website"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
              >
                Current Website URL{' '}
                <span className="text-slate-400 dark:text-slate-500 font-normal lowercase">(optional)</span>
              </label>
              <input
                id="demo-website"
                type="text"
                value={formData.websiteUrl}
                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                placeholder="e.g. apexroofing.com (or leave blank if new)"
                className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-amber-500 dark:focus:border-amber-400 focus:ring-1 focus:ring-amber-500 dark:focus:ring-amber-400 transition-colors"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <label
                htmlFor="demo-email"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
              >
                Where Should I Send the Preview? <span className="text-amber-600 dark:text-amber-400">*</span>
              </label>
              <input
                id="demo-email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@company.com"
                className={`w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none transition-colors ${
                  errors.email
                    ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'border-slate-200 dark:border-slate-700 focus:border-amber-500 dark:focus:border-amber-400 focus:ring-1 focus:ring-amber-500 dark:focus:ring-amber-400'
                }`}
              />
              {errors.email && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-base bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Generating Preview Request...</span>
                  </>
                ) : (
                  <>
                    <span>Build My Free Website Demo</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Three Short Trust Points Below the Form */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mx-auto" />
              <div className="text-xs font-bold text-slate-900 dark:text-white">100% Free</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">No credit card or payment needed.</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-1">
              <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 mx-auto" />
              <div className="text-xs font-bold text-slate-900 dark:text-white">No Obligation to Buy</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Zero pressure and no sales calls.</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-1">
              <ExternalLink className="w-4 h-4 text-cyan-600 dark:text-cyan-400 mx-auto" />
              <div className="text-xs font-bold text-slate-900 dark:text-white">You Keep the Link</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">The preview link stays yours either way.</div>
            </div>
          </div>
        </div>

        {/* What Happens Next Section */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 sm:p-10 shadow-sm dark:shadow-none space-y-6">
          <div className="space-y-1">
            <div className="text-xs font-mono font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Clear Process
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white">
              What Happens Next
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              Here is exactly how I handle your request once you submit your trade details.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-amber-600 dark:text-amber-400 shrink-0">
                <Code2 className="w-5 h-5" />
              </div>
              <div className="space-y-1 text-xs sm:text-sm">
                <strong className="text-slate-900 dark:text-white block font-semibold text-sm font-display">
                  1. I Build the Preview by Hand
                </strong>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  I do not use generic drag-and-drop website builders or automated layout generators. I write clean custom React code tailored to your exact services, local area, and trade branding.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-orange-600 dark:text-orange-400 shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="space-y-1 text-xs sm:text-sm">
                <strong className="text-slate-900 dark:text-white block font-semibold text-sm font-display">
                  2. Delivery Takes Three Business Days
                </strong>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  Because I assemble the code, structure the mobile call flow, and test page speed personally, delivery takes three business days from when you submit this form.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-cyan-600 dark:text-cyan-400 shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div className="space-y-1 text-xs sm:text-sm">
                <strong className="text-slate-900 dark:text-white block font-semibold text-sm font-display">
                  3. A Real Live Working Link
                </strong>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  I send you a private live link that you can open on your phone or computer. You get to tap the buttons, test the load speed, and see how your website feels in real life, not a flat PDF or static picture.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
