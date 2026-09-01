import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  Mail,
  Clock,
  MapPin,
  Send,
  MessageSquare,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react'
import { useState } from 'react'
import { submitContactLead } from '../server/leads'

export const Route = createFileRoute('/contact')({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      {
        title: 'Contact Miguel | Direct Inquiries & Project Discovery',
      },
      {
        name: 'description',
        content:
          'Get in touch directly with Miguel to discuss Local SEO, high-speed custom websites, or operational business automation. 24-hour response guaranteed.',
      },
      {
        name: 'keywords',
        content:
          'contact miguel, hire local seo specialist, custom website inquiry, small business automation consultation',
      },
      // OpenGraph
      { property: 'og:type', content: 'website' },
      {
        property: 'og:title',
        content: 'Contact & Project Inquiries | Built by Miguel',
      },
      {
        property: 'og:description',
        content:
          'Discuss your website, local search rankings, or automation stack directly with Miguel.',
      },
      { property: 'og:url', content: 'https://builtbymiguel.com/contact' },
      { property: 'og:image', content: 'https://builtbymiguel.com/og-image.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: 'https://builtbymiguel.com/og-image.png' },
    ],
  }),
  component: ContactPage,
})

function ContactPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    serviceInterest: 'Local SEO',
    message: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    const result = await submitContactLead(formData)

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
          <MessageSquare className="w-3.5 h-3.5" /> Direct Inquiries · 24-Hour Response
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
          Let’s Build Something{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            High-Performing.
          </span>
        </h1>
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Have a project in mind, need to dominate local search, or want to automate your client intake? Send a note below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Form */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 space-y-6 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="contact-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Your Name <span className="text-emerald-400">*</span>
                </label>
                <input
                  id="contact-name"
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
                <label htmlFor="contact-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Email Address <span className="text-emerald-400">*</span>
                </label>
                <input
                  id="contact-email"
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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="contact-phone" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Phone Number
                </label>
                <input
                  id="contact-phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(512) 555-0199"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contact-biz" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Business Name
                </label>
                <input
                  id="contact-biz"
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  placeholder="Sanchez Services LLC"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="contact-service" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Service Area of Interest <span className="text-emerald-400">*</span>
              </label>
              <select
                id="contact-service"
                value={formData.serviceInterest}
                onChange={(e) => setFormData({ ...formData, serviceInterest: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              >
                <option value="Local SEO">Local SEO (Map Pack & AI Citations)</option>
                <option value="Website Rebuild">Website Rebuild (Sub-Second React & Care)</option>
                <option value="Custom System">Custom System (CRM, Onboarding & Workflows)</option>
                <option value="Other">Other / Comprehensive Package</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="contact-msg" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Project Details / Message <span className="text-emerald-400">*</span>
              </label>
              <textarea
                id="contact-msg"
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell me a bit about your current bottlenecks, target service locations, or goals..."
                className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-white placeholder-slate-500 text-sm focus:outline-none transition-colors resize-none ${
                  errors.message
                    ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                    : 'border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                }`}
              />
              {errors.message && (
                <p className="text-xs text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.message}</span>
                </p>
              )}
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
                    <span>Verifying & Sending Message...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 fill-slate-950" />
                    <span>Send Message Directly</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Direct Info Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 space-y-6">
            <h3 className="font-bold text-white text-lg">Direct Details</h3>

            <div className="space-y-4 text-xs sm:text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-emerald-400 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-white">Direct Email</div>
                  <a href="mailto:hello@builtbymiguel.com" className="text-slate-400 hover:text-emerald-400 transition-colors">
                    hello@builtbymiguel.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-cyan-400 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-white">Response Guarantee</div>
                  <p className="text-slate-400">Within 24 business hours</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-indigo-400 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-white">Service Area</div>
                  <p className="text-slate-400">United States (Nationwide Clients)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-semibold">
              <ShieldCheck className="w-4 h-4" /> Zero Spam Guarantee
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your inquiry goes directly to Miguel's personal inbox. No offshore sales reps, no cold call lists.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
