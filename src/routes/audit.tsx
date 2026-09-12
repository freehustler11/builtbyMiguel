import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  Sparkles,
  Send,
  Clock,
  Search,
  Check,
  AlertCircle,
  Zap,
} from 'lucide-react'
import { useState } from 'react'
import { submitAuditLead } from '../server/leads'

export const Route = createFileRoute('/audit')({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      {
        title: 'Claim Your Free 5-Minute Local Visibility Audit',
      },
      {
        name: 'description',
        content:
          'Get a free 5-minute video audit of your Google Maps rankings, mobile site speed, and local competitors. Delivered in 24 hours.',
      },
      {
        name: 'keywords',
        content:
          'free local seo audit, website performance audit, google map pack check, free local visibility video',
      },
      // OpenGraph
      { property: 'og:type', content: 'website' },
      {
        property: 'og:title',
        content: 'Claim Your Free 5-Minute Local Visibility Audit | built by Miguel',
      },
      {
        property: 'og:description',
        content:
          'Free 5-minute video audit of your Google Maps rankings and site speed delivered in 24 hours.',
      },
      { property: 'og:url', content: 'https://builtbymiguel.net/audit' },
      { property: 'og:image', content: 'https://builtbymiguel.net/og-image.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: 'https://builtbymiguel.net/og-image.png' },
    ],
    links: [
      {
        rel: 'canonical',
        href: 'https://builtbymiguel.net/audit',
      },
    ],
  }),
  component: AuditPage,
})

function AuditPage() {
  const navigate = useNavigate()
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

  const handleSubmit = async (e: React.FormEvent) => {
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
    <div className="w-full bg-[#FAF8F5] dark:bg-[#0B0F17] transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 py-12 sm:py-16 md:py-20 space-y-16 sm:space-y-24">
        {/* Soft Ambient Light Glow Matching Homepage */}
        <div className="relative text-center max-w-3xl mx-auto">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-amber-400/20 via-orange-400/10 to-transparent blur-[130px] rounded-full pointer-events-none -z-10" />

          {/* Header */}
          <div className="mb-6 sm:mb-8 flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-semibold tracking-wider uppercase text-amber-800 dark:text-amber-300 bg-amber-100/90 dark:bg-amber-950/50 border border-amber-300/80 dark:border-amber-700/50 shadow-xs">
              <Sparkles className="w-3.5 h-3.5" /> 100% Free · 24-Hour Turnaround
            </div>
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight text-slate-900 dark:text-white leading-[1.12] mb-6 sm:mb-8">
            Get Your Free{' '}
            <span className="text-amber-600 dark:text-amber-400">
              Local Video Audit
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            I will record a 5-minute video showing where your business ranks on Google Maps, how fast your site loads, and where competitors win calls.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form */}
          <div className="lg:col-span-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 sm:p-10 shadow-sm dark:shadow-none space-y-6">
            <div className="space-y-1 border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">Your Business Details</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Where should I send your private video review?</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div className="space-y-2">
                <label htmlFor="audit-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Your Name <span className="text-amber-600 dark:text-amber-400">*</span>
                </label>
                <input
                  id="audit-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Miguel Sanchez"
                  className={`w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none transition-colors ${
                    errors.name
                      ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                      : 'border-slate-200 dark:border-slate-700 focus:border-amber-500 dark:focus:border-amber-400 focus:ring-1 focus:ring-amber-500 dark:focus:ring-amber-400'
                  }`}
                />
                {errors.name && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.name}</span>
                  </p>
                )}
              </div>

              {/* Business Name */}
              <div className="space-y-2">
                <label htmlFor="audit-business" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Business Name <span className="text-amber-600 dark:text-amber-400">*</span>
                </label>
                <input
                  id="audit-business"
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  placeholder="e.g. Sanchez Plumbing & HVAC"
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

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="audit-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Email Address <span className="text-amber-600 dark:text-amber-400">*</span>
                </label>
                <input
                  id="audit-email"
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

              {/* Primary City / Area */}
              <div className="space-y-2">
                <label htmlFor="audit-city" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Primary Service City / Area <span className="text-amber-600 dark:text-amber-400">*</span>
                </label>
                <input
                  id="audit-city"
                  type="text"
                  required
                  value={formData.cityArea}
                  onChange={(e) => setFormData({ ...formData, cityArea: e.target.value })}
                  placeholder="e.g. Austin, TX & surrounding suburbs"
                  className={`w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none transition-colors ${
                    errors.cityArea
                      ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                      : 'border-slate-200 dark:border-slate-700 focus:border-amber-500 dark:focus:border-amber-400 focus:ring-1 focus:ring-amber-500 dark:focus:ring-amber-400'
                  }`}
                />
                {errors.cityArea && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.cityArea}</span>
                  </p>
                )}
              </div>

              {/* Website URL */}
              <div className="space-y-2">
                <label htmlFor="audit-url" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Current Website <span className="text-slate-400 font-normal lowercase">(optional)</span>
                </label>
                <input
                  id="audit-url"
                  type="url"
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  placeholder="https://www.yourbusiness.com"
                  className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-amber-500 dark:focus:border-amber-400 focus:ring-1 focus:ring-amber-500 dark:focus:ring-amber-400 transition-colors"
                />
              </div>

              {/* Primary Goal Dropdown */}
              <div className="space-y-2">
                <label htmlFor="audit-goal" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  What is your biggest current priority?
                </label>
                <select
                  id="audit-goal"
                  value={formData.primaryGoal}
                  onChange={(e) => setFormData({ ...formData, primaryGoal: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-amber-500 dark:focus:border-amber-400 focus:ring-1 focus:ring-amber-500 dark:focus:ring-amber-400 transition-colors"
                >
                  <option value="Google Map Pack Visibility" className="dark:bg-slate-900">Increase Google Map Pack Visibility</option>
                  <option value="Website Speed & Rebuild" className="dark:bg-slate-900">Rebuild Slow Website / Improve Conversion</option>
                  <option value="Custom CRM & Lead Automation" className="dark:bg-slate-900">Automate Lead Capture & Operations</option>
                  <option value="All of the above" className="dark:bg-slate-900">All of the above (Full Growth Stack)</option>
                </select>
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

              <p className="text-center text-xs text-slate-500 dark:text-slate-400 font-sans">
                100% confidential. No sales pressure and no spam. Delivered directly to your email in 24 hours.
              </p>
            </form>
          </div>

          {/* Right Column: Breakdown Bullets */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 sm:p-8 space-y-6 shadow-sm dark:shadow-none">
              {/* Reviewer Header */}
              <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
                <img
                  src="/miguel-umbac.png"
                  alt="Miguel Umbac"
                  className="w-16 h-16 rounded-2xl object-cover object-top shadow-md border border-slate-100 dark:border-slate-800"
                />
                <div>
                  <div className="text-base font-display font-bold text-slate-900 dark:text-white">Miguel Umbac</div>
                  <div className="text-xs font-mono text-amber-600 dark:text-amber-400 font-semibold">Founder & Systems Auditor</div>
                </div>
              </div>

              <h3 className="text-base font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Search className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>What I Cover in Your 5-Min Video:</span>
              </h3>

              <ul className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-3">
                  <div className="p-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-900 dark:text-white font-semibold">See your Google Maps ranking across your entire service area.</span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="p-1 rounded-lg bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 mt-0.5">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-900 dark:text-white font-semibold">Test your mobile load speed and see why visitors leave.</span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="p-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-900 dark:text-white font-semibold">Find the listings and keywords your top competitors use to get calls.</span>
                  </div>
                </li>
              </ul>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400 font-mono">
                <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Private video delivered to your email within 24 hours.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
