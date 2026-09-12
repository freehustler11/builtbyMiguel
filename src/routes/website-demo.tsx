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
    <div className="relative space-y-12 sm:space-y-16 py-8 sm:py-12 max-w-2xl mx-auto">
      {/* Soft Ambient Light Glow Matching Other Pillar Pages */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[550px] h-[320px] bg-gradient-to-tr from-rose-200/40 via-orange-100/30 to-teal-100/40 dark:from-rose-500/15 dark:via-orange-500/10 dark:to-teal-500/15 blur-[130px] rounded-full pointer-events-none -z-10" />

      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-rose-600 dark:text-rose-400 shadow-sm backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" /> Free Interactive Demo
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
          Get a Free Preview of Your{' '}
          <span className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 bg-clip-text text-transparent">
            New Website.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed font-normal">
          Tell me about your business. I'll build a real working preview and send it back.
        </p>
      </div>

      {/* Form Card */}
      <div className="rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 sm:p-10 shadow-xl dark:shadow-none space-y-6">
        <div className="space-y-1 border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            Your Business Details
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tell me what you do so I can customize the layout, copy, and service buttons for your trade.
          </p>
        </div>

        {serverError && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
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
              Business Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="demo-businessName"
              type="text"
              required
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              placeholder="e.g. Apex Roofing & Exteriors"
              className={`w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none transition-colors ${
                errors.businessName
                  ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                  : 'border-slate-200 dark:border-slate-700 focus:border-slate-900 dark:focus:border-rose-500 focus:ring-1 focus:ring-slate-900 dark:focus:ring-rose-500'
              }`}
            />
            {errors.businessName && (
              <p className="text-xs text-rose-500 flex items-center gap-1">
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
              Industry or Trade <span className="text-rose-500">*</span>
            </label>
            <input
              id="demo-trade"
              type="text"
              required
              value={formData.trade}
              onChange={(e) => setFormData({ ...formData, trade: e.target.value })}
              placeholder="e.g. Roofing, Plumbing, HVAC, Remodeling"
              className={`w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none transition-colors ${
                errors.trade
                  ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                  : 'border-slate-200 dark:border-slate-700 focus:border-slate-900 dark:focus:border-rose-500 focus:ring-1 focus:ring-slate-900 dark:focus:ring-rose-500'
              }`}
            />
            {errors.trade && (
              <p className="text-xs text-rose-500 flex items-center gap-1">
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
              className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-slate-900 dark:focus:border-rose-500 focus:ring-1 focus:ring-slate-900 dark:focus:ring-rose-500 transition-colors"
            />
          </div>

          {/* Email Address */}
          <div className="space-y-2">
            <label
              htmlFor="demo-email"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
            >
              Where Should I Send the Preview? <span className="text-rose-500">*</span>
            </label>
            <input
              id="demo-email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="you@company.com"
              className={`w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none transition-colors ${
                errors.email
                  ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                  : 'border-slate-200 dark:border-slate-700 focus:border-slate-900 dark:focus:border-rose-500 focus:ring-1 focus:ring-slate-900 dark:focus:ring-rose-500'
              }`}
            />
            {errors.email && (
              <p className="text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold text-white bg-slate-900 dark:bg-rose-600 hover:bg-black dark:hover:bg-rose-500 disabled:opacity-50 disabled:pointer-events-none transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer text-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating Preview Request...</span>
              </>
            ) : (
              <>
                <span>Build My Free Website Demo</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Three Short Trust Points Below the Form */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mx-auto" />
            <div className="text-xs font-bold text-slate-900 dark:text-white">100% Free</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">No credit card or payment needed.</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-1">
            <ShieldCheck className="w-4 h-4 text-rose-600 dark:text-rose-400 mx-auto" />
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
      <div className="rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 sm:p-10 shadow-lg dark:shadow-none space-y-6">
        <div className="space-y-1">
          <div className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
            Clear Process
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            What Happens Next
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Here is exactly how I handle your request once you submit your trade details.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-rose-600 dark:text-rose-400 shrink-0">
              <Code2 className="w-5 h-5" />
            </div>
            <div className="space-y-1 text-xs sm:text-sm">
              <strong className="text-slate-900 dark:text-white block font-semibold text-sm">
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
              <strong className="text-slate-900 dark:text-white block font-semibold text-sm">
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
              <strong className="text-slate-900 dark:text-white block font-semibold text-sm">
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
  )
}
