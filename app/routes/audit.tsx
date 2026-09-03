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
          'Request a personalized 5-minute video breakdown of your Google Map Pack ranking, website speed bottlenecks, and competitor gaps. Delivered in 24 hours.',
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
          'Personalized 5-minute video breakdown of your local ranking and site performance sent within 24 hours.',
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
    <div className="space-y-20 sm:space-y-28 lg:space-y-32 py-8 sm:py-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="mb-8 sm:mb-10 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-rose-600 dark:text-rose-400 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" /> 100% Free · 24-Hour Turnaround
          </div>
        </div>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.12] mb-6 sm:mb-8">
          Get Your Free{' '}
          <span className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 bg-clip-text text-transparent">
            Local Visibility Audit
          </span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          I will record a personalized 5-minute video breakdown analyzing your Google Map Pack ranking, mobile speed, and competitor gaps.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form */}
        <div className="lg:col-span-7 rounded-[3rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 sm:p-10 shadow-xl dark:shadow-none space-y-6">
          <div className="space-y-1 border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Your Business Details</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Where should I send your video breakdown?</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <label htmlFor="audit-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Your Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="audit-name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Miguel Sanchez"
                className={`w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none transition-colors ${
                  errors.name
                    ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                    : 'border-slate-200 dark:border-slate-700 focus:border-slate-900 dark:focus:border-rose-500 focus:ring-1 focus:ring-slate-900 dark:focus:ring-rose-500'
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
              <label htmlFor="audit-business" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Business Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="audit-business"
                type="text"
                required
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                placeholder="e.g. Sanchez Plumbing & HVAC"
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

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="audit-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                id="audit-email"
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

            {/* Primary City / Area */}
            <div className="space-y-2">
              <label htmlFor="audit-city" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Primary Service City / Area <span className="text-rose-500">*</span>
              </label>
              <input
                id="audit-city"
                type="text"
                required
                value={formData.cityArea}
                onChange={(e) => setFormData({ ...formData, cityArea: e.target.value })}
                placeholder="e.g. Austin, TX & surrounding suburbs"
                className={`w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none transition-colors ${
                  errors.cityArea
                    ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                    : 'border-slate-200 dark:border-slate-700 focus:border-slate-900 dark:focus:border-rose-500 focus:ring-1 focus:ring-slate-900 dark:focus:ring-rose-500'
                }`}
              />
              {errors.cityArea && (
                <p className="text-xs text-rose-500 flex items-center gap-1">
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
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-slate-900 dark:focus:border-rose-500 focus:ring-1 focus:ring-slate-900 dark:focus:ring-rose-500 transition-colors"
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
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-slate-900 dark:focus:border-rose-500 focus:ring-1 focus:ring-slate-900 dark:focus:ring-rose-500 transition-colors"
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
              100% confidential. No sales calls, no spam. Delivered directly to your email in 24 business hours.
            </p>
          </form>
        </div>

        {/* Right Column: Breakdown Bullets */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-[3rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 sm:p-8 space-y-6 shadow-xl dark:shadow-none">
            {/* Reviewer Header */}
            <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
              <img
                src="/miguel-umbac.png"
                alt="Miguel Umbac"
                className="w-16 h-16 rounded-2xl object-cover object-top shadow-md border border-slate-100 dark:border-slate-800"
              />
              <div>
                <div className="text-base font-bold text-slate-900 dark:text-white">Miguel Umbac</div>
                <div className="text-xs font-mono text-rose-600 dark:text-rose-400 font-semibold">Founder & Systems Auditor</div>
              </div>
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-rose-500 dark:text-rose-400" />
              <span>What I Cover in Your 5-Min Video:</span>
            </h3>

            <ul className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-3">
                <div className="p-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mt-0.5">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-slate-900 dark:text-white block font-semibold">Google Map Pack Heatmap:</strong>
                  See exactly where you drop off across your service radius.
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="p-1 rounded-lg bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-slate-900 dark:text-white block font-semibold">Mobile Speed Test:</strong>
                  Real Core Web Vitals diagnostics and bounce risks.
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="p-1 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 mt-0.5">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-slate-900 dark:text-white block font-semibold">Competitor Citation Gaps:</strong>
                  The exact directories and schema tags your top competitors have.
                </div>
              </li>
            </ul>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400 font-mono">
              <Clock className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0" />
              <span>Delivered via private Loom video in &lt; 24 business hours.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
