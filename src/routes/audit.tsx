import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  Sparkles,
  Send,
  Clock,
  Search,
  Check,
  AlertCircle,
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
        content: 'Claim Your Free 5-Minute Local Visibility Audit | Built by Miguel',
      },
      {
        property: 'og:description',
        content:
          'Personalized 5-minute video breakdown of your local ranking and site performance sent within 24 hours.',
      },
      { property: 'og:url', content: 'https://builtbymiguel.com/audit' },
      { property: 'og:image', content: 'https://builtbymiguel.com/og-image.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: 'https://builtbymiguel.com/og-image.png' },
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
    primaryGoal: 'Google Map Pack Top 3',
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
    <div className="space-y-16 sm:space-y-24 py-6 sm:py-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <Sparkles className="w-3.5 h-3.5" /> 100% Free · 24-Hour Turnaround
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
          Get Your Free{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Local Visibility Audit
          </span>
        </h1>
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          I will record a personalized 5-minute video breakdown analyzing your Google Map Pack ranking, mobile speed, and competitor gaps.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 space-y-6 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="audit-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Your Full Name <span className="text-emerald-400">*</span>
              </label>
              <input
                id="audit-name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Miguel Sanchez"
                className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-white placeholder-slate-500 text-sm focus:outline-none transition-colors ${
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

            <div className="space-y-1.5">
              <label htmlFor="audit-biz" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Business Name <span className="text-emerald-400">*</span>
              </label>
              <input
                id="audit-biz"
                type="text"
                required
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                placeholder="e.g. Austin Elite Roofing"
                className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-white placeholder-slate-500 text-sm focus:outline-none transition-colors ${
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

            <div className="space-y-1.5">
              <label htmlFor="audit-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Work Email Address <span className="text-emerald-400">*</span>
              </label>
              <input
                id="audit-email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@company.com"
                className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-white placeholder-slate-500 text-sm focus:outline-none transition-colors ${
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

            <div className="space-y-1.5">
              <label htmlFor="audit-city" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Primary Service City / Area <span className="text-emerald-400">*</span>
              </label>
              <input
                id="audit-city"
                type="text"
                required
                value={formData.cityArea}
                onChange={(e) => setFormData({ ...formData, cityArea: e.target.value })}
                placeholder="e.g. Austin, TX & surrounding suburbs"
                className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-white placeholder-slate-500 text-sm focus:outline-none transition-colors ${
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

            <div className="space-y-1.5">
              <label htmlFor="audit-web" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Website URL <span className="text-slate-500 font-normal lowercase">(optional)</span>
              </label>
              <input
                id="audit-web"
                type="url"
                value={formData.websiteUrl}
                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                placeholder="https://www.yourbusiness.com"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="audit-goal" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Primary Growth Priority
              </label>
              <select
                id="audit-goal"
                value={formData.primaryGoal}
                onChange={(e) => setFormData({ ...formData, primaryGoal: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              >
                <option value="Google Map Pack Top 3">Google Map Pack Top 3 Dominance</option>
                <option value="Faster Website & Higher Conversions">Faster Website & Higher Conversions</option>
                <option value="Automated CRM & Operations">Automated CRM & Operations</option>
                <option value="Full Comprehensive Growth Stack">Full Comprehensive Growth Stack</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-base text-slate-950 bg-emerald-500 hover:bg-emerald-400 shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-75"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Verifying & Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 fill-slate-950" />
                    <span>Send Me the Free Video Audit</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-center text-[11px] text-slate-500">
              No sales pitch. 100% confidential. Delivered straight to your inbox within 24 hours.
            </p>
          </form>
        </div>

        {/* Proof / Value Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 space-y-5">
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              <Search className="w-5 h-5 text-emerald-400" />
              What's inside your video audit?
            </h3>

            <ul className="space-y-3.5 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">Geo-Grid Ranking Heatmap:</strong> See exactly where you rank block-by-block in your city.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">Competitor Gap Analysis:</strong> Why competitors above you are getting the calls.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">Mobile Speed & Core Web Vitals:</strong> Real load test diagnostics on 4G networks.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">Action Plan:</strong> 3 immediate fixes you can implement right away.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-semibold">
              <Clock className="w-4 h-4" /> 24-Hour Guarantee
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every audit is manually recorded by Miguel using live search diagnostics—never an automated template.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
